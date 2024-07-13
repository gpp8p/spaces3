
<template>
  <span :class = dialogAppearence.twstyle>
    <span >
      <Fields :config="dialogFieldsConfig" :data = "dialogFeildsData" :key="reloadDialogFields" @cevt="handleEvent($event, funcs, emit)"></Fields>
    </span>
    <div :class="menuDefinitions.twStyling" >
      <dynamicMenu :config="menuDefinitions" :key = "reloadMenu" :data="menuData" @cevt="handleEvent($event, funcs, emit)" />
    </div>
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
//import {getHandleCmd} from "../components/cmdHandler.js";
//const {handleCmd} = getHandleCmd();

import {ref} from 'vue';

import inputText from "../components/inputText.vue";
import inputNumber from "../components/inputNumber.vue"
import inputCheckbox from "../components/inputCheckbox.vue"
import backgroundPicker from "../components/backgroundPicker.vue";
import radioGroup from "../components/radioGroup.vue";
import vselect from "../components/vselect.vue";
import vtextarea from "../components/vtextarea.vue"
import listTable from "../components/listTable.vue";
import htmlPasswordInput from '../components/htmlPasswordInput.vue';

import dynamicMenu from '../components/menu3.vue';
import Fields from '../components/dialogFields.vue';

debugger;
import {getDialogDefinitions} from "../components/dialogDefinitions2.js";


const {getDialogAppearence, getDialogFields, getDefaultData, getMenuDefinitions, getActions, getDialogParams} = getDialogDefinitions();
const dialogFields = getDialogFields(props.config.definition);
//const dialogFields = getDialogFields('loginDialog');
console.log('dialogFields-',dialogFields);

const dialogAppearence = getDialogAppearence(props.config.definition);
var menuDefinitions = getMenuDefinitions(props.config.definition);
var testVar = 'test var one';
const addActions = getActions(props.config.definition);
const existingData = getDefaultData(props.config.definition);

const dialogFieldsConfig = ref({});
dialogFieldsConfig.value.dialogFields = dialogFields;
dialogFieldsConfig.value.existingData = existingData;

const dialogFieldsData = ref({});

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = 'dialog'
const funcs = [];
const existingFuncs = [];
const cmdHandlers = {};
const menuData = {};
const reloadMenu = ref(0);
const reloadDialogFields = ref(0);

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


var dialogData = props.data;
const morphs = {
  inputText,
  inputNumber,
  inputCheckbox,
  backgroundPicker,
  radioGroup,
  vselect,
  vtextarea,
  listTable,
  htmlPasswordInput
}





//console.log("inpTestConfig-",inpTestConfig);



funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

funcs[c.FIELD_CHANGED]= function(evt){
  console.log('in c.FIELD_CHANGED-', evt);
  dialogData[evt[1]]=evt[2];
  debugger;
  if(typeof(funcs[c.FIELD_CHANGE_EVENT])!='undefined'){
    funcs[c.FIELD_CHANGE_EVENT](evt,emit, dialogData);
  }
}
funcs[c.CHANGE_MENU_CONFIGURATION]=function(evt){
  console.log('in dialog CHANGE_MENU_CONFIGURATION-', evt);
  debugger;
  menuDefinitions = getDialogParams(evt[1], "menu");
  reloadMenu.value += 1;
}


funcs[c.MENU_ITEM_SELECTED]= function(evt){
  console.log('in c.-MENU_ITEM_SELECTED', evt);
  debugger;
  funcs[evt[1]](emit, dialogData);
}
debugger;
addActions(funcs);
/*
funcs[c.MENU_ITEM_SELECTED] = function(evt){
  console.log('menu item selected', evt);
}
*/

onMounted(() => {
//  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
//  cmdHandlers['mainPage'](['createNewCard', msg[1], 'mainPage']);

})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

</script>

<style scoped>
.dynaComponentTest {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  height: 400px;
}
</style>


