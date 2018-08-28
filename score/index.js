var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'www.rainrain.xin',
	// host:'localhost',
    user: 'root',
    password: '7773712',
    database: 'studentdb',
    useConnectionPooling: true

});
connection.connect();

// 获取所有学生成绩接口get方法
exports.getScore = function (req,res) {
    var sql = 'select * from class';
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
                errMsg: '没有更多数据了',
                dataList: []
            }
            res.json(json);
        } else {
            var json = {
                errCode: 0,
                errMsg: '获取数据成功',
                dataList: result
            }
            res.json(json);

        }
    })
}

// 新增成绩post
exports.insertScore = function (req, res) {
    console.log(req.body);
    var sql = 'SELECT id FROM studentdb.score where class_id =' + req.body.class_id + 'and student_id =' + req.body.student_id;
    console.log(sql);
    //	查询成绩是否重复
    connection.query(sql, function (err, result) {
        console.log(result);
        if (err) {
            res.json(err.message);
            return;
        }
        // 没有重复成绩则插入数据
        if (result.length == 0) {
            var addSql = 'INSERT INTO score(grade, class_id, student_id) VALUES(?,?,?)';
            var addSqlParams = [req.body.grade, req.body.class_id, req.body.student_id];
            connection.query(addSql, addSqlParams, function (err, result) {
                if (err) {
                    var json = {
                        errCode: 2,
                        errMsg: err.message,
                        dataList: []
                    }
                    console.log(err.message);
                    return res.json(json);

                }

                var json = {
                    errCode: 0,
                    errMsg: '添加成绩成功',
                    dataList: []
                }

                return res.json(json);
            });
            return;
        } else {
            console.log('已存在')
            var json = {
                errCode: 1,
                errMsg: '课程已存在',
                dataList: []
            }
            res.json(json);
        }

    });
}

// 删除成绩del
exports.deleteScore = function (req, res) {
    //	后台删除用户接口
    console.log(req.params.id);
    console.log(typeof req.params.id);
    var role = req.params.role;
    var delSql;
    delSql = 'DELETE FROM class where id="' + req.params.id + '"';
    connection.query(delSql, function (err, result) {
        if (err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }
        console.log('DELETE affectedRows', result.affectedRows);
        console.log(result);

        if (result.serverStatus == 2) {
            var json = {
                errCode: 0,
                errMsg: '删除成功'
            }
            res.json(json);
        } else {
            var json = {
                errCode: 1,
                errMsg: '删除失败'
            }
            res.json(json);

        }
    })

}

// 修改成绩put
exports.editScore = function (req, res) {
    console.log(req.body);
    console.log(req.body.id)
    var mySql;
    var modSqlParams;
    mySql = "update studentdb.class set name=?,credit=?,ctime=?,type=?,teacher_id=? where id='" + req.body.id + "'";
    modSqlParams = [req.body.name, req.body.credit, req.body.ctime, req.body.type, req.body.teacher_id];

    connection.query(mySql, modSqlParams, function (err, result) {
        if (err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }
        console.log('UPDATE affectedRows', result.affectedRows);
        console.log(result);
        if (result.affectedRows == 1) {
            var json = {
                errCode: 0,
                errMsg: '修改成功'
            }
            res.json(json);
        } else {
            var json = {
                errCode: 1,
                errMsg: '修改失败'
            }
            res.json(json);
        }
    });
}


