Page({
  data: {
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
  ]},
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
  bindFormsubmit:function(e)
 {
   if ((e.detail.value.textarea)!="")
   {
     arrayincp.push(e.detail.value.textarea)
     this.setData({
       array: arrayincp,
       input: false,
       condition1: true,
       condition2: false,
       nav1: "nav1",
       nav2: "nav2"
   })
   }
}
})