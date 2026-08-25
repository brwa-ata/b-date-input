<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import MonthCalendar from './MonthCalendar.vue';
import {
  fmtDisplay, parseDisplay, sameDay,
  startOfMonth, buildShortcuts, ymd,
} from './utils/date.js';

function toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v) ? null : v;
  if (typeof v === 'string') {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  }
  return null;
}

const props = defineProps({
  /** 'single' | 'range' */
  mode: { type: String, default: 'single' },
  /** v-model — 'YYYY-MM-DD' string for single, ['YYYY-MM-DD','YYYY-MM-DD'] for range */
  modelValue: { type: [String, Date, Array, null], default: null },
  label: { type: String, default: 'Date' },
  icon: { type: [Object, Function], default: null },
  bgColor: { type: String, default: null },
  clearable: { type: Boolean, default: false },
  /** 'mm/dd/yyyy' | 'dd/mm/yyyy' */
  format: { type: String, default: 'dd/mm/yyyy' },
  /** 'dark' | 'light' */
  theme: { type: String, default: 'dark' },
  placeholder: { type: String, default: '' },
  defaultOpen: { type: Boolean, default: false },
  /** 'normal' | 'outlined' | 'filled' | 'underlined' | 'solo' | 'plain' */
  variant: { type: String, default: 'normal' },
  /** false = always show details row (reserves space) | true = never show | 'auto' = show only when there is a message */
  hideDetails: { type: [Boolean, String], default: false },
  /** Custom message(s) displayed in the details row */
  messages: { type: [String, Array], default: null },
  /** Hint text shown in the details row (lower priority than messages/errors) */
  hint: { type: String, default: null },
});
const emit = defineEmits(['update:modelValue', 'change']);

/* ---------- state ---------- */
const open = ref(props.defaultOpen);
const error = ref(false);
const wrapRef = ref(null);

const value = ref(props.mode === 'single' ? toDate(props.modelValue) : null);
const range = ref(
  props.mode === 'range' && Array.isArray(props.modelValue) && props.modelValue.length === 2
    ? [toDate(props.modelValue[0]), toDate(props.modelValue[1])]
    : [null, null]
);

const hoverDate = ref(null);
const viewDate = ref(startOfMonth(value.value || (range.value && range.value[0]) || new Date()));

const text = ref(value.value ? fmtDisplay(value.value, props.format) : '');
const textStart = ref(range.value[0] ? fmtDisplay(range.value[0], props.format) : '');
const textEnd = ref(range.value[1] ? fmtDisplay(range.value[1], props.format) : '');
const activeRangeField = ref('start');

const placeholderText = computed(() => props.placeholder || props.format);
const shortcuts = computed(() => buildShortcuts(props.mode));

const isFloating = computed(() => {
  if (props.variant === 'normal') return false;
  if (props.mode === 'single') return open.value || !!value.value || !!text.value;
  return open.value || !!range.value[0] || !!range.value[1] || !!textStart.value || !!textEnd.value;
});

const detailMessages = computed(() => {
  if (error.value) return [`Couldn't read that date. Try ${props.format}.`];
  if (props.messages) return Array.isArray(props.messages) ? props.messages : [props.messages];
  if (props.hint) return [props.hint];
  return [];
});

const showDetails = computed(() => {
  if (props.hideDetails === true) return false;
  if (props.hideDetails === 'auto') return detailMessages.value.length > 0;
  return true;
});

/* ---------- v-model sync ---------- */
watch(() => props.modelValue, (v) => {
  if (props.mode === 'single') {
    const d = toDate(v);
    value.value = d;
    text.value = d ? fmtDisplay(d, props.format) : '';
    if (d) viewDate.value = startOfMonth(d);
  } else if (Array.isArray(v)) {
    const a = toDate(v[0]); const b = toDate(v[1]);
    range.value = [a, b];
    textStart.value = a ? fmtDisplay(a, props.format) : '';
    textEnd.value = b ? fmtDisplay(b, props.format) : '';
    if (a) viewDate.value = startOfMonth(a);
  }
});

function emitValue() {
  if (props.mode === 'single') {
    const out = value.value ? ymd(value.value) : null;
    emit('update:modelValue', out);
    emit('change', out);
  } else {
    const out = [
      range.value[0] ? ymd(range.value[0]) : null,
      range.value[1] ? ymd(range.value[1]) : null,
    ];
    emit('update:modelValue', out);
    emit('change', out);
  }
}

/* ---------- outside click ---------- */
function onDocDown(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) open.value = false;
}
onMounted(() => document.addEventListener('mousedown', onDocDown));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocDown));

