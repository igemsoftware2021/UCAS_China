# UCAS-iGEM-team software

## 简述

这里是为coffee子项目内设计的微信小程序，主要作用为记录监测用户咖啡因摄取量，根据用户自身情况设定并灵活调整标准值，依照用户日常作息给出咖啡因摄取量的推荐。

## 文件树说明
这里是云开发的微信小程序源码，目前先关注用户方的搭建，兼有数据库、API等，云函数等高级操作留待后续探索

关键文件及跳转关系如下：

`miniprogram/pages`页面：

> `index`:main界面，数据/评估方法根据用户有无登陆选取一般标准/个性化标准，首次打开跳转至login界面

> `register`:可选择不登陆继续使用，但无法获得个性服务，首先是微信登陆，若用户注册过跳转到main界面，若未注册则需跳转至填写基本信息表单，然后选择是否记录当天作息作为标准

> `out_coffee`:添加咖啡记录，一种可以通过蓝牙/局域网网络等与硬件数据交互，另一种可以选择所喝咖啡，此处需要数据库

> `health`:与硬件联系，通过各种指标反映用户健康水平

> `home`:用户个人中心界面，内部可以查看健康/咖啡因摄入曲线，点击history button跳转history界面，点击settings button跳转setting界面，点击routine button跳转至routine界面，点击about us button跳转至about_us界面

> `history`:查看咖啡因历史摄取详细记录

> `setting`:用户基本设置

> `routine`:查看生活作息，可更改其中存储数据将作为推荐参考

> `help`:帮助界面，查看使用说明

> `about_us`:最简单，关于我们

> `privacy`:隐私协议

> `web_view`网页跳转统一接口，请使用`navigator`导入，格式为`url="../web_view/web_view?src={{item.url}}"`

其他有用文件（`注：最好请不要修改，若要修改，一定联系**北风之神**`）

miniprogram中

> `app.js/app.json/app.wxss/sitemap.json`:都是自动修改/已经过改动

> `weui-miniprogram`:weui组件库，建议使用，非常方便，sometimes有点丑，若要修改请联系**北风之神**

> `doc/report, doc/sources`:前者直接放形成的算法/数据使用报告，后者为查阅的资料pdf版仓库，**注意命名和分类**

database_file中

仅有文件夹及json文件，作为数据库文件导入使用

## 开发说明

### 项目使用方法

1. **其余开发人员均为windows使用者，因此请先下载安装git bash在本地，可选地进行简单配置**

2. **而后进右键项目的预备目录，点击`git bash here`，终端打开后输入`git clone https://gitee.com/beifengzhishen995/igem-coffee-app.git`，在之前目录将出现`igem-coffee-app`文件夹，此时默认应该为`master`分支，在终端继续输入`git checkout dev_li/dev_guan`**

3. **此时打开微信开发者工具，右上角有导入选项，点击后选择刚刚下好的文件夹（若失败请联系@北风之神，暂且先只导入其内部的`miniprogram`文件夹**

4. **而后可能需要输入AppID(小程序ID)，请输入：wx24a0bdcd804e5c51，便于共享云开发能力（数据库）**

5. **为避免版本问题，进入后请先点击右上角版本管理即`git`，进行简单配置**

  - **打开`设置`，填入用户名/邮箱（邮箱同gitee一致即可）**

  - **而后打开`网络和认证`，选择最下面用户名和密码（为gitee邮箱/密码）**

  - **打开`远程`-`添加`，`url`填入`https://gitee.com/beifengzhishen995/igem-coffee-app.git`，名称可设置为`master`**

