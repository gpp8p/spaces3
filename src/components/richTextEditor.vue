<!-- RichTextEditor.vue - Enhanced with Alignment and Super/Subscript -->
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

      <!-- Font Color -->
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

      <!-- Highlight Color -->
      <div class="menu-group color-group">
        <label>Highlight:</label>
        <div class="color-picker-wrapper">
          <button
              class="color-button highlight-button"
              :style="{ backgroundColor: currentFormat.backgroundColor }"
              @click.stop="showHighlightPicker = !showHighlightPicker"
              :class="{ active: currentFormat.mark }"
          >
            <span class="color-preview" :style="{ backgroundColor: currentFormat.backgroundColor }"></span>
            Mark
          </button>

          <div v-if="showHighlightPicker" class="color-picker-dropdown">
            <input
                type="color"
                v-model="currentFormat.backgroundColor"
                @change="handleHighlightChange"
                class="color-picker-input"
            />
            <button @click="toggleFormat('mark')" class="toggle-highlight-button"
                    :class="{ active: currentFormat.mark }">
              {{ currentFormat.mark ? 'ON' : 'OFF' }}
            </button>
            <button @click="showHighlightPicker = false" class="color-picker-close">×</button>
          </div>
        </div>
      </div>

      <!-- Alignment Buttons -->
      <div class="formatting-buttons alignment-group">
        <button
            :class="{ active: currentParagraphAlignment === 'left' }"
            @click="setAlignment('left')"
            title="Align Left"
        >
          ⫷
        </button>
        <button
            :class="{ active: currentParagraphAlignment === 'center' }"
            @click="setAlignment('center')"
            title="Align Center"
        >
          ═
        </button>
        <button
            :class="{ active: currentParagraphAlignment === 'right' }"
            @click="setAlignment('right')"
            title="Align Right"
        >
          ⫸
        </button>
        <button
            :class="{ active: currentParagraphAlignment === 'justify' }"
            @click="setAlignment('justify')"
            title="Justify"
        >
          ≡
        </button>
      </div>

      <!-- Text Formatting Buttons -->
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
        <button
            :class="{ active: currentFormat.strikethrough }"
            @click="toggleFormat('strikethrough')"
            title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
            :class="{ active: currentFormat.mark }"
            @click="toggleFormat('mark')"
            title="Highlight/Mark"
        >
          <mark>H</mark>
        </button>
      </div>

      <!-- Super/Subscript Buttons -->
      <div class="formatting-buttons script-group">
        <button
            :class="{ active: currentFormat.superscript }"
            @click="toggleFormat('superscript')"
            title="Superscript"
        >
          X<sup>²</sup>
        </button>
        <button
            :class="{ active: currentFormat.subscript }"
            @click="toggleFormat('subscript')"
            title="Subscript"
        >
          X<sub>₂</sub>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-bar">
      <span>Characters: {{ characterCount }}</span>
      <span>Words: {{ wordCount }}</span>
      <span>HTML Length: {{ htmlLength }}</span>
      <span>Alignment: {{ currentParagraphAlignment || 'left' }}</span>
    </div>

    <!-- Content Area -->
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
import {c} from "../components/constants.js";

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
const showHighlightPicker = ref(false)
const currentParagraphAlignment = ref('left')

// Simple reactive counters
const characterCount = ref(0)
const wordCount = ref(0)
const htmlLength = ref(0)
const htmlContent = ref('')

// Enhanced format state with super/subscript
const currentFormat = reactive({
  fontFamily: 'Helvetica',
  fontSize: '12pt',
  color: '#0000ff',
  backgroundColor: '#ffff00', // Default yellow highlight
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  mark: false,
  superscript: false,
  subscript: false
})

// Computed
const showOutput = computed(() => props.config?.showOutput === true)

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
    updateCurrentAlignment()
  }
}

// Check current paragraph alignment
const updateCurrentAlignment = () => {
  const selection = window.getSelection()
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0)
    let container = range.commonAncestorContainer

    // Walk up to find the paragraph/div container
    while (container && container !== contentArea.value) {
      if (container.nodeType === Node.ELEMENT_NODE &&
          (container.tagName === 'DIV' || container.tagName === 'P')) {
        const style = window.getComputedStyle(container)
        currentParagraphAlignment.value = style.textAlign || 'left'
        return
      }
      container = container.parentElement
    }
  }
  currentParagraphAlignment.value = 'left'
}

