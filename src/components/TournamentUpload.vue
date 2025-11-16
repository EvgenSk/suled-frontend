<template>
  <div class="tournament-upload">
    <h2>Upload Tournament</h2>
    
    <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <div v-if="!selectedFile" class="upload-placeholder">
        <p>📁 Drag and drop an Excel file here</p>
        <p>or</p>
        <button @click="openFilePicker" class="btn-select">
          Select File
        </button>
      </div>
      
      <div v-else class="file-selected">
        <p>✓ {{ selectedFile.name }}</p>
        <button @click="clearFile" class="btn-clear">×</button>
      </div>
    </div>

    <button
      v-if="selectedFile"
      @click="uploadFile"
      :disabled="isUploading"
      class="btn-upload"
    >
      {{ isUploading ? 'Uploading...' : 'Upload Tournament' }}
    </button>

    <div v-if="uploadStatus" :class="['status-message', uploadStatus.type]">
      {{ uploadStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api/client'

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadStatus = ref<{ message: string; type: 'success' | 'error' } | null>(null)

const openFilePicker = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    uploadStatus.value = null
  }
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    selectedFile.value = files[0]
    uploadStatus.value = null
  }
}

const clearFile = () => {
  selectedFile.value = null
  uploadStatus.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  uploadStatus.value = null

  try {
    await api.uploadTournament(selectedFile.value)
    uploadStatus.value = {
      message: '✓ Tournament uploaded successfully!',
      type: 'success'
    }
    clearFile()
  } catch (error) {
    uploadStatus.value = {
      message: `✗ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      type: 'error'
    }
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.tournament-upload {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  background: #f7fafc;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #4299e1;
  background: #edf2f7;
}

.upload-placeholder p {
  margin: 0.5rem 0;
  color: #718096;
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.file-selected p {
  color: #2d3748;
  font-weight: 500;
}

.btn-select,
.btn-upload {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-select {
  background: #4299e1;
  color: white;
}

.btn-select:hover {
  background: #3182ce;
}

.btn-upload {
  width: 100%;
  background: #48bb78;
  color: white;
  font-weight: 600;
}

.btn-upload:hover:not(:disabled) {
  background: #38a169;
}

.btn-upload:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.btn-clear {
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
}

.btn-clear:hover {
  background: #f56565;
}

.status-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.status-message.success {
  background: #c6f6d5;
  color: #22543d;
}

.status-message.error {
  background: #fed7d7;
  color: #742a2a;
}
</style>
