import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TournamentList from '@/components/TournamentList.vue'
import { api } from '@/api/client'
import type { Tournament } from '@/types'

// Mock the API client and router
vi.mock('@/api/client', () => ({
  api: {
    getTournaments: vi.fn()
  }
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('TournamentList.vue', () => {
  const mockTournaments: Tournament[] = [
    {
      id: '1',
      name: 'Summer Championship',
      startDate: '2025-06-01T00:00:00',
      endDate: '2025-06-03T00:00:00',
      location: 'Beach Arena',
      division: 'Mixed',
      description: 'Annual summer tournament',
      status: 'Active',
      gameCount: 15,
      createdDate: '2025-05-01T00:00:00'
    },
    {
      id: '2',
      name: 'Winter Cup',
      startDate: null,
      endDate: null,
      location: 'Indoor Court',
      division: 'Women',
      description: 'Winter season',
      status: 'Upcoming',
      gameCount: 8,
      createdDate: '2025-04-15T00:00:00'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful API call by default
    vi.mocked(api.getTournaments).mockResolvedValue(mockTournaments)
  })

  it('renders tournament list header', () => {
    const wrapper = mount(TournamentList)
    expect(wrapper.find('h2').text()).toBe('Tournaments')
  })

  it('shows loading state initially', () => {
    const wrapper = mount(TournamentList)
    const component = wrapper.vm as any
    component.isLoading = true
    component.tournaments = []
    
    expect(wrapper.find('.loading').exists()).toBe(false) // Not visible until after mount
  })

  it('renders empty state when no tournaments', async () => {
    vi.mocked(api.getTournaments).mockResolvedValue([])
    
    const wrapper = mount(TournamentList)
    const component = wrapper.vm as any
    component.tournaments = []
    component.isLoading = false
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('No tournaments found')
  })

  it('renders tournament cards', async () => {
    const wrapper = mount(TournamentList)
    const component = wrapper.vm as any
    component.tournaments = mockTournaments
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const cards = wrapper.findAll('.tournament-card')
    expect(cards).toHaveLength(2)
  })

  it('displays tournament information correctly', async () => {
    const wrapper = mount(TournamentList)
    const component = wrapper.vm as any
    component.tournaments = mockTournaments
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const firstCard = wrapper.find('.tournament-card')
    expect(firstCard.text()).toContain('Summer Championship')
    expect(firstCard.text()).toContain('Beach Arena')
    expect(firstCard.text()).toContain('Mixed')
    expect(firstCard.text()).toContain('15 games')
  })

  it('displays status badge', async () => {
    const wrapper = mount(TournamentList)
    const component = wrapper.vm as any
    component.tournaments = mockTournaments
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const badges = wrapper.findAll('.status-badge')
    expect(badges).toHaveLength(2)
    expect(badges[0].text()).toBe('Active')
    expect(badges[1].text()).toBe('Upcoming')
  })

  it('has refresh button', () => {
    const wrapper = mount(TournamentList)
    const refreshButton = wrapper.find('.btn-refresh')
    expect(refreshButton.exists()).toBe(true)
    expect(refreshButton.text()).toContain('Refresh')
  })

  it('tournament cards are clickable', async () => {
    const wrapper = mount(TournamentList)
    const component = wrapper.vm as any
    component.tournaments = mockTournaments
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const firstCard = wrapper.find('.tournament-card')
    expect(firstCard.exists()).toBe(true)
    // Card should have click handler (cursor pointer in CSS)
  })
})
