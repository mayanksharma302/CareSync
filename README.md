# 🏥 CareSync | AI-Powered Healthcare Coordination

CareSync is a state-of-the-art, full-stack healthcare platform designed to bridge the gap between patients, doctors, and data. Built with a "Security-First" and "AI-Native" approach, it leverages the Google Cloud ecosystem to provide clinical-grade insights and seamless medical management.

## ✨ Key features
- **🤖 Clinical AI Assistant**: Powered by **Google Gemini 2.5 Flash**, providing context-aware analysis of patient vitals, medical history, and drug interactions.
- **📊 Live Analytics Dashboard**: Real-time tracking of patient intake, appointment ratios, and pending reports using MongoDB aggregation.
- **📅 Smart Calendar System**: A fully dynamic monthly scheduling grid with automated routing and conflict management.
- **🔐 Enterprise Security**: Secure session-based authentication using `jose` JWTs and encrypted credential hashing.
- **📱 Role-Based UX**: Tailored interfaces for Doctors and Patients with a premium, desktop-first SaaS aesthetic.

## 🛠️ Technical Stack
- **Frontend/Backend**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Intelligence**: [Google Generative AI (Gemini API)](https://ai.google.dev/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Deployment**: [Google Cloud Run](https://cloud.google.com/run) & [Docker](https://www.docker.com/)
- **Styling**: Vanilla CSS with modern Glassmorphism and CSS Variables.

## 🚀 Cloud Architecture
Deploying to production is automated via a multi-stage Docker build, optimized for **Google Cloud Run** to ensure high availability and sub-second cold starts. CareSync utilizes a standalone Node.js runtime for maximum efficiency.

---
*Developed for the Google Cloud & Hack2Skill Innovation Challenge.*
