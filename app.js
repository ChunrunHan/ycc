var express = require('express');
var app = express();
var cors = require('cors'); //	解决跨域
var bodyParser = require('body-parser'); // 解析post数据
var mysql = require('mysql'); // 连接mysql
var Public = require('./login/index.js');
var User = require('./user/index.js');
var Class = require('./class/index.js');
var Score = require('./score/index.js')
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

/**
 * 登录接口
 */
// 学生教师登录
app.get('/studentdb/user/login/:id/:password/:role', Public.login);

/**
 * 学生教师信息处理接口
 */
// 获取所有学生信息
app.get('/studentdb/student/info/:page/:size', User.getStudent);

// 获取所有教师信息
app.get('/studentdb/teacher/info/:page/:size', User.getTeacher);

// 获取教师id和名字
app.get('/studentdb/teacher/id',User.getTeacherId)

// 根据id和role获取用户信息
app.get('/studentdb/userinfo/:id/:role',User.getUserInfo)

// 新增学生教师信息
app.post('/studentdb/user/insert', User.insertInfo);

// 删除学生教师信息
app.delete('/studentdb/user/delete/:id/:role', User.deleteUser);

// 编辑学生教师信息
app.put('/studentdb/user/edit', User.editUser);

/**
 * 课程处理接口
 */
// 获取课程信息
app.get('/studentdb/class/info', Class.getClass);

// 新增课程信息
app.post('/studentdb/class/insert', Class.insertClass);

// 删除课程信息
app.delete('/studentdb/class/delete/:id', Class.deleteClass);

// 编辑课程信息
app.put('/studentdb/class/edit', Class.editClass);


// 成绩处理接口
// 新增成绩接口
app.post('/studentdb/score/insert',Score.insertScore)

// 删除成绩接口
app.delete('/studentdb/score/delete/:id',Score.deleteScore)

// 编辑成绩接口
app.put('/studentdb/score/edit',Score.editScore)

// 获取所有学生成绩信息
app.get('/studentdb/score/info/all/:page/:size', Score.getAllScore)

// 根据学生学号获取成绩信息
app.get('/studentdb/score/info/byStudent/:id', Score.getScoreByStudentID)

// 导出成绩
app.get('/studentdb/score/export/all',Score.exportAllScore)

var server = app.listen(12345, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})