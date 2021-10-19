Page({
  jump(){
    wx.navigateTo({
      url: '/pages/oxygen/oxygen',
    })
  },
  nojump(){
    wx.navigateTo({
      url: '/pages/routine/routine',
    })
  }

})
