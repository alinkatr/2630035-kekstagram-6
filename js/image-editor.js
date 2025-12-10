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

const createScaleSlider = () => {
  const scaleSliderContainer = document.createElement('div');
  scaleSliderContainer.className = 'scale__slider';

  const scaleFieldset = uploadForm.querySelector('.scale');
  scaleFieldset.appendChild(scaleSliderContainer);

  noUiSlider.create(scaleSliderContainer, {
    range: {
      min: SCALE_MIN,
      max: SCALE_MAX,
    },
    start: DEFAULT_SCALE,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Math.round(value),
      from: (value) => parseFloat(value),
    },
  });

  scaleSliderContainer.noUiSlider.on('update', (values, handle) => {
    const value = Math.round(values[handle]);
    updateScale(value);
  });

  return scaleSliderContainer;
};

let scaleSlider;

const updateScale = (value) => {
  const percentage = `${value}%`;
  scaleControlValue.value = percentage;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const createEffectSlider = () => {
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

const updateEffectSlider = (effect) => {
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

const onEffectSliderUpdate = () => {
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
      effectLevelValue.value = '';
    } else {
      effectLevelContainer.classList.remove('hidden');
      updateEffectSlider(currentEffect);
      onEffectSliderUpdate();
    }
  }
};

const resetEditor = () => {
  scaleSlider.noUiSlider.set(DEFAULT_SCALE);
  updateScale(DEFAULT_SCALE);

  const noneEffect = effectsList.querySelector('#effect-none');
  noneEffect.checked = true;
  currentEffect = 'none';
  imagePreview.className = '';
  imagePreview.style.filter = 'none';
  effectLevelContainer.classList.add('hidden');
  effectLevelValue.value = '';

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      start: 100,
    });
  }
};

const initImageEditor = () => {
  scaleSlider = createScaleSlider();
  updateScale(DEFAULT_SCALE);

  createEffectSlider();
  effectLevelSlider.noUiSlider.on('update', onEffectSliderUpdate);

  effectsList.addEventListener('change', onEffectChange);
};

export { initImageEditor, resetEditor };
