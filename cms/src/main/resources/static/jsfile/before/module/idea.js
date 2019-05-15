var page = 0;
var total = 1;    //总页码
$(function () {
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

//跳转详情
function getArticleByPK(ev) {
    var articleType = ev.id.split(",")[1];
    if (articleType == 1) {    //1-文章  2-心情  3-想法
        window.location.href = "../function/readEss.html?article_pk=" + ev.id.split(",")[0];
    } else if (articleType == 2) {
        window.location.href = "../function/readMood.html?article_pk=" + ev.id.split(",")[0];
    } else if (articleType == 3) {
        window.location.href = "../function/readQue.html?article_pk=" + ev.id.split(",")[0];
    } else {
        alert("error!");
    }
}
//查看更多
function moreArticle() {
    page++;
    getArticleList();
}
//搜索
function search() {
    window.location.href="../function/search.html?searchKey=" + $("#searchKey").val();
}
//发表评论
function addComment() {
    alert("请登录！");
}

//点赞
function addLikeNumber() {
    alert("请登录！");
}
//反对
function addUnLikeNumber() {
    alert("请登录！");
}

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}