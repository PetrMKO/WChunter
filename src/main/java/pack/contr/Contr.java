package pack.contr;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pack.entity.ToiletEntity;
import pack.entity.UserEntity;
import pack.repo.ToiletRepo;
import pack.repo.UserRepo;
import pack.service.UserService;

import java.security.Principal;


@Controller
@RequestMapping("/")
public class Contr {

    @Autowired
    UserRepo userRepo;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private ToiletRepo toiletRepo;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String test(){
        return "test";
    }


    @GetMapping("lk")
    public String lk(Model model){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal().getClass();
        UserEntity userEntity = userRepo.findByLogin(auth.getName());
        ToiletEntity toiletEntity = new ToiletEntity("toilet");
        toiletRepo.saveAndFlush(toiletEntity);
        userEntity.addFavorites(toiletEntity);
        userService.save(userEntity);
        model.addAttribute("login", auth.getName());
        try {
            model.addAttribute("toilets", userRepo.findByLogin(auth.getName()).getFavorite());
        }catch (Exception e){
            System.out.println("g");
        }
        return "lk";
    }


    @GetMapping("first")
    public String first(){
        return "FirstPage";
    }

    @GetMapping("map")
    public String map(){
        return "map";
    }


    @GetMapping("reg")
    public String reg(){
        return "reg";
    }


    @PostMapping("reg")
    public String dfh(String login, String password, String repeat, Model model){

        System.out.println(password + login +  repeat);

        if(!password.equals(repeat)){
            model.addAttribute("message", "Ты че тупой ?");
            return "reg";
        }

        final UserEntity userEntity = userRepo.findByLogin(login);
        if (userEntity != null) {
            model.addAttribute("message", "Жулик не воруй!");
            return "reg";
        }

//        System.out.println(userRepo.findAll());
//        System.out.println(userRepo.findByLogin("geg"));
        userRepo.save(new UserEntity(login, passwordEncoder.encode(password), "USER"));

        return "login";

    }


}
