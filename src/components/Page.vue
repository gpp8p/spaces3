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

const inResize = ref(false);
const mouseStatus = ref(c.MOUSE_STATUS_NOT_CLICKED);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragEndX = ref(0);
const dragEndY = ref(0);
const widthNow = ref(0);
const dragAtX = ref(0);
const dragAtY = ref(0);
const dragWasAtX = ref(0);
const dragWasAtY = ref(0);
const allCards = ref([]);
const reloadThisPage = function(){

  // console.log('page parms-', parms);
//  debugger;
//const ready = ref(false);
  executeTrans(parms.value, c.TRANS_GET_LAYOUT,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
  dataReady.value = false;
  whenever(dataReady, () => {
    // console.log('data is ready-', transResult, fieldValue.value);
    //debugger;
    fieldValue.value = transResult.value;
    fieldValue.value.pageName=c.PAGE_DISPLAY_NAME;
    fieldValue.value.layout.pageDimensions=toRaw(props.config).pageDimensions;
    if(props.config.mode==c.MODE_DISPLAY){
      pageMode.value=c.PAGE_DISPLAY;
    }
    pageReload.value+=1;
    // console.log('pageReload');
  })
}

/*
//const ready = ref(false);
executeTrans(parms, c.TRANS_GET_LAYOUT,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
whenever(dataReady, () => {
  //debugger;
  // console.log('data is ready-', transResult);
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
  // console.log('handleCmd-', name, args);
  //debugger;
  if(name==args[2] || args[2]=='*') {
    if(typeof(funcs[args[0]])!='undefined'){
      // console.log('Found func-', args[1]);
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
  // console.log('set page edit called', cmd);
  //debugger;
  pageCells.value = createBlankPage(fieldValue.value.layout.height, fieldValue.value.layout.width, '#DBAA6E');
  //debugger;
  fieldValue.value.pageCells = pageCells.value;
  pageMode.value = c.PAGE_EDIT;

}



funcs[c.SET_CMD_HANDLER]= function(evt){
  //console.log('in SET_CMD_HANDLER-', evt);
  //debugger;
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  // console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}
funcs[c.SET_CONTENT_DIMENSIONS]=function(evt){
  // console.log('in SET_CONTENT_DIMENSIONS', evt);
//  contentDimensions.value = evt[1];

}
funcs[c.SET_NEW_LAYOUT]= function(cmd){
  // console.log('in SET_NEW_LAYOUT handler-', cmd);
  //debugger;
  pageStore.setCurrentPageId(cmd[1]);
  // console.log('currentPageId',pageStore.getCurrentPageId)
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
funcs[c.SET_TO_DISPLAY_MODE] = function(cmd){
  // console.log('in page SET_TO_DISPLAY_MODE');
  pageMode.value=c.PAGE_DISPLAY;

}
funcs[c.FILL_IN_AREA] = function(cmd){
  // console.log('in fillInArea-',cmd);
  //debugger
  fieldValue.value.pageCells = [];
  inResize.value=true;
  for(var c = 0;c<toRaw(fieldValue.value).cards.length; c++){
    // console.log('in fieldValue', c, toRaw(fieldValue.value).cards[c]);
    if(toRaw(fieldValue.value).cards[c].id==cmd[2]){
      toRaw(fieldValue.value).cards[c].resize=true;
    }else{
      toRaw(fieldValue.value).cards[c].resize=false;
    }
  }
  /*
  var resizedCardRemoved = [];
  for(var crd = 0;crd<toRaw(fieldValue.value).cards.length; crd++){
    var thisCrd = toRaw(fieldValue.value).cards[crd];
    if(thisCrd.resize!=true){
      resizedCardRemoved.push(thisCrd);
    }else{
      // console.log('card to be resized', thisCrd);
    }
  }
  */
  allCards.value = fieldValue.value.cards;
  //fieldValue.value.cards = resizedCardRemoved;
  //debugger;
  console.log('pageCells before',pageCells.value);
  pageCells.value = createBlankPageWithCardSelection2(fieldValue.value.layout.height, fieldValue.value.layout.width, '#DBAA6E', '#AABBCC');
  console.log('pageCells after',pageCells.value);
  //debugger
  fieldValue.value.pageCells = pageCells.value;

//  pageMode.value = c.PAGE_EDIT;
  pageReload.value+=1;
  console.log('page has been reloaded');



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
        dragWasAtX.value = evt[3];
        dragWasAtY.value = evt[4];
      }
      break;
    }
    case c.MOUSE_STATUS_DOWN: {
      // console.log('in mouse down-', evt, evt[1]);
      if(evt[1]==c.MOUSE_UP){
        debugger
        if(inResize.value==true){
          // console.log('this is a resize');
          for(var crd = 0;crd<allCards.value.length; crd++){
            var thisCard = allCards.value[crd];
            if(thisCard.resize==true){
              // console.log('card being resized is', thisCard);
              // console.log('card being resized drag', dragStartX.value,dragStartY.value, evt[3], evt[4]);
              var newTopLeft = dragStartX.value;
              var newTopRight = dragStartY.value;
              var newHeight  = evt[4]- dragStartY.value;
              var newWidth  = evt[3]- dragStartX.value;
              // console.log('card being resized new loc', newTopRight, newTopLeft, newHeight+1, newWidth+1);
              thisCard.card_position = [newTopRight, newTopLeft, newHeight+1, newWidth+1];
              fieldValue.value.cards = allCards.value;
              var styleElements = thisCard.card_parameters.style.split(";");
              // console.log('styles for this card', styleElements);
              var revisedStyleElements = '';
              //debugger
              styleElements.forEach(styleElement => {
                if(styleElement.startsWith('grid-area')){
                  var thisRevisedElement = 'grid-area:'+ newTopRight.toString() + "/"+ newTopLeft.toString()+"/"+(newTopRight + newHeight+1).toString()+"/"+(newTopLeft+newWidth+1).toString()+ ";";
                  revisedStyleElements=revisedStyleElements+thisRevisedElement;
                }else{
                  revisedStyleElements=revisedStyleElements+styleElement+";";
                }
              });
              revisedStyleElements = revisedStyleElements.slice(0, -1);
              // console.log('revisedStyleElements',revisedStyleElements);
              thisCard.card_parameters.style = revisedStyleElements;
              inResize.value=false;
            }
          }
          mouseStatus.value = c.MOUSE_STATUS_NOT_CLICKED;
          pageMode.value = c.PAGE_DISPLAY;
          pageReload.value+=1;

        }else{
          // console.log('mouse event up-', evt);
          dragEndX.value = evt[3];
          dragEndY.value = evt[4];
          try {
            mouseStatus.value = c.MOUSE_STATUS_NOT_CLICKED;
            fillCellsInArea(dragEndX.value, dragEndY.value, dragStartX.value, dragStartY.value, c.SELECTED_COLOR);
            emit('cevt',[c.CARD_AREA_SELECTED,dragEndX.value, dragEndY.value, dragStartX.value, dragStartY.value ]);
            // console.log('mouseStatus reset');
            dragEndX.value = 0;
            dragEndY.value = 0;
            dragStartX.value = 0;
            dragStartY.value = 0;





          } catch (e) {
//              //debugger;
//              console.log('error 1', e);
//              console.log('error in fillCells',this.dragEndX, this.dragEndY, this.dragStartX, this.dragStartY);
          }
        }



      }
      if(evt[1]==c.MOUSE_OVER){
        // console.log('drag over',evt, dragAtX.value, dragAtY.value, dragWasAtX.value, dragWasAtY.value );
        dragAtX.value = evt[3];
        dragAtY.value = evt[4];
        if(dragAtX.value==dragWasAtX.value && dragAtY.value==dragWasAtY.value){
          // console.log('same cell-',dragWasAtX.value, dragWasAtY.value, dragStartX.value, dragStartY.value);
          try {
            // console.log('filling selected', dragWasAtX.value, dragWasAtY.value, dragStartX.value, dragStartY.value)
            fillCellsInArea(dragAtX.value, dragAtY.value, dragStartX.value, dragStartY.value, c.SELECTED_COLOR);
          } catch (e) {
//              debugger;
            // console.log('error 2', e);
//              console.log('error in fillCells',this.dragEndX, this.dragEndY, this.dragStartX, this.dragStartY);
          }
        }else{
          // console.log('different cell-',dragWasAtX.value, dragWasAtY.value, dragStartX.value, dragStartY.value);
          try {
            // console.log('filling unselected', dragWasAtX.value, dragWasAtY.value, dragStartX.value, dragStartY.value);
            fillCellsInArea(dragWasAtX.value, dragWasAtY.value, dragStartX.value, dragStartY.value, c.UNSELECTED_COLOR);
          } catch (e) {
//              debugger;
            // console.log('error 1', e);
//              console.log('error in fillCells',this.dragEndX, this.dragEndY, this.dragStartX, this.dragStartY);
          }
          dragWasAtX.value = evt[3];
          dragWasAtY.value = evt[4];
        }




      }

    }
  }
}



