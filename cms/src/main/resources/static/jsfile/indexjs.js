window.onresize = function(){
    var win = $(window).width(),
        main = $('#bottomword'),
        toplogo=$('#toplogo');
    if(win < 1100){main.css("display","none")}
    if(win>=1100){main.css("display","inline")}
    if(win<1300){toplogo.css("display","none")}
    if(win>=1300){toplogo.css("display","inline")}

}

window.onload=function () {
    var win = $(window).width(),
        main = $('#bottomword'),
        toplogo=$('#toplogo');
    if($(window).width()<1000) main.css("display","none");
    if($(window).width()<1300) toplogo.css("display","none");

    $("#login_form").validate({
        rules: {
            username: {
                required: true,
                minlength: 11
            },
            password: {
                required: true,
                minlength: 6
            },
        },
        messages: {
            username: {
                required: "请输入正确的登录账号",
                minlength: "请输入长度≥11的手机号码/邮箱/ID"
            },
            password: {
                required: "请输入密码",
                minlength: "密码长度不能小于 6 个字母"
            },
        },
        submitHandler:function () { //校验通过--请求后台
            submit();
        }
    });
    $("#register_form").validate({
        rules: {
            username: {
                required: true,
                minlength: 11
            },
            password: {
                required: true,
                minlength: 6
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: "#register_password"
            },
            email: {
                required: true,
                email: true
            },

        },
        messages: {
            username: {
                required: "请输入手机号码",
                minlength: "手机号码必需由11个数字组成"
            },
            password: {
                required: "请输入密码",
                minlength: "密码长度不能小于 6 个字母"
            },
            confirm_password: {
                required: "请输入密码",
                minlength: "密码长度不能小于 6 个字母",
                equalTo: "两次密码输入不一致"
            },
            email: "请输入一个正确的邮箱",
        },
        submitHandler:function () { //校验通过--请求后台
            register();
        }
    });

    // 初始化轮播
    $(".start-slide").click(function(){
        $("#myCarousel").carousel('cycle');
    });
    // 停止轮播
    $(".pause-slide").click(function(){
        $("#myCarousel").carousel('pause');
    });
    // 循环轮播到上一个项目
    $(".prev-slide").click(function(){
        $("#myCarousel").carousel('prev');
    });
    // 循环轮播到下一个项目
    $(".next-slide").click(function(){
        $("#myCarousel").carousel('next');
    });
    // 循环轮播到某个特定的帧
    $(".slide-one").click(function(){
        $("#myCarousel").carousel(0);
    });
    $(".slide-two").click(function(){
        $("#myCarousel").carousel(1);
    });
    $(".slide-three").click(function(){
        $("#myCarousel").carousel(2);
    });
    /*-------------------------------------------------------*/
    var u = localStorage.getItem("user");
    var p = localStorage.getItem("pwd");
    var r = localStorage.getItem("remember");
    $("#username").val(u);
    $("#password").val(p);
    if (1 == r) {
        $("#remember").prop("checked", "checked");
    }
};

/*$(function(){


});*/

function submit() {
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();

    username = encodeURI(username);
    password = encodeURI(password);
    $.ajax({
        url : "../../userController/login.do",
        type : "POST",
        dataType : "json",
        data : "account=" + username + "&userPwd=" + password,
        success : function(data) {
            if (data.m_istatus == "1") {    //登陆成功
                if ($("#remember").is(':checked')) {
                    localStorage.setItem("user", username);
                    localStorage.setItem("pwd", password);
                    localStorage.setItem("remember", 1);
                } else {
                    localStorage.removeItem("user");
                    localStorage.removeItem("pwd");
                    localStorage.removeItem("remember");
                }
                if(data.m_object.userType==0){ //管理员
                    window.location.href = "../../htmlfile/after/after-index.html?telphone=" + data.m_object.telphone
                        + "&userFaceUrl="+data.m_object.userFaceUrl;
                } else {    //用户
                    window.location.href = "../../htmlfile/before/module/index-login.html?telphone=" + data.m_object.telphone
                    + "&userFaceUrl="+data.m_object.userFaceUrl;
                }

            } else {
                alert(data.m_strMessage);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert("登录失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

function register() {
    var telphone = $("#telphone").val();
    var regTel = /^1\d{10}$/;
    if (!regTel.test(telphone)) {
        alert("请输入正确的手机号码！");
        return;
    }
    var email = $("#email").val();
    var regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (!regEmail.test(email)) {
        alert("请输入正确的邮箱！");
        return;
    }
    var userPwd = $("#register_password").val();
    if (!(userPwd.length >= 6 && userPwd.length <= 20)) {
        alert("请输入正确的密码！(6-20位)");
        return;
    }
    var obj = {};
    obj['telphone'] = telphone;
    obj['email'] = email;
    obj['userPwd'] = userPwd;

    $.ajax({
        url: "../../userController/addUser.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                window.location.href = "login.html";
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
            $("#submit").attr("disabled", false);
        }
    });
}


