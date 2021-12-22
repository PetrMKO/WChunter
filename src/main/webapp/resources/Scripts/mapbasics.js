import {toggleMap, addMode, addPoints, updatePoints, toggleBar, commentMode, closeModal, modal, claim, claimMode, nameError} from '/resources/Scripts/Sidebar.js';
import {upload} from '/resources/Scripts/imageUpload.js';

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
        myMap,
        coords,
        myCollection,
        validMark = false,
        validCoords = false;

    $.get("username")
        .done(function( data ) {
            username = data;
            console.log( "Data Loaded: " + data );
        });

    function init() {
        var geolocation = ymaps.geolocation;
        myMap = new ymaps.Map('map', {
                center: [59.951235204009016,30.304518020247105],
                zoom: 16,
                controls: []
            },
            {
                // Зададим ограниченную область прямоугольником,
                // примерно описывающим Санкт-Петербург.
                balloonMaxWidth: 200,
                restrictMapArea: [[59.79989555713461, 29.583574397792205],[60.109484912314834,30.655513866175998]]
            },
        geolocation.get({
            provider: 'yandex',
            mapStateAutoApply: true
        }).then(function (result) {
            // Красным цветом пометим положение, вычисленное через ip.
            result.geoObjects.options.set('preset', 'islands#redCircleIcon');
            result.geoObjects.get(0).properties.set({
                balloonContentBody: 'Мое местоположение'
            });
            myMap.geoObjects.add(result.geoObjects);
        }),

        geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            // Синим цветом пометим положение, полученное через браузер.
            // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
            result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
            myMap.geoObjects.add(result.geoObjects);
        })
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
                        top: 890/2 -120
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

            ButtonLayout = ymaps.templateLayoutFactory.createClass([
                '<a style="display:block" href="lk">'+
                '<div title="{{ data.title }}" class="my-button"',
                '{% if state.size == "small" %}my-button_small{% endif %}',
                '{% if state.size == "medium" %}my-button_medium{% endif %}',
                '{% if state.size == "large" %}my-button_large{% endif %}',
                '{% if state.selected %} my-button-selected{% endif %}">',
                '<span class="my-button__text" id="my-button__text">{{ data.content }}</span>',
                '</div></a>'
            ].join('')),

            LKbutton = new ymaps.control.Button({
                data: {
                    content: "ЛК",
                    title: "Личный кабинет"
                },
                options: {
                    layout: ButtonLayout,
                    float: "right"
                }
            });


        var center=[];

        $.ajax({
            url: 'currentpoint',
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log(data);
                if (data != null) {

                    document.querySelector('#discrD').innerHTML = data.discribe;
                    document.querySelector('#discrName').innerHTML = data.name;
                    document.querySelector('#discrTime').innerHTML = data.time;
                    document.querySelector('#discrMark').innerHTML = data.mark + "/10";
                    document.querySelector('#discrType').innerHTML = data.type;



                    center[0] = data.latitude;
                    center[1] = data.longitude;
                    console.log(center);
                    for (let obj of data.comment) {
                        $('#comment_pool').append('<div id = `comments${}` class="one_comment">' +
                            `<div id="commentName">${obj.username}</div>:` +
                            `<div id="commentRate">${obj.mark}/10</div>` +
                            `<div class="comment_text comment_text__small">${obj.comment}</div></div>`);
                    }
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
        myMap.controls.add(button);
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

        const photoDiv = document.createElement('div');
        photoDiv.classList.add('comment_photo');

        document.querySelector('.insidebar_close').addEventListener('click', () =>{
            toggleMap(myMap, 'insidebar');
        });

        document.querySelector('.commentbar_close').addEventListener('click', () =>{
            toggleMap(myMap, 'comentBar');
        });

        myCollection.events.add('click', (e) => {
            const target = e.get('target');
            const bar = document.querySelector("#commentBar");
            const namepoint = document.querySelector('#discrName').innerHTML;
            console.log(namepoint)
            console.log(bar);
            console.log(target.properties._data.hintContent);
            console.log(target);
            function getinfo(){
                $.ajax({
                    url: `point/${target.properties._data.hintContent}`,
                    type: 'GET',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        photoDiv.insertAdjacentHTML('afterbegin', `
                                <img class="preview-image" src='/resources/images/toilets/${data.name}.jpeg' alt="Вот как-то так"/>
                            `);

                        console.log(data);
                        document.querySelector('#discrD').innerHTML = data.discribe;
                        document.querySelector('#discrName').innerHTML = data.name;
                        document.querySelector('#discrTime').innerHTML = data.time;
                        document.querySelector('#discrMark').innerHTML = data.mark + "/10";
                        document.querySelector('#discrType').innerHTML = data.type;
                        console.log(data.comment);
                        for (let obj of data.comment) {
                            console.log(obj.username, obj.mark, obj.comment);
                            $('#comment_pool').append('<div id = `comments${}` class="one_comment">' +
                                `<div id="commentName">${obj.username}</div>:` +
                                `<div id="commentRate">${obj.mark}/10</div>` +
                                `<div class="comment_text comment_text__small">${obj.comment}</div></div>`);
                        }
                        document.querySelector('#commentInsideBar').insertAdjacentElement('afterbegin', photoDiv);
                    }
                });
            }


            if(document.querySelector('#sidebar').classList.contains('show_bar')){
                toggleBar('#sidebar');
            }

            if(document.getElementById('commentBar').classList.contains('hide_bar') && !commentMode){
                console.log(1);
                getinfo();
                toggleMap(myMap, '#commentBar');
            }

            else if(target.properties._data.hintContent === namepoint && commentMode){
                console.log(2);
                toggleMap(myMap, '#commentBar');
            }

            else if(target.properties._data.hintContent !== namepoint && commentMode && document.querySelector('#commentBar').classList.contains('show_bar')){
                console.log(3);
                toggleBar('#commentBar');
                getinfo();
                toggleBar('#commentBar');
            }
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
            if (e.target.className==="my-button__text") {
                if(document.querySelector('#commentBar').classList.contains('show_bar')){
                    toggleBar('#commentBar');
                    setTimeout(() => {
                        toggleMap(myMap, '#sidebar');
                        console.log(addMode);
                    }, 400);
                }
                else{
                    toggleMap(myMap, '#sidebar');
                    console.log(addMode);
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

        postPoint(formTable);
        console.log(formTable);
        postPoint(commentForm);
        console.log(commentForm);
        postPoint(claimForm);
        console.log(claimForm);

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

                        newPoint = new ymaps.Placemark([+(pointAded.latitude), +(pointAded.longitude)], {
                            hintContent: pointAded.name,
                            balloonContentHeader: pointAded.name
                            // balloonContentBody: point.comment
                            // balloonContentFooter: '<img src="images/cinema.jpeg" height="150" width="200"> <br/> '
                            // baloonContentFooter: '<div class="baloonFooter">ЕУЧЕ<div class="footer1Foto"></div>'+
                            //     '<div class="footer2Foto"></div></div></div>'
                        }, {
                            iconLayout: 'default#image',
                            iconImageHref: '/resources/images/ToiletIcon.png',
                            iconImageSize: [24, 38],
                            iconImageOffset: [-12, -38]
                        });

                        // document.querySelector(".preview").innerHTML="";
                        // document.querySelector(".preview").classList.add("hide");
                    }
                }


                else if(commentMode) {
                    closeModal(modal);
                    add = JSON.stringify(object);
                    console.log(add);
                    url = `addcomment/${document.querySelector('#discrName').innerHTML}`;

                    console.log(username, object.mark, object.comment);
                    $('#comment_pool').append('<div id = `comments${}` class="one_comment">'+
                        `<div id="commentName">${username}</div>:`+
                        `<div id="commentRate">${object.mark}/10</div>`+
                        `<div class="comment_text comment_text__small">${object.comment}</div></div>`);
                }

                else if(claimMode){
                    closeModal(claim);

                    add = object.claim;
                    console.log(add);
                    url = `complaint/${document.querySelector('#discrName').innerHTML}`;
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
                    }

                });
                form.reset();
            });

        }
    }
});
