var telphone = getUrlParamValue("telphone");
var userFaceUrl = getUrlParamValue("userFaceUrl");
var page = 0;
var total = 1;    //总页码
$(function () {
    if(userFaceUrl!=null && userFaceUrl!='' && userFaceUrl !='null'){
        $("#userFaceUrl").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
    } else {
        $("#userFaceUrl").attr("src", "/img/default.png");
    }
    $("a[name=personal]").attr("href","../personal/personal.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#writeEss").attr("href","../function/writeEss.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#writeQue").attr("href","../function/writeQue.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);

    $("#home1").attr("href", "index-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#mood1").attr("href", "mood-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    
});
function exchangeVip(userLevel) {
    $.ajax({
        url: "../../../userController/updateUserLevel.do",
        type: "POST",
        dataType: "json",
        data: "userLevel=" + userLevel,
        success: function (mu) {
            if (mu.m_istatus == "1") {
                alert(mu.m_strMessage);
                window.history.back();
            }else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

function rechargeVip(userLevel) {
    $.ajax({
        url: "../../../userController/rechargeVip.do",
        type: "POST",
        dataType: "json",
        data: "userLevel=" + userLevel,
        success: function (mu) {
            if (mu.m_istatus == "1") {
                alert(mu.m_strMessage);
                window.history.back();
            }else {
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
            window.location.href = "index.html";
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