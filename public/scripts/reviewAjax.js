console.log('REVIEWS AJAX CODE RUNNING')
    const currentUser = document.querySelector('#currentUser').innerText
    const reviewId = document.querySelector('#reviewId').innerText
    const reviewRating = document.querySelector('#reviewRating')
    const updateRating = document.querySelector(`#${currentUser}-Rating`)
    const ratingDiv = document.querySelector(`#${currentUser}-Div`)

    const editReview = document.querySelector('#editReview')
    const updateReview = document.querySelector('#updateReview')
    const reviewBody = document.querySelector(`#${currentUser}`)
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
    });