/* ---------- pick handlers ---------- */
function onPick(d) {
  error.value = false;
  if (props.mode === 'single') {
    value.value = d;
    text.value = fmtDisplay(d, props.format);
    viewDate.value = startOfMonth(d);
    emitValue();
    open.value = false;
  } else {
    const [s, e] = range.value;
    if (!s || (s && e)) {
      range.value = [d, null];
      textStart.value = fmtDisplay(d, props.format);
      textEnd.value = '';
      activeRangeField.value = 'end';
    } else {
      const next = d < s ? [d, s] : [s, d];
      range.value = next;
      textStart.value = fmtDisplay(next[0], props.format);
      textEnd.value = fmtDisplay(next[1], props.format);
      activeRangeField.value = 'start';
      open.value = false;
    }
    emitValue();
  }
}

function applyShortcut(sc) {
  error.value = false;
  if (props.mode === 'single') {
    value.value = sc.date;
    text.value = fmtDisplay(sc.date, props.format);
    viewDate.value = startOfMonth(sc.date);
    emitValue();
    open.value = false;
  } else {
    range.value = [...sc.range];
    textStart.value = fmtDisplay(sc.range[0], props.format);
    textEnd.value = fmtDisplay(sc.range[1], props.format);
    viewDate.value = startOfMonth(sc.range[0]);
    emitValue();
    open.value = false;
  }
}

function isShortcutActive(sc) {
  if (props.mode === 'single') return value.value && sameDay(value.value, sc.date);
  return range.value[0] && range.value[1]
    && sameDay(range.value[0], sc.range[0])
    && sameDay(range.value[1], sc.range[1]);
}

/* ---------- text input ---------- */
function onTextBlur() {
  if (text.value === '') { value.value = null; error.value = false; emitValue(); return; }
  const d = parseDisplay(text.value, props.format);
  if (d) {
    value.value = d;
    viewDate.value = startOfMonth(d);
    error.value = false;
    emitValue();
  } else {
    error.value = true;
  }
}

function onRangeTextBlur(which) {
  const t = which === 'start' ? textStart.value : textEnd.value;
  const idx = which === 'start' ? 0 : 1;
  if (t === '') {
    const next = [...range.value]; next[idx] = null; range.value = next;
    error.value = false; emitValue(); return;
  }
  const d = parseDisplay(t, props.format);
  if (!d) { error.value = true; return; }
  let next = [...range.value]; next[idx] = d;
  if (next[0] && next[1] && next[1] < next[0]) next = [next[1], next[0]];
  range.value = next;
  textStart.value = next[0] ? fmtDisplay(next[0], props.format) : '';
  textEnd.value = next[1] ? fmtDisplay(next[1], props.format) : '';
  if (next[idx]) viewDate.value = startOfMonth(next[idx]);
  error.value = false;
  emitValue();
}

/* ---------- auto-slash while typing ---------- */
// For a single-digit segment: month auto-slashes when n >= 2 (can't be 10-12),
// day auto-slashes when n >= 4 (can't be 30/31). At 2 digits we always slash.
function autoSlash(prev, curr, fmt) {
  if (curr.length <= prev.length) return curr; // deletion / paste-shrink
  const parts = curr.split('/');
  const segIdx = parts.length - 1;
  if (segIdx >= 2) return curr; // year segment, no auto-slash
  const seg = parts[segIdx];
  const isMonthSeg = (fmt === 'dd/mm/yyyy' && segIdx === 1) || (fmt === 'mm/dd/yyyy' && segIdx === 0);
  const isDaySeg   = (fmt === 'dd/mm/yyyy' && segIdx === 0) || (fmt === 'mm/dd/yyyy' && segIdx === 1);

  if (seg.length === 2 && /^\d{2}$/.test(seg)) {
    return parts.slice(0, segIdx).concat([seg]).join('/') + '/';
  }
  if (seg.length === 1 && /^\d$/.test(seg)) {
    const n = +seg;
    if ((isMonthSeg && n >= 2) || (isDaySeg && n >= 4)) {
      return parts.slice(0, segIdx).concat(['0' + seg]).join('/') + '/';
    }
  }
  return curr;
}

function onTextInputAuto(e) {
  error.value = false;
  const prev = text.value;
  const curr = e.target.value;
  const next = autoSlash(prev, curr, props.format);
  if (next !== curr) {
    e.target.value = next;
    text.value = next;
  } else {
    text.value = curr;
  }
}

function onRangeInputAuto(which, e) {
  error.value = false;
  const ref_ = which === 'start' ? textStart : textEnd;
  const prev = ref_.value;
  const curr = e.target.value;
  const next = autoSlash(prev, curr, props.format);
  if (next !== curr) {
    e.target.value = next;
    ref_.value = next;
  } else {
    ref_.value = curr;
  }
}

function clearAll() {
  value.value = null;
  range.value = [null, null];
  text.value = ''; textStart.value = ''; textEnd.value = '';
  error.value = false;
  emitValue();
}
</script>

