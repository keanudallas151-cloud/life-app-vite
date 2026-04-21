# Life.

A production-minded web app for curated reading on money, psychology, and philosophy — with quizzes, notes, bookmarks, and a community **Post-It** feed. Built with **Next.js** and **Supabase**, and ready to ship through **Vercel + GitHub**.

## Local development

```bash
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
# from your Supabase project (Settings -> API Keys)
npm run dev
```

Without env vars the shell still runs, but auth, cloud-synced library data, quiz stats, and Post-It stay offline.

## Windows: rename local folder (`life-app-vite` -> `life-app`)

If `C:\Users\louie\life-app-vite` will not rename to `C:\Users\louie\life-app`, use this checklist.

1. Close apps that may lock files:
   - VS Code, terminals, `npm run dev`, Git GUIs, Explorer windows inside the repo.
2. Confirm destination does not already exist:
   ```powershell
   Test-Path "C:\Users\louie\life-app"
   ```
   `True` means the destination already exists (do not rename yet). `False` means it is safe to continue.
3. Check for lock holders (including hook/dev processes):
   ```powershell
   Get-Process code,node,git,powershell,bash,sh -ErrorAction SilentlyContinue
   ```
   Optional (Sysinternals, recommended for exact lock detection):
   ```powershell
   handle.exe -accepteula "C:\Users\louie\life-app-vite"
   ```
   If `handle.exe` is not installed, use Resource Monitor (`resmon.exe`) -> CPU -> Associated Handles and search for `life-app-vite`.
   Then close the app normally or stop only the exact PID if safe (use with caution):
   ```powershell
   Stop-Process -Id <PID> -Force
   ```
   Example: `Stop-Process -Id 1234 -Force`.
   Prefer normal app shutdown first; use `-Force` only for confirmed non-system orphaned processes.
4. Rename with PowerShell:
   ```powershell
   Move-Item -LiteralPath "C:\Users\louie\life-app-vite" -Destination "C:\Users\louie\life-app"
   ```
   Force rename in the same parent folder (only when destination does not exist):
   ```powershell
   Rename-Item -LiteralPath "C:\Users\louie\life-app-vite" -NewName "life-app" -Force
   ```
5. If permissions block rename (run PowerShell as Administrator):
   ```powershell
   takeown /F "C:\Users\louie\life-app-vite" /R /D Y
   icacls "C:\Users\louie\life-app-vite" /grant "%USERNAME%":(OI)(CI)F /T
   ```
   `OI`/`CI` apply inheritance to files/folders, `F` is full control, and `/T` is recursive.
6. If path length blocks rename:
   ```powershell
   git config --global core.longpaths true
   ```
   (Admin, system-wide long paths):
   ```powershell
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f
   ```
   This changes system-wide behavior, so run it only with Administrator access and only if needed.
   Restart Windows after enabling long paths.
7. Fallback when rename still fails (copy then remove old folder after verification):
   Make sure `C:\Users\louie\life-app` is empty or does not exist before `/MIR`.
   `/MIR` mirrors the source and **deletes files/folders in destination** that do not exist in source.
   ```powershell
   robocopy "C:\Users\louie\life-app-vite" "C:\Users\louie\life-app" /MIR /COPY:DAT /R:2 /W:2
   ```
   After you verify the copied folder works:
   ```powershell
   Remove-Item "C:\Users\louie\life-app-vite" -Recurse -Force
   ```

### Verify Git after move

```powershell
cd "C:\Users\louie\life-app"
git status
git remote -v
npm run lint
npm run build
```

### Roll back if needed

```powershell
Move-Item -LiteralPath "C:\Users\louie\life-app" -Destination "C:\Users\louie\life-app-vite"
```

Last resort:
```powershell
Restart-Computer
```
Then retry the rename before force-stopping additional processes.

## Vercel + Supabase + GitHub setup

1. Import the GitHub repository into **Vercel** so pushes and pull requests create deployments automatically.
2. In **Vercel → Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production origin, for example `https://life.example.com`)
3. In **Supabase → Authentication → URL Configuration**:
   - Set **Site URL** to the same production origin used in Vercel.
   - Add `http://localhost:3000` to **Redirect URLs** for local auth flows.
   - Add your Vercel production domain and any preview URL wildcard pattern you use for preview deployments.
4. GitHub Actions now runs lint + build on pushes and pull requests, while Dependabot keeps npm packages and GitHub Actions dependencies moving.

## Supabase schema (expected)

The app assumes tables such as `user_data`, `quiz_stats`, `posts`, `comments`, and `post_votes` with RLS appropriate for your security model. The `user_data` record is expected to hold fields like bookmarks, notes, read progress, momentum state, and saved reader highlights. The repo now includes additive Supabase migrations for those core tables.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
