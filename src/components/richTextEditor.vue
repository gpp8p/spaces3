<template>
  <div class="rich-text-editor">
    <!-- Menu Bar -->
    <div class="editor-menu-bar">
      <!-- Font Family Selector -->
      <select v-model="currentFormat.fontFamily" @change="applyFormat('fontFamily')">
        <option value="" disabled>Font Family</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Verdana, sans-serif">Verdana</option>
        <option value="Helvetica, sans-serif">Helvetica</option>
        <option value="Times New Roman, serif">Times New Roman</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Courier New, monospace">Courier New</option>
        <option value="Tahoma, sans-serif">Tahoma</option>
        <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
        <option value="Impact, sans-serif">Impact</option>
      </select>

      <!-- Font Size Selector -->
      <select v-model="currentFormat.fontSize" @change="applyFormat('fontSize')">
        <option value="" disabled>Font Size</option>
        <option value="10pt">10pt</option>
        <option value="12pt">12pt</option>
        <option value="14pt">14pt</option>
        <option value="18pt">18pt</option>
        <option value="36pt">36pt</option>
        <option value="48pt">48pt</option>
      </select>

      <!-- Font Weight Selector -->
      <select v-model="currentFormat.fontWeight" @change="applyFormat('fontWeight')">
        <option value="" disabled>Font Weight</option>
        <option value="normal">Normal</option>
        <option value="bold">Bold</option>
        <option value="bolder">Bolder</option>
        <option value="lighter">Lighter</option>
      </select>

      <!-- Text Alignment -->
      <select v-model="currentFormat.textAlign" @change="applyFormat('textAlign')">
        <option value="" disabled>Alignment</option>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>

      <!-- Color Picker -->
      <div class="color-picker-container">
        <button
            class="color-btn"
            @click="showColorPicker = !showColorPicker"
            :style="{ backgroundColor: currentFormat.color || '#000000' }"
        >
          A
        </button>
        <input
            v-if="showColorPicker"
            type="color"
            v-model="currentFormat.color"
            @change="applyFormat('color'); showColorPicker = false"
            class="color-picker"
        />
      </div>

      <!-- Formatting Buttons -->
      <button
          class="format-btn"
          :class="{ active: isFormatActive('bold') }"
          @click="toggleFormat('bold')"
          title="Bold"
      >
        B
      </button>
      <button
          class="format-btn"
          :class="{ active: isFormatActive('underline') }"
          @click="toggleFormat('underline')"
          title="Underline"
      >
        U
      </button>
      <button
          class="format-btn"
          :class="{ active: isFormatActive('mark') }"
          @click="toggleFormat('mark')"
          title="Highlight"
      >
        M
      </button>
      <button
          class="format-btn"
          :class="{ active: isFormatActive('strikeThrough') }"
          @click="toggleFormat('strikeThrough')"
          title="Strikethrough"
      >
        S
      </button>
    </div>
    <!-- Editable Content Area -->
    <div
        ref="editableContent"
        class="editor-content"
        contenteditable="true"
        @input="handleInput"
        @keydown="handleKeyDown"
        @mouseup="updateCurrentFormat"
        @focus="updateCurrentFormat"
    ></div>

    <!-- HTML Output Display (conditionally shown) -->
    <div v-if="showOutputDisplay" class="html-output">
      <h3>HTML Output:</h3>
      <pre>{{ htmlOutput }}</pre>
    </div>

    <!-- Save Button -->
    <div class="editor-actions">
      <button class="save-btn" @click="saveContent">Save</button>
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
import {ref, computed, watch, nextTick} from 'vue';


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

funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}
funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  let dlt = delete cmdHandlers[evt[2]];
}

const editableContent = ref(null);
const htmlOutput = ref('');
const showColorPicker = ref(false);
const showOutputDisplay = computed(() =>
    props.config && props.config.showOutput === true
);

// Current formatting state
const currentFormat = ref({
  fontFamily: '',
  fontSize: '14pt', // Default font size
  fontWeight: '',
  color: '',
  textAlign: '',
});

// Track if specific formats are currently active
const activeFormats = ref({
  bold: false,
  underline: false,
  mark: false,
  strikeThrough: false
});

// Function to check if a specific format is active
const isFormatActive = (format) => {
  return activeFormats.value[format];
};

// Update the HTML output when content changes
const updateOutput = () => {
  if (editableContent.value) {
    // Clone the content to avoid modifying the original
    htmlOutput.value = editableContent.value.innerHTML;
  }
};

