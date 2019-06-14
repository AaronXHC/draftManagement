package net.xsysc.draft.dao;


import java.util.List;
import java.util.Map;

/**
 * Created by syy on 2018/10/18.
 */
public interface marketingCMSMapper {


    List<Map> selectArticleInfo(Map map);

    List<Map> selectArticleContent(Map map);

    List<Map> selectDraftRecord(Map map);

    void insertDraftRecord(Map map);






}
