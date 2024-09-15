<template>

  <displayGrid :config="fieldValue.layout" :data="fieldValue.cards" v-if="pageMode==c.PAGE_DISPLAY" :key="pageReload" @cevt="handleEvent($event, funcs, emit)"/>
  <editGrid :config="fieldValue" :data="fieldValue.cards" v-if="pageMode==c.PAGE_EDIT" :key="pageReload" @cevt="handleEvent($event, funcs, emit)"/>


</template>

<script setup>

import {whenever} from "@vueuse/core";

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
import {onMounted, onUnmounted, toRaw} from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {ref, nextTick} from 'vue';
import displayGrid from "../components/displayGrid.vue";
import editGrid from "../components/editGrid.vue";



import {useCurrentPage} from "../stores/currentPage.js";
const pageStore = useCurrentPage();

import {useLogStateStore} from "../stores/logState.js";
const loginStore = useLogStateStore();

import {getTrans} from "./dbTrans.js";
const {executeTrans} = getTrans();


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}
const pageMode = ref(0);
const contentDimensions = ref({});


//load the page data using page id from pageStore

const fieldValue = ref('');
const pageReload = ref(0);
const loginResult= toRaw(loginStore.loginStatus);

//console.log('page parms-', parms);
const header = '';
const dataReady = ref(false);
const transResult = ref({});
const parms = ref({});

const pageCells = ref([]);

const mouseStatus = ref(c.MOUSE_STATUS_NOT_CLICKED);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragEndX = ref(0);
const dragEndY = ref(0);
const widthNow = ref(0);

