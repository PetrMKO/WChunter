package pack.contr;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


@RestController
@RequestMapping("")
public class RestContr {


    @RequestMapping(value = "test", produces ={"text/html; charset=UTF-8"}, method = RequestMethod.POST)
    public @ResponseBody ResponseEntity test(){
        System.out.println("Ты пидор");
        ResponseEntity responseEntity = new ResponseEntity(HttpStatus.OK);
        return  responseEntity;
    }


}
