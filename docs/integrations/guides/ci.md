# Using the CLI in CI/CD

The `gitbook` CLI can be used in a CI environment to publish the integrations.

### Using GitHub Actions

First store an API token created from [app.gitbook.com/account/developer](https://app.gitbook.com/account/developer) into your GitHub repository secrets.

Then in your workflow:

```yaml
jobs:
  publish:
    name: Publish to GitBook
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
      - run: npm ci
      - run: npm install -g @gitbook/cli
      - run: gitbook publish .
        env:
            GITBOOK_TOKEN: ${{ secrets.GITBOOK_TOKEN }}
```
