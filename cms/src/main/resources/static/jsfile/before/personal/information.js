var telphone = getUrlParamValue("telphone");
var userFaceUrl = getUrlParamValue("userFaceUrl");
var articleImage="";
$(function () {
    if(userFaceUrl!=null && userFaceUrl!='' && userFaceUrl !='null'){
        $("#userFaceUrl").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
        $("#userFaceUrl1").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
    } else {
        $("#userFaceUrl").attr("src", "/img/default.png");
        $("#userFaceUrl1").attr("src", "/img/default.png");
    }
    $("#userName").text(telphone);
    $("#userName1").val(telphone);

    $("#personal").attr("href", "personal.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);
    //初始化时间
    var date = new Date();
    for (var i = 1946; i <= date.getFullYear(); i++) {
        $("#year,#enrollmentYear").append("<option value='" + i + "'>" + i + "</option>");
    }
    $("#year").val(date.getFullYear());
    $("#enrollmentYear").val(-1);
    for (var i = 1946; i <= date.getFullYear() + 20; i++) {
        $("#graduationYear").append("<option value='" + i + "'>" + i + "</option>");
    }
    $("#graduationYear").val(-1);
    for (var j = 1; j <= 12; j++) {
        $("#month").append("<option value='" + j + "'>" + j + "</option>");
    }
    $("#month").val(date.getMonth() + 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var day = lastDay.getDate();
    for (var k = 1; k < day; k++) {
        $("#day").append("<option value='" + k + "'>" + k + "</option>");
    }
    $("#day").val(date.getDate());
    //获取用户信息
    getUser();
    $("#upload").change(function () {
        upload();
    });
    $("#submit").click(function () {
        updateUser();
    })
});
function upload() {
    var formData = new FormData($("#form")[0]);
    formData.append("filePath","/img");
    $.ajax({
        url: '../../../upload.do',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if (data.m_istatus==1){ //上传成功
                alert(data.m_strMessage);
                articleImage = data.m_object;   //图片路径
                var imgUrl = "http://localhost:8080/storage/"+articleImage;
                $("#userFaceUrl1").attr("src", imgUrl);
            } else {
                alert(data.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}
function updateUser() {
    var obj = {};
    obj['userName'] = $("#userName1").val();
    obj['userName'] = $("#userName1").val();
    obj['userSex'] = $("#userSex").val();
    obj['birth'] = $("#year").val() + "-" + $("#month").val() + "-" + $("#day").val();
    obj['telphone'] = $("#telphone").val();
    obj['email'] = $("#email").val();
    obj['sendWord'] = $("#sendWord1").val();
    obj['educationExperience'] = $("#school").val() + "-" + $("#major").val();
    obj['education'] = $("#education").val();
    obj['enrollmentYear'] = $("#enrollmentYear").val();
    obj['graduationYear'] = $("#graduationYear").val();
    obj['summary'] = $("#summary1").val();
    obj['userFaceUrl'] = articleImage;
    obj['workExperience'] = $("#company").val() + "-" + $("#position").val();


    $.ajax({
        url: "../../../userController/updateUser.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                window.location.href = "personal.html?telphone="+telphone+"&userFaceUrl="+articleImage;
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

//获取用户信息
function getUser() {
    $.ajax({
        url: "../../../userController/getUser.do",
        type: "POST",
        dataType: "json",
        data: "",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                var data = mu.m_object;
                $("#userName").html(data.userName);
                var sendWord = data.sendWord;
                $("#sendWord").html(sendWord != "" && sendWord != null ? sendWord : "无");
                var educationExperience = data.educationExperience;
                $("#educationExperience").html(educationExperience != "" && educationExperience != null ? educationExperience : "无");
                var summary = data.summary;
                $("#summary").html(summary != "" && summary != null ? summary : "无");
                $("#telphone1").html(data.telphone);
                articleImage = data.userFaceUrl;
                if(data.userSex!=null){
                    $("#userSex").val(data.userSex);
                }
                if (data.birth != null && data.birth != "") {
                    var b = data.birth.split("-");
                    $("#year").val(b[0]);
                    $("#month").val(Number(b[1]));
                    $("#day").val(Number(b[2]));
                }
                $("#telphone").val(data.telphone);
                $("#email").val(data.email);
                $("#sendWord1").val(data.sendWord);
                if (data.educationExperience != null && data.educationExperience != "" && data.educationExperience != "-") {
                    var e = data.educationExperience.split("-");
                    $("#school").val(e[0]);
                    $("#major").val(e[1]);
                }
                if (data.education != null && data.education != "") {
                    $("#education").val(data.education);
                }
                if (data.enrollmentYear != null && data.enrollmentYear != "") {
                    $("#enrollmentYear").val(data.enrollmentYear);
                }
                if (data.graduationYear != null && data.graduationYear != "") {
                    $("#graduationYear").val(data.graduationYear);
                }
                $("#summary1").val(data.summary);
                if (data.workExperience != null & data.workExperience != "" && data.workExperience != "-") {
                    var w = data.workExperience.split("-");
                    $("#company").val(w[0]);
                    $("#position").val(w[1]);
                }
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

//退出登录
function logOut() {
    $.ajax({
        url: "../../../userController/logOut.do",
        type: "POST",
        dataType: "json",
        data: "",
        success: function (mu) {
            window.location.href = "../module/index.html";
        }
    });
}

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}