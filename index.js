const http = require('http');

const app = http.createServer();

app.on('request', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.end(`<div>爱你宝贝！</div>`)
})

app.listen(3000);
console.log('服务器已启动...')