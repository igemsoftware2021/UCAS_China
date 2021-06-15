// 用于存选项信息的数组
const routineData = {
  sleep:0,
  sport:0,
};
Page({
  // 各选项的值和名称（一开始value和name顺序打反了懒得改了X）
  data: {
    sleepTime: [
      {value: '0', name: '不足4小时'},
      {value: '1', name: '4-6小时'},
      {value: '2', name: '6-7小时'},
      {value: '3', name: '7-8小时'},
      {value: '4', name: '8小时以上'},
    ],
    sportTime: [
      {value: '0', name: '半小时以下'},
      {value: '1', name: '0.5-1小时'},
      {value: '2', name: '1-2小时'},
      {value: '3', name: '2-3小时'},
      {value: '4', name: '3小时以上'},
    ]
  },
  sleepChange:function(e){
    this.setData({
    'routineData.sleep':e.detail.value,
    }),
    //调试，虽然懒得调但还是养成好习惯（
    console.log(this.data.routineData)
  },
  sportChange:function(e){
    this.setData({
    'routineData.sport':e.detail.value,
    }),
    console.log(this.data.routineData)
  },
  onSubmit:function(e){
    wx.setStorage({
      data:'routineData',
      key:'this.data.routineData',
    })
    console.log(this.data.routineData)
    //存储了数据，不知到时候是否需要跳转到算法结果页面
  },
})