// pages/index/investigate.js
const app = getApp();
import {
  phone,
  encrypt
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanUrl: '',

    list: ['/img/pz.png', '/img/pz.png'],
    buildCode: '', //楼栋编码
    roomCode: '', //房屋编码
    address: '', //地址

    gasType: 1, //用气类型(1.居民用气 2.商业用气)
    checkResult: 1, //巡查结果(1.已整改2.部分整改)

    lat: '',
    lng: '',

    allItemDangerList: [], //安全检查项集合

    filePrevPath: app.filePrevPath,
  },

  setGasType: function(e) {
    let gasType = e.currentTarget.dataset.type;
    this.setData({
      gasType
    })

    this.getAllItemDanger(gasType);
  },

  //处理结果切换
  switchCheckResult: function(e) {
    let checkResult = e.currentTarget.dataset.result;
    this.setData({
      checkResult
    })
  },

  //扫房屋/楼栋二维码
  scanCode: function(e) {
    let _this = this;
    app.houseScanCode().then(res => {
      let {
        buildCode, //楼栋编码
        roomCode, //房屋编码
        address, //地址
      } = res;

      _this.setData({
        buildCode, //楼栋编码
        roomCode, //房屋编码
        address, //地址
      })
    }).catch(err => {
      app.showShortToast('扫码失败！')
    })
  },

  //检查项选择切换
  switchCheck: function(e) {
    let detail = e.currentTarget.dataset.source;
    app.switchCheck("allItemDangerList", this.data.allItemDangerList, detail);
  },

  //是否现场整改选择切换
  switchIsSelectImmediate: function(e) {
    let detail = e.currentTarget.dataset.source;
    let beforeJson = JSON.stringify(detail);
    detail.isSelectImmediate = !detail.isSelectImmediate;
    let afterJson = JSON.stringify(detail);
    let listJson = JSON.stringify(this.data.allItemDangerList);
    listJson = listJson.replace(beforeJson, afterJson)

    this.setData({
      allItemDangerList: JSON.parse(listJson)
    });
  },

  //隐患排查保存
  submitCheck: function(e) {
    let formData = e.detail.value;

    if (!formData.roomCode) {
      app.showShortToast('房屋编码不可为空！');
      return false;
    }
    if (!formData.address) {
      app.showShortToast('地址不可为空！');
      return false;
    }
    if (!formData.roomNo) {
      app.showShortToast('房间号不可为空！');
      return false;
    }
    if (!formData.contactPerson) {
      app.showShortToast('联系人不可为空！');
      return false;
    }
    let phoneRes = phone(formData.contactPhone);
    if (!phoneRes.status) {
      app.showShortToast(phoneRes.tip);
      return false;
    }

    let postData = Object.assign({}, formData, {
      gasType: this.data.gasType, //用气类型(1.居民用气 2.商业用气)
      checkResult: this.data.checkResult, //巡查结果(1.已整改2.部分整改)
      lat: this.data.lat,
      lng: this.data.lng
    })

    let dangerItem = [],
      dealItem = [];
    let isAllHasCheck = true,
      hasCheck = false;
    for (let danger of this.data.allItemDangerList)
      for (let detail of danger.details) {
        if (detail.checked) { //选择了
          hasCheck = true;
          if (detail.beforeImages.length == 0) {
            app.showShortToast(`【${detail.dangerName}】未上传隐患图片！`)
            return false;
          }
          let beforeImageIds = detail.beforeImages.map(item => {
            return item.id;
          });
          let afterImageIds = [];
          if (detail.afterImages.length == 0) {
            isAllHasCheck = false;
          } else if (detail.isImmediate != 1 && !detail.isSelectImmediate) {
            isAllHasCheck = false;
          } else {
            afterImageIds = detail.afterImages.map(item => {
              return item.id;
            });

            if (detail.isImmediate != 1 && detail.isSelectImmediate) {
              dealItem.push(detail.id);
            }
          }

          beforeImageIds.push(...afterImageIds)

          let dItem = `${danger.item.id}|${detail.id}|${detail.isImmediate}|${beforeImageIds.join('.')}`;
          dangerItem.push(dItem);
        }
      }

    postData.dangerItem = dangerItem;
    postData.dealItem = dealItem;

    let _this = this;
    app.allRequest.saveCheckDanger(postData).then(res => {
      if (res.code == 0) {
        if (res.data) {
          _this.setData({
            scanUrl: app.filePrevPath + res.data
          })
          _this.scanAlert.showAlert();
        } else {
          wx.showModal({
            content: '隐患排查成功！',
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
    let {
      result
    } = app.globalData.scan;
    if (result) {
      let {
        address,
        roomCode,
        buildCode
      } = result;
      this.setData({
        address,
        roomCode,
        buildCode
      })
    }

    this.getAllItemDanger(this.data.gasType);

    this.getLocation();
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
        _this.setData({
          lat: latitude,
          lng: longitude
        })
      }
    })
  },

  //获取安全检查项
  getAllItemDanger(gasType) {
    let _this = this;
    app.allRequest.allItemDanger(gasType).then(res => {
      if (res.code == 0) {
        let allItemDangerList = res.data;
        for (let danger of allItemDangerList)
          for (let detail of danger.details) {
            detail.checked = false;
            detail.beforeImages = [];
            detail.afterImages = [];
            detail.isSelectImmediate = false;
          }
        _this.setData({
          allItemDangerList: allItemDangerList
        })
      } else {
        app.showShortToast('获取安全检查项失败！')
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

    app.deleteImage(index, "allItemDangerList", this.data.allItemDangerList, imageList);
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

    app.moreImage("allItemDangerList", this.data.allItemDangerList, type, source);

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