<template>
  <ul class="pagination">
    <li class="pagination-item" v-if="!isInFirstPage">
      <button
          :class="props.config.buttonCss"
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
      >
        First
      </button>
    </li>

    <li class="pagination-item" v-if="!isInFirstPage">
      <button
          :class="props.config.buttonCss"
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
      >
        Previous
      </button>
    </li>

    <!-- Visible Buttons Start -->

    <li
        v-for="page in pages"
        :key="page.name"
        class="pagination-item"
    >
      <button

          type="button"
          @click="onClickPage(page.name)"
          :disabled="page.isDisabled"
          :class="activePageCss(page.name)"
      >
        {{ page.name }}
      </button>
    </li>

    <!-- Visible Buttons End -->

    <li class="pagination-item">
      <button
          :class="props.config.buttonCss"
          type="button"
          @click="onClickNextPage"

      >
        Next
      </button>
    </li>

    <li class="pagination-item">
      <button
          :class="props.config.buttonCss"
          type="button"
          @click="onClickLastPage"
          :disabled="isInLastPage"
      >
        Last
      </button>
    </li>
  </ul>
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
import { reactive, computed } from 'vue'


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}

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
const isInFirstPage = computed(() => {
  return props.config.currentPage === 1;
})

const isInLastPage = computed(() => {
  return props.config.currentPage === props.config.totalPages;
})


const startPage = computed(() => {
  if (props.config.currentPage === 1) {
    return 1;
  }

  // When on the last page
  if (props.config.currentPage === props.config.totalPages) {
    return props.config.totalPages - props.config.maxVisibleButtons;
  }

  // When inbetween
//      return this.currentPage - 1;
  return props.config.currentPage;
})
const pages = computed(() => {
  const range = [];
  debugger;
  for (
      let i = startPage.value;
      i <= Math.min(startPage.value + props.config.maxVisibleButtons - 1, props.config.totalPages);
      i++
  ) {
    range.push({
      name: i,
      isDisabled: i === props.config.currentPage
    });
  }

  return range;
})

const isPageActive = function(page) {
  return props.config.currentPage === page;
//      return this.currentPage === page+1;
}

const activePageCss = function(page) {
  if(isPageActive(page)){
    return props.config.buttonCssActive;
  }else{
    return props.config.buttonCss;
  }
}

const onClickFirstPage = function(){
  console.log('first page');
  emit('cevt',[c.FIRST_PAGE]);
}

const onClickPreviousPage = function(){
  console.log('previous page');
  emit('cevt',[c.PREV_PAGE]);
}

const onClickPage = function(page){
  console.log('this page');
  emit('cevt',[c.THIS_PAGE, page]);
}

const onClickNextPage = function(){
  console.log('next page');
  debugger;
  emit('cevt',[c.NEXT_PAGE, props.config.currentPage + 1]);
}
const onClickLastPage = function(){
  console.log('last page');

  emit('cevt',[c.PAGE_CHANGED, props.config.totalPages]);
  emit('cevt',[c.LAST_PAGE, props.config.totalPages]);
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

.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 40%;
}

.pagination {
  list-style-type: none;
}

.pagination-item {
  display: inline-block;
}

.active {
  background-color: #4AAE9B;
  color: #ffffff;
}
.button {
  background-color: #04AA6D; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>

