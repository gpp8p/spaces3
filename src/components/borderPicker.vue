<template>
  <span>
     <div class="inputCss" v-if="!checked">
      <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
      <span>
        <input type="checkbox" v-model = "fieldValue" :checked="fieldValue==true" @change="fieldChanged" />
      </span>
    </div>
     <div class="inputCssChecked" v-if="checked">
      <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
      <span>
        <input type="checkbox" v-model = "fieldValue" :checked="fieldValue==true" @change="fieldChanged" />
      </span>
       <span>
                <select v-model="borderWidth" @change="borderWidthChange">
                  <option value="narrow" >Narrow</option>
                  <option value="medium">Medium</option>
                  <option value="thick">Thick</option>
                </select>
       </span>
       <span>
                <select v-model="borderType" @change="borderTypeSelect">
                  <option value="solid" >Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                  <option value="ridge">Ridge</option>
                  <option value="inset">Inset</option>
                  <option value="outset">Outset</option>
                </select>
       </span>
       <span>
         <input type="color"  v-model = "colorValue"  @change="colorSelect"/>
       </span>
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
//import vselect from "../components/vselect.vue";


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}
const borderFieldsConfig = ref({});
const borderFieldsData = ref({});
const reloadBorderFieldsConfig = ref(0);

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
const checked = ref(false);

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
const fieldChanged = function(args){
  console.log('fieldChanged', args);
  if(checked.value==true){
    checked.value=false;
  }else{
    checked.value=true;
  }
  emit('cevt', [c.FIELD_CHANGED, 'borderInclude', checked.value]);
}
const borderWidth = ref('narrow');
const borderWidthChange = function(args){
  console.log('borderWidthChange', borderWidth.value);
  emit('cevt', [c.FIELD_CHANGED, 'borderWidth', borderWidth.value]);

}
const colorValue = ref('#ffffff');
const colorSelect = function(args){
  console.log('colorSelect', colorValue.value);
  emit('cevt', [c.FIELD_CHANGED, 'borderColor', colorValue.value]);
}
const borderType = ref("solid");
const borderTypeSelect = function(args){
  console.log('borderTypeSelect', borderType.value);
  emit('cevt', [c.FIELD_CHANGED, 'borderType', borderType.value]);
}

funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

onMounted(() => {
  debugger;
  if(typeof(props.data.borderInclude)!='undefined'){
    if(props.data.borderInclude==true){
      checked.value=true;
      if(typeof(props.data.borderColor)!='undefined'){
        colorValue.value = props.data.borderColor;
      }
      if(typeof(props.data.borderWidth)!='undefined'){
        borderWidth.value = props.data.borderWidth;
      }
      if(typeof(props.data.borderType)!='undefined'){
        borderType.value = props.data.borderType;
      }
    }
  }
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
.inputCssChecked {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 10% 15% 15% 15%;
}

</style>

