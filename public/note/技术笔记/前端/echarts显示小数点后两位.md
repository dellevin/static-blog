```html

<!DOCTYPE html>
<html style="height: 100%">

<head>
  <meta charset="utf-8">
</head>

<body style="height: 100%; margin: 0; background-color: transparent">
  <div id="container" style="height: 100%; background-color: transparent"></div>
  
  <script type="text/javascript" src="echarts.min.js"></script>
  <script type="text/javascript">
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    var option;
    option = {
      backgroundColor: 'transparent',

      series: [
        {
          type: 'gauge',
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          min: 0,
      max: 3,
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {//轴刻度
            distance: -15,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -15,
            length: 15,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 20,
            fontSize: 12
          },
          detail: {//pue显示
            valueAnimation: true,
            formatter: 'PUE= {value}',
            color: 'green',
            fontSize: 20
          },
          data: [
            {
              value: 0.00,
              min: 0.00,
              max: 3.00
            }
          ]
        }
      ]
    };

    oaJsApi.dpConnect('System1:PUE5.PUE:_online.._value', true,
      {
        success: function (data) {
          var value = data.value[0];
          //var pueShow =   newF.toFixed(2); 
          //var pueShow = formatFloat(newF, n = 2,'floor');
          //console.log(newF);
          //console.log(pueShow);

          myChart.setOption({
            series: [
              {
                detail:{
                      formatter: function (value) {
                            return  "PUE="+value.toFixed(2);
                      }
                    },
                data: [
                  {
                    value:value,
                  }
                ]

              }
            ]
          });

        }
      });


    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
    //自建方法 ceil 向上取   floor 向下区
    function formatFloat(num, n = 1, flag) {
    var f = parseFloat(num);
    if (isNaN(f)) {
        return false;
    }
    if (flag === 'ceil') {
        f = Math.ceil(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
    } else if (flag === 'floor') {
        f = Math.floor(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
    } else {
        f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
    }
    var s = f.toString();
    var rs = s.indexOf('.');
    //判定如果是整数，增加小数点再补0
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + n) {
        s += '0';
    }
    return s;
    }

  </script>
  <script>

  </script>

</body>

</html>
```

先处理传入的value值，

```javascript
data: [
                  {
                    value:value,
                  }
      ]
```

然后利用函数给formatter发送数据，return数据可以是string类型

```javascript
detail:{
                      formatter: function (value) {
                            return  "PUE="+value.toFixed(2);
                      }
         },
```

前端针对pue数据进行显示  `formatter: '{value}'`

```javascript
detail: {//pue显示
            valueAnimation: true,
            formatter: '{value}',
            color: 'green',
            fontSize: 20
          },
```

