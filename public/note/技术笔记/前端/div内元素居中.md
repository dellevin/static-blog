![这里写图片描述](https://raw.githubusercontent.com/dellevin/BlogImgs/main/picGoUpload/SouthEast.webp)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>flex</title>
		<style>
			.container{
				width: 100%;
				height: 350px;
				background-color: aqua;
				display: flex;/*设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效*/
				display: -webkit-flex; /* Safari */
				flex-direction: column;/*容器内项目的排列方向(默认横向排列 row)*/
				flex-wrap: nowrap;/*容器内项目换行方式*/
				justify-content: center;/*项目在主轴上的对齐方式*/
				align-items: center;/*项目在交叉轴上如何对齐*/
				align-content: center;/*定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用*/
			}
			.item{
				width: 80px;
				height: 50px;
				margin: 5px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="item" style="background-color: antiquewhite;"></div>
			<div class="item" style="background-color: burlywood;"></div>
			<div class="item" style="background-color: cornflowerblue;"></div>
		</div>
	</body>
</html>
```