onMounted(() => {
  //debugger;
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

const fillInArea = function(topLeftX, topleftY, bottomRightX, bottomRightY, selectedColor){
  // console.log('in finnInArea-',topLeftX, topleftY, bottomRightX, bottomRightY, selectedColor);
}

const fillCellsInArea = function(dragX, dragY, topLeftX, topLeftY, fillColor){
  // console.log('fillCellsInArea called', dragX, dragY, topLeftX, topLeftY, fillColor);
  var thisDragDirectiion = dragDirection(dragX, dragY, topLeftX, topLeftY);
  // console.log('dragDirection-',thisDragDirectiion);
  //debugger;
  switch(thisDragDirectiion){
    case c.DIRECTION_DOWN_RIGHT:{
      widthNow.value = dragX-topLeftX;
      for (var row = (topLeftY); row < (dragY+1); row++) {
        for (var col = (topLeftX); col < (dragX+1); col++) {
          var thisCellAddress = cellAddress(col, row);
          var thisExistingBackground = cmdHandlers[thisCellAddress]([c.GET_BACKGROUND, '']);
          // console.log('existingBackground', thisExistingBackground);
          cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
        }
      }
      break;
    }
    case c.DIRECTION_DOWN_LEFT:{
      widthNow.value = topLeftX - dragX;
      for (var row = (topLeftY); row < (dragY+1); row++)  {
        for (var col = dragX; (col<(topLeftX+1));  col++) {
          var thisCellAddress = cellAddress(col, row);
          cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
        }
      }
      break;
    }
    case c.DIRECTION_UP_RIGHT:{
      widthNow.value = topLeftX - dragX;
      for (var row = (topLeftY); row >= (dragY); row--){
        for (var col = (topLeftX); col < (dragX+1); col++) {
          var thisCellAddress = cellAddress(col, row);
          cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
        }
      }
      break;
    }
    case c.DIRECTION_UP_LEFT:{
      widthNow.value = topLeftX - dragX;
      for (var row = (topLeftY); row >= (dragY); row--){
        for (var col = dragX; (col<(topLeftX+1));  col++)  {
          var thisCellAddress = cellAddress(col, row);
          cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
        }
      }
      break;
    }
    case c.DIRECTION_STRAIGHT_UP:{
      //debugger;
      var col = dragX;
      for (var row = dragY; row< topLeftY+1; row++){
        var thisCellAddress = cellAddress(col, row);
        cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
      }
      break;
    }
    case c.DIRECTION_STRAIGHT_DOWN:{
      //debugger;
      var col = dragX;
      for (var row = topLeftY; row< dragY+1; row++){
        var thisCellAddress = cellAddress(col, row);
        cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
      }
      break;
    }
    case c.DIRECTION_STRAIGHT_RIGHT:{
      var row = dragY;
      for (var col = (topLeftX); col < dragX+1; col++) {
        var thisCellAddress = cellAddress(col, row);
        cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
      }
      break;
    }
    case c.DIRECTION_STRAIGHT_LEFT:{
      var row = dragY;
      for (var col = dragX; col < topLeftX+1; col++) {
        var thisCellAddress = cellAddress(col, row);
        cmdHandlers[thisCellAddress]([c.SET_CELL, fillColor, thisCellAddress]);
      }
      break;
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
  //debugger;
//      console.log('entering createBlankPage-', height, width, backgroundColor);

  var pageCells = [];
  var newCellId = 1;
  height++;
  width++;
  for (var h = 1; h < height; h++) {
    for (var w = 1; w < width; w++) {
      if(isCellInSelectedArea(w,h)==false){
        var c = createBlankCellInstance(h, w, 1, 1, newCellId,backgroundColor);
        pageCells.push(c);
        newCellId++;
      }
    }
  }
  return pageCells;
}
const createBlankPageWithCardSelection2 = function(height, width, backgroundColor, resizeBackGroundColor){
  console.log('entering createBlankPageWithCardSelection-', height, width, backgroundColor);

  var pageCells = [];
  var newCellId = 1;
  height++;
  width++;
  //debugger;
  var cards = fieldValue.value.cards;
  //debugger;
  console.log('cards--',toRaw(cards), toRaw(cards).length);
  var pageCards = toRaw(cards);

  var cellValues = createCellValueArray(pageCards.length, height-1, width-1, "");
  console.log('cellValues---',cellValues);
  debugger
  var returnValue;
  for(var cs = 0; cs < pageCards.length; cs++) {
    var thisCard = pageCards[cs];
    console.log('looking at thisCard', thisCard);
    for (var h = 1; h < height; h++) {
      for (var w = 1; w < width; w++){
        var thisCellStatus = cellSelectionStatus(w,h, thisCard);
        var newCell;
        switch(thisCellStatus){
          case c.CELL_RESIZE:{
            cellValues[cs][h-1][w-1] = 'R';
            break;
          }
          case c.CELL_IN_CARD:{
            //console.log('CELL_IN_CARD h,w-', h,w );
            cellValues[cs][h-1][w-1] = 'C';
            break;
          }
          case c.CELL_IN_BLANK:{
            cellValues[cs][h-1][w-1] = 'B';
            break;
          }
        }
      }
    }
  }
  for (h = 1; h < height; h++){
    for (w = 1; w < width; w++){
      var resizeSpotted = false;
      var cardSpotted = false;
      var blankSpotted = false;
      for(cs = 0; cs < pageCards.length; cs++) {
        var thisCard = pageCards[cs];
        switch (cellValues[cs][h - 1][w - 1]) {
          case 'B': {

            break;
          }
          case 'C': {
            cardSpotted = true;
            break;
          }
          case 'R': {
            resizeSpotted = true;
            break;
          }
        }
        if(resizeSpotted==true && thisCard.resize==true){
          newCell = createBlankCellInstance(h, w, 1, 1, newCellId, resizeBackGroundColor);
          //console.log('Cell in resize-', newCell);
          newCell.cellInResize = true;
          newCell.backgroundColor = resizeBackGroundColor;
          newCell.resizeBackgroundColor = resizeBackGroundColor;
          newCell.selectedColor = c.SELECTED_COLOR;
          pageCells.push(newCell);
          newCellId++;
        }else{
          if(cardSpotted==true && thisCard.resize==false){
            console.log('In a card', thisCard);
          }
          if(cardSpotted==false && resizeSpotted==false){
            newCell = createBlankCellInstance(h, w, 1, 1, newCellId, backgroundColor);
            newCell.cellInResize = false;
            newCell.backgroundColor = backgroundColor;
            newCell.resizeBackgroundColor = resizeBackGroundColor;
            newCell.selectedColor = c.SELECTED_COLOR;
            pageCells.push(newCell);
            newCellId++;
          }
        }
      }
    }
  }
  showPageCells(pageCells);
  display3DArray('cellValues',cellValues);
  return pageCells;
}



const createBlankPageWithCardSelection = function(height, width, backgroundColor, resizeBackGroundColor) {
  //debugger
  console.log('entering createBlankPageWithCardSelection-', height, width, backgroundColor);

  var pageCells = [];
  var newCellId = 1;
  height++;
  width++;
  //debugger;
  var cards = fieldValue.value.cards;
  //debugger;
  console.log('cards--',toRaw(cards), toRaw(cards).length);
  var pageCards = toRaw(cards);

  var cellValues = createCellValueArray(pageCards.length, height-1, width-1, "");
  console.log('cellValues---',cellValues);
  debugger
  var returnValue;
  for(var cs = 0; cs < pageCards.length; cs++) {
    var thisCard = pageCards[cs];
    console.log('looking at thisCard', thisCard);
/*
    if(thisCard.id==368){
      debugger;
    }
    if(thisCard.id==370){
      debugger;
    }

 */
    for (var h = 1; h < height; h++) {
       console.log('looking at row', h);

      for (var w = 1; w < width; w++) {
        // console.log('looking at cell- y,x', h, w);
        if(h==6){
          //       debugger;
        }
//        if(newCellId==86){
//          debugger;
//        }
        //console.log('calling cellSelectionStatus with thisCard---',thisCard);
        var thisCellStatus = cellSelectionStatus(w,h, thisCard);
        var newCell;
        switch(thisCellStatus){
          case c.CELL_RESIZE:{
            newCell = createBlankCellInstance(h, w, 1, 1, newCellId,resizeBackGroundColor);
            //console.log('Cell in resize-', newCell);
            newCell.cellInResize = true;
            newCell.backgroundColor = resizeBackGroundColor;
            newCell.resizeBackgroundColor = resizeBackGroundColor;
            newCell.selectedColor = c.SELECTED_COLOR;
            pageCells.push(newCell);
            console.log('Cell in resize-', newCell);
            cellValues[cs][h-1][w-1] = 'R';
            newCellId++;

            break;
          }
          case c.CELL_IN_CARD:{
            //console.log('CELL_IN_CARD h,w-', h,w );
            cellValues[cs][h-1][w-1] = 'C';
            break;
          }
          case c.CELL_IN_BLANK:{
            newCell = createBlankCellInstance(h, w, 1, 1, newCellId,backgroundColor);
            //console.log('CELL_IN_BLANK-', newCell);
            newCell.cellInResize = false;
            newCell.backgroundColor = backgroundColor;
            newCell.resizeBackgroundColor = resizeBackGroundColor;
            newCell.selectedColor = c.SELECTED_COLOR;
            pageCells.push(newCell);
            console.log('Cell in blank-', newCell);
            cellValues[cs][h-1][w-1] = 'B';
            newCellId++;
            break;
          }

        }
      }
    }

  }

  debugger;
  showPageCells(pageCells);
  display3DArray('cellValues',cellValues);
  //console.log('cellValues', cellValues);
  return pageCells;

}

const cellSelectionStatus = function(x,y,thisCard){
  var cardTopLeftY = thisCard.card_position[0];
  var cardTopLeftX = thisCard.card_position[1];
  var cardBottomLeftX = thisCard.card_position[1]+thisCard.card_position[3];
  var cardBottomLeftY = thisCard.card_position[0]+thisCard.card_position[2];
  // console.log('x cardTopLeftX', x, cardTopLeftX);
  // console.log('x cardBottomLeftX', x, cardBottomLeftX);
  // console.log('y cardTopLeftY', y, cardTopLeftY);
  console.log('y cardBottomLeftY', y, cardBottomLeftY);
  if(x>=cardTopLeftX && x<cardBottomLeftX){
    if(y>=cardTopLeftY && y<cardBottomLeftY){


//    if(x>=thisCard.card_position[0] && x<=((thisCard.card_position[2]+thisCard.card_position[0])-1)){
//      if(y>=thisCard.card_position[1] && y<=((thisCard.card_position[3]+thisCard.card_position[1])-1)){
      // console.log('in a card-', thisCard);
      if(typeof(thisCard.resize)!='undefined'){
        if(thisCard.resize==true){
          return c.CELL_RESIZE
        }else{
          return c.CELL_IN_CARD;
        }
      }
      return c.CELL_IN_CARD;
    }else{
      return c.CELL_IN_BLANK;
    }
  }else{
    return c.CELL_IN_BLANK;
  }
}
/*
const cellSelectionStatus = function(x,y){
  var cards = fieldValue.value.cards;
  //debugger;
  // console.log('cards--',toRaw(cards), x,y, toRaw(cards).length);
  var pageCards = toRaw(cards);
  //debugger
  var returnValue;
  for(var cs = 0; cs < pageCards.length; cs++){
    var thisCard = pageCards[cs];
    // console.log('thisCard x y',thisCard, x,y);
    if(x==15 && y==15){
      //debugger
    }
    //console.log('thisCard.id', thisCard.id);
    // console.log('thisCard ypos', thisCard.card_position[0], thisCard.card_position[2]+thisCard.card_position[0])-1 ;
    // console.log('thisCard xpos', thisCard.card_position[1], thisCard.card_position[3]+thisCard.card_position[1])-1 ;
    if(thisCard.id==359){
      //debugger
    }
    var cardTopLeftY = thisCard.card_position[0];
    var cardTopLeftX = thisCard.card_position[1];
    var cardBottomLeftX = thisCard.card_position[1]+thisCard.card_position[3];
    var cardBottomLeftY = thisCard.card_position[0]+thisCard.card_position[2];
    // console.log('x cardTopLeftX', x, cardTopLeftX);
    // console.log('x cardBottomLeftX', x, cardBottomLeftX);
    // console.log('y cardTopLeftY', y, cardTopLeftY);
    // console.log('y cardBottomLeftY', y, cardBottomLeftY);
    if(x>=cardTopLeftX && x<cardBottomLeftX){
      if(y>=cardTopLeftY && y<cardBottomLeftY){


//    if(x>=thisCard.card_position[0] && x<=((thisCard.card_position[2]+thisCard.card_position[0])-1)){
//      if(y>=thisCard.card_position[1] && y<=((thisCard.card_position[3]+thisCard.card_position[1])-1)){
        // console.log('in a card-', thisCard);
        if(typeof(thisCard.resize)!='undefined'){
          if(thisCard.resize==true){
            return c.CELL_RESIZE
          }else{
            return c.CELL_IN_CARD;
          }
        }
        return c.CELL_IN_CARD;
      }else{
        return c.CELL_IN_BLANK;
      }
    }else{
      return c.CELL_IN_BLANK;
    }
  }
  return c.CELL_IN_BLANK;
}
*/
const isCellInSelectedArea = function(x,y){
  var cards = fieldValue.value.cards;
  //console.log('cards-',cards, x,y, cards.length);
  //debugger;
  var returnValue;
  for(let c = 0; c < cards.length; c++){
    var thisCard = toRaw(cards[c]);
    // console.log('thisCard',thisCard, c);
    if(y>=thisCard.card_position[0] && y<=((thisCard.card_position[2]+thisCard.card_position[0])-1)){
      if(x>=thisCard.card_position[1] && x<=((thisCard.card_position[3]+thisCard.card_position[1])-1)){
        returnValue = true;
      }else{
        returnValue = false;
      }
    }else{
      returnValue = false;
    }
    if(returnValue==true){
      return true;
    }
  }
  return false;
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



const updateBlankPage = function(height, width, backgroundColor, selectedArea, existingPageCells){
  var pageCells = [];
  // console.log('inUpdateBlankPage-', existingPageCells);
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
      // console.log('cell in selected area-', thisCell);
//          debugger;
      var newCell = createBlankCellInstance(cellPositionY, cellPositionX, 1, 1, thisCell.id, '#00FFCC');
      // console.log('cell in selected area replacement-',newCell);
//          thisCell.cell_parameters.backgroundColor='#00FFCC';
//          debugger;
      pageCells.push(newCell);
    }
  }
  // console.log('resulting page cells', pageCells);
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

const showPageCells = function(pageCells){
  for(var pc=0; pc<pageCells.length;pc++){
    console.log('new pageCell-',pageCells[pc]);
  }
}

const createCellValueArray = function(dim1, dim2, dim3, initValue) {
  // Validate inputs
  if (!Number.isInteger(dim1) || !Number.isInteger(dim2) || !Number.isInteger(dim3) ||
      dim1 <= 0 || dim2 <= 0 || dim3 <= 0) {
    throw new Error('All dimensions must be positive integers');
  }
  debugger;
  // Create the array structure
  const array = new Array(dim1);

  for (let i = 0; i < dim1; i++) {
    array[i] = new Array(dim2);

    for (let j = 0; j < dim2; j++) {
      array[i][j] = new Array(dim3);

      for (let k = 0; k < dim3; k++) {
        array[i][j][k] = initValue;
      }
    }
  }
  console.log('new array', array);
  return array;
}

const display3DArray = function(array) {
  if (!Array.isArray(array) || !Array.isArray(array[0]) || !Array.isArray(array[0][0])) {
    console.error('Input is not a three-dimensional array');
    return;
  }

  const dim1 = array.length;

  console.log('3D Array Contents:');

  for (let i = 0; i < dim1; i++) {
    console.log(`Dimension 1, Index ${i}:`);

    for (let j = 0; j < array[i].length; j++) {
      let rowOutput = `  Dimension 2, Index ${j}: [ `;

      for (let k = 0; k < array[i][j].length; k++) {
        // Add the element value, followed by a comma if not the last element
        rowOutput += array[i][j][k];
        if (k < array[i][j].length - 1) {
          rowOutput += ', ';
        }
      }

      rowOutput += ' ]';
      console.log(rowOutput);
    }

    // Add a blank line between dimensions for better readability
    if (i < dim1 - 1) {
      console.log('');
    }
  }
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

