这两天需要做一个大屏的东西，看着网上那个地图的效果很酷很炫，所以想整一个这样的东西，话不多说，开始整。因为项目本体是人人开源项目，我是在这个基础上做的一个二次开发吧。后端代码就省略了。其实很简单。在此就不会做太多的赘述了。

## 后端

不过有一个点是可以关注的，就是当你的数据库过于庞大的话，我们可以建一个缓存。也就是一下的示例代码。

2023年5月25日：针对这个数据，因为map里面是放到缓存中了，一直没有释放，所以改用redis，又因为这个是二次开发的项目，所以人家对redis进行了一系列的改造，我在自己新建redis配置类的时候一直报错有冲突，所以在看了一下结构之后，对后端的代码进行了一系列的重构。

### redis工具类

用于从 Redis 中获取缓存数据或者将数据存入 Redis

```java

    public List<Object> getListFromRedis(String key) {
        Object cachedData = get(key);
        if (cachedData != null) {
            // 如果缓存中存在数据，则将其转换为 List 对象并返回
            return (List) cachedData;
        } else {
            // 如果缓存中不存在数据，则返回空列表
            return new ArrayList<>();
        }
    }
    public void setListToRedis(String key, List<Object> data, long expire) {
        set(key, data, expire);
    }

```



### 控制层

修改 `getEnterpriseNums` 方法，以先从 Redis 中获取数据，如果缓存中存在数据，则直接返回；如果缓存中不存在数据，则从数据库中获取数据，并将其存入 Redis 缓存中

```java
    @Autowired
    private RedisUtils redisUtils;
	@GetMapping("/enterpriseNums")
    @ApiOperation("返回地图上的区域数据")
    public Result getEnterpriseNums(){
//        List<ShowEnterpriseDetailsNumsDTO> enterpriseDetailsList = enterpriseDetailsService.getEnterpriseNums();
//        return  new Result().ok(enterpriseDetailsList);
        String redisKey = "enterpriseNums"; // 定义 Redis 缓存的键名
        List enterpriseDetailsList = redisUtils.getListFromRedis(redisKey);
        if (enterpriseDetailsList.isEmpty()) {
            // 从数据库中获取数据
            enterpriseDetailsList = enterpriseDetailsService.getEnterpriseNums();
            // 将数据存入 Redis 缓存，设置过期时间为一小时
            redisUtils.setListToRedis(redisKey, enterpriseDetailsList, RedisUtils.HOUR_ONE_EXPIRE);
        }
        return new Result().ok(enterpriseDetailsList);
    }
```

~~首先从 `showEnterpriseDetailsServicesCache` 缓存中获取工厂信息列表数据。如果列表数据为空（即缓存中没有数据），则调用 `enterpriseDetailsService.getEnterpriseNums()` 方法获取工厂信息数据，并将其存入缓存中。在下次调用 `getEnterpriseNums()` 方法时，将直接从缓存中获取数据，避免了重复查询的开销。~~

通过以上优化，当第一次请求 `getEnterpriseNums` 接口时，数据将从数据库中获取，并存入 Redis 缓存中。之后的请求将直接从 Redis 缓存中获取数据，从而提高响应速度和性能。请确保 Redis 配置正确，并已经启动了 Redis 服务。

## 前端

echarts示例：https://echarts.apache.org/examples/zh/editor.html?c=map-HK

他给的示例我们可以分析出来，我觉得是通过ajax请求来把地图搞到，然后绑定map最后，把数据显示出来。`$.get(ROOT_PATH + '/data/asset/geo/HK.json', function (geoJson)`用于异步加载地图数据。这段代码的作用是通过 AJAX 请求获取名为 `'HK.json' 的地图数据文件，然后在成功获取数据后，使用`echarts.registerMap('HK', geoJson)`将地图数据注册到 ECharts 中，并命名为 `'HK'`。这样，之后在配置地图的 `series` 中就可以通过指定 `map: 'HK'` 来使用该地图数据。

再者我们需要提前的把地图数据导入到项目当中来。可以通过这个平台下载地图的数据

http://datav.aliyun.com/portal/school/atlas/area_selector#&lat=30.332329214580188&lng=106.72278672066881&zoom=3.5

![image-20230524221925701](./assets/%E5%85%B3%E4%BA%8Evue%EF%BC%8Cts%EF%BC%8Cechart%E6%95%B4%E5%90%88%E6%98%BE%E7%A4%BA%E5%9C%B0%E5%9B%BE%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F/image-20230524221925701.png)

然后的话导入方式，因为项目的原因我们需要这样做，

**先是import**

```typescript
import jiNanMapJson from "src/views/enterprise/assets/json/济南市.json";

