
<template>
  <span :class = dialogAppearence.twstyle>
    <span :class="dialogAppearence.twHeaderMsgStyle" v-if="hasHeaderMsg==true && reorderSet==true">{{dialogAppearence.headerMsg}}</span>
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
/*
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
*/


import dynamicMenu from '../components/menu3.vue';
import Fields from '../components/dialogFields.vue';

import {useLogStateStore} from "../stores/logState.js";
//debugger;
import {getDialogDefinitions} from "../components/dialogDefinitions2.js";



// load the dialog definition
const {getDialogAppearence, getDialogFields, getDefaultData, getDialogData, getMenuDefinitions, getActions, getDialogParams} = getDialogDefinitions();
const dialogFields = getDialogFields(props.config.definition);

console.log('dialogFields-',dialogFields);

import {getLinkFunctions} from "../components/linkFunctions.js";
const {addNewLink, getLinks, deleteLink} = getLinkFunctions();

const dialogAppearence = getDialogAppearence(props.config.definition);
const reorderSet = ref(false);
const hasHeaderMsg = ref(false);
if(typeof(dialogAppearence.headerMsg)!='undefined'){
  hasHeaderMsg.value=true;
}
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
if(typeof(props.config.orient)!='undefined'){
  dialogFieldsData.value.orient=props.config.orient
}
const store = useLogStateStore();
const ready = ref(false);
const result = ref({});
console.log('dialog4 loginInfo-', store.loginStatus);
debugger;
if(typeof(currentDialogDataLoader)=='function'){
  debugger;

  currentDialogDataLoader(emit, c, store, ready, result, props.config, dialogData);
  console.log('loader ready',ready);
  if(ready.value==false){
    //dialogData function  needs to wait for data
    whenever(ready, () => {
      debugger;
      existingData = toRaw(result.value);
      console.log('existingData loaded',existingData);
      dialogFieldsConfig.value.dialogFields = dialogFields;
//      dialogFieldsConfig.value.existingData = existingData;
      dialogFieldsData.value = existingData;
      dialogData = existingData;
      if(typeof(props.config.cardName)!='undefined'){
        dialogData.cardName = props.config.cardName;
      }
      if(typeof(props.config.orient)!='undefined'){
        dialogData.orient = props.config.orient;
      }
    })
  }else{
    // dialog data function returned ready right away
    debugger;
    existingData = toRaw(result.value);
    console.log('existingData loaded',existingData);
    dialogFieldsConfig.value.dialogFields = dialogFields;
    if(toRaw(props.config).definition=='editText'){
      dialogFieldsData.value.content = existingData;
    }else{
      dialogFieldsData.value = existingData;
    }
  }


}else{
  //dialog data was not a function - gets the default data
  existingData = getDefaultData(props.config.definition);
  dialogFieldsConfig.value.dialogFields = dialogFields;
  dialogFieldsConfig.value.existingData = existingData;
  dialogFieldsData.value = existingData;
  dialogData.value = existingData;
}
debugger;
// there is default data in the dialog definition
if(typeof(getDefaultData(props.config.definition))!='undefined'){
  dialogFieldsConfig.value.defaultData = getDefaultData(props.config.definition);
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
  console.log('changeDialogCalled', dialogDefinition);
  ready.value=false;
  debugger;
  currentDialogDataLoader = getDialogData(dialogDefinition);
  currentDialogDataLoader(emit, c, store, ready, result, props.config, dialogData);
  const newDialogFields = getDialogFields(dialogDefinition);
  console.log('dialogFields-', newDialogFields);
  debugger;
  console.log('loader ready b',ready);
  if(ready.value==false){
    whenever(ready, () => {
      debugger;
      existingData = toRaw(result.value);
      console.log('existingData loaded b',existingData, dialogFields);
      dialogFieldsConfig.value.dialogFields = {
        dialogFields: newDialogFields,
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
    console.log('dialogFieldsData typoeof',typeof(dialogFieldsData.value));
    existingData = toRaw(result.value);
    console.log('existingData loaded--',existingData);
    console.log('dialogFieldsData loaded--',toRaw(dialogFieldsData.value.dataToShow));
    //console.log('typeof dialogFieldsData.value.dataToShow',typeof(toRaw(dialogFieldsData.value.dataToShow)));
    //dialogFieldsConfig.value.dialogFields = addLingDialogFields;
//    dialogFieldsConfig.value.dialogFields = dialogFields;
//    dialogFieldsConfig.value.existingData = existingData;
    dialogFieldsConfig.value = {
      dialogFields: newDialogFields,
      name: 'Fields'
    };
    console.log('existing data at dialogData 204', existingData);
//    dialogFieldsData.value = existingData;
    console.log('typeof dialogFieldsData.value.dataToShow',typeof(toRaw(dialogFieldsData.value.dataToShow)));
    var ds = toRaw(dialogFieldsData.value.dataToShow);
    console.log('ds is', ds, typeof(ds));
    if(typeof(ds)!='undefined'){
      dialogFieldsData.value.dataToShow = toRaw(dialogFieldsData.value.dataToShow);
    }else{
      dialogFieldsData.value = existingData;
      dialogData.existingData = existingData;
    }

    addActions = getActions(dialogDefinition);
    addActions(funcs);

  }
  menuDefinitions = getMenuDefinitions(dialogDefinition);
  dialogFieldsData.value.id = props.config.id;
  reloadDialogFields.value +=1;


}

// don't really need this because all the specific field components are handled in DialogFields
/*
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
*/




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
funcs[c.SET_REORDER]= function(evt){
  console.log('in SET_REORDER-', evt);
  reorderSet.value=true;
  cmdHandlers['Fields']([c.SET_REORDER, true, "editLinks"]);
}
funcs[c.SET_REORDER_OFF] = function(evt){
  reorderSet.value=false;
  cmdHandlers['Fields']([c.SET_REORDER_OFF, false, "editLinks"]);
}
funcs[c.MENU_ITEM_SELECTED]= function(evt){
  console.log('in c.-MENU_ITEM_SELECTED', evt);
  debugger;
  funcs[evt[1]](emit, dialogData, props.config);
}
funcs[c.CREATE_PAGE] = function(evt){
  console.log('in CREATE_PAGE-', evt);
  changeDialog('pageCreateAndAdd');

}

funcs[c.ROW_SELECT]= function(evt){
  debugger;
  if(typeof(funcs[c.RESOLVE_DATA])!='undefined'){
    console.log('dialogFieldsConfig.value', toRaw(dialogFieldsConfig.value).dialogFields);
    var resolvedData = funcs[c.RESOLVE_DATA](toRaw(dialogFieldsConfig.value).dialogFields,evt, emit, dialogData, dialogFieldsData, props.config);
//    emit('cevt', [c.CHANGE_LAYOUT, resolvedData]);
  }else{
    emit('cevt', evt);
  }
}
funcs[c.EDIT_SELECTED_LINK]= function(cmd){
  console.log('in EDIT_SELECTED_LINK-', cmd);
}

funcs[c.ADD_SELECTED_LINK]=function(cmd){
  debugger;


  console.log('in ADD_SELECTED_LINK-', cmd);
  console.log('card_instance_id-', dialogData.id);
  console.log('selected layout', cmd[1][1].id);
  console.log('description', cmd[1][1].description);
  console.log('menu label', cmd[1][1].menu_label);
  const loginStore = useLogStateStore();
  const loginResult= toRaw(loginStore.loginStatus);


  var linkTo;
  console.log('new layout id-',typeof(cmd[1][1].id), cmd[1][1].id,cmd[1][1].layout_link_to);
  var newLinkId;
  if(typeof(cmd[1][1].id)=='undefined'){
    console.log('adding layout_linkto', cmd[1][1].layout_link_to);
    linkTo = cmd[1][1].layout_link_to;
    newLinkId = cmd[1][1].layout_link_to;
  }else{
    console.log('adding id', cmd[1][1].id);
    linkTo = cmd[1][1].id;
    newLinkId = cmd[1][1].id;
  }


  var newLink = {
    description:cmd[1][1].description,
    orgId:loginResult.orgId,
    isExternal:0,
    layout_link_to:linkTo,
    link_url:'https://localhost:8080',
    menu_label: cmd[1][1].menu_label,
    show_order:dialogData.currentLinks.length + 1,
    type:'U',
    id:newLinkId
  }
  console.log('new link added to list', newLink);
  dialogData.currentLinks.push(newLink);
  dialogFieldsData.value.dataToShow=dialogData.currentLinks;
  //dialogData.currentLinks
  //addNewLink(cmd[1][1].id,dialogData.id, cmd[1][1].description);
  //changeDialog('editLinks');
  //debugger;

  changeDialog('editLinks');
}
funcs[c.SET_DIALOG] = function(cmd){
  console.log('in dialog4 SET_DIALOG-', cmd);
  debugger;
  changeDialog(cmd[3]);
  // changeDialog(cmd[1]);
}

funcs[c.SAVE_DIALOG_DATA] = function(evt){
  debugger;
  var mergedData = mergeDialogFields(dialogData, toRaw(dialogFieldsData.value));
  mergedData.cardId = props.config.id;
  console.log('mergedDialogData', mergedData);
  funcs[c.MENU_SAVE_DIALOG_DATA](emit, mergedData, props.config);
}
funcs[c.MENU_ADD_LINK] = function(evt){
  console.log('MENU_ADD_LINK clicked', evt);
  changeDialog('addPageLinks');
}
addActions(funcs);


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


