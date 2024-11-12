今天在尽心数据传递的时候，在点击的时候，发现数据第一次会为空，但是控制台get到的数据时正常的，也就是说，赋值的时候能赋值上去，当时到了v-if判断的时候出现了小问题。

一开始时按照h5的逻辑来，我以为是script在标签后面，所以才后渲染，导致判断失误的。以为时vue渲染的时候先吧标签渲染，然后才开始渲染script，但是这样的情况时不合理的，如果后加载标签的话，那么显示的时候标签上的颜色标签应该是不上色的情况。所以这个思路时错误的。



代码大致的结构是这样的，之前的代码删了，大致情况时这个样子。

```vue
<template>
  <el-dialog v-model="visible" :title="$t('文件预览')" :close-on-click-modal="false" :close-on-press-escape="false">
    <div v-if="fileType == 'jpg' ||
      fileType == 'png' ||
      fileType == 'ico' ||
      fileType == 'gif' ||
      fileType == 'webp' 
      ">
      <el-image style="width: 100%" :src="getFilePath"> </el-image>
    </div>
    <div v-else-if="fileType == 'docx' || fileType == 'doc'">文档
      <embed :src="getFilePath" style="width: 100%; height: 600px" />
    </div>
    <div v-else-if="fileType == 'xlsx' || fileType == 'xls'">表格
      <embed :src="getFilePath" style="width: 100%; height: 600px" />
    </div>
    <div v-else-if="fileType == 'pdf'">
      <embed :src="getFilePath" style="width: 100%; height: 600px" />
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
var getFilePath = "";
var fileType = "";

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

//var showType: string;
// 获取信息
const getInfo = (uploadFileId: number) => {
  baseService.get("/uploadFile/xyjqfileupload/" + uploadFileId).then((res) => {
    Object.assign(dataForm, res.data);
    if (dataForm.uploadFilePath != "") {
      getFilePath = dataForm.uploadFilePath; //获取到图片的路径，写在这里面才管用，写在外面，第一次请求时候没有数据
      //获取文件的类型，取文件后缀名判断
      fileType = getFilePath.substring(getFilePath.lastIndexOf(".") + 1, getFilePath.length);
      console.log("文件类型：" + fileType);
      console.log(getFilePath);
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

代码大致时这个情况，后来发现主要原因出现在这两个赋值传递值的阶段

```html
var filetype="";
var getFilePath="";
```

不知道是不是vue的结构还是html的结构问题，主要脚本语言时时typescript，需要const定义一下属性进行赋值，才可以在第一次传递数据和判断数据的时候生效，也就是说要改成下面的这个情况。而且在ts中，var的作用区间并不是和js一样，我想大概是因为这个情况吧，才学没多久，希望有人能指出这个bug来。。。。

```html
const fileMessage = reactive({
  getFilePath: "",
  fileType: ""
});
```



这个是正确的结构：

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
    <div v-else-if="fileMessage.fileType == 'docx' || fileMessage.fileType == 'doc'">文档
      <embed :src="fileMessage.getFilePath" style="width: 100%; height: 600px" />
    </div>
    <div v-else-if="fileMessage.fileType == 'xlsx' || fileMessage.fileType == 'xls'">表格
      <embed :src="fileMessage.getFilePath" style="width: 100%; height: 600px" />
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
//var showType: string;
// 获取信息
const getInfo = (uploadFileId: number) => {
  baseService.get("/uploadFile/xyjqfileupload/" + uploadFileId).then((res) => {
    Object.assign(dataForm, res.data);
    if (dataForm.uploadFilePath != "") {
      fileMessage.getFilePath = dataForm.uploadFilePath; //获取到图片的路径，卸载这里面才管用，写在外面，第一次请求时候没有数据
      //console.log(getFilePath.substring(getFilePath.lastIndexOf(".") + 1, getFilePath.length));
      //console.log(getFilePath);
      fileMessage.fileType = fileMessage.getFilePath.substring(fileMessage.getFilePath.lastIndexOf(".") + 1, fileMessage.getFilePath.length);
      //showType = fileType;
      console.log("文件类型：" + fileMessage.fileType);
      console.log(fileMessage.getFilePath);


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

