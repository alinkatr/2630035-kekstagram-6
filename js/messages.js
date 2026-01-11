import { isEscapeKey } from './util.js';

const ALERT_SHOW_TIME = 5000;

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '20px 10px';
  alertContainer.style.fontSize = '16px';
  alertContainer.style.fontFamily = 'Arial, sans-serif';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = '#ff4e4e';
  alertContainer.style.color = '#ffffff';
  alertContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    return;
  }

  const successElement = successTemplate.content.cloneNode(true);
  const successSection = successElement.querySelector('.success');

  document.body.insertBefore(successElement, document.body.lastElementChild.nextSibling);

  const successButton = document.querySelector('.success__button');

  successSection.style.position = 'fixed';
  successSection.style.inset = '0';
  successSection.style.zIndex = '10000';


  const onSuccessClick = (evt) => {
    if (evt.target === successSection) {
      closeSuccessMessage();
    }
  };

  const onSuccessButtonClick = () => {
    closeSuccessMessage();
  };

  const onSuccessKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      closeSuccessMessage();
    }
  };

  const closeSuccessMessage = () => {
    if (successSection && successSection.parentNode) {
      successSection.parentNode.removeChild(successSection);
    }
    document.removeEventListener('keydown', onSuccessKeydown);
    successSection.removeEventListener('click', onSuccessClick);
    if (successButton) {
      successButton.removeEventListener('click', onSuccessButtonClick);
    }
  };

  document.addEventListener('keydown', onSuccessKeydown);
  successSection.addEventListener('click', onSuccessClick);
  if (successButton) {
    successButton.addEventListener('click', onSuccessButtonClick);
  }
};

const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    return;
  }

  const errorElement = errorTemplate.content.cloneNode(true);
  const errorSection = errorElement.querySelector('.error');
  const errorInner = errorElement.querySelector('.error__inner');
  const errorButton = errorElement.querySelector('.error__button');

  errorSection.style.position = 'fixed';
  errorSection.style.inset = '0';
  errorSection.style.zIndex = '10000';

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeError();
    }
  };

  const onOutsideClick = (evt) => {
    if (!errorInner.contains(evt.target)) {
      closeError();
    }
  };

  function closeError() {
    document.removeEventListener('keydown', onDocumentKeydown);
    errorSection.removeEventListener('click', onOutsideClick);
    errorButton.removeEventListener('click', closeError);
    errorSection.remove();
  }

  errorButton.addEventListener('click', closeError);
  document.addEventListener('keydown', onDocumentKeydown);
  errorSection.addEventListener('click', onOutsideClick);

  document.body.append(errorSection);
};


export { showAlert, showSuccessMessage, showErrorMessage };
