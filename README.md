# Flick's farcaster frame starter

Uses:

- [frame.js](https://github.com/framesjs/frames.js)
- [SST](https://docs.sst.dev/)

Deploys to AWS

## Getting started

If you don't already have one, [create an AWS account](https://aws.amazon.com/console/)

Install the AWS CLI v2 [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Install [Node20](https://nodejs.org/en/download)

Open a terminal/powershell and run:

```bash
npm i -g yarn
```

### Create an AWS profile

Note: if you just want to deploy w/ Vercel then you can skip this part. I choose not to use Vercel because I find their offering expensive. Deploying directly to AWS, for most websites, will remain entirely within the free tier of usage. If you find later that you need to scale your website, then you will save money running directly on AWS and will run into fewer rate limiting moments.

Creating an AWS profile and setting up permissions is a complex discussion. The instructions here are the least secure but shortest path to getting started.

In the AWS console, create a user in the [here](https://us-east-1.console.aws.amazon.com/iam/home#/users/create)

![Creating the admin user](./docs/iam-user-1.png)

Next we are going to create an "admin" group so click on the "
Create Group" button

![Creating a group](./docs/iam-user-2.png)

Add the "AdminstrationAccess" role

![Adding the "AdminstrationAccess" role](./docs/iam-user-3.png)

Next select the newly created group and press "Next" and "Create User"

![Add user to the admin group](./docs/iam-user-4.png)

Click on the newly created user, then click on the "security credentials" tab, and finally click on "Create access key"

![Create access key](./docs/iam-user-5.png)

Here is the scary part where AWS tells you there are better ways. It's true but if you delete the key from your system when you are done you should be all good.

![Scary warning](./docs/iam-user-6.png)

On the next screen you will be given one chance to copy your access key and secret

While that screen is up, go back to your terminal and type:

```bash
aws configure
```

copy and paste the access key and secret when prompted.

enter "us-east-1" for the region

default output format: none

example:

```bash
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]:
```

### Installing dependencies

Clone this repo if you haven't already:

```bash
git clone https://github.com/0xflicker/flick-a-frame.git
cd flick-a-frame
```

Install dependencies:

```bash
cd www
yarn
```

In order to remove all of the complexities of deploying to AWS I choose to use SST in this example. If you are deploying to vercel you can skip this part and deploy away!

Create a local dev stage in SST:

```bash
yarn sst dev
```

Selecting the defaults is fine

Go to https://console.sst.dev/local/www/user in your browser

You will be asked to create a SST account. This only requires entering in a PIN code sent to an email. Once complete you should end up at the root SST console.

You need to deploy a stack to AWS. The SST console will link you to your AWS Cloudformation panel. Check that you are in the us-east-1 region and press "Deploy stack" when prompted (sorry I should have taken screenshots of this process)

### Running locally

You are now ready to run everything locally as well as deploy a production website.

To run locally, go to the `www` directory in a terminal and run:

```bash
yarn dev
```

Open http://localhost:3000/debug to see the [frame.js](https://github.com/framesjs/frames.js) debugger with their frames example.

### Deploying

When you are ready to deploy, run

```bash
yarn sst deploy --stage prod
```

You should get back a cloudfront distribution URL. Click on it and done!

Now that you have the final URL you can pass it back into the application to make the debug links work out of the box.

Inside www:

```bash
cp .env.example .env.production
```

Edit the `.env.production` file and replace http://localhost:3000 with the Cloudfront distribution URL

Re-run:

```bash
yarn sst deploy --stage prod
```

## Making changes

The example app uses Next.js and frames.js to make writing frames as powerful as possible.

Here is some relevant documentation:

- [frames.js](https://framesjs.org/)
- [next.js](https://nextjs.org/docs)
- [SST](https://docs.sst.dev/)

See [www/app/page.tsx](./www/app/page.tsx) as a good starting point for making changes. One thing to notice is the `FrameImage` component. This component will allow you to render images on the fly using the HTML contained inside.

Have fun and reach out to @flick on farcaster if you have any questions!
