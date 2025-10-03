const CACHE_NAME = 'rurcoin-v1';
const OFFLINE_URL = '/offline.html';

// Статические ресурсы для кэширования
const PRECACHE_URLS = [
  '/',
  '/style.css',
  '/app.js',
  '/ton-connect.js',
  '/script.js',
  '/utils.js',
  '/images/logo.png',
  '/offline-cat.jpg'
];

// Установка и кэширование ресурсов
self.addEventListener('install', event => {
  console.log('Service Worker: Установка');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Кэширование файлов');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  console.log('Service Worker: Активация');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Удаление старого кэша', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  // Пропускаем не-GET запросы и chrome-extension
  if (event.request.method !== 'GET' || 
      event.request.url.includes('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэш если есть, иначе делаем сетевой запрос
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            // Проверяем валидный ответ
            if (!response  response.status !== 200  response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            // Если сеть недоступна, пробуем вернуть оффлайн-страницу
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            console.log('Service Worker: Fetch failed:', error);
            throw error;
          });
      })
  );
});

// Фоновая синхронизация для повторения неудачных транзакций
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-transaction') {
    console.log('Service Worker: Фоновая синхронизация транзакций');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Здесь может быть логика повторения неудачных транзакций
  const db = await openDB();
  const failedTransactions = await db.getAll('failed_transactions');
  
  for (const transaction of failedTransactions) {
    try {
      // Повторяем транзакцию
      await retryTransaction(transaction);
      await db.delete('failed_transactions', transaction.id);
    } catch (error) {
      console.log('Не удалось повторить транзакцию:', error);
    }
  }
}

// Упрощенная работа с IndexedDB для фоновой синхронизации
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RURCoinSync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('failed_transactions')) {
        db.createObjectStore('failed_transactions', { keyPath: 'id' });
      }
    };
  });
}