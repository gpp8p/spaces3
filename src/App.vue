<template>
  <div class="w-screen h-screen" id="app">
    <spFrame @cevt="handleEvent($event, funcs, emit)" />
    <spDialog :config = "dialogConfig" :data="dialogData" v-if="showDialog==true" @cevt="handleEvent($event, funcs, emit)" ></spDialog>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {c} from "./components/constants.js";
import spFrame from './components/spFrame.vue';
import spDialog from './components/dialog4.vue';
//import {useLoginStateStore} from './stores/loginState.js';
//import { storeToRefs } from 'pinia';
import {useLogStateStore} from './stores/logState.js';
import {useCurrentPage} from './stores/currentPage.js'


import { createApp } from 'vue'
import {toRaw} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia);

//import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'




//const router = useRouter()
//console.log('route.path', route.path)

// app.mount('#app');

const emit = defineEmits(['cevt']);

import {useEventHandler} from "./components/eventHandler.js";
const {handleEvent} = useEventHandler();
const frameConfig = ref(
    {
      showMenu: false,
      message: 'Please enter login and password..',

    }
)

const cmdHandlers = {}

var dialogConfig = ref({});
var dialogData = {};

const store = useLogStateStore();
const pageStore = useCurrentPage();
debugger;

const showDialog = ref(false);
const loginRequired = ref(true);
console.log('current location', window.Document.URL);

if(loginRequired.value===true){
//  dialogConfig.value.definition = 'loginDialog';
//  showDialog.value=true;
}

console.log('dialogConfig-', dialogConfig);

const funcs = [];
funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
  cmdHandlers['spFrame']([c.CMD_SET_MESSAGE, 'Please supply user id and password, hitting tab after entering each one','spFrame']);
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in UNSET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
funcs[c.MENU_LOGIN]=function(evt){
  console.log('in app MENU_LOGIN-', evt);
}
funcs[c.EXIT_DIALOG]=function(evt){
  debugger;
  showDialog.value=false;
}
funcs[c.MENU_ITEM_SELECTED]=function(evt){
  debugger;
  console.log('in APP MENU_ITEM_SELECTED -  ', evt);
  funcs[evt[1]](evt);
}
funcs[c.MENU_EDIT_PAGE]=function(args){
  debugger;
  console.log('c.MENU_EDIT_PAGE called', args);
  cmdHandlers['spFrame']([c.SET_PAGE_EDIT, args, "Page"]);
}
funcs[c.LOGIN_RETURNED]=function(evt){
  debugger;
//  const store = useLogStateStore();
  const loginState = evt[1];
  store.setLoginStatus(loginState);
  const loginResult= toRaw(store.loginStatus);
  console.log('store.loginResult', loginResult);
  pageStore.setCurrentPageId(loginResult.orgHome);
  pageStore.setCurrentPagePerms(loginResult.loginPerms);
  console.log('pageStore-', pageStore.getCurrentPageId, pageStore.getCurrentPagePerms);
  if(loginResult.resultType=='Ok'){
    cmdHandlers['spFrame']([c.RELOAD_PAGE,'reloadPage', 'spFrame']);
    if(loginResult.loginPerms.admin==true){
      debugger;
      console.log('cmdHandler for spFrame-',cmdHandlers['spFrame']);
      debugger;
      cmdHandlers['spFrame']([c.CMD_SET_MENU, 'adminMenu','spFrame']);
      showDialog.value=false;
      loginRequired.value=false;
    }
  }else{
    alert('Login failed - please try again');
  }

}
/*
funcs[c.LOGIN_RETURNED]=function(evt){
  console.log('login was returned', evt);
//  debugger;

  const loginState = ref(evt[1]);
  const store = useLoginStateStore();
  const {structure, setStructure, getStructure} = storeToRefs(store);
  store.setStructure(loginState);
  debugger;
  const loginResult = toRaw(store.structure);

  if(loginResult.resultType=='Ok'){
    if(loginResult.loginPerms.admin==true){
      debugger;
      console.log('cmdHandler for spFrame-',cmdHandlers['spFrame']);
      debugger;
      cmdHandlers['spFrame']([c.CMD_SET_MENU, 'adminMenu','spFrame']);
      showDialog.value=false;
      loginRequired.value=false;
    }


  }else{
    alert('Login failed - please try again');
  }
  console.log('loginState structure after change-',toRaw(store.structure));
}
*/

