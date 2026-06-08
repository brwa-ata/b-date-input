<script setup>
import { ref } from "vue";
import DateInput from "./DateInput.vue";

const single = ref(null);
const rangeVal = ref([null, null]);
const theme = ref("dark");
</script>

<template>
  <div :class="['demo', `demo--${theme}`]">
    <header class="demo__bar">
      <h1>Vue Date Input</h1>
      <button
        class="demo__toggle"
        @click="theme = theme === 'dark' ? 'light' : 'dark'"
      >
        Switch to {{ theme === "dark" ? "light" : "dark" }}
      </button>
    </header>

    <section class="demo__grid">
      <div class="demo__card">
        <p class="demo__variant-label">normal (default)</p>
        <DateInput
          v-model="single"
          :theme="theme"
          label="Single date"
          variant="normal"
        />
        <pre>{{ single }}</pre>
      </div>

      <div class="demo__card">
        <p class="demo__variant-label">outlined</p>
        <DateInput
          v-model="single"
          :theme="theme"
          label="Single date"
          variant="outlined"
        />
      </div>

      <div class="demo__card">
        <p class="demo__variant-label">filled</p>
        <DateInput
          v-model="single"
          :theme="theme"
          label="Single date"
          variant="filled"
        />
      </div>

      <div class="demo__card">
        <p class="demo__variant-label">underlined</p>
        <DateInput
          v-model="single"
          :theme="theme"
          label="Single date"
          variant="underlined"
        />
      </div>

      <div class="demo__card">
        <p class="demo__variant-label">solo</p>
        <DateInput
          v-model="single"
          :theme="theme"
          label="Single date"
          variant="solo"
        />
      </div>

      <div class="demo__card">
        <p class="demo__variant-label">plain</p>
        <DateInput
          v-model="single"
          :theme="theme"
          label="Single date"
          variant="plain"
        />
      </div>

      <div class="demo__card">
        <p class="demo__variant-label">range — normal</p>
        <DateInput
          v-model="rangeVal"
          mode="range"
          :theme="theme"
          label="Date range"
          variant="normal"
        />
        <pre>{{ rangeVal }}</pre>
      </div>
    </section>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  margin: 0;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.demo {
  min-height: 100vh;
  padding: 32px;
}
.demo--dark {
  background: #0f1115;
  color: #e7e9ee;
}
.demo--light {
  background: #f7f7f9;
  color: #1a1c20;
}
.demo__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.demo__bar h1 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}
.demo__toggle {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
}
.demo__grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  max-width: 1100px;
}
.demo__card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(127, 127, 127, 0.25);
}
.demo__card pre {
  margin: 12px 0 0;
  font-size: 11px;
  opacity: 0.7;
  white-space: pre-wrap;
  word-break: break-word;
}
.demo__variant-label {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 600;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
