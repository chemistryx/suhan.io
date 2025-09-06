English | [한국어](README.ko.md)
# suhan.io
A personal blog application

## Features
* User authentication via Supabase Auth
* Dynamic content creation using Markdown & stored in the database
* Image upload via Supabase Storage
* Tagging system for records
* Comment creation for both authors and anonymous users
* SEO optimization & dynamic OpenGraph image generation
* Email notifications to record authors on new comments

## Stack
* Frontend: Next.js
* Backend: Supabase
* Database: PostgreSQL (via Supabase)
* Deployment: Vercel, Supabase
* Email Notification Provider: Resend

## Getting Started
> [!NOTE]
> This repository is used for my personal [blog](https://suhan.io) and is **not ready to use out-of-the-box**. Some modifications may be needed before using it for your own project.

### 1. Clone Repository
```bash
$ git clone https://github.com/chemistryx/suhan.io.git
$ cd suhan.io/
```
### 2. Install Dependencies
```bash
$ npm install
```
### 3. Setup Environment
1. Create `.env.local` file in the root directory of the project.
2. Copy the contents from `.env.sample` to `.env.local` and fill in your own information.

### 4. Run Locally
```bash
$ npm run dev
```

## Supabase Setup
> Make sure Supabase CLI is installed and configured properly before proceeding.

### 1. Database
Apply migrations from the `supabase/migrations` folder:
```bash
$ supabase db push
```
This will create necessary tables(records, comments, etc.), triggers, and RLS policies.

### 2. Edge Functions & Database Webhooks (Optional)
Deploy Edge Functions and configure webhooks to enable features like email notifications on new comments.

1. Setup secrets using:
```bash
$ supabase secrets set RESEND_API_KEY=your_api_key
``` 
2. Deploy the function:
```bash
$ supabase functions deploy send-comment-mail
```
3. Configure Database Webhooks

    You can configure webhooks from [Supabase Dashboard](https://supabase.com/dashboard):

    3.1. Go to **Integrations > Database Webhooks** and click the `Create a new hook` button.\
    3.2. In the prompt:\
        - Under **General**, enter a name for your webhook.\
        - Under **Conditions to fire webhook**, select `comments` table and choose the event type **Insert**.\
        - Under **Webhook configuration**, select `Supabase Edge Functions` as the webhook type.\
        - Under **Edge Function**, select the pre-deployed Edge Function from the list.\
        - Leave the remaining options as default.

## License
[MIT License](LICENSE)
