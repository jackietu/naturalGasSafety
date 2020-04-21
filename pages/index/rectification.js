// pages/index/rectification.js
const app = getApp()
let id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanUrl: '',

    check: {},
    itemList: [],

    dealResult: 6, //整改结果(6.已整改5.部分整改)
    filePrevPath: app.filePrevPath,
  },

  //隐患整改处理
  dealTaskDanger: function(e) {
    let formData = e.detail.value;

    let postData = Object.assign({}, formData, {
      checkId: id,
      dealResult: this.data.dealResult
    })

    let dealItem = [];
    let isAllHasCheck = true;
    for (let danger of this.data.itemList)
      for (let detail of danger.detailList) {
        if (detail.checked) { //选择了
          if (detail.afterImages.length == 0) {
            app.showShortToast(`【${detail.dangerName}】未上传整改图片！`)
            return false;
          }

          let afterImageIds = detail.afterImages.map(item => {
            return item.id;
          });

          let dItem = `${detail.checkDetailId}|${afterImageIds.join('.')}`;
          dealItem.push(dItem);
        } else {
          isAllHasCheck = false;
        }
      }

    postData.dealItem = dealItem;

    if (postData.dealResult == 6 && !isAllHasCheck) {
      app.showShortToast('有整改项未被整改，不可选择已完成整改！')
      return false;
    } else if (postData.dealResult == 5 && isAllHasCheck) {
      app.showShortToast('没有整改项未被整改，不可选择部分完成整改！')
      return false;
    }

    let _this = this;
    app.allRequest.dealTaskCheckDanger(postData).then(res => {
      if (res.code == 0) {
        if (res.data) {
          _this.setData({
            scanUrl: app.filePrevPath + res.data
          })
          _this.scanAlert.showAlert();
        } else {
          wx.showModal({
            content: '隐患整改成功！',
            showCancel: false,
            success: function(res) {
              app.globalData.pageReload = true;
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          });
        }
      } else {
        app.showShortToast(res.msg);
      }
    })
  },

  //跳到主页
  parentEvent: function() {
    app.globalData.pageReload = true;
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id;
    let _this = this;
    app.allRequest.queryTaskCheckDanger(id).then(res => {
      if (res.code == 0) {
        let {
          check,
          itemList
        } = res.data;
        for (let item of itemList)
          for (let detail of item.detailList) {
            detail.beforeImages = detail.dangerImg.map(item => {
              return Object.assign({}, item)
            });
            detail.afterImages = detail.dealImg.map(item => {
              return Object.assign({}, item)
            });
            detail.checked = false;
            detail.isSelectImmediate = false;

            detail.dangerName = detail.details.dangerName;
            detail.isImmediate = detail.details.isImmediate;

            delete detail.dangerImg;
            delete detail.dealImg;
          }

        _this.setData({
          check,
          itemList
        })
      } else {
        app.showShortToast(res.msg)
      }
    })
  },

  /*
  图片处理（删除，预览，新增）
  */
  //删除图片
  deleteImage: function(e) {
    let {
      index,
      type,
      source
    } = e.target.dataset;

    let imageList = [];
    if (type == 1) { //隐患图片
      imageList = source.beforeImages;
    } else { //整治图片
      imageList = source.afterImages;
    }

    app.deleteImage(index, "itemList", this.data.itemList, imageList);
  },

  //预览图片
  previewImage: function(e) {
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

  //更多图片
  moreImage: function(e) {
    let _this = this;
    let {
      type,
      source
    } = e.target.dataset;

    app.moreImage("itemList", this.data.itemList, type, source);

  },

  //处理结果切换
  switchDealResult: function(e) {
    let dealResult = e.currentTarget.dataset.result;
    this.setData({
      dealResult
    })
  },

  //检查项选择切换
  switchCheck: function(e) {
    let detail = e.currentTarget.dataset.source;
    app.switchCheck("itemList", this.data.itemList, detail);
  },

  //是否现场整改选择切换
  switchIsSelectImmediate: function(e) {
    let detail = e.currentTarget.dataset.source;
    let beforeJson = JSON.stringify(detail);
    detail.isSelectImmediate = !detail.isSelectImmediate;
    let afterJson = JSON.stringify(detail);
    let listJson = JSON.stringify(this.data.itemList);
    listJson = listJson.replace(beforeJson, afterJson)

    this.setData({
      itemList: JSON.parse(listJson)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.scanAlert = this.selectComponent('#scanAlert');
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