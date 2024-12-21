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
    todo_list:[],
  },
  onLoad: function () { //加载数据渲染页面
    this.fetchServiceData();
    this.fetchFilterData();
    // console.log("getTodoRecord");
    this.getTodoRecord();
  },
  fetchFilterData:function(){ //获取筛选条件
    this.setData({
      filterdata:{
        "sort": [
            {
                "id": 0,
                "title": "全部"
            },
            {
              "id": 1,
              "title": "人力资源",
              "subsort": [
                {
                    "id": 1,
                    "title": "全部"
                },
                {
                    "id": 11,
                    "title": "社会及商业保险"
                },
                {
                    "id": 12,
                    "title": "招聘、猎头"
                },
                {
                    "id": 13,
                    "title": "薪酬绩效"
                },
              ]
            },
            {
              "id": 2,
              "title": "财务法务",
              "subsort": [
                {
                    "id": 2,
                    "title": "全部"
                },
                {
                    "id": 21,
                    "title": "知识产权保护"
                },
                {
                    "id": 22,
                    "title": "工商注册"
                },
                {
                    "id": 23,
                    "title": "法律咨询"
                },
              ]
            },
            {
              "id": 3,
              "title": "行政办公",
              "subsort": [
                {
                    "id": 3,
                    "title": "全部"
                },
                {
                    "id": 31,
                    "title": "翻译"
                },
                {
                    "id": 32,
                    "title": "速记"
                }
              ]
            },
            {
              "id": 4,
              "title": "创业指导",
              "subsort": [
                {
                    "id": 4,
                    "title": "全部"
                },
                {
                    "id": 41,
                    "title": "创业培训"
                }
              ]
            },
        ],
        "city": [
            {
                "id": 0,
                "title": "全部"
            },
            {
              "id": 1,
              "title": "湖北省",
              "subcity": [
                {
                    "id": 1,
                    "title": "全部"
                },
                {
                    "id": 11,
                    "title": "武汉市"
                },
                {
                    "id": 12,
                    "title": "襄阳市"
                },
                {
                    "id": 13,
                    "title": "孝感市"
                },
                {
                    "id": 14,
                    "title": "随州市"
                },
                {
                    "id": 15,
                    "title": "荆州市"
                },
                {
                    "id": 16,
                    "title": "黄冈市"
                },
                {
                    "id": 17,
                    "title": "天门市"
                },
                {
                    "id": 18,
                    "title": "仙桃市"
                },
                {
                    "id": 19,
                    "title": "潜江市"
                },
                {
                    "id": 20,
                    "title": "十堰市"
                },
                {
                    "id": 21,
                    "title": "宜昌市"
                },
                {
                    "id": 22,
                    "title": "咸宁市"
                },
              ]
            },
            {
              "id": 2,
              "title": "浙江省",
              "subcity": [
                {
                    "id": 2,
                    "title": "全部"
                },
                {
                    "id": 21,
                    "title": "杭州市"
                },
                {
                    "id": 22,
                    "title": "金华市"
                },
                {
                    "id": 23,
                    "title": "义乌市"
                },
              ]
            },
            {
              "id": 3,
              "title": "江苏省",
              "subcity": [
                {
                    "id": 3,
                    "title": "全部"
                },
                {
                    "id": 31,
                    "title": "南京市"
                },
                {
                    "id": 32,
                    "title": "苏州市"
                }
              ]
            }
        ],
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
  setFilterPanel: function(e){ //展开筛选面板
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
    console.log(d.showfilterindex);
  },
  setSortIndex:function(e){ //服务类别一级索引
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex:dataset.sortindex,
      sortid:dataset.sortid,
      subsortindex: d.sortindex==dataset.sortindex ? d.subsortindex:0
    })
    console.log('服务类别id：一级--'+this.data.sortid+',二级--'+this.data.subsortid);
  },
  setSubsortIndex:function(e){ //服务类别二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subsortindex:dataset.subsortindex,
      subsortid:dataset.subsortid,
    })
    console.log('服务类别id：一级--'+this.data.sortid+',二级--'+this.data.subsortid);
  },
  setCityIndex:function(e){ //服务城市一级索引
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      cityindex:dataset.cityindex,
      cityid:dataset.cityid,
      subcityindex: d.cityindex==dataset.cityindex ? d.subcityindex:0
    })
    console.log('服务城市id：一级--'+this.data.cityid+',二级--'+this.data.subcityid);
  },
  setSubcityIndex:function(e){ //服务城市二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subcityindex:dataset.subcityindex,
      subcityid:dataset.subcityid,
    })
    console.log('服务城市id：一级--'+this.data.cityid+',二级--'+this.data.subcityid);
  },
  hideFilter: function(){ //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
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
  },
  getTodoRecord:function() {
    let that = this;
    console.log("执行到getTodoRecord了");
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        const accessToken = res.data;
        wx.request({
          url: 'http://localhost:8080/api/todolist/getRec',
          data:{accessToken: accessToken},
          method: 'POST',
          success:function(res) {
            console.log("records get!");
            that.handleGetTodoResult(res);
          },
          fail:function(res) {
              
          }
        })
      },
      fail: function(err) {
        // 如果获取失败，这里会执行
        console.error('获取accessToken失败:', err);
      }
    });
  },
  handleGetTodoResult:function(res) {
    console.log("执行到handleGetTodoResult了");
    let that = this;
    // 使用 setData 更新 todo_list 并确保图片路径正确
    that.setData({
      todo_list: res.data.data.map(item => {
          item.url = item.todo_fin === "已完成" ? "/images/radiofill.png" : "/images/radio.png";
          return item;
      })
    }, () => {
        // console.log(that.data.todo_list);  // 打印更新后的 todo_list
    });
  },
  onModifyRecord:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'todo_modify?record=' + record,
    });
  },
  onDeleteRecord:function (e) {
    var todo_id = e.target.dataset.todo_id;
    wx.showModal({
      cancelColor: "cancelColor",
      title: '提示',
      content: '确认要删除ID '+ todo_id + '的记录吗',
      complete: (res) => {
        if (res.confirm) {
          let that = this;
          wx.request({
          url: 'http://localhost:8080/api/todolist/deleteTodo',
            method: 'POST',
            data:{"todo_id":todo_id},
            success:function(res) {
              that.getTodoRecord();
            },
            fail:function(res) {
              console.log("失败");
            }
          })
       }
      }
    })
  },
  onStatusChange:function (e) {
    var record = e.target.dataset.record;
    record.todo_fin = record.todo_fin === '未完成' ? '已完成' : '未完成';
    let that = this;
    wx.request({
      url: 'http://localhost:8080/api/todolist/modifyRec',
      method: 'POST',
      data: record,
      success:function(res) {
        that.getTodoRecord();
      },
      fail:function(res) {
        console.log("Modify失败");
      }
    })
  },
  onAddRecord:function () {
    wx.navigateTo({
      url: 'todo_add',
    });
  }
})