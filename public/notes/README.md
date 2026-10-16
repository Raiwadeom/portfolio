# Episode notes (PDFs)

Drop each episode's PDF in this folder using exactly these names:

| Episode | File                              |
| ------- | --------------------------------- |
| 1       | `ep01-url.pdf`                    |
| 2       | `ep02-html-css-js.pdf`            |
| 3       | `ep03-react.pdf`                  |
| 4       | `ep04-api.pdf`                    |
| 5       | `ep05-frontend-backend-db.pdf`    |
| 6       | `ep06-sql-nosql.pdf`              |
| 7       | `ep07-oauth.pdf`                  |

- The page lives at `/notes`; each file is served at `/notes/<name>.pdf`.
- A card shows "Coming soon" until its PDF exists here (checked when the site is built).
- New episode: add the PDF, then add one line to `episodes` in `src/lib/notes.config.ts`
  (use the pattern `epNN-short-name.pdf`, lower-case, hyphens, no spaces).
- Then redeploy (push to `main`).
