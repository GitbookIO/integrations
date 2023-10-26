# Implement Visitor Authentication using Node and Auth0

In this guide, we will show you how to set up Visitor Authentication using Auth0 and Node.

## Prerequisites

`git` , `node` , and `npm`  are installed on your computer. Familiarity with the terminal (or command line). You can learn how to install these tools here: [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/en/download). NPM is bundled with Node.

## Setting up Auth0

First, sign in to Auth0 platform and create a new application (or use an existing one) by clicking the Applications button in the left sidebar. If creating a new application, name it appropriately and choose "Regular Web Application" as the option. We will be using Regular Web Application for the sake of this guide. Click Create.\


<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-25 at 4.52.25 PM.png" alt=""><figcaption></figcaption></figure>

A quickstart panel will show up. Select Node.js (Express) option and then select "I want to integrate my app."  You will see a screen prompting you to configure Auth0. It should look like the image below

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-25 at 4.54.42 PM.png" alt=""><figcaption></figcaption></figure>

Click on Save Settings And Continue.

The rest of this guide requires you to be comfortable working with common developer tools such as git and the terminal (or command prompt if you're on Windows). We will come back to Auth0 in a minute.&#x20;

## Creating the Backend

Now, we will create the backend responsible for authenticating the visitors to your space.&#x20;

On your computer, clone the git repository by running\
`git clone https://github.com/GitbookIO/auth0-visitor-authentication-example` \
in the directory (folder) you want to be working from. Open the folder in your favorite code editor (say, VS Code).

We will edit the `server.js` file and enter the details of our Auth0 application there.

Your config object should look like the following right now:

<pre class="language-javascript"><code class="lang-javascript"><strong>const config = {
</strong>  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string', // retrieve it from the environment or enter it here
  baseURL: 'http://localhost:3000',
  clientID: 'clientId copied from Auth0 application', // retrieve it from the environment or enter it here
  issuerBaseURL: 'issuerBaseURL copied from Auth0 application' // retrieve it from the environment or enter it here
};

</code></pre>

You will also find a `config` object on the Auth0 page you were on.

{% hint style="info" %}
If you're not seeing the Configure Router page shown below and are still seeing the Configure Auth0 prompt, you might have to click on Save Settings and Continue again to get to this page.
{% endhint %}

<figure><img src="../../.gitbook/assets/Screen Shot 2023-10-25 at 5.26.32 PM.png" alt=""><figcaption></figcaption></figure>

Copy the `config` object from this page and replace the `config` object in your code editor with this.

In your code editor, for the `secret` field in the config object, you can choose one yourself or you can generate a new secret by using the terminal. Open the terminal app on your computer and run `openssl rand -hex 32`. This will generate a secret that you can enter as the value for the `secret`. You can hardcode it directly in the code or you can retrieve it from env (recommended for production use. In this demo, we will hardcode this value.)

Your `config` object in your code editor should now look something like this:

```javascript
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '772e7d8151e0c4ec57de2545b8e8094911824d988c1e185b64d9d9913f894224',
  clientID: 'QMqod2P9Rd6KDw6Fih9Aovzcd4Yp7Ppk',
  issuerBaseURL: 'https://dev-qrt6bk165i3mltdi.us.auth0.com'
};
```

{% hint style="info" %}
Note that your `secret,``clientId`, and `issuerBaseUrl` will be different from the ones shown above.
{% endhint %}

## Setting up Visitor Authentication

Now, we need to use GitBook. Go to the space you want to publish behind visitor authentication. Open the Share modal and click "Share to an audience", and enable the "Publish with Visitor Authentication" toggle.&#x20;

Make note of the Private key and the Space URL. We will need them.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

Enter `http://localhost:3000` as the Fallback URL. Click Save.

Go back to your code editor and in the following line

```javascript
const gitbookSignKey = 'gitbook signing key'
```

Replace `gitbook signing key` with the Private key you copied. This line should look something like:

```javascript
const gitbookSignKey = 'f4dgg2e2-3d35-91d5-aa87-7610egf27b62'
```

{% hint style="info" %}
Note that your signing key will be different from the one entered above.
{% endhint %}

In your code editor, in the following line

```javascript
const redirectURL = `https://example-url.gitbook.io/example/?jwt_token=${token}`
```

Replace everything before `?` with the Space URL you copied from the GitBook Share modal. Make sure there's only one `/` right before the `?`.

Save the `server.js` file.

Open up the terminal and make sure you're in the `auth0-visitor-authentication-example` directory.

Run `npm install` which will install the dependencies of our project, including the library needed for communicating with Auth0.

After the installation of dependencies is complete, run `node server.js` from the command line. If successful, you will see the following message:

```
Example app listening at http://localhost:3000
```

Your Visitor Authentication setup is now complete! If you visit your published space URL now, you will be prompted to sign in using Auth0.&#x20;

You can configure how you want users to login (say, with Google/GitHub or with email/password, or with other options like SAML) in the Auth0 Authentication dashboard.&#x20;

<figure><img src="../../.gitbook/assets/image (3).png" alt=""><figcaption></figcaption></figure>

