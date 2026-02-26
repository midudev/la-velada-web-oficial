# Styling

Astro supports various styling approaches with scoped styles as the default.

## Scoped Styles (Default)

Styles in `<style>` tags are automatically scoped to the component:

```astro
---
// Component.astro
---

<div class="container">
  <h1>Hello World</h1>
</div>

<style>
  /* Only affects this component */
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: navy;
  }
</style>
```

Astro adds unique class attributes to scope styles:

```html
<!-- Output -->
<div class="container astro-J7PV25F6">
  <h1 class="astro-J7PV25F6">Hello World</h1>
</div>
```

## Global Styles

### :global() Selector

Target elements globally within a scoped style block:

```astro
<style>
  /* Scoped to component */
  .container {
    padding: 1rem;
  }

  /* Global - affects all h1 elements */
  :global(h1) {
    font-size: 2rem;
  }

  /* Global within scoped context */
  .container :global(p) {
    line-height: 1.6;
  }
</style>
```

### is:global Attribute

Make entire style block global:

```astro
<style is:global>
  /* All styles here are global */
  body {
    font-family: system-ui, sans-serif;
  }

  a {
    color: blue;
  }
</style>
```

### Global Stylesheets

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';
---

<!doctype html>
<html>
  <body>
    <slot />
  </body>
</html>
```

```css
/* src/styles/global.css */
:root {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
}

body {
  color: var(--color-text);
  line-height: 1.5;
}
```

## CSS Variables

### Defining Variables

```astro
<style>
  :root {
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
  }

  .card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
</style>
```

### Dynamic Variables with define:vars

Pass JavaScript values to CSS:

```astro
---
const theme = {
  primaryColor: '#3b82f6',
  fontSize: '16px',
};

const backgroundUrl = '/images/hero.jpg';
---

<div class="hero">
  <h1>Welcome</h1>
</div>

<style define:vars={{
  primaryColor: theme.primaryColor,
  fontSize: theme.fontSize,
  bgImage: `url(${backgroundUrl})`
}}>
  .hero {
    background-image: var(--bgImage);
    color: var(--primaryColor);
    font-size: var(--fontSize);
  }
</style>
```

## class:list Directive

Conditionally apply classes:

```astro
---
const isActive = true;
const isDisabled = false;
const size = 'large';
---

<button class:list={[
  'btn',                          // Always applied
  { 'btn-active': isActive },     // Applied if true
  { 'btn-disabled': isDisabled }, // Not applied (false)
  size && `btn-${size}`,          // "btn-large"
  ['extra', 'classes'],           // Arrays flattened
]}>
  Click Me
</button>

<!-- Output: <button class="btn btn-active btn-large extra classes">Click Me</button> -->
```

## CSS Preprocessors

### Sass/SCSS

```bash
npm install sass
```

```astro
<style lang="scss">
  $primary: #3b82f6;
  $spacing: 1rem;

  .card {
    padding: $spacing;
    border: 1px solid lighten($primary, 30%);

    &:hover {
      border-color: $primary;
    }

    .title {
      color: $primary;
      font-weight: bold;
    }
  }
</style>
```

### Less

```bash
npm install less
```

```astro
<style lang="less">
  @primary: #3b82f6;

  .button {
    background: @primary;

    &:hover {
      background: darken(@primary, 10%);
    }
  }
</style>
```

### Stylus

```bash
npm install stylus
```

```astro
<style lang="stylus">
  primary = #3b82f6

  .container
    max-width 800px
    margin 0 auto
</style>
```

## Tailwind CSS

### Setup

```bash
npx astro add tailwind
```

### Usage

```astro
---
// No style tag needed
---

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-3xl font-bold text-blue-600">
    Hello World
  </h1>
  <p class="mt-4 text-gray-700 leading-relaxed">
    Welcome to my site.
  </p>
</div>
```

### With class:list

```astro
---
const isLarge = true;
---

<button class:list={[
  'px-4 py-2 rounded',
  'bg-blue-500 hover:bg-blue-600',
  'text-white font-medium',
  { 'text-lg': isLarge },
]}>
  Click Me
</button>
```

## External Stylesheets

### Link in Head

```astro
---
// src/layouts/Layout.astro
---

<html>
  <head>
    <link rel="stylesheet" href="/styles/global.css" />
    <link rel="stylesheet" href="https://cdn.example.com/library.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Import in Component

```astro
---
import '../styles/component.css';
import 'package/styles.css';
---
```

## CSS Modules

Astro supports CSS Modules for component-scoped styles:

```astro
---
import styles from './Button.module.css';
---

<button class={styles.button}>
  <span class={styles.icon}>+</span>
  Click Me
</button>
```

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  background: blue;
}

.icon {
  margin-right: 0.5rem;
}
```

## PostCSS

Create `postcss.config.mjs`:

```javascript
// postcss.config.mjs
export default {
  plugins: {
    autoprefixer: {},
    'postcss-nesting': {},
  },
};
```

Then use modern CSS features:

```astro
<style>
  .card {
    & .title {
      font-weight: bold;
    }

    &:hover {
      background: #f0f0f0;
    }
  }
</style>
```

## Style Inheritance

Styles don't cascade into child components:

```astro
<!-- Parent.astro -->
<div class="parent">
  <Child />
</div>

<style>
  .parent p {
    color: red; /* Does NOT affect p inside Child */
  }
</style>
```

To style child content, use `:global()`:

```astro
<style>
  .parent :global(p) {
    color: red; /* Affects all nested p elements */
  }
</style>
```

## Passing Classes to Components

### Accepting className prop

```astro
---
// Button.astro
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<button class:list={['btn', className]}>
  <slot />
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
</style>
```

```astro
<!-- Usage -->
<Button class="mt-4 custom-class">Click Me</Button>
```

## Best Practices

1. **Use scoped styles by default** - Prevents style conflicts
2. **Use :global() sparingly** - Only when necessary
3. **Use CSS variables for theming** - Easy to change globally
4. **Use define:vars for dynamic styles** - Pass JS values to CSS
5. **Use class:list for conditional classes** - Cleaner than ternaries
6. **Keep global styles minimal** - Reset, typography, utilities only
7. **Use preprocessors if needed** - Sass for complex styling
8. **Consider Tailwind for utility-first** - Rapid development
