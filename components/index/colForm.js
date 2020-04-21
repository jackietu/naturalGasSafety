// components/index/colForm.js
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    placeHolder:{
      type: String,
      value:''
    },
    isPicker:{
      type:Boolean,
      value:false,
    },
    hasImage: {
      type: Boolean,
      value: false,
    },
    list:{
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index:-1,
    images: ['/img/pz.png', '/img/pz.png', '/img/pz.png']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange:function(e){

    }
  }
})
