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
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') // 如需尝试获取用户信息可改为false
  },
  taberTop:function(e){
    console.log(e);
    this.setData({
      state: e.currentTarget.dataset.state
    })
  },
  refresh:function(e){
    this.setData({
      refreshState: true
    })
    setTimeout(() =>{
      this.setData({
        refreshState: false
      })
    },2000)
  },
  toBottom(e) {//到底部
    console.log(e)
  },

// pages/mine/mine.js

  data: {
    currentIndex: 0,
    "firstList": [{ name: '' }],
    "secondList": [{ name: ''}],
    "thirdList": [{ name: '010-88256079' }]},
  
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  buttonclick:function(e){
    wx.navigateTo({
      url: '../../pages/help/help_detail_CMT/help_detail_CMT',
    })
  },                             //跳转到Coffein-moniter页面
  buttonclick1:function(e){
   wx.navigateTo({
     url: '../../pages/help/help_detail_UM/help_detail_UM',
   })
  },                             //跳转到使用方法页面
  buttonclick2:function(e){
   wx.navigateTo({
     url:'./help_detail_version/help_detail_version',
   })
  },                              //跳转到版本更新页面
  buttonclick3:function(e){
   wx.navigateTo({
     url:'./help_detail_text1/help_detail_text1',
   })
  },                               //跳转到第一篇推文
  buttonclick4:function(e){
   wx.navigateTo({
     url:'./help_detail_text2/help_detail_text2',
   })
  },                               //跳转到第二篇推文
  buttonclick5:function(e){
   wx.navigateTo({
     url:'./help_detail_text3/help_detail_text3',
   })
  },                               //跳转到第三篇推文
  buttonclick6:function(e){
   wx.navigateTo({
     url:'./help_detail_P-QR/help_detail_P-QR',
   })
  },                               //跳转到平台二维码页面



  
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 3
      this.setData({
        currentIndex: currentPageIndex
      })
    }
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


  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
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