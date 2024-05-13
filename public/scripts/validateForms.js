// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

console.log('I am running up to here')
const bkmk1 = document.querySelector('#bkmk1');
const bkmk2 = document.querySelector('#bkmk2');


if(bkmk1){
    
    bkmk1.addEventListener('click', (e)=>{
        console.log('I am running bmk1')
        let baseURI = bkmk1.baseURI
        let reqURL = baseURI
        console.log(baseURI)
        reqURL = `${baseURI}/bookmarks`
        bkmk1.innerText = 'Unbookmark'
        console.log(reqURL)
        axios.post(reqURL).then( (res) =>{
            console.log(res.data.isBookmarked)
        })
    });
}
if(bkmk2){
    bkmk2.addEventListener('click', (e)=>{
        console.log('I am running bmk2')
        const bookmarkId= document.querySelector('.bkmk').id
        let baseURI = bkmk2.baseURI
        let reqURL = baseURI
        bkmk2.innerText = 'Bookmark'
        reqURL = `${baseURI}/bookmarks/${bookmarkId}?_method=DELETE`
        console.log(reqURL)
        axios.post(reqURL)
    
    })
}
