# Astro Components

## Component Structure

Astro components use a `.astro` extension and consist of two main parts:

```astro
---
// Component Script (Frontmatter)
// Runs on the server at build time (or request time for SSR)
import SomeComponent from './SomeComponent.astro';
import { getCollection } from 'astro:content';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Default description' } = Astro.props;

// Top-level await is supported
const posts = await getCollection('blog');
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<!-- Component Template -->
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>{description}</p>
    <SomeComponent />
  </body>
</html>
```

## Props

### Defining Props with TypeScript

```astro
---
interface Props {
  name: string;
  greeting?: string;
  items: string[];
}

const { name, greeting = "Hello", items } = Astro.props;
---

<h1>{greeting}, {name}!</h1>
<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>
```

### Accessing All Props

```astro
---
const allProps = Astro.props;
// Spread to child component
---

<ChildComponent {...allProps} />
```

## Slots

### Default Slot

```astro
<!-- Wrapper.astro -->
---
---
<div class="wrapper">
  <slot />  <!-- Children go here -->
</div>
```

```astro
<!-- Usage -->
<Wrapper>
  <p>This content goes into the slot</p>
</Wrapper>
```

### Named Slots

```astro
<!-- Layout.astro -->
---
---
<div class="container">
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot />  <!-- Default slot -->
  </main>
  <footer>
    <slot name="footer" />
  </footer>
</div>
```

```astro
<!-- Usage -->
<Layout>
  <h1 slot="header">Page Title</h1>
  <p>Main content goes in default slot</p>
  <p slot="footer">Footer content</p>
</Layout>
```

### Fallback Content

```astro
<slot>
  <p>This shows if no content is provided</p>
</slot>
```

### Checking for Slot Content

```astro
---
const hasHeader = Astro.slots.has('header');
---

{hasHeader && (
  <header>
    <slot name="header" />
  </header>
)}
```

### Rendering Slots Programmatically

```astro
---
const html = await Astro.slots.render('default');
---

<Fragment set:html={html} />
```

## Expressions and Dynamic Content

### Basic Expressions

```astro
---
const name = "Astro";
const items = ['Apple', 'Banana', 'Cherry'];
const visible = true;
---

<h1>{name}</h1>
<p>{5 + 5}</p>
<p>{visible ? 'Shown' : 'Hidden'}</p>

<!-- Lists -->
<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>

<!-- Conditional rendering -->
{visible && <p>This is visible</p>}

<!-- Dynamic HTML -->
<div set:html={rawHtmlString} />
```

### Dynamic Attributes

```astro
---
const dynamicId = "my-id";
const dynamicClass = "active";
---

<div id={dynamicId} class={dynamicClass}>Content</div>

<!-- Boolean attributes -->
<input type="checkbox" checked={true} />
<button disabled={false}>Click</button>

<!-- Spreading attributes -->
<div {...Astro.props}>Content</div>
```

## class:list Directive

```astro
---
const isActive = true;
const isDisabled = false;
---

<div class:list={[
  'base-class',
  { 'active': isActive },
  { 'disabled': isDisabled },
  isActive && 'conditional-class',
]}>
  Content
</div>
<!-- Output: <div class="base-class active conditional-class">Content</div> -->
```

## HTML Attributes

### set:html

Inject raw HTML (be careful with user input - XSS risk):

```astro
---
const rawHTML = "<strong>Bold</strong>";
---

<div set:html={rawHTML} />
```

### set:text

Safely set text content:

```astro
---
const text = "Some text content";
---

<p set:text={text} />
```

## Fragment

Wrap multiple elements without adding extra DOM:

```astro
---
import { Fragment } from 'astro:components';
---

<Fragment>
  <li>Item 1</li>
  <li>Item 2</li>
</Fragment>

<!-- Or using shorthand -->
<>
  <li>Item 1</li>
  <li>Item 2</li>
</>
```

## Component Scripts

### Imports

```astro
---
// Astro components
import Header from '../components/Header.astro';

// UI framework components
import ReactComponent from '../components/ReactComponent.jsx';

// Data
import { getCollection } from 'astro:content';

// Utilities
import { formatDate } from '../utils/date';

// Styles
import '../styles/global.css';

// JSON data
import data from '../data/config.json';
---
```

### Using Astro Global

```astro
---
// URL information
const currentPath = Astro.url.pathname;
const searchParams = Astro.url.searchParams;

// Request (SSR only)
const userAgent = Astro.request.headers.get('user-agent');

// Cookies (SSR only)
const token = Astro.cookies.get('token');

// Redirect (SSR only)
if (!token) {
  return Astro.redirect('/login');
}

// Props
const { title } = Astro.props;

// Slots
const hasContent = Astro.slots.has('default');

// Site configuration
const siteUrl = Astro.site;

// Generator
const generator = Astro.generator; // "Astro v4.x.x"

// Current locale (i18n)
const locale = Astro.currentLocale;
---
```

## Best Practices

1. **Keep frontmatter focused** - Only include necessary logic
2. **Use TypeScript interfaces** - Define Props for type safety
3. **Prefer slots over props for complex content** - Better composability
4. **Avoid side effects in frontmatter** - It runs on every render
5. **Use `class:list` for conditional classes** - Cleaner than ternaries
6. **Extract reusable logic to utilities** - Keep components clean
