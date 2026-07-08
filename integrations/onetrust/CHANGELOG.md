# @gitbook/integration-onetrust

## 0.1.3

### Patch Changes

- 726c3d4: Fix OneTrust consent not being recorded when a visitor accepts cookies. The banner's initial load no longer emits a premature rejection before the visitor answers, and an explicit Accept/Reject now always syncs to GitBook even if a prior consent decision was already recorded.

## 0.1.2

### Patch Changes

- 8cb514d: Add GPC support to OneTrust cookie banner
- Updated dependencies [30ca6c3]
    - @gitbook/api@0.165.0

## 0.1.1

### Patch Changes

- 592385f: Fix OneTrust's consent check

## 0.1.0

### Minor Changes

- 3279288: Add OneTrust cookie consent integration
