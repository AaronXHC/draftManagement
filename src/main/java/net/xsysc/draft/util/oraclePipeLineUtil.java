
package net.xsysc.draft.util;

import lombok.extern.slf4j.Slf4j;
import net.xsysc.draft.dao.CrawlerPipeLineMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import us.codecraft.webmagic.ResultItems;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.pipeline.Pipeline;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class oraclePipeLineUtil implements Pipeline {

    @Autowired
    public CrawlerPipeLineMapper crawlerPipeLineMapper;

    @Override
    @Transactional
    public void process(ResultItems resultItems, Task task) {
        /*Map map = resultItems.getAll();
        crawlerPipeLineMapper.insertEeoARTICLETITLE(map);*/
        Map map = resultItems.getAll();
        if(map.get("operation").toString().equals("1")){
            //保存文章基本信息
            crawlerPipeLineMapper.insertARTICLE_INFO_EEO((List<Map>)map.get("articleInfo"));
        }else if(map.get("operation").toString().equals("0")){
            //更新文章基本信息，保存文章内容
            Map articleInfo = (Map) map.get("articleInfo");
            if(articleInfo.size()>0){
                crawlerPipeLineMapper.updateARTICLE_INFO_EEO(articleInfo);
            }
            List list = (List) map.get("list");
            for(int i=0;i<=(list.size()/30);i++){
                if(list.size()-i*30>0){
                    crawlerPipeLineMapper.insertARTICLE_CONTENT_EEO(list.subList(i*30,((i*30+30)<list.size()?(i*30+30):list.size()) ));
                }
            }
        }

    }
}

