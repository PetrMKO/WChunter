package pack.entity;


import javax.persistence.*;

@Entity
public class ToiletIMGEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Lob
    private byte[] image;


    public ToiletIMGEntity() {
    }

    public byte[] getImage() {
        return image;
    }



    public void setImage(byte[] image) {
        this.image = image;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
