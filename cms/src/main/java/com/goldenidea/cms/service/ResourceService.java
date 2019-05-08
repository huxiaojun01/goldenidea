package com.goldenidea.cms.service;


import com.goldenidea.cms.utils.MessageUtil;

import java.util.Map;

public interface ResourceService {

    MessageUtil addResource(Map<String, Object> resource);

    MessageUtil deleteResourceByPK(String file_pk);

    MessageUtil getResourceListPaging(Integer page, Integer pageRows);

    MessageUtil updateResourceState(String file_pk, String fileState);
}