import * as echarts from "echarts";
```

**再然后注册地图数据到 ECharts：**

```typescript
echarts.registerMap('jiNan', jiNanMapJson);
```

**更新 `mapOption` 中的 `series` 配置，将 `map: 'HK'` 添加到相关的地图系列中，以便使用注册的地图数据：**

```typescript
const mapOption = ref({
  // ...其他配置项
  series: [
    {
      // ...其他系列配置
      map: 'jiNan', // 使用注册的地图数据
      // ...其他系列配置
    }
  ]
});
```

通过这种方式，我们可以注册到其中，完整代码如下：

```vue
<template>
  <div class="box">
    <el-form-item>
      <el-button type="warning" @click="importHandle()">{{ $t("excel.import") }}</el-button>
    </el-form-item>
    <div style="width: 100%;margin-left: 6em;margin-bottom: 2em;">
      <div class="topShow">
        <div style="color:brown; font-size: 1.875rem /* 30/16 */;text-align: center;padding-top: 1.4375rem /* 23/16 */;">
          信用金桥大数据屏幕展示平台</div>
        <div style="color:brown; font-size: 1.25rem /* 20/16 */;text-align: right;padding-right: 2.1875rem /* 35/16 */;;">
          {{ dataForm.currentTime }}</div>
      </div>
    </div>


    <div class="line_01">
      <figure class="figure_left">
        <div v-for="(item, index) in dataForm.enterpriseNums" :key="index" style="width: 23em;text-align: center; ">
          <div class="card">
            <span style="color: red;">{{ item.name }}区</span>
            在营企业总数 ：
            <span style="color: sienna; font-size: 2em;">{{ item.value }} 家</span>
          </div>
          <br />
        </div>
      </figure>

      <figure class="figure_center">

      </figure>
      <figure class="figure_right">
        <v-chart :option="mapOption" :autoresize="true" />
      </figure>
    </div>
    <div class="line_02">
      <figure class="figure_left">
        <v-chart :option="pie" :autoresize="true" />
      </figure>
    </div>



    <import ref="importRef"></import>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, reactive } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import { GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, ToolboxComponent, DataZoomComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import Import from '@/views/enterprise/enterprise-library-import.vue';
import baseService from "@/service/baseService";
import jiNanMapJson from "src/views/enterprise/assets/json/济南市.json";
import zhangQiuMapJson from "src/views/enterprise/assets/json/章丘区.json";
import * as echarts from "echarts";

use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);

provide(THEME_KEY, "westeros");

const dataForm = reactive({
  currentTime: '',
  enterpriseNums: [],
});


const importRef = ref();
const importHandle = () => {
  importRef.value.init(`${app.api}/enterprise/details/import?token=${getToken()}`);
};

const list = ref([]);
const industryNames = ref([]);
const getIndustryInfo = async () => {
  let result = await (await baseService.get("/enterprise/details/industryInfo")).data;
  list.value = result;
  industryNames.value = result.map((item: any) => item.name);
};
getIndustryInfo();

const updateTime = () => {
  const currentDate = new Date();
  const year = String(currentDate.getFullYear());
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const date = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  dataForm.currentTime = `${year}年${month}月${date}日  ${hours}:${minutes}:${seconds}`;
};
setInterval(() => {
  updateTime();
}, 1000);

const mapMsg = ref([]);
const getEnterpriseNums = async () => {
  let result = await (await baseService.get("/enterprise/details/enterpriseNums")).data;
  dataForm.enterpriseNums = result;
  mapMsg.value = result;
  //console.log(mapMsg)
};
getEnterpriseNums();

echarts.registerMap('jiNan', jiNanMapJson);
const mapOption = ref({
  title: {
    text: '济南市各区在营企业统计',
    subtext: '数据来源XXXX',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>{c} (家)'
  },
  toolbox: {
    show: false,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  visualMap: {
    min: 800,
    max: 500000,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['lightskyblue', 'yellow', 'orangered']
    }
  },
  series: [
    {
      name: '济南市各区注册企业数量',
      type: 'map',
      map: 'jiNan',
      label: {
        show: true
      },
      data: mapMsg,
    }
  ]
});


