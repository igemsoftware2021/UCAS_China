var app = getApp()
var temp = []
Page({
    data: {
        inputData:'HC-08',
        deviceId:'FC:45:C3:D7:63:BF',
        consoleLog:[],
        services:'0000ffe0-0000-1000-8000-00805f9b34fb',
        notifyId:'00002902-0000-1000-8000-00805f9b34fb',
        writeId:'0000ffe1-0000-1000-8000-00805f9b34fb',
        myDevice:'',
        receive:'',
        number:0,
        constID:"FC:45:C3:D7:63:BF",
        bug:'',
        cupName:'CoffeeCup',
        prompt:'100X',
        receive:'',
    },
    onLoad() {
    },
    say:function(words){
       //this.setData({consoleLog:words})
       this.setData({
         consoleLog: this.data.consoleLog.concat(words)
       });
       this.setData({
         consoleLog: this.data.consoleLog.concat('\n')
       });
    },
   startAll:function(){
     this.say('wait and see')
     this.initBlue()
   },
   initBlue:function(){
     var that = this;
     wx.openBluetoothAdapter({//调用微信小程序api 打开蓝牙适配器接口
       success: function (res) {
         // that.say(res)
         wx.showToast({
           title: '打开适配器接口成功',
           icon: 'success',
           duration: 800
         })
         that.findBlue();//2.0
         that.say('打开适配器接口成功')
       },
       fail: function (res) {//如果手机上的蓝牙没有打开，可以提醒用户
         wx.showToast({
           title: '请开启蓝牙',
           icon: 'fails',
           duration: 1000
         })
         that.say('请开启蓝牙')
       }
     })
   },
   findBlue(){
     var that = this
     wx.startBluetoothDevicesDiscovery({
       allowDuplicatesKey: false,
       interval: 0,
       success: function (res) {   
         wx.showLoading({
           title: '正在搜索设备',
         })
         that.say('正在搜索设备')
         that.getBlue()//3.0
       }
     })
   },
   getBlue(){
     this.setData({consoleLog:[]})
     this.say('调用getBlue                   ')
     var that = this
     wx.getBluetoothDevices({
       success: function(res) {
         wx.hideLoading();
         that.setData({number:res.devices.length})
         for (var i = 0; i < res.devices.length; i++){
           that.say(res.devices[i].name+'at'+res.devices[i].deviceId)
           that.setData({bug:typeof(res.devices[i].deviceId)})
           if (res.devices[i].name == that.data.cupName || res.devices[i].localName == that.data.cupName){
             that.setData({
               deviceId: res.devices[i].deviceId,//这里deviceID是什么？？？
               myDevice: "设备：" + res.devices[i].deviceId,
             })
            
             that.say('OKKKKK!!!!')
              that.connectBlue(res.devices[i].deviceId);//4.0
           that.connectBlue(constID);//4.0
             return;
           }
           else{
             that.say('not right')
           }
         }
       },
       fail: function(){
         that.say("搜索蓝牙设备失败")
       }
     })
   },
   //4.0通过3.0步骤找到这个蓝牙之后，通过蓝牙设备的id进行蓝牙连接
   //获取到设备之后连接蓝牙设备
   connectBlue(deviceId){                    
     var that = this;
     this.say('connectingBlue')
     wx.createBLEConnection({
       // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
       deviceId: deviceId,//设备id
       success: function (res) {
         wx.showToast({
           title: '连接成功',
           icon: 'success',
           duration: 800
         })
         that.say("连接蓝牙成功!")
         wx.stopBluetoothDevicesDiscovery({
           success: function (res) {
             that.say('连接蓝牙成功之后关闭蓝牙搜索');
           }
         })
         that.getServiceId()//5.0
       }
     })
   },
   //5.0连接上需要的蓝牙设备之后，获取这个蓝牙设备的服务uuid
   getServiceId(){
     var that = this
     wx.getBLEDeviceServices({
       // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
       deviceId: that.data.deviceId,
       success: function (res) {
         var model = res.services[0]
         that.setData({
           services: model.uuid
         })
         that.getCharacterId()//6.0
       }
     })
   },
   //6.0如果一个蓝牙设备需要进行数据的写入以及数据传输，就必须具有某些特征值，
   //所以通过上面步骤获取的id可以查看当前蓝牙设备的特征值
   getCharacterId(){
     var that = this 
     that.say('getting characterId')
     wx.getBLEDeviceCharacteristics({
       // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
       deviceId: that.data.deviceId,
       // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
       serviceId: that.data.services,
       success: function (res) {
         that.say('Id got')
 
         
         for (var i = 0; i < res.characteristics.length; i++) {//2个值
           var model = res.characteristics[i]
           that.say(model.properties.notify)
           that.say(model.uuid)
           if (model.properties.notify == true) {
             that.setData({
               notifyId: model.uuid//监听的值
             })
             that.startNotice(model.uuid)//7.0
           }
           that.say(model.properties.write)
           if (model.properties.write == true){
             that.setData({
               writeId: model.uuid//用来写入的值
             })
           }
         }
         that.setData({
           notifyId: "00002902-0000-1000-8000-00805f9b34fb"//监听的值
         })
         that.startNotice("00002902-0000-1000-8000-00805f9b34fb")//7.0
         that.setData({
           writeId: "0000ffe1-0000-1000-8000-00805f9b34fb"//用来写入的值
         })
       }
     })
   },
   startNotice(uuid){
     var that = this;
     this.say('start notice')
     wx.notifyBLECharacteristicValueChange({
       state: true, // 启用 notify 功能
       // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
       deviceId: that.data.deviceId,
       // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
       serviceId: that.data.services,
       // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
       characteristicId: uuid,  //第一步 开启监听 notityid  第二步发送指令 write
       success: function (res) {
             // 设备返回的方法
             wx.onBLECharacteristicValueChange(function (res) {
                 that.say('Receive it!')
                   // 此时可以拿到蓝牙设备返回来的数据是一个ArrayBuffer类型数据，所以需要通过一个方法转换成字符串
                   var things = that.ab2hex(res.value)
                   that.say(res.value)
                   that.setData({receive:things})
                   // var nonceId = that.ab2hex(res.value) 
                   ////////////////////////这里更改为其他的方法
                   //拿到这个值后，肯定要去后台请求服务（当前步骤根据当前需求自己书写），获取下一步操作指令写入到蓝牙设备上去
                   // wx.request({
                   // 　　method: "POST",
                   //     data: {
                   //       xx:nonceId
                   //     },
                   //     url: url,
                   // 　　success: (res) => {
                   //   　　//res.data.data.ciphertext：我这边服务返回来的是16进制的字符串，蓝牙设备是接收不到当前格式的数据的，需要转换成ArrayBuffer
                   //   　　that.sendMy(that.string2buffer(res.data.data.ciphertext))//8.0
                   //   　　// 服务器返回一个命令  我们要把这个命令写入蓝牙设备
                   //     }
                   //  })
 
             })
       }
     })
   },
   sendMy(buffer){
     var that = this 
     that.say("going to send")
     wx.writeBLECharacteristicValue({
       // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
       deviceId: that.data.deviceId,
       // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
       serviceId: that.data.services,
       // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
       characteristicId: that.data.writeId,//第二步写入的特征值
       // 这里的value是ArrayBuffer类型
       value: buffer,
       success: function (res) {
         that.say("写入成功")
       },
       fail: function () {
         that.say('写入失败')
       },
       complete:function(){
         that.say("调用结束");
       }
     })
   },
   getTemp(){
     this.sendMy('100X')
   },
   getVolu(){
     this.sendMy('101X')
   },
   getConc(){
     this.sendMy('102X')
   },
 //ps:下面是需要使用到的两个格式相互转换的方法
 /**
 * 将字符串转换成ArrayBufer
 */
   string2buffer(str) {
     let val = ""
     if(!str) return;
     let length = str.length;
     let index = 0;
     let array = []
     while(index < length){
       array.push(str.substring(index,index+2));
       index = index + 2;
     }
     val = array.join(",");
     // 将16进制转化为ArrayBuffer
     return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
       return parseInt(h, 16)
     })).buffer
   },
  
   /**
    * 将ArrayBuffer转换成字符串
    */
   ab2hex(buffer) {
     var hexArr = Array.prototype.map.call(
       new Uint8Array(buffer),
       function (bit) {
         return ('00' + bit.toString(16)).slice(-2)
       }
     )
     return hexArr.join('');
   },
})