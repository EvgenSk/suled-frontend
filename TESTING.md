# Testing Guide for Suled Frontend

This document explains the testing setup and how to write and run tests for the Vue 3 frontend.

## Testing Stack

- **Vitest** - Fast unit test framework (Vite-native)
- **@vue/test-utils** - Official Vue.js testing utilities
- **happy-dom** - Lightweight DOM implementation for testing
- **TypeScript** - Full type safety in tests

## Running Tests

### All Tests
```powershell
npm test
```

### Watch Mode (Reruns on file changes)
```powershell
npm test
# Press 'a' to run all tests
# Press 'f' to run only failed tests
# Press 'q' to quit
```

### Run Once (CI Mode)
```powershell
npm run test:run
```

### Interactive UI
```powershell
npm run test:ui
```
Opens a browser-based UI at `http://localhost:51204` showing test results, coverage, and more.

### Coverage Report
```powershell
npm run test:coverage
```
Generates coverage report in `coverage/` directory.

## Test Structure

```
src/
├── __tests__/
│   ├── api/
│   │   └── client.test.ts          # API client tests
│   └── components/
│       ├── TournamentUpload.test.ts
│       ├── TournamentList.test.ts
│       └── GamesList.test.ts
├── api/
│   └── client.ts
└── components/
    ├── TournamentUpload.vue
    ├── TournamentList.vue
    └── GamesList.vue
```

## Writing Tests

### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent.vue', () => {
  it('renders component', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.find('h1').text()).toBe('Expected Text')
  })
})
```

### Testing with Props

```typescript
it('displays prop value', () => {
  const wrapper = mount(MyComponent, {
    props: {
      title: 'Test Title',
      count: 5
    }
  })
  
  expect(wrapper.text()).toContain('Test Title')
})
```

### Testing User Interactions

```typescript
it('handles button click', async () => {
  const wrapper = mount(MyComponent)
  
  await wrapper.find('button').trigger('click')
  await wrapper.vm.$nextTick()
  
  expect(wrapper.find('.result').text()).toBe('Clicked!')
})
```

### Mocking API Calls

```typescript
import { vi } from 'vitest'
import { api } from '@/api/client'

vi.mock('@/api/client', () => ({
  api: {
    getTournaments: vi.fn().mockResolvedValue([])
  }
}))

it('fetches data', async () => {
  vi.mocked(api.getTournaments).mockResolvedValue([
    { id: '1', name: 'Tournament 1', /* ... */ }
  ])
  
  const wrapper = mount(MyComponent)
  await wrapper.vm.$nextTick()
  
  expect(api.getTournaments).toHaveBeenCalled()
})
```

### Testing Async Operations

```typescript
it('shows loading state', async () => {
  const wrapper = mount(MyComponent)
  const component = wrapper.vm as any
  
  component.isLoading = true
  await wrapper.vm.$nextTick()
  
  expect(wrapper.find('.loading').exists()).toBe(true)
})
```

### Testing Vue Router

```typescript
import { vi } from 'vitest'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

it('navigates on click', async () => {
  const wrapper = mount(MyComponent)
  await wrapper.find('.nav-link').trigger('click')
  
  // Router push should be called
})
```

## Existing Tests

### API Client Tests (`api/client.test.ts`)

Tests for the Axios API client:
- ✅ `getTournaments()` - Fetches tournaments
- ✅ `getPairs()` - Fetches pairs for a tournament
- ✅ `getGamesForPair()` - Fetches games for a pair
- ✅ `uploadTournament()` - Uploads tournament Excel file
- ✅ Error handling for all endpoints

### TournamentUpload Tests

Tests for tournament upload component:
- ✅ Renders upload area and button
- ✅ File input accepts .xlsx and .xls files
- ✅ Upload button disabled state during upload
- ✅ Component structure and UI elements

### TournamentList Tests

Tests for tournament list component:
- ✅ Renders list header and refresh button
- ✅ Shows empty state when no tournaments
- ✅ Renders tournament cards with data
- ✅ Displays tournament information correctly
- ✅ Status badges displayed properly
- ✅ Tournament cards are clickable

### GamesList Tests

Tests for games list component:
- ✅ Renders with pair name
- ✅ Shows refresh button
- ✅ Empty state when no games
- ✅ Table structure with correct headers
- ✅ Game rows display correctly
- ✅ Highlights "our game" rows
- ✅ Status badges displayed
- ✅ Handles missing scheduled time (shows "TBD")

## Test Coverage

Run coverage report:
```powershell
npm run test:coverage
```

Opens `coverage/index.html` in browser showing:
- Line coverage
- Function coverage
- Branch coverage
- Per-file coverage breakdown

### Coverage Goals

- **Overall**: > 80%
- **Components**: > 70%
- **API Client**: > 90%
- **Utils/Types**: > 90%

## Continuous Integration

Tests run automatically on GitHub Actions:

```yaml
# In .github/workflows/azure-static-web-apps.yml
- name: Run tests
  run: npm run test:run

