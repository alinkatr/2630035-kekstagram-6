import { isEscapeKey } from './util.js';

const uploadForm = document.querySelector('#upload-select-image');
const scaleControlValue = uploadForm.querySelector('.scale__control--value');
const imagePreview = uploadForm.querySelector('.img-upload__preview img');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectsList = uploadForm.querySelector('.effects__list');
const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;
const SCALE_STEP = 25;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'grayscale',
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: 'sepia',
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    filter: 'invert',
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
    filter: 'blur',
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
    filter: 'brightness',
  },
};

let currentEffect = 'none';

const updateScale = (value) => {
  const percentage = `${value}%`;
  scaleControlValue.value = percentage;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

const onScaleBiggerClick = () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

const updateEffectSlider = (effect) => {
  const effectConfig = EFFECTS[effect];

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: effectConfig.min,
        max: effectConfig.max,
      },
      start: effectConfig.max,
      step: effectConfig.step,
    });
  }
};

const onEffectSliderUpdate = () => {
  if (!effectLevelSlider.noUiSlider) {
    return;
  }

  const sliderValue = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = sliderValue;

  if (currentEffect !== 'none') {
    const effectConfig = EFFECTS[currentEffect];
    imagePreview.style.filter = `${effectConfig.filter}(${sliderValue}${effectConfig.unit})`;
  }
};

const onEffectChange = (evt) => {
  if (evt.target.type === 'radio') {
    currentEffect = evt.target.value;

    imagePreview.className = '';
    imagePreview.classList.add(`effects__preview--${currentEffect}`);

    if (currentEffect === 'none') {
      imagePreview.style.filter = 'none';
      effectLevelContainer.classList.add('hidden');
    } else {
      effectLevelContainer.classList.remove('hidden');
      updateEffectSlider(currentEffect);
      onEffectSliderUpdate();
    }
  }
};

const createEffectSlider = () => {
  if (!effectLevelSlider.noUiSlider) {
    noUiSlider.create(effectLevelSlider, {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
      connect: 'lower',
      format: {
        to: (value) => Number.isInteger(value) ? value : value.toFixed(1),
        from: (value) => parseFloat(value),
      },
    });

    effectLevelSlider.noUiSlider.on('update', onEffectSliderUpdate);
  }

  effectLevelContainer.classList.add('hidden');
};

const resetEditor = () => {
  updateScale(DEFAULT_SCALE);

  const noneEffect = effectsList.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  currentEffect = 'none';
  imagePreview.className = '';
  imagePreview.style.filter = 'none';
  effectLevelContainer.classList.add('hidden');
  effectLevelValue.value = '';

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.set(100);
  }
};

const updateEffectsPreview = () => {
  const effectsPreviews = document.querySelectorAll('.effects__preview');
  const currentImageSrc = imagePreview.src;

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${currentImageSrc})`;
  });
};

const initImageEditor = () => {
  const scaleSmallerButton = uploadForm.querySelector('.scale__control--smaller');
  const scaleBiggerButton = uploadForm.querySelector('.scale__control--bigger');

  scaleSmallerButton.addEventListener('click', onScaleSmallerClick);
  scaleBiggerButton.addEventListener('click', onScaleBiggerClick);

  updateScale(DEFAULT_SCALE);

  createEffectSlider();
  effectsList.addEventListener('change', onEffectChange);

  const noneEffect = effectsList.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        updateEffectsPreview();
      }
    });
  });

  observer.observe(imagePreview, { attributes: true });
};

const setEffect = (effect, level = null) => {
  const effectInput = uploadForm.querySelector(`input[value="${effect}"]`);
  if (effectInput) {
    effectInput.checked = true;
    currentEffect = effect;

    imagePreview.className = '';
    imagePreview.classList.add(`effects__preview--${effect}`);

    if (effect === 'none') {
      imagePreview.style.filter = 'none';
      effectLevelContainer.classList.add('hidden');
    } else {
      effectLevelContainer.classList.remove('hidden');
      updateEffectSlider(effect);

      if (level !== null && effectLevelSlider.noUiSlider) {
        effectLevelSlider.noUiSlider.set(level);
        effectLevelValue.value = level;

        const effectConfig = EFFECTS[effect];
        imagePreview.style.filter = `${effectConfig.filter}(${level}${effectConfig.unit})`;
      }
    }
  }
};


export {
  initImageEditor,
  resetEditor,
  updateEffectsPreview,
  onScaleSmallerClick,
  onScaleBiggerClick,
  setEffect
};

