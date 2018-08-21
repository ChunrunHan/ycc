var express = require('express');
var app = express();
var cors = require('cors'); //	解决跨域
var bodyParser = require('body-parser'); // 解析post数据
var mysql = require('mysql'); // 连接mysql
var connection = mysql.createConnection({
    // host: 'www.rainrain.xin',
    host: 'localhost',
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

app.get('/api', function (req, res) {
    console.log('get请求')
    res.send('Hello World');
})


var server = app.listen(12345, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})