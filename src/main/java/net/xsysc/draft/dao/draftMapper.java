package net.xsysc.draft.dao;


import java.util.List;
import java.util.Map;

/**
 * Created by syy on 2018/10/18.
 */
public interface draftMapper {


    List<Map> selectDraftInfo(Map map);

    List<Map> selectDraftContent(Map map);


    int insertDRAFT_INFO(Map map);

    void updateDRAFT_INFO(Map map);

    void insertDRAFT_CONTENT(List list);

    void insertModificationRecord(Map map);

    List<Map> selectModificationRecord(Map map);

    void updateDRAFT_CONTENT(Map map);





}
