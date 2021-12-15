window.addEventListener('DOMContentLoaded', function() {


    alert('Content loaded');
    const forms = document.querySelectorAll('form');

    forms.forEach(item =>{
        postData(item);
    });

    function postData(form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();
            const request  = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData =  new FormData(form);

            const object = {
                coords: coords.background
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

            console.log(addPoint);

        $.ajax({
            type: "POST",
            url: "test",
            // The key needs to match your method's input parameter (case-sensitive).
            data: addPoint,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){alert(data);},
            error: function(errMsg) {
                alert(errMsg);
            }
        });
        //
        // request.send(addPoint);                         //А тут отправляется на сервер json
        //
        // request.addEventListener('load', () =>{
        //     if(request.status === 200){
        //         console.log(request.response);
        //         form.reset();
        //     }
        //     else{
        //         alert(request.status);
        //     }
        // });
        });
    }
});