- name: Run coverage
  run: npm run test:coverage
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad:**
```typescript
it('has a data property', () => {
  expect(wrapper.vm.count).toBe(0)
})
```

✅ **Good:**
```typescript
it('displays initial count', () => {
  expect(wrapper.find('.count').text()).toBe('0')
})
```

### 2. Use Descriptive Test Names

❌ **Bad:**
```typescript
it('works', () => { /* ... */ })
```

✅ **Good:**
```typescript
it('displays success message after upload completes', () => { /* ... */ })
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('increments counter on button click', async () => {
  // Arrange
  const wrapper = mount(Counter)
  
  // Act
  await wrapper.find('button').trigger('click')
  await wrapper.vm.$nextTick()
  
  // Assert
  expect(wrapper.find('.count').text()).toBe('1')
})
```

### 4. Test Edge Cases

```typescript
describe('TournamentList', () => {
  it('handles empty list', () => { /* ... */ })
  it('handles single tournament', () => { /* ... */ })
  it('handles many tournaments', () => { /* ... */ })
  it('handles missing data fields', () => { /* ... */ })
  it('handles API errors', () => { /* ... */ })
})
```

### 5. Clean Up After Tests

```typescript
import { beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

## Common Patterns

### Testing Forms

```typescript
it('validates form input', async () => {
  const wrapper = mount(MyForm)
  const input = wrapper.find('input[type="email"]')
  
  await input.setValue('invalid-email')
  await wrapper.find('form').trigger('submit')
  
  expect(wrapper.find('.error').text()).toBe('Invalid email')
})
```

### Testing Lists

```typescript
it('renders list items', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]
  
  const wrapper = mount(MyList, {
    props: { items }
  })
  
  expect(wrapper.findAll('.list-item')).toHaveLength(2)
})
```

### Testing Conditional Rendering

```typescript
it('shows content when logged in', async () => {
  const wrapper = mount(MyComponent)
  const component = wrapper.vm as any
  
  component.isLoggedIn = true
  await wrapper.vm.$nextTick()
  
  expect(wrapper.find('.private-content').exists()).toBe(true)
})
```

## Debugging Tests

### Using Console Logs

```typescript
it('debugs component', () => {
  const wrapper = mount(MyComponent)
  console.log(wrapper.html())  // See rendered HTML
  console.log(wrapper.text())  // See text content
})
```

### Using Debugger

```typescript
it('debugs with breakpoint', () => {
  const wrapper = mount(MyComponent)
  debugger  // Pauses execution
  expect(wrapper.exists()).toBe(true)
})
```

### Running Single Test

```typescript
// Add .only to run just this test
it.only('runs this test only', () => {
  // ...
})
```

### Skipping Tests

```typescript
// Add .skip to skip this test
it.skip('skips this test', () => {
  // ...
})
```

## Troubleshooting

### "Cannot find module '@/...'"

Check `vitest.config.ts` has correct alias:
```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

### "ReferenceError: window is not defined"

Add to test file:
```typescript
import { beforeAll } from 'vitest'

beforeAll(() => {
  global.window = {} as any
})
```

### Tests timeout

Increase timeout in `vitest.config.ts`:
```typescript
test: {
  testTimeout: 10000  // 10 seconds
}
```

### Mocks not working

Ensure mock is before imports:
```typescript
vi.mock('@/api/client')  // Must be at top

import { api } from '@/api/client'
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)

## Adding New Tests

### For Components

1. Create test file: `src/__tests__/components/YourComponent.test.ts`
2. Follow existing patterns
3. Test rendering, props, events, and state
4. Run tests: `npm test`

### For Utilities

1. Create test file: `src/__tests__/utils/yourUtil.test.ts`
2. Test all functions and edge cases
3. Aim for >90% coverage

### For API Endpoints

Add to `api/client.test.ts`:
```typescript
describe('newEndpoint', () => {
  it('fetches data successfully', async () => {
    // Test implementation
  })
  
  it('handles errors', async () => {
    // Error handling test
  })
})
```

## VS Code Integration

Install the Vitest extension:
```powershell
code --install-extension ZixuanChen.vitest-explorer
```

Features:
- Run/debug tests from editor
- View test results inline
- Coverage highlighting
- Test explorer sidebar

## CI/CD Integration

Tests run on every push and PR:

- ✅ Unit tests must pass
- ✅ No failing tests allowed in main branch
- ⚠️ Coverage reports generated
- 📊 Results visible in GitHub Actions

---

Happy testing! 🧪
