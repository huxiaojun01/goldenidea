var page = 0;
var total = 1;    //总页码
var articleType = 1;  //1-文章  2-心情  3-想法
var isFirst = 0;    //判断是否第一次点击查看更多
$(function () {
    getArticleList(articleType, 2);

    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var activeTab = $(e.target).text(); //1-文章  2-心情  3-想法
        if (activeTab == "推荐") {
            page = 0;
            articleType = 1;
            isFirst = 0;
            $("#home").html("");
            getArticleList(articleType, 2);
        } else if (activeTab == "点子") {
            page = 0;
            articleType = 3;
            isFirst = 0;
            $("#ios").html("");
            getArticleList(articleType, 2);
        } else if (activeTab == "心情") {
            page = 0;
            articleType = 2;
            $("#mood").html("");
            isFirst = 0;
            getArticleList(articleType, 2);
        }
    });
});

/**********推荐、点子、心情*******************/
function getArticleList(articleType, pageRows) {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../../articleController/getArticleListPaging.do",
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
                    if ((page+1)!=total){
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
    }else {

    }
}

//查看更多
function moreArticle() {
    if (isFirst==0||isFirst==1){
        page=0;
        if (articleType == 1) {    //1-文章  2-心情  3-想法
            $("#home").html("");
        } else if (articleType == 2) {
            $("#mood").html("");
        } else if (articleType == 3) {
            $("#ios").html("");
        } else {
        }
    } else {
        page++;
    }
    isFirst++;
    getArticleList(articleType, 5);
}

//跳转详情
function getArticleByPK(ev) {
    if (articleType == 1) {    //1-文章  2-心情  3-想法
        window.location.href = "../function/readEss.html?article_pk=" + ev.id ;
    } else if (articleType == 2) {
        window.location.href = "../function/readMood.html?article_pk=" + ev.id;
    } else if (articleType == 3) {
        window.location.href = "../function/readQue.html?article_pk=" + ev.id;
    } else {
        alert("error!");
    }
}
//搜索
function search() {
    window.location.href="../function/search.html?searchKey=" + $("#searchKey").val();
}
// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}