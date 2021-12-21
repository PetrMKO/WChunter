package pack.entity;


import com.fasterxml.jackson.annotation.JsonProperty;

public class NewJsonpoint {

    @JsonProperty("name")
    private String name;
    @JsonProperty("startWork")
    private String startWork;
    @JsonProperty("endTime")
    private String endTime;
    @JsonProperty("mark")
    private int mark;
    @JsonProperty("type")
    private String type;
    @JsonProperty("comment")
    private String comment;
    @JsonProperty("latitude")
    private Double Lat;
    @JsonProperty("longitude")
    private Double Long;
    @JsonProperty("img")
    private String Photo;


    public String getPhoto() {
        return Photo;
    }

    public void setPhoto(String photo) {
        Photo = photo;
    }

    public NewJsonpoint(String name, String startWork, String endTime, int mark, String type, String comment, Double lat, Double Long, String img) {
        this.name = name;
        this.startWork = startWork;
        this.endTime = endTime;
        this.mark = mark;
        this.type = type;
        this.comment = comment;
        this.Lat = lat;
        this.Long = Long;
        this.Photo = img;
    }

    public NewJsonpoint() {
    }




    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartWork() {
        return startWork;
    }

    public void setStartWork(String startWork) {
        this.startWork = startWork;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public int getMark() {
        return mark;
    }

    public void setMark(int mark) {
        this.mark = mark;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Double getLat() {
        return Lat;
    }

    public void setLat(Double lat) {
        Lat = lat;
    }

    public Double getLong() {
        return Long;
    }

    public void setLong(Double aLong) {
        Long = aLong;
    }


    @Override
    public String toString() {
        return "NewJsonpoint{" +
                "name='" + name + '\'' +
                ", startWork='" + startWork + '\'' +
                ", endTime='" + endTime + '\'' +
                ", mark=" + mark +
                ", type='" + type + '\'' +
                ", comment='" + comment + '\'' +
                ", Lat=" + Lat +
                ", Long=" + Long +
                ", Photo='" + Photo + '\'' +
                '}';
    }
}
