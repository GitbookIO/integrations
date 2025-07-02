# `@gitbook/adaptive`

GitBook's [adaptive content](https://docs.gitbook.com/help/adaptive-content) feature allows you to personalize your documentation based on visitor data. The `@gitbook/adaptive` SDK provides utilities to help facilitate passing data to GitBook for adapting your content.

This SDK includes both feature flag helpers for popular providers like [LaunchDarkly](https://launchdarkly.com) and [Bucket](https://bucket.co), as well as generic utilities for writing custom visitor data.

---

## Prerequisites

Make sure you have:

* A GitBook site with adaptive content enabled
* An active project on LaunchDarkly or Bucket
* A frontend project (React-based) where feature flags are available client-side

---

## Feature Flag Helpers

The SDK provides convenient helpers for popular feature flag providers to automatically sync flag values with GitBook's adaptive content system.

### LaunchDarkly Integration

#### 1. Install the GitBook + LaunchDarkly Integration

In GitBook, install the [**LaunchDarkly**](https://app.gitbook.com/integrations/launchdarkly) integration for your site.

#### 2. Add Your Access Credentials

In the GitBook integration settings, provide:

* Your **project key**
* A **service access token** from your LaunchDarkly account

#### 3. Install the GitBook Helper

```bash
npm install @gitbook/adaptive
```

#### 4. Configure the Client

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

#### Visitor Schema Output

Once connected, feature flag values will be available in GitBook under:

```
unsigned.launchdarkly.flags
```

### Bucket Integration

#### 1. Install the GitBook + Bucket Integration

In GitBook, enable the [**Bucket**](https://app.gitbook.com/integrations/bucket) integration for your site.

#### 2. Add Your Secret Key

In the GitBook integration settings, provide your **Bucket secret key**.

#### 3. Install the GitBook Helper

```bash
npm install @gitbook/adaptive
```

#### 4. Configure the Client

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

#### Visitor Schema Output

Once connected, feature flag values will be available in GitBook under:

```
unsigned.bucket.flags
```

---

## Generic Utilities

If you don't use LaunchDarkly or Bucket, or need to pass custom data beyond feature flags, the SDK provides generic utilities for writing visitor data.

### writeGitBookVisitorCookie

The `writeGitBookVisitorCookie` function allows you to write custom visitor data that will be available in GitBook's adaptive content system.

```tsx
import { writeGitBookVisitorCookie } from '@gitbook/adaptive';

// Write custom visitor data
writeGitBookVisitorCookie('userPlan', 'premium');
writeGitBookVisitorCookie('userRole', 'admin');
writeGitBookVisitorCookie('preferences', {
    theme: 'dark',
    language: 'en'
});
```

The data will be available in GitBook under:

```
unsigned.{cookieName}
```

For example, the above code would create:
- `unsigned.userPlan` with value `"premium"`
- `unsigned.userRole` with value `"admin"`
- `unsigned.preferences` with value `{ theme: "dark", language: "en" }`

---

## Important Note

All visitor data is evaluated on the client side and stored in cookies. Do not pass sensitive or security-critical data through this method.
