# UCAS-iGEM-team software

## 简述

这里是为coffee子项目内设计的微信小程序，主要作用为记录监测用户咖啡因摄取量，根据用户自身情况设定并灵活调整标准值，依照用户日常作息给出咖啡因摄取量的推荐。

## 文件树说明
这里是云开发的微信小程序源码，目前先关注用户方的搭建，兼有数据库、API等，云函数等高级操作留待后续探索

关键文件及跳转关系如下：

`miniprogram/pages`页面：

> index:main界面，数据/评估方法根据用户有无登陆选取一般标准/个性化标准，首次打开跳转至login界面

> login:可选择不登陆继续使用，但无法获得个性服务，首先是微信登陆，若用户注册过跳转到main界面，若未注册则需跳转至填写基本信息表单，然后选择是否记录当天作息作为标准

> user_test:刚注册用户填写基本信息，或与其他检测方式交互

> record_add:添加咖啡记录，一种可以通过蓝牙/局域网网络等与硬件数据交互，另一种可以选择所喝咖啡，此处需要数据库

> home:用户个人中心界面，内部可以查看健康/咖啡因摄入曲线，点击history button跳转history界面，点击settings button跳转setting界面，点击routine button跳转至routine界面，点击about us button跳转至about_us界面

> history:查看咖啡因历史摄取详细记录

> setting:用户基本设置

> routine:查看生活作息，可更改其中存储数据将作为推荐参考

> help:帮助界面，查看使用说明

> about_us:最简单，关于我们

其他有用文件（`注：最好请不要修改，若要修改，一定联系**北风之神**`）

miniprogram中

> app.js/app.json/app.wxss/sitemap.json:都是自动修改/已经过改动

> weui-miniprogram，weui组件库，建议使用，非常方便，sometimes有点丑，若要修改请联系**北风之神**

database_file中

仅有文件夹及json文件，作为数据库文件导入使用

## 开发说明
### 上哪学

- b站：看一点视频
- [官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)，很不错
- [weui组件库文档](https://developers.weixin.qq.com/miniprogram/dev/extended/)，已经通过npm的方式导入，并且在`miniprogram`中有其代码文件也可使用，但可能会报错，因此统一推荐在需要导入页面的json文件中使用类似如下的方式

```json
"usingComponents": {
    "mp-tabbar": "/miniprogram_npm/weui-miniprogram/tabbar/tabbar"
  }
```

使用时请注意，关于引用文件路径必须加入`../../../`才能够回到根目录

基本信息入门可以简要交流
### develop

请在各自的开发分支进行开发，分支已经搭建：
[方法请见：链接](https://blog.csdn.net/weixin_43851149/article/details/107283174)

> master

> |- develop(gzy分支)

> |- dev_guan(gyl分支)

> |_ dev_li(lwy分支)

请常使用`微信开发者工具`中`版本管理`中的`git`进行操作，使用方法可以交流

### 及时补充交流

若框架/方向等由于非技术问题导致必须引起的技术层面更改，请及时联系**北风之神**