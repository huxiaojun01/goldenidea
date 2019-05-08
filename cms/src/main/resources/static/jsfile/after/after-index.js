var page = 0;
var total = 1;    //总页码
var totalCount = 0; //总条数
var telphone = getUrlParamValue("telphone");
var type = 0;
$(function () {
    $("#userName").text(" " + telphone);
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).text();
        if (activeTab == "注意事项") {
            page = 0;
            type = 0;
        } else if (activeTab == "用户管理") {
            page = 0;
            type = 1;
            getUserList()
        } else if (activeTab == "资源审核") {
            page = 0;
            type = 2;
            getResourceList();
        } else if (activeTab == "评论审核") {
            page = 0;
            type = 3;
            getCommentListPaging();
        } else if (activeTab == "等级审核") {
            page = 0;
            type = 4;
            getUnauditedLevel();
        } else if (activeTab == "个人信息审核") {
            page = 0;
            type = 5;
            getUnauditedPersonalMessageListPaging();
        } else {
            page = 0;
            type = 6;
            getUserDataListPaging();
        }
    })
});

/*****************用户管理*****************/
function getUserList() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../userController/getUserListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=8",
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $("#data_user").html(html);
                    $.each(data, function (i, o) {
                        html += "<tr id='" + o.user_pk + "'><td>" + o.user_pk + "</td>" +
                            "<td>" + o.telphone + "</td>" +
                            "<td>" + o.email + "</td>" +
                            "<td>" + o.userPwd + "</td>" +
                            "<td>" + (o.userType != 0 ? "用户" : "管理员") + "</td>" +
                            "<td><button type=\"button\" class=\"btn btn-info btn-xs\" onclick='updateUser(this)' id='" + o.user_pk + "'>修改</button>   " +
                            "<button type=\"button\" class=\"btn btn-danger btn-xs\" onclick='deleteUser(this)' id='" + o.user_pk + "'>删除</button></td></tr>";
                    });
                    $("#data_user").html(html);
                    $("#user_page").text((page + 1) + "/" + total);
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function addUser() {
    $.ajax({
        url: "../../userController/proID.do",
        type: "POST",
        dataType: "json",
        data: "",
        success: function (ID) {
            var html = "<tr><td id='ID'>" + ID + "</td>" +
                "<td><input id='telphone' style='width: 120px;' maxlength='11'/></td>" +
                "<td><input id='email' style='width: 120px;'/></td>" +
                "<td><input id='userPwd' style='width: 120px;' onkeyup=\"value=value.replace(/[\\W]/g,'') \"" +
                "onbeforepaste=\"clipboardData.setData('text',clipboardData.getData('text').replace(/[^\\d]/g,''))\"/></td>" +
                "<td><select id='userType'><option value='0'>管理员</option><option value='2' selected>用户</option></select></td>" +
                "<td><button type=\"button\" class=\"btn btn-info btn-xs\" onclick='submitAddUser()'>确定</button></td></tr>";
            $("#data_user").append(html);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败!错误码:" + XMLHttpRequest.status);
        }
    });
}

