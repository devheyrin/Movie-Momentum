//const MOVIE_API_KEY = "ba56d943ef80bfe382486aeb40a3635a";
const MOVIE_API_KEY = api_keys.MOVIE_API_KEY;

// const MOVIE_TITLE_URL = "https://api.themoviedb.org/3/search/movie?api_key=ba56d943ef80bfe382486aeb40a3635a&language=ko&query='화양연화'";
// ISSUE
// 선택하지 않고 그냥 enter 를 눌렀을 때에는 제목으로 ID를 검색해 이미지 출력하는 문제 해결 

const MOVIETITLE = document.querySelector('#movietitle');
const MOVIEID_KEY = "movie_id";
const movieTitleList = document.querySelector("#movie-list");

function getImgPathArr(event) {
    event.preventDefault();
    const MOVIEID = MOVIETITLE.name;
    console.log(typeof MOVIEID)
    if (MOVIEID === "") {
        console.log(MOVIEID+"is null")
        MOVIEID = getMovieIdByTitle()
    }
    const imgPathArr = [];
    const requestUrl = `https://api.themoviedb.org/3/movie/${MOVIEID}/images?api_key=${MOVIE_API_KEY}`;
    console.log(requestUrl);
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => 
        {
            data.backdrops.forEach(element => {
                imgPathArr.push(element.file_path);
            });
            return imgPathArr;
        })
    .then(data => {
        console.log(data)
        if (data.length !== 0) {
            setBackgroundImg(data);
        }
    }) 
}

function setBackgroundImg(arr) {
    console.log(arr)
    const selectedImg = arr[Math.floor(Math.random()*arr.length)]
    // const herokuUrl = "https://limitless-badlands-18813.herokuapp.com/"
    const requestUrl = "https://image.tmdb.org/t/p/original"+selectedImg;
    const bgImage = document.createElement("img");
    bgImage.classList.add('hidden');
    bgImage.src = requestUrl
    document.body.style.backgroundImage = `linear-gradient( 115deg, rgb(74 74 77), rgb(74 69 104 / 20%) ), url(${requestUrl})`
    document.body.appendChild(bgImage);
}

function getMovieIdByTitle() {
    const movietitle = MOVIETITLE.value;
    const baseUrl = "https://api.themoviedb.org/3/search/movie?"
    const requestUrl = baseUrl+`api_key=${MOVIE_API_KEY}&language=ko&query='${movietitle}'`;
    let result;
    console.log(requestUrl);
    fetch(requestUrl)
    .then(res => res.json())
    .then(data => 
        {   
            console.log(data)
            result = data.results[0].id;
            console.log(result)
            //localStorage.setItem(MOVIEID_KEY, movie_id);
            return result;
        })
}

function getMovieTitleList(event) {
    event.preventDefault();
    const movietitle = MOVIETITLE.value;
    const baseUrl = "https://api.themoviedb.org/3/search/movie?"
    const requestUrl = baseUrl+`api_key=${MOVIE_API_KEY}&language=ko&query='${movietitle}'`;
    console.log(requestUrl);
    fetch(requestUrl)
    .then(res => res.json())
    .then(data => 
        {   
            console.log(data)
            // 영화 제목 리스트 받아오는 테스트 
            let movieList = data.results
            const movieInfoList = [];
            console.log(movieList)
            if (movieList.length !== 0) {
                for (let i = 0; i < movieList.length; i++) {
                    let movieTitle = movieList[i].title;
                    let movieId = movieList[i].id
                    console.log(movieTitle)
                    const movieObj = {
                        title: movieTitle,
                        id: movieId
                    };
                    movieInfoList.push(movieObj);
                }
            }
            console.log(movieInfoList);
            paintMovieTitle(movieInfoList);
            
                //localStorage.setItem(MOVIEID_KEY, movie_id);
        })
}

function paintMovieTitle(movieInfoList) {
    console.log(movieTitleList.querySelectorAll("li"))
    movieTitleList.querySelectorAll("li").forEach(element => element.remove())
    // movieTitleList.forEach(item => console.log(item));
    for (let i = 0; i < movieInfoList.length; i++) {
        console.log(movieInfoList[i].title)
        const li = document.createElement("li");
        li.id = movieInfoList[i].id;
        const span = document.createElement("span");
        span.innerText = movieInfoList[i].title;
        li.appendChild(span);
        movieTitleList.appendChild(li);
        li.addEventListener("click", selectMovie);
    }
    
}

function selectMovie(event) {
    const li = event.target.parentElement;
    MOVIETITLE.value = li.querySelector("span").innerText;
    MOVIETITLE.name = li.id;    
}

const savedMovieId = localStorage.getItem(MOVIEID_KEY);

if (savedMovieId === null) {
    MOVIETITLE.addEventListener("keyup", getMovieTitleList);
    loginForm.addEventListener("submit", getImgPathArr);
} else {
    getImgPathArr(savedMovieId);
}