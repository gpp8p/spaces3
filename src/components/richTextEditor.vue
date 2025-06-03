<!-- RichTextEditor.vue - Simplified Working Version -->
<template>
  <div class="rich-text-editor">
    <!-- Menu Bar -->
    <div class="menu-bar">
      <!-- Font Family -->
      <div class="menu-group">
        <label>Font:</label>
        <select v-model="currentFormat.fontFamily" @change="onFormatChange">
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      <!-- Font Size -->
      <div class="menu-group">
        <label>Size:</label>
        <select v-model="currentFormat.fontSize" @change="onFormatChange">
          <option value="10pt">10pt</option>
          <option value="12pt">12pt</option>
          <option value="14pt">14pt</option>
          <option value="18pt">18pt</option>
          <option value="36pt">36pt</option>
          <option value="48pt">48pt</option>
        </select>
      </div>

      <!-- Font Color - CLEANED UP VERSION -->
      <div class="menu-group color-group">
        <label>Color:</label>
        <div class="color-picker-wrapper">
          <button
              class="color-button"
              :style="{ backgroundColor: currentFormat.color }"
              @click.stop="showColorPicker = !showColorPicker"
          >
            <span class="color-preview" :style="{ backgroundColor: currentFormat.color }"></span>
            Color
          </button>

          <div v-if="showColorPicker" class="color-picker-dropdown">
            <input
                type="color"
                v-model="currentFormat.color"
                @change="handleColorChange"
                @input="handleColorInput"
                class="color-picker-input"
            />
            <button @click="showColorPicker = false" class="color-picker-close">×</button>
          </div>
        </div>
      </div>

      <!-- Formatting Buttons -->
      <div class="formatting-buttons">
        <button
            :class="{ active: currentFormat.bold }"
            @click="toggleFormat('bold')"
            title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
            :class="{ active: currentFormat.italic }"
            @click="toggleFormat('italic')"
            title="Italic"
        >
          <em>I</em>
        </button>
        <button
            :class="{ active: currentFormat.underline }"
            @click="toggleFormat('underline')"
            title="Underline"
        >
          <u>U</u>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-bar">
      <span>Characters: {{ characterCount }}</span>
      <span>Words: {{ wordCount }}</span>
      <span>HTML Length: {{ htmlLength }}</span>
    </div>

    <!-- Content Area - WITH FORMATTING -->
    <div
        ref="contentArea"
        class="content-area"
        contenteditable="true"
        @input="handleInput"
        @keydown="handleKeyDown"
        @click="handleClick"
        @paste="handlePaste"
        spellcheck="false"
        placeholder="Type here. Changes to toolbar settings will affect new text you type."
    >
      <!-- Content will be inserted here -->
    </div>

    <!-- HTML Output Display -->
    <div v-if="showOutput" class="output-section">
      <h3>HTML Output:</h3>
      <pre class="html-output">{{ htmlContent }}</pre>
      <div class="actions">
        <button @click="cleanupHtml" class="cleanup-button">🧹 Clean HTML</button>
        <button @click="updateCounts" class="refresh-button">🔄 Refresh Counts</button>
      </div>
    </div>

    <!-- Save Button -->
    <div class="save-section">
      <button @click="save" class="save-button">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({ name: 'richTextEditor', showOutput: true })
  },
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['cevt'])

// Component state
const contentArea = ref(null)
const showColorPicker = ref(false)

// Simple reactive counters
const characterCount = ref(0)
const wordCount = ref(0)
const htmlLength = ref(0)
const htmlContent = ref('')

// Format state - represents "what format to use for new text"
const currentFormat = reactive({
  fontFamily: 'Helvetica',
  fontSize: '12pt',
  color: '#0000ff',
  bold: false,
  italic: false,
  underline: false
})

// Computed
const showOutput = computed(() => props.config?.showOutput === true)

// SIMPLIFIED APPROACH: Let browser handle most of the typing
// We'll just update our format template and apply it when needed

