# Prompt History — earnlog.xyz

<!-- Append new prompts at the bottom, newest last. Format:

## YYYY-MM-DD [optional title]
> <prompt text or short summary>

The dated H2 (`## YYYY-MM-DD`) is what `portfolio project check` parses
to surface "last AI prompt" per project. Keep entries append-only.
-->

## 2026-05-25 — scaffolded via portfolio new bootstrap

> Created project skeleton. Stack chosen, scaffolding written, git initialized.

## 2026-06-29 — v1.A: build indexable content layer (fix crawled-not-indexed)

> Fix the crawled-but-not-indexed problem: the /calculator pages are thin React
> app shells with no indexable content, so Google crawls but won't index. Build
> the static informational content layer the tool lacks, a defensible methodology
> page, and structured data — all funnelling into /calculator.
>
> Verified data corrections wired in: CA minimum wage $16.90/hr (DIR, eff.
> 2026-01-01); IRS standard mileage 72.5¢/mi (Notice 2026-10). Cost model now
> exposes two honest modes — fuel-only and full-cost (IRS 72.5¢/mi, no
> fuel double-count), defaulting to IRS full cost.
>
> Shipped (commit 804a461, pushed to main):
> - New static pages: /real-pay-comparison/, /cost-per-mile/ (methodology anchor),
>   /california-minimum-wage-drivers/, /is-doordash-worth-it-california/ (worked
>   example), /example-report/ (static populated weekly report → homepage CTA).
> - Structured data: WebApplication (/calculator), Organization+WebSite sitewide
>   (sameAs left TODO), FAQPage + Article on the relevant pages. All JSON-LD
>   validated (17 blocks, 0 parse errors).
> - noindex + sitemap-exclude the user-data app shells (/dashboard, /logbook,
>   /report); new content pages stay indexable and internally cross-linked.
> - vitest env jsdom → node (jsdom uninstalled; tests are string assertions).
>
> Build green, 8/8 tests pass. Real-world payoff (indexing) pending deploy + GSC
> recrawl — see docs/growth.md.
