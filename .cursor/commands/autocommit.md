# Git Create Semantic Commits

Create semantic commits from all available changes.

Do not make one big commit by default.
Group files by purpose.
Commit each group separately.

## Goal

Turn the current working tree into clean, meaningful commits.
No guessing. No mega commits. No vague messages. No mixing unrelated changes.

## Steps

### 1. Inspect repository state

Check what changed:

```bash
git status --short
```

Check staged changes:

```bash
git diff --cached
```

Check unstaged changes:

```bash
git diff
```

Check untracked files:

```bash
git ls-files --others --exclude-standard
```

Understand every available change before committing.

### 2. Detect issue key

Check branch name and context for an issue key.

```bash
git branch --show-current
```

Examples:

- `PROJ-123`
- `POW-456`
- `#123`

If there is a clear issue key, use it in every related commit.

If there is no issue key, commit without it.

Do not invent one.

### 3. Group changes semantically

Group files and hunks by intent.

Examples of valid groups:

- one bug fix
- one feature
- one refactor
- one test update
- one documentation change
- one dependency update
- one config or CI change

One commit = one purpose.

If two files changed for the same reason, commit them together.

If one file contains unrelated changes, split hunks.

Use:

```bash
git add -p
```

or stage files explicitly:

```bash
git add <file>
```

Do not use `git add -A` blindly when changes are unrelated.

### 4. Create commits one by one

For each semantic group:

1. Stage only the files or hunks for that group.
2. Verify the staged diff.
3. Create a Conventional Commit message.
4. Commit.
5. Repeat until no meaningful changes remain.

Verify staged diff:

```bash
git diff --cached
```

Commit format:

```bash
git commit -m "<type>(<scope>): <summary>"
```

With issue key:

```bash
git commit -m "<issue-key>: <type>(<scope>): <summary>"
```

Examples:

```bash
git commit -m "fix(auth): Handle expired token refresh"
git commit -m "feat(api): Add user activity endpoint"
git commit -m "refactor(ui): Simplify modal state handling"
git commit -m "test(auth): Cover expired token flow"
git commit -m "PROJ-123: fix(auth): Handle token refresh"
```

### 5. Keep committing until done

After each commit, check remaining changes:

```bash
git status --short
```

If changes remain, inspect them again and create the next semantic commit.

Stop only when:

- all intentional changes are committed
- unrelated or unsafe changes are left unstaged on purpose
- the user must decide what to do with ambiguous changes

## Commit types

Use the most accurate type:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `style`: formatting only, no logic change
- `refactor`: code change without behavior change
- `perf`: performance improvement
- `test`: tests added or updated
- `build`: build system or dependencies
- `ci`: CI/CD changes
- `chore`: maintenance
- `revert`: revert previous commit

## Scope

Use a short scope when useful:

```bash
fix(auth): Handle expired session
feat(payments): Add retry flow
docs(readme): Update setup instructions
test(cart): Cover discount calculation
```

Skip scope only if it adds no value:

```bash
chore: Update dependencies
```

Good scopes are usually:

- feature area
- package name
- route name
- module name
- service name
- config name

Examples:

```bash
fix(login): Show invalid credentials error
feat(dashboard): Add revenue chart
test(api): Cover pagination params
ci(github): Cache pnpm dependencies
build(vite): Update bundle config
```

## Message rules

- Max 72 characters.
- Use imperative mood: `Add`, `Fix`, `Update`, `Remove`.
- Capitalize the summary.
- No period at the end.
- Be specific.
- Describe the purpose, not just the file changed.
- Do not mention implementation details unless they are the point.
- Do not say `changes`, `stuff`, `misc`, or `wip`.

Good:

```bash
git commit -m "fix(auth): Refresh token before request retry"
git commit -m "feat(profile): Add avatar upload"
git commit -m "test(cart): Cover discount calculation"
git commit -m "docs(api): Document pagination params"
```

Bad:

```bash
git commit -m "fixed auth"
git commit -m "updates"
git commit -m "stuff"
git commit -m "WIP"
git commit -m "changed files"
```

## Splitting rules

Split commits when changes are unrelated.

Examples:

- UI change + dependency update = two commits
- bug fix + test for that bug = usually one commit
- refactor + behavior change = two commits
- docs for a feature + feature code = usually one commit
- formatting many files + logic change = two commits
- generated lockfile from dependency update = same commit as dependency update

If a change cannot be explained by the same sentence, split it.

## Safety rules

Never commit:

- secrets
- `.env` files with real values
- API keys
- tokens
- credentials
- debug logs
- local editor files
- temporary files
- build artifacts unless intentionally tracked
- unrelated experiments

Before each commit, check:

```bash
git diff --cached
```

If the staged diff contains unrelated changes, unstage and split:

```bash
git restore --staged <file>
```

## Final check

When finished, run:

```bash
git status --short
```

Then report as less words as possible:

- commits created
- files intentionally left uncommitted
- anything skipped for safety

Done means clean semantic history, not just zero pending files.
