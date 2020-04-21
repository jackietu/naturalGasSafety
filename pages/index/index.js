//index.js
//获取应用实例
const app = getApp()
let streets = [];

Page({
  data: {
    type: app.globalData.type,
    enterprises: ['上报企业'],
    enterpriseIdx: 0,
    streets: ['所属街道'],
    streetIdx: 0,
    // departments: ['部门处置', '部门一', '部门二'],
    // dptIdx: 0,

    searchText: '', //搜索条件
    search: '', //搜索
    pageIndex: 1,
    list: [],
    total: 0,

    lat: '',
    lng: '',
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

    if (app.globalData.type == 1) {
      this.taskCheckDanger();
    } else if (app.globalData.type == 2) {
      this.poolCheckDanger();
    } else {
      this.listTraceCheck();
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

  onLoad: function(options) {
    if (options.isNotNav)
      isNotNav = options.isNotNav;
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      app.globalData.userInfo = userInfo;
      let roleId = userInfo.roleIds[0];
      // role_id：企业负责人：103，巡查员：101，燃气协会：121，住建局：1
      app.globalData.type = roleId == 101 ? 1 : roleId == 103 ? 2 : roleId == 121 ? 4 : 3;
    } else {
      wx.redirectTo({
        url: '/pages/login/index',
      })

      return false;
    }

    let type = app.globalData.type;
    this.setData({
      type: type
    })
    if (type == 1) {
      wx.setNavigationBarTitle({
        title: '隐患整改'
      })
      wx.setTabBarItem({
        index: 0,
        text: '隐患整改',
        iconPath: '/img/1_1.png',
        selectedIconPath: '/img/1_2.png'
      })
      wx.setTabBarItem({
        index: 1,
        text: '隐患排查',
        iconPath: '/img/1_3.png',
        selectedIconPath: '/img/1_4.png'
      })
      wx.setTabBarItem({
        index: 2,
        text: '我的信息',
        iconPath: '/img/1_5.png',
        selectedIconPath: '/img/1_6.png'
      })
    } else if (type == 2) {
      wx.setNavigationBarTitle({
        title: '任务指派'
      })
      wx.setTabBarItem({
        index: 0,
        text: '任务指派',
        iconPath: '/img/2_1.png',
        selectedIconPath: '/img/2_2.png'
      })
      wx.setTabBarItem({
        index: 1,
        text: '积分审核',
        iconPath: '/img/2_3.png',
        selectedIconPath: '/img/2_4.png'
      })
      wx.setTabBarItem({
        index: 2,
        text: '用户管理',
        iconPath: '/img/2_5.png',
        selectedIconPath: '/img/2_6.png'
      })
    } else if (type == 3 || type == 4) {
      wx.setNavigationBarTitle({
        title: '隐患跟踪'
      })
      wx.setTabBarItem({
        index: 0,
        text: '隐患跟踪',
        iconPath: '/img/3_1.png',
        selectedIconPath: '/img/3_2.png'
      })
      if (type == 3) {
        wx.setTabBarItem({
          index: 1,
          text: '企业用户管理',
          iconPath: '/img/3_3.png',
          selectedIconPath: '/img/3_4.png'
        })
      } else {
        wx.setTabBarItem({
          index: 1,
          text: '隐患抽查',
          iconPath: '/img/3_3.png',
          selectedIconPath: '/img/3_4.png'
        })
      }
      wx.setTabBarItem({
        index: 2,
        text: '整体概括',
        iconPath: '/img/3_5.png',
        selectedIconPath: '/img/3_6.png'
      })
    }

    if (type == 1) {
      this.getLocation();
    } else if (type == 2) {
      this.poolCheckDanger();
    } else {
      this.getCondition();
      this.listTraceCheck();
    }
  },

  //隐患跟踪列表
  listTraceCheck: function() {
    let params = {
      search: this.data.search,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      street: this.data.streetIdx == 0 ? '' : streets[this.data.streetIdx-1].code,
      company: this.data.enterpriseIdx == 0 ? '' : this.data.enterprises[this.data.enterpriseIdx]
    };
    let _this = this;
    app.allRequest.listTraceCheck(params).then(res => {
      if (res.code == 0) {
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
      }
    })
  },

  //获取企业及接到信息
  getCondition: function() {
    let _this = this;
    app.allRequest.getCondition().then(res => {
      if (res.code == 0) {
        let {
          companyList,
          streetList
        } = res.data;

        streets = streetList.map(item=>Object.assign(item));
        companyList.unshift('上报企业');

        let list = streetList.map(item=>item.name);
        list.unshift('所属街道');

        _this.setData({
          enterprises: companyList,
          streets: list
        })
      } else {
        app.showShortToast(res.msg);
      }
    })
  },

  //获取当前位置的经纬度
  getLocation: function() {
    let _this = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        let {
          latitude,
          longitude
        } = res;
        _this.data.lat = latitude;
        _this.data.lng = longitude;

        if (app.globalData.type == 1) {
          _this.taskCheckDanger();
        }
      },
      fail: function() {
        if (app.globalData.type == 1) {
          _this.taskCheckDanger();
        }
      }
    })
  },

  //获取隐患池
  poolCheckDanger: function() {
    let params = {
      search: this.data.search,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize
    };
    let _this = this;
    app.allRequest.poolCheckDanger(params).then(res => {
      if (res.code == 0) {
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
      }
    })
  },

  //巡查员查看指派任务
  taskCheckDanger: function() {
    let params = {
      search: this.data.search,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      lat: this.data.lat,
      lng: this.data.lng
    };
    let _this = this;
    app.allRequest.taskCheckDanger(params)
      .then(res => {
        if (res.code == 0) {
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
        }
      })
  },

  bindPickerChange: function(e) {
    let source = e.currentTarget.dataset.source;
    if (source == 1) {
      this.data.enterpriseIdx = e.detail.value
      this.setData({
        enterpriseIdx: e.detail.value
      })
    } else if (source == 2) {
      this.data.streetIdx = e.detail.value
      this.setData({
        streetIdx: e.detail.value
      })
    } else if (source == 3) {
      this.data.dptIdx = e.detail.value
      this.setData({
        dptIdx: e.detail.value
      })
    }

    this.data.pageIndex == 1;
    this.listTraceCheck();
  },

  onShow: function(e) {
    if (app.globalData.type == 1) {
      if (app.globalData.pageReload) {
        this.data.pageIndex = 1;

        this.getLocation();

        app.globalData.pageReload = false;
        return false;
      }
      let {
        status,
        result,
        isNotNav
      } = app.globalData.scan
      if (!status && result && !isNotNav) { //扫码过来
        wx.navigateTo({
          url: '/pages/index/investigate'
        })
      }

      app.globalData.scan.status = true;
      app.globalData.scan.isNotNav = false;
    } else if (app.globalData.type == 2 && app.globalData.pageReload) {
      this.data.pageIndex = 1;
      app.globalData.pageReload = false;
      this.poolCheckDanger();
    }
  },

  /*上拉触底时触发*/
  onReachBottom: function() {
    this.data.pageIndex++;
    let _this = this;
    if (this.data.total > (this.data.pageIndex - 1) * app.pageSize) {
      wx.stopPullDownRefresh()

      if (app.globalData.type == 1) {
        _this.taskCheckDanger();
      } else if (app.globalData.type == 2) {
        _this.poolCheckDanger();
      }else{
        _this.listTraceCheck();
      }
    }
  },

  //去地图
  goMap: function(e) {
    let {
      source
    } = e.target.dataset;
    let {
      id,
      lat,
      lng,
      address,
      createDate
    } = source;
    let params = {
      id,
      lat,
      lng,
      address,
      createDate
    };
    wx.navigateTo({
      url: '/pages/index/map?marker=' + JSON.stringify(params)
    })
  },

  //查看人员地位信息
  goUserMap: function(e) {
    let {
      source
    } = e.target.dataset;
    let {
      id,
      lat,
      lng
    } = source;
    let params = {
      id,
      lat,
      lng
    }
    wx.navigateTo({
      url: '/pages/index/map?event=' + JSON.stringify(params)
    })
  }

})