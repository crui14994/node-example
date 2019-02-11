var express = require("express");
var app = express();
var formidable = require('formidable'); //表单上传组件
var md5 = require("./model/md5.js"); //引入md5加密模块
var db = require("./model/dbMain.js"); //引入封装的数据库操作模块
var session = require('express-session');

app.set("view engine", "ejs");

app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));

app.get("/",function(req,res){
    if(req.session.login == "1"){
         res.send("欢迎" + req.session.userName);
        
    }else{ 
        res.send("没有成功登陆");
    }
})

//注册页面
app.get("/register",function(req,res,next){
    res.render("register");
})

//执行注册页面
app.post("/doregister",function(req,res,next){
    //使用表单上传组件获取传入参数
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //加密后的密码
        var passwordMd5 = md5(fields.password);
        //把用户名和密码添加到数据库中（4个参数，数据库名称，增加什么，往哪个集合中增加，增加之后做什么）
        db.insertOne("form",{"name":fields.name,"password":passwordMd5},"user",function(err,result){
            if(err){
                res.send("0");
                return;
            }
            res.send("1");
        });
    });
})

//登录页面
app.get("/login",function(req,res,next){
    res.render("login");
})

//执行登录页面
app.post("/dologin",function(req,res,next){
     //使用表单上传组件获取传入参数
     var form = new formidable.IncomingForm();
     form.parse(req, function (err, fields, files) {
        //用户名
        var userName = fields.name;
        //加密后的密码
        var passwordMd5 = md5(fields.password);

        db.find("form",{"name":userName},"user",{},function(err,result){
            if(err){
                res.send("0"); //查询失败
                return;
            }
            if(result.length != 0){
                if(passwordMd5==result[0].password){
                    //设置session登录状态和用户
                    req.session.login = "1"; 
                    req.session.userName = userName;
                    res.send("1"); //登录成功
                }else{
                    res.send("2"); //密码不正确
                }
            }else{
                res.send("3"); //用户不存在
            }
        })
     })
})

//监听8080端口
app.listen(8080);
