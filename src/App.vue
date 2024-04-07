<template>
  <div class="flex flex-col h-screen p-1vh">
    <div class="w-98vw h-14-5vh mx-auto mb-1vh border-2 border-blue-500 bg-orange-100 rounded-lg"></div>
    <div class="w-98vw h-84-5vh mx-auto border-2 border-blue-500 bg-orange-100 rounded-lg"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const resizeHandler = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

onMounted(() => {
  resizeHandler();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
});
</script>

<style scoped>
.h-14-5vh {
  height: calc(var(--vh, 1vh) * 14.5);
}

.h-84-5vh {
  height: calc(var(--vh, 1vh) * 84.5);
}

.w-98vw {
  width: 98vw;
}

.p-1vh {
  padding-top: calc(var(--vh, 1vh) * 1);
  padding-bottom: calc(var(--vh, 1vh) * 1);
}

.mb-1vh {
  margin-bottom: calc(var(--vh, 1vh) * 1);
}
</style>
