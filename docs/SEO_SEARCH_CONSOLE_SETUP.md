# Search Console & Technical SEO Operational Playbook

This document details the configuration, Google Search Console submission protocol, structured data validation, and digital PR outreach playbook for **Vowels.ai (AIRA)**.

---

## 1. Quick Verification & Google Search Console Submission

### A. Meta Tag Verification
The root layout dynamically injects your Google verification meta tag from your environment variables:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-code-here"
```

Once deployed, Google will verify domain ownership automatically via:
```html
<meta name="google-site-verification" content="your-verification-code-here" />
```

### B. Submitting the Dynamic Sitemap
1. Open [Google Search Console](https://search.google.com/search-console).
2. Select your property (`https://vowels.ai` or your custom domain).
3. Navigate to **Indexing** &rarr; **Sitemaps** in the left sidebar.
4. In the **Add a new sitemap** input field, enter:
   ```text
   sitemap.xml
   ```
5. Click **Submit**. Googlebot will queue `https://vowels.ai/sitemap.xml` and discover all canonical URLs:
   - `/` (Priority 1.0)
   - `/login` (Priority 0.8)
   - `/security` (Priority 0.7)
   - `/privacy` (Priority 0.6)
   - `/terms` (Priority 0.6)

---

## 2. Robots Directives & Search Bot Crawl Rules

The dynamic `app/robots.ts` renders `/robots.txt` with strict security safeguards:
- **Publicly Indexed Routes**: `/`, `/login`, `/privacy`, `/terms`, `/security`.
- **Protected Non-Indexed Routes**: `/api/*`, `/dashboard/*`, `/admin/*`, `/interview/*` (candidate privacy protected).
- **Googlebot Whitelist**: Explicitly unblocked with fast crawl permissions for assets (`/_next/static/*`, `/_next/image/*`, `/favicon.svg`, `/aira-avatar.webp`).
- **Sitemap Link**: Direct pointer to `${baseUrl}/sitemap.xml`.

---

## 3. Structured Data (Schema.org JSON-LD)

The application embeds valid JSON-LD schemas in `<head>` for rich snippet eligibility in Google SERPs:

| Schema Type | Purpose | Google Rich Result |
| :--- | :--- | :--- |
| `WebSite` | Brand recognition & search box integration | Sitelinks search box |
| `Organization` | Knowledge Graph card & verified entity | Knowledge panel |
| `SoftwareApplication` | Business application metadata & rating | App rich cards |
| `FAQPage` | Direct accordion Q&A in Google Search results | FAQ expandable snippets |
| `BreadcrumbList` | Hierarchical navigation paths in SERP snippets | Breadcrumb trail |
| `Person` (Author Bio) | E-E-A-T attribution for technical credibility | Author knowledge entity |

Validate live schemas at any time using:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## 4. Core Web Vitals & Sub-2s Performance Tuning

The frontend is optimized for Google's Core Web Vitals thresholds:
- **Largest Contentful Paint (LCP < 2.0s)**: Preconnect and DNS prefetch links for Google Fonts; WebP avatar formatting.
- **Cumulative Layout Shift (CLS = 0.00)**: Explicit `width` and `height` dimensions on all visual media (`640x640`).
- **Interaction to Next Paint (INP < 150ms)**: Transition-deferred route navigation via `useTransition`.

---

## 5. High-Authority Backlink & Digital PR Outreach Playbook

To earn high-authority backlinks from top-tier publications (Forbes, TechCrunch, Wired):

1. **Newsworthy Angle**: Focus on *"Autonomous AI Voice Agent eliminates 90% of recruiter screening fatigue with sub-20ms conversational latency."*
2. **Data & Benchmarks**: Share proprietary statistics (e.g., candidate completion rates, bias reduction metrics, interview pacing analytics).
3. **Press Kit & Assets**:
   - High-resolution logos & product screenshots (`/aira-avatar.webp`).
   - Executive bios with verified LinkedIn/GitHub links.
   - Live interactive demo access for journalists.
4. **HARO / Connectively & Help a B2B Writer**:
   - Monitor daily queries on AI hiring ethics, automated interview screening, and workforce technology.
   - Provide direct, concise quotes from the engineering team within 20 minutes of publication queries.
