//index.js
const app = getApp()
Page({
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
     
        data:{
          isChecked1:true,
          isChecked2:true,
          isChecked3:true,
          isChecked4:true,
          btn_disabled:false
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
    
  }
})  