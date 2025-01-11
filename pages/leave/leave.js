// pages/leave/leave.js
Page({
  data: {
    showsearch: false,
    searchtext: '',
    filterdata: {},
    showfilter: false,
    showfilterindex: null,
    statusindex: 0,
    statusid: null,
    leave_list: [],
    filtered_list: [],
    scrolltop: null,
  },

  onLoad: function () {
    this.fetchFilterData();
    this.getLeaveList();
  },

  fetchFilterData: function () {
    this.setData({
      filterdata: {
        status: [
          { id: 0, title: '未审核' },
          { id: 1, title: '已通过' },
          { id: 2, title: '未通过' },
        ],
      },
    });
  },

  getLeaveList: function () {
    const that = this;
    wx.request({
      url: 'http://localhost:8080/api/leaveApproval/getMyLeaveRecord',
      method: 'POST',
      data: {
        accessToken: wx.getStorageSync('accessToken'),
      },
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            leave_list: res.data.data,
            filtered_list: res.data.data,
          });
        }
        console.log(that.data.leave_list)
      },
    });
  },

  inputSearch: function (e) {
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value,
    });
  },

  submitSearch: function () {
    const key = this.data.searchtext;
    const temp_list = this.data.leave_list.filter((record) =>
      record.reason.includes(key)
    );
  
    if (temp_list.length === 0) {
      wx.showToast({
        title: '未找到相关记录',
        icon: 'none', 
        duration: 2000, 
      });
    }
  
    this.setData({
      filtered_list: temp_list,
    });
  },

  refresh: function () {
    this.getLeaveList();
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000,
    });
  },

  setFilterPanel: function (e) {
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null,
      });
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      });
    }
  },

  setStatusFilter: function (e) {
    const dataset = e.currentTarget.dataset;
    this.setData({
      statusindex: dataset.statusindex,
      statusid: dataset.statusid,
    });
    const key = this.data.filterdata.status[dataset.statusindex].title;
    const temp_list = this.data.leave_list.filter(
      (record) => record.status === key
    );
    this.setData({
      filtered_list: temp_list,
    });
  },

  hideFilter: function () {
    this.setData({
      showfilter: false,
      showfilterindex: null,
    });
  },

  scrollHandle: function (e) {
    this.setData({
      scrolltop: e.detail.scrollTop,
    });
  },

  goToTop: function () {
    this.setData({
      scrolltop: 0,
    });
  },

  onAddRecord: function () {
    wx.navigateTo({
      url: 'leave_add',
    });
  },

  onModifyRecord: function (e) {
    const record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'leave_modify?record=' + record,
    });
  },

  onInfo: function (e) {
    const record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'leave_info?record=' + record,
    });
  },

  onDeleteRecord: function (e) {
    const leave_id = e.target.dataset.leave_id;
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除该请假记录吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8080/api/leaveApproval/deleteLeaveRecord',
            method: 'POST',
            data: {
              leave_id: leave_id,
            },
            success: function (res) {
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '删除成功',
                });
                that.getLeaveList();
              }
            },
          });
        }
      },
    });
  },
});