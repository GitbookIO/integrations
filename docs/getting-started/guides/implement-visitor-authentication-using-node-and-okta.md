# Implement Visitor Authentication using Node and Okta

In this guide, we will show you how to set up Visitor Authentication using Okta and Node.

## Prerequisites

`git` , `node` , and `npm`  are installed on your computer. Familiarity with the terminal (or command line). You can learn how to install these tools here: [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/en/download). NPM is bundled with Node.

## Setting up Okta

First, sign in to Okta platform (the admin version) and create a new app integration (or use an existing one) by clicking the Applications button in the left sidebar.&#x20;

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-30 at 1.32.55 PM.png" alt=""><figcaption></figcaption></figure>

Click Create App Integration and select OIDC - OpenID Connect as the Sign-In method. And then select Web Application as the application type.

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-30 at 1.39.15 PM.png" alt=""><figcaption></figcaption></figure>



Name it appropriately and don't edit any other setting on that page. For assignments, choose the appropriate checkbox. Click Save.

## Creating the Backend

Now, we will create the backend responsible for authenticating the visitors to your space.&#x20;

On your computer, clone the git repository by running\
`git clone https://github.com/GitbookIO/okta-visitor-authentication-example` \
in the directory (folder) you want to be working from. Open the folder in your favorite code editor (say, VS Code).

We will edit the `server.js` file and enter the details of our Okta application there.\
\
The `oidc` object should look like

```javascript
const oidc = new ExpressOIDC({
  issuer: 'issuer URL from Okta, example: https://trial-9890932.okta.com/oauth2/default',
  client_id: 'client id of your Okta app',
  client_secret: 'client secret of your okta app',
  appBaseUrl: 'http://localhost:8080',
  scope: 'openid profile'
});
```

For `issuer` field, look at the drop down menu in the top right of the Okta dashboard. Copy the URL right below your email address.

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-30 at 4.52.14 PM.png" alt=""><figcaption></figcaption></figure>

Paste the value in the `issuer` field of the `oidc` object in `server.js` in your code editor. Add `https://` to the beginning of the URL and`/oauth2/default` to the end of the URL. Your `issuer` field should look like the following:

```javascript
  issuer: 'https://trial-9890932.okta.com/oauth2/default',
```

Note that your URL will be different from the ones written and shown above.

For the `client_id` field, copy the value from the application's page in Okta dashboard

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-30 at 4.58.41 PM.png" alt=""><figcaption></figcaption></figure>

And paste it in the `client_id` field of the `oidc` object in `server.js` in your code editor.  Your `client_id` field should look like the following:

```javascript
client_id: '0oa73fkpn7QyDh3QZ625',
```

Note that your `client_id` will be different from the ones written and shown above.

Similarly for `client_secret`, copy the value of Client Secret from the application page in your Okta dashboard and paste it in the `client_secret` field of the `oidc` object in `server.js` in your code editor. Your `client_secret` field should look like the following:

```javascript
client_secret: 'g6TlMtVPt2Pu8veT0LqAb3RD1BEskojEe72HjcTa_0isiRMRm7pG5WN0qt1PQ0pv',
```

Note that your `client_secret` will be different from the one written above.

Your `oidc` object should now look like the following:

```javascript
const oidc = new ExpressOIDC({
  issuer: 'https://trial-9890932.okta.com/oauth2/default',
  client_id: '0oa73fkpn7QyDh3QZ625',
  client_secret: 'g6TlMtVPt2Pu8veT0LqAb3RD1BEskojEe72HjcTa_0isiRMRm7pG5WN0qt1PQ0pv',
  appBaseUrl: 'http://localhost:8080',
  scope: 'openid profile'
});
```

## Setting up Visitor Authentication

Now, we need to use GitBook. Go to the space you want to publish behind visitor authentication. Open the Share modal and click "Share to an audience", and enable the "Publish with Visitor Authentication" toggle.&#x20;

Make note of the Private key and the Space URL. We will need them.

<figure><img src="../../.gitbook/assets/va-modal.png" alt=""><figcaption></figcaption></figure>

Enter `http://localhost:8080/login` as the Fallback URL. **Note that this is different from the one shown in the image above.**

Go back to your code editor and in the following line

```javascript
const jwtSigningKey = 'gitbook signing key'
```

Replace `gitbook signing key` with the Private key you copied. This line should look something like:

```javascript
const jwtSigningKey = 'f4dgg2e2-3d35-91d5-aa87-7610egf27b62'
```

{% hint style="info" %}
Note that your signing key will be different from the one entered above.
{% endhint %}

In your code editor, in the following line

```javascript
const redirectURL = `https://example.gitbook.io/example/?jwt_token=${token}`
```

Replace everything before `?` with the Space URL you copied from the GitBook Share modal. Make sure there's only one `/` right before the `?`.

Save the `server.js` file.

Open up the terminal and make sure you're in the `okta-visitor-authentication-example` directory.

Run `npm install` which will install the dependencies of our project, including the library needed for communicating with Auth0.

After the installation of dependencies is complete, run `node server.js` from the command line. If successful, you will see the following message:

```
app started
```

Your Visitor Authentication setup is now complete! If you visit your published space URL now, you will be prompted to sign in using Okta.&#x20;
