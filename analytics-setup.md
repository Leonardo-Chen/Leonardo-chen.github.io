# Portfolio Analytics Setup

This site is prepared for a self-hosted Umami setup. The frontend integration is already in place, but `analytics-config.js` stays disabled until your analytics server is ready.

## 1. Deploy Umami

Example `docker-compose.yml` for a small VPS:

```yaml
services:
  umami-db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: change-this-password
    volumes:
      - umami-db:/var/lib/postgresql/data

  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    restart: unless-stopped
    depends_on:
      - umami-db
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:change-this-password@umami-db:5432/umami
      APP_SECRET: replace-with-a-long-random-secret

volumes:
  umami-db:
```

Put Umami behind HTTPS and map it to a domain such as `analytics.yourdomain.com`.

## 2. Create a Website in Umami

After Umami is running:

1. Sign in to the Umami dashboard.
2. Create a website entry for your portfolio domain.
3. Copy the generated website ID.

## 3. Fill in `analytics-config.js`

Update these fields in `analytics-config.js`:

```js
window.PORTFOLIO_ANALYTICS = {
  enabled: true,
  scriptUrl: 'https://analytics.yourdomain.com/script.js',
  websiteId: 'your-umami-website-id',
  domains: ['leonardo-chen.github.io', 'yourdomain.com'],
};
```

If you want to respect browser privacy settings, keep `doNotTrack: true`.

## 4. Engagement Events

The site will send these custom Umami events once analytics is enabled:

- `engaged_30s`
- `engaged_60s`
- `engaged_120s`
- `engaged_visit`

Each event includes:

- `page_name`
- `page_type`
- `content_group`
- `page_path`
- `page_title`
- `active_seconds`

This gives you a practical approximation of time spent on each page without building a separate tracking backend.

## 5. What Is Already Wired Up

- All HTML pages load `analytics-config.js`.
- Shared portfolio pages load the updated `script.js`.
- The two subdirectory project pages also load the shared tracker.
- Page names are normalized for the main sections and project pages.

## 6. Privacy Notes

The privacy policy has been updated to match a self-hosted, privacy-friendly analytics setup. Review it again after deployment if you change:

- your hosting provider
- data retention settings
- whether cookies are enabled in Umami
- which domains are tracked
