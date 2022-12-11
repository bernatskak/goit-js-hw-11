import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { loadMoreBtn } from '../index';

const API_KEY = '31859121-159dafa84456e92063f4b1f26';
const BASE_URL = 'https://pixabay.com/api';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    loadMoreBtn.show();

    try {
      loadMoreBtn.disable();
      const promise = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      );

      loadMoreBtn.enable();
      this.incrementPage();

      return promise.data;
    } catch (error) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
