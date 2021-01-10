// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    if (event.openid !== 'oRp3y0MvsGx3TW5zPRYg4iUcTTpI') {
      return false;
    }
    console.log(event)
    return await db.collection('admin').where({
        openid: event.openid
      })
      .update({
        data: {
          controlDiary: event.bol
        }
      })

  } catch (e) {
    console.error(e)
  }
}