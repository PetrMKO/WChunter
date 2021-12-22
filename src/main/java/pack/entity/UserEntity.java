package pack.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "added",
            joinColumns = @JoinColumn(name = "users", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "toilet", referencedColumnName = "ID"))
    private Set<ToiletEntity> added;

    public Set<ToiletEntity> getAdded() {
        return added;
    }

    public void addToilet(ToiletEntity toiletEntity){
        added.add(toiletEntity);
    }


    public void deleteFav(ToiletEntity toiletEntity){
        int i = -1;
        for (ToiletEntity t : favorite){
            if (t.getId().equals(toiletEntity.getId())){
                i = favorite.indexOf(t);
            }
        }
        if (i > -1) favorite.remove(i);
    }

    public void setAdded(Set<ToiletEntity> added) {
        this.added = added;
    }

    public List<ToiletEntity> getFavorite() {
        return favorite;
    }

    public void setFavorite(ArrayList<ToiletEntity> favorite) {
        this.favorite = favorite;
    }

    public void addFavorites(ToiletEntity toiletEntity){
        favorite.add(toiletEntity);
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                '}';
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
