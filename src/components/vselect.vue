<template>
  <div class="inputCss">
    <span>{{props.config.label}}</span>
    <span v-if="props.config.selectType=='pulldown'">
      <select v-model="fieldValue" @change="setFieldValue" :class="props.config.selectStyle || 'mr-[10px] text-lg'">
        <option v-for="opt in props.config.selectOptions" :value="opt.value">{{opt.label}}</option>
      </select>
    </span>
    <span v-if="props.config.selectType=='scroll'">
      <select class="optStyleScroll"  v-model="fieldValue" @change="setFieldValue" :size="props.config.selectSize" :multiple="props.config.selectMultiple"  :class="props.config.selectStyle || 'mr-[10px] text-lg'">
        <option v-for="opt in props.config.selectOptions" :value="opt.value">{{opt.label}}</option>
      </select>
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

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}

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
const setFieldValue= function(){
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
.optStyleScroll {
  option:hover {
    background-color: green;
  }
}

</style>

