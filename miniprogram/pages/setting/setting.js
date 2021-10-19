//index.js
const app = getApp()
Page({
    data:{
      objectArray: [
        {id: 5, unique: 'unique_5'},
        {id: 4, unique: 'unique_4'},
        {id: 3, unique: 'unique_3'},
        {id: 2, unique: 'unique_2'},
        {id: 1, unique: 'unique_1'},
        {id: 0, unique: 'unique_0'},
      ],
      isChecked1:true,
      isChecked2:true,
      isChecked3:true,
      isChecked4:true,
      btn_disabled:false
    },
    titleClick: function (e) {
        let currentPageIndex =
          this.setData({
            //拿到当前索引并动态改变
            currentIndex: e.currentTarget.dataset.idx
          })
      },
      pagechange: function (e) {
        if ("touch" === e.detail.source) {
          let currentPageIndex = this.data.currentIndex
          currentPageIndex = (currentPageIndex + 1) % 2
          this.setData({
            currentIndex: currentPageIndex
          })
        }
      },


      changeSwitch1:function(e){
        console.log(e.detail.value)
      },
      changeSwitch2:function(e){
        console.log(e.detail.value)
      },
      changeSwitch3:function(e){
        console.log(e.detail.value)
      },
      changeSwitch4:function(e){
        console.log(e.detail.value)
      },

  data:{},

  onLoad:function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('users').doc(app.globalData.openid).get({
      success: function(res) {
        var value = Object.values(res.data.basic_arg)
        var tmp = [
          {keys:"age",value:"19"},
          {keys:"gender",value:"0"},
          {keys:"height",value:"185"},
          {keys:"liver",value:"1"},
          {keys:"weight",value:"61"},
        ]
        for(var i = 0; i< value.length-1;i+=1){
          tmp[i].value = value[i]
        }
        that.setData({
          info:tmp
        })
        console.log(that.data.info)
      }
    })
  },
  submitForm:function(){
    var keys = []
    var value = []
    console.log(this.data.info)
    for(var i in this.data.info){
      keys.push(i.keys)
      value.push(i.value)
    }
    console.log(this.data.info)
    console.log(keys)
    var tmp = {}
    for(var i = 0; i < keys.length - 1; i+=1){
      tmp[keys[i]] = value[i]
    }
    console.log(tmp)
    const db = wx.cloud.database()
    db.collection('users').doc(app.globalData.openid).update({
      data:{
        basic_arg:tmp
      },
      success: function(res) {
        console.log("modify personal info")
      }
    })
  }
})  