const updateCounts = () => {
  if (contentArea.value) {
    const textContent = contentArea.value.textContent || ''
    const htmlContent = contentArea.value.innerHTML || ''

    characterCount.value = textContent.length
    wordCount.value = textContent.trim() ? textContent.trim().split(/\s+/).length : 0
    htmlLength.value = htmlContent.length

    console.log('📊 Updated counts - chars:', characterCount.value, 'words:', wordCount.value, 'html:', htmlLength.value)
  }
}

const updateHtmlContent = () => {
  if (contentArea.value) {
    htmlContent.value = contentArea.value.innerHTML
    updateCounts()
  }
}

// Event handlers - WITH FORMATTING
const handleInput = () => {
  console.log('📝 Input event')
  updateHtmlContent()
  emit('cevt', htmlContent.value)
}

const handleKeyDown = (event) => {
  console.log('⌨️ Key:', event.key)

  // Special handling for new text to apply current formatting
  if (event.key.length === 1) {
    // This is a character key, apply current formatting
    event.preventDefault()
    insertFormattedText(event.key)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    insertFormattedText('\n')
    return
  }

  if (event.key === 'Backspace') {
    // Let backspace work normally
    setTimeout(updateCounts, 10)
  }

  // Reset problematic formatting with Escape
  if (event.key === 'Escape') {
    currentFormat.underline = false
    currentFormat.bold = false
    currentFormat.italic = false
    console.log('🔄 Reset formatting with Escape')
  }
}

// Smart text insertion that merges with existing spans
const insertFormattedText = (text) => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)

  if (text === '\n') {
    // Handle line breaks
    const br = document.createElement('br')
    range.deleteContents()
    range.insertNode(br)
    range.setStartAfter(br)
    range.setEndAfter(br)
    selection.removeAllRanges()
    selection.addRange(range)
    return
  }

  // Check if we can merge with existing span
  const canMerge = tryToMergeWithExistingSpan(range, text)

  if (!canMerge) {
    // CRITICAL FIX: Ensure we're not inside another span when creating new one
    ensureCursorOutsideSpans(range)

    // Create new formatted span
    const span = document.createElement('span')
    span.style.fontFamily = currentFormat.fontFamily
    span.style.fontSize = currentFormat.fontSize
    span.style.color = currentFormat.color

    // IMPORTANT: Only apply formatting if the boolean is true
    if (currentFormat.bold) {
      span.style.fontWeight = 'bold'
      console.log('✅ Applied bold to new span')
    } else {
      span.style.fontWeight = 'normal'
      console.log('✅ Applied normal weight to new span')
    }

    if (currentFormat.italic) {
      span.style.fontStyle = 'italic'
      console.log('✅ Applied italic to new span')
    } else {
      span.style.fontStyle = 'normal'
      console.log('✅ Applied normal style to new span')
    }

    if (currentFormat.underline) {
      span.style.textDecoration = 'underline'
      span.classList.add('editor-underlined')
      span.classList.remove('editor-not-underlined')
      console.log('✅ Applied underline to new span')
    } else {
      span.style.textDecoration = 'none'
      span.classList.add('editor-not-underlined')
      span.classList.remove('editor-underlined')
      console.log('✅ Applied no decoration to new span')
    }

    span.textContent = text

    // Get fresh range after cursor adjustment
    const selection2 = window.getSelection()
    const freshRange = selection2.getRangeAt(0)

    freshRange.deleteContents()
    freshRange.insertNode(span)

    // Position cursor INSIDE the new span's text node
    const textNode = span.firstChild
    if (textNode) {
      const newRange = document.createRange()
      newRange.setStart(textNode, textNode.textContent.length)
      newRange.setEnd(textNode, textNode.textContent.length)
      selection2.removeAllRanges()
      selection2.addRange(newRange)
      console.log('🎯 Positioned cursor inside new span text node')
    }

    console.log('✨ Created new SIBLING span for:', text, 'with format:', {
      bold: currentFormat.bold,
      italic: currentFormat.italic,
      underline: currentFormat.underline
    })
  }

  setTimeout(() => {
    updateHtmlContent()
  }, 10)
}