6. **之后可进行开发，可先进行拉取分支，与本地合并，避免冲突。**

  - **在阶段性代码填充完毕，打开版本管理，先勾选改动（相当于`git add .`）**

  - **而后输入`标题`，点击提交（相当于`git commit -m "xxx"），建议好好写对什么文件做了什么改动**
  
  - **完毕后点击推送，选择自己的开发分支，提交（相当于`git push`）**

  - **最后在[gitee网页中](https://gitee.com/beifengzhishen995/igem-coffee-app.git)，上部`pull request`选项卡填入自己的分支和`master`分支，@北风之神检查完毕则会进行合并**


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



### 工具

#### 绘图工具wx-charts

微信小程序图表工具，charts for WeChat small app

基于canvas绘制

#### 当前框架支持

- 饼图   `pie`

- 圆环图 `ring`

- 线图   `line`

- 柱状图 `column`

- 区域图 `area`

- 雷达图 `radar`

  （此框架感谢@[xiaolin](https://github.com/xiaolin3303/wx-charts) ）

#### 使用方法

**Step1：**

在`.js`文件中添加如下代码

```
// 路径是wxCharts文件相对于本文件的相对路径
// 框架代码已放在主目录下dist文件夹内
var wxCharts = require('../../dist/wxcharts.js');
Page({
    ...
    onLoad: function() {
        new wxCharts({
            ...
            //在这里对需要用到的chart进行描述
        });
    }
});
```



**Step2：**

在`.wxml`文件中定义canvas，例如：

```html
<canvas canvas-id="pieCanvas" disable-scroll="true" class="pieCanvas" style="width:300px; height:300px;"></canvas>
```

**canvas-id** 表示图表类型要与 `.js`文件中new wxCharts({canvasId: ''}) 中的 canvasId 一致。



### develop

请在各自的开发分支进行开发，分支已经搭建：
[方法请见：链接](https://blog.csdn.net/weixin_43851149/article/details/107283174)

> master

> |- develop(gzy分支)

> |- dev_guan(gyl分支)

> |_ dev_li(lwy分支)

请常使用`微信开发者工具`中`版本管理`中的`git`进行操作，使用方法可以交流

注意小程序`app.secret`密钥为`6a62081d1c40b41081ac06a882f2de10`

### 当前任务

目前的想法是`@LWY`负责和硬件交互反映健康的界面（即`health`文件夹），然后可以完善个人中心`help`和`about_us`，在算法方面配合`@GYL`查阅资料研究，后期`@北风之神`如果能够建好数据库&&写好框架代码，可以参与所有文件设计，注意避免冲突即可

避免冲突方法，在notion表格中改动（[https://www.notion.so/eb0de0e1ca9241b29c98e8916e9b089f?v=4b1434c0d4774a478ab4c7d70862d695](https://www.notion.so/eb0de0e1ca9241b29c98e8916e9b089f?v=4b1434c0d4774a478ab4c7d70862d695)）

`@GYL`可以对算法等所需数据信息查阅相关资料，**准备report**，相关的资料请放在`/miniprogram/doc/sources`，关于report，可以用word写放入`/miniprogram/doc/report`文件夹下，或者在`notion`上完成，report link（[https://www.notion.so/Report-27708df29b39429485c6bceee7cae9c9](https://www.notion.so/Report-27708df29b39429485c6bceee7cae9c9)）

### 及时补充交流

若框架/方向等由于非技术问题导致必须引起的技术层面更改，请及时联系**北风之神**

## 项目进展

### 页面框架

大部分页面wxml部分已经构建，但wxss美工缺乏，由于算法依旧缺乏数据和实验支持、在后期需要与HP&建模继续进行合作，在数据库和js文件中并没有最终确定参数；

还剩一些并不复杂，文字填充/增加美工的页面，后期耗时并不很多

关键的页面/数据转移链基本完成

与硬件协同进行的健康信息可视化处理仍停留在想法阶段，具体想法请见[健康界面设计](doc/miniprogram.md)

### 后期待完善

文字填补，美工，API接口基本完成可使用，健康模块完成，e-charts/canvas可视化

数据库丰富，用爬虫采集咖啡门店/品类信息

推荐机制，需要根据先前文献+HP（收集数据）+建模 得出更权威、准确的算法与调整方法

用户反馈调节

### 

