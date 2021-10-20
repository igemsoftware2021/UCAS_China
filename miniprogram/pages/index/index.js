//index.js
const app = getApp()

Page({
  data: {
    showActionsheet: true,
    avatarUrl: './user-unlogin.png?raw=true',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'), // 如需尝试获取用户信息可改为false
    list: [{
      "text": "推荐",
      "iconPath": "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/tabbar/coffee_inactive.png?raw=true",
      "selectedIconPath": "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/tabbar/coffee_active.png?raw=true",
      /*dot: true*/
    },
    {
      "text": "记录",
      "iconPath": "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/tabbar/record_inactive.png?raw=true",
      "selectedIconPath": "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/tabbar/record_active.png?raw=true",
      /*badge: 'New'*/
    },
    {
      "text": "个人中心",
      "iconPath": "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/tabbar/person_inactive.png?raw=true",
      "selectedIconPath": "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/tabbar/person_active.png?raw=true",
      /*badge: 'New'*/
    }],
    src:"https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/topimage/cafe.jpeg?raw=true",
    openid:'',
    session:'',
    indatabase:false,
    index:0,
    stars:[
      {
        flag:1,
        bgImg: "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_inactive.png?raw=true",
        bgfImg:"https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_active.png?raw=true"
      },
      {
        flag:1,
        bgImg: "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_inactive.png?raw=true",
        bgfImg:"https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_active.png?raw=true"
      },
      {
        flag:1,
        bgImg: "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_inactive.png?raw=true",
        bgfImg:"https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_active.png?raw=true"
      },
      {
        flag:1,
        bgImg: "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_inactive.png?raw=true",
        bgfImg:"https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_active.png?raw=true"
      },
      {
        flag:1,
        bgImg: "https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_inactive.png?raw=true",
        bgfImg:"https://github.com/ETOgaosion/iGEM-Software/blob/main/we_app/images/home/stars_active.png?raw=true"
      },
    ],
    recom_amount:0
  },

  onLoad: function(options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
    if(options.data.hasUserInfo==1){
      this.setData({
        hasUserInfo:true
      })
    }
    else{
      this.setData({
        hasUserInfo:false
      })
    }
    console.log(options)
  },

  getUserProfile() {
    this.setData({
      hasUserInfo: true
    })
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '将为您提供个性化方案', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        app.globalData.userInfo =this.data.userInfo
        app.globalData.hasUserInfo=this.data.hasUserInfo
        app.globalData.canIUseGetUserProfile=this.data.canIUseGetUserProfile
        app.globalData.avatarUrl=this.data.avatarUrl
        app.globalData.userInfo=this.data.userInfo
        console.log(app.globalData.avatarUrl)

        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey
            if(res.code){
              console.log(res.code)
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',//微信服务器获取appid的网址 不用变
                method:'post',//必须是post方法
                data:{
                  js_code:res.code,
                  appid:'wx24a0bdcd804e5c51',//仅为实例appid
                  secret:'6a62081d1c40b41081ac06a882f2de10',//仅为实例secret
                  grant_type:'authorization_code'
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                success:function(response){
                  console.log(response.data)
                  wx.setStorageSync('app_openid', response.data.openid); //将openid存入本地缓存
                  wx.setStorageSync('sessionKey', response.data.session_key)//将session_key 存入本地缓存命名为SessionKey
                }
              })
            }else{
              console.log("登陆失败");
            }
          }
        })
        var that = this  //早success里面不能使用this 因为 success 是回调函数 它会不停的检测是否成功，因此在不断回调的过程中this的指向就发生了变化
        var storageData = wx.getStorageSync('app_openid')
        console.log('storageData', storageData);
        this.setData({
          openid:storageData
        });
        storageData = wx.getStorageSync('sessionKey')
        console.log('storageData', storageData);
        this.setData({
          session:storageData
        });
    
        console.log(this.data.openid)
        app.globalData.openid=this.data.openid
        app.globalData.session=this.data.session
        const db = wx.cloud.database()
        db.collection('users').where({
          _openid:this.data.openid
        }).get({
          success: function(res) {
            console.log("hit")
            console.log(res.data)
            if(res.data.length>0){
              that.setData({
                indatabase:true
              })
              app.globalData.indatabase=that.data.indatabase
            }
            console.log(that.data.indatabase)
            if(!that.data.indatabase){
              wx.navigateTo({
                url: '../register/register',
                events: {
                  // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                  acceptDataFromOpenedPage: function(data) {
                    console.log(data)
                  },
                  someEvent: function(data) {
                    console.log(data)
                  }
                },
                success: function(res) {
                  // 通过eventChannel向被打开页面传送数据
                  //res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.openid })
                }
              })
            }
            else{
              that.setData({
                hasUserInfo:true
              })
              console.log(that.data.hasUserInfo)
              var myDate = new Date();
              var getHours = myDate.getHours()
              var hours = 12-getHours
              if(getHours>12){
                hours = 18-getHours
              }
              else if(getHours>18){
                hours = 23 - getHours
              }
              that.setData({
                recom_amount: 0.36-0.36*hours/7
              })
              console.log(hours,recom_amount)
            }
          }
        })

        console.log(this.data.hasUserInfo)
      }
    })
  },
  

  switchTab(){
    wx.switchTab({
      url: '../recommand/recommand',
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
      app.globalData.userInfo =this.data.userInfo
      app.globalData.hasUserInfo=this.data.hasUserInfo
      app.globalData.canIUseGetUserProfile=this.data.canIUseGetUserProfile
      console.log(this.data.userInfo)
      var myDate = new Date();
      var getHours = myDate.getHours()
      var hours = 12-getHours
      if(getHours>12){
        hours = 18-getHours
      }
      else if(getHours>18){
        hours = 23 - getHours
      }
      this.setData({
        recom_amount: 0.36-0.36*hours/7
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  score:function(e){
    var that=this;
    for(var i=0;i<that.data.stars.length;i++){
      var allItem = 'stars['+i+'].flag';
      that.setData({
        [allItem]: 1
      })
    }
    var index=e.currentTarget.dataset.index;
    for(var i=0;i<=index;i++){
      var item = 'stars['+i+'].flag';
      that.setData({
        [item]:2,
        index:index+1,
      })
    }
  },
  bindFormsubmit:function(e)
 {
   if ((e.detail.value.textarea)!="")
   {
     arrayincp.push(e.detail.value.textarea)
     this.setData({
       array: arrayincp,
       input: false,
       condition1: true,
       condition2: false,
       nav1: "nav1",
       nav2: "nav2"
   })
   }
  }
})
