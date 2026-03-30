# E2E Test Cases - La Velada VI

## Pages & Routes

### 1. Landing Page (`/`)
- [ ] Page loads with 200 status
- [ ] Logo image is visible
- [ ] Event date "25 DE JULIO" is visible
- [ ] Event time "20:00H CET" is visible
- [ ] Venue "ESTADIO DE LA CARTUJA, SEVILLA" is visible
- [ ] Countdown timer shows days, hours, minutes, seconds
- [ ] "ENTRADAS AGOTADAS" button is visible and disabled
- [ ] Social links (Twitch /IBAI, TikTok /IBAILLANOS, YouTube /IBAILLANOS) are visible
- [ ] "WEB PATROCINADA POR InfoJobs" is visible
- [ ] JSON-LD contains correct startDate, location, offers SoldOut
- [ ] Meta description contains "La Velada del Año VI"
- [ ] Open Graph image is set

### 2. Combates Overview (`/combates`)
- [ ] Page loads with 200 status
- [ ] Title "LOS COMBATES" is visible
- [ ] All 10 combats are rendered
- [ ] Main event (Grefg vs IlloJuan) is displayed prominently (full width)
- [ ] Each combat shows two fighter placeholder images
- [ ] Each combat shows a VS placeholder image
- [ ] Each combat links to its detail page (`/combates/{id}`)
- [ ] PredictionBar component renders for each combat
- [ ] No "VICTORIA" badges shown (no winners yet)

### 3. Combat Detail (`/combates/[id]`)
Test with: `/combates/10-grefg-vs-illojuan`
- [ ] Page loads with 200 status
- [ ] CombatVersus component renders with two fighter images
- [ ] Fighter 1 (Grefg) card is visible with name
- [ ] Fighter 2 (IlloJuan) card is visible with name
- [ ] Fighter stats shown: age, height, weight, country
- [ ] Country flags are visible
- [ ] No video section (video field is empty)
- [ ] Meta description contains both fighter names
- [ ] Links to fighter profile pages work

### 4. Fighter Profile (`/luchador/[id]`)
Test with: `/luchador/grefg`
- [ ] Page loads with 200 status
- [ ] Fighter big portrait placeholder is visible
- [ ] Fighter name text overlay placeholder is visible
- [ ] BoxerProfileCard shows: real name, age, weight, height, birthDate, country, city
- [ ] Country flag (Spain) is visible
- [ ] Bio text is visible and correct
- [ ] Social links are rendered (Instagram, YouTube, Twitch, X)
- [ ] Opponent card (IlloJuan) is visible
- [ ] CombatVersus section links to combat page
- [ ] "VER CLIPS DEL COMBATE" button is visible
- [ ] Meta description contains fighter name and bio excerpt

### 5. Porra/Predictions (`/porra`)
- [ ] Page loads (may show error without DB - document expected behavior)
- [ ] Title "RESULTADOS DE LA PORRA" visible (if DB available)
- [ ] All 10 combats listed with prediction bars (if DB available)

### 6. 404 Page (`/nonexistent-page`)
- [ ] Returns 404 status
- [ ] Error page renders

### 7. API Endpoint (`/api/predictions`)
- [ ] GET returns response (500 without DB, 200 with DB)
- [ ] Rate limiting returns 429 after exceeding limit
- [ ] X-RateLimit headers present in response

### 8. Navigation / Cross-page
- [ ] From `/combates` → click combat → `/combates/[id]` loads
- [ ] From `/combates/[id]` → click fighter card → `/luchador/[id]` loads
- [ ] From `/luchador/[id]` → opponent card links to opponent profile

### 9. Responsive
- [ ] Landing: renders correctly at 390x844 (mobile)
- [ ] Combates: grid adapts to single column on mobile
- [ ] Fighter profile: layout stacks vertically on mobile

### 10. SEO / Meta
- [ ] Each page has unique title
- [ ] Each page has unique meta description
- [ ] Each page has canonical URL
- [ ] Landing has JSON-LD Event schema
- [ ] All pages reference "La Velada del Año VI" (not V)
