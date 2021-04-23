// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    session: null,
    avatarUrl: null,
    userInfo: null,
    form_content: [{
        index: 0,
        prop: 'height',
        title: '身高',
        placeholder: '请输入身高（省略单位：cm）'
      },
      {
        index: 1,
        prop: 'weight',
        title: '体重',
        placeholder: '请输入体重（省略单位：kg）'
      },
      {
        index: 2,
        prop: 'age',
        title: '年龄',
        placeholder: '请输入年龄（省略单位：岁）'
      }
    ],
    people: ['黄种人', '白种人', '黑种人', '其他'],
    peopleIndex: 0,
    gender: [{
      value: 0,
      name: '男'
    }, {
      value: 1,
      name: '女'
    }],
    liver: [{
      value: 0,
      name: '有'
    }, {
      value: 1,
      name: '无'
    }],
    liver_fill: 0,
    cigarette: 0,
    agree: false,
    formData: {
    },
    showTopTips: false,
    rules: [{
        name: 'height',
        rules: {required: true, message: '身高是必选项'},
    }, {
        name: 'weight',
        rules: {required: true, message: '体重是必选项'},
    }, {
        name: 'age',
        rules: {required: true, message: '年龄是必选项'},
    }, {
        name: 'gender',
        rules: {required: true, message: '性别是必选项'},
    }, {
        name: 'liver',
        rules: {required: true, message: '肝脏疾病是必选项'},
    }, {
        name: 'cigaratte',
        rules: {required: true, message: '吸烟频繁程度必填'},
    }, {
        name: 'agree',
        rules: {required: true, message: '请勾选同意隐私政策'},
    }],
    btn_disabled:true,
  },

  genderChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.gender,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      gender: checkboxItems,
      [`formData.gender`]: e.detail.value
    });
  },

  liverChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.liver,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      liver: checkboxItems,
      [`formData.liver`]: e.detail.value,
    });
    if(checkboxItems[0].checked==true){
      this.setData({
        liver_fill:1
      })
    }
  },

  sliderchange(e) {
    this.setData({
      cigarette: e.detail.value,
      [`formData.cigaratte`]: e.detail.value,
    })
  },

  bindPeopleChange: function (e) {
    console.log('picker 人种 发生选择改变，携带值为', e.detail.value);

    this.setData({
      peopleIndex: e.detail.value
    })
  },

  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  checkboxChange: function (e) {
    this.setData({
      agree: true,
      [`formData.agree`]: e.detail.value,
    });
  },
  bindAgreeChange: function (e) {
      this.setData({
          agree: e.detail.value.length
      });
      if (e.detail.value.length==1){
       this.setData({
         btn_disabled:false,
       })
     }else{
        console.log(e.detail.value.length)
       this.setData({
         btn_disabled:true
       })
     }
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        wx.showToast({
          title: '校验通过'
        })
        const db = wx.cloud.database()
        db.collection('users').where({
          _openid:this.data.openid
        }).add({
          data:{
            basic_arg:formData
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
            wx.redirectTo({
              url: '../index/index?hasUserInfo=1',
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: app.globalData.openid,
      session: app.globalData.session,
      avatarUrl: app.globalData.avatarUrl,
      userInfo: app.globalData.userInfo
    })
    console.log(app.globalData.avatarUrl)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})