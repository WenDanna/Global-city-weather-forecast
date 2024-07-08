/*
    1.获取dom元素（span标签）
    2.获取系统日期+时间 new Date()
    3.将系统时间渲染到页面
*/
// 1.获取dom元素（span标签）
var oDate = document.querySelector(".date");
var oTime = document.querySelector(".time");
// 2.获取系统时间
function Time() {
    // 获取系统日期+时间
    var now = new Date()
    // 获取小时
    var h = now.getHours()
    // 获取分钟
    var m = now.getMinutes()
    // 获取秒
    var s = now.getSeconds()
    // 三目运算符，判断小于10那么就给数字前面加0，否则原样输出
    h = h < 10 ? "0" + h : h
    m = m < 10 ? "0" + m : m
    s = s < 10 ? "0" + s : s
    // 3.将时分秒输出到页面
    oTime.innerHTML = `${h}:${m}:${s}`
    // console.log(h,m,s)

    // 修复bug：等到23:59:59，然后在延长1s之后，重新调用系统时间，否则一直星期五
    if (h == "23" && m == "59" && s == "59") {
        setTimeout(() => {
            getDate()
        }, 1001)
    }
}
// 定时器（让时间以1s为间隔在页面变动） setInterval(函数名称,毫秒)
setInterval(Time, 1000)

// 2.获取系统日期
function getDate() {
    // 获取系统日期+时间
    var now = new Date()
    // 获取年份
    var year = now.getFullYear()
    // 获取月，因为获取月是0-11，所以+1
    var month = now.getMonth() + 1
    // 获取日，几号
    var day = now.getDate()
    // 获取星期，如果获取星期日那么返回的是0
    var week = now.getDay()
    // 定义一个数组，0，1，2，3，4，5，6
    var arr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    // 3.将年月日输出到页面
    oDate.innerHTML = `${year}年${month}月${day}日 ${arr[week]}`
    // console.log(year,month,day,week)
}
// 调用系统时间函数
Time()
// 调用系统日期函数
getDate()