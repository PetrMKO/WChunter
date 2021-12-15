package pack.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pack.entity.BaloonPoint;
import pack.entity.ToiletEntity;
import pack.repo.ToiletRepo;

import java.util.ArrayList;
import java.util.List;

@Service
public class ToiletService {

    @Autowired
    private ToiletRepo toiletRepo;


    @Transactional
    public void toiletSave(ToiletEntity toiletEntity){
        toiletRepo.saveAndFlush(toiletEntity);
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


}