// Event handlers
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
    handleEnterKey()
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
    currentFormat.strikethrough = false
    currentFormat.mark = false
    currentFormat.superscript = false
    currentFormat.subscript = false
    console.log('🔄 Reset formatting with Escape')
  }
}

// Enhanced Enter key handling for paragraph alignment
const handleEnterKey = () => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)

  // Create new div with current alignment
  const newDiv = document.createElement('div')
  newDiv.style.textAlign = currentParagraphAlignment.value || 'left'

  // Add a br for proper line spacing
  console.log('br added at 364');
  const br = document.createElement('br')
  newDiv.appendChild(br)

  range.deleteContents()
  range.insertNode(newDiv)

  // Position cursor inside the new div
  const newRange = document.createRange()
  newRange.setStart(newDiv, 0)
  newRange.setEnd(newDiv, 0)
  selection.removeAllRanges()
  selection.addRange(newRange)

  setTimeout(updateHtmlContent, 10)
}

// Enhanced text insertion with super/subscript support
const insertFormattedText = (text) => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)

  // Check if we can merge with existing span
  const canMerge = tryToMergeWithExistingSpan(range, text)

  if (!canMerge) {
    // Ensure we're not inside another span when creating new one
    ensureCursorOutsideSpans(range)

    // Create new formatted span
    const span = document.createElement('span')
    span.style.fontFamily = currentFormat.fontFamily
    span.style.fontSize = currentFormat.fontSize
    span.style.color = currentFormat.color

    // Apply background color if mark is enabled
    if (currentFormat.mark) {
      span.style.backgroundColor = currentFormat.backgroundColor
      console.log('✅ Applied highlight/mark with color:', currentFormat.backgroundColor)
    }

    // Apply text formatting
    if (currentFormat.bold) {
      span.style.fontWeight = 'bold'
      console.log('✅ Applied bold to new span')
    } else {
      span.style.fontWeight = 'normal'
    }

    if (currentFormat.italic) {
      span.style.fontStyle = 'italic'
      console.log('✅ Applied italic to new span')
    } else {
      span.style.fontStyle = 'normal'
    }

    // Handle superscript/subscript (mutually exclusive)
    if (currentFormat.superscript) {
      span.style.verticalAlign = 'super'
      span.style.fontSize = '0.8em'
      console.log('✅ Applied superscript to new span')
    } else if (currentFormat.subscript) {
      span.style.verticalAlign = 'sub'
      span.style.fontSize = '0.8em'
      console.log('✅ Applied subscript to new span')
    } else {
      span.style.verticalAlign = 'baseline'
    }

    // Handle text decorations
    let decorations = []
    if (currentFormat.underline) {
      decorations.push('underline')
      span.classList.add('editor-underlined')
      console.log('✅ Applied underline to new span')
    }
    if (currentFormat.strikethrough) {
      decorations.push('line-through')
      span.classList.add('editor-strikethrough')
      console.log('✅ Applied strikethrough to new span')
    }

    if (decorations.length > 0) {
      span.style.textDecoration = decorations.join(' ')
    } else {
      span.style.textDecoration = 'none'
      span.classList.add('editor-not-underlined')
      span.classList.add('editor-not-strikethrough')
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

    console.log('✨ Created new span with enhanced format:', {
      bold: currentFormat.bold,
      italic: currentFormat.italic,
      underline: currentFormat.underline,
      strikethrough: currentFormat.strikethrough,
      mark: currentFormat.mark,
      superscript: currentFormat.superscript,
      subscript: currentFormat.subscript,
      backgroundColor: currentFormat.backgroundColor
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
/*
// Enhanced span matching with super/subscript support
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

          // Move cursor out of the current span before creating new one
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
*/
const tryToMergeWithExistingSpan = (range, text) => {
  try {
    const startContainer = range.startContainer

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const parentSpan = startContainer.parentElement

      if (parentSpan && parentSpan.tagName === 'SPAN') {
        const spanMatches = spanMatchesCurrentFormat(parentSpan)

        if (spanMatches) {
          // ✅ NEW: Insert at current cursor position, not just at end
          const offset = range.startOffset
          const currentText = startContainer.textContent
          const newText = currentText.slice(0, offset) + text + currentText.slice(offset)

          startContainer.textContent = newText

          // Move cursor to after inserted text
          const newRange = document.createRange()
          newRange.setStart(startContainer, offset + text.length)
          newRange.setEnd(startContainer, offset + text.length)
          const selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(newRange)

          console.log('✅ Merged text at position', offset, 'in existing span')
          return true // Successfully merged
        } else {
          // Only move cursor outside if formats DON'T match
          console.log('❌ Formats don\'t match - moving cursor outside span')
          // Move cursor logic here...
        }
      }
    }

    return false
  } catch (error) {
    console.error('Error in tryToMergeWithExistingSpan:', error)
    return false
  }
}

// Enhanced span format matching with super/subscript
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

  // Background color comparison for mark/highlight
  const bgColorMatch = currentFormat.mark ?
      (style.backgroundColor === currentFormat.backgroundColor ||
          (style.backgroundColor && style.backgroundColor.includes('rgb') && rgbToHex(style.backgroundColor) === currentFormat.backgroundColor)) :
      (!style.backgroundColor || style.backgroundColor === '' || style.backgroundColor === 'transparent')

  // Check weight (bold)
  const spanWeight = style.fontWeight || 'normal'
  const weightMatch = currentFormat.bold ?
      (spanWeight === 'bold' || spanWeight === '700') :
      (spanWeight === 'normal' || spanWeight === '400' || spanWeight === '')

  // Check italic
  const spanItalic = style.fontStyle || 'normal'
  const italicMatch = currentFormat.italic ?
      spanItalic === 'italic' :
      (spanItalic === 'normal' || spanItalic === '')

  // Check vertical alignment for super/subscript
  const spanVertAlign = style.verticalAlign || 'baseline'
  const superMatch = currentFormat.superscript === (spanVertAlign === 'super')
  const subMatch = currentFormat.subscript === (spanVertAlign === 'sub')

  // Enhanced text decoration checking for underline and strikethrough
  const spanDecoration = style.textDecoration || 'none'
  const decorationParts = spanDecoration.split(' ').filter(d => d && d !== 'none')

  const hasUnderline = decorationParts.includes('underline')
  const hasStrikethrough = decorationParts.includes('line-through')

  const underlineMatch = currentFormat.underline === hasUnderline
  const strikethroughMatch = currentFormat.strikethrough === hasStrikethrough

  const matches = fontMatch && sizeMatch && colorMatch && bgColorMatch &&
      weightMatch && italicMatch && underlineMatch && strikethroughMatch &&
      superMatch && subMatch

  console.log('🔍 Enhanced span format comparison:', {
    font: fontMatch,
    size: sizeMatch,
    color: colorMatch,
    backgroundColor: bgColorMatch,
    weight: weightMatch,
    italic: italicMatch,
    underline: underlineMatch,
    strikethrough: strikethroughMatch,
    superscript: superMatch,
    subscript: subMatch,
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
  setTimeout(() => {
    updateCounts()
    updateCurrentAlignment()
  }, 10)
}

const handlePaste = (event) => {
  console.log('📋 Paste event', event)
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
}

const handleColorInput = () => {
  console.log('🎨 Color input:', currentFormat.color)
}

// Highlight color handlers
const handleHighlightChange = () => {
  console.log('✅ Highlight color change completed:', currentFormat.backgroundColor)
  if (currentFormat.mark) {
    applyFormatToSelection()
  }
}

// Alignment handlers
const setAlignment = (alignment) => {
  console.log('📐 Setting alignment to:', alignment)
  currentParagraphAlignment.value = alignment
  applyAlignmentToCurrentParagraph(alignment)
}

const applyAlignmentToCurrentParagraph = (alignment) => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)
  let container = range.commonAncestorContainer

  // Find the paragraph container
  while (container && container !== contentArea.value) {
    if (container.nodeType === Node.ELEMENT_NODE &&
        (container.tagName === 'DIV' || container.tagName === 'P')) {
      container.style.textAlign = alignment
      console.log('✅ Applied alignment', alignment, 'to paragraph')
      setTimeout(updateHtmlContent, 10)
      return
    }
    container = container.parentElement
  }

  // If no paragraph container found, wrap selection in a div
  const div = document.createElement('div')
  div.style.textAlign = alignment

  try {
    const contents = range.extractContents()
    div.appendChild(contents)
    range.insertNode(div)

    // Restore selection
    const newRange = document.createRange()
    newRange.selectNodeContents(div)
    selection.removeAllRanges()
    selection.addRange(newRange)

    console.log('✅ Created new paragraph with alignment:', alignment)
    setTimeout(updateHtmlContent, 10)
  } catch (error) {
    console.error('Error applying alignment:', error)
  }
}

const toggleFormat = (formatType) => {
  console.log('🔍 toggleFormat called with formatType:', `"${formatType}"`, 'type:', typeof formatType)

  // Handle mutually exclusive super/subscript
  if (formatType === 'superscript') {
    currentFormat.superscript = !currentFormat.superscript
    if (currentFormat.superscript) {
      currentFormat.subscript = false // Turn off subscript
    }
  } else if (formatType === 'subscript') {
    currentFormat.subscript = !currentFormat.subscript
    if (currentFormat.subscript) {
      currentFormat.superscript = false // Turn off superscript
    }
  } else {
    currentFormat[formatType] = !currentFormat[formatType]
  }

  console.log('🎯 Toggled', formatType, 'to:', currentFormat[formatType])

  applyFormatToSelection()
}

// Enhanced format application with super/subscript support
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

  console.log('✨ Applying enhanced format to selection')

  try {
    // Extract selected content
    const contents = range.extractContents()

    // Create new span with current formatting
    const span = document.createElement('span')
    span.style.fontFamily = currentFormat.fontFamily
    span.style.fontSize = currentFormat.fontSize
    span.style.color = currentFormat.color

    // Apply background color if mark is enabled
    if (currentFormat.mark) {
      span.style.backgroundColor = currentFormat.backgroundColor
    }

    // Apply formatting
    if (currentFormat.bold) span.style.fontWeight = 'bold'
    if (currentFormat.italic) span.style.fontStyle = 'italic'

    // Handle superscript/subscript
    if (currentFormat.superscript) {
      span.style.verticalAlign = 'super'
      span.style.fontSize = '0.8em'
    } else if (currentFormat.subscript) {
      span.style.verticalAlign = 'sub'
      span.style.fontSize = '0.8em'
    }

    // Handle text decorations
    let decorations = []
    if (currentFormat.underline) decorations.push('underline')
    if (currentFormat.strikethrough) decorations.push('line-through')

    if (decorations.length > 0) {
      span.style.textDecoration = decorations.join(' ')
    }

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
      console.log('br added at 886');
      return '<div><br></div>'
    }
  }).join('')

  contentArea.value.innerHTML = cleanHtml
  updateHtmlContent()

  console.log('🧹 HTML cleaned up')
}

