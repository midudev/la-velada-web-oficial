# media/

Originales de fotos y vídeos del evento (solo existen en local, no se
committean ni se despliegan). El contenido servible vive en el CDN
(`cdn.infolavelada.com`, bucket de R2).

Antes estaban en `public/photos` y `public/videos`, pero nada del código los
referencia en runtime y `astro build` copiaba los ~23 GB a `dist/client` y a
`.vercel/output/static` en cada build (~50 s de I/O). Fuera de `public/` la
build no los toca.
