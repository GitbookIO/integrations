# Usage in CI

{% hint style="warning" %}
The GitBook Integration Platform is currently in **alpha**. It's not opened to developers just yet.
{% endhint %}

The `gitbook` CLI can be used in a CI environment to publish the integrations for every commit.

## With GitHub Actions

First store an API token created from [app.gitbook.com/account/developer](https://app.gitbook.com/account/developer) into your GitHub repository secrets.

Then in you workflow:

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

