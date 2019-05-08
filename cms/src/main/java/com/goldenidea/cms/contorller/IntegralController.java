package com.goldenidea.cms.contorller;

import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.service.IntegralService;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RequestMapping("/integralController")
@RestController
public class IntegralController {
    @Resource
    IntegralService integralService;

    @RequestMapping("/addIntegral.do")
    MessageUtil addIntegral(@RequestBody Map<String, Object> integral, HttpServletRequest request){
        UserSession userSession = (UserSession)request.getSession().getAttribute("userSession");
        integral.put("user_pk", userSession.getUser_pk());
        return this.integralService.addIntegral(integral);
    }


}
