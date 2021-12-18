package pack.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "comment")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;
    private String comment;
    private long mark;

    public CommentEntity() {
    }

    public CommentEntity(long id, String comment, long mark) {
        Id = id;
        this.comment = comment;
        this.mark = mark;
    }

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public long getMark() {
        return mark;
    }

    public void setMark(long mark) {
        this.mark = mark;
    }
}
