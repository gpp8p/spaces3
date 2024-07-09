<template>

     <div class="tablePlusPager">
      <lTab v-if="loaderFunctionsReady"
          :config="currentTableConfig"
          :data="dataToShow"
          :key="tableReload"
          @cevt="handleEvent($event, funcs, emit)"
      ></lTab>
      <div><Pager v-if="props.config.includePager==true"
          :config="pagerProps"
          :data = "pagerData"
          @cevt="handleEvent($event, funcs, emit)"
      ></Pager></div>
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
import lTab from "../components/iTab4.vue";
import {ref} from 'vue';
import Pager from "../components/Pager.vue";
import { watch } from 'vue'

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
const loaderFunctions = ref({});
const loaderFunctionsReady = ref(false);

const dataToShow = ref([]);


watch(
    () => loaderFunctionsReady.value,
    (newValue) => {
      console.log('loaderFunctionsReady', newValue);
      console.log('loaders:', loaderFunctions.value);
      console.log('getCapabilities',loaderFunctions.value.funcGetCapabilities());
//      dataToShow.value = loaderFunctions.value.funcReadAllData(props.data[props.config.name]);



      currentTableConfig.value.spacesCount = loaderFunctions.value.funcGetRecordCount(props.data[props.config.name]);
      currentTableConfig.value.totalPages = Math.floor(currentTableConfig.value.spacesCount/pagerProps.value.perPage);
/*
      dataToShow.value = loaderFunctions.value.funcReadFirst(props.data[props.config.name], pagerProps.value.perPage, 0);
      console.log('dataToShow',dataToShow.value);
      tableReload.value+=1;
*/
      if(currentTableConfig.value.includePager){
        dataToShow.value = loaderFunctions.value.funcReadFirst(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
        currentTableConfig.value.rowStart = 0;
        currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
        console.log('dataToShow---',dataToShow.value);
        console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
        console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
//      currentRowPointer.value = currentRowPointer.value+currentTableConfig.value.rowsToShow;
        currentRowPointer.value = 0;
      }else{
        dataToShow.value = loaderFunctions.value.funcReadAllData(props.data[props.config.name]);
        currentTableConfig.value.rowsToShow=dataToShow.value.length;
        tableReload.value+=1;
      }

    }
)
console.log('loaderFunctions',loaderFunctions.value);
//fieldValue.value = loaderFunctions.value.readAllData(props.data);
const tableReload = ref(1);
const rowStart = ref(0);
const rowsToShow = ref(props.config.selectSize);
const pagerProps = ref({});
pagerProps.value.name = 'pager';
const pagerData = ref({});
const currentRowPointer = ref(0);

pagerProps.value.currentPage = 1;
pagerProps.value.totalPages =4;
pagerProps.value.name = 'field9';
pagerProps.value.maxVisibleButtons = 3;
pagerProps.value.perPage = 4;
pagerProps.value.buttonCss = props.config.pagerButtonCss;
pagerProps.value.buttonCssActive = props.config.pagerButtonCssActive;

const currentTableConfig = ref(props.config);
currentTableConfig.value.rowStart = rowStart;
currentTableConfig.value.rowsToShow = rowsToShow;
currentTableConfig.value.pageAt=1;
currentRowPointer.value = 0;
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data, loaderFunctions, loaderFunctionsReady);
}
//debugger;

