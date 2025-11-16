import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GamesList from '@/components/GamesList.vue'
import { api } from '@/api/client'
import type { Game } from '@/types'

// Mock the API client
vi.mock('@/api/client', () => ({
  api: {
    getGamesForPair: vi.fn()
  }
}))

describe('GamesList.vue', () => {
  const mockGames: Game[] = [
    {
      id: 'game1',
      round: 1,
      courtNumber: 3,
      status: 'Scheduled',
      scheduledTime: '2025-06-01T10:00:00',
      pair1: 'Team A',
      pair2: 'Team B',
      isOurGame: true
    },
    {
      id: 'game2',
      round: 2,
      courtNumber: 1,
      status: 'Completed',
      scheduledTime: '2025-06-01T14:00:00',
      pair1: 'Team C',
      pair2: 'Team D',
      isOurGame: false
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful API call by default
    vi.mocked(api.getGamesForPair).mockResolvedValue(mockGames)
  })

  it('renders games list with pair name', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        pairName: 'Team Alpha'
      }
    })
    
    expect(wrapper.find('h2').text()).toContain('Team Alpha')
  })

  it('renders games list without pair name', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    expect(wrapper.find('h2').exists()).toBe(true)
  })

  it('shows refresh button', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    expect(wrapper.find('.btn-refresh').exists()).toBe(true)
  })

  it('renders empty state when no games', async () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = []
    component.isLoading = false
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('renders games table with headers', async () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = mockGames
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
    
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(5)
    expect(headers[0].text()).toBe('Round')
    expect(headers[1].text()).toBe('Court')
    expect(headers[2].text()).toBe('Time')
    expect(headers[3].text()).toBe('Opponents')
    expect(headers[4].text()).toBe('Status')
  })

  it('renders game rows', async () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = mockGames
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('displays game information correctly', async () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = mockGames
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('1') // round
    expect(firstRow.text()).toContain('3') // court
    expect(firstRow.text()).toContain('Team A')
    expect(firstRow.text()).toContain('vs')
    expect(firstRow.text()).toContain('Team B')
  })

  it('applies our-game class to relevant games', async () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = mockGames
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].classes()).toContain('our-game')
    expect(rows[1].classes()).not.toContain('our-game')
  })

  it('displays status badges', async () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = mockGames
    component.isLoading = false
    await wrapper.vm.$nextTick()

    const badges = wrapper.findAll('.status-badge')
    expect(badges).toHaveLength(2)
    expect(badges[0].text()).toBe('Scheduled')
    expect(badges[1].text()).toBe('Completed')
  })

  it('shows TBD for games without scheduled time', async () => {
    const gamesWithoutTime: Game[] = [{
      ...mockGames[0],
      scheduledTime: null
    }]

    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123'
      }
    })
    
    const component = wrapper.vm as any
    component.games = gamesWithoutTime
    component.isLoading = false
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('TBD')
  })
})
