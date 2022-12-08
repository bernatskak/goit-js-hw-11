import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { loadMoreBtn } from '../index';

const API_KEY = '31477938-fd248c01ea14c0dbe5bfc1d84';
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
      const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
      const response = await axios.get(url);

      loadMoreBtn.enable();
      this.incrementPage();

      return response.data;
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
