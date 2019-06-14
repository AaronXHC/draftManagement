package net.xsysc.draft;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;



@MapperScan("net.xsysc.draft.dao")
@SpringBootApplication
@EnableScheduling
public class DraftApplication {

    public static void main(String[] args) {


        SpringApplication.run(DraftApplication.class, args);
    }






}
