# Git Quick Reference for Suled Frontend

This document provides common Git commands for working with the frontend repository.

## Repository Structure

```
main (production)    ← Protected branch, deploys to production
  ↑
develop (staging)    ← Active development, deploys to staging
  ↑
feature branches     ← Individual features
```

## Daily Workflow

### Starting a New Feature

```powershell
# Switch to develop and update
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test locally
npm run dev

# Commit changes
git add .
git commit -m "Add your feature description"

# Push to GitHub
git push -u origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base: `develop` ← compare: `feature/your-feature-name`
4. Add description and submit PR
5. Wait for review and approval
6. Merge to develop

### Deploying to Production

```powershell
# After testing on develop, create PR to main
git checkout develop
git pull origin develop

# Create PR on GitHub: develop → main
# After approval and merge, production deploys automatically
```

## Common Commands

### Check Status

```powershell
# See current branch and changes
git status

# See commit history
git log --oneline -10

# See branches
git branch -a
```

### Switching Branches

```powershell
# Switch to existing branch
git checkout main
git checkout develop

# Create and switch to new branch
git checkout -b feature/new-feature
```

### Committing Changes

```powershell
# Add all changes
git add .

# Add specific files
git add src/components/NewComponent.vue

# Commit with message
git commit -m "Description of changes"

# Add and commit in one step
git commit -am "Description of changes"
```

### Syncing with Remote

```powershell
# Get latest changes from remote
git pull origin main
git pull origin develop

# Push local changes to remote
git push origin main
git push origin develop
git push origin feature/your-feature

# Set upstream and push (first time)
git push -u origin feature/your-feature
```

### Undoing Changes

```powershell
# Discard local changes (not committed)
git checkout -- src/App.vue
git restore src/App.vue

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a pushed commit
git revert <commit-hash>
git push origin develop
```

### Managing Branches

```powershell
# List all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Rename current branch
git branch -M new-name
```

## GitHub Repository Setup

### Create GitHub Repository

Using GitHub CLI:
```powershell
cd d:\Projects\Software\Suled\suled-frontend

# Create public repository
gh repo create suled-frontend --public --source=. --remote=origin --push

# Or create private repository
gh repo create suled-frontend --private --source=. --remote=origin --push
```

Manual setup:
1. Go to https://github.com/new
2. Create repository named `suled-frontend`
3. Don't initialize with README (we already have files)
4. Click "Create repository"
5. Follow commands:

```powershell
git remote add origin https://github.com/YourUsername/suled-frontend.git
git push -u origin main
git push -u origin develop
```

### Set Default Branch

On GitHub:
1. Go to repository Settings → Branches
2. Change default branch to `develop`
3. This makes develop the default for PRs

### Protect Main Branch

1. Go to Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass (CI/CD)
   - ✅ Do not allow bypassing the above settings

## Working with Remote

### Check Remote URL

```powershell
git remote -v
```

### Change Remote URL

```powershell
# If you need to change repository URL
git remote set-url origin https://github.com/YourUsername/suled-frontend.git
```

### Add Multiple Remotes

```powershell
# Add backup remote
git remote add backup https://github.com/YourUsername/suled-frontend-backup.git

# Push to backup
git push backup main
```

## Collaboration

### Pulling Changes from Develop

```powershell
# You're on feature branch, need latest develop
git checkout develop
git pull origin develop

git checkout feature/your-feature
git merge develop

# Or use rebase for cleaner history
git rebase develop
```

### Resolving Merge Conflicts

```powershell
# After git merge or git pull with conflicts
# 1. Edit conflicted files (VS Code will highlight them)
# 2. Remove conflict markers (<<<<<<, =======, >>>>>>>)
# 3. Save files
# 4. Mark as resolved
git add .
git commit -m "Resolve merge conflicts"
```

## Useful Aliases

Add to your PowerShell profile (`$PROFILE`):

```powershell
function git-status { git status }
Set-Alias -Name gs -Value git-status

function git-add-all { git add . }
Set-Alias -Name ga -Value git-add-all

function git-commit { param($message) git commit -m $message }
Set-Alias -Name gc -Value git-commit

function git-push { git push }
Set-Alias -Name gp -Value git-push

function git-pull { git pull }
Set-Alias -Name gl -Value git-pull

function git-checkout { param($branch) git checkout $branch }
Set-Alias -Name gco -Value git-checkout
```

Then use shortcuts:
```powershell
gs           # git status
ga           # git add .
gc "message" # git commit -m "message"
gp           # git push
gl           # git pull
gco develop  # git checkout develop
```

## Commit Message Guidelines

Use clear, descriptive commit messages:

### Format
```
<type>: <subject>

<body (optional)>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: Add tournament filters to list view

fix: Resolve API connection timeout issue

docs: Update deployment instructions

style: Format code with Prettier

refactor: Extract upload logic to composable

chore: Update dependencies to latest versions
```

## Troubleshooting

### "Your branch is ahead of 'origin/main'"

```powershell
# Push your local commits
git push origin main
```

### "Your branch is behind 'origin/main'"

```powershell
# Pull remote changes
git pull origin main
```

### "Merge conflict"

```powershell
# See conflicted files
git status

# After fixing conflicts
git add .
git commit -m "Resolve conflicts"
```

### Accidentally Committed to Wrong Branch

```powershell
# Move commit to correct branch
git reset --soft HEAD~1
git stash
git checkout correct-branch
git stash pop
git add .
git commit -m "Your message"
```

### Need to Update Feature Branch with Latest Develop

```powershell
git checkout feature/your-feature
git fetch origin
git merge origin/develop

# Or rebase (cleaner history)
git rebase origin/develop
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2)
