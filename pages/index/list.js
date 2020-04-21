// pages/index/list.js
const app = getApp();
let type = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '', //搜索条件
    search: '', //搜索
    pageIndex: 1,
    list: [],
    total: 0,

    type: 1,
  },

  //扫码
  scanSearch: function (e) {
    let _this = this;
    app.houseScanCode().then(res => {
      if (!res.houseCode) {
        _this.setData({
          searchText: res.buildCode
        })
      } else {
        _this.setData({
          searchText: res.houseCode
        })
      }
    }).catch(err => {
      app.showShortToast('扫码失败！')
    })
  },

  //搜索框内容改变事件
  searchChange: function (e) {
    let value = e.detail.value;
    this.data.searchText = value;
  },

  //点击搜索事件
  searchMethod: function (e) {
    this.data.search = this.data.searchText;
    this.data.pageIndex = 1; //重新开始搜索

    if (type == 1) {
      this.findOwnCheckList();
    }else if(type == 2){
      this.findOwnDealList();
    }
  },

  //隐患巡查上报数
  findOwnCheckList: function() {
    let params = {
      search: this.data.search,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      userId: app.globalData.userInfo.id
    };
    let _this = this;
    app.allRequest.findOwnCheckList(params).then(res => {
      let {
        rows,
        total
      } = res.data;
      if (_this.data.pageIndex == 1) {
        _this.setData({
          list: rows,
          total: total,
        })
      } else {
        let list = Object.assign([], _this.data.list);
        list.push(...rows);
        _this.setData({
          list: list,
          total: total,
        })
      }
    })
  },

  //隐患巡查整改明细列表
  findOwnDealList: function () {
    let params = {
      search: this.data.search,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      userId: app.globalData.userInfo.id
    };
    let _this = this;
    app.allRequest.findOwnDealList(params).then(res => {
      let {
        rows,
        total
      } = res.data;
      if (_this.data.pageIndex == 1) {
        _this.setData({
          list: rows,
          total: total,
        })
      } else {
        let list = Object.assign([], _this.data.list);
        list.push(...rows);
        _this.setData({
          list: list,
          total: total,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    type = options.type;
    this.setData({type:type})
    if (type == 1) {
      this.findOwnCheckList();
    } else if (type == 2) {
      this.findOwnDealList();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.data.pageIndex++;
    let _this = this;
    if (this.data.total > (this.data.pageIndex - 1) * app.pageSize) {
      wx.stopPullDownRefresh()

      if (type == 1) {
        _this.findOwnCheckList();
      } else if (type == 2) {
        _this.findOwnDealList();
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.pageReload) {
      app.globalData.pageReload = false;
      this.data.pageIndex = 1; //重新开始搜索

      if (type == 1) {
        this.findOwnCheckList();
      } else if (type == 2) {
        this.findOwnDealList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})