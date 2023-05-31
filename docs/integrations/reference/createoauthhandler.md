# createOAuthHandler

Create a fetch request handler to handle an OAuth authentication flow. The credentials are stored in the installation configuration as `installationCredentialsKey`.

See the [Configurations](../configurations.md) section to learn more.

<table><thead><tr><th width="242">Argument</th><th width="124.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>clientId</code><mark style="color:red;">*</mark></td><td><code>string</code></td><td>ID of the client application in the OAuth provider.</td></tr><tr><td><code>clientSecret</code><mark style="color:red;">*</mark></td><td><code>string</code></td><td>Secret of the client application in the OAuth provider.</td></tr><tr><td><code>authorizeURL</code><mark style="color:red;">*</mark></td><td><code>string</code></td><td>URL to redirect the user to, for authorization.</td></tr><tr><td><code>accessTokenURL</code><mark style="color:red;">*</mark></td><td><code>string</code></td><td>URL to exchange the OAuth code for an access token.</td></tr><tr><td><code>redirectURL</code></td><td><code>string</code></td><td>Redirect URL to use. When the OAuth identity provider only accepts a static one.</td></tr><tr><td><code>scopes</code></td><td><code>string[]</code></td><td>Scopes to ask for.</td></tr><tr><td><code>prompt</code></td><td><code>string</code></td><td>Optional configuration for a prompt during the OAuth process.</td></tr><tr><td><code>extractCredentials</code></td><td><code>function</code></td><td>Extract the credentials from the code exchange response.</td></tr></tbody></table>

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
