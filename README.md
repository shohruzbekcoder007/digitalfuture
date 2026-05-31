# KELAJAK IQTISODIYOTI VA RAQAMLI TRANSFORMATSIYALAR

Iqtisodiyot, raqamli transformatsiya, fintech, davlat boshqaruvi va innovatsiyalar bo'yicha ochiq kirimli (open access) ilmiy jurnal uchun MERN stack platforma. Akademik maqolalarni va jurnal sonlarini onlayn joylashtirish, qidirish va PDF orqali tarqatish imkonini beradi. Dizayn — professional academic journal stilida: toza layout, oq fon, ko'k aksent, minimal animatsiyalar.

## Tuzilma

```
/backend
  /config         → DB, Cloudinary
  /controllers    → issues, articles, authors, auth
  /middleware     → auth, error handler
  /models         → JournalIssue, Article, Author, User
  /routes         → issues, articles, authors, auth, uploads
  server.js
  seed.js         → 6 ta son + 12 maqola + 6 muallif + admin

/frontend (Vite + React + Tailwind)
  /src
    /components   → JournalIssueCard, ArticleCard, AuthorCard, CitationBox,
                    FilterBar, Hero, Header, Footer, SkeletonCard, Pagination
    /pages
      HomePage, CurrentIssuePage, ArchivePage, IssueDetailPage,
      ArticlesPage, ArticleDetailPage, AuthorsPage, AuthorDetailPage,
      LoginPage, NotFoundPage,
      /admin → AdminLayout, AdminIssuesPage, AdminArticlesPage, AdminAuthorsPage
    /hooks        → useJournal (TanStack Query)
    /services     → issuesService, articlesService, authorsService, authService, api
    /i18n         → uz/ru/en
    /utils        → format, badges (categories, APA citation builder)
```

## Entities

### JournalIssue
`volume`, `issueNumber`, `year`, `publicationDate`, `title{uz,ru,en}`, `description{uz,ru,en}`,
`coverImage`, `pdfUrl`, `pages`, `issn`, `isCurrent`, `isPublished`, `slug`, `views`, `downloads`.

### Article
`title{uz,ru,en}`, `abstract{uz,ru,en}`, `body{uz,ru,en}`, `authors[]`, `authorNames[]`,
`issue (ref)`, `category` (research/review/case-study/editorial/short-communication/other),
`keywords[]`, `doi`, `pdfUrl`, `pages`, `language`, `publicationDate`, `references[]`,
`featured`, `slug`, `views`, `downloads`.

### Author
`fullName`, `affiliation`, `country`, `email`, `orcid`, `bio{uz,ru,en}`, `avatar`, `slug`.

## API endpointlar

| Method | URL | Tavsif |
| --- | --- | --- |
| GET | `/api/issues` | Sonlar ro'yxati (filter, pagination) |
| GET | `/api/issues/current` | Joriy son + maqolalari |
| GET | `/api/issues/archive` | Yillar bo'yicha guruhlangan arxiv |
| GET | `/api/issues/:slug` | Bitta son + maqolalari |
| POST/PUT/DELETE | `/api/issues[/:id]` | Admin CRUD |
| PATCH | `/api/issues/:id/view\|download` | Counter |
| GET | `/api/articles` | Maqolalar (search: title/abstract/keywords/author/DOI) |
| GET | `/api/articles/featured` | Tanlangan maqolalar |
| GET | `/api/articles/:slug` | To'liq maqola |
| GET | `/api/articles/:slug/related` | O'xshashlar |
| POST/PUT/DELETE | `/api/articles[/:id]` | Admin CRUD |
| PATCH | `/api/articles/:id/view\|download` | Counter |
| GET | `/api/authors` | Mualliflar (article counts bilan) |
| GET | `/api/authors/:slug` | Muallif + uning maqolalari |
| POST/PUT/DELETE | `/api/authors[/:id]` | Admin CRUD |
| POST | `/api/uploads/image\|pdf` | Fayl yuklash — Cloudinary yoki lokal disk (admin) |
| POST | `/api/auth/login\|register` | Auth |

**Article search query**: `?search=&category=&language=&issue=&author=&year=&featured=&sort=newest|oldest|popular|downloads&page=&limit=`

## Ishga tushirish

### Tezkor lokal o'rnatish (Windows)

```bat
setup.bat
```

Skript ikkita `.env` faylini yaratadi, barcha dependency'larni o'rnatadi va keyingi qadamlarni ko'rsatadi.

### Bir komandali dev (root'dan)

```bash
npm run install:all     # bir martalik
npm run seed            # 6 son + 12 maqola + 6 muallif + admin
npm run dev             # backend (5000) + frontend (5173) parallel
```

### Yoki qo'lda alohida

