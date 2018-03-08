/**
 * @author monkeywang
 * Date: 2018/2/26
 */
const Router = require('koa-router')
const router = new Router()
const { query } = require('./mysql/util/db');

router.get('/getProductList', async ( ctx )=>{
  let sql = 'SELECT * FROM product'
  let result = await query(sql)
  let hostList = []
  let newList = []
  result.forEach((item) => {
    let days = (new Date().getTime() - item.create_time) / (24*3600*1000)
    if (item.sales >= 5) {
      hostList.push(item)
    }
    if (days < 1) {
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
  let sql = `INSERT INTO product (name,price,sales,origin,description,create_time, tag, mainImg, detailImg) VALUES ('${postData.name}',${postData.price},0,'${postData.origin}','${postData.description}',${create_time} , ${postData.tag}, '${postData.mainImg}', '${postData.detailImg}');`
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
  let sql = `select * FROM product WHERE id=?`
  try {
    let result = await query(sql, id)
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

module.exports = router
