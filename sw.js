const PREFIX='plate-pages-shell-';
const CACHE=PREFIX+'v1.13.0';
const BASE=self.registration.scope;
const local=name=>new URL(name,BASE).href;
const SHELL=['./','index.html','style.css','app.js','swipe-navigation.js','ramadan.js','hydration.js','family-recipes.js','bodyfat.js','coach.js','scanner-controls.js','everyday-foods.js','daily-nutrients.js','nutrition.js','us-foods.js','med-foods.js','indian-foods.js','profile-dates.js','journey.js','zxing.min.js','manifest.json','privacy.html','icon.png','icon-512.png'].map(name=>local((name.endsWith('.js')||name==='style.css')?name+'?v=1.13.0':name));
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!e.request.url.startsWith(BASE))return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try {
   const response=await fetch(e.request);
   if(response.ok)await cache.put(e.request,response.clone());
   return response;
  } catch(error) {
   const cached=await cache.match(e.request);
   if(cached)return cached;
   if(e.request.mode==='navigate')return (await cache.match(local('index.html')))||Response.error();
   return Response.error();
  }
 })());
});













