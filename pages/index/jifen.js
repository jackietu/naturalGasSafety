// pages/index/jifen.js
const app = getApp();
let userId = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDateText: '',
    endDateText: '',
    startDate: '',
    endData: '',
    pageIndex: 1,
    list: [],
    total: 0,
  },

  //日期变化
  bindDateChange: function(e) {
    let type = e.target.dataset.type;
    let value = e.detail.value;

    if (type == 1) {
      this.setData({
        startDateText: value
      })
    } else if (type == 2) {
      this.setData({
        endDateText: value
      })
    }
  },

  //获取积分
  getRewordList:function(){
    let params = {
      userId: userId,
      pageNumber: this.data.pageIndex,
      pageSize: app.pageSize,
      startDate:this.data.startDate,
      endDate:this.data.endDate
    };
    let _this = this;
    app.allRequest.getRewordList(params)
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
    userId = options.userId;
    this.getRewordList();
  },

  //搜索
  searchMethod:function(e){
    let type=e.target.dataset.type;
    if(type==1){
      this.data.pageIndex = 1;
      this.data.startDate = this.data.startDateText;
      this.data.endDate = this.data.endDateText;
    }else if(type==2){
      this.data.pageIndex = 1;
      this.data.startDate = '';
      this.data.endDate = '';
      this.setData({
        startDateText:'',
        endDateText:''
      })
    }

    this.getRewordList();
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
    this.data.pageIndex++;
    let _this = this;
    if (this.data.total > (this.data.pageIndex - 1) * app.pageSize) {
      wx.stopPullDownRefresh()

      _this.getRewordList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})