const reloadThisPage = function(){

  console.log('page parms-', parms);
  debugger;
//const ready = ref(false);
  executeTrans(parms.value, c.TRANS_GET_LAYOUT,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
  dataReady.value = false;
  whenever(dataReady, () => {
    console.log('data is ready-', transResult);
    debugger;
    fieldValue.value = transResult.value;
    fieldValue.value.pageName=c.PAGE_DISPLAY_NAME;
    fieldValue.value.layout.pageDimensions=toRaw(props.config).pageDimensions;
    if(props.config.mode==c.MODE_DISPLAY){
      pageMode.value=c.PAGE_DISPLAY;
    }
    pageReload.value+=1;
    console.log('pageReload');
  })
}

/*
//const ready = ref(false);
executeTrans(parms, c.TRANS_GET_LAYOUT,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
whenever(dataReady, () => {
  debugger;
  console.log('data is ready-', transResult);
  fieldValue.value = transResult.value;
  fieldValue.value.pageName=c.PAGE_DISPLAY_NAME;
  fieldValue.value.layout.pageDimensions=toRaw(props.config).pageDimensions;
  pageMode.value=c.PAGE_DISPLAY;
  pageReload.value+=1;
})
//fieldValue.value = transResult.value;
*/

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

funcs[c.SET_PAGE_EDIT]= function(cmd){
  console.log('set page edit called', cmd);
  debugger;
  pageCells.value = createBlankPage(fieldValue.value.layout.height, fieldValue.value.layout.width, '#DBAA6E');
  fieldValue.value.pageCells = pageCells.value;
  pageMode.value = c.PAGE_EDIT;

}

funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  debugger;
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
funcs[c.SET_CONTENT_DIMENSIONS]=function(evt){
  console.log('in SET_CONTENT_DIMENSIONS', evt);
//  contentDimensions.value = evt[1];

}
funcs[c.SET_NEW_LAYOUT]= function(cmd){
  console.log('in SET_NEW_LAYOUT handler-', cmd);
  debugger;
  pageStore.setCurrentPageId(cmd[1]);
  console.log('currentPageId',pageStore.getCurrentPageId)
  parms.value   = {
    orgId:loginResult.orgId,
    userId:loginResult.userId,
    layoutId:pageStore.getCurrentPageId,
  }
  emit('cevt',[c.EXIT_DIALOG])
  nextTick(() => {
    reloadThisPage();
  });

}
funcs[c.MOUSE_EVT] = function(evt){
  //console.log('in MOUSE_EVT', evt);
  //if(evt[1]==c.MOUSE_UP){
    //console.log('mouse up recieved', evt, mouseStatus.value);
  //}
  switch(mouseStatus.value){
    case c.MOUSE_STATUS_NOT_CLICKED:{
      if(evt[1]==c.MOUSE_DOWN){
        //console.log('mouse event down-', evt);
        mouseStatus.value = c.MOUSE_STATUS_DOWN;
        dragStartX.value = evt[3];
        dragStartY.value = evt[4];
      }
      break;
    }
    case c.MOUSE_STATUS_DOWN: {
      //console.log('in mouse down-', evt);
      if(evt[1]==c.MOUSE_UP){
        debugger;
        //console.log('mouse event up-', evt);
        dragEndX.value = evt[3];
        dragEndY.value = evt[4];
        try {
          fillCellsInArea(dragEndX.value, dragEndY.value, dragStartX.value, dragStartY.value, c.SELECTED_COLOR);
          mouseStatus.value = c.MOUSE_STATUS_NOT_CLICKED;
          dragEndX.value = 0;
          dragEndY.value = 0;
          dragStartX.value = 0;
          dragStartY.value = 0;




        } catch (e) {
//              debugger;
//              console.log('error 1', e);
//              console.log('error in fillCells',this.dragEndX, this.dragEndY, this.dragStartX, this.dragStartY);
        }

      }

    }
  }
}



onMounted(() => {
  debugger;
  parms.value   = {
    orgId:loginResult.orgId,
    userId:loginResult.userId,
    layoutId:pageStore.getCurrentPageId,
  }
  reloadThisPage();

  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

const fillCellsInArea = function(dragX, dragY, topLeftX, topLeftY, fillColor){
  console.log('fillCellsInArea called', dragX, dragY, topLeftX, topLeftY, fillColor);
  var thisDragDirectiion = dragDirection(dragX, dragY, topLeftX, topLeftY);
  console.log('dragDirection-',thisDragDirectiion);
  debugger;
  switch(thisDragDirectiion){
    case c.DIRECTION_DOWN_RIGHT:{
      widthNow.value = dragX-topLeftX;
      for (var row = (topLeftY); row < (dragY+1); row++) {
        for (var col = (topLeftX); col < (dragX+1); col++) {
          var thisCellAddress = cellAddress(col, row);
          cmdHandlers[thisCellAddress]([c.SET_CELL, c.SELECTED_COLOR, thisCellAddress]);
        }
      }
      break;
    }
    case c.DIRECTION_DOWN_LEFT:{
      widthNow.value = topLeftX - dragX;
      for (var row = (topLeftY); row < (dragY+1); row++)  {
        for (var col = dragX; (col<(topLeftX+1));  col++) {
          var thisCellAddress = cellAddress(col, row);
          cmdHandlers[thisCellAddress]([c.SET_CELL, c.SELECTED_COLOR, thisCellAddress]);
        }
      }
      break;
    }
    case c.DIRECTION_UP_RIGHT:{
      widthNow.value = topLeftX - dragX;
      for (var row = (topLeftY); row >= (dragY); row--){
        for (var col = (topLeftX); col < (dragX+1); col++) {
          var thisCellAddress = cellAddress(col, row);
          cmdHandlers[thisCellAddress]([c.SET_CELL, c.SELECTED_COLOR, thisCellAddress]);
        }
      }
    }
  }
}

const dragDirection = function(dragX, dragY, topLeftX, topLeftY){
  var dragDirection;
  if(dragX < topLeftX){
    if(dragY == topLeftY){
      dragDirection = c.DIRECTION_STRAIGHT_LEFT;
    }else if(dragY < topLeftY){
      dragDirection = c.DIRECTION_UP_LEFT;
    }else{
      dragDirection = c.DIRECTION_DOWN_LEFT;
    }
  }else if(dragX>topLeftX){
    if(dragY == topLeftY){
      dragDirection = c.DIRECTION_STRAIGHT_RIGHT;
    }else if(dragY < topLeftY){
      dragDirection = c.DIRECTION_UP_RIGHT;
    }else{
      dragDirection = c.DIRECTION_DOWN_RIGHT;
    }
  }else if(dragX==topLeftX){
    if(dragY < topLeftY){
      dragDirection = c.DIRECTION_STRAIGHT_UP;
    }else{
      dragDirection=c.DIRECTION_STRAIGHT_DOWN;
    }
  }
  return dragDirection;
}

const createBlankPage = function(height, width, backgroundColor) {
  debugger;
//      console.log('entering createBlankPage-', height, width, backgroundColor);

  var pageCells = [];
  var newCellId = 1;
  height++;
  width++;
  for (var h = 1; h < height; h++) {
    for (var w = 1; w < width; w++) {
      var c = createBlankCellInstance(h, w, 1, 1, newCellId,backgroundColor);
      pageCells.push(c);
      newCellId++;
    }
  }
  return pageCells;
}


const createBlankCellInstance = function(row, col, height, width, id, background){
//      console.log('createBlankCellInstance:'+row+' '+col+' '+height+' '+width+ ' '+id);
  var thisGridCss = computeGridCss(row, col, height, width);
  var thisCellStyle = thisGridCss+";"+"background-color:"+background+";color:#0000FF;";
//      debugger;
//  var thisCellName = 'c'+id;
  var thisCellName = cellAddress(col, row);
  var thisCellParams = {
    style: thisCellStyle,
    backgroundColor: background,
    gridCss: thisGridCss,
    name: thisCellName,
    color: '#0000FF'
  }
  return {component: 'Cell', cell_position: [row,col,height,width], id:id, toDelete: false, cell_parameters: thisCellParams};
}

const computeGridCss = function(row, col, height, width){
//        debugger;
  var startRow = row;
  var startColumn = col;
  var endRow=0;
  var endCol=0;
  if(height==1){
    endRow = row;
  }else{
    endRow = height+1;
  }
  if(width==1){
    endCol=startColumn+width;
  }else{
    endCol = width+1;
  }
  return  "grid-area:"+startRow+"/"+startColumn+"/"+endRow+"/"+endCol;

}

const isCellInSelectedArea = function(x,y,selectedArea){
  if(y>=selectedArea.topLeftY&&y<=selectedArea.bottomRightY){
    if(x>=selectedArea.topLeftX&&x<=selectedArea.bottomRightX){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

const updateBlankPage = function(height, width, backgroundColor, selectedArea, existingPageCells){
  var pageCells = [];
  console.log('inUpdateBlankPage-', existingPageCells);
  height++;
  width++;
//      debugger;
  for ( var c = 0; c< existingPageCells.length; c++){
    var cellPositionY =  existingPageCells[c].cell_position[0];
    var cellPositionX =  existingPageCells[c].cell_position[1];
    var thisCell= existingPageCells[c];
//        console.log('cell in selected area-', this.isCellInSelectedArea(cellPositionX, cellPositionY, selectedArea));
//        console.log('cell position-', cellPositionX, cellPositionY);
    if(isCellInSelectedArea(cellPositionX, cellPositionY, selectedArea)==false){
      pageCells.push(thisCell);
    }else{
      console.log('cell in selected area-', thisCell);
//          debugger;
      var newCell = createBlankCellInstance(cellPositionY, cellPositionX, 1, 1, thisCell.id, '#00FFCC');
      console.log('cell in selected area replacement-',newCell);
//          thisCell.cell_parameters.backgroundColor='#00FFCC';
//          debugger;
      pageCells.push(newCell);
    }
  }
  console.log('resulting page cells', pageCells);
  return pageCells;
}
const cellAddress = function(x,y){
//     debugger;
  var zeros='000000';
  var addrX = x.toString();
  var addrY = y.toString();
  addrX = zeros+addrX;
  addrY = zeros+addrY;
  return  addrX.slice(-4)+addrY.slice(-4);
}



</script>

<style scoped>
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 40%;
}
.autoScroll {
  overflow: scroll;
}

</style>

