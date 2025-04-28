# Implement Visitor Authentication using Next.js and Clerk

[Visitor Authentication](https://gitbook.com/docs/publishing/visitor-authentication) in GitBook is a powerful way to further control who has access to the information you're publishing. By setting up a custom login screen, you can customize the experience for private materials you might have on GitBook.

In order to use Visitor Authentication, you'll need to configure a few tools first—Including setting up a server to handle the sign-in flow your users will go through.

This guide explains how you can accomplish the above using [Next.js](https://nextjs.org/) and [Clerk](https://clerk.com/). Next.js is a popular open-source JavaScript framework for building web applications, while Clerk is a developer-focused authentication and user management platform. It provides a suite of tools and services that help developers add authentication and user management functionalities to their web applications quickly and easily.

The rest of this guide follows this [GitHub repository](https://github.com/GitbookIO/va-nextjs-clerk), and will explain the setup and code through the main functionalities of the demo app.

{% hint style="info" %}
This feature is currently accessible to all **Pro and Enterprise** customers. If you are interested in the [Enterprise plan](https://gitbook.com/docs/account-management/plans), please contact [sales@gitbook.com](mailto:sales@gitbook.com) for a quote.
{% endhint %}

### Clone Example

To get started, you'll need to clone the repository we're following in this guide. It requires a few pieces to be configured (which we'll cover in the following steps).

To clone, you can run the following command in your terminal:

```bash
git clone git@github.com:GitbookIO/va-nextjs-clerk.git
```

After cloning the repository, you can `cd` into the root of the project, and install it's dependencies using `npm install`.

### Publish GitBook Space with Visitor Authentication

In order to use a custom sign-in page for users, we'll need to publish a GitBook space with Visitor Authentication.&#x20;

Keep in mind, this feature is only available for Pro and Enterprise plans.

In the space you would like to use, head to the Share Modal in the upper right corner, and choose "Publish with visitor authentication" in the Share to an audience section.

<figure><img src="../../.gitbook/assets/Screenshot 2023-05-15 at 14.10.09.png" alt=""><figcaption><p>Enable Visitor Authentication</p></figcaption></figure>

After enabling this option, you'll see a Private Key available for you to use. We'll need this later in our configuration, so leave this page open to grab this key later.

You'll also see your published space's url. This is the link users can access your published content—But since it's protected with Visitor Authentication, it'll return an error for anyone visiting this link without signing in first. We'll need this value in our configuration at a later point as well.

Next, we'll need to configure our Clerk account.

### Sign up for Clerk

We are using Clerk in this demo to manage user authentication. You're able to [sign up](https://dashboard.clerk.com/) for a free account, which will allow you to follow along with the rest of this guide.&#x20;

Once you have an account, you're able to create a free application, and configure the login experience for your users. You can choose from a large list of providers, or allow them to create a new account via email or phone number!&#x20;

After you've customized your sign up/in screen you'll need to grab our API keys for this project.&#x20;

### Generate an API Key

Head to the **API Keys** section in the left side navigation to find keys specific for this project. We're using Next.js for the framework of this app, so you should see the following information at the top:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=**********
CLERK_SECRET_KEY=**********
```

<figure><img src="../../.gitbook/assets/Screenshot 2023-05-15 at 13.57.05.png" alt=""><figcaption><p>Clerk API key dashboard</p></figcaption></figure>

We'll need these in order to run the project. In your local project, you'll find an example `.env.example` file that we'll use for our environment variables.&#x20;

Rename this file to `.env`, and replace the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` keys with the copied values from your Clerk dashboard.

In the `.env` file, you'll also see another key called `NEXT_PUBLIC_GITBOOK_URL`. This is the URL that your site is published under, which can be found when you [Publish your GitBook Site with Visitor Authentication.](implement-visitor-authentication-using-next.js-and-clerk.md#publish-gitbook-space-with-visitor-authentication)

At this point, your `.env` file should look like this:

```properties
# Replace this with the public URL of the GitBook space you're protecting using Visitor Authentication.
NEXT_PUBLIC_GITBOOK_URL=https://***.gitbook.io/***/

# Copy these from the API keys sections in your Clerk application dashboard, by choosing "Next.js"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***
CLERK_SECRET_KEY=sk_test_***

```

Finally, we'll need to configure one more section to complete the set up.

### Create a Clerk Template

In the Clerk dashboard, head to the **JWT Templates** section in the left side navigation. You'll need to create a new template for your app to use.&#x20;

1. Go to your Clerk dashboard.
2. In your Clerk application, go to JWT templates.
3. Create a new template using the "Blank" template.
4. Give your template a name (this demo uses `'`**`GitBook`**`'`). If you use a different name, make sure your template name matches the one set in `pages/api/visitor-auth.ts` in your local project.

We'll now need the JWT key we created in [Publish your GitBook Space with Visitor Authentication](implement-visitor-authentication-using-next.js-and-clerk.md#publish-gitbook-space-with-visitor-authentication).

1. Enable the **"Custom signing key"** and **select the HS256 algorithm**.
2. Paste your private key in Clerk's JWT template **Signing key** field.

Lastly, we'll need to define a custom template for our sign in. Copy and paste the following code template into the "Claims" section.

```json
{
    "aud": "https://localhost:3000/api/visitor-auth",
    "user_id": "{{user.id}}",
    "last_name": "{{user.last_name}}",
    "first_name": "{{user.first_name}}"
}
```

Finally, click "Apply changes" to save your configuration.

### Run and test project

Now that we have our configuration completed, we can run and test the Visitor Authentication flow. If you try to visit your published GitBook site direclty, you'll be met with a 401 screen—But if we go through the Visitor Authentication flow, we'll be able to access the site without a problem.

In the root of your project, run `npm run dev` in the terminal. Then, navigate to the url your app is running on (by default, it should be `http://localhost:3000`)

<figure><img src="../../.gitbook/assets/Screenshot 2023-05-15 at 14.30.02.png" alt=""><figcaption><p>Visitor Authentication demo</p></figcaption></figure>

Here, you can sign up for an account.

<figure><img src="../../.gitbook/assets/Screenshot 2023-05-15 at 14.30.09.png" alt=""><figcaption><p>Visitor Authentication demo sign in page</p></figcaption></figure>

After we sign in successfully, we'll then be able to navigate to our published site without any problems.&#x20;

### Wrapping up

Visitor Authentication allows you to protect published GitBook sites behind a sign-in flow that you control.

Not only is it customizable, but it also opens up the door for many more possibilities in the future around the way you want to work in GitBook. Make sure to head to the [Visitor Authentication](https://gitbook.com/docs/publishing/visitor-authentication) docs to learn more.



### Stay up to date

Interested in hearing more? Sign up for our newsletter below:

{% @formspree/formspree %}