// Ensure cursor is positioned outside any existing spans to avoid nesting
const ensureCursorOutsideSpans = (range) => {
  try {
    const selection = window.getSelection()
    let container = range.startContainer

    // Walk up the DOM to find if we're inside a span
    let parentSpan = null
    let currentNode = container

    while (currentNode && currentNode !== contentArea.value) {
      if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.tagName === 'SPAN') {
        parentSpan = currentNode
        break
      }
      currentNode = currentNode.parentElement
    }

    if (parentSpan) {
      console.log('🔧 Found cursor inside span, moving to after span to avoid nesting')

      // Position cursor right after the span to create sibling, not child
      const newRange = document.createRange()
      newRange.setStartAfter(parentSpan)
      newRange.setEndAfter(parentSpan)
      selection.removeAllRanges()
      selection.addRange(newRange)

      console.log('✅ Moved cursor outside span - new spans will be siblings')
      return true
    }

    console.log('✅ Cursor already outside spans - safe to create new span')
    return false
  } catch (error) {
    console.error('Error in ensureCursorOutsideSpans:', error)
    return false
  }
}

// Try to merge new text with existing span that has same formatting
const tryToMergeWithExistingSpan = (range, text) => {
  try {
    console.log('🔍 Trying to merge text:', text)
    const startContainer = range.startContainer
    console.log('📍 Start container:', startContainer.nodeType, startContainer)

    // If we're in a text node, check its parent span
    if (startContainer.nodeType === Node.TEXT_NODE) {
      const parentSpan = startContainer.parentElement
      console.log('👨‍👦 Parent element:', parentSpan?.tagName, parentSpan)

      if (parentSpan && parentSpan.tagName === 'SPAN') {
        console.log('📏 Cursor position:', range.startOffset, 'Text length:', startContainer.textContent.length)

        // Check if this span has the same formatting as current format
        const spanMatches = spanMatchesCurrentFormat(parentSpan)

        if (spanMatches) {
          // Check if we're at the end of this text node
          if (range.startOffset === startContainer.textContent.length) {
            console.log('✅ Perfect merge conditions - appending text')

            // Just append to the existing text node
            startContainer.textContent += text

            // Move cursor to end of updated text
            const newRange = document.createRange()
            newRange.setStart(startContainer, startContainer.textContent.length)
            newRange.setEnd(startContainer, startContainer.textContent.length)
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(newRange)

            return true // Successfully merged
          } else {
            console.log('❌ Not at end of text node')
          }
        } else {
          console.log('❌ Span format does not match - will create new span')
          console.log('🔧 FORCING cursor out of mismatched span before creating new one')

          // CRITICAL FIX: Move cursor out of the current span before creating new one
          const selection = window.getSelection()
          const newRange = document.createRange()

          // Position cursor right after the parent span
          newRange.setStartAfter(parentSpan)
          newRange.setEndAfter(parentSpan)
          selection.removeAllRanges()
          selection.addRange(newRange)

          console.log('✅ Moved cursor outside of mismatched span')
          return false // Don't merge, but cursor is now positioned correctly
        }
      } else {
        console.log('❌ Parent is not a span')
      }
    } else {
      console.log('❌ Not in a text node')
    }

    return false // Couldn't merge
  } catch (error) {
    console.error('💥 Error in tryToMergeWithExistingSpan:', error)
    return false
  }
}

