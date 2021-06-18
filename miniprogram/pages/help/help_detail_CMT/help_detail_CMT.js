// pages/help/help_datail.js
var app = getApp()
Page({
  onShow:function(e) {
    var that = this
    var a= app.globalData.a;
    if (a!=null ||a!=''||a!=undefined) {
      that.setData({
        a:a
      });
    }
    app.globalData.a = 0
  },
  onload: function (options) {
    console.log(options)
    this.data.articallist.forEach(item => {
      if (options.id == item.id) {
        this.setData({
          phptoarticals:item.images,txt
        })
      }
    })
  },
  data: {
    phptoarticals:"",
    articallist:[{
      id:0,
      images:[{}],
    txt:"the fist page"
    },{
    id:1,
    images:[{}],
    txt:"the second page"
  }, {
    id:2,
    images:[{}],
    txt:"the third page"
  }, {
    id:3,
    images:[{}],
    txt:"the fourth page"
  }, {
    id:4,
    images:[{}],
    txt:"the fifth page"
  }, {
    id:5,
    images:[{}],
    txt:"the sixth page"
  }, {
    id:6,
    images:[{}],
    txt:"the seventh page"
  }, {
    id:7,
    images:[{}],
    txt:"the eighth page"
  }, {
    id:8,
    images:[{}],
    txt:"the ninth page"
  }
]},

})
