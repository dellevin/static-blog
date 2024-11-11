其实这个有很多办法可以实现。

利用office的在线预览，vue的依赖，转换成pdf进行预览。三个办法我都试了。微软官方的office在线预览的话需要一个公网ip，同时有的时候还需要你科学上网，这个直接寄。

**word官方预览链接（支持三种格式，部分word带特殊符号或流程图无法显示）**

```text
      const routeUrl = file.url; // 文件路径
      const url = encodeURIComponent(routeUrl);
      const officeUrl = "https://view.xdocin.com/view?src=" + url;
```

​	**office官方预览（pdf不能展示）**

```text
let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src='+url
```

vue的依赖的话，GitHub上搜索一下会有很多。vue-office这个项目很棒，可惜我引入包和标签的时候会报错，人家用的是js，而我用的是ts，这个也pass了。这个是项目地址，非常棒的一个项目，可以参考学习一下：https://github.com/501351981/vue-office

到最后，还要回到word转换成office的破办法，这是我最难接受的一个，用的人一多，后端压力就大了，万一流量上来了，服务器直接开摆，笑死。但是实在是没办法了，退退退而求其次，只能这样了。主要思路是前端把文件id获取到，去数据库搜索到存放word的url地址，后端通过url地址把doc文档转换成输入流，然后通过输出流存放到一个专属的pdf文件夹，再把这个pdf生成链接给前端，前端显示的话就用这一个链接进行显示。

**前端代码**

```vue
<template>
  <el-dialog v-model="visible" :title="$t('文件预览')" :close-on-click-modal="false" :close-on-press-escape="false">
    <div v-if="fileMessage.fileType == 'jpg' ||
      fileMessage.fileType == 'png' ||
      fileMessage.fileType == 'ico' ||
      fileMessage.fileType == 'gif' ||
      fileMessage.fileType == 'webp' 
      ">
      <el-image style="width: 100%" :src="fileMessage.getFilePath"> </el-image>
    </div>
    <div v-else-if="fileMessage.fileType == 'docx' || fileMessage.fileType == 'doc'">
      <embed :src="result.url" style="width: 100%; height: 600px" />
      <!-- <h2 style="text-align: center;color: brown; ">暂不支持doc、docx格式！</h2> -->
    </div>
    <div v-else-if="fileMessage.fileType == 'xlsx' || fileMessage.fileType == 'xls'">
      <h2 style="text-align: center;color: brown; ">暂不支持该xlsx、xls格式！</h2>
    </div>
    <div v-else-if="fileMessage.fileType == 'pdf'">
      <embed :src="fileMessage.getFilePath" style="width: 100%; height: 600px" />
    </div>
    <div v-else>
      <h2 style="text-align: center;color: brown; ">暂不支持该文件格式！</h2>
    </div>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("退出预览") }}</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const dataFormRef = ref();

const fileMessage = reactive({
  getFilePath: "",
  fileType: ""
});

const dataForm = reactive({
  uploadFileId: "",
  uploadCompanyName: "",
  uploadFileName: "",
  uploadFilePath: "",
  uploadUserName: "",
  uploadFileTime: "",
});

const init = (uploadFileId?: number) => {
  visible.value = true;
  dataForm.uploadFileId = "";

  //重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (uploadFileId) {
    getInfo(uploadFileId);
  }
};

const result = reactive({
  url: "",
  msg: ""
});
//var showType: string;
// 获取信息
const getInfo = (uploadFileId: number) => {
  baseService.get("/uploadFile/xyjqfileupload/" + uploadFileId).then((res) => {
    Object.assign(dataForm, res.data);
    if (dataForm.uploadFilePath != "") {
      fileMessage.getFilePath = dataForm.uploadFilePath; //获取到图片的路径，写在这里面才管用，写在外面，第一次请求时候没有数据
      //console.log(getFilePath.substring(getFilePath.lastIndexOf(".") + 1, getFilePath.length));
      //console.log(getFilePath);
      fileMessage.fileType = fileMessage.getFilePath.substring(fileMessage.getFilePath.lastIndexOf(".") + 1, fileMessage.getFilePath.length);
      //showType = fileType;
      console.log("文件类型：" + fileMessage.fileType);
      console.log(fileMessage.getFilePath);
      if (fileMessage.fileType == "doc" || fileMessage.fileType == "docx") {
        baseService
          .post(`/uploadFile/xyjqfileupload/pdfUrl/${uploadFileId}`)
          .then((res) => {
            if (res.code === 0) {
              result.url = res.data;
              console.log(res.data);
            } else {
              ElMessage.error(res.msg);
              result.msg = res.msg;
            }
          })
          .catch((err) => {
            ElMessage.error(err.message);
          });
      }
    } else {
      ElMessage.error("链接地址为空，无法打开");
    }
  });
};

defineExpose({
  init
});
</script>

```

**主要核心代码是这里**

