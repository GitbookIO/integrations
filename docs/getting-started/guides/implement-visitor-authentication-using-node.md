# Implement Visitor Authentication using Node

[Visitor Authentication](https://gitbook.com/docs/publishing/visitor-authentication) in GitBook is a powerful way to further control who has access to the information you're publishing. By setting up a custom login screen, you can customize the experience for private materials you might have on GitBook.

In order to use Visitor Authentication, you'll need to configure a few tools first—Including setting up a server to handle the sign-in flow your users will go through.

This guide explains how you can accomplish the above using [Node.js](https://nodejs.org/en/).&#x20;

The rest of this guide follows this [GitHub repository](https://github.com/GitbookIO/example-visitor-authentication), and will explain the setup and code through the main functionalities of the demo app.

### Step 1: enable visitor authentication

<figure><img src="../../.gitbook/assets/image (4).png" alt=""><figcaption></figcaption></figure>

Once enabled, you'll have access to a private signing key for this space. Each space has a unique signing key. You should keep this key secret - make sure not to commit it into your source control repository. We recommend referencing it through a production secrets system in your deployed backend.

<figure><img src="../../.gitbook/assets/image (5).png" alt=""><figcaption></figcaption></figure>

### Step 2: sign a JWT token and grant access to a visitor

Here's an example of creating a JWT token by signing the access data with the private key using the library [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for Node JS.

```javascript
const jwt = require('jsonwebtoken');

const gitbookSignKey = '<key copied from GitBook>'

const token = jwt.sign({ data: 'foobar' }, gitbookSignKey, { expiresIn: '1h' });
const redirectURL = `https://mycompany.gitbook.io/myspace/?jwt_token=${token}`;
```

Once you've created the key, you need to include it as the value of a query parameter named `jwt_token` the URL of the GitBook content you wish the user to have access to (see `redirectURL`)

Here's a very simple Express application for signing keys and redirecting users:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const gitbookSignKey = '<key copied from GitBook>'

app.get('/', (req, res) => {
 // --> Validate user access here <--

  const token = jwt.sign({ data: 'foobar' }, gitbookSignKey, { expiresIn: '1h' });
  const redirectURL = `https://mycompany.gitbook.io/myspace/?jwt_token=${token}`;

  res.redirect(redirectURL);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
```

### Step 3: configure a fallback URL

Finally, within **link and domain settings** in the visibility menu, you can configure a fallback URL.

When someone directly accesses your space without the necessary token, GitBook uses the fallback URL to redirect the visitor to a custom URL so that you can authenticate them.

<figure><img src="../../.gitbook/assets/image (6).png" alt=""><figcaption></figcaption></figure>

When redirecting to the fallback URL, GitBook is passing a `location` query parameter, it can be used to redirect to the original location of the user:

```javascript
// Route handler for the fallback url
app.get('/', (req, res) => {
 // --> Validate user access here <--

  const token = jwt.sign({ data: 'foobar' }, gitbookSignKey, { expiresIn: '1h' });
  const redirectURL = `https://mycompany.gitbook.io/myspace/${req.query.location || ''}?jwt_token=${token}`;

  res.redirect(redirectURL);
```

## Multi-tenant Visitor Authentication

If you're using GitBook as a platform for providing content to your customers, you are probably looking for multi-tenant visitor authentication. Essentially, your authentication server needs to be responsible for handling authentication across multiple different spaces. This is possible in GitBook with a few small tweaks.

### Adding all tenants to your authentication server

Your authentication server will need to know the JWT signing keys and the URLs of all the GitBook spaces you expect it to handle. If you have two spaces in your organization for CustomerA and CustomerB, you can imagine your authentication server storing:

```javascript
const CUSTOMER_A = {
  jwtSigningKey: 'aaa-aaa-aaa-aaa',
  url: 'https://mycompany.gitbook.io/customer-a'
};

const CUSTOMER_B = {
  jwtSigningKey: 'bbb-bbb-bbb-bbb',
  url: 'https://mycompany.gitbook.io/customer-b'
};
```

### Giving your authentication server additional context

When GitBook cannot authenticate a user's request, it redirects to the fallback URL. This fallback URL is your authentication server, and GitBook is asking it to authenticate the user and then bring them back to the&#x20;