```bash
# Backend
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev

# Frontend (yangi terminalda)
cd frontend
copy .env.example .env
npm install
npm run dev
```

Vite proxysi `/api` so'rovlarini 5000-portga uzatadi.

### Tarmoq (LAN) orqali kirish

Vite va backend ikkalasi ham `0.0.0.0` ga bog'langan, shuning uchun bir xil Wi-Fi/LAN dagi har qanday qurilmadan ochish mumkin:

```
http://172.16.8.38:5173       ← frontend (telefon/boshqa kompyuterdan)
http://172.16.8.38:5000/api   ← backend
```

Manzilingizdagi aniq IP'ni server ishga tushgandagi log'da ko'rasiz:

```
Local:    http://localhost:5000/api/health
Network:  http://172.16.8.38:5000/api/health
```

Frontend `/api`'ga nisbiy so'rov yuboradi va Vite proxysi ularni shu kompyuterdagi 5000-portga uzatadi — shuning uchun mobil qurilmada ham backend manzilini alohida sozlash shart emas.

**Windows Firewall**: birinchi marta ishga tushirilganda 5173 va 5000 portlari uchun ruxsat so'raydi — "Private networks" ni belgilang. Aks holda LAN'dagi boshqa qurilmalar ulana olmaydi.

### Lokal rejim (Cloudinary va Atlas SIZ ishlaydi)

**MongoDB**: agar `MONGO_URI` belgilanmagan bo'lsa, default `mongodb://127.0.0.1:27017/journal_db` ishlatiladi.
Mahalliy MongoDB (Community Server yoki Docker `mongo:7`) yetarli.

**Fayl yuklash**: agar `CLOUDINARY_*` env-lar **bo'sh** qoldirilsa, yuklangan rasm/PDFlar avtomatik ravishda `backend/uploads/` papkasiga saqlanadi va `http://localhost:5000/uploads/<filename>` orqali xizmat qilinadi. Cloudinary kalitlari to'ldirilgan zahoti avtomatik Cloudinary'ga o'tib ketadi — kodda o'zgarish kerak emas.

Boshlang'ich log'da qaysi rejim faolligi ko'rinadi:
```
[upload] Local disk storage enabled (uploads/)
```

## Sahifalar

| URL | Tarkib |
| --- | --- |
| `/` | Hero + Current Issue + Featured + Recent articles + Recent issues |
| `/current` | Joriy songa redirect |
| `/archive` | Yillar bo'yicha sonlar to'plami |
| `/issues/:slug` | Cover, vol/issue, sana, maqolalar ro'yxati, PDF download |
| `/articles` | Filtr + qidiruv (title/abstract/keywords/author/DOI) |
| `/articles/:slug` | To'liq sahifa: abstract, keywords, authors, PDF, references, citation (APA), related |
| `/authors` | Mualliflar to'plami (qidiruv) |
| `/authors/:slug` | Profil + nashrlar |
| `/admin/issues\|articles\|authors` | CRUD paneli (JWT-protected) |

## SEO

Har bir maqola sahifasida:
- `<title>` + meta description (abstract'dan)
- meta keywords
- Google Scholar uchun `citation_title`, `citation_author`, `citation_publication_date`,
  `citation_doi`, `citation_pdf_url`
- OpenGraph (og:type=article, og:title, og:description, og:image)

## Search

Backend matn qidiruvini quyidagilar bo'yicha amalga oshiradi:
- title (uz/ru/en)
- abstract (uz/ru/en)
- keywords
- authorNames (denormalized)
- DOI

Frontend debounced input (350ms) bilan API'ga so'rov yuboradi.

## Default admin

Seed buyrug'idan keyin:
- Email: `admin@journal.uz`
- Parol: `admin123456`

Productionga chiqishdan oldin albatta o'zgartiring.

## Texnologiya stacki

- **Backend**: Node 18+, Express, Mongoose, JWT, bcryptjs, multer (local disk yoki Cloudinary), slugify
- **Frontend**: React 18, Vite, Tailwind CSS, TanStack Query, React Router v6,
  i18next (uz/ru/en), DOMPurify (sanitization), date-fns, lucide-react

## Sinash

1. MongoDB ishga tushiring (mahalliy yoki Atlas).
2. Root'dan `npm run install:all && npm run seed && npm run dev`.
3. http://localhost:5173 — joriy son va featured maqolalar darhol ko'rinadi.
4. Admin paneli: http://localhost:5173/login → `admin@journal.uz` / `admin123456`.

## Docker bilan MongoDB (ixtiyoriy)

Agar mahalliy MongoDB o'rnatilmagan bo'lsa, Docker orqali bir komanda bilan ishga tushirsa bo'ladi:

```bash
docker run -d --name journal-mongo -p 27017:27017 mongo:7
```

Keyin `npm run seed && npm run dev`.
