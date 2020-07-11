'use strict';

const title=document.querySelector('.input');
const searchBtn=document.querySelector ('.submit');
const box=document.querySelector ('.box');
const fav=document.querySelector('.fav');
let series=[];
let favourites=[];

//BUSCAR LAS SERIES
function searchSeries(ev){
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
    box.innerHTML=''; //SIN ESO SE ACUMULAN Y NUNCA SE CANCELAN EN LA PAGINA
    for (let i=0; i<series.length; i++){
        box.innerHTML+= `<li class="eachSeries" series-id="${series[i].showID}">
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
        return 'https://www.ondarock.it/images/cover/handhabits-placeholder_1553080372.jpg'
    }

}

//ESCUCHAR SERIES ENCONTRADAS

function addListenerToResults(){
    const results= document.querySelectorAll('.eachSeries');
        for (let i=0; i<results.length; i++){
        results[i].addEventListener('click', addFav);
         
        }
}
//AÑADIR SERIES ENCONTRADAS EN FAVORITOS
function addFav(event){
    const chosenResults=event.currentTarget;
    const resultsId= chosenResults.getAttribute('series-id');
    let selectedSeries = series.find(eachSeries => eachSeries.showID === parseInt(resultsId));
    let selectedSeriesIndex=  favourites.findIndex(eachSeries => eachSeries.showID  === parseInt(resultsId));

    if (selectedSeriesIndex === -1){
        chosenResults.classList.add('color');
        favourites.push(selectedSeries);
   
    }
    else{
        chosenResults.classList.remove('color');
        favourites.splice(selectedSeriesIndex, 1);

    }
    renderFavourite()
    //aqui hay que poner el local storage
}

//PINTAR FAVORITOS

function renderFavourite(){
    fav.innerHTML=''; //SIN ESO SE ACUMULAN Y EL SPLICE DE FAVOURITES NO FUNCIONA!!
    for (let i=0; i<favourites.length; i++){
        fav.innerHTML+=`<li class="eachFav" series-id="${favourites[i].showID}">
                            <h2 class>${favourites[i].showTitle}</h2>
                            <div class="img_container">
                                <img src="${favourites[i].showImageURL}">
                            </div>
                        </li>`
    }
}