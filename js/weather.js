/*
1.数据从哪来？
    我们从===》和风天气api接口中调用===》国家气象台得到的数据
2.key：756358d8b17c4ad5a8a8af1bb55ae34f
    想要拿到城市ID，必须先拿到你输入框中的内容
    要想查询天气：先拿到城市ID
    拿到城市ID，再去请求天气预报
*/
var xData = [];
var yData1 = [];
var yData2 = [];
// 在页面中，获取查询的点击按钮
var btn = document.querySelector(".right button")
var key = "756358d8b17c4ad5a8a8af1bb55ae34f"
// 给按钮添加点击事件
btn.onclick = function () {
    // 获取你输入框中的内容
    var city = document.querySelector(".right input").value
    // 将输入框中的内容赋值给span里面的内容
    document.querySelector(".box-top span").innerText = city
    document.querySelector(".right span").innerText = city
    // 请求接口--请求和风天气那边的数据，拿到输入框中的内容去和风天气那换取城市ID
    fetch(
        `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${key}`
    ).then(res => {
        return res.text()
    }).then(data => {
        // data是一个json字符串，通过一个JSON.parse()转为json对象的形式
        var obj = JSON.parse(data)
        // console.log(obj.location[0].id,"城市ID")
        // alert(obj.location[0].id)
        // 调用函数，传递ID
        weather(obj.location[0].id)
    })
    // 当我点击查询按钮时，弹出提示框
    // alert(city)
}
// 页面一打开就默认查询天气
btn.onclick()
// 查询天气，拿到城市id去查实时天气
function weather(id) {
    // alert(id)
    // 调城市天气预报的接口
    fetch(
        `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key}`
    ).then(res => {
        return res.text()
    }).then(data => {
        var obj = JSON.parse(data)
        // 获取温度
        var wd = document.querySelector(".wd h1 span:nth-child(1)")
        // 将获取到的数据赋值给span里面的温度
        wd.innerHTML = obj.now.temp
        // 获取图片
        var img = document.querySelector(".wd h1 img")
        // now.icon是个后端给的数字，正好对应咱项目icon文件夹中的图片名称
        img.src = `icon/${obj.now.icon}.png`
        // 获取天气描述
        var ms = document.querySelector(".qing")
        ms.innerHTML = obj.now.text
        // 获取湿度
        var shidu = document.querySelector(".shidu")
        shidu.innerHTML = obj.now.humidity + "%"
        // 获取风向
        var fx = document.querySelector(".fengxiang")
        fx.innerHTML = obj.now.windDir
        // 获取风力等级
        var fl = document.querySelector(".fengli")
        fl.innerHTML = obj.now.windScale + "级"
    });
    // 查询未来七天天气
    fetch(
        `https://devapi.qweather.com/v7/weather/7d?location=${id}&key=${key}`
    ).then(res => {
        return res.text()
    }).then(data => {
        var obj = JSON.parse(data)
        // 获取最高和最低气温
        var qw = document.querySelector(".wd p b")
        qw.innerHTML = `${obj.daily[0].tempMin}℃ ~ ${obj.daily[0].tempMax}℃`
        // console.log(obj, "获取未来三天天气")
        // 处理x轴数据
        var x = obj.daily.map(item=>{
            return item.fxDate
        })
        // 处理y轴数据
        var y = obj.daily.map(item=>{
            return (Number(item.tempMin) + Number(item.tempMax)) / 2
        })
        // 调用echarts，将x，y轴数据传递进去（带参zzt函数）
        zzt(x,y)
    });
    // 查询温馨提醒---生活指数
    fetch(
        `https://devapi.qweather.com/v7/indices/1d?location=${id}&key=${key}&type=1,2,3,4,5,6,7,8`
    ).then(res => {
        return res.text()
    }).then(data => {
        var obj = JSON.parse(data)
        // 获取温馨提示-运动指数内容
        var desc = document.querySelector(".desc")
        // 如果是国内有值，则赋值给页面，如果是国外则显示国外城市，暂无数据
        if (obj.daily[0].text) {
            desc.innerHTML = "运动指数：" + obj.daily[0].text
        } else {
            desc.innerHTML = "国外城市，暂无数据"
        }
        console.log(obj, "温馨提示")
    });
    // 查询24小时的天气预报
    fetch(
        `https://devapi.qweather.com/v7/weather/24h?location=${id}&key=${key}`
    ).then(res => {
        return res.text()
    }).then(data => {
        var obj = JSON.parse(data)
        // 获取24小时的天气预报
        console.log(obj.hourly, "24小时天气预报")
        /* 注意：需要把时间单独取出来，用到
           Map是ES6的一个遍历循环的方法，它会将一个数组处理完了之后生成一个新数组。
           item箭头函数，返回item的fxTime中的截取时间，
           用substring()方法截取，从长度11开始，截止的长度是16
        */
        // 处理x轴数据
        xData = obj.hourly.map(item => {
            return item.fxTime.substring(11, 16)
        })
        // y轴温度
        yData1 = obj.hourly.map(item => {
            return item.temp
        })
        // y轴风速
        yData2 = obj.hourly.map(item => {
            return item.windSpeed
        })
        // 函数调用（注意要先拿到处理后的数据再去渲染调用图表）
        ech()
    })
}
/*  es6语法
    fetch(`接口地址?参数1=参数1的值&参数2=参数2的值`).then(res=>{
        return res.text()
    }).then(date=>{
        console.log(date,"请求成功后的数据")
    })
*/
// 第四步编写逻辑
function ech() {
    // 1.获取div
    var myChart = echarts.init(document.getElementById('main'));
    // 2.配置图表
    var option = {
        // 显示标题
        title: {
            show: true,
            text: "24小时天气",
            link: "http:www.baidu.com",
            target: "self",
            textStyle: {
                color: "#fff"
            },
            padding: 20
        },
        // 提示框组件
        tooltip: {
            show: true,
            // 在折线图中显示提示框-none
            trigger: "axis",
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#8e8e8edb'
                }
            },
            /*
            提示框图层内容格式器：
            自定义提示框内容
            3种格式 ---》
            （1.回调函数）
            formatter:function(){} == formatter:()=>{}
            示例：
            formatter:(params)=>{
                var str = `
                    <p>温度：${params[0].value}</p>
                    <p>湿度：${params[1].value}</p>
                `
                retrue str
            }
            （2.字符串）
            示例：
            formatter:'{b0} <br/> 温度：{c0}℃ <br/> 风速：{c1} km/h'
            （3.``简单写法)
            示例：
            */
            formatter: `
                时间：{b0} <br/> 
                温度：{c0} ℃ <br/> 
                风速：{c1} km/h
            `
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            // x轴数据
            data: xData,
            // 修改x轴字体颜色
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        yAxis: {
            type: 'value',
            // name: '温度',
            alignTicks: true,
            // 修改y轴字体颜色
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        // y轴数据
        series: [
            {
                data: yData1,
                type: 'line',
                // emphasis: {
                //     focus: 'series'
                // },
                areaStyle: {}
            },
            {
                data: yData2,
                type: 'line',
                // emphasis: {
                //     focus: 'series'
                // },
                areaStyle: {}
            },
        ],
    };
    // 3.将图表添加到id为main的div上面
    myChart.setOption(option);
}
// 柱状图，采用函数传参的方式把数据传进去
function zzt(x, y) {
    // 1.获取div
    var myChart = echarts.init(document.querySelector("#matter"))
    // 2.配置图表
    var option = {
        // 提示框组件
        tooltip: {
            show: true,
            // 在折线图中显示提示框-axis
            trigger: "axis"
        },
        xAxis: {
            type: 'category',
            data: x
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [
            {
                data: y,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };
    // 3.将图表添加到id为main的div上面
    myChart.setOption(option);
}