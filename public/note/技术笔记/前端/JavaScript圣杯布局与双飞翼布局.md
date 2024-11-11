参考：https://juejin.cn/post/6973562604581027853

**圣杯布局**是通过`float`搭建布局+`margin`使三列布局到一行上+`relative`相对定位调整位置。

**双飞翼布局**是通过`float`+`margin`，**没有使用相对定位**。

![ss](./assets/JavaScript%E5%9C%A3%E6%9D%AF%E5%B8%83%E5%B1%80%E4%B8%8E%E5%8F%8C%E9%A3%9E%E7%BF%BC%E5%B8%83%E5%B1%80/2022080416035961.png)

## 圣杯布局

```javascript
<style>
  * {
      padding: 0;
      margin: 0;
      text-align: center;
  }
  html{
      height: 100%;
  }
  body{
      display: flex;
      flex-direction: column;
      height: 100%;;
  }
  .header{
      width: 100%;
      height: 50px;
      background-color:dimgray;
  }
  .footer{
      width: 100%;
      height: 50px;
      background-color:dimgray;
  }
  .outer{
      flex:1;
      padding-left: 100px;
      padding-right: 200px;
  }
  .center{
      float: left;
      background-color: darkslateblue;
      height: 100%;
      width: 100%;
  }
  .left{
      float: left;
      width: 100px;
      margin-left: -100%;
      background-color: burlywood;
      height: 100%;
      position: relative;
      left: -100px;
  }
  .right{
      float: left;
      width: 200px;
      margin-left: -200px;
      height: 100%;
      position: relative;
      right: -200px;
      background-color: cyan;
  }
</style>
<body>
    <div class="header">header</div>
    <div class="outer">
        <div class="center">center</div>
        <div class="left">left</div>
        <div class="right">right</div>
    </div>
    <div class="footer">footer</div>
</body>
```

## 双飞翼布局

```javascript
<style>
    *{
        padding: 0;
        margin: 0;
    }
    html{
        width: 100%;
        height: 100%;
        text-align: center;
    }
    body{
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
    }
    .header{
        background-color:grey;
        height: 50px;
    }
    .footer{
        background-color:grey;
        height: 50px;
    }
    .outer{
        flex:1;
    }
    .center{
        float: left;
        width: 100%;
        background-color: darkslateblue;
        height: 100%;
    }
    .left{
        float: left;
        margin-left: -100%;
        width: 100px;
        background-color: burlywood;
        height: 100%;
    }
    .right{
        float: left;
        width: 200px;
        background-color: cyan;
        margin-left: -200px;
        height: 100%;
    }
    .content{
        margin-left: 100px;
        margin-right: 200px;
        height: 100%;
    }
</style>
<body>
    <div class="header">header</div>
    <div class="outer">
        <div class="center">
            <div class="content">content</div>
        </div>
        <div class="left">left</div>
        <div class="right">right</div>
    </div>
    <div class="footer">footer</div>
</body>
```

