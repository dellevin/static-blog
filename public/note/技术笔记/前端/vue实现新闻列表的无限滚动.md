这几天业务用到了这个，身为一个前端小白。。。垃圾的一批。百度的时候发现一个叫`vue-seamless-scroll`的组件，但是引入使用标签的适合前端会啥也不显示直接白花花的一大片。

百度的时候发现一个大佬已经通过js模拟那个组件实现了效果，特此记录下来。因为应用场景的问题，对他的代码稍做了些更改。

```vue
<template>
    <!-- 平台成果  -->
    <div class="platform-outcomes">

        <div class="imgTitle">
            <img src="../assets/img/news.png" alt="新闻png">
            <span>政策要闻</span>
        </div>
        <!-- 新闻展示div -->
        <div class="box">

            <div class="scroll_parent_box" @mouseenter="mEnter" @mouseleave="mLeave">
                <div class="scroll_list" :style="{ transform: `translate(0px,-${scrollTop}px)` }">

                    <div ref="scrollItemBox">

                        <div class="scroll_item" v-for="(item, index) in newsData" :key="index">

                            <div class="newsFont">
                                <img src="../assets/img/little_news.png" alt="新闻小图标">
                            </div>

                            <div class="newsMessage">
                                <a :href="item.sciUrl" target="_blank">
                                    <p v-bind:style="{ fontWeight: 'bold' }">
                                        {{ item.content }}
                                    </p>
                                </a>
                            </div>

                        </div>

                    </div>

                    <div v-html="copyHtml"></div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'


export default {
    data() {
        return {
            scrollTop: 0, //列表滚动高度
            speed: 50, //滚动的速度
            newsData: [
            //     {
            //     'content': '科创金融为科创企业注入金融“活水”',
            //     'sciUrl': 'https://finance.sina.com.cn/jjxw/2023-04-15/doc-imyqknmc2885203.shtml',
            // }, {
            //     'content': '工商银行 坚定不移推进高质量发展 在服务中国式现代化进程中展现新担当',
            //     'sciUrl': 'http://paper.people.com.cn/rmrb/html/2023-03/10/nw.D110000renmrb_20230310_1-12.htm',
            // }, {
            //     'content': '让科创企业股权“软实力”变融资“硬通货”',
            //     'sciUrl': 'http://www.ccb.com/cn/ccbtoday/newsv3/20230414_1681445103.html',
            // }, {
            //     'content': '建设高质量科创板，更好促进科技、资本和产业良性循环',
            //     'sciUrl': 'http://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20221122_5712368.shtml',
            // }, {
            //     'content': '国泰君安发布服务上海科创中心建设行动方案_中国经济网——国家经济门户',
            //     'sciUrl': 'http://finance.ce.cn/stock/gsgdbd/202305/06/t20230506_38533924.shtml.',
            // }, {
            //     'content': '中国人民银行营业管理部召开2023年第二季度新闻发布会',
            //     'sciUrl': 'https://finance.sina.com.cn/money/bank/bank_yhfg/2023-04-27/doc-imyrvnht4400317.shtml',
            // }, {
            //     'content': '中国农业银行联合多家机构成功举办2023科创金融论坛',
            //     'sciUrl': 'http://finance.people.com.cn/n1/2023/0426/c1004-32674304.html',
            // }, {
            //     'content': '中国科协启动“科创中国”金融伙伴计划- 社会综合',
            //     'sciUrl': 'https://www.chinanews.com.cn/sh/2023/02-20/9957121.shtml',
            // }, {
            //     'content': '2023济南科创金融论坛举行马建堂袁亚湘作主旨演讲袁炳忠刘强致辞',
            //     'sciUrl': 'http://jntzcjj.jinan.gov.cn/art/2023/4/15/art_88379_4775055.html',
            // }, {
            //     'content': '济南市政府门户网站新闻刘强会见出席2023济南科创金融论坛嘉宾',
            //     'sciUrl': 'http://www.jinan.gov.cn/art/2023/4/14/art_22405_4947838.html',
            // }, {
            //     'content': '全国关注济南！科创+金融，一场盛会激涌发展“活水” ',
            //     'sciUrl': 'https://new.qq.com/rain/a/20230415A01HXN00',
            // }
            ], //表示有多少个列表项
            copyHtml: '', //复制多一份防止滚动到后面出现空白
            msg: '',
            outcomes: {
                companyNum: '',
                financingNum: '',
                financingTotalAmount: ''
            },
        }
    },
    //同步执行的，意味着在该函数内的代码将在组件创建完成前立即执行
    //可以在该函数下完成一些初始化的工作
    created() {
        this.initData();
    },
    mounted() {
        // 如果列表数据是异步获取的，记得初始化在获取数据后再调用
        this.initScroll();
    },
    methods: {
        //获取政务新闻条例
        initData() {
            axios.get('http://localhost:8080/renren-admin/index/sciindexnews/page?limit=14&page=1').then((res) => {
                this.newsData = res.data.data.list
            }).catch((err) => {
                console.log(err)
                alert('请求出错！')
            })
        },
        //以下是实现滚动的
        initScroll() {
            this.$nextTick(() => {
                this.copyHtml = this.$refs.scrollItemBox.innerHTML
                this.startScroll()
            })
        },
        // 鼠标移入停止滚动
        mEnter() {
            clearInterval(this.timer);
        },
        // 鼠标移出继续滚动
        mLeave() {
            this.startScroll()
        },
        // 开始滚动
        startScroll() {
            //添加this指向，告诉他是自己的这个time，如果不加的话，没办法识别了
            this.timer = setInterval(this.scroll, this.speed);
        },
        // 滚动处理方法
        scroll() {
            //用于复制上一次出现的所有数据，因为在使用axios之后滚动数据只会滚动一次，也就是说没有调用copyHtml所以退而求其次用这个
            this.copyHtml = this.$refs.scrollItemBox.innerHTML

            this.scrollTop++
            // 获取需要滚动的盒子的高度
            let scrollItemBox = this.$refs.scrollItemBox.offsetHeight;
            // 当判断滚动的高度大于等于盒子高度时，从头开始滚动
            if (this.scrollTop >= scrollItemBox) {
                this.scrollTop = 0
            }
        },


    },

}
</script>

<style scoped>

a {
    color: #000;
}

.newsMessage {
    padding-left: 7%;
}

.newsFont {
    text-align: left;
    padding-left: 2%;
}

.scroll_parent_box {
    width: 90%;
    height: 100%;
    /*边框*/
    /* border: 1px solid #ebeef5;  */
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 10px;
}

.scroll_list {
    transition: all 0ms ease-in 0s
}

.scroll_item {
    height: 40px;
    line-height: 40px;
    /* text-align: center; */
    font-size: 14px;
}

.platform-outcomes {
    width: 1920px;
    height: 600px;
    background-image: url("../assets/img/chengguobg.jpg");
    background-repeat: no-repeat;
    background-size: 100%;
    /* background-position: center; */
    padding-left: 300px;
    padding-top: 80px;
}

.platform-outcomes .imgTitle {
    padding-left: 10px;
}

.platform-outcomes .imgTitle span {
    font-size: 25px;
    font-weight: 700;
    color: #313233;
    margin-left: 10px;
    margin-top: 15px;
}

.platform-outcomes .box {
    padding-left: 10%;
    /* box内的滚动条向左偏移10% */
    width: 1200px;
    height: 380px;
    /* background: skyblue; */
    background: white;
    float: left;
    margin-top: 35px;
    margin-right: 10px;
    border-top: 8px solid #d6ba83;
    border-bottom: 8px solid #d6ba83;
}

.platform-outcomes .box ul {
    margin-left: 80px;
    margin-right: 80px;
    margin-top: 25px;
    /* background:  white; */
}

/* 背景图 3张 */
.platform-outcomes .box .building {
    background: url("../assets/img/chengguo1bg.png") no-repeat;
    background-position: center center;
}

.platform-outcomes .box .book {
    background: url("../assets/img/chengguo2bg.png") no-repeat;
    background-position: center center;
}

.platform-outcomes .box .money {
    background: url("../assets/img/chengguo3bg.png") no-repeat;
    background-position: center center;
}


.platform-outcomes .box ul span {
    font-size: 30px;
    font-weight: 500;
    color: #cc4f4f;
}</style>
```

