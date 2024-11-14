<template>
  <div style="width:100%;">
    <div class="inputCss">
      <div>
        <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
      </div>

      <div class="fpTable">
        <div>
          <div>
            Font Family
          </div>
          <div><vselect :data = "props.data.font.fontFamily" :config="fontConfig"></vselect></div>
          <div>a3</div>
        </div>
        <div>
          <div>Size</div>
          <div><vselect :data = "props.data.font.fontSize" :config="fontSizeConfig"></vselect></div>
          <div>b3</div>
        </div>
        <div>
          <div>Weight</div>
          <div>c2</div>
          <div>c3</div>
        </div>
        <div>
          <div>Style</div>
          <div>d2</div>
          <div>d3</div>
        </div>
        <div>
          <div>Align</div>
          <div>e2</div>
          <div>e3</div>
        </div>
        <div>
          <div>Color</div>
          <div>f2</div>
          <div>f3</div>
        </div>
      </div>
    </div>

  </div>



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
import vselect from "../components/vselect.vue";


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  if(typeof(props.data.font)!='undefined'){
    fieldValue.value = props.config.value(props.data.font);
  }else {
    fieldValue.value = props.config.value(props.data.font.defaultFont);
  }
}
const fontConfig = ref({});
fontConfig.value.selectOptions = c.DEFAULT_FONTS;
fontConfig.value.selectType = "pulldown";
const fontSizeConfig = ref({});
fontSizeConfig.value.selectOptions = c.FONT_SIZE_OPTIONS;
fontSizeConfig.value.selectType = "pulldown";

const fontData = ref({});
//  fontData.value = props.data.font.fontFamily;
  fontData.value='Ariel';


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
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

</script>

<style scoped>
.fpTable {
  display:grid;
  grid-template-columns: 30% 10% 10% 10% 10% 10%;
  grid-template-rows: 30% 30% 30%;
  height: 20%;
  width: 100%;


}
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 80%;

}

</style>


