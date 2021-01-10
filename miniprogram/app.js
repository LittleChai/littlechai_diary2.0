//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'littlechai-8gbpxj2baa4e412f',
        traceUser: true,
      })
    }


    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight;
        this.globalData.customHeight = wx.getMenuButtonBoundingClientRect();
      }, fail(err) {
        console.log(err);
      }
    })

    // 判断有没有openid,没有就是没有登录
    if(!wx.getStorageSync('openid')) {
      if(wx.getStorageSync('color')) {
        this.globalData.color = wx.getStorageSync('color');
      }
      if(wx.getStorageSync('blur')) {
        this.globalData.blur = wx.getStorageSync('blur');
      }
      if(wx.getStorageSync('background')) {
        this.globalData.background = wx.getStorageSync('background');
      }
      this.globalData.initBol = true;
      console.log(this.globalData.initBol)
    }
    // 登录了
    else {
      this.initData();
    }

  
  },
  async initData() {
      let openid = wx.getStorageSync('openid')
      let res = await this.ifUser(openid);
      let checkInfo = await wx.getUserInfo({})

      console.log(checkInfo)
      if(checkInfo.userInfo.avatarUrl !== res.res.data.userInfo.avatarUrl || checkInfo.userInfo.nickName !== res.res.data.userInfo.nickName) {
        let newInfo = await wx.cloud.callFunction({
          name: 'updateCustom',
          data: {
            openid: wx.getStorageSync('openid'),
            update: {
              userInfo: checkInfo.userInfo
            }
          }
        })
        if(newInfo.result.stats.updated === 1) {
          await this.initData();
        }
      }
      // return false;

      console.log(res)
      if(res.res.status === 'ok') {
        let user = res.res.data;
        this.globalData.color = user.color;
        wx.setStorageSync('color', user.color);
        wx.setStorageSync('hue', user.hue);
        this.globalData.blur = user.blur;
        this.globalData.background = user.background_bol;
        wx.setStorageSync('blur', user.blur);
        wx.setStorageSync('background', user.background_bol);
        wx.setStorageSync('user', user);
        this.globalData.userInfo = user.userInfo;
        this.globalData.roles = user.roles;
      }
      else {
        if(wx.getStorageSync('color')) {
          this.globalData.color = wx.getStorageSync('color');
        }
        if(wx.getStorageSync('blur')) {
          this.globalData.blur = wx.getStorageSync('blur');
        }
        if(wx.getStorageSync('background')) {
          this.globalData.background = wx.getStorageSync('background');
        }
      }
      this.globalData.initBol = true;
  },
  changeColor(color) {
    this.globalData.color = color;
  },
  // 获取openid
  async onGetOpenid() {
    
    let res = await wx.cloud.callFunction({
      name: 'login',
      data: {},
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      return {
        status: 'ok',
        openid: res.result.openid
      }
    }
    else {
      return {
        status: 'err'
      }
    }
  },
  //注册用户
  async createUser(openid,userInfo) {
    let newUserInfo = userInfo;
    newUserInfo.headline = "";
    const userSchema = {
      openid: openid,
      userInfo: newUserInfo,
      created_time: new Date().getTime(),
      updated_time: new Date().getTime(),
      diary: [],
      diary_num: 0,
      background_url: "https://6c69-littlechai-8gbpxj2baa4e412f-1257711591.tcb.qcloud.la/system/default.jpg?sign=a77b8fd58e9edc5b370e7837ea5e7876&t=1610260942",
      color: wx.getStorageSync('color') || "rgb(244,118,149)",
      hue: wx.getStorageSync('hue') || 347,
      blur: this.globalData.blur,
      background_bol: this.globalData.background,
      like: [],
      dislike: [],
      collection: [],
      collection_num: 0,
      following: [],
      following_num: 0,
      fans: 0,
      roles: ["user"]
    }
    let res = await wx.cloud.callFunction({
      name: 'createUser',
      data: {
        user: userSchema
      }
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      wx.setStorageSync('user', userSchema)
      return {
        status: 'ok',
        res: res.result
      }
    }
    else {
      return {
        status: 'err',
        res: res.result
      }
    }
    console.log(userSchema)
  },
  //判断用户否存在
  async ifUser(openid) {
    let res = await wx.cloud.callFunction({
      name: 'ifUser',
      data: {
        openid: openid
      }
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      return {
        status: 'ok',
        res: res.result
      }
    }
    else {
      return {
        status: 'err',
        res: res.result
      }
    }
  },

  globalData: {
    //全局颜色
    color: "rgb(244,118,149)",
    blur: false,
    background: false,
    initBol: false,
    userInfo: {},
    roles: ["user"]
  }
})
