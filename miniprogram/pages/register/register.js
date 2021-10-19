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
        title: 'Height',
        placeholder: '  Please enter your height (unit: cm)'
      },
      {
        index: 1,
        prop: 'weight',
        title: 'Weight',
        placeholder: '  Please enter weight (unit: kg)'
      },
      {
        index: 2,
        prop: 'age',
        title: 'Age',
        placeholder: '  Please enter age (years old)'
      }
    ],
 
    gender: [{
      value: 0,
      name: 'Male'
    }, {
      value: 1,
      name: 'Famle'
    }, {
      value: 2,
      name: 'Unspecified'
    }],
    liver: [{
      value: 0,
      name: 'Yes'
    }, {
      value: 1,
      name: 'No'
    }],
    liver_fill: 0,
    cigarette: 0,
    agree: false,
    formData: {
    },
    showTopTips: false,
    rules: [{
        name: 'height',
        rules: {required: true, message: 'Height is a must choice'},
    }, {
        name: 'weight',
        rules: {required: true, message: 'Wight is a must choice'},
    }, {
        name: 'age',
        rules: {required: true, message: 'Age is a must choice'},
    }, {
        name: 'gender',
        rules: {required: true, message: 'Gender is a must choice'},
    }, {
        name: 'liver',
        rules: {required: true, message: 'Liver disease is a must choice'},
    }, {
        name: 'cigaratte',
        rules: {required: false, message: 'Cigaratte is a must choice'},
    }, {
        name: 'agree',
        rules: {required: true, message: 'You must agree'},
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
    else{
      this.setData({
        liver_fill:0
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
  bindAgreeChange: function (e) {
    console.log(this.data.agree)
    console.log(e.detail.value.length)
    console.log(e.detail.value)
    this.setData({
      [`formData.agree`]: this.data.agree
    })
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
        console.log(this.data.openid)
        console.log(this.data.formData)
        const db = wx.cloud.database()
        db.collection('users').add({
          data:{
            _id:this.data.openid,
            basic_arg:this.data.formData
          },
          success: function(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
            app.globalData.indatabase = true
            let pages = getCurrentPages(); // 当前页的数据，
            let prevPage = pages[pages.length - 2]; // 上一页的数据
            prevPage.setData({
              hasUserInfo:true
            })
            wx.navigateBack({
              delta: 1
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