var express = require('express');
var app = express();
var cors = require('cors'); //	解决跨域
var bodyParser = require('body-parser'); // 解析post数据
var mysql = require('mysql'); // 连接mysql
var public = require('./login/index.js');
var user = require('./user/index.js');
var connection = mysql.createConnection({
    host: 'www.rainrain.xin',
    // host: 'localhost',
    user: 'root',
    password: '7773712',
    database: 'studentdb'
});
connection.connect();
//环境变量
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: false
}));
// for parsing application/x-www-form-urlencoded
// 创建 applicati;on/x-www-form-urlencoded 编码解析
// app.get('/api', function (req, res) {
//     console.log('get请求')
//     res.send('Hello World');
// })

// 学生教师登录
app.get('/studentdb/user/login/:id/:password/:role', public.login);

// 获取所有学生信息
app.get('/studentdb/student/info/:page/:size', user.getStudent);

// 获取所有教师信息
app.get('/studentdb/teacher/info/:page/:size', user.getTeacher);

// 获取课程信息
app.get('/studentdb/class/info', public.getClass);

// 新增学生教师信息
app.post('/studentdb/user/insert', user.insertInfo);

// 删除学生教师信息
// app.delete('/studentdb/user/delete/:id', user.delete);

// 编辑学生教师信息
// app.put('/studentdb/user/edit', user.edit);



var server = app.listen(12345, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})