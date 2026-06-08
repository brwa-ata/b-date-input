# @yourname/vue-date-input

Compact Vue 3 date input with single/range modes, manual `mm/dd/yyyy` entry, shortcuts (Today, Yesterday, This week, This month), and dark/light themes.

## Install

```bash
npm install @yourname/vue-date-input
```

## Use

Register globally:

```js
import { createApp } from 'vue';
import DateInput from '@yourname/vue-date-input';
import '@yourname/vue-date-input/style.css';

createApp(App).use(DateInput).mount('#app');
```

Or import locally:

```vue
<script setup>
import { ref } from 'vue';
import { DateInput } from '@yourname/vue-date-input';
import '@yourname/vue-date-input/style.css';

const single = ref(null);            // Date | null
const range  = ref([null, null]);    // [Date, Date] | [null, null]
</script>

<template>
  <DateInput v-model="single" mode="single" theme="dark" label="Date" />
  <DateInput v-model="range"  mode="range"  theme="light" label="Period" />
</template>
```

## Props

| Prop          | Type                           | Default        | Notes                                            |
|---------------|--------------------------------|----------------|--------------------------------------------------|
| `mode`        | `'single' \| 'range'`          | `'single'`     | Range mode shows 4 shortcuts; single shows 2.    |
| `modelValue`  | `Date \| [Date, Date]`         | `null`         | `v-model`. Date for single, tuple for range.     |
| `label`       | `String`                       | `'Date'`       | Field label above the input.                     |
| `format`      | `'mm/dd/yyyy' \| 'dd/mm/yyyy'` | `'dd/mm/yyyy'` | Display + parse format for manual entry.         |
| `theme`       | `'dark' \| 'light'`            | `'dark'`       | Toggle via prop or override CSS variables.       |
| `placeholder` | `String`                       | `format`       | Falls back to the format string.                 |
| `defaultOpen` | `Boolean`                      | `false`        | Opens the panel on mount (useful for showcases). |
| `clearable`   | `Boolean`                      | `false`        | Shows a × button to clear the value.            |
| `icon`        | `Component`                    | built-in SVG   | Replaces the calendar icon with a Vue component. |
| `bgColor`     | `String`                       | `transparent`  | CSS color string applied to the input field.     |

## Events

- `update:modelValue` — emitted on every change (v-model).
- `change` — convenience alias.

## Theming

The component exposes every visual token so you can fully re-skin it without forking the source. There are two complementary mechanisms — pick whichever fits your build setup.

---

### Option A — CSS custom properties (runtime, no build step)

All color and shape tokens are CSS custom properties on `.dp`. Override them in your own stylesheet after importing the component CSS. Changes take effect immediately and can be driven by JavaScript.

```css
/* indigo accent, both themes */
.dp--dark {
  --dp-accent:        #6366f1;
  --dp-accent-fg:     #ffffff;
  --dp-accent-soft:   rgba(99, 102, 241, 0.18);
  --dp-accent-softer: rgba(99, 102, 241, 0.10);
}

.dp--light {
  --dp-accent:        #4f46e5;
  --dp-accent-fg:     #ffffff;
  --dp-accent-soft:   rgba(79, 70, 229, 0.14);
  --dp-accent-softer: rgba(79, 70, 229, 0.07);
}
```

Target a single instance via a wrapper class instead of `.dp`:

```html
<div class="my-picker">
  <DateInput theme="dark" />
</div>
```
```css
.my-picker .dp--dark {
  --dp-accent: #06b6d4;   /* cyan for this instance only */
}
```

#### Full token reference

**Colors**

| Token | Role |
|---|---|
| `--dp-bg-0` | Deepest background layer |
| `--dp-bg-1` | Field + panel surface |
| `--dp-bg-2` | Popover / shortcuts bar |
| `--dp-bg-3` | Hover fills |
| `--dp-line` | Default border |
| `--dp-line-strong` | Hover / focus border |
| `--dp-fg-0` | Primary text |
| `--dp-fg-1` | Secondary text |
| `--dp-fg-2` | Muted text, icons |
| `--dp-fg-3` | Very muted (DOW headers) |
| `--dp-accent` | Selected day, focus ring, active chips |
| `--dp-accent-fg` | Text on top of accent fill |
| `--dp-accent-soft` | In-range background |
| `--dp-accent-softer` | Focus ring glow |
| `--dp-danger` | Error state border |
| `--dp-shadow` | Panel drop shadow |

**Shape**

| Token | Default | Role |
|---|---|---|
| `--dp-r-sm` | `6px` | Buttons, day cells, nav icons |
| `--dp-r-md` | `10px` | Input field, popovers |
| `--dp-r-lg` | `12px` | Panel dropdown |

---

### Option B — SCSS variables (compile-time)

If your project builds with SCSS you can override the defaults before importing the stylesheet. All variables use `!default` so anything you set wins.

**1. Set your variables**

