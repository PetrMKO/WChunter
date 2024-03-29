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
import org.springframework.web.bind.annotation.RequestParam;
import pack.entity.ComplaintEntity;
import pack.entity.ToiletEntity;
import pack.entity.ToiletIMGEntity;
import pack.entity.UserEntity;
import pack.repo.ComplaintsRepo;
import pack.repo.ImageRepo;
import pack.repo.ToiletRepo;
import pack.repo.UserRepo;
import pack.service.ToiletService;
import pack.service.UserService;

import javax.servlet.http.HttpSession;
import javax.xml.bind.DatatypeConverter;
import java.security.Principal;
import java.util.List;


@Controller
@RequestMapping("/")
public class Contr {


    @Autowired
    private ImageRepo imgRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ComplaintsRepo complaintsRepo;

    @Autowired
    private ToiletService toiletService;

    @Autowired
    private UserService userService;




    @GetMapping("lk")
    public String lk(Model model){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth.getAuthorities().toString());
        UserEntity userEntity = userService.findbyLogin(auth.getName());
        model.addAttribute("login", auth.getName());
        if (userEntity.getRole().equals("USER")) {
            model.addAttribute("toilets", userEntity.getFavorite());
            model.addAttribute("toiletsadded", userEntity.getAdded());
            return "lk";
        }
        if (userEntity.getRole().equals("ADMIN")) {
            model.addAttribute("USERS", userService.findAll());
            return "admin";
        }
        List<ComplaintEntity> complaintEntities = complaintsRepo.findAll();
        for (int i = 0; i < complaintEntities.size() ; i++ ){
            ToiletEntity toiletEntity = complaintEntities.get(i).getToiletEntity();
            toiletEntity.setImg("data:image/jpeg;base64," + DatatypeConverter.printBase64Binary(imgRepo.findById(toiletEntity.getId()).get().getImage()));
        }
        model.addAttribute("complaints", complaintEntities);
        return "moderlk";
    }

    @PostMapping("complaints")
    public String complaintsLk(@RequestParam(required = false) Long id, @RequestParam(required = false) String action,
                               @RequestParam(required = false) Long pointId,
                               @RequestParam(required = false) String username, Model model){
        if (action != null) {
            if (action.equals("del")) {
                complaintsRepo.deleteById(id);
            }
            if (action.equals("delPoint")) {
                complaintsRepo.deleteById(id);
                toiletService.deletePoint(pointId, username);
            }
        }
        System.out.println(action);
        System.out.println(id);
        System.out.println(pointId);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserEntity userEntity = userService.findbyLogin(auth.getName());
        model.addAttribute("login", auth.getName());
        model.addAttribute("complaints",complaintsRepo.findAll());
        return "redirect:lk";

    }

    @RequestMapping("/setrole")
    public String adminLk(@RequestParam(required = false) String role, @RequestParam(required = false) String login ){
        UserEntity userEntity = userService.findbyLogin(login);
        userEntity.setRole(role);
        userService.save(userEntity);
        return "redirect:lk";
    }

    @GetMapping("")
    public String first(){
        return "FirstPage";
    }

    @GetMapping("map")
    public String map(){
        return "map";
    }

    @GetMapping("mapka")
    public String mapka(@RequestParam(required = false) String name , HttpSession session){
        System.out.println(name);
        session.setAttribute("PointName", name);
        return "redirect:map";
    }



    @GetMapping("reg")
    public String reg(){
        return "reg";
    }


    @PostMapping("reg")
    public String dfh(String login, String password, String repeat, Model model){

        System.out.println(password + login +  repeat);

        if(!password.equals(repeat)){
            model.addAttribute("message1", "Пароли не совпадают!");
            return "reg";
        }

        final UserEntity userEntity = userService.findbyLogin(login);
        if (userEntity != null) {
            model.addAttribute("message2", "Такой пользователь уже существует !");
            return "reg";
        }

        userService.save(new UserEntity(login, passwordEncoder.encode(password), "USER"));

        return "loginka";

    }


}
