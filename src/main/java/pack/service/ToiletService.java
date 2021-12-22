package pack.service;


import com.sun.mail.util.BASE64DecoderStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pack.entity.*;
import pack.repo.CommentRepo;
import pack.repo.ToiletRepo;


import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ToiletService {


    @Autowired
    private UserService userService;

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private ToiletRepo toiletRepo;


    @Transactional
    public void toiletSave( NewJsonpoint jsonpoint) {
        ToiletEntity toiletEntity = new ToiletEntity();
        toiletEntity.setLongitude(jsonpoint.getLong());
        toiletEntity.setLatitude(jsonpoint.getLat());
        toiletEntity.setName(jsonpoint.getName());
        toiletEntity.setMark(jsonpoint.getMark());
        toiletEntity.setDiscribe(jsonpoint.getComment());
        toiletEntity.setTime(jsonpoint.getStartWork() + " - " + jsonpoint.getEndTime());
        toiletEntity.setType(jsonpoint.getType());

        String base64Image = jsonpoint.getPhoto().split(",")[1];
        byte[] convertByte = DatatypeConverter.parseBase64Binary(base64Image);
        FileOutputStream img = null;
        FileOutputStream imgCopy = null;
        try {
            img = new FileOutputStream("D:\\tomcat\\apache-tomcat-9.0.54\\webapps\\ROOT\\resources\\images\\toilets\\"
            + jsonpoint.getName() + ".jpeg");
            img.write(convertByte);
            img.close();
            imgCopy = new FileOutputStream("C:\\Users\\yranikus\\IdeaProjects\\fgjhfdj\\src\\main\\webapp\\resources\\images\\toilets\\"
                    + jsonpoint.getName() + ".jpeg");
            imgCopy.write(convertByte);
            imgCopy.close();
        } catch (IOException e) {
            e.printStackTrace();
        }


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity userEntity = userService.findbyLogin(auth.getName());
        userEntity.addToilet(toiletEntity);
        toiletRepo.saveAndFlush(toiletEntity);
        userService.save(userEntity);
    }

    @Transactional
    public void addComment(CommentEntity commentEntity, String name) {
        ToiletEntity toiletEntity = toiletRepo.findByName(name);
        toiletEntity.addComment(commentEntity);
        commentRepo.saveAndFlush(commentEntity);
        toiletRepo.saveAndFlush(toiletEntity);
    }


    public ArrayList<BaloonPoint> baloons() {
        List<ToiletEntity> toiletEntities = toiletRepo.findAll();
        ArrayList<BaloonPoint> baloonPoints = new ArrayList<>();
        for (ToiletEntity t : toiletEntities){
            BaloonPoint baloonPoint = new BaloonPoint(t.getName(),t.getLatitude(), t.getLongitude());
            baloonPoints.add(baloonPoint);
        }
        return baloonPoints;
    }

    public ToiletEntity findByName(String name) {
        return toiletRepo.findAllByName(name);
    }

    public void deletePoint(Long id){
        toiletRepo.deleteById(id);
    }


}
