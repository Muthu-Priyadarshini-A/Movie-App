
const moviesContainer = document.getElementById('movies-container');
const infoContainer = document.getElementById('info-container');
const favBtn = document.getElementById('btn-fav');
const favNumber = document.getElementById('number-fav');

//using localStorage
function checkLocalStorage() {

    let localS;
    if(localStorage.getItem('favMovies')==null){
        localS =[];
    }
    else{
        localS = JSON.parse(localStorage.getItem('favMovies'));
    }
    return localS;

}

//add movies to the localstorage
function addLocalStorage(id) {
    let localS;
    localS = checkLocalStorage();
    localS.push(id);
    localStorage.setItem('favMovies', JSON.stringify(localS));
}

//remove movies from local storage
function removeLocalStorage(id) {
    let localS;
    localS = checkLocalStorage();
    localS.forEach((movie, index) => {
        if (movie === id) {
            localS.splice(index, 1);
        }
    });
    localStorage.setItem('favMovies', JSON.stringify(localS));
}

//check the localstorage if any movies present or not and perform appropriate task
function checkLS() {
    let moviesLS;
    moviesLS = checkLocalStorage();
    if(moviesLS.length===0){
        favBtn.classList.remove('enable');
        favNumber.innerHTML = 
        `
        <h4>No movies in the Favorites</h4>
        `
    }
    else{
        favBtn.classList.add('enable')
        favNumber.innerText = moviesLS.length;
    }
    moviesContainer.innerHTML="";
    readLocalStorage(moviesLS);
}

//to render the search result movies on display
function renderSearchResults(movie) {
    moviesContainer.innerHTML +=
        `<div class="movie">
            <div class="img-movie">
                <img src="${movie.Poster}" alt="">
                <button class="view-more" id="${movie.imdbID}">
                <i class="fa-solid fa-circle-info"></i>
                </button>
            </div>
            <div class="text">
                <div class="title">
                    <p>${movie.Title}</p>
                </div>
                <p class="year">${movie.Year} - <span class="type">${movie.Type}</span> </p>
            </div>
            <button class="delete favourite" value="${movie.imdbID}">Remove from favourites <i class="fas fa-heart"></i></button>
        </div>`
}

//get the selected movie by id
async function getMovies(idMovie){
    const response = await fetch(`https://www.omdbapi.com/?i=${idMovie}&apikey=3f48073a`);
    const respMovie = await response.json();
    // console.log(respData);
    if(respMovie.Response === "True"){
        renderSearchResults(respMovie);
    }
}


//read the movies with ids from the localStorage
function readLocalStorage(movies){
    movies.map(movie => getMovies(movie));
}

//get the movies by id
async function getMoviesInfo(idMovie){
    const response = await fetch(`https://www.omdbapi.com/?i=${idMovie}&apikey=3f48073a`);
    const resultInfo = await response.json();
    renderMoviesInfo(resultInfo);
}


//to display more information about the movie with an unique id
function openInfo(e){
    const viewMoreBtn = e.target.parentElement;
    if(viewMoreBtn.classList.contains('view-more')){
        getMoviesInfo(viewMoreBtn.getAttribute("id"));
    }
}


//to display movies information
function renderMoviesInfo(movie) {
    infoContainer.innerHTML = `
    <div class="info-content">
        <div class="close">
            <p class="title">${movie.Title}</p>
            <button class="close-info"><i class="fas fa-times close-button"></i></button>
        </div>
        <div class="info-movie">
            <img src="${movie.Poster}" alt="">

            <p class="genre">${movie.Genre}</p>
            <div class="icons-bar">
                <p><i class="fas fa-clock"></i> ${movie.Runtime}</p>
                <p><i class="fas fa-comments"></i> ${movie.Language}</p>
                <p class="imdbRating"><i class="fab fa-imdb"></i> ${movie.imdbRating}</p>
            </div>
            <div class="info-create-movie">
                <p><span>Director: </span>${movie.Director}</p>
                <p><span>Actors: </span>${movie.Actors}</p>
                <p><span>Writers: </span>${movie.Writer}</p>
                <p><span>About: </span> ${movie.Plot}</p>
            </div>
           
        </div>
    </div>
`;
infoContainer.classList.add('show');
}

//to close the more information about movie screen
function closeInfo(e) {
    if (e.target.classList.contains('close-button') || e.target.classList.contains('close-info')) {
        infoContainer.classList.remove("show");
    }
}

//to remove the movie from the localStorage
function removeFavourites(e) {
    if (e.target.classList.contains('favourite')) {
        removeLocalStorage(e.target.getAttribute('value'));
        infoContainer.classList.remove("show");
        checkLS();
    }
}

//event listeners
document.addEventListener('DOMContentLoaded', checkLS);
moviesContainer.addEventListener('click', openInfo);
document.addEventListener('click', closeInfo);
document.addEventListener('click', removeFavourites);
