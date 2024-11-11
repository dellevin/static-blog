最近领导要求我带一带他手下的研究生，课题是关于`DAIL-SQL`这个开源模型调试的。研究生说他已经完成了项目的搭建和gpt模型的调试。接下来要改成百度千帆的模型，却遇到了难题。

其实很简单，根据项目的框架走就可以了。正常部署环境过后（再次会遇到依赖安装不上，版本不匹配等诸多问题，按照报错排错修改即可）。根据readme生成数据模型之后。接下来就该调试ask_llm.py这一步开始了正式的模型修改了。

首先更改一下init方式

```python
# 初始化百度千帆的api
    init_qianfan(args.QIANFAN_ACCESS_KEY, args.QIANFAN_SECRET_KEY, args.model)
```

然后查看到init方法是自己写的chatgpt的接口解析，我们就需要模仿人家的写法写一个百度千帆的，根据ERNIE_Speed_128K接口模型进行调试更改

https://cloud.baidu.com/doc/WENXINWORKSHOP/s/6ltgkzya5

之后得出了如下的脚本qianfan.py

```python
import json.decoder

import qianfan
import os
from utils.enums import LLM
import time



def init_qianfan(QIANFAN_ACCESS_KEY, QIANFAN_SECRET_KEY,model):
    os.environ["QIANFAN_ACCESS_KEY"] = QIANFAN_ACCESS_KEY
    os.environ["QIANFAN_SECRET_KEY"] = QIANFAN_SECRET_KEY

# def init_qianfan(QIANFAN_ACCESS_KEY, QIANFAN_SECRET_KEY, model):
#     qianfan.AccessKey(QIANFAN_ACCESS_KEY)
#     qianfan.SecretKey(QIANFAN_SECRET_KEY)
    # os.environ["QIANFAN_ACCESS_KEY"] = QIANFAN_ACCESS_KEY
    # os.environ["QIANFAN_SECRET_KEY"] = QIANFAN_SECRET_KEY


# 处理单轮对话的completion任务
def ask_completion(model, batch, temperature):
    completion = qianfan.Completion()
    response = completion.do(
        model=model,
        prompt=batch,  # 这是当前问题
        temperature=temperature,
        max_output_tokens=200,  # 最大输出token数量，根据需要调整
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=[";"]
    )
    # 提取response中的结果部分
    response_clean = [response["result"]]
    return dict(
        response=response_clean,
        prompt_tokens=response["usage"]["prompt_tokens"],
        completion_tokens=response["usage"]["completion_tokens"],
        total_tokens=response["usage"]["total_tokens"]
    )


# 处理多轮对话的任务
def ask_chat(model, messages: list, temperature, n):
    chat_completion = qianfan.ChatCompletion()
    response = chat_completion.do(
        model=model,
        messages=messages,  # messages 是带有历史对话的消息列表
        temperature=temperature,
        max_output_tokens=200  # 最大输出token数量，根据需要调整
    )
    # 提取返回的消息内容
    response_clean = [response["result"]]
    if n == 1:
        response_clean = response_clean[0]
    return dict(
        response=response_clean,
        prompt_tokens=response["usage"]["prompt_tokens"],
        completion_tokens=response["usage"]["completion_tokens"],
        total_tokens=response["usage"]["total_tokens"]
    )



# 调用对话请i去函数，p判断ask_completion/ask_chat
def ask_llm(model: str, batch: list, temperature: float, n: int):
    n_repeat = 0
    while True:
        try:
            if model in LLM.TASK_COMPLETIONS:  # completion任务
                assert n == 1
                response = ask_completion(model, batch, temperature)
            elif model in LLM.TASK_CHAT:  # chat任务
                assert len(batch) == 1, "batch must be 1 in this mode"
                messages = [{"role": "user", "content": batch[0]}]
                response = ask_chat(model, messages, temperature, n)
                response['response'] = [response['response']]
            break
        except json.decoder.JSONDecodeError:
            n_repeat += 1
            print(f"Repeat for the {n_repeat} times for JSONDecodeError", end="\n")
            time.sleep(1)
            continue
        except Exception as e:
            n_repeat += 1
            print(f"Repeat for the {n_repeat} times for exception: {e}", end="\n")
            time.sleep(1)
            continue

    return response
```

