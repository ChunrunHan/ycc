var mysql = require('mysql');
var xlsx = require('node-xlsx');
var fs = require('fs');
var nodemailer = require('nodemailer');

var connection = mysql.createPool({
    host: 'www.rainrain.xin',
    // host:'localhost',
    user: 'root',
    password: '7773712',
    database: 'studentdb'

});

// 获取所有学生课程成绩接口get方法
exports.getAllScore = function (req, res) {
    var sql = 'SELECT score.id as id,score.student_id,student.name,score.class_id,class.name as className,score.grade FROM studentdb.score left ' +
        'join student on student.id = score.student_id left join class on score.class_id = class.id limit '
        + req.params.size * req.params.page + ',' + req.params.size;
    var all = 'select count(*) as totalRecords from score';
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

// 新增成绩post
exports.insertScore = function (req, res) {
    console.log(req.body);
    var sql = "SELECT * FROM studentdb.score where class_id = '" + req.body.class_id + "' and student_id = '" + req.body.student_id + "'";
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
    var delSql = 'DELETE FROM score where id="' + req.params.id + '"';
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
    mySql = "update studentdb.score set grade=?,class_id=?,student_id=? where id='" + req.body.id + "'";
    modSqlParams = [req.body.grade, req.body.class_id, req.body.student_id];

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

// 根据学号获取成绩
exports.getScoreByStudentID = function (req, res) {
    console.log(req.params.id);
    // var sql = 'SELECT student.id,student.name,class.name,score.grade FROM studentdb.student left join score' +
    //     ' on student_id = score.student_id left join class on score.class_id = class.id where student.id =  '
    //     + req.params.id
    var queryUser = 'SELECT id,name FROM studentdb.student where id =' + req.params.id;
    var sql = 'SELECT student.id,student.name,class.name as className,score.grade FROM studentdb.score left join student' +
        ' on student.id = score.student_id left join class on score.class_id = class.id where student.id = '
        + req.params.id
    //	查询是否已经注册过
    connection.query(queryUser, function (err, result) {
        console.log(result);
        if (err) {
            res.json(err.message);
            return;
        }
        // 如果用户不存在的话
        if (result.length == 0) {
            var json = {
                errCode: 2,
                errMsg: '学生不存在',
                dataList: []
            }
            res.json(json);
            return;
        } else {
            var oldresult = result;
            connection.query(sql, function (err, r) {
                if (err) {
                    console.log(err.message);
                    res.json(err.message);
                    return;
                }
                console.log(r);
                if (r.length == 0) {
                    var json = {
                        errCode: 1,
                        errMsg: '没有成绩信息',
                        dataList: oldresult
                    }
                    res.json(json);
                } else {
                    var json = {
                        errCode: 0,
                        errMsg: '获取数据成功',
                        dataList: r
                    }
                    res.json(json);

                }
            })

        }

    });


}

// 导出成绩
exports.exportAllScore = function (req, res) {
    var sql = 'SELECT score.student_id as 学号,student.name as 姓名,class.name as 课程名,score.grade FROM studentdb.score left ' +
        'join student on student.id = score.student_id left join class on score.class_id = class.id'

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
            var datas = [];
            result.forEach(function (row) {
                var newRow = [];
                for (var key in row) {
                    newRow.push(row[key]);
                }
                datas.push(newRow);
            })
            datas.unshift(['学号', '姓名', '课程', '成绩']);
            var buffer = xlsx.build([{name: "学生成绩", data: datas}]);
            var xlsxname = '学生成绩.xlsx';
            fs.writeFile(xlsxname, buffer, 'binary', function (err) {
                if (err) {
                    callback(err, null);
                    return;
                }
                res.sendFile("学生成绩.xlsx", {"root": './'});
            })
            // res.sendFile('./'+xlsxname)


        }
    })
}

// 根据学号id、课程id、是否及格1:及格0：不及格查询学生成绩
exports.searchScore = function (req, res) {
    console.log(req.body);
    var student_id = req.body.student_id;
    var class_id = req.body.class_id;
    var pass = req.body.pass;
    var sql = 'SELECT student.id,student.name,class.name as className,score.grade FROM studentdb.score left join student' +
        ' on student.id = score.student_id left join class on score.class_id = class.id where '

    if (student_id != "") {
        sql += "student.id = '" + student_id + "' "
    }
    if (class_id != "") {
        if (student_id != "") {
            sql += "and score.class_id = '" + class_id + "' "
        } else {
            sql += "score.class_id = '" + class_id + "' "
        }
    }

    if (pass != "") {
        if (class_id != "" || student_id != "") {
            if (parseInt(pass) == 1) {
                // 及格
                sql += "and score.grade >= 60"
            } else {
                // 不及格
                sql += "and score.grade < 60"
            }
        } else {
            if (parseInt(pass) == 1) {
                // 及格
                sql += "score.grade >= 60"
            } else {
                // 不及格
                sql += "score.grade < 60"
            }
        }
    }
    console.log(sql)
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
                errMsg: '没有成绩信息',
                dataList: []
            }
            res.json(json);
        } else {
            var json = {
                errCode: 0,
                errMsg: '查询成功',
                dataList: result
            }
            res.json(json);

        }
    })
}

// 根据学号id导出成绩
exports.exportScoreByID = function (req, res) {
    var sql = 'SELECT score.student_id as 学号,student.name as 姓名,class.name as 课程名,score.grade FROM studentdb.score left ' +
        'join student on student.id = score.student_id left join class on score.class_id = class.id where student.id = '
        + req.body.id
    var userId = req.body.id;
    var email = req.body.email;
    console.log(req.body)
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
            var datas = [];
            result.forEach(function (row) {
                var newRow = [];
                for (var key in row) {
                    newRow.push(row[key]);
                }
                datas.push(newRow);
            })
            datas.unshift(['学号', '姓名', '课程', '成绩']);
            var buffer = xlsx.build([{name: userId, data: datas}]);
            var xlsxname = userId+ '.xlsx';
            fs.writeFile(xlsxname, buffer, 'binary', function (err) {
                if (err) {
                    var json = {
                        errCode: 1,
                        errMsg: '发送失败',
                        dataList: err
                    }
                    res.json(json);
                    return;
                }
                console.log(xlsxname)
                console.log(email.indexOf("@")>-1)
                if(email.indexOf("@")>-1){
                    sendMail(xlsxname, email, function (err, info) {
                        if (err) {
                            console.log(err)
                            var json = {
                                errCode: 1,
                                errMsg: '发送失败',
                                dataList: err
                            }
                            res.json(json);
                            return
                        }
                        var json = {
                            errCode: 0,
                            errMsg: '发送成功'
                        }
                        res.json(json);

                    })
                }else{
                    var options = {
                        root: './',
                        dotfiles: 'deny',
                        headers: {
                            'x-timestamp': Date.now(),
                            'x-sent': true
                        }
                    };

                    res.sendFile(xlsxname, options, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            console.log('Sent:', xlsxname);
                        }
                    });

                    // res.sendFile(userId+ '.xlsx', {"root": './'});
                }


            })


        }
    })
}


//发送邮件,带附件
var sendMail = function (xlsxname, email, callback) {

    var transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: '534123074@qq.com',
            pass: 'bwtpazhbmktjbhea'
        }
    });
    email = email || '2218235546@qq.com'
    var mailOptions = {
        from: '534123074@qq.com', //你的邮箱
        to: email, //你老板的邮箱
        subject: '亲，你孩子的成绩单，记得查收',
        html: `<h2>成绩单</h2>`,
        attachments: [{
            filename: xlsxname,
            path: `./${xlsxname}`
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, info);
        }
    });
}



