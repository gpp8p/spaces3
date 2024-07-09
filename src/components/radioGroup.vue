<template>
  <div class="inputCss">
    <span>{{props.config.label}}</span>
    <span>
      <span v-for="rad in props.config.radioButtons">
        <span v-if="props.config.orientation=='horozontal'">
            <span class="radioStyle">
              <input type="radio" class="radioStyle" :checked="rad.value==fieldValue" @click="setfieldValue(rad.value)" :name="props.config.name" :id="rad.value" >
            </span>
            <span :class="props.config.buttonLabelStyle || 'mr-[6px]'">
              <label :for="rad.value">{{rad.value}}</label>
            </span>
        </span>
        <span v-if="props.config.orientation=='vertical'">
            <span>
              <input type="radio" class="radioStyleV" :checked="rad.value==fieldValue" @click="setfieldValue(rad.value)" :name="props.config.name" :id="rad.value" >
            </span>
            <span :class="props.config.buttonLabelStyle || 'mr-[6px]'">
              <label :for="rad.value">{{rad.value}}</label>
            </span>
          <br/>
        </span>
      </span>
    </span>
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
const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
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
const setfieldValue=function(selectedValue){
  debugger;
  fieldValue.value=selectedValue;
  emit('cevt', [c.FIELD_CHANGED,  props.config.name, fieldValue.value]);
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

.radioStyle {
  display: inline;
  margin-right: 10px;
}
.radioStyleV {
  margin-top: 4px;
  margin-right: 10px;
}
</style>

