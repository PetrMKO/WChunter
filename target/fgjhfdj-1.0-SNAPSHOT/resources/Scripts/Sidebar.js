window.addEventListener('DOMContentLoaded', function() {

    alert('Content loaded');
    const forms = document.querySelectorAll('form');

    forms.forEach(item =>{
        postData(item);
    });

    function postData(form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();
            // const request  = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            //
            // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData =  new FormData(form);

            const object = {
            };

            alert(coords);
            console.log(object);
            formData.forEach(function(value, key){
                object[key] = value;
            });

            const coordinates = {
                Lat: coords[0],
                Long: coords[1]
            };



            const addPoint = JSON.stringify(Object.assign(object, coordinates));

            const pointAded = JSON.parse(addPoint);
            console.log(addPoint);

            $.ajax({
                type: "POST",
                url: "test",
                // The key needs to match your method's input parameter (case-sensitive).
                data: addPoint,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    alert(data);
                    myMap.geoObjects.remove(myCollection)
                    myCollection.add(new ymaps.Placemark([+(pointAded.latitude), +(pointAded.longitude)], {
                            hintContent: pointAded.name,
                            balloonContentHeader: pointAded.name
                            // balloonContentBody: point.comment
                            // balloonContentFooter: '<img src="images/cinema.jpeg" height="150" width="200"> <br/> '
                            // baloonContentFooter: '<div class="baloonFooter">ЕУЧЕ<div class="footer1Foto"></div>'+
                            //     '<div class="footer2Foto"></div></div></div>'
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: 'resources/images/ToiletIcon.png',
                            iconImageSize: [24, 38],
                            iconImageOffset: [-12, -38]
                        })
                    );
                    myMap.geoObjects.add(myCollection);
                },
                error: function(errMsg) {
                    alert(errMsg);
                }
            });
            window.location.reload();
            smallMap = !smallMap
            $('#sidebar').removeClass('show');
            $('#sidebar').addClass('hide');
            addMode = false;
            myMap.balloon.close();
            setTimeout(() => {
                $('#map').removeClass('smallMap');
            }, 350);

            setTimeout(() => {
                myMap.container.fitToViewport();
            }, 650);

        });
    }
});