```javascript
// 获取信息
const getInfo = (uploadFileId: number) => {
  baseService.get("/uploadFile/xyjqfileupload/" + uploadFileId).then((res) => {
    Object.assign(dataForm, res.data);
    if (dataForm.uploadFilePath != "") {
      fileMessage.getFilePath = dataForm.uploadFilePath; //获取到图片的路径，写在这里面才管用，写在外面，第一次请求时候没有数据
      //console.log(getFilePath.substring(getFilePath.lastIndexOf(".") + 1, getFilePath.length));
      //console.log(getFilePath);
      fileMessage.fileType = fileMessage.getFilePath.substring(fileMessage.getFilePath.lastIndexOf(".") + 1, fileMessage.getFilePath.length);
      //showType = fileType;
      console.log("文件类型：" + fileMessage.fileType);
      console.log(fileMessage.getFilePath);
      if (fileMessage.fileType == "doc" || fileMessage.fileType == "docx") {
        baseService
          .post(`/uploadFile/xyjqfileupload/pdfUrl/${uploadFileId}`)
          .then((res) => {
            if (res.code === 0) {
              result.url = res.data;
              console.log(res.data);
            } else {
              ElMessage.error(res.msg);
              result.msg = res.msg;
            }
          })
          .catch((err) => {
            ElMessage.error(err.message);
          });
      }
    } else {
      ElMessage.error("链接地址为空，无法打开");
    }
  });
};
```

主要就是获取到文件之后看看文件后缀，欸！是doc或者docx格式的，那就继续post后端，把文件id发过去，这样后端就能通过id在数据库里面找到文件的在线链接。然后进行下载解析word。

**后端部分代码**

```java
    @PostMapping("/pdfUrl/{fileId}")
    @ApiOperation("WORD转换PdF")
    @LogOperation("WORD转换pdf")
    public Result  wordToPdf(@PathVariable("fileId") String fileId) throws Exception {
        XyjqFileUploadEntity xyjqFileUploadEntity = xyjqFileUploadService.selectById(fileId);
        //获取到url地址
        String url = xyjqFileUploadEntity.getUploadFilePath();
        //给新保存的文件起一个新的名字
        String strFileNameAndPoint = url.substring(url.lastIndexOf("/")+1);
        String newFileName =  strFileNameAndPoint.substring(0,strFileNameAndPoint.lastIndexOf("."))+"_pdf.pdf";
        System.out.println(newFileName);
        String paths = "D:\\Archive\\Desktop\\uploadFile\\WordToPdf\\"+newFileName;
        //先提前构建一个生成的pdf保存路径
        File outputFile = new File(paths);

        //先把获取到的文件转换成输入流的模式
        URL receiveUrl = new URL(url);
        HttpURLConnection conn = (HttpURLConnection)receiveUrl.openConnection();
        //设置超时间为3秒
        conn.setConnectTimeout(3*1000);
        //将传输过来的doc文件转换成流
        InputStream docxInputStream = conn.getInputStream();
        try  {
            OutputStream outputStream = new FileOutputStream(outputFile);
            IConverter converter = LocalConverter.builder().build();
            converter.
                    convert(docxInputStream).as(DocumentType.DOCX).//作为doc格式
                    to(outputStream).as(DocumentType.PDF).
                    execute();
            outputStream.close();
            System.out.println("Word To Pdf 转换完成");
        } catch (Exception e) {
            e.printStackTrace();
        }

        //将file格式转换成MultipartFile格式
        File file = new File(paths);
        MultipartFile cMultiFile = getMultipartFile(file);
        //获取到新的url返还给前端进行预览
        String newUrl = OSSFactory.build().uploadSuffix(cMultiFile.getBytes(), "pdf");
        System.out.println(newUrl);
        return new Result().ok(newUrl);
    }
    public static MultipartFile getMultipartFile(File file) {
        DiskFileItem item = new DiskFileItem("file"
                , MediaType.MULTIPART_FORM_DATA_VALUE
                , true
                , file.getName()
                , (int)file.length()
                , file.getParentFile());
        try {
            OutputStream os = item.getOutputStream();
            os.write(FileUtils.readFileToByteArray(file));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new CommonsMultipartFile(item);
    }
```



我开始是想传输url的，但是post之后，发现失败，原来前端不承认这样的链接啊，我也是太天真了，所以只能这么做了。

哦对，还需要引入两个依赖

```xml
		<!-- 转换成PDF-->
		<dependency>
			<groupId>com.documents4j</groupId>
			<artifactId>documents4j-local</artifactId>
			<version>1.0.3</version>
		</dependency>
		<dependency>
			<groupId>com.documents4j</groupId>
			<artifactId>documents4j-transformer-msoffice-word</artifactId>
			<version>1.0.3</version>
		</dependency>
```

基本情况是这个样子，中间还少了一些判断，比如第二次打开的时候，这个链接其实以及生成一个pdf了，再次预览的话，又要生成一个一样的就覆盖了，实在是太占用资源了，还不如去mysql里面做个表去保存这个生成的预览pdf链接，然后直接返还，这样就能再一定程度节省服务器资源了。目前没写主要是太困了，我需要睡觉了。。。想起来再写吧。