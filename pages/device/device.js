// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goList() {
    wx.navigateTo({
      url: 'list'
    })
  },
  goAdd() {
    wx.navigateTo({
      url: 'add'
    })
  },
  goModify() {
    wx.navigateTo({
      url: 'modify'
    })
  },
  goDelete() {
    wx.navigateTo({
      url: 'delete'
    })
  },
})
