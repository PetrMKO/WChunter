var smallMap = false;

const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    export function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        commentMode = false;
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        commentMode = true;
    }
    
    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

export var addMode = false,
           commentMode = false;

export function toggleBar(id){
    if(id === '#sidebar'){addMode = !addMode;}
    $(id).removeClass('show_bar');
    $(id).addClass('hide_bar');
}

export function toggleMap(map, id){
    if(id === '#sidebar'){addMode = !addMode;}
    smallMap = !smallMap;
    if (!smallMap) {                        //Свернуть
        $(id).removeClass('show_bar');
        $(id).addClass('hide_bar');
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
            $(id).removeClass('hide_bar');
            $(id).addClass('show_bar');
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


