package com.goldenidea.cms.service;



import com.goldenidea.cms.utils.MessageUtil;

import java.util.Map;

public interface UserService {
    MessageUtil login(String account, String userPwd);

    MessageUtil addUser(Map<String, Object> user);

    MessageUtil deleteUserByPK(String user_pk);

    MessageUtil updateUser(Map<String, Object> user);

    MessageUtil updateUserBack(Map<String, Object> user);

    MessageUtil getUserByPK(String user_pk)
            ;
    MessageUtil getUserListPaging(Integer page, Integer pageRows);

    MessageUtil updateUserLevel(String user_pk, String userLevel);

    MessageUtil getUserMessage(String user_pk);

    MessageUtil rechargeVip(String user_pk, String userLevel);

    MessageUtil getUnauditedLevel(Integer page, Integer pageRows);

    MessageUtil updateUserLevelStateByPK(String user_pk, String userLevelState);

    MessageUtil deleteUserLevelByPK(String user_pk);

    MessageUtil getUnauditedPersonalMessageListPaging(Integer page, Integer pageRows);

    MessageUtil updateSendWordAndSummaryStateByPK(String user_pk, String sendWordAndSummaryState);

    MessageUtil deleteSendWordAndSummaryByPK(String user_pk);

    MessageUtil getUserDataListPaging(Integer page, Integer pageRows);
}
