"nodejs ";
//require('rhino').install();

//const https = require('https');
const http = require('http');
//const app = require('app');
//const {showToast} = require('toast');

// 存储服务器实例
let server;

function startServer() {
    server = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    });

    server.listen(8080, () => {
        console.log('Server is running on port 8080');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error('Port 8080 is already in use');
            stopServer(() => {
                startServer();
            });
        } else {
            console.error('Server error:', err);
        }
    });
}

function stopServer(callback) {
    if (server) {
        server.close((err) => {
            if (err) {
                console.error('Error stopping the server:', err);
            } else {
                console.log('Server stopped');
            }
            if (callback) callback();
        });
    } else if (callback) {
        callback();
    }
}

// 监听进程退出事件
process.on('exit', () => stopServer());
process.on('SIGINT', () => {
    stopServer(() => {
        console.log('Process interrupted');
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    stopServer(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// 示例：停止并重新启动服务器
//showToast("服务正在启动..");
startServer();

setTimeout(() => {
    //showToast("服务启动成功");
}, 2000); // 5秒后停止并重新启动服务器


setTimeout(() => {
   //showToast("自动访问8080");
   //app.openUrl('http://127.0.0.1:8080');
}, 3000);

setTimeout(() => {
    stopServer();
    //showToast("自动停止");
}, 20000);// 20秒后自动停止服务
// 停止服务器并在5秒后重新启动
// setTimeout(() => {
//     stopServer(() => {
//         startServer();
//     });
// }, 5000); // 5秒后停止并重新启动服务器