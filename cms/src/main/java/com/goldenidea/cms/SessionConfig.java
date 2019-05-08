package com.goldenidea.cms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goldenidea.cms.dto.UserSession;
import com.goldenidea.cms.utils.MessageUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class SessionConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        List<String> exPatterns = new ArrayList<>();
        exPatterns.add("/**/**/login.html");
        exPatterns.add("/**/**/register.html");
        exPatterns.add("/**/**/index.html");
        exPatterns.add("/**/**/*.do");
        exPatterns.add("/**/**/addUser.do");
        exPatterns.add("/**/**/**/index.html");
        exPatterns.add("/**/**/**/idea.html");
        exPatterns.add("/**/**/**/mood.html");
        exPatterns.add("/**/**/**/readEss.html");
        exPatterns.add("/**/**/**/readMood.html");
        exPatterns.add("/**/**/**/readQue.html");
        exPatterns.add("/**/**/**/search.html");

        List<String> patterns = new ArrayList<>();
        patterns.add("/**/*.do");
        patterns.add("/*.do");
        patterns.add("/**/*.html");
        patterns.add("/**/**/*.html");
        patterns.add("/**/**/**/*.html");

        registry.addInterceptor(new SecurityInterceptor()).addPathPatterns(patterns).excludePathPatterns(exPatterns);
    }

    @Configuration
    public class SecurityInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
            HttpSession session = request.getSession();
            UserSession manageSession = (UserSession) session.getAttribute("userSession");
            if (null != manageSession) {
                return true;
            } else {
                StringBuffer url = request.getRequestURL();
                if (url.indexOf(".do") > 0) {
                    MessageUtil mu = new MessageUtil();
                    mu.setM_istatus(405);
                    mu.setM_strMessage("登录超时！");
                    response.setContentType("application/json;charset=UTF-8");
                    PrintWriter printWriter = response.getWriter();
                    ObjectMapper objectMapper = new ObjectMapper();
                    printWriter.write(objectMapper.writeValueAsString(mu));
                } else {
                    response.sendRedirect("/htmlfile/before/login.html");
                }
            }
            return false;
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/file/**").addResourceLocations("file:D:/cqpwx/uploadFiles/");
    }
}