// Check if a span matches the current format
const spanMatchesCurrentFormat = (span) => {
  if (!span || span.tagName !== 'SPAN') {
    console.log('❌ Not a span element')
    return false
  }

  const style = span.style

  // Normalize font family comparison (remove quotes)
  const spanFont = style.fontFamily.replace(/['"]/g, '')
  const currentFont = currentFormat.fontFamily.replace(/['"]/g, '')
  const fontMatch = spanFont === currentFont

  // Direct size comparison
  const sizeMatch = style.fontSize === currentFormat.fontSize

  // Color comparison - handle rgb vs hex
  const colorMatch = style.color === currentFormat.color ||
      (style.color && style.color.includes('rgb') && rgbToHex(style.color) === currentFormat.color)

  // IMPROVED: Check weight (bold) - handle both explicit and implicit values
  const spanWeight = style.fontWeight || 'normal'
  const weightMatch = currentFormat.bold ?
      (spanWeight === 'bold' || spanWeight === '700') :
      (spanWeight === 'normal' || spanWeight === '400' || spanWeight === '')

  // IMPROVED: Check italic - handle both explicit and implicit values
  const spanItalic = style.fontStyle || 'normal'
  const italicMatch = currentFormat.italic ?
      spanItalic === 'italic' :
      (spanItalic === 'normal' || spanItalic === '')

  // IMPROVED: Check underline - handle both explicit and implicit values
  const spanDecoration = style.textDecoration || 'none'
  const underlineMatch = currentFormat.underline ?
      spanDecoration.includes('underline') :
      (spanDecoration === 'none' || spanDecoration === '' || !spanDecoration.includes('underline'))

  console.log('🔍 Underline comparison details:')
  console.log('  - Span textDecoration:', `"${spanDecoration}"`)
  console.log('  - Current underline state:', currentFormat.underline)
  console.log('  - Expected match:', currentFormat.underline ? 'should include underline' : 'should not include underline')
  console.log('  - Match result:', underlineMatch)

  const matches = fontMatch && sizeMatch && colorMatch && weightMatch && italicMatch && underlineMatch

  console.log('🔍 Span format comparison:', {
    font: fontMatch,
    size: sizeMatch,
    color: colorMatch,
    weight: weightMatch + ` (span: "${spanWeight}", current bold: ${currentFormat.bold})`,
    italic: italicMatch + ` (span: "${spanItalic}", current italic: ${currentFormat.italic})`,
    underline: underlineMatch + ` (span: "${spanDecoration}", current underline: ${currentFormat.underline})`,
    overall: matches
  })

  return matches
}

// Helper function to convert RGB to hex
const rgbToHex = (rgb) => {
  if (rgb.startsWith('#')) return rgb

  const rgbMatch = rgb.match(/\d+/g)
  if (rgbMatch && rgbMatch.length >= 3) {
    const [r, g, b] = rgbMatch.map(Number)
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  return rgb
}

const handleClick = () => {
  console.log('🖱️ Click in content area')
  // Just save position, don't change format state
  setTimeout(updateCounts, 10)
}

const handlePaste = (event) => {
  console.log('📋 Paste event')
  event.preventDefault()

  // Get plain text and insert with current formatting
  const text = event.clipboardData.getData('text/plain')
  if (text) {
    // Insert each character with formatting
    for (let char of text) {
      insertFormattedText(char)
    }
  }
}

// Format change handlers
const onFormatChange = () => {
  console.log('🎨 Format changed:', currentFormat.fontFamily, currentFormat.fontSize, currentFormat.color)
  applyFormatToSelection()
}

// Color picker handlers
const handleColorChange = () => {
  console.log('✅ Color change completed:', currentFormat.color)
  onFormatChange()
  // Keep picker open for now, user can close manually or click elsewhere
}

const toggleFormat = (formatType) => {
  console.log('🔍 toggleFormat called with formatType:', `"${formatType}"`, 'type:', typeof formatType)

  currentFormat[formatType] = !currentFormat[formatType]
  console.log('🎯 Toggled', formatType, 'to:', currentFormat[formatType])

  // Special handling for underline debugging - check exact string match
  if (formatType === 'underline') {
    console.log('🔍 Underline toggle details:')
    console.log('  - New underline state:', currentFormat.underline)
    console.log('  - Button should show active:', currentFormat.underline)
  } else {
    console.log('🔍 formatType was not "underline", it was:', `"${formatType}"`)
  }

  applyFormatToSelection()
}

// Apply current format to selected text
const applyFormatToSelection = () => {
  const selection = window.getSelection()
  if (!selection.rangeCount) {
    console.log('💭 No selection - format will apply to new text')
    return
  }

  const range = selection.getRangeAt(0)
  if (range.collapsed) {
    console.log('💭 No selection - format will apply to new text')
    return
  }

  console.log('✨ Applying format to selection')

  try {
    // Extract selected content
    const contents = range.extractContents()

    // Create new span with current formatting
    const span = document.createElement('span')
    span.style.fontFamily = currentFormat.fontFamily
    span.style.fontSize = currentFormat.fontSize
    span.style.color = currentFormat.color

    if (currentFormat.bold) span.style.fontWeight = 'bold'
    if (currentFormat.italic) span.style.fontStyle = 'italic'
    if (currentFormat.underline) span.style.textDecoration = 'underline'

    // Add the selected content to our formatted span
    span.appendChild(contents)

    // Insert back into document
    range.insertNode(span)

    // Clear selection
    selection.removeAllRanges()

    setTimeout(updateHtmlContent, 10)
  } catch (error) {
    console.error('Error applying format:', error)
  }
}

// Utility functions
const cleanupHtml = () => {
  if (!contentArea.value) return

  const text = contentArea.value.textContent

  // Create clean HTML with minimal spans
  const lines = text.split('\n')
  const cleanHtml = lines.map(line => {
    if (line.trim()) {
      return `<div>${line}</div>`
    } else {
      return '<div><br></div>'
    }
  }).join('')

  contentArea.value.innerHTML = cleanHtml
  updateHtmlContent()

  console.log('🧹 HTML cleaned up')
}

const save = () => {
  updateHtmlContent()
  emit('cevt', htmlContent.value)
  console.log('💾 Saved:', htmlContent.value)
}

// Initialize
const initializeContent = () => {
  if (props.data && props.data.content) {
    if (contentArea.value) {
      contentArea.value.innerHTML = props.data.content
      updateHtmlContent()
    }
  }
}

watch(() => props.data, initializeContent, { deep: true })

onMounted(() => {
  initializeContent()

  nextTick(() => {
    if (contentArea.value) {
      contentArea.value.focus()
      updateCounts()
    }
  })
})

</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-family: Arial, sans-serif;
  max-width: 100%;
}

.menu-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #f5f5f5;
  margin-bottom: 10px;
}

.menu-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.menu-group label {
  font-size: 12px;
  font-weight: bold;
  min-width: 40px;
}

.menu-group select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 12px;
  min-width: 80px;
}

.color-group {
  position: relative;
}

.color-picker-wrapper {
  position: relative;
}

.color-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  background: white;
  transition: all 0.2s ease;
}

.color-button:hover {
  border-color: #007cba;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: block;
}

.color-picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
}

