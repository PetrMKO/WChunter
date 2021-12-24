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
import pack.repo.ImageRepo;
import pack.repo.UserRepo;
import pack.service.ToiletService;

import javax.servlet.http.HttpSession;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("")
public class RestContr {


    @Autowired
    private ImageRepo imgRepo;


    @Autowired
    private ComplaintsRepo complaintsRepo;

    @Autowired
    private UserRepo userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ToiletService toiletService;


    @RequestMapping(value = "test", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity test(HttpEntity<String> httpEntity ) throws JsonProcessingException {
        System.out.println(httpEntity.getBody());
            NewJsonpoint jsonpoint = objectMapper.readValue(httpEntity.getBody(), NewJsonpoint.class);

            ToiletEntity toiletEntity = toiletService.findByName(jsonpoint.getName());
            if (toiletEntity != null) {
                return ResponseEntity.status(400).body("");
            }
            toiletService.toiletSave(jsonpoint);

            return ResponseEntity.status(200).body("");
    }

    @RequestMapping(value = "points", produces={"application/json"}, method = RequestMethod.GET)
    @ResponseBody
    public ArrayList<BaloonPoint> getPoints(){
        return toiletService.baloons();
    }

    @RequestMapping("point/{name}")
    public ToiletEntity getPoint(@PathVariable String name){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity userEntity = userService.findByLogin(auth.getName());
        ToiletEntity toiletEntity = toiletService.findByName(name);
        toiletEntity.setFavorite(userEntity.isFavorite(toiletEntity));
        ToiletIMGEntity toiletIMGEntity = imgRepo.findById(toiletEntity.getId()).get();
        toiletEntity.setImg("data:image/jpeg;base64," + DatatypeConverter.printBase64Binary(toiletIMGEntity.getImage()));
        return toiletEntity;
    }


    @RequestMapping("currentpoint")
    public ToiletEntity getCurPoint(HttpSession session){
        String name = session.getAttribute("PointName").toString();
        if (name == null){
            return null;
        }
        session.removeAttribute("PointName");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity userEntity = userService.findByLogin(auth.getName());
        ToiletEntity toiletEntity = toiletService.findByName(name);
        toiletEntity.setFavorite(userEntity.isFavorite(toiletEntity));
        ToiletIMGEntity toiletIMGEntity = imgRepo.getById(toiletEntity.getId());
        toiletEntity.setImg("data:image/jpeg;base64," + DatatypeConverter.printBase64Binary(toiletIMGEntity.getImage()));
        return toiletEntity;
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

    @RequestMapping(value = "deleteFavorites/{name}", method = RequestMethod.POST)
    public void deleteFavorites(@PathVariable String name){
        System.out.println(name);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity userEntity = userService.findByLogin(auth.getName());
        userEntity.deleteFav(toiletService.findByName(name));
        userService.saveAndFlush(userEntity);
    }

    @RequestMapping(value = "addcomment/{name}", method = RequestMethod.POST)
    public HttpEntity addcomment(@PathVariable String name, HttpEntity<String> httpEntity ) {
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


    @RequestMapping(value = "username")
    public String getUsername(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }



}
