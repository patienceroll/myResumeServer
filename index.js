// express 
const express = require('express');
const app = express();

// 开启跨域 
app.all('*', (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
})

// 参数解析
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    disapprove: Number,
    comments: Array
})

// 根据集合规则创建集合的构造函数,同时创建集合
const Comments = mongoose.model('comments', CommentsSchema);

// 获取评论列表
app.get('/myWebSite/getComments', (req, res) => {
    Comments.find({
        name: /^[a-zA-Z0-9_-]{4,16}$/
    }, (err, result) => {
        res.json(JSON.stringify(result));
    })
})

// 添加评论
app.post('/myWebSite/submitComment', (req, res) => {
    const { name, content, createTime } = req.body;
    if (req.method === 'POST') {
        const comment = new Comments({
            name: name,
            content: content,
            createTime: createTime,
            praise: 0,
            disapprove: 0,
            comments: []
        })
        comment.save();
        res.json(JSON.stringify({ status: 200, message: '评论成功' }));
    }
    else {
        res.json(JSON.stringify({ status: 200, message: '评论失败' }));
    }
})

// 回复留言
app.post('/myWebSite/replyComment', async (req, res) => {
    const { id, content } = req.body;
    const { comments } = await Comments.findById(id);
    comments.push(content);
    await Comments.findByIdAndUpdate(id, { comments: comments });
    res.json(JSON.stringify({ status: 200, message: '评论成功' }));
})


// 点赞
app.post('/myWebSite/praise', async (req, res) => {
    const { id } = req;
    const { praise } = await Comments.findById(id);
    await Comments.findByIdAndUpdate(id, { praise: praise + 1 });
    res.json(JSON.stringify({ status: 200, message: '点赞成功' }));
})

// 踩
app.post('/myWebSite/disapprove', async (req, res) => {
    const { id } = req;
    const { disapprove } = await Comments.findById(id);
    await Comments.findByIdAndUpdate(id, { disapprove: disapprove + 1 });
    res.json(JSON.stringify({ status: 200, message: '踩一下' }));
})

app.listen(3000);
console.log('服务器已启动...')