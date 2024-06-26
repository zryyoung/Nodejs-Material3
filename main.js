"ui nodejs";
require('rhino').install();

const https = require('https');
const fs = require('fs');
const path = require('path');
const ui = require('ui');
const app = require('app');
const $java = $autojs.java;
const { showInputDialog } = require('dialogs'); 
const notification = require('notification');
const { showToast } = require('toast');
const engines = require('engines');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { exec } = require('child_process');

// 定义一个数组来存储控制标志和线程
let scripts = [];
const Thread = java.lang.Thread;
// 动态添加脚本信息到数组中
function addScript(name, path) {
    let script = { name: name, path: path, isRunning: false, thread: null };
    scripts.push(script);
    console.log("已添加脚本: " + name);
}

// 启动脚本的函数
function startScript(script) {
    if (!script.isRunning) {
        script.isRunning = true;
        script.worker = new Worker(path.resolve(script.path), {
            workerData: script.name
        });

        script.worker.on('message', (msg) => {
            console.log(`Message from script ${script.name}: ${msg}`);
        });

        script.worker.on('error', (err) => {
            console.error(`Error in script ${script.name}:`, err);
            script.isRunning = false;
        });

        script.worker.on('exit', (code) => {
            console.log(`Script ${script.name} stopped with exit code ${code}`);
            script.isRunning = false;
        });

        console.log(`${script.name} script started`);
    }
}

// 停止脚本的函数
function stopScript(script) {
    if (script.isRunning) {
        script.isRunning = false;
        console.log(`${script.name} 手动停止`);
        script.worker.terminate();
    }
}

// 停止所有脚本的函数
function stopAllScripts() {
    scripts.forEach(script => {
        if (script.isRunning) {
            stopScript(script);
        }
    });
}


// 根据脚本名称判断是否脚本正在运行
function isScriptRunning(name) {
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].name == name && scripts[i].isRunning) {
            return true;
        }
    }
    return false;
}

// 根据脚本名称判断是否脚本存在
function isScriptExist(name) {
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].name == name) {
            return true;
        }
    }
    return false;
}

// 根据脚本名称返回脚本对象
function getScriptByName(name) {
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].name == name) {
            return scripts[i];
        }
    }
    return null;
}



class Feature {
    constructor(title, url) {
        this.title = title;
        this.url = url;
    }
}
let cardListStr = ''; // 全局变量
const cardListUrl = 'https://githubraw.com/zryyoung/autojs/main/cardList.json';
function fetchCardList(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data); // 成功获取数据，调用 resolve 函数
            });
        }).on('error', (err) => {
            reject(err); // 请求失败，调用 reject 函数
        });
    });
}

//下载文件
function downloadFile(url, saveDirectory = '.') {
    // 从 URL 中提取文件名
    const fileName = path.basename(url);
    // 确定保存路径
    const savePath = path.join(saveDirectory, fileName);
    // 发起 HTTPS GET 请求下载文件
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            // 创建写入流
            const fileStream = fs.createWriteStream(savePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`文件下载完成：${savePath}`);
                showInputDialog(`文件下载完成`,`${savePath}`);
            });
        } else {
            console.error(`请求失败，状态码: ${response.statusCode}`);
            const notificationId = 1000;
            notification.notify(notificationId, {
                contentTitle: "请求失败",
                contentText: "请检查网络链接",
                ticker: "收到一条新通知",
                onContentClick: () => {
                    showCounterNotification(0);
                },
                ongoing: true,
                autoCancel: true,
            });
        }
    }).on('error', (err) => {
        console.error(`下载失败：${err.message}`);
        showToast('下载失败，检查网络');
    });
}
//downloadFile("https://githubraw.com/zryyoung/autojs/main/cardList.json","./configs")

// 要使用Android原生界面&资源的特性，需要在project.json中加上androidResources属性
async function main() {
    //cardListStr = await fetchCardList(cardListUrl)
    // 加载Android资源
    await ui.loadAndroidResources();
    ui.setMainActivity(MainActivity)
}
main().catch(console.error);

class MainActivity extends ui.Activity {

    // 默认布局ID，对应于文件res/layout/activity_main
    get layoutId() {
        return ui.R.layout.activity_main;
    }

