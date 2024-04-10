<template>
  <div class="w-screen h-screen">
    <spFrame />
    <spDialog1 v-if="showDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import spFrame from './components/spFrame.vue';
import spDialog1 from './components/spDialog1.vue';


const showDialog = ref(true);
</script>
