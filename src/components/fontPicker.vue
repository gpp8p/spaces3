<template>
  <div style="width:100%;" v-if="showFontSelector===true">
    <div class="inputCss" v-if="props.config.showSublabels==true">
      <div>
        <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
      </div>
      <div class="fpTable">
        <div>
          <div>
            Font Family
          </div>
          <div><vselect :data = "primaryFontFamily" @cevt="handleEvent($event, funcs, emit)" :config="fontConfig"></vselect></div>

        </div>
        <div>
          <div>Size</div>
          <div><vselect :data = "primaryFontSize" @cevt="handleEvent($event, funcs, emit)" :config="fontSizeConfig"></vselect></div>

        </div>
        <div>
          <div>Weight</div>
          <div><vselect :data = "primaryFontWeight" @cevt="handleEvent($event, funcs, emit)" :config="fontWeightConfig"></vselect></div>
        </div>
        <div>
          <div>Style</div>
          <div><vselect :data = "primaryFontStyle" @cevt="handleEvent($event, funcs, emit)" :config="fontStyleConfig"></vselect></div>

        </div>
        <div>
          <div>Align</div>
          <div><div><vselect :data = "primaryFontAlign" @cevt="handleEvent($event, funcs, emit)" :config="fontAlignConfig"></vselect></div></div>

        </div>
        <div>
          <div>Color</div>
          <div><input type="color"   v-model="primaryFontColor"  @change="primaryColorSelect"/></div>

        </div>

      </div>
    </div>
    <div class="inputCss" v-if="props.config.showSublabels==false">
      <div>
        <label v-if="config.label" :class="config.labelStyle || 'text-xl text-blue-500'">{{ config.label }}</label>
      </div>
      <div class="fpTableNoLabels">
        <div>
          <div><vselect :data = "secondaryFontFamily" @cevt="handleEvent($event, funcs, emit)" :config="fontConfig"></vselect></div>
        </div>
        <div>
          <div><vselect :data = "secondaryFontSize" @cevt="handleEvent($event, funcs, emit)" :config="fontSizeConfig"></vselect></div>

        </div>
        <div>
          <div><vselect :data = "secondaryFontWeight" @cevt="handleEvent($event, funcs, emit)" :config="fontWeightConfig"></vselect></div>
        </div>
        <div>
          <div><vselect :data = "secondaryFontStyle" @cevt="handleEvent($event, funcs, emit)" :config="fontStyleConfig"></vselect></div>

        </div>
        <div>
            <div><div><vselect :data = "secondaryFontAlign" @cevt="handleEvent($event, funcs, emit)" :config="secondaryFontAlignConfig"></vselect></div></div>
        </div>
        <div>
          <div><input type="color"  v-model="secondaryFontColor" @change="secondaryColorSelect"/></div>

        </div>

      </div>
    </div>
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
import vselect from "../components/vselect.vue";
import {toRaw} from 'vue';



const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt']);
const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
debugger;
if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data[props.config.name]);
  //console.log('fontPicker fieldValue-', fieldValue.value.fontFamily);
//  fieldValue.value = props.config.value(props.data.font);
  console.log('fontPicker fieldValue', fieldValue.value);
/*
  if(typeof(props.data.font)!='undefined'){
    fieldValue.value = props.config.value(props.data.font);
  }else {
    fieldValue.value = props.config.value(props.data.font.defaultFont);
  }

 */
}



const fontConfig = ref({});
fontConfig.value.selectOptions = c.DEFAULT_FONTS;
fontConfig.value.selectType = "pulldown";
fontConfig.value.name = 'fontFamily';
const fontSizeConfig = ref({});
fontSizeConfig.value.selectOptions = c.FONT_SIZE_OPTIONS;
fontSizeConfig.value.selectType = "pulldown";
fontSizeConfig.value.name = 'fontSize';
const fontWeightConfig = ref({});
fontWeightConfig.value.selectType = 'pulldown';
fontWeightConfig.value.selectOptions = c.FONT_WEIGHT_OPTIONS;
fontWeightConfig.value.name = 'fontWeight';
const fontStyleConfig = ref({});
fontStyleConfig.value.selectType = "pulldown";
fontStyleConfig.value.selectOptions = c.FONT_STYLE_OPTIONS;
fontStyleConfig.value.name = 'fontStyle';
const fontAlignConfig = ref({});
fontAlignConfig.value.selectType = "pulldown";
fontAlignConfig.value.selectOptions = c.FONT_ALIGNMENT_OPTIONS;
fontAlignConfig.value.name = 'fontAlign';

const secondaryFontAlignConfig = ref({});
secondaryFontAlignConfig.value.selectType = "pulldown";
secondaryFontAlignConfig.value.selectOptions = c.FONT_ALIGNMENT_OPTIONS;
secondaryFontAlignConfig.value.name = 'textAlign';


const primaryFontFamily = ref('');
const primaryFontColor = ref('');
const primaryFontSize = ref('');
const primaryFontStyle = ref('');
const primaryFontWeight = ref('');
const primaryFontAlign = ref('');
const secondaryFontFamily = ref('');
const secondaryFontColor = ref('');
const secondaryFontSize = ref('');
const secondaryFontStyle = ref('');
const secondaryFontWeight = ref('');
const secondaryFontAlign = ref('');

