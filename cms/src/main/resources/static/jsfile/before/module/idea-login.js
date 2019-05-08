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
    $("a[name=personal]").attr("href", "../personal/personal.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);
    $("#writeEss").attr("href", "../function/writeEss.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);
    $("#writeQue").attr("href", "../function/writeQue.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);

    $("#home1").attr("href", "index-login.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);
    $("#mood1").attr("href", "mood-login.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);

    $("#vip").attr("href", "vip.html?telphone=" + telphone + "&userFaceUrl=" + userFaceUrl);

    getArticleList();
});

function getArticleList() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../../articleController/getArticleListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=5" + "&articleType=3",    //1-文章  2-心情  3-想法
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $.each(data, function (i, o) {
                        var articleContent = o.articleContent;
                        if (articleContent.length > 150) {
                            articleContent = articleContent.substring(0, 150) + "......"
                        }
                        html += "<div onclick='getArticleByPK(this)' id='" + o.article_pk+","+o.articleType + "' style='cursor: pointer;' class=\"message\">" + articleContent + "<div class=\"author\">" +
                            "<b style=\"float:left;\">作者：<span>" + o.telphone + "</span></b>" +
                            "<b style=\"float:right;\">发表时间：<span>" + o.createTime + "</span></b>" +
                            "</div></div>";

                    });
                    $("#moreArticle").remove();
                    if ((page + 1) != total) {
                        html += "<div id='moreArticle' style='cursor: pointer;' class=\"text-center\" onclick='moreArticle()'>查看更多</div>";
                    } else {    //最后一页
                        html += "<div style='cursor: pointer;' class=\"text-center\">没有更多数据了~</div>";
                    }
                    $("#content").append(html);

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    } else {

    }
}

//查看更多
function moreArticle() {
    page++;
    getArticleList();
}

//搜索
function search() {
    window.location.href = "../function/search-login.html?searchKey=" + $("#searchKey").val() + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
}

//跳转详情
function getArticleByPK(ev) {
    var articleType = ev.id.split(",")[1];
    if (articleType == 1) {    //1-文章  2-心情  3-想法
        window.location.href = "../function/readEss-login.html?article_pk=" + ev.id.split(",")[0] + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
    } else if (articleType == 2) {
        window.location.href = "../function/readMood-login.html?article_pk=" + ev.id.split(",")[0] + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
    } else if (articleType == 3) {
        window.location.href = "../function/readQue-login.html?article_pk=" + ev.id.split(",")[0] + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
    } else {
        alert("error!");
    }
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