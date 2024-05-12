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
// const bkmk = document.querySelector('#bookmark');
// const baseURI = bkmk.baseURI
// let reqURL = baseURI
// const body = document.querySelector('body')
// let isBookmarked = false
// bkmk.addEventListener('click', (e)=>{
//     if(bkmk.innerText == 'Bookmark'){
//         reqURL = `${baseURI}/bookmark/true`
//         bkmk.innerText = 'Unbookmark'
//         console.log(reqURL)
//         axios.post(reqURL)
//     }else{
//         bkmk.innerText = 'Bookmark'
//         reqURL = `${baseURI}/bookmark/false`
//         axios.post(reqURL)
//     }

// })