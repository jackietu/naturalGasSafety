//app.js
import allRequest from '/utils/allRequest.js';
import fileUploadHelper from '/utils/fileUploadHelper.js';
import configure from '/utils/configure.js'

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //获取当前页
  getCurrPage: function() {
    let _curPageArr = getCurrentPages();
    let _curPage = _curPageArr[_curPageArr.length - 1];

    return _curPage;
  },

  //短时间弹出信息
  showShortToast: function(text, duration = 2000) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: duration
    })
  },

  //房屋/楼栋二维码扫描
  houseScanCode: function() {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        success: (res) => {
          try {
            let result = res.result;
            let resList = result.split('\n');
            let address = '',
              roomCode = '',
              buildCode = '';
            if (result.indexOf('房屋编码：') > 0) {
              address = resList[0].replace('房屋地址：', '');
              roomCode = resList[1].replace('房屋编码：', '');
              buildCode = roomCode.substr(0, 19);
            } else {
              address = resList[0].replace('建筑物地址：', '');
              buildCode = resList[1].replace('建筑物编码：', '');
            }

            let scanInfo = {
              address,
              roomCode,
              buildCode
            }

            console.log(scanInfo);

            resolve(scanInfo);
          } catch (e) {
            reject(e);
          }
        },
        fail: (res) => {
          reject(res);
        },
        complete: (res) => {}
      })
    });
  },

  //检查项是否选中
  switchCheck: function (scope, itemList, item) {
    let curPage = this.getCurrPage();
    let beforeJson = JSON.stringify(item);
    item.checked = !item.checked;
    let afterJson = JSON.stringify(item);
    let listJson = JSON.stringify(itemList);
    listJson = listJson.replace(beforeJson, afterJson)

    curPage.setData({
      [`${scope}`]: JSON.parse(listJson)
    });
  },

  /*
  图片处理（删除，预览，新增）
  */
  //删除图片
  deleteImage: function(index, scope, itemList, array = null) {
    let curPage = this.getCurrPage();
    if (array) {
      let beforeJson = JSON.stringify(array);
      array.splice(index, 1);
      let afterJson = JSON.stringify(array);
      let listJson = JSON.stringify(itemList);
      listJson = listJson.replace(beforeJson, afterJson)

      curPage.setData({
        [`${scope}`]: JSON.parse(listJson)
      });
    } else {
      itemList.splice(index, 1)
      curPage.setData({
        [`${scope}`]: itemList
      })
    }
  },

  //预览图片
  previewImage: function(index, imageList) {
    let urls = [];
    for (let item of imageList)
      urls.push(this.filePrevPath + (item.filePath ? item.filePath : item));

    wx.previewImage({
      current: urls[index],
      urls: urls
    })
  },

  //更多图片
  moreImage: function(scope, itemList, type, source = null) {
    let curPage = this.getCurrPage();
    if (source) {
      let array = [];
      if (type == 1) {//隐患图片
        array = source.beforeImages;
      } else {//整治图片
        array = source.afterImages;
      }

      let beforeJson = JSON.stringify(source);
      let listJson = JSON.stringify(itemList);

      this.globalData.fileUploadHelper.chooseImage(3 - array.length, type).then(result => {
        array.push(...result);

        let afterJson = JSON.stringify(source);
        listJson = listJson.replace(beforeJson, afterJson)

        curPage.setData({
          [`${scope}`]: JSON.parse(listJson)
        });
      })
    } else {
      this.globalData.fileUploadHelper.chooseImage(3 - itemList.length, type).then(result => {
        itemList.push(...result);
        curPage.setData({
          [`${scope}`]: itemList
        })
      })
    }
  },
  /** 图片处理结束 */

  filePrevPath: configure.IMG_BASE_URL,
  allRequest: new allRequest,
  pageSize: 5, //分页页数

  roles: [{
      id: 101,
      name: '巡查员'
    },
    {
      id: 103,
      name: '企业负责人'
    }
  ],

  globalData: {
    scan: {
      isNotNav: false,
      status: true,
      result:null,
    },
    type: 3,
    pageReload: false,
    openId: '',
    userInfo: null,
    hasSwitchUser: false,
    fileUploadHelper: fileUploadHelper
  }
})