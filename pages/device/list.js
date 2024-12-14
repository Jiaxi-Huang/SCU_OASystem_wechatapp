Page({
  data: {
    todoList:[],
  },
  onLoad(options) {
  },
  getList(){
    var that=this;
    var sqlGet="select * from user_record";
    console.log(sqlGet);
    wx.request({
      url: 'http://localhost:8080/TeachDemo_war_exploded/project_todo_servlet_action?action=get_todo_record',
      //data这里要带上三个参数：
      //1.前端构造好的sql语句；
      //2.所要操作的数据库名称，比如：test，等等；
      //3.动作的id，比如这里是update_record，写在data里也可以，写在url上也可以
      data: {},
      header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest", },
      success: function (res) {
        console.log(res.data);
        that.setData({
          todoList:res.data.aaData,
        });
        //that.handleAddTodoRecordResult(res);
        wx.showToast({
          title: '已经查询完毕！',
          icon: "none",
          duration: 2000,
          success: function (res) {
            setTimeout(function () {
              //要延时执行的代码
              //xxxxxxxx
            }, 2000) //延迟时间
          }
        })
      },
      fail: function (res) {
      }
    })
  },
  onModifyRecord:function(e){
    console.log(JSON.stringify(e));
    var id = e.currentTarget.dataset.itemid;
    var receivertype = e.currentTarget.dataset.receivertype;
    var objectid = e.currentTarget.dataset.objectid;
    var record = JSON.stringify({"id":id,"receiverType":receivertype,"objectid":objectid});
    wx.navigateTo({
      url: 'modify?record='+record,
    })
  },
  onAddRecord:function(){
    wx.navigateTo({
      url: 'add',
    })
  },
  onDeleteRecord:function(e){
    wx.showModal({
      title:"提示",
      content:"确认删除该条记录吗?",
      success(res){
        if(res.confirm){
          var id = e.currentTarget.dataset.itemid;
          console.log(id);
          wx.request({
            url: 'http://localhost:8080/TeachDemo_war_exploded/project_todo_servlet_action?action=delete_todo_record',
            data: {"id":id},
            header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest", },
            success: function (res) {
              //that.handleAddTodoRecordResult(res);
              wx.showToast({
                title: '已经删除完毕!',
                icon: "none",
                duration: 2000,
                success: function (res) {
                  setTimeout(function () {
                    //要延时执行的代码
                    //xxxxxxxx
                  }, 2000) //延迟时间
                }
              })
            },
            fail:function(res){
            }
          })
        }
      }
    })
  }
})