// Handle input changes in the editable area
const handleInput = () => {
  updateOutput();
  updateCurrentFormat();
};

// Handle keyboard events
const handleKeyDown = (event) => {
  // If Enter is pressed, ensure we're using <br> instead of <div>
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();

    // Insert a <br> element
    document.execCommand('insertHTML', false, '<br>');
    return false;
  }
};

// Check and update the current formatting based on selection
const updateCurrentFormat = () => {
  const selection = window.getSelection();

  if (selection.rangeCount === 0) return;

  // Check if selection is inside our editor
  let node = selection.anchorNode;
  let isInEditor = false;

  while (node) {
    if (node === editableContent.value) {
      isInEditor = true;
      break;
    }
    node = node.parentNode;
  }

  if (!isInEditor) return;

  // Update format information from the current selection
  try {
    // Bold status
    activeFormats.value.bold = document.queryCommandState('bold');

    // Underline status
    activeFormats.value.underline = document.queryCommandState('underline');

    // Check for strikethrough
    activeFormats.value.strikeThrough = document.queryCommandState('strikeThrough');

    // Check for mark (highlight) - needs custom logic
    const range = selection.getRangeAt(0);
    if (range) {
      const parentElement = range.commonAncestorContainer.parentElement;
      activeFormats.value.mark = parentElement && parentElement.tagName === 'MARK';
    }

    // Get current font properties if there's a valid selection
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;

      // Find the element that contains the text
      const element = container.nodeType === 3 ? container.parentNode : container;

      if (element && element !== editableContent.value) {
        const computedStyle = window.getComputedStyle(element);

        // Update current format based on computed style
        currentFormat.value.fontFamily = computedStyle.fontFamily || '';

        // Convert px to pt for font size (approximate conversion)
        const fontSize = computedStyle.fontSize || '';
        if (fontSize.endsWith('px')) {
          const pxSize = parseFloat(fontSize);
          // Roughly convert px to pt (1pt ≈ 1.333px)
          const ptSize = Math.round(pxSize / 1.333);

          // Find the closest match in our available sizes
          const availableSizes = ['10pt', '12pt', '14pt', '18pt', '36pt', '48pt'];
          let closestSize = availableSizes[0];
          let minDiff = Math.abs(ptSize - parseInt(closestSize));

          for (const size of availableSizes) {
            const diff = Math.abs(ptSize - parseInt(size));
            if (diff < minDiff) {
              minDiff = diff;
              closestSize = size;
            }
          }

          currentFormat.value.fontSize = closestSize;
        } else if (fontSize.endsWith('pt')) {
          // If already in pt, just use it directly
          currentFormat.value.fontSize = fontSize;
        } else {
          // Default to an empty string if we can't determine the size
          currentFormat.value.fontSize = '';
        }

        currentFormat.value.fontWeight = computedStyle.fontWeight || '';
        currentFormat.value.color = rgbToHex(computedStyle.color) || '';
        currentFormat.value.textAlign = computedStyle.textAlign || '';
      }
    }
  } catch (error) {
    console.error('Error updating format:', error);
  }
};

// Convert RGB color to HEX format for color picker
const rgbToHex = (rgb) => {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#000000';

  // Parse RGB format (rgb(r, g, b))
  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    return '#' +
        parseInt(rgbMatch[1]).toString(16).padStart(2, '0') +
        parseInt(rgbMatch[2]).toString(16).padStart(2, '0') +
        parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
  }

  return rgb;
};

