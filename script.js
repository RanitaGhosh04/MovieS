const apiKey = "eed75bee6a801f3222c12fade5b508b1";

const apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${apiKey}`;
const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const main = document.querySelector("#main");
const search = document.querySelector("#search");
const form = document.querySelector("#form");
const tagEl = document.querySelector('#tags');

const prev = document.querySelector('#prev');
const current = document.querySelector('#current');
const next = document.querySelector('#next');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

  var selectedGenre = [];
setGenre();

function setGenre(){
  tagEl.innerHTML = '';
  genres.forEach(genre=>{
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click',()=>{
      if(selectedGenre.length==0){
        selectedGenre.push(genre.id)
      }
      else{
        if(selectedGenre.includes(genre.id)){
          selectedGenre.forEach((id,idx)=>{
            if(id==genre.id){
              selectedGenre.splice(idx,1);
            }
          })
        }

        else{
          selectedGenre.push(genre.id);
        }
      }

      getMovies(apiUrl+ '&with_genres='+ encodeURI(selectedGenre.join(',')));
      highlightSelection();
      console.log(selectedGenre);
    })
    tagEl.append(t);

  })
}

function highlightSelection(){
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag=>{
    tag.classList.remove('highlight');
  })

  clearBtn();
  if(selectedGenre.length!=0){
    selectedGenre.forEach(id=>{
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add('highlight');
    })
  }
  
}

function clearBtn(){
  let clearBtn = document.getElementById('clear');
  if(clearBtn){
    clearBtn.classList.add('highlight');
  }

  else{
    let clear = document.createElement('div');
    clear.classList.add('tag','highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear x';
    clear.addEventListener('click',()=>{
      selectedGenre = [];
      setGenre();

      getMovies(apiUrl);
    })
    tagEl.append(clear);
  }
  }
 
getMovies(apiUrl);

async function getMovies(url) {
  lastUrl = url;
  try {
    const response = await fetch(url);
    const responseData = await response.json();
    console.log(responseData.results);

    if(responseData.results.length!=0){
      showMovies(responseData.results);
      currentPage = responseData.page;
      nextPage = currentPage+1;
      prevPage = currentPage-1;
      totalPages = responseData.total_pages;

      current.innerText = currentPage;
      if(currentPage<=1){
        prev.classList.add('disabled');
        next.classList.remove('disabled');
      }
      else if(currentPage>=totalPages){
        prev.classList.remove('disabled');
        next.classList.add('disabled');
      }
      else{
        prev.classList.remove('disabled');
        next.classList.remove('disabled');
      }

      tagEl.scrollIntoView({behavior: 'smooth'});
    }


    else{
      main.innerHTML = `<h1 class='no-results'>No Results Found<h1>`
    }
   
  } catch (error) {
    console.error(error);
  }
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview,id} = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `

    <img src="${poster_path? IMG_URL + poster_path: 'http://via.placeholder.com/1080x1580'}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>

      <div class="overview">

        <h3>Overview</h3>
        ${overview};
        <br/>
        <button class='know-more' id='${id}'>Know More</button>
      </div>

    `;
    main.appendChild(movieEl);

    document.getElementById(id).addEventListener('click',()=>{
      // console.log(id);
      openNav(movie);
    })
  });
}

const overlayContent = document.querySelector('#overlay-content');
// console.log(overlayContent);
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch('https://api.themoviedb.org/3/movie/' + id + '/videos?language=en-US&api_key=' + apiKey).then(res=>res.json()).then(videoData=>{
    // console.log(videoData);
    if(videoData){
      document.getElementById('myNav').style.width = '100%';
      if(videoData.results.length>0){

        
        var embed = [];
        var dots = [];
        videoData.results.forEach((video,idx)=>{
          let {name,key,site} = video;
          if(site === 'YouTube')
          {
            embed.push(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class='embed hide' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            `)

            dots.push(`
            <span class="dot">${idx + 1}</span>
            `)
          }
         
        })

        var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

        <div class="dots">${dots.join('')}</div>
        
        `

        overlayContent.innerHTML = content;
        
        activeSlide = 0;
        showVideos();

       
      }
      else{
        overlayContent.innerHTML = `<h1 class='no-results'>No Results Found<h1>`
      }
    }
  })
  
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}


var activeSlide = 0;
var totalVideos = 0;
function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag,idx)=>{
    console.log(embedTag);
    if(activeSlide === idx){
      embedTag.classList.add('show');
      embedTag.classList.remove('hide');
    }

    else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show');
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })


}

const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click',()=>{
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }
  showVideos();
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim(); // Trim whitespace from search term

  selectedGenre = [];
  highlightSelection();
  if (searchTerm) {
    const searchQuery = `${searchURL}&query=${searchTerm}`;
    getMovies(searchQuery);
  } else {
    getMovies(apiUrl); // If search term is empty, fetch popular movies
  }
});


next.addEventListener('click',()=>{
  if(nextPage<=totalPages){
    pageCall(nextPage);
  }
})


prev.addEventListener('click',()=>{
  if(prevPage>0){
    pageCall(prevPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[3].split('=');
  if(key[0]!='page'){
    let url = lastUrl+'&page='+page;
    getMovies(url);
  }
  else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[3] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0]+'?'+b;
    getMovies(url);
  }
}