再次分析一下以上代码：

此处代码不做赘述，主要是用来实现页面展示的其中利用v-for实现不断地循环展示`@mouseenter`和`@mouseleave`作为监听鼠标的是否在此div上面滑入滑出

```vue
            <div class="scroll_parent_box" @mouseenter="mEnter" @mouseleave="mLeave">
                <div class="scroll_list" :style="{ transform: `translate(0px,-${scrollTop}px)` }">

                    <div ref="scrollItemBox">
                        <div class="scroll_item" v-for="(item, index) in newsData" :key="index">
                            <div class="newsFont">
                                <img src="../assets/img/little_news.png" alt="新闻小图标">
                            </div>
                            <div class="newsMessage">
                                <a :href="item.sciUrl" target="_blank">
                                    <p v-bind:style="{ fontWeight: 'bold' }">
                                        {{ item.content }}
                                    </p>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div v-html="copyHtml"></div>
                </div>
            </div>
```

css部分在此不做解释：

```css
a {
    color: #000;
}

.newsMessage {
    padding-left: 7%;
}

.newsFont {
    text-align: left;
    padding-left: 2%;
}

.scroll_parent_box {
    width: 90%;
    height: 100%;
    /*边框*/
    /* border: 1px solid #ebeef5;  */
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 10px;
}

.scroll_list {
    transition: all 0ms ease-in 0s
}

.scroll_item {
    height: 40px;
    line-height: 40px;
    /* text-align: center; */
    font-size: 14px;
}
```

