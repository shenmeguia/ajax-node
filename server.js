const http = require('http');
const url = require('url');
const fs = require('fs');
http.createServer(function (req,res) {
	var urlObj = url.parse(req.url,true),
		pathname = urlObj.pathname,
		query = urlObj.query,
		reg = /\.(HTML|CSS|JS)/i;
		
	//静态资源请求
	if(reg.test(pathname)) {
		var suffix = reg.exec(pathname)[1].toUpperCase();
		suffixMIME = suffix === 'HTML' ? 'text/html' : (suffix === 'CSS' ? 'text/css' : 'text/javascript');
		try{
			con = fs.readFileSync('.' + pathname,'utf-8');
			res.writeHead(200,{"content-type": suffixMIME + ";charset=utf-8"});
			res.end(con);
		}catch(e) {
			res.writeHead(404);
			res.end('file is not find!!!');
		}
		return;
	}
	var data = JSON.parse(fs.readFileSync('./json/student.json','utf-8'));//获取数据并转换成json格式对象
	//获取某一页(一页10条数据)数据的API
	if(pathname === '/getList') {
		var n = query.n;//第一页
			arr = [];
		//根据规律得到每一页从(n-1)*10到n*10-1
		for(var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
			if(i > data.length - 1) {
				break;
			}
			arr.push(data[i]);//得到某一页的数据
		};
		res.writeHead(200,{"content-type": "application/json;charset=utf-8"});
		res.end(JSON.stringify({
			code:0,
			msg:'成功',
			total:Math.ceil(data.length / 10),//服务器一共有多少页
			data:arr
		}));
		return;
	}
	//获取某一条数据的API
	if(pathname === '/getInfo') {
		//通过客户端传递过来的id找到对应id的数据
		var studentId = query.id,
			obj = {},
			result = {
				code:1,
				msg:'失败',
				data:null
			};
		for(var i = 0; i < data.length; i++) {
			if(data[i].id == studentId) {
				obj = data[i];
				result = {
					code:0,
					msg:"成功",
					data:obj
				};
				break;
			}
		};
		res.writeHead(200,{"content-type": "application/json;charset=utf-8"});
		res.end(JSON.stringify(result));
		return;
	}
	//其它情况，未做处理，直接返回错误
	res.writeHead(404);
	res.end('API is not find!!!!');
}).listen(8082);