//console.log('pageCount', currentTableConfig.value.spacesCount, pagerProps.value.perPage)
//var rawPageCount = currentTableConfig.value.spacesCount/pagerProps.value.perPage;
//console.log('rawPageCount', rawPageCount);
//currentTableConfig.value.totalPages = Math.floor(currentTableConfig.value.spacesCount/pagerProps.value.perPage);




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
funcs[c.FIRST_PAGE]=function(evt){
  console.log('in FIRST_PAGE-', evt);
  console.log('currentRowPointer', currentRowPointer.value);
  console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
  console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
  console.log('pagerProps.value.currentPage', pagerProps.value.currentPage);
  dataToShow.value = loaderFunctions.value.funcReadFirst(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
  currentTableConfig.value.rowStart = 0;
  currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
  console.log('dataToShow---',dataToShow.value);
//  currentRowPointer.value = currentRowPointer.value+currentTableConfig.value.rowsToShow;
  currentRowPointer.value =0;
  pagerProps.value.currentPage=1;
  tableReload.value+=1;
}
funcs[c.NEXT_PAGE]=function(evt){
  debugger;
  console.log('in NEXT_PAGE-', evt);
  console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
  console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
  console.log('pagerProps.value.currentPage', pagerProps.value.currentPage);

  if(pagerProps.value.currentPage!=currentTableConfig.value.totalPages)
  {
//    dataToShow.value = loaderFunctions.value.funcReadNext(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
    currentTableConfig.value.rowStart = 0;
    currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
    console.log('dataToShow---', dataToShow.value);
    currentRowPointer.value = currentRowPointer.value + currentTableConfig.value.rowsToShow;
    currentTableConfig.value.pageAt = currentTableConfig.value.pageAt + 1;
    pagerProps.value.currentPage+=1;
    dataToShow.value = loaderFunctions.value.funcReadNext(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
    tableReload.value += 1;
  }else{
    alert('End of data reached');
  }
}
funcs[c.PREV_PAGE]=function(evt){
  console.log('in PREV_PAGE-', evt);
  console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
  console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
  console.log('pagerProps.value.currentPage', pagerProps.value.currentPage);
  debugger;
  if(currentTableConfig.value.pageAt>1){
    currentRowPointer.value = currentRowPointer.value-currentTableConfig.value.rowsToShow;
    dataToShow.value = loaderFunctions.value.funcReadPrev(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
    currentTableConfig.value.pageAt = currentTableConfig.value.pageAt-1;
    currentTableConfig.value.rowStart = 0;
    currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
    pagerProps.value.currentPage-=1;
    tableReload.value+=1;
  }else{
    alert('Begining of data reached');
  }
}
funcs[c.LAST_PAGE]=function(evt){
  debugger;
  console.log('in LAST_PAGE-', evt);
  console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
  console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
  console.log('pagerProps.value.currentPage', pagerProps.value.currentPage);
  currentTableConfig.value.pageAt = currentTableConfig.value.totalPages;
  currentRowPointer.value=(currentTableConfig.value.spacesCount-pagerProps.value.perPage);
  dataToShow.value = loaderFunctions.value.funcReadLast(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
  currentTableConfig.value.rowStart = 0;
  currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
//  currentRowPointer.value=currentTableConfig.value.spacesCount;
  pagerProps.value.currentPage=currentTableConfig.value.totalPages;
  tableReload.value+=1;
}
funcs[c.THIS_PAGE]=function(evt){
  debugger;
  console.log('in THIS_PAGE-', evt);
  console.log('in LAST_PAGE-', evt);
  console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
  console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
  console.log('pagerProps.value.currentPage', pagerProps.value.currentPage);
  currentTableConfig.value.pageAt = evt[1];
  currentRowPointer.value=(evt[1]-1)*currentTableConfig.value.rowsToShow;
  pagerProps.value.currentPage=evt[1];
  currentTableConfig.value.rowStart = 0;
  dataToShow.value = loaderFunctions.value.funcReadThisRecord(props.data[props.config.name], pagerProps.value.perPage, currentRowPointer.value);
  tableReload.value+=1;


}
funcs[c.PAGE_CHANGED]=function(evt){
  console.log('in PAGE_CHANGED-', evt);
}
funcs[c.LOADERS_AVAILABLE]=function(evt){
  console.log('in LOADERS_AVAILABLE in listTable-', evt);
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
.scrollTable {
  font-family: Arial;
  width: 100%;
  margin-right: 10%;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}
.tablePlusPager {
  display: grid;
  grid-template-rows: 90% 10%;
  grid-template-columns: 100%;
}

</style>

