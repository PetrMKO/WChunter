package pack.entity;

import javax.persistence.*;

@Entity(name = "complaints")
public class ComplaintEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String complain;
    private String username;

    @OneToOne
    private ToiletEntity toiletEntity;



    public ComplaintEntity() {
    }

    public ComplaintEntity(String complain, String username) {
        this.complain = complain;
        this.username = username;
    }

    public ToiletEntity getToiletEntity() {
        return toiletEntity;
    }

    public void setToiletEntity(ToiletEntity toiletEntity) {
        this.toiletEntity = toiletEntity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComplain() {
        return complain;
    }

    public void setComplain(String complain) {
        this.complain = complain;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
