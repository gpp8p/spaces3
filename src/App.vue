<template>
  <div class="w-screen h-screen" id="app">
    <spFrame @cevt="handleEvent($event, funcs, emit)" />
    <spDialog :config = "dialogConfig" :data="dialogData" @cevt="handleEvent($event, funcs, emit)" v-if="showDialog==true"></spDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {c} from "./components/constants.js";
import spFrame from './components/spFrame.vue';
import spDialog from './components/dialog4.vue';
import {useLoginStateStore} from './stores/loginState.js';
import { storeToRefs } from 'pinia';

import { createApp } from 'vue'
import {toRaw} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
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

const dialogConfig = {};


const showDialog = ref(true);
if(showDialog.value==true){
  dialogConfig.definition = 'loginDialog';
}
console.log('dialogConfig-', dialogConfig);

const funcs = [];
funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
  cmdHandlers['spFrame']([c.CMD_SET_MESSAGE, 'Please enter user id and password...','spFrame']);
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in UNSET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
funcs[c.MENU_LOGIN]=function(evt){
  console.log('in app MENU_LOGIN-', evt);
}
funcs[c.LOGIN_RETURNED]=function(evt){
  console.log('login was returned', evt);
//  debugger;
  const loginState = ref(evt[1]);
  const store = useLoginStateStore();
  const {structure, setStructure} = storeToRefs(store);
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
    }


  }
  console.log('loginState structure after change-',toRaw(store.structure));



}


</script>
