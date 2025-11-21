# GitHub Copilot Instructions for Suled Frontend

## Testing Guidelines

### When Business Logic Changes
- **Always update tests** when modifying components, types, or API client methods
- Ensure test mocks match the new data structures
- Update type definitions in test files when interfaces change
- Add new test cases for new component behavior or props

### After Refactoring
- **Always run tests** after completing any refactoring work
- Run tests: `npm run test:run`
- Run type checking: `npm run type-check`
- Fix any failing tests before considering the refactoring complete
- Ensure all 28+ tests pass before committing

### Test Maintenance
- Keep test mocks synchronized with backend API responses
- When types change (e.g., Tournament, TournamentPair, PairGame), update all affected test files
- When adding new components or views, create corresponding test coverage
- Verify component rendering, user interactions, and edge cases

## Architecture Notes
- **Pair-Centered Data Structure**: Tournaments contain Pairs array, each Pair contains their Games
- Types: `Tournament` → `TournamentPair` → `PairGame` (with opponent pair info)
- Components receive data as props where possible (presentational components)
- Always maintain this structure when making changes
