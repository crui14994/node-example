# node-example

## 前言 

### 一个关于node的实例,用到的技术栈:
> node+express+ejs+formidable+session+mongodb

##### 其中数据库的操作和md5加密分别封装了两个模块，分别是dbMain.js和md5.js

### 实现功能：
1. md5加密的注册登录表单，
2. 使用session对用户密码进行管理；
    > 访问
    http://127.0.0.1:8080/register 
    进行注册，点击按钮提交到 
    http://127.0.0.1:8080/doregister
    在后端进行密码的加密操作后存储入数据库中
    
    > 访问
    http://127.0.0.1:8080/login 
    进行登录，点击按钮提交到 
    http://127.0.0.1:8080/dologin
    在后端后端进行密码的加密操作后判断用户是否登录成功

    > 访问
    http://127.0.0.1:8080/
    如果用户没有登录则提示未登录，如果用户登录了则显示登录的用户名

## 注意：
### 在node中使用session
引入"express-session"
```
  var session = reqiure("express-session");
```
```
  app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));
```
设置或读取
```
  app.get("/",function(req,res){
    console.log(req.sission.login);
  });

  app.get("/login",function(req,res){
     req.session.login = "1";
  });

```

---
### 使用md5就行密码的加密（node中自带了一个模块，叫做crypto模块，负责加密。）
引入"crypto'"
```
var crypto = require('crypto');
```
封装md5加密模块
```
//使用md5就行密码的加密
module.exports=function(str){
    //多次加密防止破解
    return cyt(cyt(str).substr(11,7)+cyt(str));
}

function cyt(str){//对字符串加密
    const hash = crypto.createHash('md5');
    return hash.update(str).digest('base64');
}
```

---
### formidable表单上传组件的使用
引入"formidable"
```
var formidable = require('formidable'); //表单上传组件
```
文档地址：https://www.npmjs.com/package/formidable