'use strict';

const title=document.querySelector('.js-input');
const searchBtn=document.querySelector ('.js-submit');
const box=document.querySelector ('.js-searchResults');
const fav=document.querySelector('.js-favResults');
const reset=document.querySelector('.js-reset');
let series=[];
let favourites=[];
let eliminate=[];

//LOCAL STORAGE AL ARRANCAR

function renderFavBack() {
    if(localStorage.getItem('favourite-series') !== null){
        favourites = JSON.parse(localStorage.getItem('favourite-series'))
        renderFavourite()
    }
    else{
        favourites=[]
    }
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

//BUSCAR LAS SERIES
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


//PINTAR LAS SERIES

function renderingSeries(){  
    box.innerHTML=''; 
    for (let i=0; i<series.length; i++){
        
        box.innerHTML+= `<li class="js-eachSeries eachSeries" series-id="${series[i].showID}">
                                <h2>${series[i].showTitle}</h2>
                                <div class="img_container">
                                    <img src="${series[i].showImageURL}">
                                </div>
                            </li>`
    }
    addListenerToResults();
}

//si no hay imagen

function replaceImg(show){
    if(show.image !== null){
        return show.image.medium
    }
    else{
        return 'https://via.placeholder.com/210x295/ffffff/666666/?%20text=TV'
    }

}

//ESCUCHAR SERIES ENCONTRADAS

function addListenerToResults(){
    const results= document.querySelectorAll('.js-eachSeries');
        for (let i=0; i<results.length; i++){
        results[i].addEventListener('click', addFav);
        
        }
}

//AÑADIR SERIES ENCONTRADAS EN FAVORITOS
function addFav(event){
    const chosenResults=event.currentTarget;
    const resultsId= chosenResults.getAttribute('series-id');
    let selectedSeries = series.find(eachSeries => eachSeries.showID === parseInt(resultsId)); //voy a buscar el objeto 
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


//PINTAR FAVORITOS

function renderFavourite(){
    fav.innerHTML=''; 
    for (let i=0; i<favourites.length; i++){
        fav.innerHTML+=` <li class="eachFav" series-id="${favourites[i].showID}">
                            <h2 class>${favourites[i].showTitle}</h2>
                            <div class="img_container">
                                <img src="${favourites[i].showImageURL}">
                            </div>
                            <button class="js-eliminateBtn" series-id="${favourites[i].showID}" type="reset">Eliminate</button>
                         </li>`
    }
    
    ListenerEliminate()

}

function ListenerEliminate(){
    
    const eliminateBtn=document.querySelectorAll('.js-eliminateBtn');

    for(let i=0; i<eliminateBtn.length; i++){
        eliminateBtn[i].addEventListener('click', deleteFav)
    }
}
function deleteFav(event){
    event.preventDefault();
    const chosenEliminate= event.currentTarget;
    const chosenEliminateId=chosenEliminate.getAttribute('series-id'); //este valor tiene que estar en el button también....
    console.log(chosenEliminateId);
    //no necesito el .find porque para sacarlo solamente (no pintarlo) solo se necesita su index
    let eliminatedSeriesIndex= favourites.findIndex( eachFav => eachFav.showID ===parseInt(chosenEliminateId));

        favourites.splice(eliminatedSeriesIndex, 1);
        renderFavourite();
        localStorage.setItem('favourite-series', JSON.stringify(favourites));
    
    

}