funcs[c.CHANGE_DIALOG_CONFIGURATION]= function(evt){
  console.log('in CHANGE_DIALOG_CONFIGURATION',evt);
  debugger;
  cmdHandlers['dialog']([evt[1], evt[2], "dialog"]);
}
funcs[c.MENU_PAGE_SETTINGS]= function(evt){
  console.log('in MENU_PAGE_SETTINGS-', evt);
  dialogConfig.value.definition = 'pageSettings';
  showDialog.value=true;
}
funcs[c.MENU_MYSPACES]= function(evt){
  console.log('inMENU_MYSPACES-', evt);
  dialogConfig.value.definition = 'mySpaces';
  showDialog.value=true;
}
funcs[c.MENU_CREATE]= function(evt){
  console.log('in MENU_CREATE-', evt);
  dialogConfig.value.definition = 'pageCreate';
  showDialog.value=true;
}
funcs[c.TRANSACTION_COMPLETED] = function(evt){
  console.log('in TRANSACTION_COMPLETED-', evt);
}
funcs[c.CHANGE_LAYOUT] = function(evt){
  console.log('in CHANGE_LAYOUT-', evt);
  debugger;
  cmdHandlers['spFrame']([c.SET_NEW_LAYOUT, evt[1], "Page"]);
}
funcs[c.EXIT_EDIT_MODE] = function(evt){
  console.log('in EXIT_EDIT_MODE-', evt);
  cmdHandlers['spFrame']([c.SET_TO_DISPLAY_MODE,evt, "Page"]);
}
funcs[c.SHOW_DIALOG] = function(evt){
  debugger;
  console.log('in SHOW_DIALOG-', evt);
  if(typeof(evt[1])!="undefined"){
    dialogConfig.value.definition = evt[1];
  }
  if(typeof(evt[2].cardId)!="undefined"){
    dialogConfig.value.id = evt[2].cardId;
  }else{
    dialogConfig.value.id = evt[2];
  }
  dialogConfig.value.layoutId = pageStore.getCurrentPageId;
  if(typeof(evt[2].cardName)!="undefined"){
    dialogConfig.value.cardName = evt[2].cardName;
  }
  if(typeof(evt[2].cardName)!="undefined"){
    dialogConfig.value.cardTitle = evt[2].cardTitle;
  }
  if(typeof(evt[2].orient)!="undefined"){
    dialogConfig.value.orient = evt[2].orient;
  }
  if(typeof(evt[3])!="undefined"){
    dialogConfig.value.existingData = evt[3];
  }
  console.log('in SHOW_DIALOG dialogConfig', dialogConfig);
  showDialog.value=true;
}
funcs[c.FIELD_CHANGED]= function(evt){
  console.log('in app FIELD_CHANGED-', evt);
  cmdHandlers['dialog']([c.UPDATE_DIALOG_DATA,evt, "dialog"]);
}
funcs[c.LINK_TO_ADD_SELECTED]=function(evt){
  console.log('in app LINK_TO_ADD_SELECTED-', evt);
  cmdHandlers['dialog']([c.ADD_SELECTED_LINK,evt, "dialog"]);
}
funcs[c.CARD_AREA_SELECTED] = function(evt){
  console.log('in CARD-AREA-SELECTED-', evt);
  dialogConfig.value.definition = 'createCard';
  dialogData.cardDimensions = {};
  dialogData.cardDimensions.startX = evt[3];
  dialogData.cardDimensions.startY = evt[4];
  dialogData.cardDimensions.endX = evt[1];
  dialogData.cardDimensions.endY = evt[2];


  showDialog.value=true;

}
funcs[c.SET_DIALOG] = function(evt){
  debugger;
  console.log('in SET_DIALOG-', evt);
  cmdHandlers['dialog']([c.SET_DIALOG, evt[1], "dialog", evt[2]]);
}
funcs[c.EDIT_SELECTED_LINK] = function(evt){
  cmdHandlers['dialog']([c.EDIT_SELECTED_LINK, evt[1], "dialog"]);
}
funcs[c.UPDATE_SELECTED_LINK] = function(evt){
  debugger;
  cmdHandlers['dialog']([c.UPDATE_SELECTED_LINK, evt, "dialog"]);
}
funcs[c.CARD_MENUS_EDIT] = function(evt){
  console.log('in CARD-MENUS-EDIT-', evt);
}

onMounted(() => {
  console.log('current window', window.document.URL);
  console.log('openPage in url',window.document.URL.includes('setPage'));
  if(window.document.URL.includes('setPage')){
    var ls = toRaw(store.loginStatus);
    debugger;
    console.log('store.loginResult', ls.loginResult);
    if(typeof(ls.loginResult)=='undefined'){
      dialogConfig.value.definition = 'loginDialog';
      showDialog.value=true;
    }
  }else{
    dialogConfig.value.definition = 'loginDialog';
    showDialog.value=true;
  }

  debugger;
})




</script>