<template>
  <div :class="['dp', `dp--${theme}`, `dp--variant-${variant}`, { [`dp--mode-${mode}`]: true }]" ref="wrapRef">
    <label v-if="variant === 'normal'" class="dp__label">{{ label }}</label>

    <!-- single input -->
    <div
      v-if="mode === 'single'"
      class="dp__field"
      :class="{ 'is-error': error, 'is-open': open, 'is-floated': isFloating }"
      :style="bgColor ? { background: bgColor } : undefined"
    >
      <!--
        Outlined draws its border as three segments with a gap for the floated
        label, the way Vuetify's v-field does, rather than as a full box with
        the label sitting on an opaque patch -- a patch only ever matches a
        host whose surface happens to equal --dp-bg-1.
      -->
      <div v-if="variant === 'outlined'" class="dp__outline" aria-hidden="true">
        <div class="dp__outlineStart"></div>
        <div class="dp__outlineNotch"><span>{{ label }}</span></div>
        <div class="dp__outlineEnd"></div>
      </div>
      <label
        v-if="variant !== 'normal'"
        class="dp__label"
        :class="{ 'is-floated': isFloating, 'is-active': open }"
      >{{ label }}</label>
      <component :is="icon" v-if="icon" class="dp__icon" />
      <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5" />
        <path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" />
      </svg>
      <input
        :value="text"
        class="dp__input"
        :placeholder="variant !== 'normal' && !isFloating ? '' : placeholderText"
        inputmode="numeric"
        maxlength="10"
        @focus="open = true"
        @blur="onTextBlur"
        @input="onTextInputAuto"
      />
      <button
        v-if="clearable && (value || text)"
        class="dp__clear"
        @mousedown.prevent="clearAll"
        aria-label="Clear"
      >×</button>
    </div>

    <!-- range input -->
    <div
      v-else
      class="dp__field dp__field--range"
      :class="{ 'is-error': error, 'is-open': open, 'is-floated': isFloating }"
      :style="bgColor ? { background: bgColor } : undefined"
    >
      <!--
        Outlined draws its border as three segments with a gap for the floated
        label, the way Vuetify's v-field does, rather than as a full box with
        the label sitting on an opaque patch -- a patch only ever matches a
        host whose surface happens to equal --dp-bg-1.
      -->
      <div v-if="variant === 'outlined'" class="dp__outline" aria-hidden="true">
        <div class="dp__outlineStart"></div>
        <div class="dp__outlineNotch"><span>{{ label }}</span></div>
        <div class="dp__outlineEnd"></div>
      </div>
      <label
        v-if="variant !== 'normal'"
        class="dp__label"
        :class="{ 'is-floated': isFloating, 'is-active': open }"
      >{{ label }}</label>
      <component :is="icon" v-if="icon" class="dp__icon" />
      <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5" />
        <path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" />
      </svg>
      <input
        :value="textStart"
        class="dp__input"
        :class="{ 'is-focus': activeRangeField === 'start' && open }"
        :placeholder="variant !== 'normal' && !isFloating ? '' : placeholderText"
        inputmode="numeric"
        maxlength="10"
        @focus="open = true; activeRangeField = 'start'"
        @blur="onRangeTextBlur('start')"
        @input="onRangeInputAuto('start', $event)"
      />
      <span class="dp__sep">→</span>
      <input
        :value="textEnd"
        class="dp__input"
        :class="{ 'is-focus': activeRangeField === 'end' && open }"
        :placeholder="variant !== 'normal' && !isFloating ? '' : placeholderText"
        inputmode="numeric"
        maxlength="10"
        @focus="open = true; activeRangeField = 'end'"
        @blur="onRangeTextBlur('end')"
        @input="onRangeInputAuto('end', $event)"
      />
      <button
        v-if="clearable && (range[0] || range[1] || textStart || textEnd)"
        class="dp__clear"
        @mousedown.prevent="clearAll"
        aria-label="Clear"
      >×</button>
    </div>

    <div v-if="showDetails" class="dp__details" :class="{ 'is-error': error, 'is-hint': !error && detailMessages.length }">
      <span v-for="(msg, i) in detailMessages" :key="i">{{ msg }}</span>
    </div>

    <!-- panel -->
    <div v-if="open" class="dp__panel" :class="{ 'dp__panel--range': mode === 'range' }">
      <!-- range: shortcuts as a left sidebar -->
      <div v-if="mode === 'range'" class="dp__scCol">
        <button
          v-for="sc in shortcuts"
          :key="sc.id"
          class="dp__scChip"
          :class="{ 'is-active': isShortcutActive(sc) }"
          @click="applyShortcut(sc)"
        >{{ sc.label }}</button>
      </div>

      <div class="dp__panelBody">
        <MonthCalendar
          :view-date="viewDate"
          :mode="mode"
          :value="value"
          :range="range"
          :hover-date="hoverDate"
          @update:viewDate="viewDate = $event"
          @update:hoverDate="hoverDate = $event"
          @pick="onPick"
        />
        <!-- single: shortcuts below the calendar -->
        <div v-if="mode !== 'range'" class="dp__scRow">
          <button
            v-for="sc in shortcuts"
            :key="sc.id"
            class="dp__scChip"
            :class="{ 'is-active': isShortcutActive(sc) }"
            @click="applyShortcut(sc)"
          >{{ sc.label }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
