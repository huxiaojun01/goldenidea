package com.goldenidea.cms.service.impl;

import com.goldenidea.cms.dao.IntegralDao;
import com.goldenidea.cms.dao.UserDao;
import com.goldenidea.cms.service.UserService;
import com.goldenidea.cms.utils.DataUtil;
import com.goldenidea.cms.utils.MessageUtil;
import com.goldenidea.cms.utils.Snowflake;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
public class UserServiceImpl implements UserService {
    @Resource
    UserDao userDao;
    @Resource
    IntegralDao integralDao;


    /**
     * 登录
     *
     * @param account
     * @param userPwd
     * @return
     */
    @Override
    public MessageUtil login(String account, String userPwd) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> manager = this.userDao.login(account, userPwd);
        if (manager != null && !manager.isEmpty()) {
            mu.setM_istatus(1);
            mu.setM_object(manager);
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("账号或密码错误!");
        }
        return mu;
    }

    @Override
    public MessageUtil addUser(Map<String, Object> user) {
        MessageUtil mu = new MessageUtil();
        int register = this.userDao.isRegister(user.get("telphone").toString(), user.get("email").toString());
        if (register > 0) {
            mu.setM_istatus(0);
            mu.setM_strMessage("手机号或邮箱已注册！");
            return mu;
        }
        user.put("user_pk", Snowflake.getInstance().nextId().toString());
        user.put("ID", Snowflake.getInstance().nextId().toString());
        int i = this.userDao.addUser(user);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("注册成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("注册失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil deleteUserByPK(String user_pk) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.deleteUserByPK(user_pk);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("删除成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("删除失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil updateUser(Map<String, Object> user) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.updateUser(user);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("修改成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("修改失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil updateUserBack(Map<String, Object> user) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.updateUserBack(user);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("修改成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("修改失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getUserByPK(String user_pk) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> user = this.userDao.getUserByPK(user_pk);
        if (user != null && !user.isEmpty()) {
            mu.setM_istatus(1);
            mu.setM_strMessage("查询成功！");
            mu.setM_object(user);
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("查询失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getUserListPaging(Integer page, Integer pageRows) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.userDao.getUserListPaging(page * pageRows, pageRows);
        int total = this.userDao.getTotalCount();
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil updateUserLevel(String user_pk, String userLevel) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> user = this.userDao.getUserByPK(user_pk);
        int userIntegral = Integer.parseInt(user.get("userIntegral").toString());
        //V1-100 V2-200 V3-400 V4-800 V5-2000
        int[] levels = {100, 200, 400, 800, 2000};
        if (userIntegral < levels[Integer.parseInt(userLevel) - 1]) {
            mu.setM_istatus(0);
            mu.setM_strMessage("积分不足！");
            return mu;
        }
        //兑换成功--积分减少
        this.integralDao.reduceUserIntegral(user_pk, levels[Integer.parseInt(userLevel) - 1]);
        //修改用户等级
        int i = this.userDao.updateUserLevel(user_pk, userLevel);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("兑换成功！");
            mu.setM_object(user);
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("兑换失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getUserMessage(String user_pk) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> userMessage = this.userDao.getUserMessage(user_pk);
        String likeSum = String.valueOf(userMessage.get("likeSum"));
        if (likeSum == null || likeSum.equals("") || likeSum.equals("null")) {
            userMessage.replace("likeSum", 0);
        }
        mu.setM_istatus(1);
        mu.setM_object(userMessage);
        return mu;
    }

    @Override
    public MessageUtil rechargeVip(String user_pk, String userLevel) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.updateUserLevel(user_pk, userLevel);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("充值成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("充值失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getUnauditedLevel(Integer page, Integer pageRows) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.userDao.getUnauditedLevelListPaging(page * pageRows, pageRows);
        int total = this.userDao.getUnauditedLevelTotal();
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil updateUserLevelStateByPK(String user_pk, String userLevelState) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.updateUserLevelStateByPK(user_pk, userLevelState);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("审核成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("审核失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil deleteUserLevelByPK(String user_pk) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.updateUserLevel(user_pk, "-1");
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("删除成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("删除失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getUnauditedPersonalMessageListPaging(Integer page, Integer pageRows) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.userDao.getUnauditedPersonalMessageListPaging(page * pageRows, pageRows);
        int total = this.userDao.getUnauditedPersonalMessageTotal();
        result.put("data", list);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }

    @Override
    public MessageUtil updateSendWordAndSummaryStateByPK(String user_pk, String sendWordAndSummaryState) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.updateSendWordAndSummaryStateByPK(user_pk, sendWordAndSummaryState);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("审核成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("审核失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil deleteSendWordAndSummaryByPK(String user_pk) {
        MessageUtil mu = new MessageUtil();
        int i = this.userDao.deleteSendWordAndSummaryByPK(user_pk);
        if (i > 0) {
            mu.setM_istatus(1);
            mu.setM_strMessage("删除成功！");
        } else {
            mu.setM_istatus(0);
            mu.setM_strMessage("删除失败！");
        }
        return mu;
    }

    @Override
    public MessageUtil getUserDataListPaging(Integer page, Integer pageRows) {
        MessageUtil mu = new MessageUtil();
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> list = this.userDao.getUserDataListPaging(page * pageRows, pageRows);
        int total = this.userDao.getTotalCount();
        result.put("data", list);
        result.put("totalCount", total);
        result.put("total", DataUtil.proPage(total, pageRows));
        mu.setM_istatus(1);
        mu.setM_object(result);

        return mu;
    }
}
