package pack.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pack.entity.*;
import pack.repo.CommentRepo;
import pack.repo.ImageRepo;
import pack.repo.ToiletRepo;


import javax.xml.bind.DatatypeConverter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ToiletService {


    @Autowired
    private UserService userService;

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private ImageRepo imageRepo;


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
        ToiletIMGEntity toiletIMGEntity = new ToiletIMGEntity();
        toiletIMGEntity.setImage(convertByte);
        imageRepo.saveAndFlush(toiletIMGEntity);
//        FileOutputStream img = null;
//        FileOutputStream imgCopy = null;
//        try {
//            img = new FileOutputStream("D:\\tomcat\\apache-tomcat-9.0.54\\webapps\\ROOT\\resources\\images\\toilets\\"
//            + jsonpoint.getName() + ".jpeg");
//            img.write(convertByte);
//            img.close();
//            imgCopy = new FileOutputStream("C:\\Users\\yranikus\\IdeaProjects\\fgjhfdj\\src\\main\\webapp\\resources\\images\\toilets\\"
//                    + jsonpoint.getName() + ".jpeg");
//            imgCopy.write(convertByte);
//            imgCopy.close();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        ToiletIMGEntity toiletIMGEntity1 = imageRepo.getOne(1L);
//        String s2 = Base64.getEncoder().encodeToString(toiletIMGEntity1.getImage());
//        String s = DatatypeConverter.printBase64Binary(toiletIMGEntity1.getImage());
//        System.out.println("\n\n\n\n\n\n");
//        System.out.println(s);

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
            BaloonPoint baloonPoint = new BaloonPoint(t.getName(),t.getLatitude(), t.getLongitude(), t.getMark());
            baloonPoints.add(baloonPoint);
        }
        return baloonPoints;
    }

    public ToiletEntity findByName(String name) {
        return toiletRepo.findAllByName(name);
    }

    @Transactional
    public void deletePoint(Long id, String username){
        UserEntity userEntity = userService.findbyLogin(username);
        ToiletEntity toiletEntity = toiletRepo.findById(id).get();
        userEntity.deleteFav(toiletEntity);
        userEntity.deleteAdd(toiletEntity);
        userService.save(userEntity);
        toiletRepo.deleteById(id);
    }


}
