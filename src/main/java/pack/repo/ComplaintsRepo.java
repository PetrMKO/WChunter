package pack.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import pack.entity.ComplaintEntity;

public interface ComplaintsRepo extends JpaRepository<ComplaintEntity, Long> {

    void deleteById(Long id);

}
