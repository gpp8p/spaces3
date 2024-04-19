<template>
  <div class="fixed w-1/2 h-2/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black">
    <!-- Add dialog content here -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import {c} from "../components/constants.js";
import {useEventHandler} from "./eventHandler.js";


const emit = defineEmits(['cevt']);
const cmdHandlers = {}
const name = 'spDialog1'
const funcs = [];
const {handleEvent} = useEventHandler();


funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
const handleCmd = function(args){
  console.log('comp1 handleCmd-', args);
}
const handleResize = () => {
  // Add any necessary resize handling logic here
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
});
</script>
