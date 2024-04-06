<template>
  <div @click="toggleSubItems" class="relative text-lg text-blue-500 hover:text-red-500 cursor-pointer">
    <span>{{ config.label }}</span>
    <div
        v-if="showSubItems"
        @click.stop
        class="absolute z-50 bg-white opacity-100 border-solid border-2 border-indigo-600 w-20 text-lg text-blue-500  cursor-pointer"
    >
      <ul>
        <li
            v-for="(subItem, index) in config.subItems"
            :key="index"
            @click="emitActionCode(subItem.actionCode)"
            @mouseover="highlightSubItem(index)"
            @mouseleave="removeHighlight"
            :class="{ 'text-red-500': highlightedIndex === index }"
            class="cursor-pointer"
        >
          {{ subItem.subLabel }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'menuItemDrop',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const showSubItems = ref(false);
    const highlightedIndex = ref(null);

    const toggleSubItems = () => {
      showSubItems.value = !showSubItems.value;
    };

    const emitActionCode = (actionCode) => {
      emit('input', actionCode);
      showSubItems.value = false;
    };

    const highlightSubItem = (index) => {
      highlightedIndex.value = index;
    };

    const removeHighlight = () => {
      highlightedIndex.value = null;
    };

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.relative')) {
        showSubItems.value = false;
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return {
      showSubItems,
      highlightedIndex,
      toggleSubItems,
      emitActionCode,
      highlightSubItem,
      removeHighlight,
    };
  },
};
</script>

