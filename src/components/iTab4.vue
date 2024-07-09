<template>
  <div>
    <table class="text-left w-full">
      <thead :class="props.config.twhead">
        <tr :class="props.config.twheadtr">
          <span :class="thisColumn.twheadth" v-for="(thisColumn, index) in props.config.columns"
              :key="index"
          >
            <th   v-if="thisColumn.visible">{{thisColumn.label}}</th>
          </span>
        </tr>
      </thead>
      <tbody :class="props.config.twbody" style="height: 30vh;">
         <tr :class="props.config.twtr" v-for="(row, rowIndex) in filteredData" :key="rowIndex" @click="rowSelected(rowIndex)">
           <span :class="cell.css" v-for="(cell, cellIndex) in row" :key="cellIndex">
            <td >
              {{ cell.value }}
            </td>
           </span>

          </tr>
      </tbody>
    </table>
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
import {ref} from 'vue';


const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
console.log("twhead-", props.config.twhead);
//if(typeof(props.config.value)=='function'){
//  fieldValue.value = props.config.value(props.data);
//}
fieldValue.value = props.data;
console.log('columns--', props.config.columns);
console.log('props.data', props.data);
console.log('fieldValue.value', fieldValue.value);
const filteredData = ref([]);
console.log('fieldValue--', fieldValue.value.length);
debugger;
console.log('props.config.rowStart', props.config.rowStart);
console.log('props.config.rowsToShow', props.config.rowsToShow);
for(var r = props.config.rowStart; r<(props.config.rowStart+props.config.rowsToShow); r++){
//  console.log('this field-',fieldValue.value[r]);
  var filteredRow = [];
  for(var cols = 0; cols< props.config.columns.length; cols++){
    console.log('cols--', props.config.columns[cols].field);
    console.log('fieldValue--', fieldValue.value);
    console.log('fieldValue.value[r]', fieldValue.value[r], r, props.config.rowStart, props.config.rowStart+props.config.rowsToShow);
    console.log('field content-',fieldValue.value[r][props.config.columns[cols].field]);
//    debugger;
    var filteredCell= {
      value:fieldValue.value[r][props.config.columns[cols].field],
      css: props.config.columns[cols].twtd,
    }
    if(props.config.columns[cols].visible){
//      filteredRow.push(fieldValue.value[r][props.config.columns[cols].field]);
      filteredRow.push(filteredCell);
    }
  }
  console.log('filteredRow', filteredRow);
  filteredData.value.push(filteredRow);
}
console.log('filteredData-', filteredData);

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

onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
//  console.log("columns-", props.config[props.config.name].columns);
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

.styled-table {
  border: 2px;
  font-size: 0.9em;
  font-family: sans-serif;
  width: 100%;
}
.styled-table thead tr {
  background-color: #0a3ae7;
  color: #ffffff;
  text-align: left;
}
.styled-table th,
.styled-table td {
  padding-top:15px;
  text-align: left;
}
.styled-table tr:hover {
  background-color: #4AAE9B;
}


.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}



.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}
.scrolled {
  height: 250px;
}

.tableContainer {
  height: 300px;
  overflow: auto;
}
.table {

  top: 0;
  width: 100%;
  height:400px;
}

</style>

