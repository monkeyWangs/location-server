/**
 * @author monkeywang
 * Date: 2018/2/26
 */
const Router = require('koa-router')
const router = new Router()
const { query } = require('./mysql/util/db');
const axios = require('axios')
var redis = require("redis"),
  client = redis.createClient(6379,'127.0.0.1',{});

router.get('/getProductList', async ( ctx )=>{
  let order = ctx.query.order || 'time-asc'
  let search = ctx.query.search
  let classMenu = ctx.query.classMenu
  let sql = 'SELECT * FROM product'
  if (search) {
    sql += ` where name like '%${search}%'`
  }
  if (classMenu) {
    sql += ` where classMenu='${classMenu}'`
  }

  switch (order) {
    case 'time-asc':
      sql += ' order by create_time desc'
      break;
    case 'price-asc':
      sql += ' order by price asc'
      break;
    case 'price-desc':
      sql += ' order by price desc'
      break;
  }
  let result = await query(sql)
  let hostList = []
  let newList = []
  result.forEach((item) => {
    let days = (new Date().getTime() - item.create_time) / (24*3600*1000)
    if (item.sales >= 0) {
      hostList.push(item)
    }
    if (newList.length < 4) {
      newList.push(item)
    }
  })
  ctx.body = {
    code: 0,
    data: {
      page: 1,
      hostList,
      newList,
      result
    }
  }
})

router.get('/getBanner', async ( ctx )=>{
  let sql = 'SELECT * FROM product where tag=1'
  let result = await query(sql)
  ctx.body = {
    code: 0,
    data: result
  }
})

router.post('/addProduct', async (ctx) => {
  let postData = ctx.request.body
  let create_time = (new Date().getTime()).toString()
  let sql = `INSERT INTO product (name,price,sales,origin,description,create_time, tag, mainImg, detailImg, classMenu, freight) VALUES ('${postData.name}',${postData.price},0,'${postData.origin}','${postData.description}',${create_time} , ${postData.tag}, '${postData.mainImg}', '${postData.detailImg}', '${postData.classMenu}', '${postData.freight}');`
  try {
    let result = await query(sql)
    ctx.body = {
      code: 0,
      data: 'success'
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      data: '操作失败！请检查数据格式'
    }
  }

})

router.post('/deleteProduct', async (ctx) => {
  let id = ctx.request.body.id
  let sql = `DELETE FROM product WHERE id=?`
  try {
    let result = await query(sql, id)
    ctx.body = {
      code: 0,
      data: '删除成功'
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      data: '操作失败！请检查数据格式'
    }
  }
})

router.get('/productDetail', async (ctx) => {
  let id = ctx.query.id
  let sql = `select * FROM product WHERE id=${id}`
  console.log(sql)
  try {
    let result = await query(sql)
    ctx.body = {
      code: 0,
      data: result
    }
  } catch (e) {
    ctx.body = {
      code: 0,
      data: '操作失败'
    }
  }
})

router.get('/doLogin', async (ctx) => {
  let sessionId = ctx.query.sessionId ? ctx.query.sessionId.toString() : 0
  let js_code = ctx.query.js_code;
  let userInfo = JSON.parse(ctx.query.userInfo)
  let app_id = 'wxae9e5cf422c8055f';
  let app_secret = 'f54190ead0416d4ed6122bf3bc7db217';
  let grant_type = 'authorization_code';

  if (sessionId) {
    let primaryId = await getPrimaryId(sessionId)
    if (primaryId) {
      return ctx.body = {
        code: 0,
        data: {
          sessionId
        }
      }
    }
  }

  try{
    let data = await axios.get('https://api.weixin.qq.com/sns/jscode2session',{
      params: {
        appid: app_id,
        secret: app_secret,
        js_code,
        grant_type
      }
    })
    let primaryId = data.data.openid
    let sql = `select * FROM users WHERE primaryId='${primaryId}'`

    let result = await query(sql)
    if (!result.length) {
      let insert_sql = `INSERT INTO users (nick_name, city, country, avatarUrl, gender, province, primaryId) VALUES ('${userInfo.nickName}', '${userInfo.city}', '${userInfo.country}', '${userInfo.avatarUrl}', ${userInfo.gender}, '${userInfo.province}','${primaryId}')`
      await query(insert_sql)
    }
    let sessionId = (new Date().getTime() + parseInt(100 * Math.random())).toString()
    client.set(sessionId, data.data.openid)
    client.expire(sessionId, data.data.expires_in)
    ctx.body = {
      code: 0,
      data: {
        sessionId
      }
    }
  } catch (e) {
    console.log(e)
    ctx.status = 500
    ctx.body = {
      code: 500,
      data: '登录出错'
    }
  }
})

let getPrimaryId = function (sessionId) {
  return new Promise((resolve) => {
    client.get(sessionId,  (err, res) => {
      resolve(res)
    })
  })
}

router.post('/addCollection', async (ctx) => {
  let sessionId = ctx.request.body.sessionId.toString()
  let productId = ctx.request.body.productId
  let create_time = new Date().getTime()
  let primaryId = await getPrimaryId(sessionId)
  if (primaryId) {
    let searchSql = `select product_id from collection where user_id = '${primaryId}' and product_id=${productId}`
    let res = await query(searchSql)
    if (!res.length) {
      let sql = `insert into collection (user_id, product_id, create_time) values ('${primaryId}', ${productId}, ${create_time})`
      await query(sql)
    }
    ctx.body = {
      code: 0,
      data: {
        msg: '添加成功'
      }
    }

  } else {
    ctx.status = 401
    ctx.body = {
      code: 401,
      data: '登录出错'
    }
  }
})


router.get('/getCollections', async (ctx) => {
  let sessionId = ctx.query.sessionId.toString()
  let primaryId = await getPrimaryId(sessionId)
  if (primaryId) {
    let searchSql = `select product_id,name,price,origin,mainImg from collection join product on collection.product_id=product.id where user_id='${primaryId}'`
    let result = await query(searchSql)
    ctx.body = {
      code: 0,
      data: {
        result
      }
    }

  } else {
    ctx.status = 401
    ctx.body = {
      code: 401,
      data: '登录出错'
    }
  }
})

router.post('/delCollection', async (ctx) => {
  let sessionId = ctx.request.body.sessionId.toString()
  let productId = ctx.request.body.productId
  let primaryId = await getPrimaryId(sessionId)
  if (primaryId) {
    let sql = `delete from collection where user_id='${primaryId}' and product_id=${productId}`
    await query(sql)
    ctx.body = {
      code: 0,
      data: {
        msg: 'ok'
      }
    }
  } else {
    ctx.status = 401
    ctx.body = {
      code: 401,
      data: '登录出错'
    }
  }
})
module.exports = router
