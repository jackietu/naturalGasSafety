// pages/index/spotCheck.js
const app = getApp()
let id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    check: {},
    itemList: [],
    company: '',
    checker: '',
    filePrevPath: app.filePrevPath,


    dealResult: 7,
  },

  //处理结果切换
  switchDealResult: function (e) {
    let dealResult = e.currentTarget.dataset.result;
    this.setData({ dealResult })
  },

  //预览图片
  previewImage: function (e) {
    let {
      index,
      type,
      source
    } = e.target.dataset;
    let imageList = [];

    if (type == 1) { //隐患图片
      imageList = Object.assign([], source.beforeImages);
    } else { //整治图片
      imageList = Object.assign([], source.afterImages);
    }

    app.previewImage(index, imageList);
  },

  //燃气协会抽查结果提交
  submitForm: function(e){
    let postData=e.detail.value;
    postData.checkId=id;
    postData.checkCreator = this.data.check.userIdCreate;
    postData.supervisionResult = this.data.dealResult;

    app.allRequest.commitCheckDanger(postData).then(res=>{
      if (res.code == 0) {
        wx.showModal({
          content: '操作成功！',
          showCancel: false,
          success: function (res) {
            app.globalData.pageReload = true;
            wx.switchTab({
              url: '/pages/index/scanIndex',
            })
          }
        });
      }else{
        app.showShortToast(res.msg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;

    let _this = this;
    app.allRequest.checkInfoDanger(id).then(res => {
      if (res.code == 0) {
        let { check, itemList, company, checker } = res.data;
        for (let item of itemList)
          for (let detail of item.detailList) {
            detail.beforeImages = detail.dangerImg.map(item => { return Object.assign({}, item) });
            detail.afterImages = detail.dealImg.map(item => { return Object.assign({}, item) });

            detail.dangerName = detail.details.dangerName;
            detail.isImmediate = detail.details.isImmediate;

            delete detail.dangerImg;
            delete detail.dealImg;
          }

        _this.setData({
          check, itemList, company, checker
        })
      } else {
        app.showShortToast(res.msg)
      }
    })
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