接下来你如果运行会发现在ask_llm的时候异常会报错，这是因为异常不匹配，我没有细察qianfan的异常有那些，就直接抛出Exception

```python
 try:
                res = ask_llm(args.model, batch, args.temperature, args.n)
            except Exception as e:
                print(f"The {i}-th question has too much tokens! Return \"SELECT\" instead")
                # res = ""
                res = {"response": [""], "total_tokens": 0}
```

因为二者模型不一样，还需要对结果集进行数据的搜集更改，我这里没做处理，其实只需要一个简单的正则表达式就可以,在如下更改就可以了。

```python
                for sqls, db_id in zip(res["response"], cur_db_ids):
                    processed_sqls = []
                    for sql in sqls:
                        sql = " ".join(sql.replace("\n", " ").split())
                        sql = process_duplication(sql)
                        if sql.startswith("SELECT"):
                            pass
                        elif sql.startswith(" "):
                            sql = "SELECT" + sql
                        else:
                            sql = "SELECT " + sql
                        processed_sqls.append(sql)
```

由于我没做更改，只得在后续生成的文件中进行数据提取，采用如下方法

```python
def extract_sql(content):
    # 匹配```sql开头 ```结尾
    pattern = r'```sql(.*?)```'
    sql_blocks = re.findall(pattern, content, re.DOTALL)
    sql_statements = []

    for sql in sql_blocks:
        cleaned_sql = " ".join(sql.split()) 
        sql_statements.append(cleaned_sql)

    return sql_statements
```



同时还需要再enmus脚本中添加对应的模型来识别

```python

class LLM:
    # openai LLMs
    TEXT_DAVINCI_003 = "text-davinci-003"
    CODE_DAVINCI_002 = "code-davinci-002"
    GPT_35_TURBO = "gpt-3.5-turbo"
    GPT_35_TURBO_0613 = "gpt-3.5-turbo-0613"
    GPT_35_TURBO_16K = "gpt-3.5-turbo-16k"
    GPT_35_TURBO_0301 = "gpt-3.5-turbo-0301"
    GPT_4 = "gpt-4"
    ERNIE_Speed_128K = 'ERNIE-Speed-128K'

    # LLMs that use openai completion api
    TASK_COMPLETIONS = [
        TEXT_DAVINCI_003,
        CODE_DAVINCI_002
    ]

    # LLMs that use openai chat api
    TASK_CHAT = [
        GPT_35_TURBO,
        GPT_35_TURBO_0613,
        GPT_35_TURBO_16K,
        GPT_35_TURBO_0301,
        GPT_4,
        ERNIE_Speed_128K
    ]
```

脚本ask_llm输入的命令行修改为类似如下的方式

```python
    parser = argparse.ArgumentParser()
    parser.add_argument("--question", type=str)
    parser.add_argument("--QIANFAN_ACCESS_KEY", type=str)
    parser.add_argument("--QIANFAN_SECRET_KEY", type=str)
    # parser.add_argument("--openai_api_key", type=str)
    # parser.add_argument("--openai_group_id", type=str, default="org-ktBefi7n9aK7sZjwc2R9G1Wo")
    parser.add_argument("--model", type=str, choices=[LLM.TEXT_DAVINCI_003, 
                                                      LLM.GPT_35_TURBO,
                                                      LLM.GPT_35_TURBO_0613,
                                                      # LLM.TONG_YI_QIAN_WEN,
                                                      LLM.GPT_35_TURBO_16K,
                                                      LLM.GPT_4,
                                                      LLM.ERNIE_Speed_128K],
                        default=LLM.ERNIE_Speed_128K)
    parser.add_argument("--start_index", type=int, default=0)
    parser.add_argument("--end_index", type=int, default=1000000)
    parser.add_argument("--temperature", type=float, default=0) # qianfan  (0, 1.0]
    parser.add_argument("--mini_index_path", type=str, default="")
    parser.add_argument("--batch_size", type=int, default=1)
    parser.add_argument("--n", type=int, default=5, help="Size of self-consistent set")
    parser.add_argument("--db_dir", type=str, default="dataset/spider/database")
```

注意千帆的temperature是 (0, 1.0]和gpt的还不一样

至此已经完全修改完毕。