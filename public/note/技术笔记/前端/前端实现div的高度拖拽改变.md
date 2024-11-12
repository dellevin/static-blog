实现代码

## html

```vue
        <div class="contactPerson_bottom_div" id="fuDiv">
            <div class="dragDiv" @mousedown="dragEagle" >
                    <el-icon><SemiSelect /></el-icon>
            </div>
         </div>

```

## script

```javascript
dragEagle(e) {
            var targetDiv = document.getElementById('fuDiv');
            //得到点击时该地图容器的宽高：
            var targetDivHeight = targetDiv.offsetHeight;
            var startX = e.clientX;
            var startY = e.clientY;
            document.onmousemove = function (e) {
                e.preventDefault();
                //得到鼠标拖动的宽高距离：取绝对值
                var distY = Math.abs(e.clientY - startY);

                //往上方拖动：
                if (e.clientY < startY) {
                    targetDiv.style.height = (targetDivHeight + distY) + 'px';
                }

                //往下方拖动：
                if (e.clientX < startX && e.clientY > startY) {
                    targetDiv.style.height = targetDivHeight - distY + 'px';
                }

                if (parseInt(targetDiv.style.height) >= 800) {
                    targetDiv.style.height = 800 + 'px';
                }
                if (parseInt(targetDiv.style.height) <= 320) {
                    targetDiv.style.height = 320 + 'px';
                }
            }
            document.onmouseup = function () {
                document.onmousemove = null;
            }
        },
```

## css

```css
.contactPerson_bottom_div {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-style: solid;
    border-color: black;
    background: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    z-index: 99;
    height: 320px;
    overflow-y: auto;/* 允许垂直滚动 */
}
.dragDiv{
 	height:10px;
    display: flex; 
    align-items: center; 
    justify-content: center;   
}
.dragDiv:hover {
    /* background-color: #666; */
    cursor: pointer;/* 在hover的时候，鼠标指针变成手 */
}
```



首先针对需要设置的div添加一个id，再通过getElementById获取到目标div。

然后在内部添加一个div，可以设置成自己想要的形式，做明显的标记使用。针对这个div设置操作活动@mousedown。也就是当鼠标按下去的时候调用此dragEagle方法，在此之前一定要传入对象参数e。

`var targetDivHeight = targetDiv.offsetHeight;`: 这行代码获取了目标 `div` 元素的当前高度，并将其存储在 `targetDivHeight` 变量中。

`var startX = e.clientX;` 和 `var startY = e.clientY;`: 这两行代码分别记录了鼠标点击位置的横坐标（X坐标）和纵坐标（Y坐标），用于后续计算鼠标拖动的距离。

`document.onmousemove = function (e) { ... }`: 这是一个鼠标移动事件处理程序，当用户按住鼠标左键并移动时，会触发这个事件处理程序。在这个处理程序中，计算了鼠标拖动的距离，并根据拖动的方向来改变目标 `div` 元素的高度。

- `e.preventDefault();`: 这一行代码用于防止浏览器默认的拖拽行为，确保我们自己的逻辑生效。
- 通过比较鼠标当前的 `e.clientY` 和初始点击时的 `startY` 来计算垂直方向上的拖动距离 `distY`。
- 接下来的条件判断分别处理向上拖动和向下拖动的情况。如果鼠标向上拖动，就增加目标 `div` 的高度，如果鼠标向下拖动，就减小目标 `div` 的高度。这样可以实现调整高度的效果。
- 最后的两个条件判断用于限制目标 `div` 的最小和最大高度，以避免高度超出一定范围

`document.onmouseup = function () { ... }`: 这是鼠标释放事件处理程序，在鼠标左键释放时触发。它用于清除鼠标移动事件处理程序，即当鼠标释放后停止拖动。



在这之中
```js
                if (parseInt(targetDiv.style.height) >= 800) {
                    targetDiv.style.height = 800 + 'px';
                }
                if (parseInt(targetDiv.style.height) <= 320) {
                    targetDiv.style.height = 320 + 'px';
                }
```

这一段是限制div拖动的最大高度和最小高度

