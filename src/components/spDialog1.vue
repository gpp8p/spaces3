<template>
  <div class="fixed w-1/2 h-2/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black">
    <!-- Add dialog content here -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const handleResize = () => {
  // Add any necessary resize handling logic here
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
