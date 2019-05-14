package com.goldenidea.cms.contorller;

import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.service.UserService;
import com.goldenidea.cms.utils.BaseUtil;
import com.goldenidea.cms.utils.ExcelUtil;
import com.goldenidea.cms.utils.MessageUtil;
import com.goldenidea.cms.utils.Snowflake;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/userController")
@RestController
public class UserController {
    @Resource
    UserService userService;

    /**
     * 登录
     *
     * @param account
     * @param userPwd
     * @return
     */
    @RequestMapping("/login.do")
    public MessageUtil login(HttpServletRequest request, String account, String userPwd) {
        MessageUtil login = userService.login(account, userPwd);
        if (login.getM_istatus().intValue() != 0) {
            Map<String, Object> user = (Map) login.getM_object();
            UserSession userSession = new UserSession();
            userSession.setUser_pk(String.valueOf(user.get("user_pk")));
            userSession.setID(String.valueOf(user.get("ID")));
            userSession.setUserType(String.valueOf(user.get("userType")));
            userSession.setTelphone(String.valueOf(user.get("telphone")));
            userSession.setEmail(String.valueOf(user.get("email")));
            userSession.setUserPwd(String.valueOf(user.get("userPwd")));
            userSession.setUserFaceUrl(String.valueOf(user.get("userFaceUrl")));
            userSession.setUserLevel(String.valueOf(user.get("userLevel")));
            userSession.setUser_pk(String.valueOf(user.get("user_pk")));
            request.getSession().setAttribute("userSession", userSession);
        }
        return login;
    }

    @RequestMapping("/logOut.do")
    public MessageUtil logOut(HttpServletRequest request) {
        MessageUtil mu = new MessageUtil();
        request.getSession().removeAttribute("userSession");
        mu.setM_istatus(1);
        mu.setM_strMessage("退出成功！");
        return mu;
    }

    /**
     * 添加用户/管理员
     *
     * @param user
     * @return
     */
    @RequestMapping("/addUser.do")
    MessageUtil addUser(@RequestBody Map<String, Object> user) {
        return this.userService.addUser(user);
    }

    @RequestMapping("/deleteUserByPK.do")
    MessageUtil deleteUserByPK(String user_pk) {
        return this.userService.deleteUserByPK(user_pk);
    }

    @RequestMapping("/updateUser.do")
    MessageUtil updateUser(@RequestBody Map<String, Object> user, HttpServletRequest request) {
        UserSession user1 = (UserSession) request.getSession().getAttribute("userSession");
        user.put("user_pk", user1.getUser_pk());
        return this.userService.updateUser(user);
    }

    @RequestMapping("/updateUserBack.do")
    MessageUtil updateUserBack(@RequestBody Map<String, Object> user, HttpServletRequest request) {
        return this.userService.updateUserBack(user);
    }

    @RequestMapping("/getUser.do")
    MessageUtil getUser(HttpServletRequest request) {
        UserSession user = (UserSession) request.getSession().getAttribute("userSession");
        return this.userService.getUserByPK(user.getUser_pk());
    }

    @RequestMapping("/getUserByPK.do")
    MessageUtil getUserByPK(String user_pk) {
        return this.userService.getUserByPK(user_pk);
    }

    @RequestMapping("/getUserListPaging.do")
    MessageUtil getUserListPaging(Integer page, Integer pageRows) {
        return this.userService.getUserListPaging(page, pageRows);
    }

    @RequestMapping("/getUserMessage.do")
    MessageUtil getUserMessage(HttpServletRequest request) {
        UserSession user = (UserSession) request.getSession().getAttribute("userSession");
        return this.userService.getUserMessage(user.getUser_pk());
    }

    /**
     * vip兑换
     *
     * @param request
     * @param userLevel 1-vip1
     * @return
     */
    @RequestMapping("/updateUserLevel.do")
    MessageUtil updateUserLevel(HttpServletRequest request, String userLevel) {
        UserSession user = (UserSession) request.getSession().getAttribute("userSession");
        return this.userService.updateUserLevel(user.getUser_pk(), userLevel);
    }

