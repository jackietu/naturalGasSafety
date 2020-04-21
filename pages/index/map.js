// pages/index/map.js
const app = getApp();
let marker = null;
let id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat: 22.55329,
    lng: 113.88308,
    markers: [], //标签
    isSingle: false,

    showLocation: true,

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

    if (app.globalData.type == 1) {
      this.taskCheckDanger();
    }
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

        _this.setData({
          lat: latitude,
          lng: longitude
        })

        _this.getMarkers();
      },
      fail: function() {
        _this.getMarkers();
      }
    })
  },

  //获取markers
  getMarkers: function() {
    if (app.globalData.type == 1) {
      if (marker) {
        let markers = [];
        markers.push({
          id: marker.id,
          longitude: marker.lng,
          latitude: marker.lat,
          iconPath: "/img/20.png",
          width: 16,
          height: 21,
          callout: {
            content: `${marker.address} \n 巡查时间：${marker.createDate}`,
            padding: 10,
            display: 'BYCLICK',
            textAlign: 'center'
          }
        })

        this.setData({
          markers: markers
        })
      } else {
        this.taskCheckDanger();
      }
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

  //巡查员查看指派任务
  taskCheckDanger: function() {
    let params = {
      search: this.data.search,
      pageNumber: 1,
      pageSize: 1000,
      lat: this.data.lat,
      lng: this.data.lng
    };
    let _this = this;
    app.allRequest.taskCheckDanger(params)
      .then(res => {
        let {
          rows,
          total
        } = res.data;
        let markers = [];
        for (let row of rows) {
          if (row.dangerCheck.lng && row.dangerCheck.lat) {
            markers.push({
              id: row.dangerCheck.id,
              longitude: row.dangerCheck.lng,
              latitude: row.dangerCheck.lat,
              iconPath: "/img/20.png",
              width: 16,
              height: 21,
              callout: {
                content: `${row.dangerCheck.address} \n 巡查时间：${row.dangerCheck.createDate}`,
                padding: 10,
                display: 'BYCLICK',
                textAlign: 'center'
              }
            })
          }
        }
        _this.setData({
          markers: markers
        })
      })
  },

  calloutTap: function(e) {
    let id = e.markerId;

    wx.navigateTo({
      url: '/pages/index/rectification?id=' + id,
    })
  },

  calloutUserTap: function(e) {
    let curId = e.markerId;
    let name = '';
    for (let item of this.data.markers)
      if (item.id == curId) {
        name = item.name;
      }
    let _this = this;
    wx.showModal({
      title: '确认',
      content: `确定要把任务指派给${name}？`,
      success: function(e) {
        if (e.confirm) {
          let postData = {
            assign: curId,
            taskId: id
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.event) {
      let event = JSON.parse(options.event);
      id = event.id;

      let markers = [];
      markers.push({
        id: id,
        longitude: event.lng,
        latitude: event.lat,
        iconPath: "/img/20.png",
        width: 16,
        height: 21
      })


      this.setData({
        showLocation: false,
        lat: event.lat,
        lng: event.lng,
        markers: markers,
        isSingle: true
      })

      this.findCheckUser();
    } else {
      if (options.marker) {
        marker = JSON.parse(options.marker);
        this.setData({
          isSingle: true
        });
      }
      this.getLocation();
    }
  },

  //获取需指派的人员
  findCheckUser: function() {
    let params = {
      lat: this.data.lat,
      lng: this.data.lng,
      pageNumber: 1,
      pageSize: 1000,
      search: ''
    }
    let _this = this;
    app.allRequest.findCheckUser(params).then(res => {
      if (res.code == 0) {
        let onLine = res.data.filter(item => item.onlineState == 1).map(item => {
          return item;
        });

        let markers = [];
        for (let item of onLine) {
          // let position = item.position;
          // let lng, lat;
          // try {
          //   lng = position.split(',')[0];
          //   lat = position.split(',')[1];
          // } catch (e) {

          // }
          // if (lng && lat) {
          if(item.lng && item.lat){
            markers.push({
              id: item.id,
              // longitude: lng,
              // latitude: lat,
              longitude: item.lng,
              latitude: item.lat>90?23:item.lat,
              name: item.name ? item.name : item.username,
              iconPath: "/img/1_6.png",
              width: 16,
              height: 21,
              callout: {
                content: `${item.name ? item.name : item.username} \n 已有整改任务${item.taskNumber} \n 距离事件位置${item.distance}公里 `,
                padding: 10,
                display: 'BYCLICK',
                textAlign: 'center'
              }
            })
          }
        }

        markers.unshift(..._this.data.markers)
        _this.setData({
          markers: markers
        })
      } else {
        app.showShortToast(res.msg)
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
  onShow: function() {},

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

  },

  //事件处理函数
  bindViewTap: function() {

  },
})