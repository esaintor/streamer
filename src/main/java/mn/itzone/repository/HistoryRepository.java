package mn.itzone.repository;

import mn.itzone.domain.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findByUsername(String username);

    Optional<History> findByUsernameAndParent(String username, String parent);
}
