import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPictures, PER_PAGE } from './js/fetch';

let userSearch;
let page = 1;
let lightbox = new SimpleLightbox('.gallery a');

const form = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
console.dir(form);

form.addEventListener('submit', onSearchBtn);
loadBtn.addEventListener('click', onLoadBtn);

console.log(gallery);

loadBtn.classList.replace('load-more', 'load-more-hidden');

function onSearchBtn(e) {
  e.preventDefault();
  userSearch = e.target.elements.searchQuery.value;
  clearData();

  getPictures(userSearch)
    .then(data => {
      const pages = Math.ceil(data.totalHits / PER_PAGE);
      console.log(pages);
      console.log(data.totalHits);
      if (!data.totalHits) {
        Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        loadBtn.classList.replace('load-more', 'load-more-hidden');
        return;
      }

      if (data.totalHits) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      gallery.insertAdjacentHTML('beforeend', createMarkUp(data.hits));

      loadBtn.classList.replace('load-more-hidden', 'load-more');

      scroll();

      if (page === 1) {
        lightbox.refresh();

        console.log(lightbox.refresh());
      }
    })
    .catch(error => console.log(error));
}

function onLoadBtn() {
  page += 1;

  getPictures(page).then(data => {
    const pages = Math.ceil(data.totalHits / PER_PAGE);
    gallery.insertAdjacentHTML('beforeend', createMarkUp(data.hits));
    lightbox.refresh();
    scroll();

    if (page >= pages) {
      loadBtn.classList.replace('load-more', 'load-more-hidden');
    }
  });
}

function createMarkUp(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        ` 
         <div class="photo-card">
         <a href="${largeImageURL}">
         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
         <div class="info">
         <p class="info-item">
         <b>Likes:<span> ${likes} </span></b>
         </p>
        <p class="info-item">
        <b>Views:<span> ${views} </span></b>
        </p>
        <p class="info-item">
         <b>Comments: <span> ${comments}</span></b>
        </p>
        <p class="info-item">
         <b>Downloads:<span>${downloads}</span></b>
        </p>
        </div>
        </a>
        </div>`
    )
    .join('');
}

function clearData() {
  gallery.innerHTML = '';
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
