// 获取标题
var hTitle = document.querySelector(".matter h3")
// 获取全屏蒙版
var matter = document.querySelector(".matter")
// 获取白色的div
var matter_main = document.querySelector(".matter-main")
// 获取关闭按钮
var close = document.querySelector(".matter-head span")
// 获取第三个按钮
var btn = document.querySelector(".nav ul li:nth-child(3)")
// 当我点击按钮的时候显示模态框
btn.onclick = function () {
    // 将灰色的div从默认透明度为0变成1---透明度变为1即为显示
    matter.style.opacity = "1"
    // 让灰色的div从最底层变成最上面
    matter.style.zIndex = "100"
    // 让白色的div放到正常
    matter_main.style.transform = "scale(1)"
    // 获取表单里面的内容
    var val = document.querySelector(".right input").value
    // 将表单里面的内容赋值给标题
    hTitle.innerHTML = `${val} - 未来七天温度变化`
}
// 当我点击关闭按钮的时候
close.onclick = function () {
    // 将灰色的div从1变为0，透明
    matter.style.opacity = "0"
    // 让灰色的div从最上面变成最底层
    matter.style.zIndex = "-1"
    // 让白色的div缩放为0
    matter_main.style.transform = "scale(0)"
}