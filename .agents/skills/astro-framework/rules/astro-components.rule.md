---
description: Rules for writing Astro components
globs:
  - "**/*.astro"
---

# Astro Component Rules

## Component Structure

Always use the frontmatter pattern with proper separation:

```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Destructure props with defaults
const { title, description = 'Default' } = Astro.props;

// 4. Data fetching and logic
const posts = await getCollection('blog');
---

<!-- 5. Template -->
<Layout title={title}>
  <h1>{title}</h1>
</Layout>

<!-- 6. Scoped styles -->
<style>
  h1 { color: navy; }
</style>
```

## MUST DO

- Define `interface Props` for type safety
- Use destructuring with defaults for optional props
- Keep frontmatter logic minimal and focused
- Use slots for composable content
- Use `class:list` for conditional classes
- Import components and assets at the top

## MUST NOT DO

- Access browser APIs (window, document) in frontmatter - runs on server
- Use side effects in frontmatter - runs on every render
- Mix UI framework components without client directives
- Forget alt text on images
- Use inline styles when scoped styles work
- Skip TypeScript interfaces for Props

## Slots Pattern

```astro
---
// Wrapper.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
const hasFooter = Astro.slots.has('footer');
---

<article>
  <header><h1>{title}</h1></header>
  <main><slot /></main>
  {hasFooter && <footer><slot name="footer" /></footer>}
</article>
```

## Dynamic Attributes

```astro
---
const id = "main";
const isActive = true;
---

<div
  id={id}
  class:list={['base', { active: isActive }]}
  data-active={isActive}
>
  Content
</div>
```

## Conditional Rendering

```astro
---
const show = true;
const items = ['a', 'b', 'c'];
---

{show && <p>Visible</p>}
{show ? <p>Yes</p> : <p>No</p>}

<ul>
  {items.map(item => <li>{item}</li>)}
</ul>
```
