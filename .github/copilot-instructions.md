# GitHub Copilot Instructions for Suled Frontend

## 🚨 CRITICAL WORKFLOW RULE
**ALWAYS run tests IMMEDIATELY after making code changes, especially refactoring.**
- Command: `npm run test:run`
- Do NOT report work as complete until tests pass
- This is a mandatory step, not optional

## Testing Guidelines

### When Business Logic Changes
- **Always update tests** when modifying components, types, or API client methods
- Ensure test mocks match the new data structures
- Update type definitions in test files when interfaces change
- Add new test cases for new component behavior or props

### After Refactoring
- **CRITICAL: IMMEDIATELY run tests after ANY refactoring** - this is non-negotiable
- **REQUIRED STEP**: Run tests: `npm run test:run`
- **REQUIRED STEP**: Run type checking: `npm run type-check`
- **DO NOT** present work as complete until ALL tests pass
- Fix any failing tests before considering the refactoring complete
- Ensure all tests pass before committing
- **WORKFLOW**: Code change → Run tests → Fix failures → Verify passing → THEN report complete

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
