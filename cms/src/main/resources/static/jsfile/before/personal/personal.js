var page = 0;
var total = 1;    //总页码
var telphone = getUrlParamValue("telphone");
var userFaceUrl = getUrlParamValue("userFaceUrl");
var articleImage = "";
var articleType = 1;  //1-文章  2-心情  3-想法
var isFirst = 0;    //判断是否第一次点击查看更多
$(function () {
    if(userFaceUrl!=null && userFaceUrl!='' && userFaceUrl !='null'){
        $("#userFaceUrl").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
        $("#userFaceUrl1").attr("src", "http://localhost:8080/storage/" + userFaceUrl);
    } else {
        $("#userFaceUrl").attr("src", "/img/default.png");
        $("#userFaceUrl1").attr("src", "/img/default.png");
    }
    $("#userName").text(telphone);
    $("#writeEss").attr("href","../function/writeEss.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#writeQue").attr("href","../function/writeQue.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);

    $("#home1").attr("href", "../module/index-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#idea1").attr("href", "../module/idea-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    $("#mood1").attr("href", "../module/mood-login.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);

    $("#vip").attr("href","../module/vip.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);

    $("#info").attr("href","information.html?telphone="+telphone+"&userFaceUrl="+userFaceUrl);
    getUserMessage();
    //获取用户信息
    getUser();
    getArticleList(articleType, 2);

    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var activeTab = $(e.target).text(); //1-文章  2-心情  3-想法
        if (activeTab == "我的文章") {
            page = 0;
            articleType = 1;
            isFirst = 0;
            total = 1;
            $("#home").html("<a href=\"../function/writeEss.html\" target=\"_blank\">\n" +
                "<div class=\"white\"><i class=\"fa fa-lightbulb-o\" aria-hidden=\"true\"></i> 分享一篇文章？</div>\n" +
                "</a><div class=\"text-center\" id='moreArticle'>没有更多数据了~</div>");
            getArticleList(articleType, 2);
        } else if (activeTab == "我的想法") {
            page = 0;
            articleType = 3;
            isFirst = 0;
            total = 1;
            $("#ios").html("<a href=\"../function/writeQue.html\" target=\"_blank\">" +
                "<div class=\"white\"><i class=\"fa fa-pencil\" aria-hidden=\"true\">提出一个想法？有什么问题我们一起解决！</i> </div>\n" +
                "</a><div class=\"text-center\" id='moreArticle'>没有更多数据了~</div>");
            getArticleList(articleType, 2);
        } else if (activeTab == "我的心情") {
            page = 0;
            articleType = 2;
            $("#mood").html("<a href=\"#myModal\" role=\"button\" data-toggle=\"modal\"><div class=\"white\"><i class=\"fa fa-heartbeat\" aria-hidden=\"true\"></i> 今天有啥想吐槽的不？</div>" +
                "</a><div class=\"text-center\" id='moreArticle'>没有更多数据了~</div>");
            isFirst = 0;
            total = 1;
            getArticleList(articleType, 2);
        }
    });
});
//搜索
function search() {
    window.location.href="../function/search-login.html?searchKey=" + $("#searchKey").val()+"&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
}
//心情--弹窗
function upload() {
    var formData = new FormData($("#form")[0]);
    formData.append("filePath", "/mood");
    $.ajax({
        url: '../../../upload.do',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.m_istatus == 1) { //上传成功
                alert(data.m_strMessage);
                articleImage = data.m_object;   //图片路径
                $("#uploadF").html($("#file").val());
            } else {
                alert(data.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

function addArticle() {
    var articleContent = $("#articleContent").val();
    if (articleContent == "") {
        alert("请输入内容！");
        return;
    }
    var articleTextNumber = articleContent.length;
    var articleType = 2; //1-文章  2-心情  3-想法
    var articlePower = 1;   //1-对外开放  2-仅会员可见  3-个人可见


    var obj = {};
    obj['articleTitle'] = "";
    obj['articleContent'] = articleContent;
    obj['articleHtml'] = "";
    obj['articleImage'] = articleImage;
    obj['articleTextNumber'] = articleTextNumber;
    obj['articleType'] = articleType;
    obj['articlePower'] = articlePower;

    $.ajax({
        url: "../../../articleController/addArticle.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                window.location.href = "../module/index-login.html";
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

/**********推荐、点子、心情*******************/
function getArticleList(articleType, pageRows) {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../../articleController/getArticleByUserPkAndArticleTypeListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=" + pageRows + "&articleType=" + articleType,
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
                        html += "<div onclick='getArticleByPK(this)' id='" + o.article_pk + "' style='cursor: pointer;' class=\"message\">" + articleContent + "<div class=\"author\">" +
                            "<b style=\"float:left;\">作者：<span>" + o.telphone + "</span></b>" +
                            "<b style=\"float:right;\">发表时间：<span>" + o.createTime + "</span></b>" +
                            "</div></div>";

                    });
                    $("#moreArticle").remove();
                    if ((page + 1) <  total) {
                        html += "<div id='moreArticle' style='cursor: pointer;' class=\"text-center\" onclick='moreArticle()'>查看更多</div>";
                    } else {    //最后一页
                        html += "<div style='cursor: pointer;' class=\"text-center\">没有更多数据了~</div>";
                    }

                    if (articleType == 1) {    //1-文章  2-心情  3-想法
                        $("#home").append(html);
                    } else if (articleType == 2) {
                        $("#mood").append(html);
                    } else if (articleType == 3) {
                        $("#ios").append(html);
                    } else {
                    }

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    } else {

    }
}

//获取用户相关信息（等级、点赞数等）
function getUserMessage() {
    $.ajax({
        url: "../../../userController/getUserMessage.do",
        type: "POST",
        dataType: "json",
        data: "",
        success: function (mu) {
            var data = mu.m_object;
            var userIntegral = data.userIntegral;
            var userLevel = data.userLevel;
            $("#myAchieve").text("我的成就: " + (userIntegral <= 100 ? "热血青铜" : (userIntegral <= 200 ? "英勇黄金" : (userIntegral <= 400 ? "坚韧铂金" : (userIntegral <= 800 ? "不朽星钻 " : (userIntegral <= 2000 ? "大师" : "超级王牌"))))))
            $("#likeSum").text(data.likeSum);
            $("#commentSum").text(data.commentSum);
            $("#userIntegral").text(data.userIntegral);
            $("#myLevel").text("我的等级: "+(userLevel!=1?(userLevel!=2?(userLevel!=3?(userLevel!=4?(userLevel!=5?"未开通VIP":"VIP5"):"VIP4"):"VIP3"):"VIP2"):"VIP1"));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
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
            if (mu.m_istatus==1){
                var data = mu.m_object;
                $("#userName").html(data.userName);
                var sendWord = data.sendWord;
                $("#sendWord").html(sendWord!=""&&sendWord!=null?sendWord:"无");
                var educationExperience = data.educationExperience;
                $("#educationExperience").html(educationExperience!=""&&educationExperience!=null?educationExperience:"无");
                var summary = data.summary;
                $("#summary").html(summary!=""&&summary!=null?summary:"无");
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}
//查看更多
function moreArticle() {
    if (isFirst==0||isFirst==1){
        page=0;
        /*if (articleType == 1) {    //1-文章  2-心情  3-想法
            $("#home").html("");
        } else if (articleType == 2) {
            $("#mood").html("");
        } else if (articleType == 3) {
            $("#ios").html("");
        } else {
        }*/
    } else {
        page++;
    }
    isFirst++;
    getArticleList(articleType, 5);
}

//跳转详情
function getArticleByPK(ev) {
    if (articleType == 1) {    //1-文章  2-心情  3-想法
        window.location.href = "../personal/readMyEss.html?article_pk=" + ev.id + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
    } else if (articleType == 2) {
        window.location.href = "../personal/readMyMood.html?article_pk=" + ev.id + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
    } else if (articleType == 3) {
        window.location.href = "../personal/readMyQue.html?article_pk=" + ev.id + "&telphone=" + telphone + "&userFaceUrl=" + userFaceUrl;
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