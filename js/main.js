import { renderPictures, clearPictures } from './pictures.js';
import { initFullscreen } from './fullscreen.js';
import { initForm, closeUploadForm } from './form.js';
import { initImageEditor } from './image-editor.js';
import { loadData } from './api.js';
import { showAlert } from './messages.js';
import { Filters } from './filters.js';

let photos = [];
let filters = null;

const onFilterChange = (filteredPhotos) => {
  clearPictures();
  renderPictures(filteredPhotos);
  initFullscreen(filteredPhotos);
};

const updatePhotos = (newPhoto) => {
  photos.unshift(newPhoto);

  if (filters) {
    filters.destroy();
  }
  filters = new Filters();
  filters.init(photos, onFilterChange);

  onFilterChange(photos);
};

const loadPhotos = async () => {
  try {
    photos = await loadData();

    renderPictures(photos);
    initFullscreen(photos);

    if (photos.length > 0) {
      filters = new Filters();
      filters.init(photos, onFilterChange);
    }

  } catch (error) {
    showAlert('Ошибка загрузки фотографий. Работаем в локальном режиме.');
    console.error('Ошибка загрузки фотографий:', error);
    photos = [];
  } finally {
    initForm(updatePhotos);
  }
};

const initApp = () => {
  initImageEditor();

  loadPhotos();
};

document.addEventListener('click', (evt) => {
  if (evt.target.closest('.success__button')) {
    closeUploadForm();
  }
});

initApp();

const cleanup = () => {
  if (filters) {
    filters.destroy();
  }
};

export { photos, cleanup };
