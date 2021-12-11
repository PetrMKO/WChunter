window.addEventListener('DOMContentLoaded', function() {

    alert('Content loaded');
    const forms = document.querySelectorAll('form');

    forms.forEach(item =>{     //тут добавляю обработчик событий всем формам
        postData(item);
    });

   function postData(form){
    form.addEventListener('submit', (e) =>{
        e.preventDefault();

        $.ajax({
            url: 'test',
            method: 'post',
            data: {text: 'Текст'},
            success: function(data){
                alert(data);
            }
        });

        const request  = new XMLHttpRequest();      // создаю объект для POST запроса
        request.open('POST', '/test');         // настраиваю этот объект, тип POST и адресс сервера

        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');    // тут тип контента, что это json и кодировка
        const formData =  new FormData(form);       //это объект для контента из формы

        const object = {};                           //это
        formData.forEach(function(value, key){       // и это, обрабочтик костыля js, не образай внимания
            object[key] = value;                     // по сути заполняю объект данными из формы, название инпута это key, 
        });                      
        alert(object.photo);                    // а value это то, что там написано и получается объект с полями типа name: "PETR", вот

        const addPoint = JSON.stringify(object);        //тут создается JSON из object

        console.log(addPoint);

        request.send(addPoint);                         //А тут отправляется на сервер json

        request.addEventListener('load', () =>{
            if(request.status === 200){
                console.log(request.response);
                form.reset();
            }
            else{
                alert(request.status);
            }
        });
    });
}
});
