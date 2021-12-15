package pack.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pack.repo.ToiletRepo;

@Service
public class ToiletService {

    @Autowired
    private ToiletRepo toiletRepo;



}
