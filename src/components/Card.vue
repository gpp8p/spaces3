<template>
<span :style = "props.data.card_parameters.style">
    <div :class="menuDefinitions.twStyling" v-if="props.config.mode=c.MODE_DISPLAY">
      <dynamicMenu :config="menuDefinitions" :key = "reloadMenu" :data="menuData" @cevt="handleEvent($event, funcs, emit)" />
    </div>
    <div>
      <component :is="morphs[props.data.card_component]"
                 :config="cardConfigs"
                 :data="props.data.card_parameters.content"
                 @cevt="handleEvent($event, funcs, emit)"/>
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
import {ref} from 'vue';
import {onBeforeMount} from "vue";


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
const menuDefinitions = ref({});
const cardConfigs = ref({});

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
import Headline from './Headline.vue';
import RichText from './RichText.vue';
import NavigationMenu from './Headline.vue';
import imageCard from './imageCard.vue';


const morphs = {
  Headline,
  RichText,
  NavigationMenu,
  imageCard
}



const getMenuDefinitions = function(menuType){

  switch(menuType){
    case 'pdf':
    case 'youTube':
    case 'imageCard':
    case 'Headline':{
      return {
        twStyling:'text-xs text-blue-500 w-[100%]',
        items: [
          { type: 'menuItem', config: { label: 'Configure', actionCode: c.CARD_MENU_CONFIGURE } },
          { type: 'menuItem', config: { label: 'Resize/Move', actionCode: c.CARD_MENU_RESIZE } },
          { type: 'menuItem', config: { label: 'Delete', actionCode: c.CARD_MENU_DELETE } },
          { type: 'menuItem', config: { label: 'Edit', actionCode: c.CARD_MENU_EDIT } },
          { type: 'menuItem', config: { label: 'Save', actionCode: c.CARD_MENU_SAVE } },
          { type: 'menuItem', config: { label: 'Exit', actionCode: c.CARD_MENU_EXIT } },
        ],
      }
    }
    case 'NavigationMenu':{
      return {
        twStyling:'text-xs text-blue-500 w-[100%]',
        items: [
          { type: 'menuItemDrop', config: {label: 'Navigation Menu', subItems: [
                { subLabel: 'Edit', actionCode: c.CARD_MENU_EDIT  },
                { subLabel: 'Configure', actionCode: c.CARD_MENU_CONFIGURE },
                { subLabel: 'Delete', actionCode: c.CARD_MENU_DELETE  },
                { subLabel: 'Resize/Move', actionCode: c.CARD_MENU_CONFIGURE },
                { subLabel: 'Save', actionCode: c.CARD_MENU_SAVE },
                { subLabel: 'Exit', actionCode: c.CARD_MENU_EXIT },
              ]
            }
          },
        ]

      }
    }
    case 'RichText':{
      return {
        twStyling:'text-xs text-blue-500 w-[100%]',
        items: [
          { type: 'menuItem', config: { label: 'Edit', actionCode: c.CARD_MENUS_EDIT } },
          { type: 'menuItem', config: { label: 'Configure', actionCode: c.CARD_MENUS_CONFIGURE } },
          { type: 'menuItem', config: { label: 'Resize/Move', actionCode: c.CARD_MENUS_RESIZE } },
          { type: 'menuItem', config: { label: 'Delete', actionCode: c.CARD_MENUS_DELETE } },
          { type: 'menuItem', config: { label: 'Exit', actionCode: c.CARD_MENUS_EXIT } },

        ]
      }
    }
    case 'RichText_A':{
      return {
        twStyling:'text-xs text-blue-500 w-[100%]',
        items: [
          { type: 'menuItem', config: { label: 'Card Setup', actionCode: c.CARD_MENUE_SETUP } },
          { type: 'menuItem', config: { label: 'Link', actionCode: c.CARD_MENUE_LINK} },
          { type: 'menuItem', config: { label: 'Upload', actionCode: c.CARD_MENUE_UPLOAD } },
          { type: 'menuItem', config: { label: 'Meta Data', actionCode: c.CARD_MENUE_METADATA } },
          { type: 'menuItem', config: { label: 'Save', actionCode: c.CARD_MENUE_SAVE } },
        ]
      }
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
onBeforeMount(()=>{
  cardConfigs.value = props.data.card_parameters;
  cardConfigs.value.elementStyles = props.data.elementStyles;
})

onMounted(() => {
  debugger;
  console.log('card style is', props.data.card_parameters.style);
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

