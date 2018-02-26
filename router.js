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
    let days = (new Date().getTime() - parseInt(item.create_time)) / (24*3600*1000)
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
      newList
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

module.exports = router
