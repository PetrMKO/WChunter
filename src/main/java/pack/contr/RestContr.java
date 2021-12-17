package pack.contr;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pack.entity.BaloonPoint;
import pack.entity.NewJsonpoint;
import pack.entity.ToiletEntity;
import pack.entity.UserEntity;
import pack.repo.UserRepo;
import pack.service.ToiletService;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("")
public class RestContr {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ToiletService toiletService;


    @RequestMapping(value = "test", method = RequestMethod.POST)
    public void test(HttpEntity<String> httpEntity ){
        try {
            NewJsonpoint jsonpoint = objectMapper.readValue(httpEntity.getBody(), NewJsonpoint.class);
            toiletService.toiletSave(jsonpoint);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "points", produces={"application/json"}, method = RequestMethod.GET)
    @ResponseBody
    public ArrayList<BaloonPoint> getPoints(){
        return toiletService.baloons();
    }

    @RequestMapping("point/{name}")
    public ToiletEntity getPoint(@PathVariable String name){
        return toiletService.findByName(name);
    }



}
