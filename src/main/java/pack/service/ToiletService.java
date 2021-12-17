package pack.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pack.entity.BaloonPoint;
import pack.entity.NewJsonpoint;
import pack.entity.ToiletEntity;
import pack.entity.UserEntity;
import pack.repo.ToiletRepo;

import java.util.ArrayList;
import java.util.List;

@Service
public class ToiletService {


    @Autowired
    private UserService userService;

    @Autowired
    private ToiletRepo toiletRepo;


    @Transactional
    public void toiletSave( NewJsonpoint jsonpoint){
        ToiletEntity toiletEntity = new ToiletEntity();
        toiletEntity.setLongitude(jsonpoint.getLong());
        toiletEntity.setLatitude(jsonpoint.getLat());
        toiletEntity.setName(jsonpoint.getName());
        toiletEntity.setMark(jsonpoint.getMark());
        toiletEntity.setDiscribe(jsonpoint.getComment());
        toiletEntity.setTime(jsonpoint.getStartWork() + " - " + jsonpoint.getEndTime());
        toiletEntity.setType(jsonpoint.getType());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal().getClass();
        UserEntity userEntity = userService.findbyLogin(auth.getName());
        userEntity.addToilet(toiletEntity);
        toiletRepo.saveAndFlush(toiletEntity);
        userService.save(userEntity);
    }


    public ArrayList<BaloonPoint> baloons() {
        List<ToiletEntity> toiletEntities = toiletRepo.findAll();
        ArrayList<BaloonPoint> baloonPoints = new ArrayList<>();
        for (ToiletEntity t : toiletEntities){
            BaloonPoint baloonPoint = new BaloonPoint(t.getName(),t.getLatitude(), t.getLongitude());
            baloonPoints.add(baloonPoint);
        }
        System.out.println(baloonPoints);
        return baloonPoints;
    }

    public ToiletEntity findByName(String name) {
        return toiletRepo.findAllByName(name);
    }

}
