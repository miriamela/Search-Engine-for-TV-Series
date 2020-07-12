'use strict';

const title=document.querySelector('.js-input');
const searchBtn=document.querySelector ('.js-submit');
const box=document.querySelector ('.js-searchResults');
const fav=document.querySelector('.js-favResults');
const reset=document.querySelector('.js-reset');
//const favTitle=document.querySelector('.js-favTitle');
let series=[];
let favourites=[];
//let eliminate=[];

//LOCAL STORAGE AL ARRANCAR

function renderFavBack() {
    if(localStorage.getItem('favourite-series') !== null){
        favourites = JSON.parse(localStorage.getItem('favourite-series'))
        renderFavourite();
        //favTitle.classList.remove('hidden')
    }else{
        favourites=[];
        //favTitle.classList.remove('hidden');
    }
}
renderFavBack();
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
    series=[]; //hay que limpiar el array o se acumulan objetos a cada serach if you don't reload the page
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

// series
//             .showID     .showTitle     .showImageURL
//       [0]     2938        Dark           pepino.png
//       [1]     123         Dark tables    fksdj.jpg
//       [2]     555         Dexter         dexter.jpg


// eachSeries.showID === parseInt(resultsId)


// favourites
//                  .showID     .showTitle    .showImageURL
//           [0]      2938         Dark         pepino.png

// let favourtiesindex= favourites.findIndex(EachfavID => EachfavID.showID === series[i].showID);
// if(favourtiesindex === -1){
//     console.log("no està")
// }


//PINTAR LAS SERIES

function renderingSeries(){  
    box.innerHTML=''; // eso no funcionaría sin la limpieza del array, a cada search iria acumulando y seguiria pintado el acumulo de todos los searches.
    for (let i=0; i<series.length; i++){
        // const favouriteIndex = favourites.findIndex( eachFav => eachFav.showID === series[i].showID);
        // if( favouriteIndex >= 0 ) {
        //     //Está en fav
        // }
        // else
        // {
        //     // No está en fav
        // }
        let favourtiesindex= favourites.findIndex(EachfavID => EachfavID.showID === series[i].showID);
                if(favourtiesindex >=0){    //ESTE FUNCIONA
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
 //este arriba se puede hace con el ternario, intentarlo!!!
                    //ESTE NO FUNCIONA
                        // if(favourtiesindex === -1){
                        //         box.innerHTML+= `<li class="js-eachSeries eachSeries" series-id="${series[i].showID}">
                        //                             <h2>${series[i].showTitle}</h2>
                        //                             <div class="img_container">
                        //                                 <img src="${series[i].showImageURL}">
                        //                             </div>
                        //                         </li>`
                        // }else{
                        //         const eachSeriesPositive=document.querySelector('.js-eachSeries');
                        //         eachSeriesPositive.classList.add('color');
                        // }

                        //VIEJO RENDER
        // box.innerHTML+= `<li class="js-eachSeries eachSeries" series-id="${series[i].showID}">
        //                         <h2>${series[i].showTitle}</h2>
        //                         <div class="img_container">
        //                             <img src="${series[i].showImageURL}">
        //                         </div>
        //                     </li>`
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
    // }
    renderFavourite()
    localStorage.setItem('favourite-series', JSON.stringify(favourites))
}


//PINTAR FAVORITOS

function renderFavourite(){
    fav.innerHTML=''; 
    //favTitle.classList.remove('hidden');//SIN ESO SE ACUMULAN Y EL SPLICE DE FAVOURITES NO FUNCIONA!!
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

    //eliminatedSeriesIndex
    
    //series.findIndex( eachSeries => eachSeries.showID === )
}

// function reloadOriginalColor(chosenEliminateId){
//     const displayedSeries=box.querySelectorAll('li') //gancho 1 pata coger los li
//     for (let i=0; i<displayedSeries.length; i++){  //recorro los LI
//         let seriesID=displayedSeries[i].getAttribute('series-id') //de los li que recorro me quedo con el series id
//         if (parseInt(seriesID) === parseInt(chosenEliminateId)){
//             displayedSeries[i].classList.remove('color'); //eso ya se ha vuelto un cumulo de elementos de HTML y puedo añadirle clase
//         }
//     }
// }