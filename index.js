// 服务器
const http = require('http');
const app = http.createServer();

// 连接到mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myWebSiteComments', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log('数据库连接成功!'))
    .catch(err => console.log(err));

// 设置集合规则
const CommentsSchema = new mongoose.Schema({
    name: String,
    content: String,
    createTime: { type: Date, default: Date.now() },
    praise: Number,
    disapprove: Number
})

// 根据集合规则创建集合的构造函数,同时创建集合
const Comments = mongoose.model('comments', CommentsSchema);


app.on('request', (req, res) => {
    console.log(req.body);
    const { name, content, createTime } = req.body;
    if (req.method === 'POST') {
        const comment = new Comments({
            name: name,
            content: content,
            createTime: createTime,
            praise: 0,
            disapprove: 0
        })
        console.log(comment);
        comment.save();
    }
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' });
    res.end(JSON.stringify(req));
})

app.listen(3000);
console.log('服务器已启动...')