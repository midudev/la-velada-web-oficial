---
description: Rules for image optimization in Astro
globs:
  - "**/*.astro"
  - "**/*.mdx"
  - "src/content/**/*"
---

# Astro Image Rules

## Image Component

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero.jpg';
---

<Image
  src={heroImage}
  alt="Descriptive alt text"
  width={800}
  height={600}
  format="webp"
  quality={80}
/>
```

## MUST DO

- Import local images - enables optimization
- Always provide meaningful alt text
- Use `<Image>` component for local images
- Use `<Picture>` for responsive hero images
- Specify width/height to prevent layout shift
- Configure allowed domains for remote images
- Use the image() schema helper in content collections

## MUST NOT DO

- Use string paths for local images: `src="/images/hero.jpg"`
- Skip alt text (accessibility requirement)
- Use `<img>` tags for local images (misses optimization)
- Forget width/height for remote images
- Allow arbitrary remote domains

## Local vs Remote Images

```astro
---
import { Image } from 'astro:assets';
import localImage from '../images/photo.jpg';
---

<!-- Local: import required, auto-optimized -->
<Image src={localImage} alt="Local photo" />

<!-- Remote: dimensions required -->
<Image
  src="https://example.com/photo.jpg"
  alt="Remote photo"
  width={400}
  height={300}
/>

<!-- Remote with inferred size (fetches image) -->
<Image
  src="https://example.com/photo.jpg"
  alt="Remote photo"
  inferSize
/>
```

## Picture for Responsive Images

```astro
---
import { Picture } from 'astro:assets';
import hero from '../images/hero.jpg';
---

<Picture
  src={hero}
  alt="Hero image"
  formats={['avif', 'webp', 'jpg']}
  widths={[400, 800, 1200]}
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
/>
```

## Content Collections with Images

```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    cover: image(),           // Validates and optimizes
    coverAlt: z.string(),
  }),
});
```

```markdown
---
title: My Post
cover: ./images/cover.jpg
coverAlt: Post cover showing...
---
```

## Background Images

```astro
---
import { getImage } from 'astro:assets';
import bg from '../images/background.jpg';

const optimizedBg = await getImage({
  src: bg,
  format: 'webp',
  width: 1920,
});
---

<section style={`background-image: url(${optimizedBg.src})`}>
  Content
</section>
```

## Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['cdn.example.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
});
```

## Quality Settings

- `quality="low"` or `quality={50}` - Smaller files
- `quality="mid"` or `quality={75}` - Default balance
- `quality="high"` or `quality={90}` - Better quality
- `quality="max"` or `quality={100}` - Maximum quality
