onCreate(savedInstanceState) {
      // 读取用户偏好设置中的主题设置
        const sharedPreferences = this.getSharedPreferences("settings", android.content.Context.MODE_PRIVATE);
        const isDarkMode = sharedPreferences.getBoolean("dark_mode", false);

        // 设置主题
        if (isDarkMode) {
            //this.getTheme().applyStyle(ui.R.style.MainTheme_Dark, true);
            this.getTheme().applyStyle(ui.R.style.MainTheme_Dark, true);
        } else {
            this.getTheme().applyStyle(ui.R.style.MainTheme, true);
        }

    // 继续初始化
    androidx.core.view.WindowCompat.setDecorFitsSystemWindows(this.getWindow(), false);
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
        //this.getTheme().applyStyle(ui.R.style.MainTheme, true);
        
        this.recreate();
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