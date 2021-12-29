package pack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pack.entity.UserEntity;
import pack.repo.UserRepo;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Transactional
    public void save(UserEntity userEntity){
        userRepo.saveAndFlush(userEntity);
    }

    public UserEntity findbyLogin(String login){
        return userRepo.findByLogin(login);
    }

    public List<UserEntity> findAll(){
        return userRepo.findAll();
    }

}
