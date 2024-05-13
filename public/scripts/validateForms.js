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



// ***************************** Bookmarking JavaScript Code***************************************
console.log('BOOKMARKS AJAX CODE RUNNING')
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


//// ***************************** Editing Reviews AJAX JavaScript Code***************************************
console.log('REVIEWS AJAX CODE RUNNING')


/* <script> */
    const reviewId = document.querySelector('#reviewId').innerText
    const reviewRating = document.querySelector('#reviewRating')
    const updateRating = document.querySelector('#updateRating')
    const ratingDiv = document.querySelector('#ratingDiv')

    const editReview = document.querySelector('#editReview')
    const updateReview = document.querySelector('#updateReview')
    const reviewBody = document.querySelector('#editReviewBody')
    const oldReviewBody = reviewBody.innerHTML
    console.log(reviewId)
    const url = `${reviewBody.baseURI}/reviews/${reviewId}?_method=PUT`
    console.log(url)


    editReview.addEventListener('click', (e)=>{
        if(editReview.innerText == 'Edit'){
            //console.log(reviewId.innerText)
            reviewRating.setAttribute('hidden', 'hidden')
            updateRating.removeAttribute('disabled')
            editReview.innerText = 'Cancel Edit'
            reviewBody.removeAttribute('disabled');
            ratingDiv.removeAttribute('hidden');
            updateReview.removeAttribute('hidden');


            updateReview.addEventListener('click', (e)=>{
                console.log('***********SAVING REVIEW CHANGES******************')

                if (reviewBody.value.length == 0){
                    alert('Review should not be empty')
                }
                else{
                axios.post(url,{
                    body: reviewBody.value,
                    rating: updateRating.value
                }, {
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }})
                location.reload()}

            })
        }
        else{
            reviewBody.value = oldReviewBody
            editReview.innerText = 'Edit'
            reviewBody.disabled = true
            ratingDiv.setAttribute('hidden', 'hidden')
            reviewRating.removeAttribute('hidden')
            updateReview.setAttribute('hidden', 'hidden')

        }
    })

    console.dir(editReview)
// </script>