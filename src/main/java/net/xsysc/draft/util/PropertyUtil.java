package net.xsysc.draft.util;

import java.io.InputStream;
import java.util.Properties;

public class PropertyUtil {
    public  Properties getConfig(){
        try {
            Properties properties = new Properties();
            InputStream  inputStream= PropertyUtil.class.getClassLoader().getResourceAsStream("application.yml");
            properties.load(inputStream);
            return properties;
        }catch (Exception e){
            System.out.println("-----空值 错误-----");
            return null;
        }

    }

    public static void main(String[] args) {
        PropertyUtil propertyUtil =new PropertyUtil();
        Properties p = propertyUtil.getConfig();
        System.out.println("----------"+p.getProperty("username"));

    }

}
