<template>
  <dynaComponent v-for="(thisField, index) in thisDialogDefinition.login.fields"
             :config="thisField"
  ></dynaComponent>
</template>

<script setup>
import {defineAsyncComponent, ref} from 'vue';
const props = defineProps({
  dialogName: {
    type: String,
    required: true,
  },
  dialogDef: {
    type: Object,
    required: true
  }
});
debugger;
console.log('props-', props.dialogName);

import {c} from "../components/constants.js";
import { onMounted, onUnmounted } from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {getDialogDefinitions} from "./dialogDefinitions.js";
import htmlTextInput from '../components/htmlTextInput.vue';
import htmlPasswordInput from '../components/htmlPasswordInput.vue';
//import {getDialogDefinitions} from '../components/dialogDefinitions.js';
import dynaComponent from '../components/dynaComponent.vue';
const {getDialog} = getDialogDefinitions();

//const dialogName = 'login';
debugger;
const thisDialogDefinition = getDialog(c, props.dialogName);
console.log('thisDialogDefinition-', thisDialogDefinition);
console.log('dialogDefs-', props.dialogDef.login.fields);
const dialogFields = props.dialogDef.login.fields;
console.log('dialogFields-', dialogFields);

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = 'componentName'
const funcs = [];
const cmdHandlers = {}
const testFieldType = ref("htmlTextInput")

funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

const handleCmd = function(args){
  console.log('comp1 handleCmd-', args);
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

