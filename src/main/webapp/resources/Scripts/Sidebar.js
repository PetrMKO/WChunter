var smallMap = false;

export var addMode = false,
           commentMode = false;

export function toggleBar(id){
    if(id === '#sidebar'){addMode = !addMode;}
    $(id).removeClass('show');
    $(id).addClass('hide');
}
export function toggleMap(map, id){
    if(id === '#sidebar'){addMode = !addMode;}
    smallMap = !smallMap;
    if (!smallMap) {                        //Свернуть
        $(id).removeClass('show');
        $(id).addClass('hide');
        $('coords').removeClass('coordsRed');
        map.balloon.close();
        setTimeout(() => {
            $('#map').removeClass('smallMap');
        }, 350);

        setTimeout(() => {
            map.container.fitToViewport();
        }, 650);
    } else {                                //Развернуть
        $('#map').addClass('smallMap');
        $('#coords').addClass('coordsRed');
        setTimeout(() => {
            $(id).removeClass('hide');
            $(id).addClass('show');
            map.container.fitToViewport();
        }, 300);

    }

}

export function addPoints(map, geoCollection){
    const request = new XMLHttpRequest();
    request.open('GET', 'points');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send();


    request.addEventListener('load', () => {
        if(request.status === 200) {
            const points = JSON.parse(request.response);

            console.log("succes");
            console.log(points);

            points.forEach((point) => {
                console.log(point);

                geoCollection.add(new ymaps.Placemark([+(point.latitude), +(point.longitude)], {
                        hintContent: point.name,
                        balloonContentHeader: point.name
                        // balloonContentBody: point.comment
                        // balloonContentFooter: '<img src="images/cinema.jpeg" height="150" width="200"> <br/> '
                        // baloonContentFooter: '<div class="baloonFooter">ЕУЧЕ<div class="footer1Foto"></div>'+
                        //     '<div class="footer2Foto"></div></div></div>'
                    }, {
                        iconLayout: 'default#image',
                        iconImageHref: '/resources/images/ToiletIcon.png',
                        iconImageSize: [24, 38],
                        iconImageOffset: [-12, -38]
                    })
                );
            });
        }

        else{
            console.log("false");
        }
    });
    map.geoObjects.add(geoCollection);
}

export function updatePoints(geoCollection, point){
    geoCollection.add(point);
}


