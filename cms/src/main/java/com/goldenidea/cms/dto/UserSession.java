package com.goldenidea.cms.dto;

import java.io.Serializable;
import java.sql.Timestamp;

public class UserSession implements Serializable {
    private static final long serialVersionUID = 2629002668218413167L;
    private String user_pk;
    private String ID;
    private String userType;
    private String telphone;
    private String email;
    private String userPwd;
    private String userFaceUrl;
    private Timestamp userRegisterTime;

    public String getUser_pk() {
        return user_pk;
    }

    public void setUser_pk(String user_pk) {
        this.user_pk = user_pk;
    }

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getTelphone() {
        return telphone;
    }

    public void setTelphone(String telphone) {
        this.telphone = telphone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserPwd() {
        return userPwd;
    }

    public void setUserPwd(String userPwd) {
        this.userPwd = userPwd;
    }

    public String getUserFaceUrl() {
        return userFaceUrl;
    }

    public void setUserFaceUrl(String userFaceUrl) {
        this.userFaceUrl = userFaceUrl;
    }

    public Timestamp getUserRegisterTime() {
        return userRegisterTime;
    }

    public void setUserRegisterTime(Timestamp userRegisterTime) {
        this.userRegisterTime = userRegisterTime;
    }
}
