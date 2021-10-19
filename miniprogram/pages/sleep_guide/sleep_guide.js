
Page({
  jump(){
    wx.navigateTo({
      url: '/pages/sleep/sleep',
    })
  },
  nojump(){
    wx.navigateTo({
      url: '/pages/routine/routine',
    })
  }

})
