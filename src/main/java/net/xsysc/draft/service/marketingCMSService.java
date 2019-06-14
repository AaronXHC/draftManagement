package net.xsysc.draft.service;

import com.github.pagehelper.PageInfo;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;


/**
 * Created by syy on 2018/10/18.
 */
public interface marketingCMSService {

    /**
     * 查询文章信息列表
     * @param map
     * @return
     */
    PageInfo selectArticleInfo(Map map);

    /**
     * 查询文章信息列表
     * @param map
     * @return
     */
    Map selectArticleContent(Map map);


}
