'use strict';

const title=document.querySelector('.js-input');
const searchBtn=document.querySelector ('.js-submit');
const box=document.querySelector ('.js-searchResults');
const fav=document.querySelector('.js-favResults');
const reset=document.querySelector('.js-reset');
//const favTitle=document.querySelector('.js-favTitle');
let series=[];
let favourites=[];

//LOCAL STORAGE action when loading page

function renderFavBack() {
    if(localStorage.getItem('favourite-series') !== null){
        favourites = JSON.parse(localStorage.getItem('favourite-series'))
        renderFavourite()
    }
    // else{
    //     favourites=[]
    // }
}
renderFavBack()

//RESET SEARCH RESULTS

function resetSearch(){
    box.innerHTML='';
    title.value='';
    series=[];
    //renderingSeries();
}

reset.addEventListener('click', resetSearch);

//SEARCHING SERIES
function searchSeries(ev){
    series=[]; 
    ev.preventDefault();
    fetch(`http://api.tvmaze.com/search/shows?q=${title.value}`)
        .then(response => response.json())
        .then(data =>{
            for (let i=0; i<data.length; i++){
            const show= data[i].show;
            const showImgURL= replaceImg(show);
            
            series.push({showID: show.id, showTitle: show.name, showImageURL: showImgURL})  
            }  
            renderingSeries();  
        })
}
searchBtn.addEventListener('click', searchSeries);


//DISPLAY SERIES

function renderingSeries(){  
    box.innerHTML=''; 
    for (let i=0; i<series.length; i++){
        let favourtiesindex= favourites.findIndex(EachfavID => EachfavID.showID === series[i].showID);
                if(favourtiesindex >=0){    //ESTE FUNCIONA PERO NO ESTÁ EN LA MASTER
                    box.innerHTML+= `<li class="js-eachSeries eachSeries color" series-id="${series[i].showID}">
                                        <h2>${series[i].showTitle}</h2>
                                        <div class="img_container">
                                            <img src="${series[i].showImageURL}">
                                        </div>
                                    </li>`
                }
                else{
                    box.innerHTML+= `<li class="js-eachSeries eachSeries" series-id="${series[i].showID}">
                                        <h2>${series[i].showTitle}</h2>
                                        <div class="img_container">
                                            <img src="${series[i].showImageURL}">
                                        </div>
                                    </li>`
                        }
        
    //     box.innerHTML+= `<li class="js-eachSeries eachSeries" series-id="${series[i].showID}">
    //                             <h2>${series[i].showTitle}</h2>
    //                             <div class="img_container">
    //                                 <img src="${series[i].showImageURL}">
    //                             </div>
    //                         </li>`
     }
    addListenerToResults();
}

//IF THERE IS NO IMAGE

function replaceImg(show){
    if(show.image !== null){
        return show.image.medium
    }
    else{
        return 'https://via.placeholder.com/210x295/ffffff/666666/?%20text=TV'
    }

}

//LISTENING TO SERIES

function addListenerToResults(){
    const results= document.querySelectorAll('.js-eachSeries');
        for (let i=0; i<results.length; i++){
        results[i].addEventListener('click', addFav);
        
        }
}

//ADD SERIES TO FAVOURITES 
function addFav(event){
    const chosenResults=event.currentTarget;
    const resultsId= chosenResults.getAttribute('series-id');
    let selectedSeries = series.find(eachSeries => eachSeries.showID === parseInt(resultsId)); //voy a buscar el objeto 
    //recorreme el array series y recogeme los objetos (eachseries) que tengan el campo.showID populated with the number coming from the get attribute.
    let selectedSeriesIndex=  favourites.findIndex(eachSeries => eachSeries.showID  === parseInt(resultsId)); //voy a buscar el index del objeto de arriba (coinciden atravez del resultsId)

        if (selectedSeriesIndex === -1){
            chosenResults.classList.add('color');
            favourites.push(selectedSeries);

        }
        else{
            chosenResults.classList.remove('color');
            favourites.splice(selectedSeriesIndex, 1);

        }
    
    renderFavourite()
    localStorage.setItem('favourite-series', JSON.stringify(favourites))
}


//DISPLAY FAVOURITES 

function renderFavourite(){
    fav.innerHTML=''; 
    for (let i=0; i<favourites.length; i++){
        fav.innerHTML+=` <li class="eachFav" series-id="${favourites[i].showID}">
                            <h2 class>${favourites[i].showTitle}</h2>
                            <div class="img_container">
                                <img src="${favourites[i].showImageURL}">
                            </div>
                            <button class="js-eliminateBtn eliminateBtn" series-id="${favourites[i].showID}" type="reset">Eliminate</button>
                         </li>`
    }
    
    ListenerEliminate()

}

 // LISTENING TO ELIMINATE FAVOURITE BTN

function ListenerEliminate(){
    
    const eliminateBtn=document.querySelectorAll('.js-eliminateBtn'); //this is the array of buttons

    for(let i=0; i<eliminateBtn.length; i++){
        eliminateBtn[i].addEventListener('click', deleteFav)
    }
}

// DELETE 

function deleteFav(event){
    event.preventDefault();
    //favTitle.classList.add('hidden');
    const chosenEliminate= event.currentTarget;
    const chosenEliminateId=chosenEliminate.getAttribute('series-id'); //este valor tiene que estar en el button también....
    console.log(chosenEliminateId);
    //no necesito el .find porque para sacarlo solamente (no pintarlo) solo se necesita su index
    let eliminatedSeriesIndex= favourites.findIndex( eachFav => eachFav.showID ===parseInt(chosenEliminateId));
    favourites.splice(eliminatedSeriesIndex, 1);
    renderFavourite();
    localStorage.setItem('favourite-series', JSON.stringify(favourites));
    //reloadOriginalColor(chosenEliminateId)
    renderingSeries()

    favourites.splice(eliminatedSeriesIndex, 1);
    renderFavourite();
    localStorage.setItem('favourite-series', JSON.stringify(favourites));
     
    renderingSeries() //ESTO FUNCIONA NO ESTÀ EN LA MASTER
    // changeColorSeries(chosenEliminateId)
}

//PAINT THE OBJECT WITH THE ORIGINAL COLOUR 

// function changeColorSeries(chosenEliminateId) {
//     const showingSeries=box.querySelectorAll('li'); //form un array con los li que tengo en series

//     for (let i=0; i<showingSeries.length; i++){ //recorro el array para sacarle el valor dentro del artibuto ID
//         let showingSeriesID= showingSeries[i].getAttribute('series-id');
//         if (parseInt(showingSeriesID) === parseInt(chosenEliminateId)) { //el valor de los atributos con el valor de los atributos eliminados de favoritos 
//             showingSeries[i].classList.remove('color') // a los que tiene el mismo valor le saco el color.
//         }
//     }
// }
