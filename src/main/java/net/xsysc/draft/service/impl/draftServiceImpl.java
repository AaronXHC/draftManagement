package net.xsysc.draft.service.impl;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.dao.draftMapper;
import net.xsysc.draft.dao.marketingCMSMapper;
import net.xsysc.draft.service.draftService;
import net.xsysc.draft.util.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Created by syy on 2018/10/18.
 */
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class draftServiceImpl implements draftService {


    @Autowired
    private draftMapper draftMapper;
    @Autowired
    private marketingCMSMapper marketingCMSMapper;



    @Override
    public PageInfo selectDraftInfo(Map params) {
        PageHelper.startPage((int)params.get("pageNum"), 10);
        PageHelper.orderBy("publish_time desc");
        List list = draftMapper.selectDraftInfo(params);
        PageInfo page = new PageInfo(list);
        return page;
    }

    @Override
    public Map selectDraftContent(Map params) {
        Map map = new HashMap();
        map.put("content",draftMapper.selectDraftContent(params));
        map.put("info",draftMapper.selectDraftInfo(params));
        map.put("record",marketingCMSMapper.selectDraftRecord(params));
        map.put("history",draftMapper.selectModificationRecord(params));
        return map;
    }

    @Override
    public Map selectHistoryContent(Map params) {
        Map map = new HashMap();
        map.put("content",draftMapper.selectDraftContent(params));
        map.put("info",draftMapper.selectDraftInfo(params));
        return map;
    }

    @Transactional
    @Override
    public int insertDRAFT_INFO_CONTENT(Map<String,String[]> params){
        String uuid = UUID.randomUUID().toString().replaceAll("-","");
        Map<String,Object> paramMap = new HashMap<String,Object>();
        Set set = params.keySet();
        Iterator i = set.iterator();
        while (i.hasNext()){
            String key = i.next().toString();
            paramMap.put(key,params.get(key)[0]);
        }
        AccessToken accessToken = AccessToken.getAccessToken();
        String AUTHOR = accessToken.getUserDetailInfo(paramMap.get("USERID").toString()).getString("name");
        paramMap.put("AUTHOR",AUTHOR);
        paramMap.put("SOURCE_WEBSITE","由"+AUTHOR+"发布");
        paramMap.put("ID",uuid);
        draftMapper.insertDRAFT_INFO(paramMap);
        Map contentMap = new HashMap();
        contentMap.put("ID",uuid);
        contentMap.put("NUM",1);
        contentMap.put("CONTENT",paramMap.get("CONTENT").toString());
        List list = new ArrayList();
        list.add(contentMap);
        draftMapper.insertDRAFT_CONTENT(list);
        return 0;
    }


    @Override
    @Transactional
    public List<Map> insertUsageRecord(Map map){
        if(map.get("exists").toString().equals("1")){
            AccessToken accessToken = AccessToken.getAccessToken();
            map.put("USERNAME",accessToken.getUserDetailInfo(map.get("USERID").toString()).getString("name"));
            marketingCMSMapper.insertDraftRecord(map);
        }else if(map.get("exists").toString().equals("0")){
            AccessToken accessToken = AccessToken.getAccessToken();
            Map info = marketingCMSMapper.selectArticleInfo(map).get(0);
            info.put("CONTENT_USE",map.get("CONTENT_USE"));
            info.put("USE_TIME",map.get("USE_TIME"));
            info.put("USERID",map.get("USERID"));
            info.put("USERNAME",accessToken.getUserDetailInfo(map.get("USERID").toString()).getString("name"));
            draftMapper.insertDRAFT_INFO(info);
            marketingCMSMapper.insertDraftRecord(info);
            List list = marketingCMSMapper.selectArticleContent(map);
            draftMapper.insertDRAFT_CONTENT(list);
        }
        return marketingCMSMapper.selectDraftRecord(map);
    }

    @Override
    @Transactional
    public int reEditDraft(Map map){
        AccessToken accessToken = AccessToken.getAccessToken();
        String AUTHOR = accessToken.getUserDetailInfo(map.get("USERID").toString()).getString("name");
        Map idmap = new HashMap();
        idmap.put("ID",map.get("ID").toString());
        Map info = draftMapper.selectDraftInfo(idmap).get(0);

        Set set = map.keySet();
        Iterator i = set.iterator();
        while (i.hasNext()){
            String key = i.next().toString();
            info.put(key,map.get(key));
        }
        Map contentMap = new HashMap();
        contentMap.put("ID",map.get("ID").toString());
        contentMap.put("NUM",1);
        contentMap.put("CONTENT",map.get("CONTENT").toString());
        List list = new ArrayList();
        list.add(contentMap);

        String stamp = String.valueOf(System.currentTimeMillis());
        map.put("USERNAME",AUTHOR);
        map.put("MODIFIED_STAMP",stamp);
        draftMapper.insertModificationRecord(map);
        Map flagMap = new HashMap();
        flagMap.put("MODIFICATION_FLAG",Integer.valueOf(1));
        flagMap.put("MODIFIED_STAMP",stamp);
        flagMap.put("ID",map.get("ID").toString());
        draftMapper.updateDRAFT_INFO(flagMap);
        draftMapper.updateDRAFT_CONTENT(flagMap);
        draftMapper.insertDRAFT_INFO(info);
        draftMapper.insertDRAFT_CONTENT(list);
        return 0;
    }


}
