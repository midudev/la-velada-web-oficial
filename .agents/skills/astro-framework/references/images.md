# Images

Astro provides built-in image optimization through the `astro:assets` module.

## Image Component

### Basic Usage

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.jpg';
---

<Image src={heroImage} alt="Hero image" />
```

Output: Optimized image with proper format, dimensions, and lazy loading.

### With Properties

```astro
---
import { Image } from 'astro:assets';
import photo from '../images/photo.jpg';
---

<Image
  src={photo}
  alt="A description"
  width={800}
  height={600}
  format="webp"
  quality={80}
  loading="lazy"
  decoding="async"
  class="rounded-lg shadow-md"
/>
```

### Remote Images

```astro
---
import { Image } from 'astro:assets';
---

<Image
  src="https://example.com/image.jpg"
  alt="Remote image"
  width={400}
  height={300}
  inferSize={false}
/>
```

For remote images, `width` and `height` are required (or use `inferSize`).

### Infer Size for Remote Images

```astro
<Image
  src="https://example.com/image.jpg"
  alt="Remote image"
  inferSize
/>
```

## Picture Component

Provides responsive images with multiple formats:

```astro
---
import { Picture } from 'astro:assets';
import photo from '../images/photo.jpg';
---

<Picture
  src={photo}
  alt="Responsive image"
  formats={['avif', 'webp', 'jpg']}
  widths={[400, 800, 1200]}
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
/>
```

Output:

```html
<picture>
  <source srcset="..." type="image/avif" sizes="...">
  <source srcset="..." type="image/webp" sizes="...">
  <img src="..." alt="Responsive image" loading="lazy" decoding="async">
</picture>
```

## getImage Function

For programmatic image processing:

```astro
---
import { getImage } from 'astro:assets';
import background from '../images/background.jpg';

const optimizedBg = await getImage({
  src: background,
  format: 'webp',
  width: 1920,
  quality: 80,
});
---

<div style={`background-image: url(${optimizedBg.src})`}>
  Content with background
</div>
```

## Image Paths

### Local Images (src/)

```astro
---
// Import from src directory
import hero from '../images/hero.jpg';
import logo from '@/assets/logo.png'; // Using alias
---

<Image src={hero} alt="Hero" />
<Image src={logo} alt="Logo" />
```

### Public Folder Images

Images in `public/` are not optimized:

```astro
<!-- Not optimized, served as-is -->
<img src="/images/static-image.jpg" alt="Static" />

<!-- Can still use Image component with remote-like syntax -->
<Image
  src="/images/static-image.jpg"
  alt="Static"
  width={400}
  height={300}
/>
```

### Dynamic Imports

```astro
---
const images = import.meta.glob<{ default: ImageMetadata }>(
  '../images/*.{jpg,png,gif}'
);

const imagePaths = Object.keys(images);
---

{imagePaths.map(async (path) => {
  const image = await images[path]();
  return <Image src={image.default} alt="" />;
})}
```

## Content Collections Images

### Schema with Image

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(),
    coverAlt: z.string(),
  }),
});

export const collections = { blog };
```

### Markdown Frontmatter

```markdown
---
title: "My Post"
cover: "./images/cover.jpg"
coverAlt: "Post cover image"
---

Content here...
```

### Using in Template

```astro
---
import { Image } from 'astro:assets';
import { getEntry } from 'astro:content';

const post = await getEntry('blog', 'my-post');
---

<Image src={post.data.cover} alt={post.data.coverAlt} />
```

## Image Formats

Supported output formats:
- `webp` (default for optimization)
- `avif` (best compression, slower)
- `png` (lossless)
- `jpg`/`jpeg` (lossy)
- `svg` (pass-through, no optimization)
- `gif` (pass-through)

```astro
<Image src={photo} alt="Photo" format="avif" quality={60} />
```

## Quality Settings

```astro
<!-- Lower quality, smaller file -->
<Image src={photo} alt="" quality="low" />
<Image src={photo} alt="" quality={50} />

<!-- Medium quality (default) -->
<Image src={photo} alt="" quality="mid" />
<Image src={photo} alt="" quality={75} />

<!-- Higher quality -->
<Image src={photo} alt="" quality="high" />
<Image src={photo} alt="" quality={90} />

<!-- Maximum quality -->
<Image src={photo} alt="" quality="max" />
<Image src={photo} alt="" quality={100} />
```

## Responsive Images

### With Picture

```astro
<Picture
  src={hero}
  alt="Hero"
  widths={[640, 768, 1024, 1280, 1536]}
  sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1536px"
  formats={['avif', 'webp', 'jpg']}
/>
```

### With densities

```astro
<Image
  src={logo}
  alt="Logo"
  width={200}
  densities={[1, 2, 3]}
/>

<!-- Output srcset with 1x, 2x, 3x versions -->
```

## Configuration

### Image Service

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    // Sharp is default, or use custom service
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },

    // Allowed remote domains
    domains: ['example.com', 'cdn.example.com'],

    // Allowed remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
});
```

### External Image Service

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: '@astrojs/cloudinary',
      config: {
        cloudName: 'your-cloud-name',
      },
    },
  },
});
```

## Markdown Images

### Using Relative Paths

```markdown
<!-- src/content/blog/post.md -->
![Alt text](./images/image.jpg)
```

### Using Image Component in MDX

```mdx
---
title: My Post
---

import { Image } from 'astro:assets';
import photo from './images/photo.jpg';

# My Post

<Image src={photo} alt="Photo" width={600} />

Regular markdown images still work:
![Alt](./images/other.jpg)
```

## Background Images

```astro
---
import { getImage } from 'astro:assets';
import bg from '../images/background.jpg';

const optimizedBg = await getImage({ src: bg, format: 'webp' });
---

<section class="hero" style={`background-image: url(${optimizedBg.src})`}>
  <h1>Welcome</h1>
</section>

<style>
  .hero {
    background-size: cover;
    background-position: center;
    min-height: 100vh;
  }
</style>
```

## Best Practices

1. **Always use Image component for local images** - Automatic optimization
2. **Provide alt text** - Accessibility requirement
3. **Use Picture for hero images** - Multiple formats and sizes
4. **Specify width/height for CLS** - Prevents layout shift
5. **Use WebP/AVIF formats** - Better compression
6. **Configure remote domains** - Security whitelist
7. **Use quality settings appropriately** - Balance size vs quality
8. **Import images, don't use strings** - Enables optimization
9. **Use content collection image schema** - Type-safe image handling
