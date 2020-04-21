import configure from './configure.js'
class request {

  constructor() {
    this._header = {};
  }

  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  sendGetRequest(url, data = {}, args) {
    let checkLogin, appUrl;
    if (args)
      ({
        checkLogin,
        appUrl
      } = args);
    checkLogin = checkLogin == undefined ? true : checkLogin;
    appUrl = appUrl == undefined ? false : appUrl;
    if (checkLogin) {
      this._header = {
        'content-type': appUrl ? 'application/x-www-form-urlencoded' : 'application/json',
        'cookie': wx.getStorageSync("cookieKey")
      }
    } else {
      this._header = {
        'Content-Type': 'application/json'
      }
    }

    return this.sendRequest(url, data, this._header, "GET", checkLogin)
  }

  sendPostRequest(url, data = {}, args) {
    let checkLogin, appUrl;
    if (args)
      ({
        checkLogin,
        appUrl
      } = args);
    checkLogin = checkLogin == undefined ? true : checkLogin;
    appUrl = appUrl == undefined ? false : appUrl;
    if (checkLogin) {
      this._header = {
        'content-type': appUrl ? 'application/x-www-form-urlencoded' : 'application/json',
        'cookie': wx.getStorageSync("cookieKey")
      }
    } else {
      this._header = {
        'Content-Type': "application/x-www-form-urlencoded"
      }
    }

    return this.sendRequest(url, data, this._header, "POST", checkLogin)
  }

  //网络请求工具类
  sendRequest(url, data = {}, header = this._header, method = "GET", checkLogin) {

    url = configure.API_BASE_URL + url;
    wx.showLoading({
      title: '数据加载中...',
    })

    return new Promise((resolve, reject) => {
      let that = this;

      wx.request({
        url: url,
        data: data,
        method: method,
        header: header,
        dataType: 'JSON',
        success: function(res) {
          wx.hideLoading();
          if (res.statusCode == 200) {
            console.log(res);
            if (res.data.indexOf('用户登录')>0){
              wx.redirectTo({
                url: '/pages/login/index',
              })
              return false;
            }
            //200:服务端业务处理正常结束
            if (!checkLogin) {
              if (res && res.header && res.header['Set-Cookie']) {
                wx.setStorageSync('cookieKey', res.header['Set-Cookie']);
                console.log(res.header['Set-Cookie']);
              }
            }
            if (typeof res.data === 'string')
              resolve(JSON.parse(res.data));
            else
              resolve(res.data);
          } else {
            //200以外的code可以单独处理了
            if (that._errorHandler != null) {
              that._errorHandler(res);
            }

            if (typeof res.data === 'string')
              reject(JSON.parse(res.data));
            else
              reject(res.data);
          }
        },
        fail: function(res) {
          wx.hideLoading();
          if (that._errorHandler != null) {
            that._errorHandler(res);
          }

          reject(res);
        },
        complete: function(res) {
          wx.hideLoading()
        }
      })
    })
  }
}

export default request;