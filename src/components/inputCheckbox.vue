<template>
  <div class="inputCss">
    <span>{{props.config.label}}</span>
    <span>
      <input type="checkbox" v-model = "fieldValue" :checked="fieldValue==true" @change="fieldChanged" />
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
const name = 'componentName'
const funcs = [];
const cmdHandlers = {}
const handleCmd = function(args){
  console.log('handleCmd-', name, args);
  if(name==args[2]) {
    if(typeof(funcs[args[0]]!='undefined')){
      console.log('Found func-', args[1]);
      funcs[args[0]](args);
    }
  }else{

  }
}
const fieldValue = ref(false);

if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}

funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
const fieldChanged = function(){
//  debugger;
  emit('cevt', [c.FIELD_CHANGED,  props.config.name, fieldValue.value]);
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

