import {
    toggleMap,
    addMode,
    addPoints,
    updatePoints,
    toggleBar,
    commentMode,
    closeModal,
    modal,
    claim,
    claimMode,
    nameError,
    comment_modal_mode
} from '/resources/Scripts/Sidebar.js';
import {upload, preview} from '/resources/Scripts/imageUpload.js';

export var imageSrc="";
export function addsrc(img){
    imageSrc = img;
}

window.addEventListener('DOMContentLoaded', function() {

    function setHeiHeight() {
        $('.ramka').css({
            height: $(window).height() + 'px'
        });
    }
    setHeiHeight();
    $(window).resize( setHeiHeight );

    
    ymaps.ready(init);
    
    
    var username,
        role,
        myMap,
        coords,
        myCollection,
        validMark = false,
        validCoords = false;

    console.log($('.button_layout'));

    //[ROLE_USER]
    //[ROLE_MODERATOR]
    //[ROLE_ANONYMOUS]

    function init() {
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('comment_photo');

        var geolocation = ymaps.geolocation;
        myMap = new ymaps.Map('map', {
                center: [59.951235204009016,30.304518020247105],
                zoom: 16,
                controls: ['routeButtonControl', 'geolocationControl']
            },
            // {
            //     // Зададим ограниченную область прямоугольником,
            //     // примерно описывающим Санкт-Петербург.
            //     balloonMaxWidth: 200,
            //     restrictMapArea: [[59.79989555713461, 29.583574397792205],[60.109484912314834,30.655513866175998]]
            // },
        // geolocation.get({
        //     provider: 'yandex',
        //     mapStateAutoApply: true
        // }).then(function (result) {
        //     // Красным цветом пометим положение, вычисленное через ip.
        //     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        //     result.geoObjects.get(0).properties.set({
        //         balloonContentBody: 'Мое местоположение'
        //     });
        //     myMap.geoObjects.add(result.geoObjects);
        // }),

        );
        // Создадим пользовательский макет ползунка масштаба.
        var ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='blue' id='zoom'> " +
            "<div id='zoom-in' class='zoom_btn'><i class='icon-plus'> + </i></div><br>" +
            "<div id='zoom-out' class='zoom_btn'><i class='icon-minus'>   - </i></div>" +
            "</div>", {

                // Переопределяем методы макета, чтобы выполнять дополнительные действия
                // при построении и очистке макета.
                build: function () {
                    // Вызываем родительский метод build.
                    ZoomLayout.superclass.build.call(this);

                    // Привязываем функции-обработчики к контексту и сохраняем ссылки
                    // на них, чтобы потом отписаться от событий.
                    this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                    this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                    // Начинаем слушать клики на кнопках макета.
                    $('#zoom-in').bind('click', this.zoomInCallback);
                    $('#zoom-out').bind('click', this.zoomOutCallback);
                },

                clear: function () {
                    // Снимаем обработчики кликов.
                    $('#zoom-in').unbind('click', this.zoomInCallback);
                    $('#zoom-out').unbind('click', this.zoomOutCallback);

                    // Вызываем родительский метод clear.
                    ZoomLayout.superclass.clear.call(this);
                },

                zoomIn: function () {
                    var map = this.getData().control.getMap();
                    map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
                },

                zoomOut: function () {
                    var map = this.getData().control.getMap();
                    map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
                }
            }),
            zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout,
                    position:{right: 0,
                        top: ($(window).height()/2)-136 + 'px'
                    }}}),
            ButtonLayout = ymaps.templateLayoutFactory.createClass([
                '<div title="{{ data.title }}" class="my-button"',
                '{% if state.size == "small" %}my-button_small{% endif %}',
                '{% if state.size == "medium" %}my-button_medium{% endif %}',
                '{% if state.size == "large" %}my-button_large{% endif %}',
                '{% if state.selected %} my-button-selected{% endif %}">',
                '<span class="my-button__text" id="my-button__text">{{ data.content }}</span>',
                '</div>'
            ].join('')),

            button = new ymaps.control.Button({
                data: {
                    content: "Добавить точку",
                    title: "Добавить"
                },
                options: {
                    layout: ButtonLayout,
                    float: "right"
                }
            }),

            LKButtonLayout = ymaps.templateLayoutFactory.createClass([
                '<a style="display:block" href="lk">'+
                '<div title="{{ data.title }}" class="my-button"',
                '{% if state.size == "small" %}my-button_small{% endif %}',
                '{% if state.size == "medium" %}my-button_medium{% endif %}',
                '{% if state.size == "large" %}my-button_large{% endif %}',
                '{% if state.selected %} my-button-selected{% endif %}">',
                '<span class="my-LK-button__text">{{ data.content }}</span>',
                '</div></a>'
            ].join('')),

            LKbutton = new ymaps.control.Button({
                data: {
                    content: "ЛК",
                    title: "Личный кабинет"
                },
                options: {
                    layout: LKButtonLayout,
                    float: "right"
                }
            });

        geolocation.get({
            provider: 'browser'
            // mapStateAutoApply: true
        }).then(function (result) {
            // Синим цветом пометим положение, полученное через браузер.
            // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
            result.geoObjects.options.set('preset', 'islands#blueCircleIcon');

            var geolocmark = new ymaps.Placemark(result.geoObjects._boundsAggregator._geoBounds[0], {
                hintContent: 'Тут не надо'
                // balloonContentHeader: point.name
                // balloonContentBody: point.comment
                // balloonContentFooter: '<img src="images/cinema.jpeg" height="150" width="200"> <br/> '
                // baloonContentFooter: '<div class="baloonFooter">ЕУЧЕ<div class="footer1Foto"></div>'+
                //     '<div class="footer2Foto"></div></div></div>'
            }, {
                iconLayout: 'default#image',
                iconImageHref: '/resources/images/geolocation_mark.png',
                iconImageSize: [24, 38],
                iconImageOffset: [-12, -38]
            });
            myMap.geoObjects.add(placemark);
            // console.log(result.geoObjects._boundsAggregator._geoBounds[0]);
        })

        var center=[];

        
        
        var control = myMap.controls.get('routePanelControl');
        console.log(control);
        //control.routePanel.state.set({
         // Список всех настроек см. в справочнике.
         // Тип маршрутизации, который будет использоваться по умолчанию.
          //  type: "pedestrian", // пешком
       // });

        
        
        
        
        
        
        
        
        $.get("username")
        .done(function( data ) {
            username = data.login;
            role = data.role;
        
        if(role !== '[ROLE_ANONYMOUS]'){
            myMap.controls.add(button);
        }

        if(role === '[ROLE_ANONYMOUS]'){
            console.log('anon')
            // document.querySelector('.button_layout').innerHTML='';
            document.querySelector('.button_layout').classList.add('hide');
            document.querySelector('.comment_link').innerHTML='';
        }
            console.log( "Data Loaded: ");
            console.log(username);
            console.log(role);
        });
        
        
        
        
        
        
        
        
        



        $.ajax({
            url: 'currentpoint',
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log(data);
                if (data != null) {
                    document.querySelector('.favorite_btn').innerHTML="Добавить в избранное";
                    // console.log(document.querySelector('.favorite_btn'));
                    document.querySelector('.favorite_btn').classList.remove('favorite_btn1');
                    photoDiv.innerHTML = "";
                    document.querySelector('#comment_pool').innerHTML = "";
                    photoDiv.insertAdjacentHTML('afterbegin', `
                                <img class="preview-image" src='${data.img}' alt="Вот как-то так"/>
                            `);
                    document.querySelector('#commentInsideBar').insertAdjacentElement('afterbegin', photoDiv);
                    document.querySelector('#discrD').innerHTML = data.discribe;
                    document.querySelector('#discrName').innerHTML = data.name;
                    document.querySelector('#discrTime').innerHTML = data.time;
                    document.querySelector('#discrMark').innerHTML = data.mark + "/10";
                    document.querySelector('#discrType').innerHTML = data.type;

                    // console.log(data.favorite);

                    if(data.favorite){
                        document.querySelector('.favorite_btn').classList.add('favorite_btn1');
                        document.querySelector('.favorite_btn').innerHTML="Удалить из избранного";
                    }

                    // console.log(center);
                    if(data.comment.length != 0){
                        for (let obj of data.comment) {
                            $('#comment_pool').append('<div id = `comments${}` class="one_comment">' +
                                `<div id="commentName">${obj.username}</div>:` +
                                `<div id="commentRate">${obj.mark}/10</div>` +
                                `<div class="comment_text comment_text__small">${obj.comment}</div></div>`);
                        }
                    }


                    center[0] = data.latitude;
                    center[1] = data.longitude;
                    toggleMap(myMap, '#commentBar');
                    setTimeout(()=>{
                        myMap.panTo(center, {duration: 1000, });
                    }, 500);
                }
            },
            error(errMsg){
            }
        });


        myMap.controls.add(zoomControl);

        myMap.controls.add(LKbutton);
        var mySearchControl = new ymaps.control.SearchControl({
            options: {
                noPlacemark: false,
                searchControlMaxWidth: [30, 72, 500],
                fitMaxWidth: true,
                resultsPerPage: 5,
                provider: 'yandex#search',
                size: 'large',
                position: {
                    right: '40%',
                    top: 0
                }
            }
        });
        myMap.controls.add(mySearchControl, { float: '20' });

        myCollection = new ymaps.GeoObjectCollection(null, {
            hasBalloon: false
        });

        addPoints(myMap, myCollection);

        document.querySelector('.insidebar_close').addEventListener('click', () =>{
            toggleMap(myMap, '#sidebar');
        });

        document.querySelector('.commentbar_close').addEventListener('click', () =>{
            toggleMap(myMap, '#commentBar');
        });

        let currentLatitude, currentLongitude;

        myCollection.events.add('click', (e) => {
            const target = e.get('target');
            const bar = document.querySelector("#commentBar");
            const namepoint = document.querySelector('#discrName').innerHTML;
            console.log(document.querySelector('#sidebar'));

            function getinfo(){
                $.ajax({
                    url: `point/${target.properties._data.hintContent}`,
                    type: 'GET',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        currentLatitude = data.latitude;
                        currentLongitude = data.longitude;
                        document.querySelector('.favorite_btn').innerHTML="Добавить в избранное";
                        document.querySelector('.favorite_btn').classList.remove('favorite_btn1');
                        photoDiv.innerHTML = "";
                        document.querySelector('#comment_pool').innerHTML = "";
                        photoDiv.insertAdjacentHTML('afterbegin', `
                                <img class="preview-image" src='${data.img}' alt="Вот как-то так"/>
                            `);

                        console.log(data);
                        document.querySelector('#discrD').innerHTML = data.discribe;
                        document.querySelector('#discrName').innerHTML = target.properties._data.hintContent;
                        document.querySelector('#discrTime').innerHTML = data.time;
                        document.querySelector('#discrMark').innerHTML = data.mark + "/10";
                        document.querySelector('#discrType').innerHTML = data.type;
                        console.log(data.comment);
                        if(data.comment.length != 0){
                            for (let obj of data.comment) {
                                $('#comment_pool').append('<div id = `comments${}` class="one_comment">' +
                                    `<div id="commentName">${obj.username}</div>:` +
                                    `<div id="commentRate">${obj.mark}/10</div>` +
                                    `<div class="comment_text comment_text__small">${obj.comment}</div></div>`);
                            }
                        }
                        document.querySelector('#commentInsideBar').insertAdjacentElement('afterbegin', photoDiv);

                        console.log(data.favorite);
                        if(data.favorite){
                            document.querySelector('.favorite_btn').classList.add('favorite_btn1');
                            document.querySelector('.favorite_btn').innerHTML="Удалить из избранного";
                        }
                    },
                    error: function (errMsg){
                        document.querySelector('#discrName').innerHTML = target.properties._data.hintContent;
                        document.querySelector('#discrD').innerHTML = target.properties._data.balloonContentHeader;
                        console.log(errMsg);
                    }
                });
            }

            // console.log(namepoint);
            // console.log(bar);
            // console.log(target);
            // console.log(target.properties._data.hintContent);





            if(bar.classList.contains('hide_bar') && !commentMode && document.querySelector('#sidebar').classList.contains('hide_bar')){
                // console.log(1.2);
                getinfo();
                toggleMap(myMap, '#commentBar');
                // console.log(commentMode);
            }
            else if(addMode){
                toggleBar('#sidebar');
                setTimeout(() => {
                    // console.log(1.1);
                    getinfo();
                    toggleBar('#commentBar');
                    // console.log(commentMode);
                }, 300);
            }


            else if(bar.classList.contains('show_bar') && target.properties._data.hintContent === namepoint && commentMode){
                // console.log(2);
                toggleMap(myMap, '#commentBar');
            }

            else if(target.properties._data.hintContent !== namepoint && commentMode && document.querySelector('#commentBar').classList.contains('show_bar')){
                // console.log(3);
                toggleBar('#commentBar');
                getinfo();
                setTimeout(() => {
                    // console.log('развернуть');
                    toggleBar('#commentBar');
                }, 300);

            }
        });

        var control = myMap.controls.get('routeButtonControl');

        const runButton = document.querySelector('.run_button_div');
        runButton.addEventListener('click', ()=>{
            console.log('Побежали')
            // Зададим координаты пункта отправления с помощью геолокации.
            control.routePanel.geolocate('from');
            control.routePanel.state.set({
                // Адрес конечной точки.
                to: [currentLatitude, currentLongitude]
            });
            control.state.set('expanded', true);
        });






        myMap.events.add('click', function (e) {
            // if(e.target.classList.contains("Main")){
            //     toggleMap(myMap, "#commentBar");
            // }

            if (!myMap.balloon.isOpen() && addMode) {
                coords = e.get('coords');
                console.log(coords);
                myMap.balloon.open(coords, {
                    contentHeader:'Событие!',
                    contentBody:'<p>Точка с координатами:</p><p>' + [
                        coords[0].toPrecision(6),
                        coords[1].toPrecision(6)
                    ].join(', ') + ' записана</p>',
                    contentFooter:'<sup>Щелкните еще раз для отмены</sup>'
                });
                validCoords = true;
                $('#coords').addClass('coordsGreen');
            }
            else {
                validCoords = false;
                myMap.balloon.close();
                coords = [];
                $('#coords').removeClass('coordsGreen');
            }
        });


        document.addEventListener("click", function(e) {
            if (e.target.className === "my-button__text") {
                if(document.querySelector('#commentBar').classList.contains('show_bar')){
                    toggleBar('#commentBar');
                    setTimeout(() => {
                        toggleBar('#sidebar');
                        // console.log(addMode);
                    }, 400);
                }
                else{
                    toggleMap(myMap, '#sidebar');
                    // console.log(addMode);
                }


            }
            if (e.target.classList.contains("comment_text")){
                e.target.classList.toggle('comment_text__small');
                e.target.classList.toggle('comment_text__normal');
            }

        });


        upload('#image', '#image_input', {
            multi: false,
            accept: ['.png', '.jpg', '.jpeg', '.gif']
        });

        // alert('Content loaded');

        const inputMark = document.getElementById('input_mark');

        inputMark.addEventListener('input', () => {
            if(addMode){
                if(inputMark.value > 10 || inputMark.value < 0){
                    inputMark.style.border="3px solid red";
                    validMark = false;
                }
                else{
                    inputMark.style.height = "27px";
                    inputMark.style.border = "3px solid green";
                    validMark = true;
                }
            }
        });

        const formTable = document.querySelector("#point_form"),
            commentForm = document.querySelector(".comment_form"),
            claimForm = document.querySelector(".claim_form");

        const input = document.querySelector('#image');
        const openButton = document.querySelector('#image_input');

        postPoint(formTable);
        postPoint(commentForm);
        postPoint(claimForm);

        function newAddPoint(point){
            updatePoints(myCollection, point);
            toggleMap(myMap, "#sidebar");
            validMark=false;
            validCoords= false;

            document.querySelector("#point_form").reset();
            // document.getElementById("image_input").classList.remove("hide");
        }

        function postPoint(form){
            form.addEventListener('submit', (e) =>{
                let newPoint;
                e.preventDefault();
                // const request  = new XMLHttpRequest();
                // request.open('POST', 'server.php');
                // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                const formData =  new FormData(form);
                var add, url;
                const object = {};
                formData.forEach(function(value, key){
                    object[key] = value;
                });

                // console.log(object);
                if(addMode){
                    url='test'
                    if(validMark && validCoords){
                        const coordinates = {
                            latitude: coords[0],
                            longitude: coords[1],
                            img: imageSrc
                        };

                        delete object.photo
                        add = JSON.stringify(Object.assign(object, coordinates));

                        const pointAded = JSON.parse(add);
                        console.log(pointAded);
                        let imageURL = '/resources/images/ToiletIcon.png';
                        if(object.mark < 4){
                            imageURL = '/resources/images/ToiletIconPoop.png';
                        }
                        else if(object.mark > 8) {
                            imageURL = '/resources/images/ToiletIconGold.png';
                        }
                        newPoint = new ymaps.Placemark([+(pointAded.latitude), +(pointAded.longitude)], {
                            hintContent: pointAded.name,
                            balloonContentHeader: pointAded.name
                            // balloonContentBody: point.comment
                            // balloonContentFooter: '<img src="images/cinema.jpeg" height="150" width="200"> <br/> '
                            // baloonContentFooter: '<div class="baloonFooter">ЕУЧЕ<div class="footer1Foto"></div>'+
                            //     '<div class="footer2Foto"></div></div></div>'
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: imageURL,
                            iconImageSize: [24, 38],
                            iconImageOffset: [-12, -38]
                        });

                        preview.innerHTML = "";
                        preview.classList.add('hide');
                        openButton.classList.remove('hide');
                        input.value = "";
                    }
                }

                else if(claimMode){
                    add = object.claim;
                    console.log(add);
                    url = `complaint/${document.querySelector('#discrName').innerHTML}`;
                    closeModal(claim);
                }

                else if(comment_modal_mode) {
                    closeModal(modal);
                    add = JSON.stringify(object);
                    url = `addcomment/${document.querySelector('#discrName').innerHTML}`;
                    console.log(username, object.mark, object.comment);
                    $('#comment_pool').append('<div id = `comments${}` class="one_comment">'+
                        `<div id="commentName">${username}</div>:`+
                        `<div id="commentRate">${object.mark}/10</div>`+
                        `<div class="comment_text comment_text__small">${object.comment}</div></div>`);
                }

                $.ajax({
                    type: "POST",
                    url: url,
                    // The key needs to match your method's input parameter (case-sensitive).
                    data: add,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data){

                        console.log(newPoint);
                    },
                    error: function(errMsg) {
                       if(errMsg.status === 200){
                           newAddPoint(newPoint);
                       }
                       else if(errMsg.status === 400){
                           nameError();
                       }
                       console.log(errMsg)
                    }

                });
                form.reset();
            });

        }
    }
});
