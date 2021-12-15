package pack.contr;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pack.entity.Jsonpoint;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("")
public class RestContr {


    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping(value = "test", method = RequestMethod.POST)
    public void test(HttpEntity<String> httpEntity ){
        System.out.println(httpEntity.getBody());
        try {
            Jsonpoint jsonpoint = objectMapper.readValue(httpEntity.getBody(),Jsonpoint.class);
            System.out.println(jsonpoint);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        ResponseEntity responseEntity = new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "points", produces={"application/json"}, method = RequestMethod.GET)
    @ResponseBody
    public List<Jsonpoint> getPoints(){
        Jsonpoint pont = new Jsonpoint("bn","05:23","04:50", 5, "huita", "dfhg", 59.95750971712556,30.31415168616821 );
        List<Jsonpoint> list = new ArrayList<>();
        list.add(pont);
        return list;
    }


}
