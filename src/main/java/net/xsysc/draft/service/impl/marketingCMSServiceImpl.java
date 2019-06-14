package net.xsysc.draft.service.impl;

import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.service.marketingCMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import net.xsysc.draft.dao.marketingCMSMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.github.pagehelper.PageHelper;

/**
 * Created by syy on 2018/10/18.
 */
@Service
@Transactional(rollbackFor = Exception.class)
@Slf4j
public class marketingCMSServiceImpl implements marketingCMSService {


    @Autowired
    private marketingCMSMapper marketingCMSMapper;



    @Override
    public PageInfo selectArticleInfo(Map params) {
        PageHelper.startPage((int)params.get("pageNum"), 10);
        PageHelper.orderBy("publish_time desc");
        List list = marketingCMSMapper.selectArticleInfo(params);
        PageInfo page = new PageInfo(list);
        return page;
    }

    @Override
    public Map selectArticleContent(Map params) {
        Map map = new HashMap();
        map.put("content",marketingCMSMapper.selectArticleContent(params));
        map.put("info",marketingCMSMapper.selectArticleInfo(params));
        map.put("record",marketingCMSMapper.selectDraftRecord(params));
        return map;
    }


}
