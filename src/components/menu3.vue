<template>
  <div :class="orientClass||'flex justify-evenly'">
    <component
        v-for="(item, index) in props.config.items"
        :key="index"
        :is="morphs[item.type]"
        :config="item.config"
        @cevt="handleEvent($event, funcs, emit)"
    ></component>
  </div>
</template>

<script setup>

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



import {c} from "../components/constants.js";
import { onMounted, onUnmounted } from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {ref} from 'vue';
import {toRaw} from 'vue';
import menuItem from './menuItem1.vue';
import menuItemDrop from '../components//menuItemDrop.vue';

//debugger;
const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}

console.log('menu orient-', toRaw(props.config.orient));
const orientClass = ref('');
if(props.config.orient=='vertical'){
  orientClass.value = 'flex justify-evenly flex-col ml-2 mt-5';
}else{
  if(typeof(props.config.mStyle)== 'undefined'){
    orientClass.value = 'flex justify-evenly';
  }else{
    orientClass.value = props.config.mStyle;
  }
}

const handleCmd = function(args){
  console.log('handleCmd-', name, args);
  //debugger;
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
funcs[c.CARD_MENU_CONFIGURE] = function(evt){
  debugger;
  emit('cevt', [c.MENU_ITEM_SELECTED, evt[0]]);
}
funcs[c.CARD_MENU_EDIT] = function(evt){
  emit('cevt', [c.MENU_ITEM_SELECTED, evt[0]]);
}
funcs[c.CARD_MENU_EXIT] = function(evt){
  emit('cevt', [c.MENU_ITEM_SELECTED, evt[0]]);
}

onMounted(() => {
  //debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})
const morphs = {
  menuItem,
  menuItemDrop
}

</script>

<style scoped>
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 40%;
}

</style>

