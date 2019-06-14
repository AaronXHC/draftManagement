package net.xsysc.draft.service.impl;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.service.WorkWechatService;
import net.xsysc.draft.util.AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by syy on 2018/10/18.
 */
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class WorkWechatServiceImpl implements WorkWechatService {






    @Override
    public Map getuserinfo(String code){
        Map map = new HashMap();
        AccessToken accessToken = AccessToken.getAccessToken();
        String token = accessToken.getMap(0).get("access_token");
        String url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token="+token+"&code="+code;
        JSONObject jsonObject = accessToken.workWechatHttpUtil(url);
        if(jsonObject.getLongValue("errcode")==40001){
            token = accessToken.getMap(40001).get("access_token");
            url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token="+token+"&code="+code;
            jsonObject = accessToken.workWechatHttpUtil(url);
        }
        map.put("userinfo",jsonObject);
        map.put("accessToken",token);
        return map;
    }


}
