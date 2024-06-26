function getCurrentScriptPath() {
    if (typeof __dirname !== 'undefined' && typeof __filename !== 'undefined') {
        // Node.js 环境
        return {
            directory: __dirname,
            file: __filename
        };
    } else if (typeof engines !== 'undefined' && typeof engines.myEngine === 'function') {
        // Auto.js 环境
        return {
            directory: engines.myEngine().cwd(),
            file: engines.myEngine().cwd() // 在 Auto.js 中，文件路径通常与目录相同
        };
    } else {
        throw new Error("无法识别的运行环境");
    }
}

try {
    const scriptPath = getCurrentScriptPath();
    console.log("当前脚本目录:", scriptPath.directory);
    console.log("当前脚本路径:", scriptPath.file);
} catch (error) {
    console.error(error.message);
}