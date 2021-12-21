import {addsrc} from '/resources/Scripts/mapbasics.js';
export function upload(selector, butttonSelector, options = {}){

    const input = document.querySelector(selector);
    const openButton = document.querySelector(butttonSelector);
    const preview = document.createElement('div');

    if(options.multi){
        input.setAttribute('multiple', true);
    }

    if(options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','));
    }


    input.insertAdjacentElement('afterend', preview);

    const triggerInput = () => input.click();

    const changeHandler = event => {
        // if(!event.target.files.length){
        //     return;
        // }

        console.log(event.target.files);
        const files = Array.from(event.target.files);

        preview.innerHTML = '';
        // files.forEach(file =>{
        //     if(!file.type.match('image')){
        //         return;
        //     }

        const reader = new FileReader();

        reader.onload = event => {
            const src = event.target.result;
            addsrc(src);
            preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image" style="background-image: url('${src}');">
                        <div class="preview-remove" ">&times;</div>
                   
                        <div class="preview-info">
                            <span>${files[0].name}</span>
                            ${files[0].size}
                        </div>
                    </div>
                `);
        };

        reader.readAsDataURL(files[0]);
        preview.classList.remove('hide');
        openButton.classList.add('hide');
        preview.classList.add('preview');
        // });

    };

    preview.addEventListener('click', e => {
        if(e.target.classList.contains('preview-remove')){
            preview.innerHTML = "";
            preview.classList.add('hide');
            openButton.classList.remove('hide');
            input.value = "";
        }
    });
    openButton.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
}