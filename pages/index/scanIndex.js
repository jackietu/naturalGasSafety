// pages/index/scanIndex.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: app.globalData.type,
    isShowAudit: false,
    auditStatusList: [{
      id: 1,
      name: '审核通过'
    }, {
      id: 2,
      name: '审核不通过'
    }],

    searchText: '',
    search: '',
    pageIndex: 1,
    list: [],
    total: 0,
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

    if (app.globalData.type == 2) {
      this.getAuditRewordList();
    } else if (app.globalData.type == 3) {
      this.getFuzzyUserListByUserName();
    } else if (app.globalData.type == 4) {
      this.listCheckDanger();
    }
  },

  //扫码
  scanSearch: function(e) {
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

  //删除用户
  delUser: function(e) {
    let source = e.currentTarget.dataset.source;
    let _this = this;
    wx.showModal({
      title: '确认',
      content: `是否确认删除此用户（${source.name ? source.name : source.username}）？`,
      success: function(e) {
        if (e.confirm) {
          let postData = {
            userId: source.id,
            status: 0
          }
          app.allRequest.updateUserStatus(postData).then(res => {
            if (res.code == 0) {
              wx.showModal({
                content: '删除成功！',
                showCancel: false,
                success: function(res) {
                  _this.data.pageIndex = 1; //重新开始搜索
                  _this.getFuzzyUserListByUserName();
                }
              });
            } else {
              app.showShortToast(res.msg);
            }
          })
        }
      }
    })
  },

  //企业 / --/住建局通过姓名模糊搜索用户列表功能
  getFuzzyUserListByUserName: function() {
    let params = {
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      userName: this.data.search
    };
    let _this = this;
    app.allRequest.getFuzzyUserListByUserName(params)
      .then(res => {
        let {
          rows,
          total
        } = res;
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

  //获取审核列表
  getAuditRewordList: function() {
    let params = {
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      search: this.data.search
    };
    let _this = this;
    app.allRequest.getAuditRewordList(params)
      .then(res => {
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

  //隐患抽查列表
  listCheckDanger: function() {
    let params = {
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      search: this.data.search
    };
    let _this = this;
    app.allRequest.listCheckDanger(params)
      .then(res => {
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
  onLoad: function(options) {
    let type = app.globalData.type;
    this.setData({
      type: type
    })
    if (type == 1) {
      wx.setNavigationBarTitle({
        title: '隐患排查'
      })
    } else if (type == 2) {
      wx.setNavigationBarTitle({
        title: '积分审核'
      })

      this.getAuditRewordList();
    } else if (type == 3) {
      wx.setNavigationBarTitle({
        title: '企业用户管理'
      })

      this.getFuzzyUserListByUserName();
    } else if (type == 4) {
      wx.setNavigationBarTitle({
        title: '隐患抽查'
      })

      this.listCheckDanger();
    }
  },

  auditJf: function(e) {
    this.setData({
      isShowAudit: true,
    })
  },

  onCloseAudit: function(e) {
    this.setData({
      isShowAudit: false,
    })
  },

  scanCode() {
    if (app.globalData.scan.status) {
      let that = this;

      app.houseScanCode().then(res => {
        app.globalData.scan.result = res;
        wx.switchTab({
          url: '/pages/index/index',
        })
      }).catch(err => {
        app.globalData.scan.isNotNav = true;
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
    }
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
    if (app.globalData.type == 1) {
      this.scanCode();
    } else if (app.globalData.type == 2) {
      if (app.globalData.pageReload) {
        app.globalData.pageReload = false;
        this.data.pageIndex = 1; //重新开始搜索
        this.getAuditRewordList();
      }
    } else if (app.globalData.type == 3) {
      if (app.globalData.pageReload) {
        app.globalData.pageReload = false;
        this.data.pageIndex = 1; //重新开始搜索
        this.getFuzzyUserListByUserName();
      }
    } else if (app.globalData.type == 4) {
      if (app.globalData.pageReload) {
        app.globalData.pageReload = false;
        this.data.pageIndex = 1; //重新开始搜索
        this.listCheckDanger();
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (app.globalData.type == 1) {
      app.globalData.scan.status = false
    }
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
    if (app.globalData.type == 2 || app.globalData.type == 3) {
      this.data.pageIndex++;
      let _this = this;
      if (this.data.total > (this.data.pageIndex - 1) * app.pageSize) {
        wx.stopPullDownRefresh()

        if (app.globalData.type == 2)
          _this.getAuditRewordList();
        else if (app.globalData.type == 3)
          _this.getFuzzyUserListByUserName();
        else if (app.globalData.type == 4)
          _this.listCheckDanger();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})