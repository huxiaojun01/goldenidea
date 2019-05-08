package com.goldenidea.cms.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间工具类
 * <p>
 * y 年
 * M 月
 * d 日
 * h 时(12小时) H(24小时)
 * m 分
 * s 秒
 * S 毫秒
 * E 星期
 * D 1年中的第几天
 * F 1月中的第几天
 * w 1年中的第几周
 * W 1月中的第几周
 * a 上午/下午 标记符
 * k 在一天中(1~24)
 * K 在上午或下午(0~11)
 * z 时区
 */
public class DateUtil {
    /**
     * Date转String
     *
     * @param date
     * @param pattren
     * @return
     */
    public static String date2String(Date date, String pattren) {
        SimpleDateFormat format = new SimpleDateFormat(pattren);
        return format.format(date);
    }

    /**
     * 字符串转日期
     *
     * @param date
     * @param pattern yyyy-MM-dd HH:mm:ss
     * @return
     * @throws ParseException
     */
    public static Date StringToDate(String date, String pattern) throws ParseException {
        DateFormat dateFormat = new SimpleDateFormat(pattern);
        return dateFormat.parse(date);
    }

    /**
     * 获取某年某月有多少天
     * @param year
     * @param month
     * @return
     */
    public static int getDayOfMonth(int year,int month){
        Calendar c = Calendar.getInstance();
        c.set(year, month, 0); //输入类型为int类型
        return c.get(Calendar.DAY_OF_MONTH);
    }

}
