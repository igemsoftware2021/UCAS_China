var app = getApp()
var temp = []
Page({
    data: {
        userInfo: {},
        isopen: false,
        disabled: false,
        connected: false,
        errmsg:"",
        sendMsg:[
            {id:0,func:"acquireTemp",code:"100X"},
            {id:1,func:"acquireVolume",code:"101X"},
            {id:2,func:"acquireConcent",code:"102X"},
            {id:3,func:"cycleVA",code:"103X100V10S"},
            {id:4,func:"acceptDataPoints",code:"110X"},
            {id:5,func:"calMax",code:"111X"}
        ],
        chosen_msg:0,
        write_msg:"",
        read_msg:"",
        T:0,
        L:0,
        c:0,
        cycleStart:false,
        VAData:[],
        max:{
            V:0,
            A:0
        }
    },
    choose_func:function(e){
        console.log(e)
        var that = this
        that.setData({
            chosen_msg:e.value.id
        })
    },
    switchChange: function () {
        var that = this
        that.setData({
            isopen: !that.data.isopen,
            errmsg: ""
        })
        if (that.data.isopen) {
            wx.openBluetoothAdapter({
                success: function (res) {
                    console.log(res)
                    that.setData({
                        errmsg: "功能已启用"
                    })
                    wx.onBluetoothAdapterStateChange(function (res) {
                        console.log("蓝牙适配器状态变化", res)
                        that.setData({
                            actioninfo: res.available ? "蓝牙适配器可用" : "蓝牙适配器不可用",
                            searchingstatus: res.discovering ? "正在搜索" : "搜索可用"
                        })
                    })
                    wx.onBluetoothDeviceFound(function (devices) {
                        console.log(devices)
                        temp.push(devices)
                        that.setData({
                            devices: temp
                        })
                        console.log('new device list has founded')
                        console.log('设备id' + devices.deviceId)
                        console.log('设备name' + devices.name)
                    })
                },
                fail: function (res) {
                    console.log(res)
                    that.setData({
                        errmsg: "请检查手机蓝牙是否打开"
                    })
                }
            })
        } else {
            wx.closeBluetoothAdapter({
                success: function (res) {
                    console.log(res)
                    that.setData({
                        errmsg: "功能已关闭"
                    })
                },
                fail: function (res) {
                    console.log(res)
                    that.setData({
                        errmsg: "请检查手机蓝牙是否打开"
                    })
                }
            })
        }
        console.log('bluetooth is open :' + that.data.isopen)
    },
    searchbluetooth: function () {
        var that = this
        wx.startBluetoothDevicesDiscovery({
            success: function (res) {
                console.log("开始搜索附近蓝牙设备")
                console.log(res)
            }
        })
    },
    connectTO: function (e) {
        var that = this
        console.log(e)
        wx.createBLEConnection({
            deviceId: e.currentTarget.id,
            //deviceId: "98:D3:32:30:B0:4E",
            success: function (res) {
                console.log("连接设备成功")
                console.log(res)
                that.setData({
                    connected: true,
                    connectedDeviceId: e.currentTarget.id
                })
            },
            fail: function (res) {
                console.log("连接设备失败")
                console.log(res)
                that.setData({
                    connected: false
                })
            }
        })
        wx.stopBluetoothDevicesDiscovery(function () {

        })
    },
    showbluetooth: function () {
        wx.getBluetoothDevices({
            success: function (res) {
                console.log("显示所有蓝牙设备")
                console.log(res)
            }
        })
    },
    checkbluetooth: function () {
        var that = this
        wx.getBluetoothAdapterState({
            success: function (res) {
                console.log(res)
                that.setData({
                    actioninfo: res.available ? "蓝牙适配器可用" : "蓝牙适配器不可用",
                    searchingstatus: res.discovering ? "正在搜索" : "搜索可用"
                })
            },
            fail: function (res) {
                console.log(res)
                that.setData({
                    errmsg: "获取蓝牙适配器信息失败"
                })
            }
        })
    },
    stopsearch: function () {
        wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
                console.log("停止蓝牙搜索")
                console.log(res)
            }
        })
    },
    sendtoequ: function (e) {
        var that = this
        console.log(this.data.services)
        console.log("发送消息到:deviceId" + that.data.connectedDeviceId);
        console.log("serviceId:" + that.data.services[0].uuid);
        console.log("characteristicId:" + that.data.characteristicId);

        // TODO: convert write_msg to array buffer and write
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        dataView.setUint8(0, 6)

        wx.writeBLECharacteristicValue({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: that.data.connectedDeviceId,
            // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
            serviceId: that.data.services[0].uuid,
            // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
            characteristicId: that.data.characteristicId,
            // 这里的value是ArrayBuffer类型
            value: buffer,
            success: function (res) {
                console.log(res)
                console.log('writeBLECharacteristicValue success', res.errMsg)
            }
        })
    },
    inputTextchange: function (e) {
        console.log("数据变化")
        console.log(e)
        this.setData({
            inputValue: e.detail.value
        })
    },
    getAllservice: function (e) {
        var that = this
        wx.getBLEDeviceServices({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: this.data.connectedDeviceId,
            success: function (res) {
                console.log('device services:', res.services)
                that.setData({
                    services: res.services
                })
            }
        })
    },
    linkto: function (e) {
        var that = this
        wx.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: that.data.connectedDeviceId,
            // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
            serviceId: e.currentTarget.id,
            success: function (res) {
                console.log('device getBLEDeviceCharacteristics:', res.characteristics)
                console.log(res)
                that.setData({
                    characteristicId: res.characteristics[0].uuid,
                    serviceId: e.currentTarget.id
                })
                wx.notifyBLECharacteristicValueChanged({
                    state: true, // 启用 notify 功能
                    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                    deviceId: that.data.connectedDeviceId,
                    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                    serviceId: that.data.serviceId,
                    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
                    characteristicId: that.data.characteristicId,
                    success: function (res) {
                        console.log('notifyBLECharacteristicValueChanged success', res.errMsg)
                    }
                })
            }
        })
    },
    recieveequ: function (e) {
        var that = this
        wx.onBLECharacteristicValueChange(function (characteristic) {
            console.log('characteristic value comed:')
             let buffer = characteristic.value
             let dataView = new DataView(buffer)
             console.log("接收字节长度:"+dataView.byteLength)
             console.log(dataView.getUint8(0))
             // TODO: convert array buffer to read_buffer
             var r_pos = 0
             while(read_msg[r_pos] != "\r"){
                 r_pos += 1
             }
             switch(read_msg.slice(0,1)){
                case "T":
                    that.setData({
                        T:read_msg.slice(1,r_pos).parseInt
                    })
                    break
                case "L":
                    that.setData({
                        L:read_msg.slice(1,r_pos).parseInt
                    })
                    break
                case "C":
                    if(read_msg.slice(0,2)=="CVO"){
                        that.setData({
                            cycleStart:true
                        })
                    }
                    else{
                        that.setData({
                            C:read_msg.slice(1,r_pos).parseInt
                        })
                    }
                    break
                case "D":
                    var tmpVA = {V:0,A:0}
                    var Vpos_old = 0
                    var Vpos = 0
                    var Apos_old = 0
                    var Apos = 0
                    var read_VA = []
                    while(read_msg.slice(Vpos,Vpos+1)!="\r" && read_msg.slice(Apos,Apos+1)!="\r"){
                        while(read_msg.slice(Vpos,Vpos+1)!="V"){
                            Vpos += 1
                        }
                        tmpVA.V = read_msg.slice(Vpos_old,Vpos).parseInt
                        Vpos_old = Vpos
                        Vpos += 1
                        Apos_old = Vpos
                        Apos = Vpos
                        while(read_msg.slice(Apos,Apos+1)!="V"){
                            Apos += 1
                        }
                        tmpVA.A = read_msg.slice(Apos_old,Apos).parseInt
                        Apos_old = Vpos
                        Apos += 1
                        Vpos_old = Apos
                        Vpos = Apos
                        read_VA.push(tmpVA)
                    }
                    that.setData({
                        VAData:readVA
                    })
                    break
                case "M":
                    var tmpVA = {V:0,A:0}
                    var Vpos = 0
                    var Apos = 0
                    while(read_msg.slice(Vpos,Vpos+1)!="V"){
                        Vpos += 1
                    }
                    tmpVA.V = read_msg.slice(Vpos_old,Vpos).parseInt
                    Vpos += 1
                    Apos = Vpos
                    while(read_msg.slice(Apos,Apos+1)!="V"){
                        Apos += 1
                    }
                    tmpVA.A = read_msg.slice(Apos_old,Apos).parseInt
                    Apos += 1
                    Vpos = Apos
                    that.setData({
                        max:tmpVA
                    })
             }
        })
        wx.readBLECharacteristicValue({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: that.data.connectedDeviceId,
            // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
            serviceId: that.data.serviceId,
            characteristicId: that.data.characteristicId,
            success: function (res) {
                console.log('readBLECharacteristicValue:')
                console.log(res)
            }
        })
    }
})