javascript部分：

```javascript

import axios from 'axios'


export default {
    data() {
        return {
            scrollTop: 0, //列表滚动高度
            speed: 50, //滚动的速度
            newsData: [
            //     {
            //     'content': '科创金融为科创企业注入金融“活水”',
            //     'sciUrl': 'https://finance.sina.com.cn/jjxw/2023-04-15/doc-imyqknmc2885203.shtml',
            // }, {
            //     'content': '工商银行 坚定不移推进高质量发展 在服务中国式现代化进程中展现新担当',
            //     'sciUrl': 'http://paper.people.com.cn/rmrb/html/2023-03/10/nw.D110000renmrb_20230310_1-12.htm',
            // }, {
            //     'content': '让科创企业股权“软实力”变融资“硬通货”',
            //     'sciUrl': 'http://www.ccb.com/cn/ccbtoday/newsv3/20230414_1681445103.html',
            // }, {
            //     'content': '建设高质量科创板，更好促进科技、资本和产业良性循环',
            //     'sciUrl': 'http://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20221122_5712368.shtml',
            // }, {
            //     'content': '国泰君安发布服务上海科创中心建设行动方案_中国经济网——国家经济门户',
            //     'sciUrl': 'http://finance.ce.cn/stock/gsgdbd/202305/06/t20230506_38533924.shtml.',
            // }, {
            //     'content': '中国人民银行营业管理部召开2023年第二季度新闻发布会',
            //     'sciUrl': 'https://finance.sina.com.cn/money/bank/bank_yhfg/2023-04-27/doc-imyrvnht4400317.shtml',
            // }, {
            //     'content': '中国农业银行联合多家机构成功举办2023科创金融论坛',
            //     'sciUrl': 'http://finance.people.com.cn/n1/2023/0426/c1004-32674304.html',
            // }, {
            //     'content': '中国科协启动“科创中国”金融伙伴计划- 社会综合',
            //     'sciUrl': 'https://www.chinanews.com.cn/sh/2023/02-20/9957121.shtml',
            // }, {
            //     'content': '2023济南科创金融论坛举行马建堂袁亚湘作主旨演讲袁炳忠刘强致辞',
            //     'sciUrl': 'http://jntzcjj.jinan.gov.cn/art/2023/4/15/art_88379_4775055.html',
            // }, {
            //     'content': '济南市政府门户网站新闻刘强会见出席2023济南科创金融论坛嘉宾',
            //     'sciUrl': 'http://www.jinan.gov.cn/art/2023/4/14/art_22405_4947838.html',
            // }, {
            //     'content': '全国关注济南！科创+金融，一场盛会激涌发展“活水” ',
            //     'sciUrl': 'https://new.qq.com/rain/a/20230415A01HXN00',
            // }
            ], //表示有多少个列表项
            copyHtml: '', //复制多一份防止滚动到后面出现空白
            msg: '',
            outcomes: {
                companyNum: '',
                financingNum: '',
                financingTotalAmount: ''
            },
        }
    },
    //同步执行的，意味着在该函数内的代码将在组件创建完成前立即执行
    //可以在该函数下完成一些初始化的工作
    created() {
        
    },
    mounted() {
        this.initData();
        // 如果列表数据是异步获取的，记得初始化在获取数据后再调用
        //this.initScroll();
    },
    methods: {
        //获取政务新闻条例
        initData() {
            axios.get('http://localhost:8080/renren-admin/index/sciindexnews/page?limit=14&page=1').then((res) => {
                this.newsData = res.data.data.list
                this.initScroll();
            }).catch((err) => {
                console.log(err)
                alert('请求出错！')
            })
        },
        //以下是实现滚动的
        initScroll() {
            this.$nextTick(() => {
                this.copyHtml = this.$refs.scrollItemBox.innerHTML
                this.startScroll()
            })
        },
        // 鼠标移入停止滚动
        mEnter() {
            clearInterval(this.timer);
        },
        // 鼠标移出继续滚动
        mLeave() {
            this.startScroll()
        },
        // 开始滚动
        startScroll() {
            //添加this指向，告诉他是自己的这个time，如果不加的话，没办法识别了
            this.timer = setInterval(this.scroll, this.speed);
        },
        // 滚动处理方法
        scroll() {
            //用于复制上一次出现的所有数据，因为在使用axios之后滚动数据只会滚动一次，也就是说没有调用copyHtml所以退而求其次用这个
            this.copyHtml = this.$refs.scrollItemBox.innerHTML

            this.scrollTop++
            // 获取需要滚动的盒子的高度
            let scrollItemBox = this.$refs.scrollItemBox.offsetHeight;
            // 当判断滚动的高度大于等于盒子高度时，从头开始滚动
            if (this.scrollTop >= scrollItemBox) {
                this.scrollTop = 0
            }
        },


    },

}
</script>
```

