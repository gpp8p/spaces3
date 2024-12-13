
<template>
  <span :class = dialogAppearence.twstyle>
    <span >
      <Fields :config="dialogFieldsConfig" :data = "dialogFieldsData" :key="reloadDialogFields" @cevt="handleEvent($event, funcs, emit)"></Fields>
    </span>
    <div :class="menuDefinitions.twStyling" >
      <dynamicMenu :config="menuDefinitions" :key = "reloadMenu" :data="menuData" @cevt="handleEvent($event, funcs, emit)" />
    </div>
  </span>
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
import { onMounted, onUnmounted } from 'vue'
import {useEventHandler} from "./eventHandler.js";
//import {getHandleCmd} from "../components/cmdHandler.js";
//const {handleCmd} = getHandleCmd();

import {ref} from 'vue';
import {toRaw} from 'vue'

import inputText from "../components/inputText.vue";
import inputNumber from "../components/inputNumber.vue"
import inputCheckbox from "../components/inputCheckbox.vue"
import backgroundPicker from "../components/backgroundPicker.vue";
import radioGroup from "../components/radioGroup.vue";
import vselect from "../components/vselect.vue";
import vtextarea from "../components/vtextarea.vue"
import listTable from "../components/listTable.vue";
import htmlPasswordInput from '../components/htmlPasswordInput.vue';
import textLiteral from "../components/textLiteral.vue";
import borderPicker from "../components/borderPicker.vue";
import fontPicker from "../components/fontPicker.vue";



import dynamicMenu from '../components/menu3.vue';
import Fields from '../components/dialogFields.vue';

import {useLogStateStore} from "../stores/logState.js";
//debugger;
import {getDialogDefinitions} from "../components/dialogDefinitions2.js";


const {getDialogAppearence, getDialogFields, getDefaultData, getDialogData, getMenuDefinitions, getActions, getDialogParams} = getDialogDefinitions();
const dialogFields = getDialogFields(props.config.definition);
//const dialogFields = getDialogFields('loginDialog');
console.log('dialogFields-',dialogFields);

const dialogAppearence = getDialogAppearence(props.config.definition);
var menuDefinitions = getMenuDefinitions(props.config.definition);
var testVar = 'test var one';
var addActions = getActions(props.config.definition);
const emit = defineEmits(['cevt']);
const dialogFieldsData = ref({});
var currentDialogDataLoader = getDialogData(props.config.definition);
var existingData;
var dialogData={};
const dialogFieldsConfig = ref({});
dialogFieldsConfig.value.name='Fields';
if(typeof(props.config.id)!='undefined'){
  dialogFieldsConfig.value.id=props.config.id;
}
const store = useLogStateStore();
const ready = ref(false);
const result = ref({});
console.log('dialog4 loginInfo-', store.loginStatus);
debugger;
if(typeof(currentDialogDataLoader)=='function'){
  //debugger;

  currentDialogDataLoader(emit, c, store, ready, result, props.config);
  console.log('loader ready',ready);
  if(ready.value==false){
    whenever(ready, () => {
      debugger;
      existingData = toRaw(result.value);
      console.log('existingData loaded',existingData);
      dialogFieldsConfig.value.dialogFields = dialogFields;
//      dialogFieldsConfig.value.existingData = existingData;
      dialogFieldsData.value = existingData;
 //     dialogData = existingData;
//    reloadDialogFields+=1;

    })
  }else{
    existingData = toRaw(result.value);
    console.log('existingData loaded',existingData);
    dialogFieldsConfig.value.dialogFields = dialogFields;
//    dialogFieldsConfig.value.existingData = existingData;
    dialogFieldsData.value = existingData;
  }


}else{
  existingData = getDefaultData(props.config.definition);
  dialogFieldsConfig.value.dialogFields = dialogFields;
  dialogFieldsConfig.value.existingData = existingData;
  dialogFieldsData.value = existingData;
  dialogData.value = existingData;
}


dialogFieldsData.value.id = props.config.id;
//const dialogFieldsConfig = ref({});

//debugger;

const {handleEvent} = useEventHandler();

const name = 'dialog'
const funcs = [];
const existingFuncs = [];
const cmdHandlers = {};
const menuData = {};
const reloadMenu = ref(0);
const reloadDialogFields = ref(0);

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

const changeDialog = function(dialogDefinition){
  console.log('changeDialogCalled');
  ready.value=false;
  debugger;
  currentDialogDataLoader = getDialogData(dialogDefinition);
  currentDialogDataLoader(emit, c, store, ready, result, props.config);
  const addLinkDialogFields = getDialogFields(dialogDefinition);
  console.log('dialogFields-', addLinkDialogFields);
  debugger;
  console.log('loader ready b',ready);
  if(ready.value==false){
    whenever(ready, () => {
      debugger;
      existingData = toRaw(result.value);
      console.log('existingData loaded b',existingData, dialogFields);
      dialogFieldsConfig.value.dialogFields = {
        dialogFields: addLinkDialogFields,
        name: 'Fields'
      };

      //dialogFieldsConfig.value.dialogFields = dialogFields;
//      dialogFieldsConfig.value.existingData = existingData;
      dialogFieldsData.value = existingData;
      //     dialogData = existingData;
//    reloadDialogFields+=1;

    })
  }else{
    debugger;
    existingData = toRaw(result.value);
    console.log('existingData loaded',existingData);
    //dialogFieldsConfig.value.dialogFields = addLingDialogFields;
//    dialogFieldsConfig.value.dialogFields = dialogFields;
//    dialogFieldsConfig.value.existingData = existingData;
    dialogFieldsConfig.value = {
      dialogFields: addLinkDialogFields,
      name: 'Fields'
    };
    dialogFieldsData.value = existingData;
    addActions = getActions('addPageLinks');
    addActions(funcs);

  }
  dialogFieldsData.value.id = props.config.id;
  reloadDialogFields.value +=1;


}



