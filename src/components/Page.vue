<template>
<h2>Page Component Here</h2>
</template>

<script setup>

import {whenever} from "@vueuse/core";

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
import {onMounted, onUnmounted, toRaw} from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {ref} from 'vue';

import {useCurrentPage} from "../stores/currentPage.js";
const pageStore = useCurrentPage();

import {useLogStateStore} from "../stores/logState.js";
const loginStore = useLogStateStore();

import {getTrans} from "./dbTrans.js";
const {executeTrans} = getTrans();


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}


//load the page data using page id from pageStore

const fieldValue = ref('');
const loginResult= toRaw(loginStore.loginStatus);
const parms   = {
  orgId:loginResult.orgId,
  userId:loginResult.userId,
  layoutId:pageStore.getCurrentPageId,
}
console.log('page parms-', parms);
const header = '';
const dataReady = ref(false);
const transResult = ref({});
executeTrans(parms, c.TRANS_GET_LAYOUT,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, fieldValue);
whenever(dataReady, () => {
  debugger;
  console.log('data is ready-', transResult._rawValue);
  ready.value=true;
  fieldValue.value = {
    pageName: fieldValue._rawValue.layout.menu_label,
    pageDescription: fieldValue._rawValue.layout.description,
    pageRows: fieldValue._rawValue.layout.height,
    pageColumns:fieldValue._rawValue.layout.width,
    pageBackground: {
      backgroundType: fieldValue._rawValue.layout.backgroundType,
      backgroundColor: fieldValue._rawValue.layout.backgroundColor,
      backgroundDisplay: fieldValue._rawValue.layout.backgroundDisplay,
      backgroundImageUrl: fieldValue._rawValue.layout.backgroundImageUrl
    },
    template:fieldValue._rawValue.layout.width.template
  }
})
//fieldValue.value = transResult.value;

/*
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
*/
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

