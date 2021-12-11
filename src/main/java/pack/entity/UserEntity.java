package pack.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;
    private String password;
    private String role;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "favorites",
            joinColumns = @JoinColumn(name = "users", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "toilet", referencedColumnName = "ID"))
    private List<ToiletEntity> favorite;

    public List<ToiletEntity> getFavorite() {
        return favorite;
    }

    public void setFavorite(List<ToiletEntity> favorite) {
        this.favorite = favorite;
    }

    public void addFavorites(ToiletEntity toiletEntity){
        favorite.add(toiletEntity);
    }

    public UserEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserEntity(String login, String password, String role) {
        this.login = login;
        this.password = password;
        this.role = role;
    }
}
