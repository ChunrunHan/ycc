var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'www.rainrain.xin',
    // host:'localhost',
    user: 'root',
    password: '7773712',
    database: 'studentdb',
    multipleStatements:true

});
connection.connect();

// 学生教师登录接口get方法
exports.login = function( req, res){
    //	前后台用户登录接口
    console.log(req.params.id);
    console.log(req.params.password);
    console.log(req.params.role);
    //	查询用户是否存在
    var sql;
    var who;
    if(parseInt(req.params.role) == 1){
        sql = 'select * from teacher where id = ' + req.params.id;
        who = '教师'
    }else{
        sql = 'select * from student where id = ' + req.params.id;
        who = '学生'
    }

    connection.query(sql, function(err, result) {
        if(err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }

        console.log(result);

        if(result.length == 0) {
            var json = {
                errCode: 1,
                errMsg: who+'不存在',
                dataList: []
            }
            res.json(json);
        } else {
            //	用户存在判断 密码是否正确
            console.log('用户存在');
            console.log(result);
            console.log(result[0].password);
            if(req.params.password == result[0].passwd) {

                var json = {
                    errCode: 0,
                    errMsg: '登录成功',
                    dataList: result
                }
                res.json(json);
            } else {
                var json = {
                    errCode: 2,
                    errMsg: '密码错误',
                    dataList: []
                }
                res.json(json);
            }

        }
    })
}
