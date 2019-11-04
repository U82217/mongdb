var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// 引入模块和地址

// 连接数据文件
function connect(callback){
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if(err) throw err;
		// 回调函数
		callback(db);
	});
}

					// db数据库，col集合， obj插入的数据，回调
module.exports.insert=function(db,col,obj,callback){
	// a来源于callback中的db
	connect(function(a){
		var dbo = a.db(db);
	    // db(数据文件).db(数据库),后者db不能改
   		 // var myobj = { name: "菜鸟教程", url: "www.runoob这是插入的数据" };
	    // 存储数据
	    // 如果不是数组，则转为数组
	    if(!(obj instanceof Array)){
	    	obj=[obj]
	    }
	    dbo.collection(col).insertMany(obj, function(err, res1) {
	    	// 插入数据
	        if (err) throw err;
	        console.log(res1);
	        a.close();
	        callback(res1.ops)
	    });
	})
}

// 查询
module.exports.find=function(db,col,obj={},callback,s=0,l=0,mysort={}){
	// skip  limit sort 条件限制
	connect(function(a){
		var dbo = a.db(db);
		var mySort={
			"score.math":1
		}
	    dbo.collection(col).find(obj).sort(mysort).skip(s).limit(l).toArray(function(err, result) { // 返回集合中所有数据
	        if (err) throw err;
	        a.close();
	        callback(result)
	    });
	})
}

// module.exports.query=function(db,col,whereStr,skip,limit,mysort,callback){
// 	connect(function(a){
// 		var dbo=a.db(db);

// 		// skip(2).limit(2) 跳过前面两条数据，读取两条数据
// 		dbo.collection(col).find(whereStr).skip(skip).limit(limit).sort(mysort).toArray(function(err, result) {
// 	        if (err) throw err;
// 	        console.log(result);
// 	        a.close();
// 	        callback(result)
// 	    });

//  })
// }

// 更新
module.exports.update=function(db,col,whereStr,updateStr,d,callback){
	connect(function(a){
		if (d==false) {
			var dbo=a.db(db);
			dbo.collection(col).updateMany(whereStr, updateStr, function(err, res1) {
		        if (err) throw err;
		         console.log(res1.result.nModified + " 条文档被更新");
		         a.close();
		         callback(res1)
		    });
		}else{
			var dbo = a.db(db);
		    dbo.collection(col).updateOne(whereStr,updateStr,function(err, res1) {
		        if (err) throw err;
		        console.log(res1);
		        a.close();
		        callback(res1)
		    });
		}
		
	})

}
// 删除
module.exports.delete=function(db,col,whereStr,d,callback){
	connect(function(a){
	if (d==false) {
		var dbo=a.db(db);
	    dbo.collection(col).deleteMany(whereStr, function(err, obj) {
	        if (err) throw err;
	        console.log("文档删除成功");
	        a.close();
	        callback(obj)
	    });
	}else{
		var dbo=a.db(db);
	    dbo.collection(col).deleteOne(whereStr, function(err, obj) {
	        if (err) throw err;
	        console.log("文档删除成功");
	        a.close();
	        callback(obj)
	    });
	}
		

	})


}

