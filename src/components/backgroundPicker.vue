<template>
  <div class="inputCss">
    <span>{{props.config.label}}</span>
    <div class="componentStyle">

        {{props.config.fieldLabel}}

      <div class="flex-auto">
        <span>
          <input type="radio" @click="radioSelected('color')" id="colorBackground" name="backgroundType" :checked="fieldValue.backgroundType=='color'" />
          <label  for="colorBackground">Color</label>
        </span>
        <span>
          <input type="radio" @click="radioSelected('image')" value="image" id="imageBackground" name="backgroundType" :checked="fieldValue.backgroundType=='image'"/>
          <label for="imageBackground">Image</label>
        </span>
      </div>
      <span v-if="backType=='color'">
        <input type="color"  :value = "colorValue"  @change="colorSelect"/>
      </span>
      <span v-if="backType=='image'">
        <imageUploader :config="fileUploadConfig" @cevt="handleEvent($event, funcs, emit)"></imageUploader>
      </span>
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
import imageUploader from "../components/imageUploader.vue"
import {ref} from 'vue';
//debugger;

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = 'backgroundPicker'
const funcs = [];
const cmdHandlers = {}
const handleCmd = function(args){
  console.log('handleCmd-', name, args);
  if(name==args[2]) {
    if(typeof(funcs[args[0]]!='undefined')){
      console.log('Found func-', args[1]);
      funcs[args[0]](args);
    }
  }else{

  }
}
debugger;
const fieldValue = ref('');

if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}else{
  fieldValue.value = {};
}

const backType = ref(fieldValue.value.backgroundType);
const fileUploadConfig = ref({})
if(fieldValue.value.fileUploaded==true){
  fileUploadConfig.value = {
    fileAlreadyUploaded: true,
    backgroundDisplayType: 'image',
    parentName: props.config.name
  }
}else{
  fileUploadConfig.value = {
    fileAlreadyUploaded: false,
    backgroundDisplayType: 'color',
    parentName: props.config.name
  }
}
const radioSelected = function(type){
  console.log('radioSelected-', type);
  backType.value = type;
  emit('cevt', [c.FIELD_CHANGED, 'backgroundType', type]);
}


const colorValue = ref('');
debugger;

if(typeof(fieldValue.value.colorValue)=='undefined'){
  colorValue.value = "#bbaadd";
}else{
  colorValue.value = fieldValue.value.colorValue;
}


const colorSelect = function($event){
  console.log('colorSelect-', event.target.value);
  debugger;
  const fieldValue = {};
  fieldValue.backgroundType='color';
  fieldValue.backgroundColor=event.target.value;
  emit('cevt', [c.FIELD_CHANGED, props.config.name, fieldValue]);

//  emit('cevt', [c.FIELD_CHANGED, 'backgroundColor', event.target.value]);
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
.componentStyle {
  display: grid;
  grid-template-columns: 20% 20% 20%;
  margin-top: 7px;
}
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 40%;
}
</style>

