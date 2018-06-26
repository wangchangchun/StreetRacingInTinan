const cacheFile = [
  './resources/css/style.css',
  './resources/img/IMG_0720-2.jpg',
  './resources/img/IMG_0722-2.jpg',
  './resources/img/IMG_0724-2.jpg',
  './resources/img/IMG_0726-2.jpg',
  './resources/img/IMG_0727-2.jpg',
  './resources/img/IMG_0729-2.jpg',
  './resources/js/script.js'
]

const cacheKey = 'ncku_class_v14'

// install
self.addEventListener('install', event => {
  console.log("now install")

  event.waitUntil(
    caches.open(cacheKey)
    .then(cache => cache.addAll(cacheFile))
    // .then(() => self.skipWaiting())
  )
})

// activate
self.addEventListener('activate', event => {
  console.log(`activate ${cacheKey}, now ready to handle fetches`)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const promiseArr = cacheNames.map(item => {
        if (item !== cacheKey) {
          return caches.delete(item)
        }
      })
      return Promise.all(promiseArr)
    })
  )
})

// fetch
self.addEventListener('fetch', event => {
  console.log(`${event.request.method}: ${event.request.url}`)
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
})

