package pack.entity;

import org.hibernate.SessionFactory;

import javax.persistence.*;

@Entity
@Table(name = "toilet")
public class ToiletEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;


    public ToiletEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ToiletEntity(String name) {
        this.name = name;
    }
}
