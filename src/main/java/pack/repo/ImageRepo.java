package pack.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ResponseBody;
import pack.entity.ToiletIMGEntity;

@Repository
public interface ImageRepo extends JpaRepository<ToiletIMGEntity, Long> {

    ToiletIMGEntity getById(Long id);

}
