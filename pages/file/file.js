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
    file_list:[],
    flitered_list:[],
  
  },
  onLoad: function () { //加载数据渲染页面
    // this.fetchServiceData();
    this.fetchFilterData();
    // console.log("getTodoRecord");
    this.getTodoRecord();
  },
  refresh:function(){ //获取筛选条件
    this.setData({
      flitered_list: this.data.file_list,
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
    _this.data.file_list.forEach(record => {
      if (record.fileName.includes(key)) {
        console.log(record.fileName + "ok");
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
    console.log(key);
    let temp_list = [];
    let _this = this;
    _this.data.file_list.forEach(record => {
      if (record.remark === key) {
        console.log(record.todo_title + "ok");
        temp_list.push(record);
      }
    });
    _this.setData({
      flitered_list: temp_list
    })
  },
  setSubsortIndex:function(e){ //服务类别二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subsortindex:dataset.subsortindex,
      subsortid:dataset.subsortid,
    })
    // console.log('服务类别id：一级--'+this.data.sortid+',二级--'+this.data.subsortid);
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
    // console.log("执行到getTodoRecord了");
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        const accessToken = res.data;
        wx.request({
          url: 'http://localhost:8080/api/file/loadFile',
          data:{
                acsTkn: accessToken,
                dirId:0       
              },
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
    // console.log("执行到handleGetTodoResult了");
    let that = this;
    // 使用 setData 更新 todo_list 并确保图片路径正确
    res.data.data.pop();
    res.data.data.pop();
    res.data.data.pop();
    console.log(res.data.data);
    that.setData({
      
      file_list: res.data.data.map(item => {

        if(item.size >= 1024 * 1024 * 1024){
          item.size = Math.round(item.size / (1024 * 1024 * 1024) * 10) / 10 + "GB"
        }else if(item.size >= 1024 * 1024){
          item.size = Math.round(item.size / (1024 * 1024) * 10) / 10 + "MB"
        }else if(item.size >= 1024){
          item.size = Math.round(item.size / 1024  * 10) / 10 + "KB"
        }else{
          item.size = item.size + "字节"
        }

        if(item.ext === "jpg"||item.ext === "png"){
          item.imageUrl = item.url
        }
        else if(item.ext === "docx"||item.ext === "doc"){
          item.imageUrl = "/images/doc.jpg"
        }
        else if(item.ext === "pptx"){
          item.imageUrl = "/images/pptx.jpg"
        }
        else if(item.ext === "pdf"){
          item.imageUrl = "/images/pdf.jpg"
        }
        else if(item.ext === "xls"||item.ext === "xlsx"){
          item.imageUrl = "/images/excel.jpg"
        }
        else if(item.ext === "txt"){
          item.imageUrl = "/images/txt.jpg"
        }
        else if(item.ext === "rar"||item.ext === "zip"||item.ext === "7z"){
          item.imageUrl = "/images/rar.jpg"
        }
        else{
          item.imageUrl = "/images/unknown.jpg"
        }
        
        return item;
      }),
    }, () => {
      that.setData({
        flitered_list: that.data.file_list,
      })
    });
  },
  
  onModifyRecord:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'file_modify?record=' + record,
    });
  },
  onInfo:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'file_info?record=' + record,
    });
  },
  goBackUpdateInfo:function ()  { //e is "event"
    this.getTodoRecord();
  },

  onDeleteRecord:function (e) {
    var id = e.target.dataset.id;
    wx.showModal({
      cancelColor: "cancelColor",
      title: '提示',
      content: '确认要删除ID '+ id + '的记录吗',
      complete: (res) => {
        if (res.confirm) {
          let that = this;
          wx.request({
          url: 'http://localhost:8080/api/file/delFile',
            method: 'POST',
            data:{
              acsTkn: wx.getStorageSync('accessToken'),
              beforeDirId:0,
              ids:[id]       
            },
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
  },
    // 切换文件夹选中状态
    toggleFolderCheck(e) {
      const folderId = e.currentTarget.dataset.value;
      const folderIndex = this.data.folderList.findIndex(item => item.id === folderId);
      const newFolderList = [...this.data.folderList];
      newFolderList[folderIndex].checked =!newFolderList[folderIndex].checked;
      this.setData({
          folderList: newFolderList
      });
      this.toggleSubFoldersCheck(folderIndex, newFolderList[folderIndex].checked);
  },

  // 切换子文件夹选中状态
  toggleSubFolderCheck(e) {
      const subFolderId = e.currentTarget.dataset.value;
      const folderIndex = this.data.folderList.findIndex(item => item.children.some(subItem => subItem.id === subFolderId));
      const subFolderIndex = this.data.folderList[folderIndex].children.findIndex(subItem => subItem.id === subFolderId);
      const newFolderList = [...this.data.folderList];
      newFolderList[folderIndex].children[subFolderIndex].checked =!newFolderList[folderIndex].children[subFolderIndex].checked;
      this.setData({
          folderList: newFolderList
      });
  },

  // 递归切换子文件夹选中状态
  toggleSubFoldersCheck(folderIndex, checked) {
      const newFolderList = [...this.data.folderList];
      if (newFolderList[folderIndex].children && newFolderList[folderIndex].children.length > 0) {
          newFolderList[folderIndex].children.forEach(subItem => {
              subItem.checked = checked;
              this.toggleSubFoldersCheck(folderIndex, checked);
          });
      }
      this.setData({
          folderList: newFolderList
      });
  }

})



