# 广州地铁助手

## 项目结构
- node_modules  项目依赖
- platforms     目标平台相关文件
- plugins       使用的插件
- res           使用到的资源(如图标)
- src           源码
- webpack       webpack配置
- www           将要加载到webview中的文件目录

## 安装说明

### 安装依赖
1. 安装node.js，版本6.11.3及以上
2. 安装cordova
```
npm install -g cordova
```

### 编译

1. 安装编译依赖
```
npm install
```
2. 添加目标平台
```
cordova platform add android
```
默认为android 7.0.0版本，如需编译到其他版本的安卓系统(如6.0.0)，执行
```
cordova platform add android@6.0.0
```
如需在`浏览器`中运行，或编译成`ios`平台app，将`android`替换为`broswer`或`ios`

3. 编译
```
cordova build andorid
```
生成的安装包位于`/platforms/android/build/outputs/apk/android-debug.apk`
4. 在安卓模拟器中运行
```
cordova run simulate
```
5. 通过ADB安装到手机
```
cordova run android
```
6. 在`android studio`中打开项目
    1. 启动 Android Studio.
    2. 选择 Import Project (Eclipse ADT, Gradle, etc).
    3. 选择`/platforms/android`目录