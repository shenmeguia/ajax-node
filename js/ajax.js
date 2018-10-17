(function (w) {
	function createXHR () {
		var xhr = null;
		var flag = false;
		var arr = [
			function () {
				return new XMLHttpRequest();
			},
			function () {
				return new ActiveXObject("Microsoft.XMLHTTP");
			},
			function () {
				return new ActiveXObject("Msxm12.XMLHTTP");
			},
			function () {
				return new ActiveXObject("Msxm13.XMLHTTP");
			}
		];

		for(var i = 0; i < arr.length; i++) {
			var curFn = arr[i];
			try{
				xhr = curFn();
				createXHR = curFn;
				flag = true;
				break;
			}catch(e) {

			}
		}
		if(!flag) {
			throw new Error("your browser out");
		}
		return xhr;
	};

	//options是一个对象，当传递的参数比较多用对象，而且后期增加修改也更方便
	function ajax (options) {
		//需要使用的参数设定一个规则和初始值
		var _default = {
			url: "",//地址
			type: "get",//请求方法
			dataType: "json",//数据格式
			async: true,//同步异步
			data: null,//传给服务器的内容
			getHead: null,//响应头的回调函数
			success: null//成功后的回调函数
		};

		//遍历传进来的对象，把对象中的值赋给默认的对象，有就替换，没有就增加

		//hasOwnProperty:这个方法可以用来检测一个对象是否含有特定的自身属性；和 in运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
		for(var key in options) {
			if(options.hasOwnProperty(key)) {
				_default[key] = options[key];
			}
		};
		//get方式需要清除缓存(在地址后面加随机数)
		if(_default.type === 'get') {
			//有？就加&，没有就加？
			_default.url.indexOf("?") >= 0 ? _default.url += "&" : _default.url += "?";
			_default.url += "_=" + Math.random();
		}

		var xhr = createXHR();
		xhr.open(_default.type,_default.url,_default.async);
		xhr.onreadystatechange = function () {
			//以2开头都表示响应主体内容成功返回
			if(/^2\d{2}$/.test(xhr.status)) {
				//2表示相应头信息已接收
				if(xhr.readyState === 2) {
					//如果是回调函数，就将xhr传给函数(即函数的this)
					if(typeof _default.getHead === 'funciton') {
						_default.getHead.call(xhr);
					}
				};

				if(xhr.readyState === 4) {
					//从服务获取的数据(字符串格式)
					var val = xhr.responseText;
					//转换成json格式
					if(_default.dataType === "json") {
						val = "JSON" in window ? JSON.parse(val) : eval("("+val+")");
					};
					//如果是回调函数，就将xhr和从服务器获取的数据传给函数(即函数的this)
					if(typeof _default.success === 'function') {
						_default.success.call(xhr,val);
					}
				}
			};
		};
		xhr.send(_default.data);
	}
	w.ajax = ajax;
})(window);