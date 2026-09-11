# Gurubase

```bash
curl -fsSL https://bun.sh/install | bash

cd packages/api
bun run build

cd ../../integrations/gurubase
bun install
gitbook publish
cd ../../
bun changeset
```
