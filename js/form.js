import { resetEditor } from './image-editor.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const body = document.body;

let pristine = null;


const validateHashtags = (value) => {

  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.trim().split(' ').filter(tag => tag !== '').map(tag => tag.toLowerCase());

  if (hashtags.length > 5) {
    return false;
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (const hashtag of hashtags) {

    if (!hashtagRegex.test(hashtag)) {
      return false;
    }

    if (hashtag === '#') {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return true;
};

const validateComment = (value) => {
  return value.length <= 140;
};

const initPristine = () => {
  if (typeof Pristine === 'undefined') {
    console.error('Pristine не загружен. Добавьте в HTML:');
    console.error('<script src="https://cdn.jsdelivr.net/npm/pristinejs@0.1.9/dist/pristine.min.js"></script>');
    return false;
  }

  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error'
  }, true);

  pristine.addValidator(
    hashtagInput,
    validateHashtags,
    'Некорректные хэш-теги. Хэш-тег должен начинаться с #, содержать только буквы и цифры (1-19 символов), не повторяться, максимум 5 тегов через пробел'
  );

  pristine.addValidator(
    commentInput,
    validateComment,
    'Комментарий не должен превышать 140 символов'
  );

  return true;
};

const openUploadForm = () => {
  if (!pristine && !initPristine()) {
    console.error('Не удалось инициализировать валидацию');
    return;
  }

  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  uploadCancel.addEventListener('click', closeUploadForm);
  uploadForm.addEventListener('submit', onFormSubmit);

  hashtagInput.addEventListener('keydown', stopPropagation);
  commentInput.addEventListener('keydown', stopPropagation);

  setTimeout(() => hashtagInput.focus(), 100);
};

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  uploadForm.reset();

  uploadFileInput.value = '';

  resetEditor();

  if (pristine) {
    pristine.reset();
  }

  document.removeEventListener('keydown', onDocumentKeydown);
  uploadCancel.removeEventListener('click', closeUploadForm);
  uploadForm.removeEventListener('submit', onFormSubmit);
  hashtagInput.removeEventListener('keydown', stopPropagation);
  commentInput.removeEventListener('keydown', stopPropagation);
};

const onFormSubmit = (evt) => {
  if (!pristine) {
    evt.preventDefault();
    console.error('Валидация не инициализирована');
    return;
  }

  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
    highlightErrors();
  }
};

const highlightErrors = () => {
  const errorElements = uploadForm.querySelectorAll('.img-upload__field-wrapper--error');

  const allWrappers = uploadForm.querySelectorAll('.img-upload__field-wrapper');
  allWrappers.forEach(element => {
    element.style.outline = '';
  });

  errorElements.forEach(element => {
    element.style.outline = '2px solid #ff3333';
    element.style.borderRadius = '4px';
  });

  if (errorElements.length > 0) {
    const firstErrorInput = errorElements[0].querySelector('input, textarea');
    if (firstErrorInput) {
      firstErrorInput.focus();
    }
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' &&
      !hashtagInput.matches(':focus') &&
      !commentInput.matches(':focus')) {
    evt.preventDefault();
    closeUploadForm();
  }
};

const stopPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const initForm = () => {
  uploadFileInput.addEventListener('change', () => {
    if (uploadFileInput.files && uploadFileInput.files[0]) {
      openUploadForm();
    }
  });

  uploadOverlay.addEventListener('click', (evt) => {
    if (evt.target === uploadOverlay) {
      closeUploadForm();
    }
  });
};

export { initForm, closeUploadForm, validateHashtags, validateComment };
