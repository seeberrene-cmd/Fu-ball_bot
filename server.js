const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Twilio Account SID
const authToken  = process.env.TWILIO_AUTH_TOKEN;   // Twilio Auth Token
const client = new twilio(accountSid, authToken);

const whatsappFrom = "whatsapp:+14155238886";       // Twilio Sandbox Nummer
const whatsappTo   = process.env.WHATSAPP_TO;       // Deine Nummer

// Testnachricht senden
client.messages.create({
  from: whatsappFrom,
  to: whatsappTo,
  body: "✅ Testnachricht vom Render WhatsApp-Bot!"
})
.then(msg => console.log("✅ WhatsApp Testnachricht gesendet:", msg.sid))
.catch(err => console.error("❌ Fehler beim Senden:", err));

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const twilio = require("twilio");

// Twilio konfigurieren
const accountSid = "AC79a6df6719c97a9699303b246366dc32";       // Twilio Account SID
const authToken = "d6b5bdda7626e0c71a610a6b43b9dac8";         // Twilio Auth Token
const client = new twilio(accountSid, authToken);

const whatsappFrom = "whatsapp:+14155238886"; // Twilio Sandbox Nummer
const whatsappTo = "whatsapp:+4369010194410"; // Deine Telefonnummer

// Ligen-IDs für die API (Beispiel: football-data.org)
const leagues = {
  "PD": "Spanien",       // La Liga
  "SA": "Italien",       // Serie A
  "PL": "England",       // Premier League
  "PPL": "Portugal",     // Primeira Liga
  "SL": "Schweiz",       // Swiss Super League
  "BL1": "Deutschland"   // Bundesliga
};

// API Key für football-data.org (optional, kostenlos) 
const API_KEY = "";

async function checkHalftimeScores() {
  for (const leagueId in leagues) {
    const leagueName = leagues[leagueId];
    const API_URL = `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=LIVE`;

    try {
      const res = await fetch(API_URL, { headers: { "X-Auth-Token": API_KEY } });
      const data = await res.json();
      const matches = data.matches || [];

      matches.forEach(match => {
        const status = match.status; // "PAUSED" = Halbzeit
        const halftimeScore = match.score.halfTime || { home: 0, away: 0 };

        if (status === "PAUSED" && halftimeScore.home === 0 && halftimeScore.away === 0) {
          const message = `⚽ Halbzeit 0:0 in ${leagueName}: ${match.homeTeam.name} - ${match.awayTeam.name}`;
          sendWhatsApp(message);
        }
      });

    } catch (err) {
      console.error(`Fehler bei Liga ${leagueName}:`, err);
    }
  }
}

function sendWhatsApp(message) {
  client.messages.create({
    from: whatsappFrom,
    to: whatsappTo,
    body: message
  })
  .then(msg => console.log("✅ WhatsApp gesendet:", msg.sid))
  .catch(err => console.error("❌ WhatsApp Fehler:", err));
}

// Alle 1 Minute prüfen
setInterval(checkHalftimeScores, 60 * 1000);

console.log("🚀 WhatsApp Multi-Liga-Notifier läuft...");
