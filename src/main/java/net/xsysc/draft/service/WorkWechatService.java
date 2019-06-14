package net.xsysc.draft.service;

import com.github.pagehelper.PageInfo;

import java.util.Map;


/**
 * Created by syy on 2018/10/18.
 */
public interface WorkWechatService {



    /**
     * 获取访问用户身份
     * @return
     */
    Map getuserinfo(String code);


}
