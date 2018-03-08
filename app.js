/**
 * @author monkeywang
 * Date: 2018/2/24
 */
const Koa = require('koa')
const https = require('https')
const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors');

const app = new Koa()
const router = require('./router')
app.use(bodyParser())
app.use(cors())

const options = {
  key: fs.readFileSync('./keys/2_monkeywang.cn.key'),
  cert: fs.readFileSync('./keys/1_monkeywang.cn_bundle.crt')
}

app
  .use(router.routes())
  .use(router.allowedMethods())

https.createServer(options, app.callback()).listen(443)
