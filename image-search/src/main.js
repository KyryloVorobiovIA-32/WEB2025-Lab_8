import './styles.css';

/* библиотеки */
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

/* loaders.css (спиннеры) */
import 'loaders.css/loaders.min.css';

import { fetchImages } from './api.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-query');
const galleryEl = document.getElementById('gallery');
const loader = document.getElementById('loader');

let currentLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

function showLoader() {
    loader.classList.remove('is-hidden');
    // добавим внутренний элемент спиннера (используем стили loaders.css)
    loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader loader-balls"></div>
    </div>
  `;
}

function hideLoader() {
    loader.classList.add('is-hidden');
    loader.innerHTML = '';
}

/* создаём карточку по объекту image */
function createCardMarkup(image) {
    const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
    } = image;

    return `
    <li class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${escapeHtml(tags)}" loading="lazy" />
      </a>
      <div class="info">
        <div class="info-item"><span>Likes</span><b>${likes}</b></div>
        <div class="info-item"><span>Views</span><b>${views}</b></div>
        <div class="info-item"><span>Comments</span><b>${comments}</b></div>
        <div class="info-item"><span>Downloads</span><b>${downloads}</b></div>
      </div>
    </li>
  `;
}

/* простая экранировка для alt */
function escapeHtml(str) {
    if (!str) return '';
    return str.replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/* добавление массивом в DOM одной операцией */
function renderGallery(images) {
    const markup = images.map(createCardMarkup).join('');
    // добавляем в конец
    galleryEl.insertAdjacentHTML('beforeend', markup);
    // refresh lightbox
    currentLightbox.refresh();
}

/* обработка сабмита */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();

    if (query === '') {
        iziToast.warning({
            message: 'Please enter a search query',
            position: 'topRight',
        });
        return;
    }

    // очищаем старые результаты
    galleryEl.innerHTML = '';

    showLoader();

    try {
        const data = await fetchImages(query, 1, 40); // page=1, per_page=40

        if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
            iziToast.error({
                message:
                    'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
            });
        } else {
            // рендерим
            renderGallery(data.hits);
        }
    } catch (err) {
        iziToast.error({
            message: `An error occurred: ${err.message}`,
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
});
