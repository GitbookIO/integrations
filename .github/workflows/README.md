# CI Workflow Documentation

This document explains the CI workflow structure for handling pull requests from both the main repository and forked repositories.

## Workflow Structure







### 1. `ci-pr-untrusted.yaml` - Untrusted PR Workflow
- **Triggers**: `pull_request` (all PRs, including forks)
- **Purpose**: Safe workflow that runs without secrets
- **Jobs**: 
  - Unit tests
  - Formatting checks
  - Type checking
  - Build process
  - Upload build artifacts
- **Security**: Uses minimal permissions (`contents: read`)

### 3. `ci-privileged.yaml` - Privileged Integration Tests
- **Triggers**: 
  - `workflow_run` (after untrusted workflow completes successfully)
  - `workflow_dispatch` (manual trigger)
- **Purpose**: Runs integration tests that require secrets
- **Security**: 
  - Uses environment protection (`integration-tests` environment)
  - Runs in base repository context (has access to secrets)
  - Downloads artifacts from untrusted workflow
- **Manual Trigger**: Maintainers can manually trigger this workflow for specific PRs

## Security Model

### Forked Repository PRs
- **Problem**: Forked repositories don't have access to repository secrets
- **Solution**: Split workflows into trusted and untrusted components
- **Result**: Forked PRs run basic tests without secrets, maintainers can manually trigger integration tests

### Same Repository PRs
- **Behavior**: Full test suite runs including integration tests
- **Security**: All secrets available in repository context

## Usage for Maintainers

### Running Integration Tests on Forked PRs

1. **Automatic**: Integration tests run automatically after the untrusted workflow succeeds for same-repo PRs

2. **Manual**: For forked PRs, maintainers can manually trigger integration tests:
   ```bash
   # Go to Actions tab → "CI - Privileged Integration Tests" → "Run workflow"
   # Select the PR branch and run
   ```

3. **Environment Protection**: The `integration-tests` environment should be configured with:
   - Required reviewers (optional but recommended)
   - Environment secrets (if different from repository secrets)

### Workflow Dependencies

```
Pull Request Created
        ↓
┌─────────────────────────────────────┐
│ test.yaml (basic tests)             │
│ - Unit tests                         │
│ - Formatting                         │
│ - Type checking                      │
│ - Build                              │
│ - Integration tests (same-repo only) │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ ci-pr-untrusted.yaml (fork-safe)    │
│ - Same as above but fork-safe       │
│ - Uploads build artifacts            │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ ci-privileged.yaml (secrets)        │
│ - Downloads artifacts                │
│ - Runs integration tests             │
│ - Comments on PR                     │
└─────────────────────────────────────┘
```

## Benefits

1. **Security**: Forked PRs can't access secrets
2. **Transparency**: Clear communication about what tests run when
3. **Flexibility**: Maintainers can manually trigger integration tests when needed
4. **Efficiency**: Basic tests run quickly on all PRs
5. **Artifact Reuse**: Build artifacts are shared between workflows

## Environment Setup

To fully utilize this workflow structure, set up:

1. **Environment**: Create an `integration-tests` environment in repository settings
2. **Protection Rules**: Optionally add required reviewers for the environment
3. **Secrets**: Ensure all required secrets are available in the environment

## Troubleshooting

### Integration Tests Not Running
- Check if PR is from a fork (integration tests skipped by design)
- Verify untrusted workflow completed successfully
- Check environment protection rules
- Ensure secrets are properly configured

### Manual Trigger Not Working
- Verify you have maintainer permissions
- Check if the PR branch exists
- Ensure the untrusted workflow has run first