.color-picker-input {
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-picker-close {
  background: #dc3545;
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
  font-weight: bold;
}

.color-picker-close:hover {
  background: #c82333;
}

.color-picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.color-picker-input {
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-picker-close {
  background: #dc3545;
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
  font-weight: bold;
}

.color-picker-close:hover {
  background: #c82333;
}

.formatting-buttons {
  display: flex;
  gap: 5px;
  border-left: 1px solid #ddd;
  padding-left: 10px;
}

.formatting-buttons button {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  min-width: 32px;
}

.formatting-buttons button:hover {
  background-color: #e6e6e6;
}

.formatting-buttons button.active {
  background-color: #007cba;
  color: white;
  border-color: #005a87;
}

.stats-bar {
  display: flex;
  gap: 20px;
  padding: 8px 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #495057;
}

.content-area {
  min-height: 300px;
  max-height: 500px;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 3px;
  margin: 10px 0;
  background: white;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.content-area:focus {
  border-color: #007cba;
  box-shadow: 0 0 5px rgba(0, 124, 186, 0.3);
}

.content-area:empty:before {
  content: attr(placeholder);
  color: #999;
  font-style: italic;
  pointer-events: none;
}

.output-section {
  margin: 10px 0;
}

.output-section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.html-output {
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 150px;
  overflow-y: auto;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.cleanup-button, .refresh-button {
  padding: 6px 12px;
  border: 1px solid #6c757d;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  color: #6c757d;
}

.cleanup-button:hover, .refresh-button:hover {
  background: #e9ecef;
}

.save-section {
  text-align: center;
  padding: 15px 0;
}

/* Editor-specific underline control */
.editor-underlined {
  text-decoration: underline !important;
}

.editor-not-underlined {
  text-decoration: none !important;
  text-decoration-line: none !important;
}

.save-button {
  padding: 12px 24px;
  background-color: #007cba;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.save-button:hover {
  background-color: #005a87;
}
</style>
