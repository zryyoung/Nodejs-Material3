function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('Start');
    await sleep(3000);  // 睡眠3秒
    console.log('End');
}

main();