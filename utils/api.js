module.exports = {
  login: '/login', //用户登录
  uploadFile: '/common/sysFile/upLoadItemImage', //上传图片
  registerUser: '/sys/user/register',//多种类型账号注册

  listSysDept: '/system/sysDept/list',//查询部门列表

  getUserDetail: '/sys/user/getUserDetail',//巡查员角色获取我的信息

  allItemDanger: '/danger/item/allItem',//查询所有隐患

  saveCheckDanger: '/danger/check/save',//提交巡查

  taskCheckDanger: '/danger/check/task',//查看指派任务

  queryTaskCheckDanger: '/danger/check/queryTask',//显示任务指派明细

  dealTaskCheckDanger: '/danger/check/dealTask',//处理指派任务

  getAuditUserList: '/sys/user/getAuditUserList',//获取用户列表住建局获取企业 / --- /企业获取巡查员

  poolCheckDanger: '/danger/check/pool',//查询隐患池

  assignCheckDanger: '/danger/check/assign',//显示任务指派页面

  findCheckUser: '/danger/check/findCheckUser',//显示巡查员人数及公里数

  assignCheckDangerSubmit: '/danger/check/assign',//任务指派

  getAuditUserDetail: '/sys/user/getAuditUserDetail',//获取待审核用户的详情信息

  updateUserStatus: '/sys/user/updateUserStatus',//用户账号审核功能

  getRewordList: '/scoreReward/getRewordList',//巡查员查询积分列表

  getAuditRewordList: '/scoreReward/getAuditRewordList',//企业获得积分审核列表

  updateAuditReword: '/scoreReward/updateAuditReword',//企业审核积分

  getScoreAudit: '/danger/check/scoreAudit',//积分审核

  getFuzzyUserListByUserName: '/sys/user/getFuzzyUserListByUserName',//企业 / --/住建局通过姓名模糊搜索用户列表功能

  dataStatistic: '/danger/check/dataStatistic',//整改概况(数据统计)

  listCheckDanger: '/danger/check/checkDanger/list',//隐患抽查列表

  checkInfoDanger: '/danger/check/checkInfo',//查看巡查信息

  findOwnCheckList: '/danger/check/findOwnCheckList',//隐患巡查上报数

  findOwnCheckDetail: '/danger/check/findOwnCheckDetail',//隐患巡查员巡查详情

  findOwnDealList: '/danger/check/findOwnDealList',//隐患巡查整改明细列表

  sceneDealInfo: '/danger/check/sceneDealInfo',//巡查员查看整改信息

  getCondition: '/danger/check/getCondition',//获取企业及接到信息

  listTraceCheck: '/danger/check/trace/list',//隐患跟踪列表

  traceDetailCheck: '/danger/check/traceDetail',//隐患跟踪详情

  commitCheckDanger: '/danger/check/checkDanger/commit',//燃气协会抽查结果提交



}