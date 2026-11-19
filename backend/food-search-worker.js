// Paste this entire file into Cloudflare's Worker editor and click Deploy.
const SITE_ORIGIN = 'https://nahidbari12.github.io';
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const headers = {
      'Access-Control-Allow-Origin': SITE_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    };
    const reply = (body, status=200) => new Response(JSON.stringify(body), {status, headers});
    if (origin && origin !== SITE_ORIGIN) return reply({error:'This search connection is for Plate.'},403);
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
    if (request.method !== 'GET') return reply({error:'Use GET.'},405);
    if (url.pathname !== '/' && url.pathname !== '/search') return reply({error:'Not found.'},404);
    if (!url.searchParams.has('q')) return reply({service:'Plate food search',ready:true});
    const q = url.searchParams.get('q').trim().replace(/\s+/g,' ');
    if (q.length < 2 || q.length > 100) return reply({error:'Enter between 2 and 100 characters.'},400);
    const cacheKey = new Request(url.origin+'/search?q='+encodeURIComponent(q.toLowerCase()));
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return new Response(cached.body,{status:200,headers});
    try {
      // Fixed destination: this cannot be used to proxy arbitrary websites.
      const upstream = new URL('https://search.openfoodfacts.org/search');
      upstream.searchParams.set('q', q);
      upstream.searchParams.set('page_size','24');
      const response = await fetch(upstream.toString(),{
        headers:{'Accept':'application/json','User-Agent':'Plate/1.6.1 (99reflectionsapp@gmail.com)'},
        signal:AbortSignal.timeout(20000),redirect:'manual'
      });
      if (!response.ok) return reply({error:response.status===429?'Food database is busy. Please wait a minute.':'Food database is temporarily unavailable. Try again later.'},response.status===429?429:502);
      const data = await response.json();
      if (!Array.isArray(data.hits)) return reply({error:'Food database returned an unexpected response.'},502);
      const products = data.hits.slice(0,24).map(p=>({
        code:String(p.code||''),
        product_name:typeof p.product_name==='string'?p.product_name:(typeof p.product_name_en==='string'?p.product_name_en:''),
        brands:Array.isArray(p.brands)?p.brands.join(', '):(typeof p.brands==='string'?p.brands:''),
        serving_size:typeof p.serving_size==='string'?p.serving_size:'',
        nutriments:p.nutriments && typeof p.nutriments==='object'?p.nutriments:{},
        nutrition_data_per:p.nutrition_data_per
      }));
      const body = {products,source:'Open Food Facts',license:'ODbL'};
      const saved = new Response(JSON.stringify(body),{headers:{...headers,'Cache-Control':'public, max-age=3600'}});
      ctx.waitUntil(cache.put(cacheKey,saved).catch(()=>{}));
      return reply(body);
    } catch(error) {
      return reply({error:error.name==='TimeoutError'?'Food search timed out. Please retry.':'Unable to reach the food database. Please retry later.'},502);
    }
  }
};
