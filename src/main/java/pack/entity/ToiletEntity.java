package pack.entity;

import org.hibernate.SessionFactory;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "toilet")
public class ToiletEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "comments",
            joinColumns = @JoinColumn(name = "toilet", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "comment", referencedColumnName = "ID"))
    private List<CommentEntity> comment;

    public List<CommentEntity> getComment() {
        return comment;
    }

    public void setComment(List<CommentEntity> comment) {
        this.comment = comment;
    }

    public void addComment(CommentEntity comment) {
        this.comment.add(comment);
    }

    public ToiletEntity() {
    }

    public ToiletEntity(String name, Double latitude, Double longitude, List<CommentEntity> comment) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.comment = comment;
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

    public void setName(String name) {
        this.name = name;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