再次赘述一下以上的javascript代码，这段是最为关键的，其中data内的return不做叙述，主要功能是作为数据的初始化 `initData()`我们放在最后说。

 **initScroll()** 这个方法的作用就是用户初始化滚动，其中调用了`startScroll()`方法，`this.copyHtml = this.$refs.scrollItemBox.innerHTML`的作用就是复制`ref=”scrollItemBox“`这个div内的所有代码来阻止出现当先数据显示完的情况之下出现空白的情形。

**mEnter()**这个方法是在鼠标进来的时候停止移动的clearInterval()就是阻塞setInterval()的方法。参考链接：http://caibaojian.com/setinterval-times.html

**mLeave()**这个不多说，就是调用下面的 startScroll()方法

**startScroll()**在此处的作用是调用滚动方法和设置滚动速度（滚动速度其实就是显示的时间，具体可以查看setInterval()方法）

**scroll()**可以说是真正滚动方法的实现。scrollItemBox就是div的高度，初始化一个scrollTop为0让它随时间不断增加，这时候当scrollTop大于scrollItemBox也就是说显示的数据都没有了，那就重新初始化scrollTop数据让他们重新显示

 **initData()**这里的作用是用于初始化数据的，当数据写死的时候我们可以不用介意。但是当数据是异步请求的时候，我们就需要把初始化滚动放在数据请求之后了。也就是说是这个情况

``` javascript
        initData() {
            axios.get('http://localhost:8080/renren-admin/index/sciindexnews/page?limit=14&page=1').then((res) => {
                this.newsData = res.data.data.list
                //初始化在获取数据后再调用
                this.initScroll();
            }).catch((err) => {
                console.log(err)
                alert('请求出错！')
            })
        },
```

同时在mounted更改

```javascript
    mounted() {
        this.initData();
        // 如果列表数据是异步获取的，记得初始化在获取数据后再调用
        //this.initScroll();
    },
```

其实这个this.initData();是可以放在created()生命周期里面的，我个人比较偏向放在created()声明周期里。

普及一下这俩生命周期的区别：

**created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。**

**mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。**

可以参考知乎这个帖子：https://zhuanlan.zhihu.com/p/479084392  

**憨憨的我：**

其实我一开始没有理解他的”记得初始化在获取数据后再调用“是什么意思，我还以为是初始化数据在获取数据之后初始化，我还寻思前端还能有这操作？这么神器吗？经过吾爱的大佬提示才知道，原来是，在数据初始化之后对方法的调用。。。。笨死我了

