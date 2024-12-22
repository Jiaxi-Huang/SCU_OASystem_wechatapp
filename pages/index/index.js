//index.js
//获取应用实例
// var app = getApp();
Page({
  data: {
    indexmenu:[],
    imgUrls: []
  },
  onLoad:function(){
    //生命周期函数--监听页面加载
    this.fetchData();
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
  },
  fetchData:function(){
    this.setData({
      indexmenu:[
        {
          'icon':'./../../images/icon_01.png',
          'text':'众创空间',
          'url':'space'
        },
        {
          'icon':'./../../images/icon_03.png',
          'text':'服务集市',
          'url':'service'
        },
        {
          'icon':'./../../images/icon_05.png',
          'text':'会议室预定',
          'url':'conference'
        },
        {
          'icon':'./../../images/icon_07.png',
          'text':'云资源申请',
          'url':'resource'
        },
        {
          'icon':'./../../images/icon_09.png',
          'text':'园区问问',
          'url':'question'
        },
        {
          'icon':'./../../images/icon_11.png',
          'text':'物业服务',
          'url':'property'
        },
        {
          'icon':'./../../images/icon_03.png',
          'text':'人事管理',
          'url':'user'
        },
        {
          'icon':'./../../images/icon_03.png',
          'text':'员工管理',
          'url':'worker'
        },
        {
          'icon':'./../../images/icon_13.png',
          'text':'入驻申请',
          'url':'apply'
        },
        {
          'icon':'./../../images/icon_26.png',
          'text':'设备管理',
          'url':'device'
        },
        {
          'icon':'./../../images/icon_13.png',
          'text':'待办事项',
          'url':'todo'
        },
        {
          'icon':'./../../images/icon_05.png',
          'text':'会议',
          'url':'meeting'
        },
      ],
      imgUrls: [
        '../../images/working.gif'
      ]
    })
  },
  changeRoute:function(url){
    wx.navigateTo({
      url: `../${url}/${url}`
    });
  },
  onReady:function(){
    //生命周期函数--监听页面初次渲染完成
    // console.log('onReady');
  },
  onShow :function(){
    //生命周期函数--监听页面显示
    // console.log('onShow');
  },
  onHide :function(){
    //生命周期函数--监听页面隐藏
    // console.log('onHide');
  },
  onUnload :function(){
    //生命周期函数--监听页面卸载
    // console.log('onUnload');
  },
  onPullDownRefresh:function(){
    //页面相关事件处理函数--监听用户下拉动作
    // console.log('onPullDownRefresh');
  },
  onReachBottom:function(){
    //页面上拉触底事件的处理函数
    // console.log('onReachBottom');
  }
})
