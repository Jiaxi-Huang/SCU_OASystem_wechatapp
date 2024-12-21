Page({
  data: {
    showsearch:false,   //显示搜索按钮
    searchtext:'',  //搜索文字
    filterdata:{},  //筛选条件数据
    showfilter:false, //是否显示下拉筛选
    showfilterindex:null, //显示哪个筛选类目
    sortindex:0,  //一级分类索引
    sortid:null,  //一级分类id
    subsortindex:0, //二级分类索引
    subsortid:null, //二级分类id
    cityindex:0,  //一级城市索引
    cityid:null,  //一级城市id
    subcityindex:0,  //二级城市索引
    subcityid:null, //二级城市id
    servicelist:[], //服务集市列表
    scrolltop:null, //滚动位置
    page: 0,  //分页
    isAdmin: false,
    isMyLeaveShow: true,
    isNotifyLeaveShow: false,
    isReviewLeaveShow: false,
    isAdminLeaveshow: false,
    tableData: [], // 用来存储当前显示的表格数据
    myData: [],
    reviewData: [],
    notifyData: [],
    adminData: [],
  },
  onLoad: function () { //加载数据渲染页面
    this.fetchServiceData();
    this.fetchFilterData();
    this.getRole();
    this.getLeaveList();
  },
  fetchFilterData:function(){ //获取筛选条件
    this.setData({
      filterdata:{
        "sort": [],
        "city": [],
      }
    })
  },
  fetchServiceData:function(){  //获取城市列表
    let _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    const perpage = 10;
    this.setData({
      page:this.data.page+1
    })
    const page = this.data.page;
    const newlist = [];
    for (var i = (page-1)*perpage; i < page*perpage; i++) {
      newlist.push({
        "id":i+1,
        "name":"上海拜特信息技术有限公司"+(i+1),
        "city":"上海",
        "tag":"法律咨询",
        "imgurl":"http://img.mukewang.com/57fdecf80001fb0406000338-240-135.jpg"
      })
    }
    setTimeout(()=>{
      _this.setData({
        servicelist:_this.data.servicelist.concat(newlist)
      })
    },1500)
  },
  getRole:function(){  //获取用户角色
    let _this = this;
    const accessToken = wx.getStorageSync('accessToken');
    wx.request({
      url: 'http://localhost:8080/api/leaveApproval/getRole',
      method: 'POST',
      data:{
        accessToken: accessToken
      },
      success: function(res){
        if(res.data.status == 0){
          if(res.data.data[0] == 'admin'){
            _this.setData({
              isAdmin: true
            })
          }
        }
      }
    })
  },
  getLeaveList: function() {
    try {
      const accessToken = {'accessToken':wx.getStorageSync('accessToken')}
      // 获取我的请假记录
      wx.request({
        url: 'http://localhost:8080/api/leaveApproval/getMyLeaveRecord', 
        method: 'POST',
        data: accessToken,
        success: (res) => {
          if (res.data) {
            this.setData({
              myData: res.data.data.map(item => ({
                leave_id: item.leave_id,
                leave_user_id: item.user_id,
                leave_review_user_id: item.review_user_id,
                leave_start_time: item.start_date,
                leave_end_time: item.end_date,
                leave_type: item.type,
                leave_reason: item.reason,
                leave_status: item.status,
                leave_submitted_at: item.submitted_at,
              }))
            });
          } else {
            console.log('postGetLeaveApproval RES MISS');
          }
        },
        fail: (error) => {
          console.log('请求失败:', error);
        }
      });
      // 获取审批的请假记录
      wx.request({
        url: 'http://localhost:8080/api/leaveApproval/getReviewLeaveRecord', 
        method: 'POST',
        data: accessToken,
        success: (res) => {
          if (res.data.data) {
            this.setData({
              reviewData: res.data.data.map(item => ({
                leave_id: item.leave_id,
                leave_user_id: item.user_id,
                leave_review_user_id: item.review_user_id,
                leave_start_time: item.start_date,
                leave_end_time: item.end_date,
                leave_type: item.type,
                leave_reason: item.reason,
                leave_status: item.status,
                leave_submitted_at: item.submitted_at,
              }))
            });
          } else {
            console.log('postGetLeaveApproval RES MISS');
          }
        },
        fail: (error) => {
          console.log('请求失败:', error);
        }
      });
      // 获取抄送的请假记录
      wx.request({
        url: 'http://localhost:8080/api/leaveApproval/getNotifyLeaveRecord', 
        method: 'POST',
        data: accessToken,
        success: (res) => {
          if (res.data) {
            this.setData({
              notifyData: res.data.data.map(item => ({
                leave_id: item.leave_id,
                leave_user_id: item.user_id,
                leave_review_user_id: item.review_user_id,
                leave_start_time: item.start_date,
                leave_end_time: item.end_date,
                leave_type: item.type,
                leave_reason: item.reason,
                leave_status: item.status,
                leave_submitted_at: item.submitted_at,
              }))
            });
          } else {
            console.log('postGetLeaveApproval RES MISS');
          }
        },
        fail: (error) => {
          console.log('请求失败:', error);
        }
      });
      // 如果是管理员，获取管理员的请假记录
      console.log("isAdmin: ", this.data.isAdmin);
      if (this.data.isAdmin) {
        console.log("管理员")
        wx.request({
          url: 'http://localhost:8080/api/leaveApproval/getAdminLeaveRecord', 
          method: 'POST',
          data: accessToken,
          success: (res) => {
            if (res.data) {
              this.setData({
                adminData: res.data.data.map(item => ({
                  leave_id: item.leave_id,
                  leave_user_id: item.user_id,
                  leave_review_user_id: item.review_user_id,
                  leave_start_time: item.start_date,
                  leave_end_time: item.end_date,
                  leave_type: item.type,
                  leave_reason: item.reason,
                  leave_status: item.status,
                  leave_submitted_at: item.submitted_at,
                }))
              });
              console.log("adminData: ", this.data.adminData);
            } else {
              console.log('postGetLeaveApproval RES MISS');
            }
          },
          fail: (error) => {
            console.log('请求失败:', error);
          }
        });
      }

    } catch (err) {
      console.log('错误:', err.message);
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 2000
      });
    }
  },
  // 显示 "我的请假申请" 表格
  showMyLeave: function() {
    this.setData({
      isMyLeaveShow: true,
      isReviewLeaveShow: false,
      isNotifyLeaveShow: false,
      isAdminLeaveShow: false,
      tableData: this.data.myData // 设置当前表格的数据为 "我的请假申请" 数据
    });
    // console.log("tableData: ", this.data.tableData);
  },
  // 显示 "我处理的请假申请" 表格
  showReviewLeave: function() {
    this.setData({
      isMyLeaveShow: false,
      isReviewLeaveShow: true,
      isNotifyLeaveShow: false,
      isAdminLeaveShow: false,
      tableData: this.data.reviewData // 设置当前表格的数据为 "我处理的请假申请" 数据
    });
  },
  // 显示 "抄送给我的请假申请" 表格
  showNotifyLeave: function() {
    this.setData({
      isMyLeaveShow: false,
      isReviewLeaveShow: false,
      isNotifyLeaveShow: true,
      isAdminLeaveShow: false,
      tableData: this.data.notifyData // 设置当前表格的数据为 "抄送给我的请假申请" 数据
    });
  },
  // 显示 "管理员请假记录" 表格
  showAdminLeave: function() {
    this.setData({
      isMyLeaveShow: false,
      isReviewLeaveShow: false,
      isNotifyLeaveShow: false,
      isAdminLeaveShow: true,
      tableData: this.data.adminData // 设置当前表格的数据为 "管理员请假记录" 数据
    });
  },
  addLeave: function() {
    navigator.navigateTo({
      url: '/pages/leave/addLeave/addLeave'
    })
  },
  inputSearch:function(e){  //输入搜索文字
    this.setData({
      showsearch:e.detail.cursor>0,
      searchtext:e.detail.value
    })
  },
  submitSearch:function(){  //提交搜索
    console.log(this.data.searchtext);
    this.fetchServiceData();
  },
  scrollHandle:function(e){ //滚动事件
    this.setData({
      scrolltop:e.detail.scrollTop
    })
  },
  goToTop:function(){ //回到顶部
    this.setData({
      scrolltop:0
    })
  },
  scrollLoading:function(){ //滚动加载
    this.fetchServiceData();
  },
  onPullDownRefresh:function(){ //下拉刷新
    this.setData({
      page:0,
      servicelist:[]
    })
    this.fetchServiceData();
    this.fetchFilterData();
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  }
})