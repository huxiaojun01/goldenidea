package com.goldenidea.cms.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserDao {

    Map<String, Object> login(@Param("account") String account, @Param("userPwd") String userPwd);

    int addUser(Map<String, Object> user);

    int isRegister(@Param("telphone") String telphone, @Param("email") String email);

    int deleteUserByPK(String user_pk);

    int updateUser(Map<String, Object> user);

    int updateUserBack(Map<String, Object> user);

    Map<String, Object> getUserByPK(String user_pk)
            ;
    List<Map<String, Object>> getUserListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows);

    int getTotalCount();

    int updateUserLevel(@Param("user_pk") String user_pk, @Param("userLevel") String userLevel);

    Map<String, Object> getUserMessage(@Param("user_pk") String user_pk);

    List<Map<String, Object>> getUnauditedLevelListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows);

    int getUnauditedLevelTotal();

    int updateUserLevelStateByPK(@Param("user_pk") String user_pk, @Param("userLevelState") String userLevelState);

    List<Map<String, Object>> getUnauditedPersonalMessageListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows);

    int getUnauditedPersonalMessageTotal();

    int updateSendWordAndSummaryStateByPK(@Param("user_pk") String user_pk, @Param("sendWordAndSummaryState") String sendWordAndSummaryState);

    int deleteSendWordAndSummaryByPK(@Param("user_pk") String user_pk);

    List<Map<String, Object>> getUserDataListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows);
}
