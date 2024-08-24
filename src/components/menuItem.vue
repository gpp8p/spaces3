<template>
  <div
      :class="config.tailwindStyle ? config.tailwindStyle : 'text-sm text-blue-500 hover:text-red-500 cursor-pointer'"
      @click="handleClick"
  >
    {{ config.label || 'Missing' }}
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {toRaw} from 'vue'

export default defineComponent({
  name: 'menuItem',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      debugger;
      if(typeof(toRaw(props.config.link))=='undefined'){
        emit('cevt', [props.config.actionCode]);
      }else{
        emit('cevt', [props.config.actionCode, props.config.link, props.config.external]);
      }
 //     emit('cevt', props.config.actionCode);
    };

    return {
      handleClick,
    };
  },
});
</script>