const pie = ref({
  title: {
    text: "行业占比",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    type: 'scroll',
    orient: "vertical",
    right: 10,
    top: 20,
    bottom: 20,
    left: "left",
    data: industryNames
  },
  series: [
    {
      name: "行业占比",
      type: "pie",
      label: {
        show: false
      },
      radius: "55%",
      center: ["50%", "60%"],
      data: list,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
});
</script>

<style lang="less" scoped>
.topShow {
  width: 90%;
  height: 5rem
    /* 80/16 */
  ;
  font-family: "得意黑";
  border-radius: 3.125rem
    /* 50/16 */
  ;
  border-radius: 3.4375rem
    /* 55/16 */
  ;
  border-radius: 2.5rem
    /* 40/16 */
  ;
  background: #f0f0ff;
  box-shadow: .4375rem
    /* 7/16 */
    .4375rem
    /* 7/16 */
    .875rem
    /* 14/16 */
    #ccccd9,
    -.4375rem
    /* 7/16 */
    -.4375rem
    /* 7/16 */
    .875rem
    /* 14/16 */
    #ffffff;
}

@font-face {
  font-family: '得意黑';
  src: url('./assets/font/SmileySans-Oblique-2.ttf');
  font-weight: normal;
  font-style: normal;
}

.card {
  border-radius: .5rem
    /* 8/16 */
  ;
  font-family: "得意黑";
  font-size: large;
  border-radius: 1.125rem
    /* 18/16 */
  ;
  background: #f0f0ff;
  box-shadow: inset .4375rem
    /* 7/16 */
    .4375rem
    /* 7/16 */
    .875rem
    /* 14/16 */
    #ccccd9,
    inset -.4375rem
    /* 7/16 */
    -.4375rem
    /* 7/16 */
    .875rem
    /* 14/16 */
    #ffffff;
}

.box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  figure {
    display: inline-block;
    // position: relative;
    //margin: 2em auto;
    border: .0625rem
      /* 1/16 */
      solid rgba(0, 0, 0, 0.1);
    border-radius: .5rem
      /* 8/16 */
    ;
    box-shadow: 0 0 2.8125rem
      /* 45/16 */
      rgba(0, 0, 0, 0.2);
    padding: 1.875rem
      /* 30/16 */
    ;

    .echarts {
      width: 40vw;
      min-width: 25rem
        /* 400/16 */
      ;
      height: 18.75rem
        /* 300/16 */
      ;
    }
  }
}

.line_01 {
  width: 100%;
  height: auto;

  // 左对齐
  .figure_left {
    float: left;
    width: 27em;
    border-radius: 1.125rem
      /* 18/16 */
    ;
    background: #f0f0ff;
    box-shadow: .4375rem
      /* 7/16 */
      .4375rem
      /* 7/16 */
      .875rem
      /* 14/16 */
      #ccccd9,
      -.4375rem
      /* 7/16 */
      -.4375rem
      /* 7/16 */
      .875rem
      /* 14/16 */
      #ffffff;
  }

  //右对齐
  .figure_right {
    float: right;
    width: 50em;

    .echarts {
      width: auto;
      height: 43.75rem
        /* 700/16 */
      ;
    }

    border-radius: 1.125rem
    /* 18/16 */
    ;
    background: #f0f0ff;
    box-shadow: .4375rem
    /* 7/16 */
    .4375rem
    /* 7/16 */
    .875rem
    /* 14/16 */
    #ccccd9,
    -.4375rem
    /* 7/16 */
    -.4375rem
    /* 7/16 */
    .875rem
    /* 14/16 */
    #ffffff;
  }

  .figure_center {
    //float: right;
    //position: absolute;
    width: 21em;
    border-radius: 1.125rem
      /* 18/16 */
    ;
    background: #f0f0ff;
    box-shadow: .4375rem
      /* 7/16 */
      .4375rem
      /* 7/16 */
      .875rem
      /* 14/16 */
      #ccccd9,
      -.4375rem
      /* 7/16 */
      -.4375rem
      /* 7/16 */
      .875rem
      /* 14/16 */
      #ffffff;
  }
}

.line_02 {
  width: 100%;
  height: auto;

  // 左对齐
  .figure_left {
    float: left;
    width: 50em;
    border-radius: 1.125rem
      /* 18/16 */
    ;
    background: #f0f0ff;
    box-shadow: .4375rem
      /* 7/16 */
      .4375rem
      /* 7/16 */
      .875rem
      /* 14/16 */
      #ccccd9,
      -.4375rem
      /* 7/16 */
      -.4375rem
      /* 7/16 */
      .875rem
      /* 14/16 */
      #ffffff;
  }
}</style>

```

最终实现效果可参考echarts的案例。