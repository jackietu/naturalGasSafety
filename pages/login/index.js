// pages/login/index.js
import {
  encrypt
} from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    param1:'',
    param2:'',
  },

  //去看视频
  goVideo: function(){
    let json = {
      url: 'https://gmzj.qunfangcloud.com:8180/video/i7dnp62tdd8g3330yv96134f44q417j1.mp4',
    }
    wx.navigateTo({
      url: '/pages/login/retrievePassword?params='+JSON.stringify(json),
    })
  },

  bindMobileLogin: function(e) {
    let postData = e.detail.value;
    if (!postData.param1) {
      app.showShortToast('请输入账号！');

      return false;
    }

    if (!postData.param2) {
      app.showShortToast('请输入密码！');

      return false;
    }

    postData.loginType = "app";
    let decParam2 = postData.param2;
    postData.param2 = encrypt(postData.param2);
    console.log(postData);

    app.allRequest.login(postData).then(res => {
      if (res.code == 0) {
        app.showShortToast('登陆成功！');

        wx.setStorageSync('loginInfo', { param1: postData.param1, param2: decParam2});
        wx.setStorageSync('userInfo', res.data)
        // app.globalData.userInfo = res.data;
        // let roleId = res.data.roleIds[0];
        // app.globalData.type = roleId == 101 ? 1 : roleId == 103 ? 2 : 3;
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        app.showShortToast(res.msg);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let rememberInfo = wx.getStorageSync("loginInfo");
    if(rememberInfo){
      this.setData({
        param1:rememberInfo.param1,
        param2:rememberInfo.param2
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