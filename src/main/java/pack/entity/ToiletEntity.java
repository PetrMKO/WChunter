package pack.entity;

import org.hibernate.SessionFactory;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "toilet")
public class ToiletEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String discribe;
    private Double latitude;
    private Double longitude;
    private String type;
    private String time;
    @Transient
    private String img;
    @Transient
    private boolean isFavorite;
    private int mark;
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


    public ToiletEntity(String name, String discribe, Double latitude, Double longitude, List<CommentEntity> comment, int mark, String type, String time) {
        this.name = name;
        this.discribe = discribe;
        this.latitude = latitude;
        this.longitude = longitude;
        this.comment = comment;
        this.mark = mark;
        this.type = type;
        this.time = time;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }



    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getMark() {
        return mark;
    }

    public void setMark(int mark) {
        this.mark = mark;
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

    public String getDiscribe() {
        return discribe;
    }

    public void setDiscribe(String discribe) {
        this.discribe = discribe;
    }
}
