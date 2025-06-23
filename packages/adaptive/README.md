# `@gitbook/adaptive`

GitBook supports integrations with popular feature flag providers like [LaunchDarkly](https://launchdarkly.com) and [Bucket](https://bucket.co), making it easy to personalize your documentation based on active feature flags.

This guide walks through how to install and configure each integration using the `@gitbook/adaptive` helper package.

---

## Prerequisites

Make sure you have:

* A GitBook site with adaptive content enabled
* An active project on LaunchDarkly or Bucket
* A frontend project (React-based) where feature flags are available client-side

---

## LaunchDarkly Integration

### 1. Install the GitBook + LaunchDarkly Integration

In GitBook, install the [**LaunchDarkly**](https://app.gitbook.com/integrations/launchdarkly) integration for your site.

### 2. Add Your Access Credentials

In the GitBook integration settings, provide:

* Your **project key**
* A **service access token** from your LaunchDarkly account

### 3. Install the GitBook Helper

```bash
npm install @gitbook/adaptive
```

### 4. Configure the Client

```tsx
import { render } from 'react-dom';
import { withLaunchDarkly } from '@gitbook/adaptive';
import { asyncWithLDProvider, useLDClient } from 'launchdarkly-react-client-sdk';
import MyApplication from './MyApplication';

function PassFeatureFlagsToGitBookSite() {
    const ldClient = useLDClient();

    React.useEffect(() => {
        if (!ldClient) return;
        return withLaunchDarkly(ldClient);
    }, [ldClient]);

    return null;
}

(async () => {
    const LDProvider = await asyncWithLDProvider({
        clientSideID: 'client-side-id-123abc',
        context: {
            kind: 'user',
            key: 'user-key-123abc',
            name: 'Sandy Smith',
            email: 'sandy@example.com',
        },
        options: {}
    });

    render(
        <LDProvider>
            <PassFeatureFlagsToGitBookSite />
            <MyApplication />
        </LDProvider>,
        document.getElementById('reactDiv')
    );
})();
```

### Visitor Schema Output

Once connected, feature flag values will be available in GitBook under:

```
unsigned.launchdarkly.flags
```

---

## Bucket Integration

### 1. Install the GitBook + Bucket Integration

In GitBook, enable the [**Bucket**](https://app.gitbook.com/integrations/bucket) integration for your site.

### 2. Add Your Secret Key

In the GitBook integration settings, provide your **Bucket secret key**.

### 3. Install the GitBook Helper

```bash
npm install @gitbook/adaptive
```

### 4. Configure the Client

```tsx
import { withBucket } from '@gitbook/adaptive';
import { BucketProvider, useClient } from '@bucketco/react-sdk';
import MyApplication from './MyApplication';

function PassFeatureFlagsToGitBookSite() {
    const client = useClient();

    React.useEffect(() => {
        if (!client) return;
        return withBucket(client);
    }, [client]);

    return null;
}

export function Application() {
    const currentUser = useLoggedInUser();
    const appConfig = useAppConfig();

    return (
        <BucketProvider
            publishableKey={appConfig.bucketCo.publishableKey}
            user={{
                id: currentUser.uid,
                email: currentUser.email ?? undefined,
                name: currentUser.displayName ?? '',
            }}
            company={{
                id: currentUser.company.id,
            }}
        >
            <PassFeatureFlagsToGitBookSite />
            <MyApplication />
        </BucketProvider>
    );
}
```

### Visitor Schema Output

Once connected, feature flag values will be available in GitBook under:

```
unsigned.bucket.flags
```

---

## Important Note

All feature flags are evaluated on the client side. Do not pass sensitive or security-critical data through this method.
