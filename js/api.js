const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const ApiRoute = {
  GET_DATA: '/data',
  POST_DATA: '/',
};

const ApiMethod = {
  GET: 'GET',
  POST: 'POST',
};

const ApiErrorText = {
  GET_DATA: 'Не удалось загрузить фотографии других пользователей. Попробуйте обновить страницу',
  SEND_DATA: 'Ошибка загрузки файла',
};

const pendingSubmissions = {
  queue: [],

  add(photoData) {
    const pendingItem = {
      ...photoData,
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      status: 'pending',
    };

    this.queue.push(pendingItem);
    this.saveToStorage();
    return pendingItem;
  },

  remove(id) {
    this.queue = this.queue.filter((item) => item.id !== id);
    this.saveToStorage();
  },

  saveToStorage() {
    try {
      localStorage.setItem('kekstagram_pending', JSON.stringify(this.queue));
    } catch (e) {
      console.error('Ошибка сохранения очереди отправок:', e);
    }
  },

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('kekstagram_pending');
      this.queue = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Ошибка загрузки очереди отправок:', e);
      this.queue = [];
    }
  },

  retryAll: async () => {
    const failedItems = this.queue.filter(item => item.status === 'failed');

    for (const item of failedItems) {
      try {
      } catch (e) {
        console.error('Ошибка при повторной отправке:', e);
      }
    }
  }
};

pendingSubmissions.loadFromStorage();

const loadData = async () => {
  try {
    const response = await fetch(`${BASE_URL}${ApiRoute.GET_DATA}`);

    if (!response.ok) {
      throw new Error(ApiErrorText.GET_DATA);
    }

    return await response.json();
  } catch (error) {
    console.warn('Ошибка загрузки данных с сервера. Работаем в офлайн-режиме.');

    return [];
  }
};

const sendData = async (formData, photoData = null) => {
  try {
    const response = await fetch(`${BASE_URL}${ApiRoute.POST_DATA}`, {
      method: ApiMethod.POST,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(ApiErrorText.SEND_DATA);
    }

    return await response.json();
  } catch (error) {
    if (photoData) {
      const pendingItem = pendingSubmissions.add({
        ...photoData,
        formData: Object.fromEntries(formData),
        serverData: null,
        status: 'failed'
      });
      console.log('Фото сохранено для отправки позже:', pendingItem.id);
    }

    throw new Error(ApiErrorText.SEND_DATA);
  }
};

const checkServerAvailability = async () => {
  try {
    const response = await fetch(`${BASE_URL}${ApiRoute.GET_DATA}`, {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch {
    return false;
  }
};

export { loadData, sendData, pendingSubmissions, checkServerAvailability };
