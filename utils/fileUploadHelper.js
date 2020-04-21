import allRequest from './allRequest.js'
import regeneratorRuntime from './runtime.js'
class fileUploadHelper {

  constructor() {
  }

  static imageList = [];//已上传图片列表
  static tempFilePaths = [];//微信临时图片列表
  static type = 1;//上传图片的类型

  /*
  选择图片（surplusSize：剩余可选择图片数量，maxSize：可选择图片总数）
  */
  static chooseImage(surplusSize, type = 1, maxSize = 3) {

    return new Promise((resolve, reject) => {
      if (surplusSize <= 0) {
        wx.showToast({
          title: `图片最多只可选择${maxSize}张！`,
          icon: 'none',
          duration: 500
        })
        reject(null);
        return false;
      }

      let _this = this;
      wx.showLoading({
        title: '图片上传中...',
      })
      wx.chooseImage({
        count: surplusSize,
        sizeType: ['compressed'],
        success: function (res) {
          _this.tempFilePaths = res.tempFilePaths;
          _this.imageList = [];
          _this.type = type;
          _this._syncUpload(_this, resolve);
        },
        fail: function (res) {
          wx.hideLoading()
          reject(res);
        }
      });
    })
  }

  /*
  图片依次上传
  */
  static _syncUpload = async (context, resolve) => {
    if (!context.tempFilePaths.length) {
      wx.hideLoading()
      resolve(context.imageList);
    } else {

      let tempFilePath = context.tempFilePaths.pop();
      let result = await allRequest.uploadFile(tempFilePath, { type: context.type });
      try {
        if(result.code==0){
          let { id, filePath } = result.data;
          context.imageList.push({
            id, filePath
          })

          context._syncUpload(context, resolve);
        }else{
          context._syncUpload(context, resolve);
        }
        
      } catch (e) { }
    }
  }

}

export default fileUploadHelper