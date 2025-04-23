<template>
  <span v-if="hasHeadline==true" >
      <span>{{props.data.linkMenuTitle}}</span>
      <span :style="props.config.elementStyles.sub[0]" v-if="hasLinks==true">
        <dynamicMenu :config="headlineMenu" :key="reloadMenu" @cevt="handleEvent($event, funcs, emit)" />
      </span>
  </span>
  <span v-if="hasHeadline==false">
      <dynamicMenu :config="headlineMenu" :key="reloadMenu" @cevt="handleEvent($event, funcs, emit)" />
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
import {ref} from 'vue';
import {toRaw} from 'vue'

import dynamicMenu from "./menu3.vue";

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.data.card_name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
const hasHeadline = ref(false);
const hasLinks = ref(false);
const headlineMenu = ref({});
const reloadMenu = ref(0);

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
funcs[c.MENU_ITEM_SELECTED]= function(evt){
  console.log('in headline  c.-MENU_ITEM_SELECTED', evt);
  debugger;
  if(evt[2]==0){
    emit('cevt', [c.CHANGE_LAYOUT, evt[1]]);
  }else{
    window.open(evt[3], '_blank').focus();
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
funcs[c.CARD_MENU_SELECTED] = function(cmd){
  console.log('Navigation in CARD_MENU_SELECTED-', cmd);
  debugger;
  switch(cmd[1].cardAction){
    case c.CARD_MENU_EXIT:{
      emit('cevt', [c.EXIT_EDIT_MODE]);
      break;
    }
    case c.CARD_MENU_CONFIGURE:{
      debugger;
      var cardProperties = {
        orient: props.data.orient,
        cardName: props.data.card_name,
        cardId: props.config.id
      }
      emit('cevt', [c.SHOW_DIALOG, 'configureCard', cardProperties]);
      break;
    }
    case c.CARD_MENU_EDIT:{
      debugger;
      var cardOrient;
      if(cmd[1].type=='Headline'){
        cardOrient = 'horozontal';
      }
      if(cmd[1].type=='NavigationMenu'){
        cardOrient = 'vertical';
      }
      var title;
      if(typeof(props.config.content.linkMenuTitle)=='undefined'){
        title=props.config.content.card_name;
      }else{
        title=props.config.content.linkMenuTitle;
      }
      var configPackage = {
        definition: 'editLinks',
        cardId: props.config.id,
        cardName:props.config.content.card_name,
        cardTitle:title,
        orient:cardOrient
      }
      emit('cevt', [c.SHOW_DIALOG, 'editLinks',  configPackage]);
      break;
    }
    case c.CARD_MENU_RESIZE:{
      console.log('in CARD_MENU_RESIZE-', cmd);
      emit('cevt', [c.FILL_IN_AREA, cmd[1].position]);
      debugger;
    }
  }

}



onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
  //headlineMenu.value.twStyling = 'border-4 my-10 w-3/4 mx-auto border-blue-200';
  //console.log('element styles-', props.config.elementStyles.sub[0]);
  //headlineMenu.value.style = props.data.elementStyles.sub[0];
  headlineMenu.value.style = "";
  headlineMenu.value.items = [];
  console.log('card data',props.data.linkMenuTitle);
  if(typeof(props.data.linkMenuTitle)=='string'){
    hasHeadline.value = true;
  }
  //console.log('orient-', props.config.content.orient);
  //headlineMenu.value.orient = props.config.content.orient;


  debugger;
  for(var i=0;i<toRaw(props.data.availableLinks).length;i++){
    hasLinks.value = true;
    var thisItem = {
      type: 'menuItem',
      config:{
        label: toRaw(props.data.availableLinks)[i].description,
        link: toRaw(props.data.availableLinks)[i].layout_link_to,
        actionCode: c.MENU_ITEM_SELECTED,
        external: toRaw(props.data.availableLinks)[i].isExternal,
        showOrder: toRaw(props.data.availableLinks)[i].showOrder,
        link_url: toRaw(props.data.availableLinks[i].link_url)
      }
    }
    headlineMenu.value.items.push(thisItem);
    console.log('orient-', props.config.content.orient);
    headlineMenu.value.orient = props.config.content.orient;

  }
  console.log('headline menu is ', headlineMenu.value );
  console.log('orient-', props.config.content.orient);
  headlineMenu.value.orient = props.config.content.orient;
  reloadMenu.value+=1;
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

</script>

<style scoped>


</style>

