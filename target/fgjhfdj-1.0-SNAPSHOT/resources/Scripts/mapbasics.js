import {toggleMap, addMode, addPoints, updatePoints, toggleBar} from './Sidebar.js'


window.addEventListener('DOMContentLoaded', function() {

    ymaps.ready(init);


    var button,
        myMap,
        coords,
        myCollection,
        validMark = false,
        validCoords = false;

    function init() {
        const mapWrapper = document.getElementById('map');
        myMap = new ymaps.Map('map', {
                center: [59.95630987053632,30.311735686398062],
                zoom: 16,
                controls: []
            },
            {
                // Зададим ограниченную область прямоугольником,
                // примерно описывающим Санкт-Петербург.
                balloonMaxWidth: 200,
                restrictMapArea: [
                    [59.838,29.511],
                    [60.056,30.829]
                ]
            }

        );
        // Создадим пользовательский макет ползунка масштаба.
        var ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='blue' id='zoom'> " +
            "<div id='zoom-in' class='btn'><i class='icon-plus'> + </i></div><br>" +
            "<div id='zoom-out' class='btn'><i class='icon-minus'>   - </i></div>" +
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



        //Добавление точек
        myCollection = new ymaps.GeoObjectCollection(null, {
            hasBalloon: false
        });

        addPoints(myMap, myCollection);





        myCollection.events.add('click', (e) =>{
            var target = e.get('target');
            console.log(target);
            if(document.querySelector('#sidebar').classList.contains('show')){
                toggleBar('#sidebar');
            }

            $.ajax({
                url: `point/${target.properties._data.hintContent}`,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    document.querySelector('#discrD').innerHTML = data.discribe;
                    document.querySelector('#discrName').innerHTML = data.name;
                    document.querySelector('#discrTime').innerHTML = data.time;
                    document.querySelector('#discrMark').innerHTML = data.mark + "/10";
                    document.querySelector('#discrType').innerHTML = data.type;
                }
            });

            setTimeout(() => {
                toggleMap(myMap, '#commentBar');
            }, 400);



        });






        myMap.events.add('click', function (e) {

            if (!myMap.balloon.isOpen() && addMode) {
                coords = e.get('coords');
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
            if (e.target.className=="my-button__text") {
                if(document.querySelector('#commentBar').classList.contains('show')){
                    toggleBar('#commentBar');
                }
                setTimeout(() => {
                    toggleMap(myMap, '#sidebar');
                    console.log(addMode);
                }, 400);

            }
        });




        // alert('Content loaded');

        const inputMark = document.getElementById('input_mark');

        inputMark.addEventListener('input', () => {
            if(inputMark.value > 10 || inputMark.value < 0){
                inputMark.style.border="3px solid red";
                validMark = false;
            }
            else{
                inputMark.style.height = "27px";
                inputMark.style.border = "3px solid green";
                validMark = true;
            }
        });

        const forms = document.querySelector("form");

        console.log(forms);
        postPoint(forms);

        function postPoint(form){
            form.addEventListener('submit', (e) =>{
                e.preventDefault();
                // const request  = new XMLHttpRequest();
                // request.open('POST', 'server.php');
                // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                if(validMark && validCoords){
                    const formData =  new FormData(form);

                    const object = {
                    };

                    // alert(coords);
                    console.log(object);

                    formData.forEach(function(value, key){
                        object[key] = value;
                    });

                    const coordinates = {
                        latitude: coords[0],
                        longitude: coords[1]
                    };



                    const addPoint = JSON.stringify(Object.assign(object, coordinates));

                    const pointAded = JSON.parse(addPoint);
                    console.log(addPoint);

                    const newPoint = new ymaps.Placemark([+(pointAded.latitude), +(pointAded.longitude)], {
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


                    updatePoints(myCollection, newPoint);

                    $.ajax({
                        type: "POST",
                        url: 'test',
                        // The key needs to match your method's input parameter (case-sensitive).
                        data: addPoint,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                            console.log("datatatatata=");
                            console.log(data)
                        },
                        error: function(errMsg) {
                            console.log(errMsg);

                        }
                    });
                    form.reset();
                    toggleMap(myMap, "#sidebar");
                }

                else{
                    alert('Заполните корректно форму');
                }
            });
        }
    }
});