// Apply formatting to selected text
const applyFormat = (formatType) => {
  const selection = window.getSelection();

  // Save the current selection
  const savedSelection = saveSelection();

  // Focus the editable area and restore selection
  editableContent.value.focus();
  if (savedSelection) {
    restoreSelection(savedSelection);
  }

  try {
    switch (formatType) {
      case 'fontFamily':
        document.execCommand('fontName', false, currentFormat.value.fontFamily);
        break;
      case 'fontSize':
        // Avoid using execCommand for fontSize as it's not reliable
        // Instead, we'll use a direct span approach with exact pt sizes
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // If something is selected, wrap it with a span
          if (!range.collapsed) {
            const span = document.createElement('span');
            span.style.fontSize = currentFormat.value.fontSize;

            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);
          } else {
            // If no selection, create a span and place cursor inside
            const span = document.createElement('span');
            span.style.fontSize = currentFormat.value.fontSize;
            span.innerHTML = '&nbsp;';

            range.insertNode(span);
            // Position cursor inside the span
            range.setStart(span.firstChild, 0);
            range.setEnd(span.firstChild, 1);
          }
          selection.removeAllRanges();
          selection.addRange(range);
        }
        break;
      case 'fontWeight':
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // If something is selected, wrap it
          if (!range.collapsed) {
            const span = document.createElement('span');
            span.style.fontWeight = currentFormat.value.fontWeight;

            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);
          } else {
            // If no selection, create a span with the style and place cursor inside
            const span = document.createElement('span');
            span.style.fontWeight = currentFormat.value.fontWeight;
            span.innerHTML = '&nbsp;';

            range.insertNode(span);
            // Position cursor inside the span
            range.setStart(span.firstChild, 1);
            range.setEnd(span.firstChild, 1);
          }
          selection.removeAllRanges();
          selection.addRange(range);
        }
        break;
      case 'color':
        document.execCommand('foreColor', false, currentFormat.value.color);
        break;
      case 'textAlign':
        document.execCommand('justify' + currentFormat.value.textAlign.charAt(0).toUpperCase() + currentFormat.value.textAlign.slice(1), false, null);
        break;
    }
  } catch (error) {
    console.error('Error applying format:', error, formatType);
  }

  // Update the HTML output
  updateOutput();
};

// Toggle formatting (bold, underline, mark, strikethrough)
const toggleFormat = (format) => {
  editableContent.value.focus();

  try {
    switch (format) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        break;
      case 'strikeThrough':
        document.execCommand('strikeThrough', false, null);
        break;
      case 'mark':
        // Custom handling for mark/highlight as there's no execCommand for it
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // Check if the selection is already marked
          const commonAncestor = range.commonAncestorContainer;
          let isAlreadyMarked = false;

          if (commonAncestor.nodeType === 3) { // Text node
            isAlreadyMarked = commonAncestor.parentElement &&
                commonAncestor.parentElement.tagName === 'MARK';
          } else { // Element node
            isAlreadyMarked = commonAncestor.querySelector('mark') !== null;
          }

          if (isAlreadyMarked) {
            // Remove the mark by unwrapping
            document.execCommand('removeFormat', false, null);
          } else {
            // Add mark by wrapping in <mark> tag
            const content = range.extractContents();
            const mark = document.createElement('mark');
            mark.appendChild(content);
            range.insertNode(mark);
          }

          // Update selection
          selection.removeAllRanges();
          selection.addRange(range);
        }
        break;
    }
  } catch (error) {
    console.error('Error toggling format:', error, format);
  }

  // Update the active formats and HTML output
  updateCurrentFormat();
  updateOutput();
};

// Save selection state for later restoration
const saveSelection = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0);
  }
  return null;
};

// Restore previously saved selection
const restoreSelection = (range) => {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

// Save the content and emit the cevt event with HTML output
const saveContent = () => {
  emit('cevt', htmlOutput.value);
};

watch(() => props.data, (newValue) => {
  if (editableContent.value && newValue !== editableContent.value.innerHTML) {
    editableContent.value.innerHTML = newValue;
    updateOutput();
  }
}, { immediate: false });

onMounted(() => {
  debugger;
  if (props.data && editableContent.value) {
    editableContent.value.innerHTML = props.data;
    updateOutput();
  }

  // Add click event listener to document to hide color picker when clicked outside
  document.addEventListener('click', (event) => {
    const colorPickerContainer = document.querySelector('.color-picker-container');
    if (showColorPicker.value && colorPickerContainer && !colorPickerContainer.contains(event.target)) {
      showColorPicker.value = false;
    }
  });
  emit('cevt', [c.SET_CMD_HANDLER, handleCmd, name]);
})

onUnmounted(() => {
  emit('cevt', [c.UNSET_CMD_HANDLER, name]);
})

</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.editor-menu-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.editor-menu-bar select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: white;
  font-size: 14px;
}

.color-picker-container {
  position: relative;
  display: inline-block;
}

.color-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  border: none;
  width: 40px;
  height: 40px;
  padding: 0;
  margin-top: 5px;
}

.format-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.format-btn.active {
  background-color: #e0e0e0;
  border-color: #999;
}

.editor-content {
  min-height: 200px;
  padding: 15px;
  background-color: white;
  overflow-y: auto;
  outline: none;
  line-height: 1.5;
}

.html-output {
  padding: 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #ccc;
}

.html-output pre {
  margin: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
}

.editor-actions {
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 6px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background-color: #45a049;
}

/* Style for mark tag */
mark {
  background-color: yellow;
  padding: 0;
}

</style>

