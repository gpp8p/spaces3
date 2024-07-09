<template>
  <div class="inputCss">
      <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
      <span>
        <input type="text"
               :class="props.config.tailwindStyle || 'text-lg outline outline-2 outline-blue-500 focus:outline-red-500 hover:outline-red-500 rounded'"
               :size = "props.config.size"
               :value = "fieldValue"
               v-model = "fieldValue"
               :placeholder = "fieldPlaceholder"
               :maxlength="props.config.maxlength"
               :readonly="noChange"
               @keydown.tab="checkInputOnTab"
               ref="thisInput"
        />
      </span>

  </div>
</template>

<script setup>
debugger;
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
import {ref, nextTick } from 'vue';
//import {getHandleCmd} from "../components/cmdHandler.js";
//const {handleCmd} = getHandleCmd();


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}



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


const fieldPlaceholder = ref('');
const fieldValue = ref('');

if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}else if(typeof(props.config.placeholder)!='undefined'){
  fieldPlaceholder.value = props.config.placeholder;
}

const noChange = ref(false);
if(typeof(props.config.readonly)=='undefined'){
  noChange.value = false;
}else{
  noChange.value = props.config.readonly;
}

const thisInput = ref(null);
if(props.config.startFocus==true){
  debugger;


  nextTick(() => {
    thisInput.value.focus();
  });

}
const checkInputOnTab = function($event){
  console.log("checkInputOnTab called", event);
  debugger;
  if(typeof(props.config.required)!='undefined' && props.config.required==true){
    if (fieldValue.value.trim()== '') {
      console.log('No entry in the input field');
      // Perform any other actions for no entry
      alert('entry required');
      event.preventDefault(); // Prevent the default tab behavior if needed
    } else {
      console.log('Input value:', fieldValue.value);
      // Perform actions with the input value
      emit('cevt', [c.FIELD_CHANGED,  props.config.name, fieldValue.value]);

    }
  }else{
    console.log('Input value:', fieldValue.value);
    // Perform actions with the input value
    emit('cevt', [c.FIELD_CHANGED,  props.config.name, fieldValue.value]);
  }
}

const focusChanged = function(){
  console.log('focus changed');
}

const handleInput = (event) =>{
  debugger;
  if(fieldValue.value.length==0){
    debugger;
    nextTick(() => {
      thisInput.value.focus();
    });
  }
  console.log('handleInput-',event);
  console.log('fieldValue-', fieldValue.value);
}



funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
funcs[c.CMD_SET_VALUE]= function(evt){
  console.log(props.config.name+' CMD_SET_VALUE-', evt[2]);
}

onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
//  startField.value.focus();
  /*
    var input = inputs['f2']?.value;
    input?.focus();
    emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
   */
  const setFocusHere = function(){
    nextTick(() => {
      thisInput.value.focus();
    });
  }

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

