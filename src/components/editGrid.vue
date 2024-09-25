<template>
  <span :style="pageCss">
     <cell v-for="(thisCell, index) in props.config.pageCells"
           :config="thisCell"
           :data="{}"
           :is-draggable=false
           :key="index"
           :name="thisCell.cell_parameters.name"
           @cevt="handleEvent($event, funcs, emit)"
     ></cell>
    <Card v-for="(aCard, i) in props.data"
          :key="i"
          :config="cardConfig"
          :data="aCard"
          @cevt="handleEvent($event, funcs, emit)"
    ></Card>
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
import cell from "../components/Cell.vue";
import Card from "../components/Card.vue";

import {usePageCss} from "../components/pageCss.js";
const {setupPageCss, computeGridCss} = usePageCss();
const pageCss = setupPageCss(props.config.layout);


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}
//const pageCells = ref([]);
const cardConfig = ref({});
cardConfig.value.mode = c.MODE_EDIT;

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
/*
funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
 */
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

onMounted(() => {
  debugger;
//  pageCells.value = createBlankPage(props.config.height, props.config.width,'#DBAA6E' );
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})
/*
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
  var thisCellName = 'c'+id;
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
*/

</script>

<style scoped>
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 40%;
}

</style>

