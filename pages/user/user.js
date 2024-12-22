Page({
  data: {
    isFiltered:false,
    searchtext:'',  //搜索文字
    filterlist:[],  //筛选条件数据
    filterchoice:{departments: [], roles: []},//显示筛选条件项
    currentFilters: { // 当前应用的筛选条件
      department: '',
      role: ''
    },
    showfilter:false, //是否显示下拉筛选
    showfilterindex:0,
    userlist:[], //服务集市列表
    scrolltop:null, //滚动位置
    page: 0  //分页
  },
  onLoad: function () { //加载数据渲染页面
    this.fetchServiceData();
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
    wx.request({
      url: 'http://localhost:8080/api/admin/user/list',
      method:"POST",
      data:{
        accessToken:wx.getStorageSync('accessToken')
      },
      success: res=>{
        console.log("查询用户成功")
        for(var item of res.data.data){
          newlist.push(item)
        }
        _this.setData({
          userlist:_this.data.userlist.concat(newlist),
          filterlist:_this.data.filterlist.concat(newlist)
        })
        this.fetchFilterData();
      },
      fail: res=>{
        console.log(res.data.message)
      }
    })
  },
  inputSearch:function(e){  //输入搜索文字
    this.setData({
      showsearch:e.detail.cursor>0,
      searchtext:e.detail.value
    })
  },
  submitSearch:function(){  //提交搜索
    const searchText = this.data.searchtext.toLowerCase();
    if(searchText != ''){
    var filteredList = this.data.userlist.filter(item =>
      item.userName.toLowerCase().includes(searchText) ||
      item.userDepartment.toLowerCase().includes(searchText) ||
      item.userRole.toLowerCase().includes(searchText) ||
      item.userPhone.includes(searchText)
    );
    console.log("筛选用户成功")
    console.log(filteredList)
    this.setData({
      filterlist: filteredList,
      isFiltered: true
    });
  }
  else{
    this.setData({
      isFiltered: false
    });
  }
  },
  //获取筛选数据
  fetchFilterData: function() {
    const uniqueDepartments = this.getUniqueDepartments();
    const uniqueRoles = this.getUniqueRoles();
    this.setData({
      'filterchoice.departments': uniqueDepartments,
      'filterchoice.roles': uniqueRoles
    });
    console.log("查询筛选项成功")
  },
  getUniqueDepartments: function() {
    return ["全部", ...new Set(this.data.userlist.map(item => item.userDepartment))];
  },

  getUniqueRoles: function() {
    return ["全部", ...new Set(this.data.userlist.map(item => item.userRole))];
  },
  //展开筛选面板
  setFilterPanel: function(e){
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if(d.showfilterindex == i){
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    }else{    
      this.setData({
        showfilter: true,
        showfilterindex:i,
      })
    }
  },
  //展示筛选项
  selectFilter: function(e) {
    const data = e.currentTarget.dataset;
    const filterIndex = this.data.showfilterindex;
    const filterKey = (filterIndex== 1 ? 'department' : 'role');
    const newValue = (data.value == '全部' ? '' : data.value);
    this.setData({
      [`currentFilters.${filterKey}`]: newValue
    });
    // Apply the selected filter
    const filteredList = this.applyFilters();
    this.setData({
      filterlist: filteredList
    });
    this.hideFilter();
  },
  //搜索筛选项
  applyFilters: function() {
    const { department, role } = this.data.currentFilters;
    var filteredList=this.data.userlist;
    if(department || role){
      filteredList = filteredList.filter(item => {
        const matchesDepartment = !department || item.userDepartment.toLowerCase().includes(department.toLowerCase());
        const matchesRole = !role || item.userRole.toLowerCase().includes(role.toLowerCase());
        return matchesDepartment && matchesRole;
      });
      this.setData({
        filterlist: filteredList,
        isFiltered: true // 设置为已过滤
      });
  }
  else{
    this.setData({
      isFiltered: false 
    });
  }
  },
  clearFilters: function() {
    this.setData({
      filterlist: this.data.userlist,
      isFiltered: false,
      currentFilters: {
        department: '全部',
        role: '全部'
      }
    });
  },

  hideFilter: function() {
    this.setData({
      showfilter: false,
      showfilterindex: null
    });
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
      userlist:[]
    })
    this.fetchServiceData();
    this.fetchFilterData();
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  }
})