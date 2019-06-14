package net.xsysc.draft.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * tax/net.htjs.neo4j.tax.util
 *
 * @Description: 时间格式转换工具类
 * @Author: dingdongliang
 * @Date: 2018/5/22 15:58
 */
public class DateUtil {
    private static final String DATE = "yyyy-MM-dd";
    private static final String DATE_FORMAT="yyyyMM";
    /**
     * 日期格式字符串转换成时间戳
     *
     * @param date_str 字符串日期
     * @param format   如：yyyy-MM-dd HH:mm:ss
     * @return
     */
    public static String date2TimeStamp(String date_str, String format) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            return String.valueOf(sdf.parse(date_str).getTime() / 1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
    public static Date str2Date(String date_str,String format){
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        try {
            Date date=sdf.parse(date_str);
            return date;
        } catch (ParseException e) {
            e.printStackTrace();

        }
        return null;
    }

    public static Long String2Long(String date_str, String format) {
        return Long.parseLong(date2TimeStamp(date_str, format));
    }
    // 判断一个字符串是否都为数字
    public static boolean isDigit(String strNum) {
        return strNum.matches("[0-9]{1,}");
    }
    public static boolean isDate(String date_string,String data_format){
        SimpleDateFormat format=new SimpleDateFormat(data_format);
        boolean dateflag=true;
        try {
            //Date date = format.parse(date_string);
            format.setLenient(false);
            format.parse(date_string);
        } catch (ParseException e) {
            dateflag=false;
        }finally{
        }
        return dateflag;
    }


    //发票信息中, 时间戳转化为2018/01/02格式
    public static Map TimeStamp2Date(String yf){
        Map<String,String> map = new HashMap<>();
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
            String begin = yf;
            //30天后的时间 戳
            Long after = (Long.valueOf(begin)+30*24*60*60)*1000;
            String start=sdf.format(new Date(Long.valueOf(begin+"000")));
            String end = sdf.format(new Date(after));
            map.put("start",start);
            map.put("end",end);
            return map;
        }catch (Exception e){
            System.out.println("TimeStamp2Date出现异常");
            e.printStackTrace();
            return null;
        }

    }
    public static String getSysYear() {
        Calendar date = Calendar.getInstance();
        return String.valueOf(date.get(Calendar.YEAR));
    }
    public static String onlyDate() {
        return new SimpleDateFormat(DATE).format(new Date());
    }
    public static Date getCurrYearFirst(){
        Calendar currCal=Calendar.getInstance();
        int currentYear = currCal.get(Calendar.YEAR);
        return getYearFirst(currentYear);
    }
    public static Date getYearFirst(int year){
        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        calendar.set(Calendar.YEAR, year);
        Date currYearFirst = calendar.getTime();
        return currYearFirst;
    }

    /**
     * 根据年月获取下个月的第一天日期
     * @param yeadAndMonth 年月 yyyy-MM
     * @return 下个月的第一天 yyyy-MM-dd
     */
    public static String getFirstDayOfNextMonth(String yeadAndMonth){
        try {
            Calendar cal = Calendar.getInstance();
            String[] split = yeadAndMonth.split("-");
            cal.set(Calendar.YEAR, Integer.parseInt(split[0]));
            cal.set(Calendar.MONTH, Integer.parseInt(split[1]));
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
            Date time = cal.getTime();
            SimpleDateFormat sdf = new SimpleDateFormat(DateUtil.DATE);
            return sdf.format(time);
        } catch (Exception e){
            return "";
        }
    }

    /**
     * 根据年月获取本月的第一天日期
     * @param yearAndMonth 年月 yyyy-MM
     * @return 本月的第一天 yyyy-MM-dd
     */
    public static String getFirstDayOfMonth(String yearAndMonth){
        try {
            Calendar cal = Calendar.getInstance();
            String[] split = yearAndMonth.split("-");
            cal.set(Calendar.YEAR, Integer.parseInt(split[0]));
            cal.set(Calendar.MONTH, Integer.parseInt(split[1]) - 1);
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
            Date time = cal.getTime();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            return sdf.format(time);
        } catch (Exception e){
            return "";
        }
    }
    /**
     * 返回指定时间段的年月
     * @param minDate 最小时间  2015-01
     * @param maxDate 最大时间 2015-10
     * @return 日期集合 格式为 年-月
     * @throws Exception
     */
    public static List<String> getMonthBetween(String minDate, String maxDate) throws Exception {
        ArrayList<String> result = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat("MM");//格式化为年月
        Calendar min = Calendar.getInstance();
        Calendar max = Calendar.getInstance();

        min.setTime(sdf.parse(minDate));
        min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH), 1);

        max.setTime(sdf.parse(maxDate));
        max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH), 2);

        Calendar curr = min;
        while (curr.before(max)) {
            result.add(sdf.format(curr.getTime()));
            curr.add(Calendar.MONTH, 1);
        }

        return result;
    }
    public static String getLastYear(){
        SimpleDateFormat format = new SimpleDateFormat("yyyy");
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.YEAR, -1);
        Date y = c.getTime();
        String year = format.format(y);
        return year;
    }

    public static void main(String[] args) throws Exception{
        getMonthBetween("01","12");
        String day="201801";
        String a=day.substring(4);
        getLastYear();
        System.out.println();





    }
}
