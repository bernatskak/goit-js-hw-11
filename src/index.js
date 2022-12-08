import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import LoadMoreBtn from './js/load-more-btn';

import ImagesApiService from './js/images-service';
import { getRefs } from './js/get-refs';

const refs = getRefs();
export const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  clearGallery();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imagesApiService.query === '') {
    return onError();
  }

  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(renderGallery);
}

function onLoadMore() {
  imagesApiService.fetchImages().then(renderGallery);
}

function galleryTpl(gallery) {
  return gallery
    .map(
      ({
        webformatURL: previewImg,
        largeImageURL: largeImg,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return ` <div class="gallery__item">
      <div class="img-box">
        <a class="gallery__link" href="${largeImg}">
          <img
            class="gallery__image"
            src="${previewImg}"
            alt="Tags: ${tags}"
            loading="lazy"
          />
        </a>
      </div>
      <div class="info">
        ${
          likes
            ? `
        <p class="info-item">
          <b>Likes <span class="img-data">${likes}</span> </b>
        </p>
        `
            : ''
        } ${
          views
            ? `
        <p class="info-item">
          <b>Views <span class="img-data">${views}</span></b>
        </p>
        `
            : ''
        } ${
          comments
            ? `
        <p class="info-item">
          <b>Comments <span class="img-data">${comments}</span></b>
        </p>
        `
            : ''
        } ${
          downloads
            ? `
        <p class="info-item">
          <b>Downloads <span class="img-data">${downloads}</span></b>
        </p>
        `
            : ''
        }
      </div>
    </div>
    `;
      }
    )
    .join('');
}

function renderGallery({ hits: gallery, totalHits }) {
  if (totalHits === 0) {
    loadMoreBtn.hide();
    return onError();
  }
  refs.galleryBox.insertAdjacentHTML('beforeend', galleryTpl(gallery));

  onLightboxActive();
  onSuccess(totalHits);
  if (gallery.length < 40) {
    loadMoreBtn.hide();
    return onSearchEnd();
  }
}

function clearGallery() {
  refs.galleryBox.innerHTML = '';
}

function onError() {
  return Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onSuccess(totalHits) {
  if (refs.galleryBox.childElementCount > 40) {
    onSmoothScroll();
    return;
  }

  return Notify.success(`Hooray! We've found ${totalHits} images`);
}

function onLightboxActive() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function onSmoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')

    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onSearchEnd() {
  return Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}
