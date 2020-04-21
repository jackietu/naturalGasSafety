// pages/index/info.js
const app = getApp()
let rewardId = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOnlyShow: false,
    isAudit: 0,
    checkId: '',
    dealUser: '',

    check: {},
    itemList: [],
    qrImage:'',

    filePrevPath: app.filePrevPath,

    //     checkResult	number
    // 治理结果[1.已现场整改 2.未完成整改 3.未发现隐患 4.暂存 5.部分完成整改(指派整改的情况) 6.已完成整改(指派整改的情况)]
  },

  //审核积分
  updateAuditReword: function(e) {
    let {
      type
    } = e.target.dataset;
    let _this = this;
    wx.showModal({
      title: '确认',
      content: `确定要对此积分进行${type == 2 ? "审核通过" : "无效整改"}操作？`,
      success: function(e) {
        if (e.confirm) {
          let postData = {
            rewardId: rewardId,
            status: type
          }
          app.allRequest.updateAuditReword(postData).then(res => {
            if (res.code == 0) {
              wx.showModal({
                content: '操作成功！',
                showCancel: false,
                success: function(res) {
                  app.globalData.pageReload = true;
                  wx.switchTab({
                    url: '/pages/index/scanIndex',
                  })
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
    let _this = this;
    if (options.isOnlyShow) {
      this.setData({ isOnlyShow: true})

      if(options.type==1){
        app.allRequest.findOwnCheckDetail(options.id).then(res => {
        if (res.code == 0) {
          let {
            check,
            itemList,
            qrImage
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
            itemList,
            qrImage
          })
        } else {
          app.showShortToast(res.msg)
        }
      })
      }else{
        app.allRequest.sceneDealInfo(options.id).then(res => {
          if (res.code == 0) {
            let {
              check,
              itemList,
              qrImage
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
              itemList,
              qrImage 
            })
          } else {
            app.showShortToast(res.msg)
          }
        })
      }

    } else if (options.itemId){
      let {itemId,company}=options;
      let _this = this;

      let postData = {
        company: company,
        id: itemId
      }
      app.allRequest.traceDetailCheck(postData).then(res => {
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
    } else {
      rewardId = options.rewardId;
      let isAudit = 0,
        checkId = '',
        dealUser = '';
      if (options.isAudit)
        isAudit = options.isAudit;
      if (options.checkId)
        checkId = options.checkId;
      if (options.dealUser)
        dealUser = options.dealUser;

      this.data.isAudit = isAudit;
      this.data.checkId = checkId;
      this.data.dealUser = dealUser;

      this.setData({
        isAudit,
        checkId,
        dealUser
      })

      let _this = this;
      let postData = {
        checkId: checkId,
        dealUser: dealUser
      }
      app.allRequest.getScoreAudit(postData).then(res => {
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
    }
  },

  //显示二维码
  showQrImage:function(){
    this.scanAlert.showAlert();
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