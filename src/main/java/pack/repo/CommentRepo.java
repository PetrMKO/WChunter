package pack.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pack.entity.CommentEntity;

@Repository
public interface CommentRepo extends JpaRepository<CommentEntity, Long> {


}
