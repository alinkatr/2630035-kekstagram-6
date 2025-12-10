// form.js
import { resetEditor } from './image-editor.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const body = document.body;

let pristine = null;

// Правила валидации хэш-тегов
const validateHashtags = (value) => {
  // Если поле пустое - разрешаем
  if (value.trim() === '') {
    return true;
  }

  // Разбиваем на теги, фильтруем пустые и приводим к нижнему регистру
  const hashtags = value.trim().split(' ').filter(tag => tag !== '').map(tag => tag.toLowerCase());

  // Проверка количества хэш-тегов
  if (hashtags.length > 5) {
    return false;
  }

  // Регулярное выражение для проверки формата хэш-тега
  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  // Проверка каждого хэш-тега
  for (const hashtag of hashtags) {
    // Проверка формата
    if (!hashtagRegex.test(hashtag)) {
      return false;
    }

    // Дополнительная проверка, что не только решётка
    if (hashtag === '#') {
      return false;
    }
  }

  // Проверка на уникальность
  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return true;
};

// Правила валидации комментария
const validateComment = (value) => {
  return value.length <= 140;
};

// Инициализация Pristine
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

  // Добавляем валидаторы к полям
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

// Открытие формы загрузки
const openUploadForm = () => {
  // Инициализируем Pristine при первом открытии формы
  if (!pristine && !initPristine()) {
    console.error('Не удалось инициализировать валидацию');
    return;
  }

  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  // Добавляем обработчики событий
  document.addEventListener('keydown', onDocumentKeydown);
  uploadCancel.addEventListener('click', closeUploadForm);
  uploadForm.addEventListener('submit', onFormSubmit);

  // Отмена закрытия по Esc при фокусе на полях ввода
  hashtagInput.addEventListener('keydown', stopPropagation);
  commentInput.addEventListener('keydown', stopPropagation);

  // Фокусируемся на первом поле после открытия
  setTimeout(() => hashtagInput.focus(), 100);
};

// Закрытие формы загрузки
const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  // Сбрасываем форму
  uploadForm.reset();

  // Очищаем поле выбора файла
  uploadFileInput.value = '';

  // Сбрасываем редактор изображения
  resetEditor();

  // Сбрасываем ошибки валидации
  if (pristine) {
    pristine.reset();
  }

  // Удаляем все обработчики событий
  document.removeEventListener('keydown', onDocumentKeydown);
  uploadCancel.removeEventListener('click', closeUploadForm);
  uploadForm.removeEventListener('submit', onFormSubmit);
  hashtagInput.removeEventListener('keydown', stopPropagation);
  commentInput.removeEventListener('keydown', stopPropagation);
};

// Обработка отправки формы
const onFormSubmit = (evt) => {
  if (!pristine) {
    evt.preventDefault();
    console.error('Валидация не инициализирована');
    return;
  }

  // Проверяем валидность формы
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
    // Фокусируемся на первом поле с ошибкой
    highlightErrors();
  }
};

// Подсветка полей с ошибками
const highlightErrors = () => {
  const errorElements = uploadForm.querySelectorAll('.img-upload__field-wrapper--error');

  // Сначала сбрасываем все подсветки
  const allWrappers = uploadForm.querySelectorAll('.img-upload__field-wrapper');
  allWrappers.forEach(element => {
    element.style.outline = '';
  });

  // Подсвечиваем поля с ошибками
  errorElements.forEach(element => {
    element.style.outline = '2px solid #ff3333';
    element.style.borderRadius = '4px';
  });

  // Фокусируемся на первом поле с ошибкой
  if (errorElements.length > 0) {
    const firstErrorInput = errorElements[0].querySelector('input, textarea');
    if (firstErrorInput) {
      firstErrorInput.focus();
    }
  }
};

// Обработка нажатия клавиши Esc
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' &&
      !hashtagInput.matches(':focus') &&
      !commentInput.matches(':focus')) {
    evt.preventDefault();
    closeUploadForm();
  }
};

// Остановка всплытия события Esc при фокусе на полях ввода
const stopPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

// Инициализация всей формы
const initForm = () => {
  uploadFileInput.addEventListener('change', () => {
    // Проверяем, выбран ли файл
    if (uploadFileInput.files && uploadFileInput.files[0]) {
      openUploadForm();
    }
  });

  // Добавляем обработчик для закрытия по клику на оверлей (опционально)
  uploadOverlay.addEventListener('click', (evt) => {
    if (evt.target === uploadOverlay) {
      closeUploadForm();
    }
  });
};

// Экспортируем функции для использования в других модулях
export { initForm, closeUploadForm, validateHashtags, validateComment };