    constructor() {
        super();
        //卡片列表初始数据
        this.cardList = [
            { title: '功能1', url: 'https://pic.rmb.bdstatic.com/bjh/171cd6cf9e22e5a8ac1567725a71a8e4.jpeg' },
            { title: '功能2', url: 'https://pic.rmb.bdstatic.com/bjh/f99b58ad941c90bb94d2c8969d5a7fb7.jpeg' },
            { title: '功能3', url: 'https://pic.rmb.bdstatic.com/bjh/d3de1d7f8b4381e952de1499d4892329.jpeg' },
            { title: '功能4', url: 'https://pic.rmb.bdstatic.com/bjh/b97040da6b4d791391a96dea7acf1580.jpeg' },
            { title: '功能5', url: 'https://pic.rmb.bdstatic.com/bjh/8dd74c59886964ffdda4401ea4bf78ed.jpeg' },
            { title: '功能6', url: 'https://pic.rmb.bdstatic.com/bjh/3cbb35d423544aac493178079c200913.jpeg' },
            { title: '功能7', url: 'https://pic.rmb.bdstatic.com/bjh/791d0f965a41243b994f47247e84d722.jpeg' },
            { title: '功能8', url: 'https://picsum.photos/800' },
        ];
        //this.cardList = JSON.parse(cardListStr).map(item => new Feature(item.title, item.url));
        showToast("功能脚本可多选执行")
    }



    // onCreate(savedInstanceState) {
    //     androidx.core.view.WindowCompat.setDecorFitsSystemWindows(this.getWindow(), false);
    //     // 应用主题
    //     this.getTheme().applyStyle(ui.R.style.MainTheme, true);
    //     super.onCreate(savedInstanceState);
    // }

    onCreate(savedInstanceState) {
        androidx.core.view.WindowCompat.setDecorFitsSystemWindows(this.getWindow(), false);
    
        // 读取用户偏好设置中的主题设置
        const sharedPreferences = this.getSharedPreferences("settings", android.content.Context.MODE_PRIVATE);
        const isDarkMode = sharedPreferences.getBoolean("dark_mode", false);
        if (isDarkMode) {
            this.getTheme().applyStyle(ui.R.style.MainTheme_Dark, true);
        } else {
            this.getTheme().applyStyle(ui.R.style.MainTheme, true);
        }
        // 继续初始化
        super.onCreate(savedInstanceState);
    }
    

    setDarkMode(enabled) {
        const sharedPreferences = this.getSharedPreferences("settings", android.content.Context.MODE_PRIVATE);
        const editor = sharedPreferences.edit();
        editor.putBoolean("dark_mode", enabled);
        editor.apply();
        if (enabled) {
            this.setTheme(ui.R.style.MainTheme_Dark);
            this.getTheme().applyStyle(ui.R.style.MainTheme_Dark, true);
        } else {
            this.setTheme(ui.R.style.MainTheme);
            this.getTheme().applyStyle(ui.R.style.MainTheme, true);
            
        }
        // 重新创建活动以应用新主题
        this.recreate();
        //this.onCreate(savedInstanceState);
    }
    
    _setupSettings(view) {
        const themeSwitch = view.findViewById(ui.R.id.theme_switch);
    
        // 初始化暗色模式开关状态
        this.initializeDarkModeSwitch(themeSwitch);
    
        // 设置暗色模式开关监听器
        themeSwitch.setOnCheckedChangeListener((buttonView, isChecked) => {
            this.setDarkMode(isChecked);
        });
    }
    
    initializeDarkModeSwitch(themeSwitch) {
        const sharedPreferences = this.getSharedPreferences("settings", android.content.Context.MODE_PRIVATE);
        const isDarkMode = sharedPreferences.getBoolean("dark_mode", false);
        themeSwitch.setChecked(isDarkMode);
    }