function submitAddUser() {
    var ID = $("#ID").text();
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
    var userPwd = $("#userPwd").val();
    if (!(userPwd.length >= 6 && userPwd.length <= 20)) {
        alert("请输入正确的密码！(6-20位)");
        return;
    }
    var userType = $("#userType").val();
    var obj = {};
    obj['ID'] = ID;
    obj['telphone'] = telphone;
    obj['email'] = email;
    obj['userPwd'] = userPwd;
    obj['userType'] = userType;

    $.ajax({
        url: "../../userController/addUser.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                getUserList();
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

function deleteUser(ev) {
    var user_pk = ev.id;
    if (confirm("确定要删除？")) {
        $.ajax({
            url: "../../userController/deleteUserByPK.do",
            type: "POST",
            dataType: "json",
            data: "user_pk=" + user_pk,
            success: function (mu) {
                if (mu.m_istatus == 1) {
                    alert(mu.m_strMessage);
                    getUserList();
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络出错!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function updateUser(ev) {
    var user_pk = ev.id;
    //getUserList();  //防止多个同时修改
    var html = "";
    var userType = "";
    $("#" + user_pk).find("td").each(function (i) {
        if (i == 5) {
            html += "<td><button type=\"button\" class=\"btn btn-info btn-xs\" onclick='submitUpdateUser(this)' id='" + user_pk + "'>确定</button></td>";
        } else if (i == 4) {
            userType = $(this).text();
            html += "<td><select id='userType'>" +
                "<option value='0'" + (userType != "用户" ? "selected" : "") + ">管理员</option>" +
                "<option value='2'" + (userType != "管理员" ? "selected" : "") + ">用户</option></select></td>"
        } else if (i == 0) {
            html += "<td >" + $(this).text() + "</td>"
        } else if (i == 1) {
            html += "<td ><input value='" + $(this).text() + "'  style='width: 120px;' maxlength='11'/></td>"
        } else {
            html += "<td ><input value='" + $(this).text() + "'  style='width: 120px;'/></td>"
        }
    });
    $("#" + user_pk).html(html);
}

function submitUpdateUser(ev) {
    var user_pk = ev.id;
    var ID, telphone, email, userPwd, userType;
    $("#" + user_pk).find("td").each(function (i) {
        if (i == 0) {
            ID = $(this).text();
        } else if (i == 1) {
            telphone = $(this).find("input").val();
        } else if (i == 2) {
            email = $(this).find("input").val();
        } else if (i == 3) {
            userPwd = $(this).find("input").val();
        } else if (i == 4) {
            userType = $(this).find("select").val();
        }
    });
    var regTel = /^1\d{10}$/;
    if (!regTel.test(telphone)) {
        alert("请输入正确的手机号码！");
        return;
    }
    var regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (!regEmail.test(email)) {
        alert("请输入正确的邮箱！");
        return;
    }
    if (!(userPwd.length >= 6 && userPwd.length <= 20)) {
        alert("请输入正确的密码！(6-20位)");
        return;
    }
    var obj = {};
    obj['user_pk'] = user_pk;
    obj['ID'] = ID;
    obj['telphone'] = telphone;
    obj['email'] = email;
    obj['userPwd'] = userPwd;
    obj['userType'] = userType;

    $.ajax({
        url: "../../userController/updateUserBack.do",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                getUserList();
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
        }
    });
}

/*****************资源审核*****************/
function getResourceList() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../resourceController/getResourceListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=8",
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $("#data_resource").html(html);
                    $.each(data, function (i, o) {
                        html += "<tr><td>" + o.file_pk + "</td>" +
                            "<td><a href='../../resourceController/download.do?fileUrl=" + o.fileUrl + "&fileName=" + o.fileName + "'>" + o.fileUrl + "</a></td>" +
                            "<td>" + o.fileName + "</td>" +
                            "<td><select id='" + o.file_pk + "' onchange='updateResourceState(this)'>" +
                            "<option value='0' " + (o.fileState == 0 ? 'selected' : '') + ">不通过</option>" +
                            "<option value='1' " + (o.fileState == 1 ? 'selected' : '') + ">通过</option>" +
                            "<option value='2' " + (o.fileState == 2 ? 'selected' : '') + ">待审核</option></select></td>" +
                            "<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick='deleteFile(this)' name='" + o.file_pk + "'>删除</button></td></tr>";
                    });
                    $("#data_resource").html(html);
                    $("#resource_page").text((page + 1) + "/" + total);
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function deleteFile(ev) {
    if (confirm("确定要删除？")) {
        $.ajax({
            url: "../../resourceController/deleteResourceByPK.do",
            type: "POST",
            dataType: "json",
            data: "file_pk=" + ev.name,
            success: function (mu) {
                if (mu.m_istatus == 1) {
                    alert(mu.m_strMessage);
                    getResourceList();
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络出错!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function updateResourceState(ev) {
    var fileState = $("#" + ev.id).val();
    $.ajax({
        url: "../../resourceController/updateResourceState.do",
        type: "POST",
        dataType: "json",
        data: "file_pk=" + ev.id + "&fileState=" + fileState,
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                //刷新列表
                getResourceList();
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
        }
    });
}

/*****************评论审核*****************/
function getCommentListPaging() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../commentController/getCommentListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=8",
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $("#data_comment").html(html);
                    $.each(data, function (i, o) {
                        html += "<tr><td>" + o.comment_pk + "</td>" +
                            "<td>" + o.commentContent + "</td>" +
                            "<td><select id='" + o.comment_pk + "' onchange='updateCommentState(this)'>" +
                            "<option value='0' " + (o.commentState == 0 ? 'selected' : '') + ">不通过</option>" +
                            "<option value='1' " + (o.commentState == 1 ? 'selected' : '') + ">通过</option>" +
                            "<option value='2' " + (o.commentState == 2 ? 'selected' : '') + ">待审核</option></select></td>" +
                            "<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick='deleteComment(this)' name='" + o.comment_pk + "'>删除</button></td></tr>";
                    });
                    $("#data_comment").html(html);
                    $("#comment_page").text((page + 1) + "/" + total);
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function deleteComment(ev) {
    if (confirm("确定要删除？")) {
        $.ajax({
            url: "../../commentController/deleteCommentByPK.do",
            type: "POST",
            dataType: "json",
            data: "comment_pk=" + ev.name,
            success: function (mu) {
                if (mu.m_istatus == 1) {
                    alert(mu.m_strMessage);
                    getCommentListPaging();
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络出错!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function updateCommentState(ev) {
    var commentState = $("#" + ev.id).val();
    $.ajax({
        url: "../../commentController/updateCommentState.do",
        type: "POST",
        dataType: "json",
        data: "comment_pk=" + ev.id + "&commentState=" + commentState,
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                getCommentListPaging();
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
        }
    });
}

/*****************等级审核*****************/
function getUnauditedLevel() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../userController/getUnauditedLevel.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=8",
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $("#data_grade").html(html);
                    $.each(data, function (i, o) {
                        var userLevel = o.userLevel;
                        html += "<tr><td>" + o.user_pk + "</td>" +
                            "<td>" + o.userName + "</td>" +
                            "<td>" + (userLevel != 1 ? (userLevel != 2 ? (userLevel != 3 ? (userLevel != 4 ? (userLevel != 5 ? "未开通VIP" : "VIP5") : "VIP4") : "VIP3") : "VIP2") : "VIP1") + "</td>" +
                            "<td><select id='" + o.user_pk + "' onchange='updateUserLevelStateByPK(this)'>" +
                            "<option value='0' " + (o.userLevelState == 0 ? 'selected' : '') + " >不通过</option>" +
                            "<option value='1' " + (o.userLevelState == 1 ? 'selected' : '') + ">通过</option>" +
                            "<option value='2' " + (o.userLevelState == 2 ? 'selected' : '') + ">待审核</option></select></td>" +
                            "<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick='deleteUserLevelByPK(this)'name='" + o.user_pk + "'>删除</button></td></tr>";
                    });
                    $("#data_grade").html(html);
                    $("#grade_page").text((page + 1) + "/" + total);
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

//删除--重置等级
function deleteUserLevelByPK(ev) {
    if (confirm("确定要删除？")) {
        $.ajax({
            url: "../../userController/deleteUserLevelByPK.do",
            type: "POST",
            dataType: "json",
            data: "user_pk=" + ev.name,
            success: function (mu) {
                if (mu.m_istatus == 1) {
                    alert(mu.m_strMessage);
                    getUnauditedLevel();
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络出错!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function updateUserLevelStateByPK(ev) {
    var userLevelState = $("#" + ev.id).val();
    $.ajax({
        url: "../../userController/updateUserLevelStateByPK.do",
        type: "POST",
        dataType: "json",
        data: "user_pk=" + ev.id + "&userLevelState=" + userLevelState,
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                getUnauditedLevel();
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
        }
    });
}

/*****************个人信息审核*****************/
function getUnauditedPersonalMessageListPaging() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../userController/getUnauditedPersonalMessageListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=8",
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    var html = "";
                    $("#data_information").html(html);
                    $.each(data, function (i, o) {
                        html += "<tr><td>" + o.user_pk + "</td>" +
                            "<td>" + o.userName + "</td>" +
                            "<td>" + o.sendWord + "</td>" +
                            "<td>" + o.summary + "</td>" +
                            "<td><select id='" + o.user_pk + "' onchange='updateSendWordAndSummaryStateByPK(this)'>" +
                            "<option value='0' "+(o.sendWordAndSummaryState == 0 ? 'selected' : '')+">不通过</option>" +
                            "<option value='1' "+(o.sendWordAndSummaryState == 1 ? 'selected' : '')+">通过</option>" +
                            "<option value='2' "+(o.sendWordAndSummaryState == 2 ? 'selected' : '')+">待审核</option></select></td>" +
                            "<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick='deleteSendWordAndSummaryByPK(this)'name='" + o.user_pk + "'>删除</button></td></tr>";
                    });
                    $("#data_information").html(html);
                    $("#information_page").text((page + 1) + "/" + total);
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

//删除--重置个人简介、寄语
function deleteSendWordAndSummaryByPK(ev) {
    if (confirm("确定要删除？")) {
        $.ajax({
            url: "../../userController/deleteSendWordAndSummaryByPK.do",
            type: "POST",
            dataType: "json",
            data: "user_pk=" + ev.name,
            success: function (mu) {
                if (mu.m_istatus == 1) {
                    alert(mu.m_strMessage);
                    getUnauditedPersonalMessageListPaging();
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络出错!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function updateSendWordAndSummaryStateByPK(ev) {
    var sendWordAndSummaryState = $("#" + ev.id).val();
    $.ajax({
        url: "../../userController/updateSendWordAndSummaryStateByPK.do",
        type: "POST",
        dataType: "json",
        data: "user_pk=" + ev.id + "&sendWordAndSummaryState=" + sendWordAndSummaryState,
        success: function (mu) {
            if (mu.m_istatus == 1) {
                alert(mu.m_strMessage);
                getUnauditedPersonalMessageListPaging();
            } else {
                alert(mu.m_strMessage);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("网络出错!错误码:" + XMLHttpRequest.status);
        }
    });
}

/*****************用户数据*****************/
function getUserDataListPaging() {
    if ((page + 1) <= total) {
        $.ajax({
            url: "../../userController/getUserDataListPaging.do",
            type: "POST",
            dataType: "json",
            data: "page=" + page + "&pageRows=8",
            success: function (mu) {
                if (mu.m_istatus == "1") {
                    var data = mu.m_object.data;
                    total = mu.m_object.total;
                    totalCount = mu.m_object.totalCount;
                    var html = "";
                    $("#data_formmng").html(html);
                    $.each(data, function (i, o) {
                        html += "<tr><td>" + o.user_pk + "</td>" +
                            "<td>" + o.userName + "</td>" +
                            "<td>" + o.getLikeSum + "</td>" +
                            "<td>" + o.getUnLikeSum + "</td>" +
                            "<td>" + o.getCommentSum + "</td>" +
                            "<td>" + o.likeSum + "</td>" +
                            "<td>" + o.unLikeSum + "</td>" +
                            "<td>" + o.commentSum + "</td>" +
                            "</tr>";
                    });
                    $("#data_formmng").html(html);
                    $("#formmng_page").text((page + 1) + "/" + total);
                } else {
                    alert(mu.m_strMessage);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败!错误码:" + XMLHttpRequest.status);
            }
        });
    }
}

function exportExcel(b) {
    var param = "page=" + (b ? 0 : page) + "&pageRows=" + (b ? totalCount : 10);
    var url = "../../userController/exportExcel.do?";
    if (b) { //导出所有页
        $("#excelAll").attr("href", url + param);
    } else {    //导出当前页
        $("#excel").attr("href", url + param);
    }
}


//分页
function beforePage() {
    if (page > 0)
        page -= 1;
    commonFun();
}

function afterPage() {
    if ((page + 1) < total)
        page += 1;
    commonFun();
}

function commonFun() {
    if (type == 0) {
        //注意事项
    } else if (type == 1) {
        //用户管理
        getUserList();
    } else if (type == 2) {
        //资源审核
        getResourceList();
    } else if (type == 3) {
        //评论审核
        getCommentListPaging();
    } else if (type == 4) {
        //等级审核
        getUnauditedLevel();
    } else if (type == 5) {
        //个人信息审核
        getUnauditedPersonalMessageListPaging();
    } else {
        getUserDataListPaging();
    }
}

// 根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
}