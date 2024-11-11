在百度的时候，发现CSDN是真滴丑陋，现有的油猴脚本更改的并不如我所愿。而且CSDN的弹出搜索评论笔记这三个框框让我很不喜欢，所以想办法去除。

![image-20230504185928783](./assets/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96csdn/image-20230504185928783.png)

经过实践发现，这三个按钮，也可以说是链接，因为他的表现形式是`<a>`标签。他的总的class标签是`articleSearchTip`这个标签，但是把通过测试发现，只有你在选中的时候，这标签才会出现，补选中的这个标签就不会显示，可以理解为vue中的v-if标签。这倒是让人很头疼呢。

所以我们要做个鼠标监听的动作也就是mouseup在鼠标抬起的时候进行监听，这个标签是否出现。然后再删除评论和笔记这俩带有类标签名字的标签。

接下来的步骤就是针对搜索进行一定的优化`var txt = window.getSelection();`在这里

`window.getSelection()`的作用就是从你鼠标选择的那些东西，拿上面图片举例子的话就是“需要使用java”这个数据。

然后利用`setAttribute`进行跳转搜索

---

整体的油猴代码就是这个样子的

```javascript
// ==UserScript==
// @name         自用csdn优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       DelLevin
// @description  个人自用，选中弹出优化
// @connect      www.csdn.net
// @match        *://*.csdn.net/*
// @match        *://*.51cto.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license MIT
// ==/UserScript==
//this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
//51cto的脚本

//CSDN的脚本
    function removeACdiv()
    {
      var txt = window.getSelection();
      if(txt.toString()!=""){
            if(document.getElementsByClassName("article-search")[0]){
            $(".article-comment").remove();
            $(".cnote").remove();
            txt="https://www.baidu.com/s?wd="+txt;
            document.getElementsByClassName("article-search")[0].setAttribute("href",txt);
            clearInterval(removeACdiv);
        }else{
            setTimeout(removeACdiv,50);
        }
      }
    }
    //松开鼠标出发动作  https://developer.aliyun.com/article/443201
    $('.baidu_pl').mouseup(removeACdiv);
   $(".option-box").remove();
   //顶部搜索框中间
    var toolbar_menus = document.getElementsByClassName("toolbar-menus");
    //console.log(toolbar_menus[0]);
    for(var m=0;m<toolbar_menus.length;m++){
     if (toolbar_menus[m] != null)
           toolbar_menus[m].parentNode.removeChild(toolbar_menus[m]);
 }
    //顶部搜索框
    var toolbar_search_container = document.getElementsByClassName("toolbar-search-container");
    for(var i=0;i<toolbar_search_container.length;i++){
     if (toolbar_search_container[i] != null)
           toolbar_search_container[i].parentNode.removeChild(toolbar_search_container[i]);
 }
    //顶部搜索框右边
    var toolbar_btns = document.getElementsByClassName("toolbar-btns");
    for(var j=0;j<toolbar_btns.length;j++){
     if (toolbar_btns[j] != null)
           toolbar_btns[j].parentNode.removeChild(toolbar_btns[j]);
 }
    //下面的分享这一行框框
    var left_toolbox = document.getElementsByClassName("left-toolbox");
    for(var k=0;k<left_toolbox.length;k++){
     if (left_toolbox[k] != null)
           left_toolbox[k].parentNode.removeChild(left_toolbox[k]);
 }

})();
```

显示方式是这样的（缺点是，字符少的时候他就不起作用了，因为主要判断方式是判断字符是否存在，我也不知道是什么毛病，欸。。。。）

![image-20230504191243205](./assets/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96csdn/image-20230504191243205.png)

然后删除了上面搜索栏那些东西

![image-20230504191444758](./assets/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96csdn/image-20230504191444758.png)

主要用到了这些：

**jq的选择器：**

https://www.runoob.com/jquery/jquery-ref-selectors.html

这个是个关键点，因为需要监听这个类标签内的选中文本的内容，所以  `$('.baidu_pl').mouseup(removeACdiv);`要这么写

**参考文章（没用，但是学到了）**

https://www.jianshu.com/p/760079b716e7