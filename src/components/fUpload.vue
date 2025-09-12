<template>
  <div class="file-upload-container">
    <div class="upload-area"
         :class="{ 'drag-over': isDragOver, 'has-files': files.length > 0 }"
         @drop.prevent="handleDrop"
         @dragover.prevent="handleDragOver"
         @dragenter.prevent="handleDragEnter"
         @dragleave.prevent="handleDragLeave"
         @click="triggerFileInput">

      <input
          ref="fileInput"
          type="file"
          :multiple="config.multiple || false"
          :accept="config.accept || '*/*'"
          @change="handleFileSelect"
          style="display: none;">

      <div v-if="files.length === 0" class="upload-prompt">
        <div class="upload-icon">📁</div>
        <p>{{ config.promptText || 'Click to select files or drag and drop' }}</p>
        <p class="upload-subtitle">{{ config.subtitleText || 'Support for single or bulk uploads' }}</p>
      </div>

      <div v-else class="file-list">
        <div v-for="(file, index) in files" :key="index" class="file-item">
          <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
          <div class="file-actions">
            <button @click.stop="removeFile(index)" class="remove-btn">×</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="files.length > 0" class="upload-controls">
      <button @click="uploadFiles" :disabled="isUploading" class="upload-btn">
        {{ isUploading ? 'Uploading...' : 'Upload Files' }}
      </button>
      <button @click="clearFiles" class="clear-btn">Clear All</button>
    </div>

    <div v-if="uploadProgress > 0" class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="progress-text">{{ uploadProgress }}%</span>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
});

import {c} from "../components/constants.js";
import { onMounted, onUnmounted } from 'vue'
import {useEventHandler} from "./eventHandler.js";
import {ref} from 'vue';

const {handleEvent} = useEventHandler();
const emit = defineEmits(['cevt', 'filesSelected', 'uploadComplete', 'uploadError']);

const name = props.config.name;
const funcs = [];
const cmdHandlers = {}

const fieldValue = ref('');
const files = ref([]);
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref('');
const fileInput = ref(null);

if(typeof(props.config.value)=='function'){
  fieldValue.value = props.config.value(props.data);
}

// File upload specific functions
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files);
  addFiles(selectedFiles);
};

const handleDrop = (event) => {
  isDragOver.value = false;
  const droppedFiles = Array.from(event.dataTransfer.files);
  addFiles(droppedFiles);
};

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragEnter = () => {
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  // Only set to false if we're leaving the entire drop area
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false;
  }
};

const addFiles = (newFiles) => {
  debugger;
  errorMessage.value = '';

  // Validate files if config provides validation
  const validFiles = newFiles.filter(file => validateFile(file));

  if (props.config.multiple) {
    files.value = [...files.value, ...validFiles];
  } else {
    files.value = validFiles.slice(0, 1);
  }

  // Update field value and emit event
  updateFieldValue();
  console.log("file uploaded",files.value );
  emit('filesSelected', files.value);
};

const validateFile = (file) => {
  // Check file size limit
  if (props.config.maxSize && file.size > props.config.maxSize) {
    errorMessage.value = `File ${file.name} exceeds maximum size limit`;
    return false;
  }

  // Check file type if accept is specified
  if (props.config.accept && props.config.accept !== '*/*') {
    const acceptedTypes = props.config.accept.split(',').map(type => type.trim());
    const isValid = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      } else {
        return file.type.match(type.replace('*', '.*'));
      }
    });

    if (!isValid) {
      errorMessage.value = `File ${file.name} is not an accepted file type`;
      return false;
    }
  }

  return true;
};

const removeFile = (index) => {
  files.value.splice(index, 1);
  updateFieldValue();
};

const clearFiles = () => {
  files.value = [];
  uploadProgress.value = 0;
  errorMessage.value = '';
  updateFieldValue();
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const updateFieldValue = () => {
  fieldValue.value = files.value.length > 0 ? files.value.map(f => f.name).join(', ') : '';
};

const uploadFiles = async () => {
  if (files.value.length === 0) return;

  isUploading.value = true;
  uploadProgress.value = 0;
  errorMessage.value = '';

  try {
    // Simulate upload progress or use actual upload logic
    if (props.config.uploadFunction) {
      await props.config.uploadFunction(files.value, (progress) => {
        uploadProgress.value = progress;
      });
    } else {
      // Default simulation
      for (let i = 0; i <= 100; i += 10) {
        uploadProgress.value = i;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    emit('uploadComplete', files.value);

    if (props.config.clearAfterUpload) {
      clearFiles();
    }
  } catch (error) {
    errorMessage.value = error.message || 'Upload failed';
    emit('uploadError', error);
  } finally {
    isUploading.value = false;
  }
};

// Command handling functions
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
      cmdHandlers[availableHandlers[a]]([args[0], args[1], args[2]]);
    }
  }
}

// File upload specific commands
funcs['CLEAR_FILES'] = function(evt) {
  clearFiles();
};

funcs['UPLOAD_FILES'] = function(evt) {
  uploadFiles();
};

funcs['GET_FILES'] = function(evt) {
  return files.value;
};

funcs[c.SET_CMD_HANDLER]= function(evt){
  console.log('in SET_CMD_HANDLER-', evt);
  cmdHandlers[evt[2]]=evt[1];
}

funcs[c.UNSET_CMD_HANDLER]= function(evt){
  console.log('in UNSET_CMD_HANDLER-', evt);
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
.file-upload-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.upload-area.drag-over {
  border-color: #007bff;
  background-color: #e3f2fd;
  transform: scale(1.02);
}

.upload-area.has-files {
  border-color: #28a745;
  background-color: #f8fff9;
}

.upload-prompt {
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-subtitle {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.file-list {
  text-align: left;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: white;
}

.file-info {
  flex: 1;
}

.file-name {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.file-actions {
  margin-left: 12px;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ff3838;
}

.upload-controls {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.upload-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.upload-btn:hover:not(:disabled) {
  background: #0056b3;
}

.upload-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.clear-btn:hover {
  background: #545b62;
}

.progress-container {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  min-width: 40px;
}

.error-message {
  margin-top: 12px;
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-size: 14px;
}
</style>
