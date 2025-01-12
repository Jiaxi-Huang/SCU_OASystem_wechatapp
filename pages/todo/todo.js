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
    flitered_list:[],
  },
  onLoad: function (options) { //加载数据渲染页面
    // this.fetchServiceData();
    this.fetchFilterData();
    if (!options.showUncompleted) {
      this.getTodoRecord();
    } else{
      this.setPrimSort();
    }
    
    
  },
  refresh:function(){ //获取筛选条件
    this.setData({
      flitered_list: this.data.todo_list,
    })
  },
  fetchFilterData:function(){ //获取筛选条件
    this.setData({
      filterdata:{
        "sort": [
          {"id": 0,
          "title": "已完成",
          } ,
          {"id": 1,
          "title": "未完成",
          } ,
      ],
      }
    })
  },
  fetchServiceData:function(){ 
    let _this = this;
    const key = _this.data.searchtext;
    console.log(key);
    let temp_list = [];
    _this.data.todo_list.forEach(record => {
      if (record.todo_title.includes(key)) {
        console.log(record.todo_title + "ok");
        temp_list.push(record);
      }
    });
    _this.setData({
      flitered_list: temp_list
    })
  },
  inputSearch:function(e){  //输入搜索文字
    this.setData({
      showsearch:e.detail.cursor>0,
      searchtext:e.detail.value
    })
  },
  submitSearch:function(){  //提交搜索
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
    // console.log(d.showfilterindex);
  },
  setSortIndex:function(e){
    const dataset = e.currentTarget.dataset;
    this.setData({
      showfilter: 0,
    })
    const key = dataset.sortid? '未完成':'已完成';
    // console.log(key);
    let temp_list = [];
    let _this = this;
    _this.data.todo_list.forEach(record => {
      if (record.todo_fin === key) {
        // console.log(record.todo_title + "ok");
        temp_list.push(record);
      }
    });
    _this.setData({
      flitered_list: temp_list
    })
  },

  setPrimSort:function(){
    let that = this;
    console.log("setPrimSort");
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        const accessToken = res.data;
        wx.request({
          url: 'http://localhost:8080/api/todolist/getRec',
          data:{accessToken: accessToken},
          method: 'POST',
          success:function(res) {
            // console.log("records get!");
            // 使用 setData 更新 todo_list 并确保图片路径正确
            that.setData({
              todo_list: res.data.data.map(item => {
                  item.url = item.todo_fin === "已完成" ? "/images/radiofill.png" : "/images/radio.png";
                  return item;
              }),
            }, () => {
              that.setData({
                flitered_list: that.data.todo_list,
              }, ()=> {
                let temp_list = [];
                that.data.todo_list.forEach(record => {
                  if (record.todo_fin === '未完成') {
                    temp_list.push(record);
                  }
                });
                that.setData({
                  flitered_list: temp_list
                })
              })
            });
          },
        })
      },
      fail: function(err) {
        console.error('获取accessToken失败:', err);
      }
    });
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
    // console.log("执行到getTodoRecord了");
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        const accessToken = res.data;
        wx.request({
          url: 'http://localhost:8080/api/todolist/getRec',
          data:{accessToken: accessToken},
          method: 'POST',
          success:function(res) {
            // console.log("records get!");
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
    // console.log("执行到handleGetTodoResult了");
    let that = this;
    // 使用 setData 更新 todo_list 并确保图片路径正确
    that.setData({
      todo_list: res.data.data.map(item => {
          item.url = item.todo_fin === "已完成" ? "/images/radiofill.png" : "/images/radio.png";
          return item;
      }),
    }, () => {
      that.setData({
        flitered_list: that.data.todo_list,
      })
    });
  },
  onModifyRecord:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'todo_modify?record=' + record,
    });
  },
  onInfo:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'todo_info?record=' + record,
    });
  },
  goBackUpdateInfo:function ()  { //e is "event"
    this.getTodoRecord();
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