    onContentViewSet(view) {
        this._setupWebView(view.binding.webview); // 初始化WebView
        this._setupViewPager(view.binding.viewPager, view.binding.navigation);
        this._setupDrawer(view.binding.drawer, view.binding.toolbar, view.binding.drawerNavigation);
        this._setupGrid(view.binding.grid);
        this._setupConsole(view.binding.console, view.binding.toggleButton);
        this._setupSettings(view); // 初始化设置界面
        
        view.binding.fab.setOnClickListener(() => {
            //console.log('已勾选卡片:', this.cardList.filter(item => item.checked));
            
            // 获取已勾选的卡片列表
            const selectedItems = this.cardList.filter(item => item.checked);
            
            // 遍历已勾选的卡片，并执行对应的脚本
            selectedItems.forEach(item => {
            const scriptPath = './runJs/' + item.title + '.js';
                // 检查文件是否存在
                fs.access(scriptPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        showToast("没有找到可执行脚本"+scriptPath)
                        console.error(`Error checking file existence: ${err}`);
                        return;
                    }
                    
                    // // 文件存在时导入并执行脚本
                    // const scriptRun = require(path);
                    // if (scriptRun.run) {
                    //     scriptRun.run();
                    // } else {
                    //     console.error(`Function 'run' not found in script: ${path}`);
                    // }
                    engines.execScriptFile(scriptPath);
                });
            });
            const Snackbar = com.google.android.material.snackbar.Snackbar;
            Snackbar.make(view, "开始运行", 0)
                .setAnchorView(ui.R.id.fab)
                .setAction("取消", () => {
                    console.log('已取消');
                    showToast("停止所有脚本");
                    stopAllScripts();
            }).show()
        });
    }
    
    
    _setupWebView(webview) {
        // 设置混合内容模式，允许加载 HTTP 和 HTTPS 混合内容
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            webview.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        //关闭日志
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            android.webkit.WebView.setWebContentsDebuggingEnabled(false);
        }
        // 设置WebView客户端以避免在系统浏览器中打开URL
        webview.setWebViewClient(new android.webkit.WebViewClient());
        // 加载指定的网页
        webview.loadUrl("http://tool.liumingye.cn/music/");
        // 启用JavaScript支持
        webview.getSettings().setJavaScriptEnabled(true);
        // 启用DOM存储
        webview.getSettings().setDomStorageEnabled(true);
        // 根据需要加载页面的概览模式
        webview.getSettings().setLoadWithOverviewMode(true);
        // 使用宽视图端口
        webview.getSettings().setUseWideViewPort(true);
    
        const context = webview.getContext();
    
        // 支持缩放
        webview.getSettings().setSupportZoom(true);
        webview.getSettings().setBuiltInZoomControls(true);
        webview.getSettings().setDisplayZoomControls(false);
        
    }

    _setupDrawer(drawer, toolbar, navigation) {
        this.setSupportActionBar(toolbar);
        // 配置ToolBar左上角点击时打开侧拉菜单
        const toggle = new androidx.appcompat.app.ActionBarDrawerToggle(this, drawer, toolbar, 0, 0);
        toggle.syncState();
        drawer.addDrawerListener(toggle);
        // 设置侧拉菜单中邮件Item的标题
        navigation.getMenu().findItem(ui.R.id.item_email).setTitle('pro@autojs.org');
        // 侧拉菜单点击监听
        navigation.setNavigationItemSelectedListener(item => {
            switch (item.getItemId()) {
                case ui.R.id.item_docs:
                    app.openUrl('https://pro.autojs.org/docs/v9');
                    break;
                case ui.R.id.item_forum:
                    app.openUrl('https://blog.autojs.org/');
                    break;
                case ui.R.id.item_m3:
                    app.openUrl('https://m3.material.io/');
                    break;
                case ui.R.id.item_github:
                    app.openUrl('https://zryyoung.github.io/')
                    //webview.loadUrl("https://www.github.com/zryyoung");
                    break;
                case ui.R.id.item_doc:
                    app.openUrl('https://zryyoung.github.io/AutoJsDocument/docs/docs.html')
                    //webview.loadUrl("https://www.github.com/zryyoung");
                    break;
                case ui.R.id.item_docAddr:
                    app.openUrl('https://www.github.com/zryyoung/AutoJsDocument/')
                    //webview.loadUrl("https://www.github.com/zryyoung");
                    break;
                case ui.R.id.item_ocr:
                    app.openUrl('https://zryyoung.github.io/AutoJsDocument/被移除文档/ocr - 文字识别 _ Auto.js Pro文档20230214.html')
                    //webview.loadUrl("https://www.github.com/zryyoung");
                    break;
                case ui.R.id.item_images:
                    app.openUrl('https://zryyoung.github.io/AutoJsDocument/被移除文档/images - 图片处理 _ Auto.js Pro文档20230214.html')
                    //webview.loadUrl("https://www.github.com/zryyoung");
                    break;
                case ui.R.id.item_控件:
                    app.openUrl('https://zryyoung.github.io/AutoJsDocument/被移除文档/控件和控件集合 _ Auto.js Pro文档20230214.html')
                    //webview.loadUrl("https://www.github.com/zryyoung");
                    break;
            }
            return true;
        });
    }

    _setupViewPager(viewPager, navigation) {
        const bottomNavigationIds = [ui.R.id.navigation_web,ui.R.id.navigation_dashboard, ui.R.id.navigation_log, ui.R.id.navigation_settings];
        viewPager.initAdapterFromChildren();
        // 初始化 fab
        const fab = this.findViewById(ui.R.id.fab); // 确保 fab 已在布局文件中定义
        //console.log(fab)
        // ViewPager和底部导航栏同步
        navigation.setOnItemSelectedListener((item) => {
            viewPager.setCurrentItem(bottomNavigationIds.indexOf(item.getItemId()));
            return true;
        })
        
        viewPager.addOnPageChangeListener(new androidx.viewpager.widget.ViewPager.OnPageChangeListener({
            
            onPageScrolled: (position, positionOffset, positionOffsetPixels) => {
            },
            onPageSelected: (position) => {
                navigation.setSelectedItemId(bottomNavigationIds[position])
                // 假设 fab 是在外部作用域中定义的
                const dashboardId = ui.R.id.navigation_dashboard;
                if (bottomNavigationIds[position] === dashboardId || bottomNavigationIds[position] === ui.R.id.navigation_settings) {
                    //showToast("可多选执行")
                    fab.show(); // 显示 fab
                } else {
                    fab.hide(); // 隐藏 fab
                }
            },
            onPageScrollStateChanged: (state) => {
            },
        }));
    }

    async _setupGrid(grid) {
        // 自定义ViewHolder
        const MyViewHolder = await $java.defineClass(
            class MyViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
                constructor(itemView) {
                    super(itemView);
                    itemView.setOnClickListener(() => {
                        const checked = !itemView.isChecked();
                        itemView.setChecked(checked);
                        this.item.checked = checked;
                    });
                    this.title = itemView.binding.title;
                    this.image = itemView.binding.image;
                
                    itemView.findViewById(ui.R.id.favoriteButton).setOnClickListener(() => {
                        const checked = !itemView.isChecked();
                        itemView.setChecked(checked);
                        this.item.checked = checked;
                        //console.log("喜欢");
                        showToast("喜欢 Star ")
                        app.openUrl('https://github.com/zryyoung/autojs')
                    });
                    itemView.findViewById(ui.R.id.shareButton).setOnClickListener(() => {
                        console.log("分享,未完成");
                        shareScript(this.item.title);
                    });
                    itemView.findViewById(ui.R.id.downloadButton).setOnClickListener(() => {
                        const checked = !itemView.isChecked();
                        itemView.setChecked(checked);
                        this.item.checked = checked;
                        showToast("下载..");
                        const url = "https://githubraw.com/zryyoung/autojs/main/"+this.item.title+".js";
                        downloadFile(url,'./runJs');
                    });
                    function shareScript(scriptName) {
                        const scriptPath = __dirname+"/runJs/" + scriptName + ".js"; // 修改为实际的文件路径
                        const file = new java.io.File(scriptPath);
                        //console.log(file)
                        if (file.exists()) {
                            let shareUtil = require('./utils/share.js')
                            shareUtil.分享单个文件(scriptPath)
                            // const intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
                            // intent.setType("text/plain"); // 设置正确的 MIME 类型
                            // intent.putExtra(android.content.Intent.EXTRA_STREAM, android.net.Uri.fromFile(file));
                            // console.log(intent);
                            // startActivity(android.content.Intent.createChooser(intent, "分享到"));
                            //app.openUrl("content://"+scriptPath);
                        } else {
                            console.err("文件不存在：" + scriptPath);
                        }
                       
                    }
                    itemView.findViewById(ui.R.id.startButton).setOnClickListener(() => {
                        const checked = !itemView.isChecked();
                        itemView.setChecked(checked);
                        this.item.checked = checked;
                        const scriptName = this.item.title;
                        const scriptPath = './runJs/' + this.item.title + '.js';
                        // 检查文件是否存在
                        fs.access(scriptPath, fs.constants.F_OK, (err) => {
                            if (err) {
                                showToast("没有找到可执行脚本："+path)
                                console.error(`Error checking file existence: ${err}`);
                                return;
                            }
                        //   engine = engines.execScriptFile(scriptPath);
                        //     // 文件存在时导入并执行脚本
                        //     // const scriptRun = require(path);
                        //     // if (scriptRun.run) {
                        //     //     console.log("开始运行脚本："+this.item.title);
                        //     //     showToast("执行脚本："+ this.item.title);
                        //     //     scriptRun.run();
                        //     // } else {
                        //     //     showToast("脚本中没有 run() 方法");
                        //     //     console.error(`Function 'run' not found in script: ${path}`);
                        //     // }
                            if(!isScriptExist(scriptName)){
                                    addScript(scriptName,scriptPath);
                            }
                            if(!isScriptRunning(scriptName)){
                               
                                //console.log("开始运行脚本："+this.item.title);
                                showToast("执行脚本："+ this.item.title);
                                startScript(getScriptByName(scriptName));
                            }else{
                                showToast(scriptName+" 脚本正在运行");
                            }
                        });
                    });
                    itemView.findViewById(ui.R.id.stopButton).setOnClickListener(() => {
                        const checked = !itemView.isChecked();
                        itemView.setChecked(!checked);
                        this.item.checked = !checked;
                        const scriptName = this.item.title;
                        const scriptPath = './runJs/' + this.item.title + '.js';
                        // 检查文件是否存在
                        fs.access(scriptPath, fs.constants.F_OK, (err) => {
                            if (err) {
                                showToast("没有找到可执行脚本："+scriptPath)
                                console.error(`Error checking file existence: ${err}`);
                                return;
                            }
                            //console.log(engine);
                            if(isScriptRunning(scriptName)){
                                showToast("停止"+scriptName)
                                stopScript(getScriptByName(scriptName));
                            }else{
                                showToast(scriptName+"没有运行");
                            }
                            // if(engine!=null){
                            //     engines.stopAll();
                            //     //java.lang.System.exit(0);
                            //     showToast(scriptPath+"脚本已停止");
                            // }
                            // const myEngines = engines.getRunningEngines();
                            // //console.log(myEngines)
                            // myEngines.forEach(engine=>{
                            //     console.log(engine)
                            //     const myRunEnginePath = engine.javaObject.source;
                            //     console.log(myRunEnginePath)
                            //     if (myRunEnginePath.indexOf("功能3.js") !== -1) {
                            //         engine.forceStop();
                            //         showToast("脚本已停止");
                            //     }

                            // })
                        });
                    });
                }

                bind(item, position) {
                    this.title.setText(item.title);
                    ui.imageLoader.loadImageInto(this.image, item.url).catch(console.error);
                    this.itemView.setChecked(item.checked ?? false);
                    this.item = item;
                }
            }
        );
        // 自定义Adapter
        const MyAdapter = await $java.defineClass(
            class MyAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter {
                constructor(data) {
                    super();
                    this.data = data;
                }

                onCreateViewHolder(parent, viewType) {
                    return new MyViewHolder(android.view.LayoutInflater.from(parent.getContext())
                        .inflate(ui.R.layout.grid_item, parent, false));
                }

                onBindViewHolder(holder, position) {
                    holder.bind(this.data[position]);
                }

                getItemCount() {
                    return this.data.length;
                }
            }
        );
        // 设置为表格布局，列数为2
        const layoutManager = new androidx.recyclerview.widget.GridLayoutManager(this, 1);
        grid.setLayoutManager(layoutManager);
        grid.setAdapter(new MyAdapter(this.cardList));
    }

    _setupConsole(consoleView, toggleButton) {
        // 禁用控制台的嵌套滑动，去除控制台滑动时导致Toolbar自动变色效果
        consoleView.getContentView().setNestedScrollingEnabled(false);
        toggleButton.addOnButtonCheckedListener((btn, checkedId, isChecked) => {
            if (isChecked) {
                switch (checkedId) {
                    case ui.R.id.buttonLog:
                        consoleView.setLogLevel("V");
                        break;
                    case ui.R.id.buttonWarning:
                        consoleView.setLogLevel("W");
                        break;
                    case ui.R.id.buttonError:
                        consoleView.setLogLevel("E");
                        break;
                    case ui.R.id.buttonClearLog:
                        consoleView.clear();
                        break;
                }
            }
        });
    }
    
    

    onCreateOptionsMenu(menu) {
        this.getMenuInflater().inflate(ui.R.menu.menu_main, menu);
        return true;
    }

    onOptionsItemSelected(item) {
        switch (item.getItemId()) {
            case ui.R.id.action_abouts: {
                this._showMaterial3Alert("Abouts", "Node.js M3 Demo\nAuto.js Pro V9 With Node.js");
                break;
            }
            default:
                return super.onOptionsItemSelected(item)
        }
        return true;
    }


    _showMaterial3Alert(title, message) {
        const MaterialAlertDialogBuilder = com.google.android.material.dialog.MaterialAlertDialogBuilder;
        new MaterialAlertDialogBuilder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show();
    }
    
}


