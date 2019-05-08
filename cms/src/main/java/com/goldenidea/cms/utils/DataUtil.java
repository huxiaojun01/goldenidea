package com.goldenidea.cms.utils;

import java.util.UUID;

public class DataUtil {
    /**
     * 生成PK
     *
     * @return
     */
    public static String proPK() {
        return UUID.randomUUID().toString().replaceAll("-", "").toLowerCase();
    }

    /**
     * 生成总页数
     *
     * @param total
     * @param pageSize
     * @return
     */
    public static int proPage(int total, int pageSize) {
        return total % pageSize != 0 ? (total / pageSize + 1) : (total / pageSize);
    }
}
