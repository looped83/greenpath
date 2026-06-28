# 🌿 GreenPath

**Dein persönlicher Nachhaltigkeits-Tracker** – grüner Leben, Schritt für Schritt.

GreenPath hilft dir, deinen Alltag messbar nachhaltiger zu gestalten. Die App motiviert durch Gamification, macht Fortschritte sichtbar und begleitet dich auf dem Weg zu einem bewussteren Lebensstil.

---

## Features

### 🏠 Dashboard
- Persönlicher Green Score (0–100)
- Wöchentliche CO₂-Ersparnis & Müllvermeidung (Schätzwerte)
- Aktiver Streak & Level-System
- Schnellübersicht Tagesaktionen
- Portfolio-Nachhaltigkeit

### ✅ Daily Green Actions
Täglich abhakbare Nachhaltigkeits-Aktionen mit Punkte-System:
- Vegan essen
- Fahrrad / ÖPNV statt Auto
- Nichts Neues kaufen
- Zero-Waste-Einkauf
- Strom sparen
- Regional einkaufen
- Grüne Finanzentscheidung
- Reparieren statt ersetzen
- Minimalismus-Aufgabe

### 🏆 Challenges
7 Challenges mit Fortschrittsanzeige:
- 7 Tage Vegan
- 30 Tage weniger Konsum
- Zero Waste Woche
- Green Mobility Woche
- Minimalismus-Challenge (21 Tage)
- Renewable Energy Awareness
- Green Investment Check

### 🌍 Impact-Bereich
- Gesamte CO₂-Ersparnis & Müllvermeidung
- Vegane Tage, autofreie Wege, konsumfreie Tage
- 12-Monats-Projektion

> ℹ️ Alle Werte sind Näherungsschätzungen und dienen der Motivation, nicht als wissenschaftliche Aussagen.

### 💚 Green Investments
Manueller Tracker für:
- Depotwert & nachhaltiger Anteil
- Fossiler / kontroverser Anteil
- Monatlicher Sparbetrag
- Zielquote & Fortschrittsanzeige

### 📊 Zero Waste & Minimalismus Tracker
- Nicht gekaufte Dinge
- Aussortiertes & Repariertes
- Vermiedene Verpackungen
- Second-Hand-Käufe
- Konsumfreie Tage

### 📈 Insights
- 7-Tage-Chart
- Stärken & Fokus-Tipps
- Persönliche Empfehlungen

### 🎮 Gamification
- 8 Level (Seedling → Planet Hero)
- 12 Badges (Vegan Hero, Zero Waste Hero, Green Investor, ...)
- Streak-System
- XP & Punkte
- Konfetti bei Achievements

---

## Lokal starten

```bash
# Option 1: einfach die Datei im Browser öffnen
open index.html

# Option 2: lokaler Dev-Server (Python)
python3 -m http.server 8080
# → http://localhost:8080

# Option 3: mit Node.js
npx serve .
# → http://localhost:3000
```

Die App läuft vollständig im Browser. Keine Abhängigkeiten, kein Build-Schritt.

---

## Deployment auf GitHub Pages

1. Repository auf GitHub erstellen (oder dieses forken)
2. In **Settings → Pages** → Source: **main branch / root**
3. Nach ca. 1 Minute erreichbar unter: `https://<username>.github.io/<repo>/`

---

## Datenspeicherung

Alle Daten werden lokal im **localStorage** des Browsers gespeichert. Keine Serververbindung, kein Account, kein Tracking.

---

## Technologie

| Was | Wie |
|-----|-----|
| Framework | Vanilla JavaScript (kein Framework) |
| Styling | CSS Custom Properties, Mobile-first |
| Daten | localStorage |
| Build | Keiner – direkt aus HTML |
| Icons | Unicode Emoji |

---

## Mögliche Erweiterungen

- **Export / Import** der Daten als JSON
- **PWA** (Service Worker, Offline-Fähigkeit, App-Icon)
- **Benachrichtigungen** zur täglichen Erinnerung
- **Soziale Features** – Challenges mit Freunden teilen
- **Kalender-Ansicht** für vergangene Tage
- **Detailliertere CO₂-Rechner** (Ernährung, Mobilität, Wohnen)
- **API-Anbindung** für echte Investmentdaten
- **Mehrsprachigkeit** (EN, FR, ES)
- **Mehr Challenges** & saisonale Events

---

## Hinweis

GreenPath ist kein Finanzberatungs-Tool und erhebt keinen Anspruch auf wissenschaftliche Genauigkeit der CO₂-Schätzwerte. Die App dient ausschließlich der persönlichen Reflexion und Motivation.

---

*Made with 💚 for a greener future.*
