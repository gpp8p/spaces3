<template>
  <div :class="thisDialogDefinition.login.twstyle">
    <span class="dialogLayout">
      <div class="text-lg text-current ml-[30%] my-[4%] text-indigo-950">
        {{d.login.prompt}}
      </div>
      <div class="ml-[30%] my-[5%]">
        <dialogFields  :dialogDef="d" @cevt="handleEvent($event, funcs, emit)"></dialogFields>
      </div>
      <div class="ml-[10%] my-[10%]">
        <dynamicMenu :config="menuConfig" @cevt="handleEvent($event, funcs, emit)" />
      </div>
    </span>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import {ref} from 'vue';
import {getDialogDefinitions} from "./dialogDefinitions.js";
import dialogFields from '../components/dialogFields2.vue';
import {useEventHandler} from "./eventHandler.js";
import {c} from "./constants";
import { storeToRefs } from 'pinia';
import dynamicMenu from './dynamicMenu.vue';
import menuItem from './menuItem.vue';
import menuItemDrop from '../components//menuItemDrop.vue';
import {getLogin} from "./login.js";

import {getMenu} from '../components/menuOpts.js';


const {doLogin}= getLogin();

const emit = defineEmits(['cevt']);
const {handleEvent} = useEventHandler();
const cmdHandlers = {}
const funcs = [];
const dialogData = {};
funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
funcs[c.FIELD_INPUT]=function(evt){
  console.log('in spDialog1 FIELD_INPUT-', evt);
  dialogData[evt[1]]=evt[2];
}
 funcs[c.INPUT_ERROR]=function(evt){
  console.log('input error-', evt);
  alert('entry error- please try again');
 }

funcs[c.MENU_LOGIN]=function(evt){
  console.log('in spDialog1 MENU_LOGIN-', evt);
  if((typeof(dialogData.userId)=='undefined') || typeof(dialogData.password)=='undefined'){
    alert('You must enter a user id and password and press the tab key');
  }else{
    doLogin(dialogData.userId, dialogData.password, emit, c);
  }
}

const handleCmd = function(args){
  console.log('handleCmd-', name, args);
}

const {getDialog} = getDialogDefinitions();
const thisDialogDefinition = getDialog(c, 'loginDialog');
console.log('spDialog1 - thisDialogDefinition', thisDialogDefinition);
debugger;
console.log('menudef-',thisDialogDefinition.login.menuOpts);

debugger;
const getMenuOpts = getMenu();
console.log('getMenuOpts-',getMenuOpts);
const menuConfig = getMenuOpts(c,thisDialogDefinition.login.menuOpts);
console.log('menuOpts are-', menuConfig);

const d = ref(thisDialogDefinition);

const dName = ref('loginDialog');
const handleResize = () => {
  // Add any necessary resize handling logic here
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
<style scoped>
  .dialogLayout {
    height: 60%;
    display: grid;
    grid-template-rows: 15% 75% 10%;
  }
</style>