const currentFontPickerValue = ref({});



const showFontSelector = ref(false);

const fontData = ref({});
//  fontData.value = props.data.font.fontFamily;
  fontData.value='Ariel';



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
funcs[c.FIELD_CHANGED]=function(evt){
  debugger;
  console.log('fopntPicker field changed', evt);
  fieldValue.value[evt[1]]=evt[2];
  emit('cevt', [c.FIELD_CHANGED, props.config.name, fieldValue.value]);
}

funcs[c.FIELD_CHANGE_ALERT]=function(cmd){
  debugger;
  console.log('field change alert-', cmd);
//  console.log('activate keyed', props.config.activate(cmd));
  if(cmd[1][0]==='cardType'){
    switch(cmd[1][1]){
      case 'Headline':{
        showFontSelector.value=true;
        break;
      }
      case 'NavigationMenu':{
        showFontSelector.value=true;
        break;
      }
      default:{
        showFontSelector.value=false;
        break;
      }
    }
  }
}
const primaryColorSelect = function($event){
  console.log('colorSelect-', event.target.value);
  debugger;
  fieldValue.value.fontColor = primaryFontColor.value;
  emit('cevt', [c.FIELD_CHANGED, props.config.name, fieldValue.value]);

//  emit('cevt', [c.FIELD_CHANGED, 'backgroundColor', event.target.value]);
}
const secondaryColorSelect = function($event){
  console.log('colorSelect-', event.target.value);
  debugger;
  fieldValue.value.fontColor = secondaryFontColor.value;
  emit('cevt', [c.FIELD_CHANGED, props.config.name, fieldValue.value]);

//  emit('cevt', [c.FIELD_CHANGED, 'backgroundColor', event.target.value]);
}
/*
const colorSelect = function(fnt){
  debugger;
  if(fnt==c.PRIMARY_FONT){
    console.log('primaryFontColor', primaryFontColor.value);
    //emit('cevt', [c.FIELD_CHANGED, 'fontColor', colorValue.value]);
  }else{
    console.log('secondary font color changed', secondaryFontColor.value );
  }
}

 */

onMounted(() => {
  debugger;
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
  switch(props.data.cardType){
    case 'Headline':{
      showFontSelector.value=true;
      break;
    }
    case 'NavigationMenu':{
      showFontSelector.value=true;
      break;
    }
  }
  debugger;
  if(typeof(props.data[props.config.name])!='undefined'){
    currentFontPickerValue.value = props.data[props.config.name];
    primaryFontFamily.value = props.data[props.config.name].fontFamily;
    primaryFontColor.value = props.data[props.config.name].fontColor;
    primaryFontSize.value = props.data[props.config.name].fontSize;
    primaryFontStyle.value = props.data[props.config.name].fontStyle;
    primaryFontWeight.value = props.data[props.config.name].fontWeight;
    primaryFontAlign.value = props.data[props.config.name].textAlign;
    secondaryFontFamily.value = props.data[props.config.name].fontFamily;
    if(typeof(props.data[props.config.name].fontColor)!='undefined'){
      secondaryFontColor.value = props.data[props.config.name].fontColor;
    }else{
      secondaryFontColor.value = '#0000FF';
      fieldValue.value.fontColor = secondaryFontColor.value;
    }
    secondaryFontSize.value = props.data[props.config.name].fontSize;
    secondaryFontStyle.value = props.data[props.config.name].fontStyle;
    secondaryFontWeight.value = props.data[props.config.name].fontWeight;
    secondaryFontAlign.value = props.data[props.config.name].textAlign;

    console.log('fontFamily',props.data[props.config.name].fontFamily);
    console.log('typeof fontFamily', typeof(props.data[props.config.name].fontFamily));
  }else{
    if(props.config.name=='primaryFont'){
      currentFontPickerValue.value = {
        fontColor: '#160aff',
        fontFamily: 'Ariel',
        fontSize: '18pt',
        fontStyle: 'normal',
        fontWeight: 'bold',
        textAlign: 'center',
      }
      primaryFontFamily.value = currentFontPickerValue.value.fontFamily;
      primaryFontColor.value = currentFontPickerValue.value.fontColor;
      primaryFontSize.value = currentFontPickerValue.value.fontSize;
      primaryFontStyle.value = currentFontPickerValue.value.fontStyle;
      primaryFontWeight.value = currentFontPickerValue.value.fontWeight;
      primaryFontAlign.value = currentFontPickerValue.value.textAlign;
      secondaryFontFamily.value = 'Ariel';
      secondaryFontColor.value = '#160aff';
      secondaryFontSize.value = '12pt';
      secondaryFontStyle.value = 'normal';
      secondaryFontWeight.value = 'bold';
      secondaryFontAlign.value = 'left';
    }
  }



})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

</script>

<style scoped>
.fpTable {
  display:grid;
  grid-template-columns: 28% 10% 15% 15% 15% 10%;
  grid-template-rows: 30% 30%;
  height: 20%;
  width: 100%;
}
.fpTableNoLabels {
  display:grid;
  grid-template-columns: 28% 10% 15% 15% 15% 10%;
  grid-template-rows: 20%;
  height: 20%;
  width: 100%;
}
.inputCss {
  margin-top: 1%;
  display: grid;
  grid-template-columns: 20% 80%;

}

</style>


