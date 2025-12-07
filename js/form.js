
import { resetEditor } from './image-editor.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const body = document.body;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error'
}, true);

const validateHashtags = (value) => {
  if (value === '') {
    return true;
  }

  const hashtags = value.toLowerCase().split(' ').filter(Boolean);

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

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  'Некорректные хэш-теги. Хэш-тег должен начинаться с #, содержать только буквы и цифры, не повторяться, максимум 5 тегов'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Комментарий не должен превышать 140 символов'
);

const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  uploadCancel.addEventListener('click', closeUploadForm);
  uploadForm.addEventListener('submit', onFormSubmit);

  hashtagInput.addEventListener('keydown', stopPropagation);
  commentInput.addEventListener('keydown', stopPropagation);
};

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  uploadForm.reset();
  uploadFileInput.value = '';

  resetEditor();

  pristine.reset();

  document.removeEventListener('keydown', onDocumentKeydown);
  uploadCancel.removeEventListener('click', closeUploadForm);
  uploadForm.removeEventListener('submit', onFormSubmit);
  hashtagInput.removeEventListener('keydown', stopPropagation);
  commentInput.removeEventListener('keydown', stopPropagation);
};

const onFormSubmit = (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !hashtagInput.matches(':focus') && !commentInput.matches(':focus')) {
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
    openUploadForm();
  });
};

export { initForm, closeUploadForm };
