function toggleLoginDialog() {
	$("#loginDialog").modal("toggle");
}
function doLogin() {
	var a = [];
	$("#loginForm").find("input[name]").each(function(i, item) {
		var o = {};
		o[item.name] = item.value;
		a.push(o);
	});
	console.log(a);
	$.post("/lx-web/rest/login", $("#loginForm").serialize(), function(
			data, textStatus, jqXHR) {
		var username = data.username;
		var userId = data.userId;
		$("#username_label").html(username);
		$("#userId").attr("href","/lx-web/user/"+userId);
		$("#loginDialog").modal("hide");
		$("#showlogin").hide();
		$("#showwelcome").show();
	}).error(function(data, textStatus, jqXHR){
		console.log(data)
		if(data.status==401){
			alert("用户名或者密码不正确");
		}else{
			alert("登陆失败");
		}
	});

}

function toggleRegisterDialog() {
	$("#registerDialog").modal("toggle");
}
function doRegister() {
	var a = [];
	$("#registerForm").find("input[name]").each(function(i, item) {
		var o = {};
		o[item.name] = item.value;
		a.push(o);
	});
	console.log(a);
	$.post("/lx-web/reguser", $("#registerForm").serialize(), function(data,
			textStatus, jqXHR) {
		$("#registerDialog").modal("hide");
	});
}
