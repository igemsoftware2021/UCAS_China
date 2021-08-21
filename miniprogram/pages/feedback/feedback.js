const app = getApp()

Page({
  data: {
    index:0,
    texts:"",
    min:5, //最少字数
    max: 200,
    input:"",
    tempFilePaths: [],   //最大字数
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
  app_feedback:{
    time:0,
    stars:0,
    text:""
  },
  raw_stars:0
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
  /**
   * 字数限制
   */ 
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    console.log(value)
    this.setData({
      input:value
    })
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    if (len <this.data.min){
      this.setData({
        texts: "至少要输入5个字哦"
      })
    }else if (len >= this.data.min){
      this.setData({
        texts: " "
      })
    }
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  /**
   * 上传图片方法
   */
  upload: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9,最多上传图片数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;

        that.setData({
          tempFilePaths: tempFilePaths
        })
        /**
         * 上传完成后把文件上传到服务器
         */
        var count = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          
          //上传文件
          /*  wx.uploadFile({
              url: HOST + '地址路径',
              filePath: tempFilePaths[i],
              name: 'uploadfile_ant',
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (res) {
                count++;
                //如果是最后一张,则隐藏等待中  
                if (count == tempFilePaths.length) {
                  wx.hideToast();
                }
              },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
                })
              }
            });*/
        }
      }
    })
  },
  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    console.log(that.data.tempFilePaths[index]);
    console.log(that.data.tempFilePaths);
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
      //这根本就不走
      success: function (res) {
        //console.log(res);
      },
      //也根本不走
      fail: function () {
        //console.log('fail')
      }
    })
  },
  /**
   * 长按删除图片
   */
  deleteImage: function (e) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('确定');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          console.log('取消');
          return false;
        }
        that.setData({
          tempFilePaths
        });
      }
    })
  },
  bindFormsubmit:function(e)
  {
    console.log(e.detail)
    const db = wx.cloud.database()
    db.collection('users').doc(app.globalData.openid).get({
      success: function(res) {
        this.setData({
          [`app_feedback.time`]:res.data.app_feedback.time,
          raw_stars:res.data.app_feedback.stars
        })
      }
    })
    this.data.app_feedback.time+=1
    this.data.raw_stars=Math.ceil((this.data.raw_stars*(this.data.app_feedback.time-1)+this.data.index)/this.data.app_feedback.time)
    this.setData({
      [`app_feedback.time`]:this.data.app_feedback.time,
      [`app_feedback.stars`]:this.data.raw_stars,
      [`app_feedback.text`]:this.data.input
    })
    console.log(this.data.app_feedback)
    db.collection('users').doc(app.globalData.openid).update({
      data:{
        app_feedback:this.data.app_feedback
      },
      success: function(res) {
        console.log("app_feedback added")
        console.log(this.data.app_feedback)
      }
    })
  }
})