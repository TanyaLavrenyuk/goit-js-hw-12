import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let searchQuery = '';
let page = 1;
let totalHits = 0;

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async event => {
  event.preventDefault();

  searchQuery = event.currentTarget.elements['search-text'].value.trim();

  if (searchQuery === '') {
    iziToast.warning({ message: 'Please enter a search term' });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({ message: 'Sorry, no images found. Try again!' });
      return;
    }

    createGallery(data.hits);

    const totalPages = Math.ceil(totalHits / 15);

    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomCenter',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ message: 'Something went wrong!' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    createGallery(data.hits);
    smoothScroll();

    const totalPages = Math.ceil(totalHits / 15);

    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomCenter',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ message: 'Error loading more images!' });
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const card = document.querySelector('.gallery-item');
  if (card) {
    const { height } = card.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  }
}
