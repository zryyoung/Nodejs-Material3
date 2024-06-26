function download(url) {
    // 下载文件的URL
    //const url = 'https://raw.githubusercontent.com/zryyoung/autojs/main/酷安自动点赞.js';
    // https://githubraw.com/zryyoung/autojs/main/cardList.json
    
    // 文件保存的临时路径
    const tempFilePath = files.join(files.getSdcardPath(), 'temp.js');
    // 目标目录
    const targetDirectory = files.join(files.getSdcardPath(), '脚本');
    // 目标文件路径
    const targetFilePath = files.join(targetDirectory, '酷安自动点赞.js');

    // 创建目标目录（如果不存在）
    if (!files.exists(targetDirectory)) {
        files.ensureDir(targetDirectory);
    }

    // 下载文件并保存到临时路径
    try {
        let response = http.get(url);
        if (response.statusCode === 200) {
            files.writeBytes(tempFilePath, response.body.bytes());
            // 移动文件到目标目录
            files.move(tempFilePath, targetFilePath);
            toast('文件已下载并移动到: ' + targetFilePath);
        } else {
            toast('下载失败，状态码: ' + response.statusCode);
        }
    } catch (e) {
        toast('下载错误: ' + e.message);
    }
}