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
import pack.entity.*;
import pack.repo.ComplaintsRepo;
import pack.repo.UserRepo;
import pack.service.ToiletService;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("")
public class RestContr {


    @Autowired
    private ComplaintsRepo complaintsRepo;

    @Autowired
    private UserRepo userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ToiletService toiletService;


    @RequestMapping(value = "test", method = RequestMethod.POST)
    public void test(HttpEntity<String> httpEntity ) throws JsonProcessingException {
            NewJsonpoint jsonpoint = objectMapper.readValue(httpEntity.getBody(), NewJsonpoint.class);
            System.out.println(jsonpoint.toString());
            toiletService.toiletSave(jsonpoint);

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


    @RequestMapping("currentpoint")
    public ToiletEntity getCurPoint(HttpSession session){
        String name = session.getAttribute("PointName").toString();
        System.out.println(name);
        if (name == null){
            return null;
        }
        return toiletService.findByName(name);
    }

    @RequestMapping(value = "complaint/{name}", method = RequestMethod.POST)
    public void addComplaint(@PathVariable String name,  HttpEntity<String> httpEntity){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ComplaintEntity complaintEntity = new ComplaintEntity();
        complaintEntity.setComplain(httpEntity.getBody());
        complaintEntity.setUsername(auth.getName());
        complaintEntity.setToiletEntity(toiletService.findByName(name));
        complaintsRepo.saveAndFlush(complaintEntity);
    }

    @RequestMapping(value = "addFavorites/{name}", method = RequestMethod.POST)
    public void addFavorites(@PathVariable String name,  HttpEntity<String> httpEntity){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity userEntity = userService.findByLogin(auth.getName());
        userEntity.addFavorites(toiletService.findByName(name));
        userService.saveAndFlush(userEntity);
    }


    @RequestMapping(value = "addcomment/{name}", method = RequestMethod.POST)
    public HttpEntity addcomment(@PathVariable String name, HttpEntity<String> httpEntity ) {
        System.out.println(httpEntity.getBody());
        try {
            CommentEntity commentEntity = objectMapper.readValue(httpEntity.getBody(), CommentEntity.class);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            commentEntity.setUsername(auth.getName());
            toiletService.addComment(commentEntity, name);
            return new ResponseEntity(HttpStatus.OK);
        } catch (JsonProcessingException e) {
            System.out.print("КоляБ сервак упал");
        }
        return new ResponseEntity(HttpStatus.CONFLICT);
    }

    @RequestMapping(value = "deleteComplaint/{id}")
    public void deleteComplaint(@PathVariable Long id){
        complaintsRepo.deleteById(id);
    }


    @RequestMapping(value = "deletePoint/{id}")
    public void deletePoint(@PathVariable Long id){
        complaintsRepo.deleteById(id);
    }

    @RequestMapping(value = "username")
    public String getUsername(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }



}
