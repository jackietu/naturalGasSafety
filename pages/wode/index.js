// pages/wode/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: app.globalData.type,
    userInfo: {},

    searchText: '', 
    search: '',//搜索条件
    pageIndex: 1,
    list: [],
    total: 0,

    checkDangerNum: 0,//隐患排查数
    dealDangerNum: 0,//隐患整改数
    notCheckCompanyNum: 0,//月度排查隐患数为0的企业数
    overTimeNum: 0,//超时未处理隐患数
    reportNum: 0,//上报统一分拨数
    scoreSort: [],//企业积分排行
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
      this.getAuditUserList();
    }
  },

  //删除用户
  delUser:function(e){
    let source = e.currentTarget.dataset.source;
    let _this = this;
    wx.showModal({
      title: '确认',
      content: `是否确认删除此用户（${source.name ? source.name : source.username}）？`,
      success: function (e) {
       if(e.confirm){
         let postData = {
           userId: source.id,
           status: 0
         }
         app.allRequest.updateUserStatus(postData).then(res => {
           if (res.code == 0) {
             wx.showModal({
               content: '删除成功！',
               showCancel: false,
               success: function (res) {
                 _this.data.pageIndex = 1; //重新开始搜索
                 _this.getAuditUserList();
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

  //企业获取巡查员
  getAuditUserList: function() {
    let params = {
      userName: this.data.search,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize
    };
    let _this = this;
    app.allRequest.getAuditUserList(params)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let type = app.globalData.type;
    let _this = this;
    this.setData({
      type: type
    })
    if (type == 1) {
      wx.setNavigationBarTitle({
        title: '我的信息'
      })

      app.allRequest.getUserDetail().then(res => {
        if (res.code == 0) {
          _this.setData({
            userInfo: res.data
          })
        } else {
          app.showShortToast(res.msg);
        }
      })
    } else if (type == 2) {
      wx.setNavigationBarTitle({
        title: '用户管理'
      })

      this.getAuditUserList();
    } else if (type == 3 || type == 4) {
      wx.setNavigationBarTitle({
        title: '整体概括'
      })

      this.dataStatistic();
    }
  },

  //统计
  dataStatistic:function(){
    let _this = this;
    app.allRequest.dataStatistic()
      .then(res => {
       if(res.code==0){
         let {
           checkDangerNum,//隐患排查数
           dealDangerNum,//隐患整改数
           notCheckCompanyNum,//月度排查隐患数为0的企业数
           overTimeNum,//超时未处理隐患数
           reportNum,//上报统一分拨数
           scoreSort,//企业积分排行
         } = res.data;

         scoreSort.sort((a,b)=>b.score-a.score);

         _this.setData({
           checkDangerNum,//隐患排查数
           dealDangerNum,//隐患整改数
           notCheckCompanyNum,//月度排查隐患数为0的企业数
           overTimeNum,//超时未处理隐患数
           reportNum,//上报统一分拨数
           scoreSort,//企业积分排行
         })

       }else{
         app.showShortToast(res.msg)
       }
      })
  },

  /*上拉触底时触发*/
  onReachBottom: function() {
    if (app.globalData.type == 2) {
      this.data.pageIndex++;
      let _this = this;
      if (this.data.total > (this.data.pageIndex - 1) * app.pageSize) {
        wx.stopPullDownRefresh()

        if (app.globalData.type == 2) {
          _this.getAuditUserList();
        }
      }
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
    if (app.globalData.pageReload){
      if (app.globalData.type==2){
        app.globalData.pageReload = false;

        this.data.pageIndex = 1; //重新开始搜索
        this.getAuditUserList();
      }
    }
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