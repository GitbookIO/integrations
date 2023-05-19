# createOAuthHandler

Create a fetch request handler to handle an OAuth authentication flow. The credentials are stored in the installation configuration as `installationCredentialsKey`.

See the [Configurations](../configurations.md) section to learn more.

| Argument                                           | Type       | Description                                                                      |
| -------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| `clientId`<mark style="color:red;">\*</mark>       | `string`   | ID of the client application in the OAuth provider.                              |
| `clientSecret`<mark style="color:red;">\*</mark>   | `string`   | Secret of the client application in the OAuth provider.                          |
| `authorizeURL`<mark style="color:red;">\*</mark>   | `string`   | URL to redirect the user to, for authorization.                                  |
| `accessTokenURL`<mark style="color:red;">\*</mark> | `string`   | URL to exchange the OAuth code for an access token.                              |
| `redirectURL`                                      | `string`   | Redirect URL to use. When the OAuth identity provider only accepts a static one. |
| `scopes`                                           | `string[]` | Scopes to ask for.                                                               |
| `prompt`                                           | `string`   | Optional configuration for a prompt during the OAuth process.                    |
| `extractCredentials`                               | `function` | Extract the credentials from the code exchange response.                         |

<mark style="color:red;">\*required</mark>

### Example

```typescript
const oauthHandler = createOAuthHandler({
            redirectURL: `${environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://linear.app/oauth/authorize',
            accessTokenURL: 'https://api.linear.app/oauth/token',
            extractCredentials: (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to exchange code for access token ${JSON.stringify(response)}`
                    );
                }

                return {
                    configuration: {
                        oauth_credentials: { access_token: response.access_token },
                    },
                };
            },
});
```
