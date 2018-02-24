/**
 * @author monkeywang
 * Date: 2018/2/24
 */
const https = require('https')
const fs = require('fs')

const options = {
  key: fs.readFileSync('./keys/2_monkeywang.cn.key'),
  cert: fs.readFileSync('./keys/1_monkeywang.cn_bundle.crt')
}

https.createServer(options, function (req, res) {
  res.end('hello world')
}).listen(8000)
