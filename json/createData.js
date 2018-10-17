//数据的创建

//求两个数之间的随机数
function getRandom (n,m) {
	return Math.round(Math.random() * (m - n) + n);
};

var arr = [],
	str1 = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎',
	str2 = '一二三四五六七八九壹贰叁厮伍陆柒捌玖';

for(var i = 1; i <= 987; i++) {
	var obj = {};
	obj.id = i;
	obj.name = str1[getRandom(0,47)] + str2[getRandom(0,17)] + str2[getRandom(0,17)];
	obj.sex = getRandom(0,1);
	obj.score = getRandom(50,100);
	arr.push(obj);
};
console.log(JSON.stringify(arr));