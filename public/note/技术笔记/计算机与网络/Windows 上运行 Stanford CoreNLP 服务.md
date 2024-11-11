***\*在 Windows 上运行 Stanford CoreNLP 服务的\****

在 Windows 上运行 Stanford CoreNLP 服务的步骤如下：

### 1. **下载 Stanford CoreNLP**

- 访问 Stanford CoreNLP 的下载页面。
- 下载最新的 `stanford-corenlp-full` 压缩包文件。
- 解压该文件到一个合适的目录，例如 `C:\stanford-corenlp-full-2023-06-18`。

### 2. **启动 Stanford CoreNLP 服务器**

你可以通过命令行启动 CoreNLP 服务器，确保你已经安装并配置好了 Java 环境。

- 打开命令提示符（CMD），导航到解压的 CoreNLP 目录：

  ```
  cd C:\stanford-corenlp-full-2023-06-18
  ```

- 启动服务器：

  ```
  java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000
  ```

  这里，`-mx4g` 代表分配 4GB 内存给服务器，你可以根据实际需求调整此值。默认服务器会在 `http://localhost:9000` 运行。

### 3. **测试服务器**

- 在浏览器中访问 `http://localhost:9000`，查看是否服务器已经启动并运行。

或者你可以通过发送 HTTP 请求来测试，例如使用 `curl`:

```
curl --data 'The quick brown fox jumps over the lazy dog.' 'http://localhost:9000/?properties={"annotators":"tokenize,ssplit,pos,lemma,ner,parse,depparse","outputFormat":"json"}'
```

成功后，服务器会返回 NLP 分析结果。

### 4. **常见问题**

- 如果你遇到内存不足错误，可以尝试增加 `-mx` 后的内存值，比如 `-mx8g`。
- 服务器默认在 9000 端口运行。如果此端口被占用，你可以使用 `-port` 参数指定其他端口。

这样，就可以在 Windows 环境下运行 Stanford CoreNLP 服务了。



