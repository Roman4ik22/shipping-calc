# Schedule the weekly SEO digest

The `npm run seo:weekly` command pulls fresh GSC data, compares it to last week's snapshot, and writes a markdown digest to `docs/reports/weekly/{date}.md`. Three ways to run it on a schedule.

## What you need first

- `scripts/gsc-credentials.json` exists (already set up — see `~/.claude/.../memory/reference_gsc_api.md`)
- Node.js + npm available in your shell (`which node` should return a path)
- `npm install` has been run inside `~/Downloads/shipping-calc-repo`

Test once before scheduling:

```bash
cd ~/Downloads/shipping-calc-repo
npm run seo:weekly
```

You should see `Digest written to: docs/reports/weekly/2026-04-28.md`. Open the file to see the report.

---

## Option 1 — macOS launchd (recommended for a Mac always-on)

This survives reboots and runs on schedule even if you don't have a terminal open.

**Step 1.** Find your Node binary path:

```bash
which node
# e.g. /Users/romankolosovskiy/.nvm/versions/node/v20.10.0/bin/node
```

**Step 2.** Create the plist file at `~/Library/LaunchAgents/com.rateships.seoweekly.plist` with this content (replace `NODE_PATH` and `PROJECT_DIR` for your machine):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.rateships.seoweekly</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-l</string>
    <string>-c</string>
    <string>cd /Users/romankolosovskiy/Downloads/shipping-calc-repo && /Users/romankolosovskiy/.nvm/versions/node/v20.10.0/bin/npm run seo:weekly &gt;&gt; /tmp/seo-weekly.log 2&gt;&amp;1</string>
  </array>

  <!-- Every Monday at 09:00 local time -->
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key>
    <integer>1</integer>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>/tmp/seo-weekly.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/seo-weekly.log</string>

  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
```

**Step 3.** Load the agent:

```bash
launchctl load ~/Library/LaunchAgents/com.rateships.seoweekly.plist
```

**Verify** it's registered:

```bash
launchctl list | grep rateships
# com.rateships.seoweekly  -  0
```

**Test fire it manually** (without waiting for Monday):

```bash
launchctl start com.rateships.seoweekly
sleep 30
cat /tmp/seo-weekly.log
ls -lt ~/Downloads/shipping-calc-repo/docs/reports/weekly/
```

**To stop / remove**:

```bash
launchctl unload ~/Library/LaunchAgents/com.rateships.seoweekly.plist
rm ~/Library/LaunchAgents/com.rateships.seoweekly.plist
```

---

## Option 2 — crontab (simpler, but Mac must be awake at fire time)

Quick-and-dirty: edit the user's crontab.

```bash
crontab -e
```

Add this line:

```
0 9 * * 1 cd /Users/romankolosovskiy/Downloads/shipping-calc-repo && /Users/romankolosovskiy/.nvm/versions/node/v20.10.0/bin/npm run seo:weekly >> /tmp/seo-weekly.log 2>&1
```

(Replace `node` path with your actual `which node` output.)

`0 9 * * 1` = every Monday at 09:00.

Verify: `crontab -l`. Reads logs: `cat /tmp/seo-weekly.log`.

**Caveat**: cron only fires if the Mac is awake at 09:00. If it's asleep, the job is skipped (unlike launchd which catches up). If your Mac is usually asleep on Monday morning, use launchd.

---

## Option 3 — GitHub Actions (cloud, runs no matter what)

Doesn't depend on your machine being on. Requires storing the GSC credentials as a repo secret.

**Step 1.** Add the JSON content of `scripts/gsc-credentials.json` to a GitHub Secret named `GSC_CREDENTIALS_JSON`:
- Go to: https://github.com/Roman4ik22/shipping-calc/settings/secrets/actions
- "New repository secret"
- Name: `GSC_CREDENTIALS_JSON`
- Value: paste the JSON content of the credentials file

**Step 2.** Create `.github/workflows/seo-weekly.yml`:

```yaml
name: Weekly SEO digest

on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 09:00 UTC
  workflow_dispatch:     # Allow manual trigger from GitHub UI

jobs:
  digest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Write GSC credentials
        run: echo '${{ secrets.GSC_CREDENTIALS_JSON }}' > scripts/gsc-credentials.json

      - run: npm run seo:weekly

      - name: Commit digest
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/reports/weekly/
          git diff --staged --quiet || (git commit -m "chore(seo): weekly digest $(date +%Y-%m-%d)" && git push)
```

This way the report appears in the repo as a commit you can read on GitHub. No local machine needed.

**Caveat**: the snapshot file `.seo-snapshots.json` is gitignored locally. For GH Actions to compute deltas, either: (a) commit the snapshot to a separate branch / artifact storage, or (b) accept that GH Actions runs always start from "no prior" and just produce a snapshot-only digest.

For most users, option 1 (launchd) is best. Use option 3 only if your Mac is rarely on.

---

## Reading the digest

The digest file written to `docs/reports/weekly/{date}.md` includes:

- **Headline**: clicks/impressions/CTR/position with WoW deltas (🟢↑ / 🔴↓)
- **Hub indexing status**: which hub pages are indexed, which are stuck in "Discovered" or "Crawled — not indexed"
- **Top 10 pages by clicks**: with click delta vs prior week
- **Quick-win candidates**: high impressions but CTR <1% — these are pages where rewriting the title/description is the biggest leverage
- **Top 10 queries**: real searches that triggered impressions
- **Top 5 countries**: where the traffic comes from
- **New pages getting clicks this week**: pages that didn't appear in last week's top list

Open the file in your editor or VS Code preview pane. Or `cat docs/reports/weekly/$(ls docs/reports/weekly/ | tail -1)`.

## Troubleshooting

- "Cannot find module 'googleapis'" — run `npm install` inside `~/Downloads/shipping-calc-repo` first
- "ENOENT: gsc-credentials.json" — make sure `scripts/gsc-credentials.json` exists; restore from `~/Downloads/rateships-new-b69487f1ee45.json`
- Empty digest / no data — site has zero impressions in the period; check `https://search.google.com/search-console`
- "permission denied" on launchctl load — run `xattr -d com.apple.quarantine ~/Library/LaunchAgents/com.rateships.seoweekly.plist` first
