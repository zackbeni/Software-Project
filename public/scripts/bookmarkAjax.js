// ***************************** Bookmarking Ajax JavaScript Code***************************************
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