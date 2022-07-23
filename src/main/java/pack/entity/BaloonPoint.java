package pack.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BaloonPoint {

    @JsonProperty("name")
    private String name;
    @JsonProperty("latitude")
    private Double latitude;
    @JsonProperty("longitude")
    private Double longitude;
    @JsonProperty("mark")
    private int mark;
    @JsonProperty("blime")
    private int blime;


    public int getBlime() {
        return blime;
    }

    public void setBlime(int blime) {
        this.blime = blime;
    }

    public BaloonPoint(String name, Double latitude, Double longitude, int mark) {
        this.mark = mark;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public int getMark() {
        return mark;
    }

    public void setMark(int mark) {
        this.mark = mark;
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
