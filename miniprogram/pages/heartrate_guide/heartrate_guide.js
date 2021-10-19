Page({
  jump(){
    wx.navigateTo({
      url: '/pages/heartrate/heartrate',
    })
  },
  nojump(){
    wx.navigateTo({
      url: '/pages/routine/routine',
    })
  }

})
