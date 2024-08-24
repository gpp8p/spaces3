<template>
  <div class="flex flex-col h-screen p-1vh">
    <div  class="w-98vw h-14 mx-auto mb-1vh border-2 border-blue-500 sp-background rounded-lg">
      <div v-if="showMenu" class="my-[1%]">
        <dynamicMenu :config="menuConfig" @cevt="handleEvent($event, funcs, emit)" />
      </div>
      <div v-else class="text-center my-[1.5%]">{{message}}</div>
    </div>
    <div class="w-98vw h-84-5vh mx-auto border-2 border-blue-500 sp-background rounded-lg" id="contentArea">
      <Page :config="pageConfig" :data="pageData" @cevt="handleEvent($event, funcs, emit)" :key="pageReload"></Page>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import {ref} from 'vue';
import {c} from "./constants";
import {useEventHandler} from "./eventHandler";
import dynamicMenu from './menu3.vue';
import {getMenu} from '../components/menuOpts.js';

//import {screenGeometry} from "../components/screenGeometry.js";
//const {refreshDims, thisScreenDims} = screenGeometry();

import {useDims} from "../stores/dims.js";
const dimStore = useDims();


import Page from '../components/Page.vue';

const emit = defineEmits(['cevt']);

const leafComponent = false;

const getMenuOpts = getMenu();
const menuConfig = ref('');
const message = ref('');
const showMenu=ref(false);
const name = 'spFrame';

const pageConfig = ref({});
pageConfig.value.name='Page';
const pageData = ref({});
const pageReload = ref(0);

const cmdHandlers = {}
const funcs = [];
const {handleEvent} = useEventHandler();
const handleCmd = function(args) {
  console.log('handleCmd-', name, args);
//  debugger;
  if (name == args[2]) {
    if (typeof (funcs[args[0]] != 'undefined')) {
      console.log('spFrame found func-', args[1]);
      funcs[args[0]](args);
    }
  } else {
    passCmdDown(args);
  }
}

const passCmdDown = function (args) {
  var availableHandlers = Object.keys(cmdHandlers);
  if (availableHandlers.length > 0) {
    for (var a = 0; a < availableHandlers.length; a++) {
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
funcs[c.CMD_SET_MENU]= function(args){
    console.log('in CMD_SET_MENU-', args);
    menuConfig.value = getMenuOpts(c,args[1]);
    showMenu.value=true;

}
funcs[c.CMD_SET_MESSAGE]=function(args){
  console.log('in CMD_SET_MESSAGE-', args);
  message.value = args[1];
}

funcs[c.RELOAD_PAGE]=function(args){
  debugger;
  console.log('RELOAD_PAGE called', args);
  pageReload.value+=1;
}
funcs[c.MENU_ITEM_SELECTED]=function(args){
  console.log('in spFrame args', args);
  emit('cevt', [args[1]]);
}


const resizeHandler = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

onMounted(() => {
  resizeHandler();
  window.addEventListener('resize', resizeHandler);
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
  var element = document.getElementById('contentArea');
  var positionInfo = element.getBoundingClientRect();
  debugger;
  dimStore.setDims(positionInfo);
  var pageDimensions = {
    contentHeight: Math.round(positionInfo.height),
    contentWidth: Math.round(positionInfo.width)
  }
  pageConfig.value.pageDimensions = pageDimensions;
  cmdHandlers['Page']([c.SET_CONTENT_DIMENSIONS, pageDimensions,'Page']);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
});
</script>

<style scoped>
.h-14-5vh {
  height: calc(var(--vh, 1vh) * 14.5);
}

.h-84-5vh {
  height: calc(var(--vh, 1vh) * 84.5);
}

.w-98vw {
  width: 98vw;
}

.p-1vh {
  padding-top: calc(var(--vh, 1vh) * 1);
  padding-bottom: calc(var(--vh, 1vh) * 1);
}

.mb-1vh {
  margin-bottom: calc(var(--vh, 1vh) * 1);
}
.sp-background {
  background-color: #ffcd90;
}
</style>
