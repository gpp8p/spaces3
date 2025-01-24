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
import {getLoaders} from '../components/ltLoader.js';
import { toRaw} from 'vue'
import {getAppearanceConfigs}  from "../components/cardAppearence.js";
const {loadCardAppearanceConfigs, saveCardAppearanceConfigs, createCard, twListTableHeight} = getAppearanceConfigs();

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
const loaderFunctions = ref({});
const loaderFunctionsReady = ref(false);

const dataToShow = ref([]);

//const loaders = getLoaders(props.config.loaderType);




debugger;

//fieldValue.value = loaderFunctions.value.readAllData(props.data);
const tableReload = ref(1);
const rowStart = ref(0);
const rowsToShow = ref(props.config.selectSize);
const pagerProps = ref({});
pagerProps.value.name = 'pager';
const pagerData = ref({});
const currentRowPointer = ref(0);

pagerProps.value.currentPage = 1;
//pagerProps.value.totalPages =100;
pagerProps.value.name = 'pager';
pagerProps.value.maxVisibleButtons = 3;
pagerProps.value.perPage = 7;
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
  currentRowPointer.value = 0;
  console.log('currentRowPointer', currentRowPointer.value);
  console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
  console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
  console.log('pagerProps.value.currentPage', pagerProps.value.currentPage);
  props.data.funcReadPagedData(currentTableConfig, pagerProps.value.perPage, currentRowPointer.value, loaderFunctionsReady, tableReload, dataToShow);
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
    props.data.funcReadPagedData(currentTableConfig, pagerProps.value.perPage, currentRowPointer.value, loaderFunctionsReady, tableReload, dataToShow);
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
    props.data.funcReadPagedData(currentTableConfig, pagerProps.value.perPage, currentRowPointer.value, loaderFunctionsReady, tableReload, dataToShow);
    currentTableConfig.value.pageAt = currentTableConfig.value.pageAt-1;
    currentTableConfig.value.rowStart = 0;
    currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
    pagerProps.value.currentPage-=1;

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
  props.data.funcReadPagedData(currentTableConfig, pagerProps.value.perPage, currentRowPointer.value, loaderFunctionsReady, tableReload, dataToShow);
  currentTableConfig.value.rowStart = 0;
  currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
//  currentRowPointer.value=currentTableConfig.value.spacesCount;
  pagerProps.value.currentPage=currentTableConfig.value.totalPages;

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
  props.data.funcReadPagedData(currentTableConfig, pagerProps.value.perPage, currentRowPointer.value, loaderFunctionsReady, tableReload, dataToShow);
  tableReload.value+=1;


}
funcs[c.PAGE_CHANGED]=function(evt){
  console.log('in PAGE_CHANGED-', evt);
}
funcs[c.LOADERS_AVAILABLE]=function(evt){
  console.log('in LOADERS_AVAILABLE in listTable-', evt);
}
funcs[c.MOVE_ROW_UP] = function(evt){
  console.log('in MOVE_ROW_UP-', evt);
  if(evt[1]==0){
    alert('At Top Row Already')
  }else{
    var rowAbove = dataToShow.value[evt[1]-1];
    var thisRow = dataToShow.value[evt[1]];
    dataToShow.value[evt[1]-1] = thisRow;
    dataToShow.value[evt[1]] = rowAbove;
    tableReload.value+=1;
    emit('cevt',[c.SET_REORDER_OFF]);
  }
}
funcs[c.MOVE_ROW_DOWN] = function(evt){
  console.log('in MOVE_ROW_DOWN-', evt);
  debugger;
  var linkTableLength = dataToShow.value.length-1;
  if(evt[1]<linkTableLength){
    var rowAbove = dataToShow.value[evt[1]+1];
    var thisRow = dataToShow.value[evt[1]];
    dataToShow.value[evt[1]+1] = thisRow;
    dataToShow.value[evt[1]] = rowAbove;
    tableReload.value+=1;
    emit('cevt',[c.SET_REORDER_OFF]);
  }else{
    alert('At Bottom Row Already');
  }
}

/*
funcs[c.ROW_SELECT]=function(evt){
  console.log('in listTable ROW_SELECT-', evt);
  debugger;
  if(typeof(funcs[c.RESOLVE_DATA])!='undefined'){
    emit('cevt', [c.CHANGE_LAYOUT, name], funcs[c.RESOLVE_DATA](evt));
  }else{
    emit('cevt', evt);
  }
}

 */

onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);

  //currentTableConfig.value.totalPages = Math.floor(currentTableConfig.value.spacesCount/pagerProps.value.perPage);
  //pagerProps.value.totalPages =currentTableConfig.value.totalPages;
  currentRowPointer.value = 0;
  if(currentTableConfig.value.includePager){
    currentTableConfig.value.spacesCount = props.data.funcGetRecordCount(currentTableConfig, pagerProps.value.perPage, pagerProps);
    props.data.funcReadPagedData(currentTableConfig, pagerProps.value.perPage, currentRowPointer.value, loaderFunctionsReady, tableReload, dataToShow);
    currentTableConfig.value.rowStart = 0;
    currentTableConfig.value.rowsToShow = pagerProps.value.perPage;
    console.log('dataToShow---',dataToShow.value);
    console.log('currentTableConfig.value.pageAt', currentTableConfig.value.pageAt);
    console.log('currentTableConfig.value.totalPages', currentTableConfig.value.totalPages);
//      currentRowPointer.value = currentRowPointer.value+currentTableConfig.value.rowsToShow;
    currentRowPointer.value = 0;
  }else{
    debugger;
    if(typeof(props.data.dataToShow)!='undefined'){
      var dta =toRaw(props.data.dataToShow);
      dataToShow.value=dta;
      currentTableConfig.value.rowsToShow = toRaw(dataToShow.value).length;
      props.config.twbody = twListTableHeight(props.config.twbody_base, props.config.selectSize, currentTableConfig.value.rowsToShow )
      loaderFunctionsReady.value=true;
    }else{
      console.log('mounting listTable=',props.data);
      props.data.funcReadAllData(tableReload, dataToShow, loaderFunctionsReady, currentTableConfig, props.data.id);
      console.log('dataToShow---',dataToShow.value);
    }


    //emit('cevt', [c.FIELD_CHANGED, 'currentLinks', toRaw(dataToShow.value)]);
    tableReload.value+=1;
  }
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

