function run() {
    // 在这里执行你的功能1
    console.log("功能4执行中...");

    for (var i = 1; i <= 10; i++) {
       
            console.log("倒计时: " + i)
        setTimeout(() => {
        //console.log("脚本执行完毕。");
    }, 1000);
    }
    setTimeout(() => {
        console.log("脚本执行完毕。");
    }, 1000);
}

function stop() {
    // 在这里添加停止操作的逻辑
    console.log("脚本被停止了");
    //process.exit(); // 退出进程
}
// 运行
run();