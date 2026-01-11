const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createPictureElement = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  pictureImage.dataset.id = photo.id;

  if (photo.scale) {
    const scaleValue = photo.scale / 100;
    pictureImage.style.transform = `scale(${scaleValue})`;
  }

  if (photo.effect && photo.effect !== 'none') {
    pictureImage.classList.add(`effects__preview--${photo.effect}`);

    if (photo.effect_level !== undefined && photo.effect_level !== null) {
      let filter = '';
      switch (photo.effect) {
        case 'chrome':
          filter = `grayscale(${photo.effect_level})`;
          break;
        case 'sepia':
          filter = `sepia(${photo.effect_level})`;
          break;
        case 'marvin':
          filter = `invert(${photo.effect_level}%)`;
          break;
        case 'phobos':
          filter = `blur(${photo.effect_level}px)`;
          break;
        case 'heat':
          filter = `brightness(${photo.effect_level})`;
          break;
      }
      if (filter) {
        pictureImage.style.filter = filter;
      }
    }
  }

  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;

  return pictureElement;
};


const renderPictures = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureListFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    pictureListFragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(pictureListFragment);
};

const clearPictures = () => {
  const picturesContainer = document.querySelector('.pictures');
  const existingPictures = picturesContainer.querySelectorAll('.picture');

  existingPictures.forEach((picture) => picture.remove());
};

export { renderPictures, clearPictures };
