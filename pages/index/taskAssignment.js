// pages/index/taskAssignment.js
const app = getApp()
let id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowAssign: false,

    check: {},
    itemList: [],

    filePrevPath: app.filePrevPath,

    person: {
      firstLoad: true,
      showOnline: false,
      showOffline: false,
      onLine: [],
      offLine: []
    },

    searchText: '', //搜索条件
    search: '', //搜索
  },

  //搜索框内容改变事件
  searchChange: function(e) {
    let value = e.detail.value;
    this.data.searchText = value;
  },

  //点击搜索事件
  searchMethod: function(e) {
    this.data.search = this.data.searchText;
    this.data.pageIndex = 1; //重新开始搜索

    this.findCheckUser();
  },

  //弹窗在线离线展开
  showLine: function(e) {
    let type = e.target.dataset.type;
    if (type == 1) {
      this.setData({
        person: Object.assign({}, this.data.person, {
          showOnline: !this.data.person.showOnline
        })
      })
    } else {
      this.setData({
        person: Object.assign({}, this.data.person, {
          showOffline: !this.data.person.showOffline
        })
      })
    }
  },

  //获取需指派的人员
  findCheckUser: function() {
    let params = {
      lat: this.data.check.lat,
      lng: this.data.check.lng,
      pageNumber: 1,
      pageSize: 1000,
      search: this.data.search
    }
    let _this = this;
    app.allRequest.findCheckUser(params).then(res => {
      if (res.code == 0) {
        let onLine = res.data.filter(item => item.onlineState == 1).map(item => {
          return item;
        });
        let offLine = res.data.filter(item => item.onlineState != 1).map(item => {
          return item;
        });

        _this.setData({
          person: Object.assign({}, _this.data.person, {
            onLine: onLine,
            offLine: offLine
          })
        })
      } else {
        app.showShortToast(res.msg)
      }
    })
  },

  showAssign: function(e) {
    this.setData({
      isShowAssign: true
    })

    if (this.data.person.firstLoad) {
      this.data.person.firstLoad = false;
      this.findCheckUser();
    }
  },

  onCloseAssign: function(e) {
    this.setData({
      isShowAssign: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id;
    let _this = this;
    app.allRequest.assignCheckDanger(id).then(res => {
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

  //指派任务
  btnAssign: function(e) {
    let {
      id,
      name
    } = e.target.dataset;
    let _this = this;
    wx.showModal({
      title: '确认',
      content: `确定要把任务指派给${name}？`,
      success: function(e) {
        if (e.confirm) {
          let postData = {
            assign: id,
            taskId: _this.data.check.id
          }
          app.allRequest.assignCheckDangerSubmit(postData).then(res => {
            if (res.code == 0) {
              wx.showModal({
                content: '任务指派成功！',
                showCancel: false,
                success: function(res) {
                  app.globalData.pageReload = true;
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              });

            } else {
              app.showShortToast(res.msg)
            }
          })
        }
      }
    })
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