package net.xsysc.draft.service;

import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;


/**
 * Created by syy on 2018/10/18.
 */
public interface draftService {

    /**
     * 查询文章信息列表
     * @param map
     * @return
     */
    PageInfo selectDraftInfo(Map map);

    /**
     * 查询文章信息列表
     * @param map
     * @return
     */
    Map selectDraftContent(Map map);

    Map selectHistoryContent(Map map);

    int insertDRAFT_INFO_CONTENT(Map<String,String[]> map);

    List<Map> insertUsageRecord(Map map);


    int reEditDraft(Map map);

}
