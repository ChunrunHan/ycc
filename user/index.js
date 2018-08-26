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
// 获取教师信息接口get方法
exports.getTeacher = function (req, res) {
    console.log(req.params.page);
    console.log(typeof req.params.size);
    console.log(req.params.size * req.params.page);
    //	查询所有用户
    var totalRecords;
    var sql = 'select * from teacher limit  ' + req.params.size * req.params.page + ',' + req.params.size;
    var all = 'select count(*) as totalRecords from teacher';
    connection.query(all, function (err, result) {
        if (err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }
        console.log(result)
        totalRecords = result[0].totalRecords;
        console.log(totalRecords)
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err.message);
                res.json(err.message);
                return;
            }

            console.log(result);

            if (result.length == 0) {
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
                    totalRecords: totalRecords,
                    dataList: result
                }
                res.json(json);

            }
        })
    });
}

// 获取学生信息接口get方法
exports.getStudent = function (req, res) {
    console.log(req.params.page);
    console.log(typeof req.params.size);
    console.log(req.params.size * req.params.page);
    //	查询所有学生信息
    var totalRecords;
    var sql = 'select * from student limit  ' + req.params.size * req.params.page + ',' + req.params.size;
    var all = 'select count(*) as totalRecords from student';
    connection.query(all, function (err, result) {
        if (err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }
        console.log(result)
        totalRecords = result[0].totalRecords;
        console.log(totalRecords)
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err.message);
                res.json(err.message);
                return;
            }

            console.log(result);

            if (result.length == 0) {
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
                    totalRecords: totalRecords,
                    dataList: result
                }
                res.json(json);

            }
        })
    });
}

// 新增学生教师信息接口post方法
exports.insertInfo = function (req, res) {
    console.log(req.body);
    console.log(req.body.role);
    var role = req.body.role;
    var sql;
    var who;
    if (parseInt(role) == 1) {
        // 教师
        sql = 'SELECT id FROM studentdb.teacher where id =' + req.body.id;
        who = "教师"
    } else {
        // 学生
        sql = 'SELECT id FROM studentdb.student where id =' + req.body.id;
        who = "学生"
    }

    console.log(sql);
    //	查询是否已经注册过
    connection.query(sql, function (err, result) {
        console.log(result);
        if (err) {
            res.json(err.message);
            return;
        }
        // 如果用户不存在的话就注册该用户
        // 插入数据
        if (result.length == 0) {
            console.log('插入操作')
            if (parseInt(role) == 1) {
                insetUserInfoTeacher(req.body.id, req.body.tname, req.body.tsex, req.body.tdepart, req.body.class_cno, res);
            } else {
                insetUserInfoStudent(req.body.id, req.body.name, req.body.age, req.body.sex, req.body.major, req.body.depart, req.body.term, req.body.year, res)
            }

            return;
        } else {
            console.log('已存在')
            var json = {
                errCode: 1,
                errMsg: who + '已存在',
                dataList: []
            }
            res.json(json);
        }

    });
}

// 添加学生信息
function insetUserInfoStudent(id, name, age, sex, major, depart, term, year, res) {
    var addSql = 'INSERT INTO student(id,name, age, sex, major, depart,term,year) VALUES(?,?,?,?,?,?,?,?)';
    var addSqlParams = [id, name, age, sex, major, depart, term, year];
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
            errMsg: '添加学生信息成功',
            dataList: []
        }

        return res.json(json);
    });

}

// 添加教师信息
function insetUserInfoTeacher(id, tname, tsex, tdepart, class_cno, res) {
    var addSql = 'INSERT INTO teacher(id, tname, tsex, tdepart, class_cno) VALUES(?,?,?,?,?)';
    var addSqlParams = [id, tname, tsex, tdepart, class_cno];
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
            errMsg: '添加教师信息成功',
            dataList: []
        }

        return res.json(json);
    });

}

// 删除学生教师信息
exports.deleteUser = function (req, res) {
    //	后台删除用户接口
    console.log(req.params.id);
    console.log(typeof req.params.id);
    var role = req.params.role;
    var delSql;
    if (parseInt(role) == 1) {
        //	删除教师
        delSql = 'DELETE FROM teacher where id="' + req.params.id + '"';
    } else {
        //	删除用户
        delSql = 'DELETE FROM student where id="' + req.params.id + '"';
    }
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

// 编辑学生教师信息
exports.editUser = function (req, res) {
    console.log(req.body);
    console.log(req.body.passwd)
    var role = req.body.role;
    var mySql;
    var modSqlParams;
    if (req.body.passwd == null) {
        if (parseInt(role) == 1) {
            mySql = "update studentdb.teacher set tname=?,tsex=?,tdepart=?,class_cno=? where id='" + req.body.id + "'";
            modSqlParams = [req.body.tname, req.body.tsex, req.body.tdepart, req.body.class_cno];
        } else {
            mySql = "update studentdb.student set name=?,age=?,sex=?,major=?,depart=?,term=?,year=? where id='" + req.body.id + "'";
            modSqlParams = [req.body.name, req.body.age, req.body.sex, req.body.major, req.body.depart, req.body.term, req.body.year];
        }

    } else {
        if (parseInt(role) == 1) {
            mySql = "update studentdb.teacher set tname=?,tsex=?,tdepart=?,class_cno=?,passwd=? where id='" + req.body.id + "'";
            modSqlParams = [req.body.tname, req.body.tsex, req.body.tdepart, req.body.class_cno, req.body.passwd];
        } else {
            mySql = "update studentdb.student set name=?,age=?,sex=?,major=?,depart=?,term=?,year=?,passwd=? where id='" + req.body.id + "'";
            modSqlParams = [req.body.name, req.body.age, req.body.sex, req.body.major, req.body.depart, req.body.term, req.body.year, req.body.passwd];
        }
    }

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

exports.searchRole = function (req, res) {
    console.log(req.params.page);
    console.log(req.params.userrole);
    console.log(req.params.size * req.params.page);
    //	根据角色查询所有用户
    var totalRecords;
    var sql = 'select * from user where role = ' + req.params.userrole + ' limit ' + req.params.size * req.params.page + ',' + req.params.size;
    var all = 'select count(*) as totalRecords from user where role = ' + req.params.userrole;
    console.log(sql)
    connection.query(all, function (err, result) {
        if (err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }
        console.log(result)
        totalRecords = result[0].totalRecords;
        console.log('查找的用户总数' + totalRecords)
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err.message);
                res.json(err.message);
                return;
            }

            console.log(result);

            if (result.length == 0) {
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
                    totalRecords: totalRecords,
                    dataList: result
                }
                res.json(json);

            }
        })
    });
}
exports.searchName = function (req, res) {
    console.log(req.params.page);
    console.log(req.params.username);
    console.log(req.params.size * req.params.page);
    //	根据用户名查询所有用户
    var totalRecords;
    var sql = "select * from user where username like '%" + req.params.username + "%' limit " + req.params.size * req.params.page + ',' + req.params.size;
    var all = 'select count(*) as totalRecords from user';
    console.log(sql)
    connection.query(all, function (err, result) {
        if (err) {
            console.log(err.message);
            res.json(err.message);
            return;
        }
        console.log(result)
        totalRecords = result[0].totalRecords;
        console.log(totalRecords)
        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err.message);
                res.json(err.message);
                return;
            }

            console.log(result);

            if (result.length == 0) {
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
                    totalRecords: totalRecords,
                    dataList: result
                }
                res.json(json);

            }
        })
    });
}





