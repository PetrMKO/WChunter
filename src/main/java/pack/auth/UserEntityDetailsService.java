package pack.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pack.entity.UserEntity;
import pack.repo.UserRepo;

public class UserEntityDetailsService implements UserDetailsService {

    private final UserRepo userRepo;

    public UserEntityDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }


    @Override
    public UserDetails loadUserByUsername(final String login) throws UsernameNotFoundException {

        try {
            UserEntity userEntity = userRepo.findByLogin(login);
            if (userEntity != null) {
                System.out.println(userEntity);
                UserDetails user = User.withUsername(userEntity.getLogin()).password(userEntity.getPassword())
                        .roles(userEntity.getRole())
                        .build();
                return user;
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        System.out.println(login);


        throw new UsernameNotFoundException(login);
    }




}
