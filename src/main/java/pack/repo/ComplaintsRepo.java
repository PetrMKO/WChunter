package pack.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import pack.entity.ComplaintEntity;
import pack.entity.ToiletEntity;

public interface ComplaintsRepo extends JpaRepository<ComplaintEntity, Long> {

    void deleteById(Long id);
    int countAllByToiletEntity(ToiletEntity toiletEntity);

}
