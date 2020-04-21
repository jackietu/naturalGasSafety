// pages/login/register.js
const app = getApp()
import { phone, encrypt } from '../../utils/util.js'
let enterpriseList = [], gridList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filePrevPath: app.filePrevPath,
    roles: [],
    enters: [],
    depts: [],
    enterIdx: 0,
    roleIdx: 0,
    deptIdx: 0,
    imageList: [],
  },

  bindRegister:function(e){
    
    let formData = e.detail.value;
    let phoneRes = phone(formData.mobile);
    if (!phoneRes.status){
      app.showShortToast(phoneRes.tip);
      return false;
    }
    if (!formData.name) {
      app.showShortToast('姓名不可为空！');
      return false;
    }
    if (this.data.enterIdx == 0) {
      app.showShortToast('请选择所属企业！');
      return false;
    }
    if(this.data.roleIdx == 0){
      app.showShortToast('请选择申请角色！');
      return false;
    }
    if (!formData.password) {
      app.showShortToast('请填写密码！');
      return false;
    }
    if (!formData.confirmpassword) {
      app.showShortToast('请填写确认密码！');
      return false;
    }
    if (formData.confirmpassword != formData.password){
      app.showShortToast('两次密码输入不一致！');
      return false;
    }
    if (this.data.imageList.length<2){
      app.showShortToast('至少需要上传两张证书！');
      return false;
    }
    if (this.data.roleIdx == 1 && this.data.deptIdx == 0){
      app.showShortToast('请选择运营点！');
      return false;
    }

    let postData = Object.assign({},formData);
    delete postData.confirmpassword 
    postData.password = encrypt(postData.password);
    // postData.roleIds = app.roles[this.data.roleIdx-1].id;
    postData.roleId = app.roles[this.data.roleIdx - 1].id;
    postData.imageId = this.data.imageList.map(item=>{return item.id});
    if(this.data.roleIdx==1){//巡查员
      postData.deptId = gridList[this.data.deptIdx - 1].id;
    } else {//其他
      postData.deptId = enterpriseList[this.data.enterIdx - 1].id;
    }

    app.allRequest.registerUser(postData).then(res=>{
      if(res.code==0){
        app.showShortToast('注册成功！');
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }else{
        app.showShortToast(res.msg);
      }
    });
  },

  //下拉选择改变
  bindPickerChange: function (e) {
    let source = e.currentTarget.dataset.source;
    let _this = this;
    if (source == 1) {
      this.setData({
        enterIdx: e.detail.value
      })

      if(e.detail.value>0){
        app.allRequest.listSysDept(enterpriseList[e.detail.value-1].id).then(res => {
          if (res.code == 0) {
            let result = res.data.map(item => {
              return {
                id: item.deptId,
                name: item.name
              }
            })

            gridList = result;
            let depts = result.map(item => {
              return item.name
            });

            depts.unshift('请选择')

            _this.setData({
              depts: depts
            })

          }
        })
      }
    } else if (source == 2) {
      this.setData({
        roleIdx: e.detail.value
      })
    } else if (source == 3) {
      this.setData({
        deptIdx: e.detail.value
      })
    }
  },

  //删除图片
  deleteImage: function (e) {
    let { index } = e.target.dataset;
    let list = Object.assign([], this.data.imageList);
    app.deleteImage(index, 'imageList', list);
  },

  //预览图片
  previewImage: function (e) {
    let { index } = e.target.dataset;

    app.previewImage(index,this.data.imageList);
  },

  //更多图片
  moreImage: function (e) {
    app.moreImage('imageList', this.data.imageList, 3)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let roles = app.roles.map(res=>{
      return res.name;
    })
    roles.unshift('请选择');
    this.setData({roles:roles})

    let _this = this;
    app.allRequest.listSysDept(2).then(res=>{
      if(res.code==0){
        let result = res.data.map(item=>{
          return {
            id: item.deptId,
            name: item.name
          }
        })

        enterpriseList=result;
        let enters = result.map(item=>{
          return item.name
        });

        enters.unshift('请选择');

        _this.setData({
          enters: enters
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})