```scss
// src/styles/my-date-theme.scss

// ── accent: cyan ──────────────────────────────────────────────
$dp-dark-accent:        #06b6d4;
$dp-dark-accent-fg:     #001f26;
$dp-dark-accent-soft:   rgba(6, 182, 212, 0.18);
$dp-dark-accent-softer: rgba(6, 182, 212, 0.10);

$dp-light-accent:        #0891b2;
$dp-light-accent-fg:     #ffffff;
$dp-light-accent-soft:   rgba(8, 145, 178, 0.14);
$dp-light-accent-softer: rgba(8, 145, 178, 0.07);

// ── shape: sharper corners ─────────────────────────────────────
$dp-r-sm: 3px;
$dp-r-md: 6px;
$dp-r-lg: 8px;

// ── then import the component styles ──────────────────────────
@use '@yourname/vue-date-input/src/styles/date-input';
```

**2. Import your theme file instead of the default CSS**

```js
// main.js — replace the default style import
import './styles/my-date-theme.scss'   // ← your file (imports component styles internally)
// remove: import '@yourname/vue-date-input/style.css'
```

#### All overrideable SCSS variables

```scss
// ── Dark theme ────────────────────────────────────────────────
$dp-dark-bg-0:          #0E1014   !default;
$dp-dark-bg-1:          #15181E   !default;
$dp-dark-bg-2:          #1B1F27   !default;
$dp-dark-bg-3:          #232833   !default;
$dp-dark-line:          #2A303C   !default;
$dp-dark-line-strong:   #3A4150   !default;
$dp-dark-fg-0:          #ECEEF2   !default;
$dp-dark-fg-1:          #B8BDC8   !default;
$dp-dark-fg-2:          #7B8390   !default;
$dp-dark-fg-3:          #545B68   !default;
$dp-dark-accent:        #E8895A   !default;
$dp-dark-accent-fg:     #1a0e08   !default;
$dp-dark-accent-soft:   rgba(232, 137, 90, 0.18) !default;
$dp-dark-accent-softer: rgba(232, 137, 90, 0.10) !default;
$dp-dark-danger:        #E25C5C   !default;

// ── Light theme ───────────────────────────────────────────────
$dp-light-bg-0:          #FAFAF7  !default;
$dp-light-bg-1:          #FFFFFF  !default;
$dp-light-bg-2:          #F5F5F1  !default;
$dp-light-bg-3:          #ECECE7  !default;
$dp-light-line:          #E4E4DF  !default;
$dp-light-line-strong:   #C9C9C2  !default;
$dp-light-fg-0:          #14161A  !default;
$dp-light-fg-1:          #3D424B  !default;
$dp-light-fg-2:          #6B7280  !default;
$dp-light-fg-3:          #9CA1AB  !default;
$dp-light-accent:        #D77144  !default;
$dp-light-accent-fg:     #FFFFFF  !default;
$dp-light-accent-soft:   rgba(215, 113, 68, 0.14) !default;
$dp-light-accent-softer: rgba(215, 113, 68, 0.07) !default;
$dp-light-danger:        #C84A4A  !default;

// ── Shape ─────────────────────────────────────────────────────
$dp-r-sm: 6px   !default;   // buttons, cells
$dp-r-md: 10px  !default;   // field, popovers
$dp-r-lg: 12px  !default;   // panel

// ── Typography ────────────────────────────────────────────────
$dp-font-sans: 'Inter', system-ui, sans-serif           !default;
$dp-font-mono: 'JetBrains Mono', ui-monospace, monospace !default;
```

A ready-to-copy template is also available at `src/styles/_overrides.scss`.

---

### Quick recipes

**Indigo (dark + light)**
```scss
$dp-dark-accent:        #6366f1;
$dp-dark-accent-fg:     #ffffff;
$dp-dark-accent-soft:   rgba(99, 102, 241, 0.18);
$dp-dark-accent-softer: rgba(99, 102, 241, 0.10);

$dp-light-accent:        #4f46e5;
$dp-light-accent-fg:     #ffffff;
$dp-light-accent-soft:   rgba(79, 70, 229, 0.14);
$dp-light-accent-softer: rgba(79, 70, 229, 0.07);
```

**Cyan**
```scss
$dp-dark-accent:        #06b6d4;
$dp-dark-accent-fg:     #001f26;
$dp-dark-accent-soft:   rgba(6, 182, 212, 0.18);
$dp-dark-accent-softer: rgba(6, 182, 212, 0.10);

$dp-light-accent:        #0891b2;
$dp-light-accent-fg:     #ffffff;
$dp-light-accent-soft:   rgba(8, 145, 178, 0.14);
$dp-light-accent-softer: rgba(8, 145, 178, 0.07);
```

**Pill corners**
```scss
$dp-r-sm: 999px;
$dp-r-md: 999px;
$dp-r-lg: 16px;
```

**Square / sharp corners**
```scss
$dp-r-sm: 2px;
$dp-r-md: 4px;
$dp-r-lg: 6px;
```

## Files

```
src/
├── DateInput.vue        # main component
├── MonthCalendar.vue    # internal month grid
├── utils/date.js        # date math + parse/format
├── styles/
│   ├── _tokens.scss     # SCSS vars (!default) + theme/shape mixins
│   ├── _overrides.scss  # copy-paste override template
│   └── date-input.scss  # component styles
└── index.js             # entry + Vue plugin install
```

## License

MIT
