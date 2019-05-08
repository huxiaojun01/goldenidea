package com.goldenidea.cms.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ResourceDao {

    int addResource(Map<String, Object> resource);

    int deleteResourceByPK(String file_pk);

    Map<String, Object> getResourceByPK(String file_pk);

    List<Map<String, Object>> getResourceListPaging(@Param("offset") Integer offset, @Param("rows") Integer rows);

    int getTotalCount();

    int updateResourceState(@Param("file_pk") String file_pk, @Param("fileState") String fileState);
}
