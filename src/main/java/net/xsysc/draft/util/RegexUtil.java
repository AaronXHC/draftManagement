package net.xsysc.draft.util;

/**
 * Created by syy on 2018/10/29.
 */
public class RegexUtil {
    /**
     * 判断是否包含汉字
     * @param str
     * @return
     */
    public static boolean isIncludeChinese(String str){
        str=str.toLowerCase().replaceAll("[^\u4e00-\u9fa5]","");
        return str.length()>0;
    }
    public static void main(String[] args){
        boolean b=isIncludeChinese("hsiuhihsig");
        System.out.println();
    }
}
