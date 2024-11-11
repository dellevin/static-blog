`== `用于比较两者是否相等，忽略数据类型。

`=== `用于更严谨的比较，值和值的数据类型都需要同时比较。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<script src="vue.js" type="text/javascript" charset="utf-8"></script>
<body>
    <div id="app">
        <div v-if="text ==1 ">
            1--值一样，类型不同，两个等号显示 
        </div>
        <div v-if="text ===1 ">
            2--值一样，类型不同，三个等号不显示
        </div>
        <div v-if="text ==='1' ">
            3--值一样，类型同，三个等号显示
        </div>
    </div>
    <script type="text/javascript">
        /* text:"1" 这里的1是个字符串  */
        var vm = new Vue({
            el:"#app",
            data:{
                text:"1"
            }
        });
    </script>
</body>
</html>
```

显示：

```bash
 1--值一样，类型不同，两个等号显示 
 3--值一样，类型同，三个等号显示
```



