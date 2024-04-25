<template>
  <component v-for="(thisField, index) in dialogDef.login.fields"
             :is="thisField.type"
             :config="thisField"
             :key="index"
             @cevt="handleEvent($event, funcs, emit)"
             @error="handleError($error)"
  ></component>
</template>

<script>
import {defineComponent, onMounted, onUnmounted} from 'vue';
import {getDialogDefinitions} from "./dialogDefinitions.js";


import {c} from "../components/constants.js";
import {useEventHandler} from "./eventHandler.js";

import htmlTextInput from './htmlTextInput.vue';
import htmlPasswordInput from './htmlPasswordInput.vue';


export default defineComponent({
  name: "dialogFields2",
  components: {
    htmlTextInput,
    htmlPasswordInput
  },
  props: {
    dialogDef: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    emits: ['cevt']
    const cmdHandlers = {}
    const funcs = [];
    const {handleEvent} = useEventHandler();
    const handleCmd = function(args){
      console.log('handleCmd-', name, args);
    }
    const handleError = function(evt){
      console.log('input error-', evt);
      emit('cevt', [c.INPUT_ERROR, handleCmd, name]);
    }
    const handleInput = (data) => {
      emit('cevt', [data]);
    };
    onMounted(() => {
      emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
    })

    onUnmounted(() => {
      emit('cevt', [c.UNSET_CMD_HANDLER, name]);
    })
    return {
      handleInput,
      handleEvent,
      handleCmd,
      handleError,
      funcs,
      emit
    };





  },


});
</script>

<style scoped>

</style>
