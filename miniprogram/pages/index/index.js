// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshBol: false,
    globalData: {}
  },
  getGlobalData() {
    this.setData({
      globalData: app.globalData
    })
  },
  // 选项切换
  changeTabs(e) {
    console.log(e.detail.activeKey)
  },
  //scroll-view 自定义下拉刷新
  refresh() {
    console.log('开始刷新')
    this.setData({
      refreshBol: true
    })
    let timer = setTimeout(() => {
      this.setData({
        refreshBol: false
      })
      console.log('结束')
    },3000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGlobalData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})