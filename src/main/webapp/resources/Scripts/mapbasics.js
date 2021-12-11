
ymaps.ready(init);

var button,
myMap;

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
            restrictMapArea: [
                [59.838,29.511],
                [60.056,30.829]
            ]
        }

        )

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
        });

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
        });

    myMap.controls.add(zoomControl);

    myMap.controls.add(button);


    // var panel = new ymaps.Panel();
    // myMap.controls.add(panel, {
    //     float: 'left'
    // });


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
    //Создание запроса
    const request = new XMLHttpRequest();
    request.open('GET', 'JSONS/points.json');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send();



    //Добавление точек
    var myCollection = new ymaps.GeoObjectCollection(null, {
        hasBalloon: true
    });

    request.addEventListener('load', () => {
        if(request.status === 200) {
            const data = JSON.parse(request.response);

            console.log("succes");
            console.log(data);

            data.points.forEach((point) => {
                console.log(point);

                myCollection.add(new ymaps.Placemark(point.cords, {
                    hintContent: point.hint,
                    baloonContent: point.baloon
                    //balloonContent:
                }, {
                        iconLayout: 'default#image',
                        iconImageHref: 'images/ToiletIcon.png',
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

    myMap.geoObjects.add(myCollection);

    var smallMap = true;
    document.addEventListener("click", function(e) {
        if (e.target.className=="my-button__text") {
            

            smallMap = !smallMap;
            // Добавляем/убираем CSS-класс, определяющий размеры контейнера карты,
            // заданные в абсолютных единицах (300x200 px).
            if (smallMap) {
                $('#sidebar').removeClass('show');
                $('#sidebar').addClass('hide');
                
                setTimeout(() => {    
                $('#map').removeClass('smallMap');
                }, 350);
                
                
                setTimeout(() => {
                    myMap.container.fitToViewport();
                }, 650);
            } else {
                $('#map').addClass('smallMap');
                setTimeout(() => {
                    $('#sidebar').removeClass('hide');
                    $('#sidebar').addClass('show');
                    myMap.container.fitToViewport();
                }, 300);
                
            }
        
            myMap.container.fitToViewport();
            // Если выставлен флаг, сообщаем карте, что ей следует
            // привести свои размеры к размерам контейнера.
        }
      });

}









// 'use strict';

// const inputRub = document.querySelector('#rub'),
//       inputUsd = document.querySelector('#usd');

// inputRub.addEventListener('input', () => {
//     const request = new XMLHttpRequest();

//     request.open('GET', 'js/current.json');
//     request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
//     request.send();

//     request.addEventListener('load', () => {
//         if(request.status === 200) {
//             const data = JSON.parse(request.response);
//             inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2);
//         }
//         else{
//             inputUsd.value = "что-то пошло не так";
//         }
//     });
// });