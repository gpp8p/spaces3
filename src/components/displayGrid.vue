<template>
  <span :style="pageCss">
    <Card v-for="(aCard, i) in props.data"
          :key="i"
          :config="cardConfig"
          :data="aCard"
          @cevt="handleEvent($event, funcs, emit)"
          ></Card>
  </span>
</template>

<script setup>

import inputText from "./inputText.vue";

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data:{
    type: Object,
    required: true
  }
});


import Card from "../components/Card.vue";
import {c} from "../components/constants.js";
import { onMounted, onUnmounted } from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {ref} from 'vue';
import {usePageCss} from "../components/pageCss.js";
const {setupPageCss} = usePageCss();

import {toRaw} from 'vue';
import inputNumber from "./inputNumber.vue";
import inputCheckbox from "./inputCheckbox.vue";
import backgroundPicker from "./backgroundPicker.vue";
import radioGroup from "./radioGroup.vue";
import vselect from "./vselect.vue";
import vtextarea from "./vtextarea.vue";
import listTable from "./listTable.vue";
import htmlPasswordInput from "./htmlPasswordInput.vue";
console.log('config at open', toRaw(props.config));
const pageCss = setupPageCss(props.config);

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
const cardConfig = ref({});
cardConfig.value.mode = c.MODE_DISPLAY;

const handleCmd = function(args){
  console.log('handleCmd-', name, args);
  debugger;
  if(name==args[2] || args[2]=='*') {
    if(typeof(funcs[args[0]])!='undefined'){
      console.log('Found func-', args[1]);
      funcs[args[0]](args);
    }else{
      passCmdDown(args);
    }
  }else{
    passCmdDown(args);
  }
}
const passCmdDown = function(args){
  var availableHandlers = Object.keys(cmdHandlers);
  if(availableHandlers.length>0){
    for(var a=0;a<availableHandlers.length;a++){
//                debugger;
      cmdHandlers[availableHandlers[a]]([args[0], args[1], args[2]]);
    }
  }
}


funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

</script>

<style scoped>
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 40%;
}

</style>

