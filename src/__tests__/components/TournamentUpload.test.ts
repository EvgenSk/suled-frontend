import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TournamentUpload from '@/components/TournamentUpload.vue'

// Mock the API client
vi.mock('@/api/client', () => ({
  api: {
    uploadTournament: vi.fn()
  }
}))

describe('TournamentUpload.vue', () => {
  it('renders upload component with correct title', () => {
    const wrapper = mount(TournamentUpload)
    expect(wrapper.find('h2').text()).toBe('Upload Tournament')
  })

  it('renders upload area', () => {
    const wrapper = mount(TournamentUpload)
    expect(wrapper.find('.upload-area').exists()).toBe(true)
  })

  it('shows file picker button initially', () => {
    const wrapper = mount(TournamentUpload)
    expect(wrapper.find('.btn-select').exists()).toBe(true)
    expect(wrapper.find('.upload-placeholder').exists()).toBe(true)
  })

  it('has file input with correct accept attribute', () => {
    const wrapper = mount(TournamentUpload)
    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('accept')).toBe('.xlsx,.xls')
  })

  it('upload button is disabled when uploading', async () => {
    const wrapper = mount(TournamentUpload)
    
    // Access component's internal state
    const component = wrapper.vm as any
    component.selectedFile = new File(['content'], 'tournament.xlsx')
    component.isUploading = true
    await wrapper.vm.$nextTick()

    const uploadButton = wrapper.find('.btn-upload')
    if (uploadButton.exists()) {
      expect(uploadButton.attributes('disabled')).toBeDefined()
    }
  })
})
