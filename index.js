// express 
const express = require('express');
const app = express();

// 开启跨域 
app.all('*', (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "content-type");
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
    console.log('获取了一次评论列表');
    Comments.find({}, (err, result) => {
        console.log(result);
        res.json(JSON.stringify(result));
    })
})

// 添加留言
app.post('/myWebSite/submitComment', (req, res) => {
    console.log('留言一次');
    const { name, content, createTime } = req.body;
    const comment = new Comments({
        name: name,
        content: content,
        createTime: createTime,
        praise: 0,
        disapprove: 0,
        comments: []
    })
    comment.save();
    res.json(JSON.stringify({ status: 200, message: '留言成功' }));
})

// 回复留言
app.post('/myWebSite/replyComment', async (req, res) => {
    console.log('回复留言一次');
    const { id, content, name } = req.body;
    const comment = new Comments({
        name: name,
        content: content,
        createTime: createTime,
        praise: 0,
        disapprove: 0,
    })
    const { comments } = await Comments.findById(id);
    comments.push(comment);
    await Comments.findByIdAndUpdate(id, { comments: comments });
    res.json(JSON.stringify({ status: 200, message: '评论成功' }));
})


// 点赞
app.post('/myWebSite/praise', async (req, res) => {
    console.log('点赞一次');
    const { id } = req.body;
    const { praise } = await Comments.findById(id);
    await Comments.findByIdAndUpdate(id, { praise: praise + 1 });
    res.json(JSON.stringify({ status: 200, message: '点赞成功' }));
})


// 踩
app.post('/myWebSite/disapprove', async (req, res) => {
    console.log('踩一次');
    const { id } = req.body;
    const { disapprove } = await Comments.findById(id);
    await Comments.findByIdAndUpdate(id, { disapprove: disapprove + 1 });
    res.json(JSON.stringify({ status: 200, message: '踩一下' }));
})

app.listen(3000);
console.log('服务器已启动...')