const save = () => {
  updateHtmlContent()
  emit('cevt', [c.SAVE_TEXT_CONTENT,htmlContent.value, props.data.id])
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
      updateCurrentAlignment()
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
  color: blue !important;
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

.highlight-button.active {
  border-color: #28a745;
  background-color: #f8f9fa;
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

.toggle-highlight-button {
  padding: 4px 8px;
  border: 1px solid #6c757d;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  min-width: 40px;
}

.toggle-highlight-button.active {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.toggle-highlight-button:hover {
  background: #e9ecef;
}

.toggle-highlight-button.active:hover {
  background: #218838;
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

.alignment-group {
  border-left: none;
  padding-left: 0;
  border-right: 1px solid #ddd;
  padding-right: 10px;
}

.script-group {
  border-left: none;
  padding-left: 0;
}

.formatting-buttons button {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.formatting-buttons button:hover {
  background-color: #e6e6e6;
}

.formatting-buttons button.active {
  background-color: #007cba;
  color: white;
  border-color: #005a87;
}

/* Special styling for alignment buttons */
.alignment-group button {
  font-family: monospace;
  font-size: 16px;
  font-weight: bold;
}

/* Special styling for script buttons */
.script-group button {
  font-size: 12px;
  padding: 6px 8px;
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
  flex-wrap: wrap;
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

/* Enhanced editor-specific styling for new format options */
.editor-underlined {
  text-decoration: underline !important;
}

.editor-not-underlined {
  text-decoration: none !important;
  text-decoration-line: none !important;
}

.editor-strikethrough {
  text-decoration: line-through !important;
}

.editor-not-strikethrough {
  text-decoration: none !important;
  text-decoration-line: none !important;
}

/* Combined text decorations */
.editor-underlined.editor-strikethrough {
  text-decoration: underline line-through !important;
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
