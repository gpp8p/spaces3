<template>
  <div>
    <input type="file" id="file" ref="file" v-if="props.config.fileAlreadyUploaded==false" v-on:change="handleFileUpload(sendResults)"/>
  </div>
</template>

<script setup>

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
});



import {c} from "../components/constants.js";
import { onMounted, onUnmounted, ref } from 'vue'
import {useEventHandler} from "./eventHandler.js";
import axios from 'axios'


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = 'componentName'
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
const sendResults = function(response){
  console.log('send results invoked');
  debugger
  emit('cevt', [c.FIELD_CHANGED,'backgroundType', 'image', props.config.parentName]);
  emit('cevt', [c.FIELD_CHANGED,'backgroundImage', response, props.config.parentName]);
//  emit('cevt', [c.FIELD_CHANGED,'backgroundDisplay', backgroundDisplayType.value, props.config.parentName]);

}
//const backgroundDisplayType = ref('cover');
const file=ref(null);
const handleFileUpload = function(rsltsSender){
  console.log('uploaded file-', file._rawValue.files[0]);
  let formData = new FormData();
  formData.append('file', file._rawValue.files[0]);
  formData.append('org', 1);
  formData.append('fileRole', 'uploadedFile');
// eslint-disable-next-line no-debugger
  debugger;
  const apiPath = 'http://localhost:8000/';
  console.log('apiPath - ',apiPath);

  axios.post( apiPath+'api/shan/fileUpload?XDEBUG_SESSION_START=15617',
//                axios.post( 'http://localhost:8000/api/shan/fileUpload?XDEBUG_SESSION_START=15617',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
  ).then(response=>{
// eslint-disable-next-line no-console
    debugger;
//    console.log('this-', this);
    console.log('file uploader response.data-', response.data);
    rsltsSender(response.data);
    console.log('SUCCESS!!'+response.data);
    this.uploadStatus=false;
  }).catch(function(error){
    debugger;
    console.log('FAILURE!!'+error);
  });
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

</style>

