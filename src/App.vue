<template>
  <div class="w-screen h-screen">
    <spFrame @cevt="handleEvent($event, funcs, emit)" />
    <spDialog1 v-if="showDialog" @cevt="handleEvent($event, funcs, emit)" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {c} from "./components/constants.js";
import spFrame from './components/spFrame.vue';
import spDialog1 from './components/spDialog1.vue';

const emit = defineEmits(['cevt']);

import {useEventHandler} from "./components/eventHandler.js";
const {handleEvent} = useEventHandler();

const cmdHandlers = {}
const funcs = [];
funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in UNSET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

const showDialog = ref(true);
</script>