const morphs = {
  inputText,
  inputNumber,
  inputCheckbox,
  backgroundPicker,
  radioGroup,
  vselect,
  vtextarea,
  listTable,
  htmlPasswordInput,
  textLiteral,
  borderPicker,
  fontPicker
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
  debugger;
  dialogData[evt[1]]=evt[2];
  if(typeof(cmdHandlers['Fields'])!='undefined'){
    cmdHandlers['Fields']([c.FIELD_CHANGE_ALERT, [evt[1],evt[2]], "*"]);
  }
  if(typeof(funcs[c.FIELD_CHANGE_EVENT])!='undefined'){
    funcs[c.FIELD_CHANGE_EVENT](evt,emit, dialogData.value);
  }
}
funcs[c.CHANGE_MENU_CONFIGURATION]=function(evt){
  console.log('in dialog CHANGE_MENU_CONFIGURATION-', evt);
  //debugger;
  menuDefinitions = getDialogParams(evt[1], "menu");
  reloadMenu.value += 1;
}
funcs[c.UPDATE_DIALOG_DATA]=function(cmd){
  console.log('in UPDATE_DIALOG_DATA', cmd);
  dialogData[cmd[1][1]]=cmd[1][2];
}

funcs[c.MENU_ITEM_SELECTED]= function(evt){
  console.log('in c.-MENU_ITEM_SELECTED', evt);
  debugger;
  funcs[evt[1]](emit, dialogData);
}

funcs[c.ROW_SELECT]= function(evt){
  debugger;
  if(typeof(funcs[c.RESOLVE_DATA])!='undefined'){
    console.log('dialogFieldsConfig.value', toRaw(dialogFieldsConfig.value).dialogFields);
    var resolvedData = funcs[c.RESOLVE_DATA](toRaw(dialogFieldsConfig.value).dialogFields,evt, emit);
//    emit('cevt', [c.CHANGE_LAYOUT, resolvedData]);
  }else{
    emit('cevt', evt);
  }
}
funcs[c.ADD_SELECTED_LINK]=function(cmd){
  debugger;


  console.log('in ADD_SELECTED_LINK-', cmd[1][1]);
  console.log('card_instance_id-', props.data.id);
  console.log('login status',store.getLoginStatus);
  debugger;

  //changeDialog('editLinks');
}


funcs[c.SAVE_DIALOG_DATA] = function(evt){
  debugger;
  var mergedData = mergeDialogFields(dialogData, toRaw(dialogFieldsData.value));
  mergedData.cardId = props.config.id;
  console.log('mergedDialogData', mergedData);
  funcs[c.MENU_SAVE_DIALOG_DATA](emit, mergedData);
}
funcs[c.MENU_ADD_LINK] = function(evt){
  console.log('MENU_ADD_LINK clicked', evt);
  changeDialog('addPageLinks');
/*
  ready.value=false;
  debugger;
  currentDialogDataLoader = getDialogData('addPageLinks');
  currentDialogDataLoader(emit, c, store, ready, result, props.config);
  const addLinkDialogFields = getDialogFields('addPageLinks');
  console.log('dialogFields-', addLinkDialogFields);
  debugger;
  console.log('loader ready b',ready);
  if(ready.value==false){
    whenever(ready, () => {
      debugger;
      existingData = toRaw(result.value);
      console.log('existingData loaded b',existingData, dialogFields);
      dialogFieldsConfig.value.dialogFields = {
        dialogFields: addLinkDialogFields,
        name: 'Fields'
      };

      //dialogFieldsConfig.value.dialogFields = dialogFields;
//      dialogFieldsConfig.value.existingData = existingData;
      dialogFieldsData.value = existingData;
      //     dialogData = existingData;
//    reloadDialogFields+=1;

    })
  }else{
    debugger;
    existingData = toRaw(result.value);
    console.log('existingData loaded',existingData);
    //dialogFieldsConfig.value.dialogFields = addLingDialogFields;
//    dialogFieldsConfig.value.dialogFields = dialogFields;
//    dialogFieldsConfig.value.existingData = existingData;
    dialogFieldsConfig.value = {
      dialogFields: addLinkDialogFields,
      name: 'Fields'
    };
    dialogFieldsData.value = existingData;
    addActions = getActions('addPageLinks');
    addActions(funcs);

  }
  reloadDialogFields.value +=1;
*/

}
/*
funcs[c.CREATE_CARD] = function(evt){
  var mergedData = mergeDialogFields(dialogData, toRaw(dialogFieldsData.value));
  mergedData.cardId = props.config.id;
  console.log('mergedDialogData', mergedData);
}
*/
//debugger;
addActions(funcs);
/*
funcs[c.MENU_ITEM_SELECTED] = function(evt){
  console.log('menu item selected', evt);
}
*/

const mergeDialogFields = function(dialogData, dialogFieldsData) {
  // Create a copy of dialogData to avoid modifying the original
  const updatedDialog = { ...dialogData };

  // Iterate through dialogFieldsData
  for (const [key, value] of Object.entries(dialogFieldsData)) {
    // Only set the property if it doesn't exist in dialogData
    if (!(key in updatedDialog)) {
      updatedDialog[key] = value;
    }
  }

  return updatedDialog;
}


onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
//  cmdHandlers['mainPage'](['createNewCard', msg[1], 'mainPage']);
  console.log('dialogData', dialogData);
  console.log('props data', props.data.cardDimensions);
  if(typeof(existingData)!='undefined'){
    dialogData = existingData;
  }
  dialogData.cardDimensions =  props.data.cardDimensions;


  console.log('dialogData after', dialogData);

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


