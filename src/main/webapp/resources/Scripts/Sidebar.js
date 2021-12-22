var smallMap = false;

const modalTrigger = document.querySelector('[data-modal]'),
      claimTrigger = document.querySelector('[data-claim]'),
      claimCloseBtn = document.querySelector('.claim-close'),
      modalCloseBtn = document.querySelector('[data-close]'),
      favoriteBtn = document.querySelector('.favorite_btn');

export var addMode = false,
    commentMode = false,
    claimMode = false;

export const modal = document.querySelector('.modal'),
    claim = document.querySelector('.claim_modal');


modalTrigger.addEventListener('click', () => {
    openModal(modal);
});

claimTrigger.addEventListener('click', () => {
    console.log('ckiikk');
    openModal(claim);
});
// claimTrigger.addEventListener('click', openModal());


export function closeModal(modalT) {
    modalT.classList.add('hide');
    modalT.classList.remove('show');
    document.body.style.overflow = '';
    if(modalT.classList.contains('claim_modal')){
        claimMode = false;
    }
    else{commentMode = false;}

}

function openModal(modalT) {
    modalT.classList.add('show');
    modalT.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    if(modalT.classList.contains('claim_modal')){
        claimMode = true;
    }
    else{commentMode = true;}
}

modalCloseBtn.addEventListener('click', () =>{
    closeModal(modal);});

claimCloseBtn.addEventListener('click', () =>{
    closeModal(claim);});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        // closeModal();
    }
});

favoriteBtn.addEventListener('click', () =>{

    if(favoriteBtn.classList.contains('favorite_btn1')){

        $.ajax({
            type: "POST",
            url: `deleteFavorites/${document.querySelector('#discrName').innerHTML}`,
            // The key needs to match your method's input parameter (case-sensitive).
            data: '',
            success: function(data){

                console.log(data);
            },
            error: function(errMsg) {
                favoriteBtn.classList.remove('favorite_btn1');
                console.log(errMsg);
            }

        });
    }

    else{
        $.post(`addFavorites/${document.querySelector('#discrName').innerHTML}`, function(data){
            favoriteBtn.classList.add('favorite_btn1');
        });
    }


});

document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
        // closeModal();
    }
});

export function nameError(){
    const nameBusy = document.createElement('div');
    nameBusy.classList.add('busy_block');
    nameBusy.innerText = 'Занято, братан';
    document.querySelector('#name_input_row').insertAdjacentElement('beforebegin', nameBusy);
    console.log('Вроде добавилось');
}

export function toggleBar(id){
    if(id === '#sidebar'){addMode = !addMode;}
    if(id === '#commentBar'){commentMode = !commentMode;}
    $(id).removeClass('show_bar');
    $(id).addClass('hide_bar');
}

export function toggleMap(map, id){

    smallMap = !smallMap;
    if (!smallMap) {                        //Свернуть
        if(id === '#sidebar'){addMode = false;}
        document.querySelector('#comment_pool').innerHTML = '';
        document.querySelector('.comment_photo').innerHTML = '';
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
    } else {
        if(id === '#sidebar'){addMode = true;}//Развернуть
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
