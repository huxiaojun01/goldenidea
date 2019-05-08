package com.goldenidea.cms.service.impl;

import com.goldenidea.cms.dao.IntegralDao;
import com.goldenidea.cms.service.IntegralService;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Map;

@Transactional
@Service
public class IntegralServiceImpl implements IntegralService {
    @Resource
    IntegralDao integralDao;


    @Override
    public MessageUtil addIntegral(Map<String, Object> integral) {
        MessageUtil mu = new MessageUtil();
        int i = this.integralDao.addIntegral(integral);
        if(i>0){
            mu.setM_istatus(1);
            mu.setM_strMessage("添加成功！");
        }else {
            mu.setM_istatus(0);
            mu.setM_strMessage("添加失败！");
        }
        return mu;
    }


}
