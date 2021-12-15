package pack.contr;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pack.entity.BaloonPoint;
import pack.entity.NewJsonpoint;
import pack.entity.ToiletEntity;
import pack.service.ToiletService;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("")
public class RestContr {


    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ToiletService toiletService;


    @RequestMapping(value = "test", method = RequestMethod.POST)
    public void test(HttpEntity<String> httpEntity ){
        System.out.println(httpEntity.getBody());
        try {
            NewJsonpoint jsonpoint = objectMapper.readValue(httpEntity.getBody(), NewJsonpoint.class);
            System.out.println(jsonpoint);
            ToiletEntity toiletEntity = new ToiletEntity();
            toiletEntity.setLongitude(jsonpoint.getLong());
            toiletEntity.setLatitude(jsonpoint.getLat());
            toiletEntity.setName(jsonpoint.getName());
            System.out.println(toiletEntity);
            toiletService.toiletSave(toiletEntity);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "points", produces={"application/json"}, method = RequestMethod.GET)
    @ResponseBody
    public ArrayList<BaloonPoint> getPoints(){
        return toiletService.baloons();
    }


}
