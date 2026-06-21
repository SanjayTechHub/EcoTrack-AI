<<<<<<< HEAD
# EcoTrack AI - Carbon Footprint Awareness Platform

EcoTrack AI is a complete, gamified carbon footprint awareness platform built for climate tech innovation. It allows students, professionals, and families to track, reduce, and offset their carbon emissions through dynamic calculations, interactive daily eco-challenges, an AI coach simulator, community sharing, streaks, and progress visualization.

---

## 🌟 Key Features

1. **User Dashboard**: Live Carbon Footprint Score (kg CO2/mo), Sustainability Score (0-100), Level-up tracking, and daily streak counters.
2. **Dynamic Calculator**: Categorized inputs for Travel, Energy, Food, and Shopping with live calculation feedback matching international emission standards.
3. **AI Carbon Coach**: Simulates a personalized carbon coach chat answering transport, energy, clothing, and diet questions with actionable tips.
4. **Analytics**: SVG-based responsive distribution chart, carbon reduction reports, and predictive carbon forecasting.
5. **Daily Eco-Challenges**: Categorized XP rewards with a simulated QR Scanner to verify real-life actions (e.g. taking a bus or recycling).
6. **Carbon Offset Shop**: Direct calculation of mature trees required to balance annual emissions, with recommended gold-standard climate projects.
7. **Community Sharing Feed**: Post achievement stories, share tips, like and comment on community activities.
8. **Admin Panel**: Toggle variables, customize global carbon factors, and review member statistics.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS (v4), Framer Motion, Lucide Icons.
- **Backend & Database**: Next.js API Routes, Prisma ORM, PostgreSQL schema ready.
- **Resilient Fallback Design**: Built-in mock state layer allowing the app to run completely client-side in the browser without database/AI key dependencies.

---

## 🚀 Setup and Installation

### 1. Clone the Project
```bash
git clone https://github.com/SanjayTechHub/EcoTrack-AI.git
cd EcoTrack-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecotrack?schema=public"
NEXTAUTH_SECRET="ecotrack-ai-super-secret-key-hackathon-2026"
OPENAI_API_KEY="your-openai-api-key-here"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Repository Structure

```
EcoTrack-AI/
├── prisma/
│   └── schema.prisma       # Database schema (PostgreSQL ready)
├── public/                 # Static assets, PWA icons, manifest
├── src/
│   ├── app/
│   │   ├── globals.css     # Global styles & Tailwind configs
│   │   ├── layout.tsx      # App wrapper with SEO metadata
│   │   └── page.tsx        # High-fidelity Landing + Interactive App
│   └── components/
├── .env                    # Configuration variables
├── package.json            # Scripts & project dependencies
└── README.md               # Presentation & user guide
```

---

## 🏆 Hackathon Pitch & Presentation Points (3-Minute Goal)

1. **The Hook (Problem)**: Climate anxiety is rising, yet individuals struggle to quantify their personal impact. "How much carbon did I save by using a reusable bottle today?" Traditional carbon calculators are dry, complex, and unmotivating.
2. **The Solution (EcoTrack AI)**: We gamify carbon saving. By turning green actions into XP, badges, daily streaks, and community achievements, sustainability becomes a habits-tracker like Duolingo.
3. **Core Innovation**: 
   - **Simulated QR Verification**: Verified proof-of-action for eco-friendly habits.
   - **Predictive Forecasting**: Forecasting future emissions based on current behaviors.
   - **AI Coach Insights**: Real-time contextual reduction tips on request.
4. **Market Opportunity**: EcoTrack AI serves as a B2B SaaS model for corporations tracking employee ESG indices, or as a free public citizen engagement platform.

---

## 🎤 3-Minute Demo Script

* **[0:00 - 0:30] Introduction**: "Hello judges! Today, we introduce EcoTrack AI. We start on our glassmorphism landing page. Let's register a new user: Alex." *(Go to Register screen, log in)*.
* **[0:30 - 1:15] The Dashboard & Calculator**: "Now we're in. The Dashboard displays a Sustainability Score of 85, a 5-day streak, and carbon history. Let's record today's transport and energy usage." *(Go to Calculator, adjust sliders, click Save)*. "Instantly, our footprint is added, and our monthly target limit is dynamically evaluated."
* **[1:15 - 2:00] Daily Challenges & QR Verification**: "To reduce this score, let's complete today's challenges. I rode my bike today, so I scan the QR code." *(Click QR scanner icon, simulate Scan)*. "BOOM! Verified, and I earned +50 XP!"
* **[2:00 - 2:45] AI Coach & Community**: "Next, I ask our AI coach for tips." *(Type: 'How can I reduce transportation emissions?' and send)*. "The AI gives specific, personalized advice. I'll share this tip with our Community Feed to inspire others." *(Post to community feed)*.
* **[2:45 - 3:00] Conclusion & Roadmap**: "With EcoTrack AI, we turn carbon tracking from a chore into a rewarding daily ritual. Thank you!"

---

## 🗺️ Product Roadmap

- **Phase 1 (MVP)**: Interactive carbon calculator, gamified streaks, AI-coach simulation, community board, and local SVG dashboards. (Completed)
- **Phase 2 (Integrations)**: Real-time API linking with Smart Home meters (Nest, Ecobee) and transit trackers (Strava, Google Maps API).
- **Phase 3 (Enterprise)**: Corporate ESG Dashboard for company-wide sustainability challenges and eco-benefit payouts.
- **Phase 4 (Hardware)**: EcoTrack IoT smart buttons to register physical recycle events instantly.
=======
# EcoTrack-AI
arbon Footprint Awareness Platform
>>>>>>> 7935db22983aac38077a975a115e55a130831770
