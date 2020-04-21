import request from './request.js'
import api from './api.js'
import regeneratorRuntime from './runtime.js'
import configure from './configure.js'

class allRequest {
  constructor() {
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  //用户注册
  registerUser(params){
    return this._request.sendPostRequest(api.registerUser, params, { checkLogin: false });
  }

  //用户登陆
  login(params) {
    return this._request.sendPostRequest(api.login, params, { checkLogin: false });
  }

  //查询部门列表
  listSysDept(parentId){
    return this._request.sendPostRequest(api.listSysDept, { parentId: parentId}, { checkLogin: false });
  }

  //巡查员角色获取我的信息
  getUserDetail(){
    return this._request.sendPostRequest(api.getUserDetail);
  }

  //查询所有隐患
  allItemDanger(gasType){
    return this._request.sendGetRequest(`${api.allItemDanger}/${gasType}`);
  }

  //巡查提交
  saveCheckDanger(params){
    return this._request.sendPostRequest(api.saveCheckDanger, params, { appUrl: true});
  }

  //查看指派任务
  taskCheckDanger(params){
    return this._request.sendPostRequest(api.taskCheckDanger, params, { appUrl: true });
  }

  //显示任务指派明细
  queryTaskCheckDanger(id){
    return this._request.sendGetRequest(`${api.queryTaskCheckDanger}/${id}`);
  }

  //处理指派任务
  dealTaskCheckDanger(params){
    return this._request.sendPostRequest(api.dealTaskCheckDanger, params, { appUrl: true });
  }

  //查询隐患池
  poolCheckDanger(params){
    return this._request.sendPostRequest(api.poolCheckDanger, params, { appUrl: true });
  }

  //获取用户列表住建局获取企业 / --- /企业获取巡查员
  getAuditUserList(params){
    return this._request.sendGetRequest(api.getAuditUserList, params, { appUrl: true });
  }

  //显示任务指派页面
  assignCheckDanger(id) {
    return this._request.sendGetRequest(`${api.assignCheckDanger}/${id}`);
  }

  //显示巡查员人数及公里数
  findCheckUser(params){
    return this._request.sendPostRequest(api.findCheckUser, params, { appUrl: true });
  }

  //任务指派
  assignCheckDangerSubmit(params){
    return this._request.sendPostRequest(api.assignCheckDangerSubmit, params, { appUrl: true });
  }

  //获取待审核用户的详情信息
  getAuditUserDetail(userId){
    return this._request.sendPostRequest(api.getAuditUserDetail, { userId: userId }, { appUrl: true });
  }

  //用户账号审核功能
  updateUserStatus(params) {
    return this._request.sendPostRequest(api.updateUserStatus, params, { appUrl: true });
  }

  //巡查员查询积分列表
  getRewordList(params){
    return this._request.sendPostRequest(api.getRewordList, params, { appUrl: true });
  }

  //企业获得积分审核列表
  getAuditRewordList(params) {
    return this._request.sendPostRequest(api.getAuditRewordList, params, { appUrl: true });
  }

  //积分审核详情
  getScoreAudit(params){
    return this._request.sendPostRequest(api.getScoreAudit, params, { appUrl: true });
  }

  //企业审核积分
  updateAuditReword(params){
    return this._request.sendPostRequest(api.updateAuditReword,params,{appUrl:true});
  }

  //企业 / --/住建局通过姓名模糊搜索用户列表功能
  getFuzzyUserListByUserName(params){
    return this._request.sendPostRequest(api.getFuzzyUserListByUserName, params, { appUrl: true });
  }

  //隐患抽查列表
  listCheckDanger(params){
    return this._request.sendPostRequest(api.listCheckDanger, params, { appUrl: true });
  }

  //隐患巡查上报数
  findOwnCheckList(params) {
    return this._request.sendPostRequest(api.findOwnCheckList, params, { appUrl: true });
  }

  //隐患巡查员巡查详情
  findOwnCheckDetail(id) {
    return this._request.sendGetRequest(`${api.findOwnCheckDetail}/${id}`);
  }

  //隐患巡查整改明细列表
  findOwnDealList(params) {
    return this._request.sendPostRequest(api.findOwnDealList, params, { appUrl: true });
  }

  //整改概况(数据统计)
  dataStatistic(){
    return this._request.sendGetRequest(api.dataStatistic);
  }

  //查看巡查信息
  checkInfoDanger(id){
    return this._request.sendGetRequest(`${api.checkInfoDanger}/${id}`);
  }

  //巡查员查看整改信息
  sceneDealInfo(id) {
    return this._request.sendGetRequest(`${api.sceneDealInfo}/${id}`);
  }

  //获取企业及接到信息
  getCondition() {
    return this._request.sendGetRequest(api.getCondition);
  }

  //隐患跟踪列表
  listTraceCheck(params){
    return this._request.sendPostRequest(api.listTraceCheck, params, { appUrl: true });
  }

  //隐患跟踪详情
  traceDetailCheck(params) {
    return this._request.sendPostRequest(api.traceDetailCheck, params, { appUrl: true });
  }
  
  //燃气协会抽查结果提交
  commitCheckDanger(params) {
    return this._request.sendPostRequest(api.commitCheckDanger, params, { appUrl: true });
  }

  errorHander(res) {
    console.error(res);
  }

  //图片上传方法
  static uploadFile = async (tempFilePath, postData = {}) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: configure.API_BASE_URL + api.uploadFile,
        filePath: tempFilePath,
        dataType: "json",
        header: {
          "Content-Type": "multipart/form-data",
          'cookie': wx.getStorageSync("cookieKey")
        },
        name: 'file',
        formData: postData,
        success: function (res) {
          if (res.statusCode == 200) {
            if (typeof res.data === 'string')
              resolve(JSON.parse(res.data));
            else 
              resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: function (res) {
          reject(res);
        }
      })
    });
  }
}

export default allRequest;