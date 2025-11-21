import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GamesList from '@/components/GamesList.vue'
import type { Game } from '@/types'

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

  it('renders games list with pair name', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        pairName: 'Team Alpha',
        games: mockGames
      }
    })
    
    expect(wrapper.find('h2').text()).toContain('Team Alpha')
  })

  it('renders games list without pair name', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: mockGames
      }
    })
    
    expect(wrapper.find('h2').exists()).toBe(true)
  })

  it('renders empty state when no games', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: []
      }
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('renders games table with headers', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: mockGames
      }
    })

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

  it('renders game rows', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: mockGames
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('displays game information correctly', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: mockGames
      }
    })

    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('1') // round
    expect(firstRow.text()).toContain('3') // court
    expect(firstRow.text()).toContain('Team A')
    expect(firstRow.text()).toContain('vs')
    expect(firstRow.text()).toContain('Team B')
  })

  it('applies our-game class to relevant games', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: mockGames
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].classes()).toContain('our-game')
    expect(rows[1].classes()).not.toContain('our-game')
  })

  it('displays status badges', () => {
    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: mockGames
      }
    })

    const badges = wrapper.findAll('.status-badge')
    expect(badges).toHaveLength(2)
    expect(badges[0].text()).toBe('Scheduled')
    expect(badges[1].text()).toBe('Completed')
  })

  it('shows TBD for games without scheduled time', () => {
    const gamesWithoutTime: Game[] = [{
      ...mockGames[0],
      scheduledTime: null
    }]

    const wrapper = mount(GamesList, {
      props: {
        pairId: 'pair-123',
        games: gamesWithoutTime
      }
    })

    expect(wrapper.text()).toContain('TBD')
  })
})
