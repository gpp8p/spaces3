<template>
  <div

      @click="handleClick"
  >
    {{ config.label || 'Missing' }}
  </div>
</template>

<script setup>
//debugger;
const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data:{
    type: Object,
    required: false
  }
});



import {c} from "../components/constants.js";
import {onMounted, onUnmounted, toRaw} from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {ref} from 'vue';


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
/*
const handleClick = function(){
//  debugger;
  emit('cevt', [c.MENU_ITEM_SELECTED, props.config.actionCode]);
}
*/
const handleClick = () => {
  //debugger;
  if(typeof(toRaw(props.config.link))=='undefined'){
    //emit('cevt', [props.config.actionCode]);
    emit('cevt', [c.MENU_ITEM_SELECTED, props.config.actionCode]);
  }else{
    emit('cevt', [props.config.actionCode, props.config.link, props.config.external, props.config.link_url]);
  }
  //     emit('cevt', props.config.actionCode);
};

const handleCmd = function(args){
  console.log('handleCmd-', name, args);
  // debugger;
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
  //debugger;
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

