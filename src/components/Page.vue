<template>
  <displayGrid :config="fieldValue.layout" :data="fieldValue.cards" v-if="pageMode==c.PAGE_DISPLAY" :key="pageReload"/>
  <editGrid :config="fieldValue.layout" :data="fieldValue.cards" v-if="pageMode==c.PAGE_EDIT" :key="pageReload"/>
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
import displayGrid from "../components/displayGrid.vue";
import editGrid from "../components/editGrid.vue";


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
const pageMode = ref(0);
const contentDimensions = ref({});


//load the page data using page id from pageStore

const fieldValue = ref('');
const pageReload = ref(0);
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
//const ready = ref(false);
executeTrans(parms, c.TRANS_GET_LAYOUT,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
whenever(dataReady, () => {
  debugger;
  console.log('data is ready-', transResult);
  fieldValue.value = transResult.value;
  fieldValue.value.pageName=c.PAGE_DISPLAY_NAME;
  fieldValue.value.layout.pageDimensions=toRaw(props.config).pageDimensions;
  pageMode.value=c.PAGE_DISPLAY;
  pageReload.value+=1;
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
funcs[c.SET_CONTENT_DIMENSIONS]=function(evt){
  console.log('in SET_CONTENT_DIMENSIONS', evt);
//  contentDimensions.value = evt[1];

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

