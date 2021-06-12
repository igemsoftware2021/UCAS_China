//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'), // 如需尝试获取用户信息可改为false
    naviagte_content:[
      {
        id:0,
        text:'设置',
        url:'/pages/setting/setting',
        active:0,
        figure_active:'/images/home/setting_active.png',
        figure_inactive:'/images/home/setting_inactive.png'
      },{
        id:1,
        text:'咖啡饮用分析',
        url:'/pages/history/history',
        active:0,
        figure_active:'/images/home/coffee_active.png',
        figure_inactive:'/images/home/coffee_inactive.png'
      },{
        id:2,
        text:'日常习惯',
        url:'/pages/routine/routine',
        active:0,
        figure_active:'/images/home/custom_active.png',
        figure_inactive:'/images/home/custom_inactive.png'
      },{
        id:3,
        text:'帮助',
        url:'/pages/help/help',
        active:0,
        figure_active:'/images/home/help_active.png',
        figure_inactive:'/images/home/help_inactive.png'
      },{
        id:4,
        text:'关于我们',
        url:'/pages/about_us/about_us',
        active:0,
        figure_active:'/images/home/about_active.png',
        figure_inactive:'/images/home/about_inactive.png'
      },{
        id:5,
        text:'评分与反馈',
        url:'/pages/feedback/feedback',
        active:0,
        figure_active:'/images/home/feedback_active.png',
        figure_inactive:'/images/home/feedback_inactive.png'
      }
      ]
  },


  tap:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.id;
    var that=this
    var ac=that.data.naviagte_content[index].active
    that.setData({
      ac:1
    })
  },

  onLoad: function() {
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
  },

  getUserProfile() {``
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
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

})