    /**
     * 充值VIP
     *
     * @param userLevel
     * @return
     */
    @RequestMapping("/rechargeVip.do")
    MessageUtil rechargeVip(HttpServletRequest request, String userLevel) {
        UserSession user = (UserSession) request.getSession().getAttribute("userSession");
        return this.userService.rechargeVip(user.getUser_pk(), userLevel);
    }

    @RequestMapping("/getUnauditedLevel.do")
    public MessageUtil getUnauditedLevel(Integer page, Integer pageRows) {
        return this.userService.getUnauditedLevel(page, pageRows);
    }

    @RequestMapping("/updateUserLevelStateByPK.do")
    public MessageUtil updateUserLevelStateByPK(String user_pk, String userLevelState) {
        return this.userService.updateUserLevelStateByPK(user_pk, userLevelState);
    }

    @RequestMapping("/deleteUserLevelByPK.do")
    public MessageUtil deleteUserLevelByPK(String user_pk) {
        return this.userService.deleteUserLevelByPK(user_pk);
    }

    @RequestMapping("/getUnauditedPersonalMessageListPaging.do")
    public MessageUtil getUnauditedPersonalMessageListPaging(Integer page, Integer pageRows) {
        return this.userService.getUnauditedPersonalMessageListPaging(page, pageRows);
    }

    @RequestMapping("/updateSendWordAndSummaryStateByPK.do")
    public MessageUtil updateSendWordAndSummaryStateByPK(String user_pk, String sendWordAndSummaryState) {
        return this.userService.updateSendWordAndSummaryStateByPK(user_pk, sendWordAndSummaryState);
    }

    @RequestMapping("/deleteSendWordAndSummaryByPK.do")
    public MessageUtil deleteSendWordAndSummaryByPK(String user_pk) {
        return this.userService.deleteSendWordAndSummaryByPK(user_pk);
    }

    @RequestMapping("/getUserDataListPaging.do")
    public MessageUtil getUserDataListPaging(Integer page, Integer pageRows) {
        return this.userService.getUserDataListPaging(page, pageRows);
    }

    /**
     * 用户数据分析--导出当前页获所有页数据
     *
     * @param request
     * @param response
     * @param page
     * @param pageRows
     * @throws Exception
     */
    @RequestMapping("/exportExcel.do")
    public void test(HttpServletRequest request, HttpServletResponse response, Integer page, Integer pageRows) throws Exception {
        MessageUtil mu = this.userService.getUserDataListPaging(page, pageRows);
        Map<String, Object> dataMap = (Map<String, Object>) mu.getM_object();
        List<Map<String, Object>> data = (List<Map<String, Object>>)dataMap.get("data");
        String name = "用户数据分析表";
        String[] excelHeader = {
                "ID", "用户名", "获赞数", "获反对数", "获评论数",
                "点赞数", "反对数", "评论数"};
        String[] filedNames = {"user_pk", "userName",
                "getLikeSum", "getUnLikeSum", "getCommentSum",
                "likeSum", "unLikeSum", "commentSum"};
        HSSFWorkbook wb = ExcelUtil.createExcel(name, data, excelHeader, filedNames);
        response.setContentType("application/vnd.ms-excel");
        String userAgent = request.getHeader("User-Agent");
        if (userAgent.contains("MSIE") || userAgent.contains("Trident")) {
            response.setHeader("Content-Disposition", "attachment;filename=" + java.net.URLEncoder.encode(("用户数据分析.xls"), "UTF-8"));
        } else {
            //非IE浏览器的处理：
            response.setHeader("Content-Disposition", "attachment;filename=" + new String(("用户数据分析表.xls").getBytes("UTF-8"), "iso8859-1"));
        }
        OutputStream outputStream = response.getOutputStream();
        wb.write(outputStream);
        outputStream.flush();
        outputStream.close();
    }


    @RequestMapping("/proID.do")
    String proID() {
        return Snowflake.getInstance().nextId().toString();
    }
}
