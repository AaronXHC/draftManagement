package net.xsysc.draft.dao;


import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by syy on 2018/10/18.
 */
public interface CrawlerPipeLineMapper {


    void insertARTICLE_INFO_EEO(List articleInfo);

    void updateARTICLE_INFO_EEO(Map map);

    void insertARTICLE_CONTENT_EEO(List list);


}
