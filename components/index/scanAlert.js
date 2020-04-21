// components/index/scanAlert.js
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    imageUrl: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showAlert:function(){
      this.setData({show:true})
    },
    hideAlert:function(){
      this.setData({show:false})

      this.triggerEvent('pevent')
    },

  }
})
