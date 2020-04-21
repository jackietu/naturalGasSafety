// pages/index/registerAudit.js
const app = getApp()
let id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    userInfo: {},
    filePrevPath: app.filePrevPath,
  },

  //注册审核
  updateUserStatus: function(e) {
    let {
      type
    } = e.target.dataset;
    let _this = this;
    wx.showModal({
      title: '确认',
      content: `确定要审核${type==1?"":"不"}通过此用户？`,
      success: function(e) {
        if (e.confirm) {
          let postData = {
            userId: id,
            status: type
          }
          app.allRequest.updateUserStatus(postData).then(res => {
            if (res.code == 0) {
              wx.showModal({
                content: '操作成功！',
                showCancel: false,
                success: function(res) {
                  app.globalData.pageReload = true;
                  if(_this.data.userInfo.roleIds[0] == 101){//巡查员
                  wx.switchTab({
                    url: '/pages/wode/index',
                  })
                  } else {//企业负责人
                    wx.switchTab({
                      url: '/pages/index/scanIndex',
                    })
                  }
                }
              });
            } else {
              app.showShortToast(res.msg);
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id;
    let _this = this;
    app.allRequest.getAuditUserDetail(id).then(res => {
      if (res.code == 0) {
        _this.setData({
          userInfo: res.data,
          list: Object.assign([], res.data.imageUrl)
        })
      } else {
        app.showShortToast(res.msg);
      }
    })
  },

  //图片预览
  previewImage: function(e) {
    let index = e.currentTarget.dataset.index;

    app.previewImage(index, this.data.list);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})