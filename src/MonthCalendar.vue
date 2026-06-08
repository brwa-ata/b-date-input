<script setup>
import { ref, computed } from "vue";
import {
  MONTHS,
  MONTHS_SHORT,
  DOW,
  buildMonthGrid,
  addMonths,
  sameDay,
  startOfDay,
} from "./utils/date.js";

const props = defineProps({
  viewDate: { type: Date, required: true },
  mode: { type: String, default: "single" },
  value: { type: Date, default: null },
  range: { type: Array, default: () => [null, null] },
  hoverDate: { type: Date, default: null },
});
const emit = defineEmits(["update:viewDate", "update:hoverDate", "pick"]);

const openSelect = ref(null);
const today = startOfDay(new Date());

const cells = computed(() => buildMonthGrid(props.viewDate));
const years = computed(() => {
  const y = props.viewDate.getFullYear();
  return Array.from({ length: 21 }, (_, i) => y - 10 + i);
});

function inRange(d) {
  if (props.mode !== "range" || !props.range[0]) return false;
  const start = props.range[0];
  const e = props.range[1] || props.hoverDate;
  if (!e) return false;
  const lo = start < e ? start : e;
  const hi = start < e ? e : start;
  return d >= startOfDay(lo) && d <= startOfDay(hi);
}

function setView(d) {
  emit("update:viewDate", d);
}
function selectMonth(i) {
  setView(new Date(props.viewDate.getFullYear(), i, 1));
  openSelect.value = null;
}
function selectYear(y) {
  setView(new Date(y, props.viewDate.getMonth(), 1));
  openSelect.value = null;
}
function cellClass(d) {
  const isCur = d.getMonth() === props.viewDate.getMonth();
  const isToday = sameDay(d, today);
  const isSel =
    props.mode === "single"
      ? sameDay(d, props.value)
      : sameDay(d, props.range[0]) || sameDay(d, props.range[1]);
  const isStart = props.mode === "range" && sameDay(d, props.range[0]);
  const isEnd =
    props.mode === "range" &&
    (sameDay(d, props.range[1]) ||
      (!props.range[1] && sameDay(d, props.hoverDate)));
  return {
    "is-out": !isCur,
    "is-today": isToday,
    "is-sel": isSel,
    "is-start": isStart,
    "is-end": isEnd,
    "is-in-range": inRange(d),
  };
}
</script>

<template>
  <div class="mc">
    <div class="mc__head">
      <button
        class="mc__nav"
        @click="setView(addMonths(viewDate, -1))"
        aria-label="Previous month"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10 12L6 8L10 4" />
        </svg>
      </button>

      <div class="mc__selectors">
        <button
          class="mc__sel"
          @click="openSelect = openSelect === 'm' ? null : 'm'"
        >
          {{ MONTHS[viewDate.getMonth()] }}
          <svg
            width="9"
            height="9"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="transform: rotate(-90deg)"
          >
            <path d="M10 12L6 8L10 4" />
          </svg>
        </button>

        <button
          class="mc__sel mc__sel--year"
          @click="openSelect = openSelect === 'y' ? null : 'y'"
        >
          {{ viewDate.getFullYear() }}
          <svg
            width="9"
            height="9"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="transform: rotate(-90deg)"
          >
            <path d="M10 12L6 8L10 4" />
          </svg>
        </button>

        <div v-if="openSelect === 'm'" class="mc__pop">
          <button
            v-for="(m, i) in MONTHS_SHORT"
            :key="m"
            class="mc__popItem"
            :class="{ 'is-active': i === viewDate.getMonth() }"
            @click="selectMonth(i)"
          >
            {{ m }}
          </button>
        </div>
        <div v-else-if="openSelect === 'y'" class="mc__pop mc__pop--year">
          <button
            v-for="y in years"
            :key="y"
            class="mc__popItem"
            :class="{ 'is-active': y === viewDate.getFullYear() }"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>
      </div>

      <button
        class="mc__nav"
        @click="setView(addMonths(viewDate, 1))"
        aria-label="Next month"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="transform: rotate(180deg)"
        >
          <path d="M10 12L6 8L10 4" />
        </svg>
      </button>
    </div>

    <div class="mc__dow">
      <div v-for="(d, i) in DOW" :key="i" class="mc__dowCell">{{ d }}</div>
    </div>

    <div class="mc__grid">
      <button
        v-for="(d, i) in cells"
        :key="i"
        class="mc__cell"
        :class="cellClass(d)"
        @click="emit('pick', d)"
        @mouseenter="emit('update:hoverDate', d)"
      >
        <span>{{ d.getDate() }}</span>
      </button>
    </div>
  </div>
</template>
