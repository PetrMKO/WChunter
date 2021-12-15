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
    private String lat;
    private String Long;
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

    public void setName(String name) {
        this.name = name;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLong() {
        return Long;
    }

    public void setLong(String aLong) {
        Long = aLong;
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

    public ToiletEntity(java.lang.Long id, String name, String lat, String aLong) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        Long = aLong;
    }
}
