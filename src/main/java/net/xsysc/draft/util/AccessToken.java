package net.xsysc.draft.util;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class AccessToken {

    private static AccessToken accessToken = null;
    private static String corpid = "ww7cfff6e545ddb0fe";
    private static String corpsecret = "A0_P5MhPpiwHQm_X2WWdxsDeIWMEHr3w3-wTCfmLuqo";

    private Map<String, String> map = new HashMap<String, String>();


    //私有化构造方法
    private AccessToken(){

    }

    // 静态工厂方法
    public static AccessToken getAccessToken(){
        if(accessToken==null){
            accessToken = new AccessToken();
        }
        return accessToken;
    }

    public static void setAccessToken(AccessToken accessToken) {
        AccessToken.accessToken = accessToken;
    }


    public Map<String, String> getMap(long errcode) {
        String time = map.get("expires_time");
        String accessToken = map.get("access_token");
        Date now = new Date();
        if(errcode!=40001&&time!=null&&accessToken!=null&&now.before(new Date(Long.parseLong(time)))){
            return this.map;
        }else{
            //获取新的token
            JSONObject jsonObject = httpClientGetTokenUtil();
            if(jsonObject!=null){
                if(jsonObject.getIntValue("errcode")==0){
                    this.map.put("access_token",jsonObject.getString("access_token"));
                    this.map.put("expires_time",String.valueOf(new Date().getTime()+jsonObject.getLongValue("expires_in")*1000));
                }
            }
            return this.map;
        }
    }


    //发送请求获取accessToken
    private JSONObject httpClientGetTokenUtil(){
        String url="https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid="+corpid+"&corpsecret="+corpsecret;
        return workWechatHttpUtil(url);
    }


    public JSONObject workWechatHttpUtil(String url){
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet get = new HttpGet(url);
        CloseableHttpResponse response = null;
        try {
            response = httpClient.execute(get);
            HttpEntity entity = response.getEntity();
            JSONObject jsonObject = JSONObject.parseObject(EntityUtils.toString(entity));
            return jsonObject;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }finally {
            try {
                httpClient.close();
                if(response!=null){
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public JSONObject getUserDetailInfo(String userid){
        AccessToken token = AccessToken.getAccessToken();
        String url = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token="+token.getMap(0).get("access_token")+"&userid="+userid;
        JSONObject jsonObject = token.workWechatHttpUtil(url);
        if(jsonObject.getLongValue("errcode")==40001){
            url = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token="+token.getMap(0).get("access_token")+"&userid="+userid;
            jsonObject = token.workWechatHttpUtil(url);
        }
        return jsonObject;
    }






}
