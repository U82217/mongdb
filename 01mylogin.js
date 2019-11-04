const express=require('express');
const app=express();
const md5=require('md5')
const ejs=require('ejs');
var bodyParser=require('body-parser');
var mongoose = require('mongoose');
const http=require('http').Server(app);
// 如果使用websocket需要引入原生http
const io=require('socket.io')(http);

var urlencodedParser = bodyParser.urlencoded({ extended: false });
const db=require('./model/dao.js');
const formatDate=require('./model/fomate.js');
app.set('view engine','ejs');
app.use('/public',express.static('./public/'));



// 数据持久化
var session = require('express-session')
var NedbStore = require('nedb-session-store')( session );
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
  	maxAge:24*60*60*1000
  },
    // 配置持久化
  store:new NedbStore({
	  filename: 'path_to_nedb_persistence_file.db'
	})
}))

// 呈递页面，自动去views文件夹内部寻找login.ejs文件
app.get('/',(req,res)=>{
	if(req.session.user1){
		res.render('my',{user:req.session.user1})
	}else{
		res.render('login',{url:'http://10.25.160.6:8989/',user:''})
	}
	
})

app.get('/sign',(req,res)=>{
	res.render('sign',{url:'http://10.25.160.6:8989/',user1:''})
})

// 点注册重定向
app.get('/sign1',urlencodedParser,(req,res)=>{
	let whereStr={
		name:req.query.user
	}
	let pro={
		name:req.query.user,
		pass:md5(md5(req.query.pass))
	}
	console.log(req.query.user)
	db.find('student','class1',whereStr,(a)=>{
		if (a=='') {
			db.insert('student','class1',pro,(a)=>{
				console.log(a)
				res.send({msg:1})
			})
		}else{
			// user传递给前台的数据
			res.send({msg:0})
		}
	})
	
})


// 登录
app.post('/login',urlencodedParser,(req,res)=>{
	
	let pro={
		name:req.body.user,
		pass:md5(md5(req.body.pass))
	}
	console.log(req.body.pass)
	db.find('student','class1',pro,(a)=>{
		console.log(a)
		if (a.length==0) {
			res.render('login',{url:'http://10.25.160.6:8989/',user:'xiaoxiao'})
		}else{
			res.redirect(302,'http://10.25.160.6:8989/my')
		}
	})
	// 设置session
	req.session.user1=req.body.user;
})

// 首页
app.get('/my',(req,res)=>{
	// 获取session
	res.render('my',{user:req.session.user1})
})

// 退出
app.get('/logout',(req,res)=>{
	req.session.user1='';
	res.send({msg:1})

})

app.get('/mychange',(req,res)=>{
	res.render('chang',{user:req.session.user1})

})
// 点击修改密码跳转
app.get('/change',(req,res)=>{
	res.send({msg:1})

})
// 首页
app.get('/myHome',(req,res)=>{
	res.send({msg:1})

})


// 列表
app.get('/myList',(req,res)=>{
	res.send({msg:1})

})
app.get('/list',(req,res)=>{
	res.render('list',{user:req.session.user1})

})
// 留言
app.get('/myMsg',(req,res)=>{
	res.send({msg:1})

})
app.get('/msg',(req,res)=>{
	res.render('message',{user:req.session.user1})

})


app.post('/confirm',urlencodedParser,(req,res)=>{
	// 旧密码
	let whereStr={
		name:req.session.user1,
		pass:md5(md5(req.body.oldpass))
	}
	
	
	// 新密码
	let updateStr={
		"$set":{"pass":md5(md5(req.body.newpass))}
	}
	db.update('student','class1',whereStr,updateStr,true,function(result){
		console.log(result)
		if (result.result.n==0) {
			res.send({msg:0})
		}else{
			// user传递给前台的数据
			res.send({msg:1})
		}
	})
	
})

// 增加列表
app.get('/addList',(req,res)=>{
	let obj={
		name:req.query.name,
		price:req.query.price,
		date:formatDate(new Date())
	}
	db.insert('product','phone',obj,(a)=>{
		console.log(222)
		res.send(a)
	})
})
// 获取列表
app.get('/getList',(req,res)=>{
	let pr=req.query.price
	let sort={pr:1}
	let obj={}
	db.find('product','phone',obj,function(a){
		res.send(a);
	},0,0,{_id:-1})

})
// 查询
app.post('/checkList',urlencodedParser,(req,res)=>{
	let obj={
		name:req.body.name
	}
	db.find('product','phone',obj,function(a){
		console.log(a)
		res.send(a);
	},0,0,{_id:-1})
})

// 删除
app.post('/delList',urlencodedParser,(req,res)=>{
	let id=mongoose.Types.ObjectId(req.body.id)
	let obj={
		"_id":id
	}
	db.delete('product','phone',obj,true,function(a){
		let pro={
			msg:1
		}
		res.send(pro)
	})
})

app.get('/getOne',(req,res)=>{
	let obj={}
	db.find('product','phone',obj,function(a){
		console.log(a)
		res.send(a)
	},9,1,{_id:-1})
})

// 编辑
app.post('/editList',urlencodedParser,(req,res)=>{
	let id=mongoose.Types.ObjectId(req.body.id);

	let whereStr={
		"_id":id
	}
	let updateStr={
		"$set":{"name":req.body.name,"price":req.body.price}
	}
	db.update('product','phone',whereStr,updateStr,true,function(result){
		res.send(result)
	})
})
// 分页
app.get('/pageList',(req,res)=>{
	let skip=req.query.page;
	// 第几页，因为页数从1开始
	skip=parseInt(skip)-1
	let obj={}
	db.find('product','phone',obj,function(a){
		console.log(a)
		res.send(a)
	},skip*10,10,{_id:-1})
})

//上一页
app.post('/prePage',urlencodedParser,(req,res)=>{
	let sort={}
	let obj={}
	let n=req.body.num
	db.find('product','phone',obj,function(a){
		console.log(a)
		res.send(a)
	},n*10,10,{_id:-1})
})
//下一页
app.post('/nextPage',urlencodedParser,(req,res)=>{
	let sort={}
	let obj={}
	let n=req.body.num
	db.find('product','phone',obj,function(a){
		console.log(a)
		res.send(a)
	},n*10,10,{_id:-1})
})
// 保持长连接
io.on('connection',(socket)=>{
	console.log('connection');
	// 服务器收到客户端请求
	// 事件名字为send，触发以后执行的代码
	socket.on('send',(msg)=>{
		//服务端发送数据
		// msg触发的时候，发送的数据
		console.log(msg);
		io.emit('mychat',msg)
	})
})
http.listen('8989','10.25.160.6')
// app.listen('8989','10.25.160.6')