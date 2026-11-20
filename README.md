English | [한국어](README.ko.md)
# suhan.io
A Markdown-based personal blog application.

Posts are stored as files in a GitHub repository and can be written through a web editor.

> [!NOTE]
> This repository is used for my personal [blog](https://suhan.io).\
> To use it elsewhere, update the site information in `src/site.config.ts` and the environment variables.

## Features
* Markdown editing in a web editor, committed to a GitHub repository
* Drafts, categories and tags
* Author sign-in with a GitHub account
* Image uploads to Cloudflare R2 and automatic deletion of unused images
* Comments from the author and anonymous users
* Email notifications to the author on new comments
* SEO optimization, sitemap and dynamic OpenGraph image generation

## Stack
* Framework: Next.js (App Router)
* Post storage: GitHub
* Image storage: Cloudflare R2
* Database: Cloudflare D1
* Email notifications: Resend
* Deployment: Vercel

## Getting Started
### 1. Clone Repository and Install Dependencies
```bash
$ git clone https://github.com/chemistryx/suhan.io.git
$ cd suhan.io/
$ npm install
```

### 2. Set Up External Services
#### Post Repository
1. Create a private GitHub repository for posts.
2. Create a [fine-grained token](https://github.com/settings/personal-access-tokens) with read and write access to Contents on that repository.

#### Authentication
1. Create a [GitHub App](https://github.com/settings/apps/new) and register the following callback URLs.
    * `http://localhost:3000/api/auth/callback`
    * `https://<your-domain>/api/auth/callback`
2. Deactivate the webhook and grant no permissions.
3. Copy the Client ID and generate a client secret.

Only the GitHub account that owns the post repository can sign in.

#### Images
1. Create a Cloudflare R2 bucket and connect a custom domain to it.
2. Create an R2 API token with Object Read & Write permission on that bucket.
3. Add the following CORS policy to the bucket so that images can be uploaded from the browser.
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://<your-domain>"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["content-type", "cache-control"],
    "MaxAgeSeconds": 3600
  }
]
```

#### Comments
1. Create a Cloudflare D1 database.
2. Create a Cloudflare API token with D1 Edit permission.
3. Create the tables with the following command.
```bash
$ npx wrangler d1 execute <database-name> --remote --file=db/schema.sql
```

#### Email Notifications
Verify a domain on [Resend](https://resend.com) and create an API key.

### 3. Setup Environment
1. Create `.env.local` file in the root directory of the project.
2. Copy the contents from `.env.sample` to `.env.local` and fill in the values prepared in step 2.

`AUTHOR_GITHUB_LOGIN`, `MAIL_FROM`, `MAIL_TO` and the search engine verification codes are optional. When left empty, they default to values derived from other environment variables.

On a local environment, however, `MAIL_FROM` has no default, so it must be set to test email notifications.

### 4. Configure Site
Edit `src/site.config.ts` and the intro in `src/app/page.tsx`, and replace `public/profile.png` and `src/data/works.ts`.

### 5. Run Locally
```bash
$ npm run dev
```

## Post Format
Each post is stored as `<slug>.md` at the root of the post repository.

The slug is generated from the title, and the frontmatter is written by the editor.
```markdown
---
id: 1
title: "Post title"
description: "Post description"
category: "backend"
tags: ["Next.js", "TypeScript"]
published: true
created_at: "2026-01-01T00:00:00.000Z"
updated_at: "2026-01-01T00:00:00.000Z"
---

Body
```
* `id` links a post to its comments and is kept when the title changes.
* `category` uses one of the slugs defined in `CATEGORIES` in `src/constants.ts`.
* Posts with `published` set to `false` are shown only to the signed-in author.

## Deployment
After deploying to Vercel, add the environment variables from `.env.sample`. Mark tokens and secrets as Sensitive.

`vercel.json` registers a cron job that deletes unused images.

It runs once a day and deletes images that were uploaded more than a week ago and are not used in any post.

Vercel authenticates the request with the `CRON_SECRET` environment variable.

## License
[MIT License](LICENSE)
