const aes = require('./aes.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const phone = (size) => {
  let rule = /^1[3456789]\d{9}$/;
  let res = {
    status: true,
    tip: '输入正确'
  }
  if (size == '') {
    res.status = false;
    res.tip = '手机号码不能为空！'
    return res;
  }
  if (size.length < 11) {
    res.status = false;
    res.tip = '手机号码格式错误！'
    return res;
  }
  if (!rule.test(size)) {
    res.status = false;
    res.tip = '手机号码格式错误！'
    return res;
  }
  return res;
}

const randomKey = 'szgm@2019#010755';
const encrypt = (word)=> {
  let key = aes.CryptoJS.enc.Utf8.parse(randomKey); 
  let srcs = aes.CryptoJS.enc.Utf8.parse(word);
  let encrypted = aes.CryptoJS.AES.encrypt(srcs, key, {
    mode: aes.CryptoJS.mode.ECB,
    padding: aes.CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

module.exports = {
  formatTime: formatTime,
  phone: phone,
  encrypt: encrypt
}
