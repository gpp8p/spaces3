<template>
  <span :style="cellCss"
        v-on:mousedown="mouseDown"
        v-on:mousemove="mouseOver"
        v-on:mouseup="mouseUp">

  </span>
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


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
//debugger;
const name = props.config.cell_parameters.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
const cellCss = ref('');

const thisCellAddress = ref('');


if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}

const handleCmd = function(args){
  //console.log('handleCmd-', name, args);
//  debugger;
  if(name==args[2] || args[2]=='*') {
    if(typeof(funcs[args[0]])!='undefined'){
      //console.log('Found func-', args[1]);
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
funcs[c.SET_CELL] = function(cmd){
 // debugger;
  //console.log('in SET_CELL-', cmd);
  var thisCellStyle = props.config.cell_parameters.gridCss+";"+"background-color:"+cmd[1]+";";
  cellCss.value = thisCellStyle;
  //console.log('cellCss now', cellCss.value);

}

onMounted(() => {
  // debugger;
//  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
  cellCss.value = props.config.cell_parameters.style;
  console.log("cellCss-",cellCss.value);
  thisCellAddress.value = cellAddress(props.config.cell_position[1], props.config.cell_position[0]);
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, thisCellAddress.value]);
//  emit('cevt', ['setPageCmdHandler', handleCmd, name, thisCellAddress]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

const mouseUp = function(evt){
  console.log('mouseUp -', thisCellAddress.value );
  emit('cevt', [c.MOUSE_EVT, c.MOUSE_UP, thisCellAddress.value, props.config.cell_position[1], props.config.cell_position[0]]);
}

const mouseDown = function(evt){
  // console.log('mouseDown -', thisCellAddress.value );
  emit('cevt', [c.MOUSE_EVT, c.MOUSE_DOWN, thisCellAddress.value, props.config.cell_position[1], props.config.cell_position[0]]);
}
const mouseOver = function(evt){
  //console.log('mouseOver -', thisCellAddress.value );
  emit('cevt', [c.MOUSE_EVT, c.MOUSE_OVER, thisCellAddress.value, props.config.cell_position[1], props.config.cell_position[0]]);
}

const cellAddress = function(x,y){
  //debugger;
  var zeros='000000';
  var addrX = x.toString();
  var addrY = y.toString();
  addrX = zeros+addrX;
  addrY = zeros+addrY;
  return addrX.slice(-4)+addrY.slice(-4);
}

</script>

<style scoped>


</style>

