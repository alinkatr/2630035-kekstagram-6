
const uploadForm = document.querySelector('#upload-select-image');
const scaleControlValue = uploadForm.querySelector('.scale__control--value');
const scaleControlSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadForm.querySelector('.scale__control--bigger');
const imagePreview = uploadForm.querySelector('.img-upload__preview img');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectsList = uploadForm.querySelector('.effects__list');
const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

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
let currentScale = DEFAULT_SCALE;

const updateScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

const onScaleBiggerClick = () => {
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

const createSlider = () => {
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

  effectLevelContainer.classList.add('hidden');
};

const updateSlider = (effect) => {
  const effectConfig = EFFECTS[effect];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effectConfig.min,
      max: effectConfig.max,
    },
    start: effectConfig.max,
    step: effectConfig.step,
  });
};

const onSliderUpdate = () => {
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
      updateSlider(currentEffect);
      onSliderUpdate();
    }
  }
};

const resetEditor = () => {
  updateScale(DEFAULT_SCALE);

  const noneEffect = effectsList.querySelector('#effect-none');
  noneEffect.checked = true;
  currentEffect = 'none';
  imagePreview.className = '';
  imagePreview.style.filter = 'none';
  effectLevelContainer.classList.add('hidden');

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      start: 100,
    });
  }
};

const initImageEditor = () => {
  updateScale(DEFAULT_SCALE);
  scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleBiggerClick);

  createSlider();
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);

  effectsList.addEventListener('change', onEffectChange);
};

export { initImageEditor, resetEditor };
