Page({
  data: {
    longitude:104,
    latitude:30,
    scale:15,
    direction:0,
    speed:0,
    address:'',
    accuracy:0,
    altitude:0,
    energy:0,
    markers:{},
    showControlPanel:true,
    //以上是地图用的
    timer: null,
  },
  onLoad: function (options) {
    this.setMapHeight();
    this.getMyLocation();
  },
  setMapHeight(){
    var that = this;
    wx.getSystemInfo({        //地图全屏显示-https://www.likecs.com/show-203386963.html
      success: function(res) {
        that.setData({
          height: res.windowHeight    //wxml的map的style="width: 100%; height: {{height}}px;"，就可以用这个
        })
      },
    })
  },
  getMyLocation(){
    let that = this
    wx.getLocation({
      type: 'wgs84',    //gcj02
      success(res) {
        console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      },
      fail(res){
        console.log(res);
      }
    })
  },
  startAutoLocation(){
    let that=this;
    var monitorTimer = null;
    monitorTimer=setInterval(function () {
      that.getMyLocation();
    },5000);
    this.setData({timer:monitorTimer});
  },
})