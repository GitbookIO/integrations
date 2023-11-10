# Implement Visitor Authentication using Node and Azure AD

In this guide, we will show you how to set up Visitor Authentication using Node and Azure AD (**now known as Microsoft Entra ID**).

## Prerequisites

`node`  and `npm`  are installed on your computer. Familiarity with the terminal (or command line). You can learn how to install Node [here](https://nodejs.org/en/download). NPM is bundled with Node.

## Setting up Entra

First, sign in to Entra platform. In the left sidebar, navigate to Identity > Applications > App registrations.\


<figure><img src="../../.gitbook/assets/Screen Shot 2023-11-02 at 3.58.44 PM.png" alt=""><figcaption></figcaption></figure>

And click on New registration button in the screen that opens up. Name it appropriately.

Under **Supported account types,** select **Accounts in this organizational directory only.**

Under Redirect URI, select the type as Web and enter `http://localhost:3000/auth/redirect` as the value.

Click Register.

You should see a screen like the following

<figure><img src="../../.gitbook/assets/Screen Shot 2023-11-02 at 4.18.19 PM.png" alt=""><figcaption></figcaption></figure>

Click on "Quickstart" under "Overview". Select Web Application on the screen that opens up. And select "Node.js web" as the platform.

You should see the following screen:

<figure><img src="../../.gitbook/assets/Screen Shot 2023-11-02 at 4.22.46 PM.png" alt=""><figcaption></figcaption></figure>

Click on "Make this change for me" and then click "Make updates" in the side panel that shows up.

Click "Download the code sample". This will download a zip file, extract it and open the folder in your favorite code editor (say, VS Code).

## Setting up the Backend

Go back to the Overview page

<figure><img src="../../.gitbook/assets/Screen Shot 2023-11-02 at 4.18.19 PM.png" alt=""><figcaption></figcaption></figure>

Click on "Add a certificate or secret". You should see the following screen

<figure><img src="../../.gitbook/assets/Screen Shot 2023-11-02 at 5.25.41 PM.png" alt=""><figcaption></figcaption></figure>

Click on "New client secret". Enter a suitable description in the side panel that shows up and click add. Copy the value of the secret just created.\
\
Open up the `.env` file in the `App` sub-folder in your code editor. For the `CLIENT_SECRET` value, paste the value you just copied.

The `CLOUD_INSTANCE`, `TENANT_ID`, and `CLIENT_ID` values should already be filled in with your app's values. Make sure they're correct by comparing them to the details shown on the Overview page.&#x20;

For `EXPRESS_SESSION_SECRET`, generate a new secret by opening the terminal app on your computer and running `openssl rand -hex 32`. Paste the value generated into `EXPRESS_SESSION_SECRET`.

Save the file.

Navigate to the `App` subfolder in your **terminal** and run `npm install jsonwebtoken` . Now run `npm install`.

## Setting up Visitor Authentication

Now, we need to use GitBook. Go to the space you want to publish behind visitor authentication. Open the Share modal and click "Share to an audience", and enable the "Publish with Visitor Authentication" toggle.&#x20;

Make note of the Private key and the Space URL. We will need them.

<figure><img src="../../.gitbook/assets/va-modal.png" alt=""><figcaption></figcaption></figure>

Enter `http://localhost:3000/auth/signin` as the Fallback URL. **Note that this is different from the one shown in the image above.**

Go back to your code editor and open up the `index.js` file located in the `routes` folder under the `App` folder. Add&#x20;

```javascript
const jwt = require('jsonwebtoken');
```

to the top of the file. Replace the existing `router.get` definition&#x20;

```javascript
router.get('/', function (req, res, next) {
// the existing body of the function is here
});
```

&#x20;with the following

```javascript
router.get('/', function (req, res, next) {
    if (req.session.isAuthenticated) {
        const token = jwt.sign({}, "GITBOOK SIGNING KEY", { expiresIn: '1h' });
        const redirectURL = `https://example.gitbook.io/example/?jwt_token=${token}`;
        res.redirect(redirectURL);
    }
    else {
        res.redirect('/auth/signin')
    }
});
```

Replace `GITBOOK SIGNING KEY` with the Private Key value you copied from the GitBook Visitor Authentication Share modal.

In your code editor, in the following line

```javascript
const redirectURL = `https://example-url.gitbook.io/example/?jwt_token=${token}`
```

Replace everything before `?` with the Space URL you copied from the GitBook Visitor Authentication Share modal. Make sure there's only one `/` right before the `?`.

Your `router.get` definition should look something like the following:

```javascript
router.get('/', function (req, res, next) {
    if (req.session.isAuthenticated) {
        const token = jwt.sign({}, "91vb33d9-69f8-1pce-84bl-72b10234bbh0", { expiresIn: '1h' });
        const redirectURL = `https://vib-test.gitbook.io/azure/?jwt_token=${token}`;
        res.redirect(redirectURL);
    }
    else {
        res.redirect('/auth/signin')
    }
});
```

{% hint style="info" %}
Note that your signing key and redirect URL will be different from the one shown above.
{% endhint %}

Save the `index.js` file.

Make sure you're in the `App` subfolder in your terminal and run `npm start` .

If you see `node ./bin/www` in the output, the Visitor Authentication set up is complete!

In an incognito window, go to the GitBook space you just put behind Visitor Authentication. You will be prompted to sign in with Microsoft. If everything is set up correctly, you will be able to log in successfully and see the contents of the space.
