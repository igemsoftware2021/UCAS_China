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
    can_buy:1,
    market_coffee:[],
    index:0,
    stars:[
      {
        flag:1,
        bgImg: "../../images/home/stars_inactive.png",
        bgfImg:"../../images/home/stars_active.png"
      },
      {
        flag:1,
        bgImg: "../../images/home/stars_inactive.png",
        bgfImg:"../../images/home/stars_active.png"
      },
      {
        flag:1,
        bgImg: "../../images/home/stars_inactive.png",
        bgfImg:"../../images/home/stars_active.png"
      },
      {
        flag:1,
        bgImg: "../../images/home/stars_inactive.png",
        bgfImg:"../../images/home/stars_active.png"
      },
      {
        flag:1,
        bgImg: "../../images/home/stars_inactive.png",
        bgfImg:"../../images/home/stars_active.png"
      },
    ],
    amount_eval_text:['高','正好','低'],
    amount_eval_val:[0,1,2],
    amount_eval_final:0,
    recommand_feedback:{},
    time:0,
    raw_stars:0,
    raw_amount_eval:0
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
  amount_eval:function(e){
    console.log(e.detail.value)
    this.setData({
      amount_eval_final:e.detail.value
    })
  },
  bindFormsubmit:function(e)
  {
    const db = wx.cloud.database()
    db.collection('users').doc(app.globalData.openid).get({
      success: function(res) {
        this.setData({
          time:res.data.recommand_feedback.time,
          raw_amount_eval:res.data.recommand_feedback.amount_eval,
          raw_stars:res.data.recommand_feedback.amount_eval
        })
      }
    })
    console.log(this.data.time,this.data.raw_amount_eval,this.data.raw_stars)
    this.data.time+=1
    this.data.raw_amount_eval=Math.ceil((this.data.raw_amount_eval*(this.data.time-1)+this.data.amount_eval_final)/this.data.time)
    this.data.raw_stars=Math.ceil((this.data.raw_stars*(this.data.time-1)+this.data.index)/this.data.time)
    this.setData({
      [`recommand_feedback.time`]:this.data.time,
      [`recommand_feedback.stars`]:this.data.raw_stars,
      [`recommand_feedback.ammount_eval`]:this.data.raw_amount_eval
    })
    console.log(this.data.recommand_feedback)
    db.collection('users').doc(app.globalData.openid).update({
      data:{
        recommand_feedback:this.data.recommand_feedback
      },
      success: function(res) {
        console.log("recommand_feedback added")
        console.log(this.data.recommand_feedback)
      }
    })
  }
})