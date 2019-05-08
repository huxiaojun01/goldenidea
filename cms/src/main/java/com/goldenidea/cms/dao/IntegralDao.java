package com.goldenidea.cms.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface IntegralDao {

    int addIntegral(Map<String, Object> integral);

    int addUserIntegral(@Param("user_pk") String user_pk, @Param("integralValue") Integer integralValue);

    int reduceUserIntegral(@Param("user_pk") String user_pk, @Param("integralValue") Integer integralValue);

}
