# 🌱 SynapseAid — Humanitarian Crisis Coordination & Multi-Agent Dispatch Simulation

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?logo=vercel&logoColor=white)](https://synapse-aid.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)

**SynapseAid** is an interactive, browser-based emergency operations command center and multi-agent dispatch simulation designed for disaster response scenarios (floods, structural collapses, and medical relief).

> 🌐 **Live Demo**: [https://synapse-aid.vercel.app](https://synapse-aid.vercel.app)

---

## 📌 Project Scope & Technical Implementation Transparency

To ensure complete interview defensibility and clarity regarding what is built from scratch vs. external/simulated:

| System Layer | Technical Implementation Details | Implementation Scope |
| :--- | :--- | :--- |
| **Gale-Shapley Matcher** | Stable-matching algorithmic solver prioritizing role affinities, distance matrices, certifications, and responder score ratings | **Implemented from scratch (TypeScript)** |
| **Dense + Sparse RAG Engine** | Client-side 24-D synthetic semantic vector projection + BM25 keyword tokenizer with rank fusion and XAI explainability chips | **Implemented from scratch (TypeScript)** |
| **Deterministic Audit Ledger** | Cryptographic SHA-256 block receipt generator creating immutable verification trails for disaster manifests | **Implemented from scratch (TypeScript)** |
| **GIS Tactical Map & Vectors** | Interactive relief map, dynamic incident bounding boxes, and transit vector rendering | **Implemented from scratch (Canvas / DOM)** |
| **Speech & NLU Processing** | Real-time speech-to-text distress capture and speech synthesis via Web Speech API (with optional Google Gemini API fallback) | **Browser API & Optional External LLM** |
| **Emergency Telemetry & Depletion** | Synthetic multi-agent response timings (~97ms latency models) and regional warehouse depletion rate simulations | **Deterministic Simulation Layer** |

> [!NOTE]
> **Zero Mandatory Cloud Dependencies**: The system executes 100% deterministically in the client browser out-of-the-box, with zero external database or paid API requirements.

---

## ⚡ System Architecture & Pipeline

```text
📡 Civilian Distress Signal (Voice SOS / NLP Report)
       │
       ▼
 🤖 NLP Entity Triage & Severity Classification (Critical / High / Medium / Low)
       │
       ▼
 📚 Hybrid Vector RAG Retrieval (24-D Dense Cosine + BM25 Sparse Overlap)
       │
       ▼
 🧠 Multi-Agent Coordination Mesh (Simulated)
       ├── 📦 Logistics & Route Router (Depot buffer allocation & transit vectors)
       ├── 👥 Gale-Shapley Matcher (Role affinity, proximity, mission rating)
       └── 🛡️ Audit Ledger (SHA-256 manifest block receipt hashing)
       │
       ▼
 🚨 Operations GIS Tactical Map & Mission Manifest PDF Export
```

---

## 🚀 Key Modules

### 1. 🎙️ Field Coordination Desk & Voice SOS
* **Web Speech API**: Real-time Speech-to-Text (STT) distress capture and Text-to-Speech (TTS) audio dispatch playback (English, Hindi, Spanish).
* **Simulation Scenarios**: One-click test scenarios for *Riverside Flood Inundation*, *Building Collapse*, and *Shelter Evacuation*.
* **Collapsible Layout**: Left coordination desk can be collapsed (`[◀ Hide Assistant]`) to expand the GIS studio to full screen.

### 2. 🗺️ Tactical Operations GIS Relief Map
* **Bounded Layout**: Clean separation between the interactive map canvas and the dedicated incident operations panel below.
* **Map Elements**:
  * District / sector boundaries (`Sector Alpha Industrial`, `Sector Bravo Riverbank`, `Sector Gamma Highland`, `Sector Delta Residential`).
  * Translucent flood inundation zone polygon styling.
  * Safe Shelters (🟢 with live capacity tracking).
  * Tactical Supply Depots (🔵 with VHF radio channels).
  * Field Responders (🟣 with deployment tracking).
  * Pulsing deployment route vectors and interactive map legend.

### 3. 🧠 Hybrid Vector RAG Protocol Studio
* **Dense + Sparse Rank Fusion**: Combines 24-D semantic projection with BM25 lexical overlap.
* **Explainable AI (XAI)**: *"Why this match?"* keyword tags (`✓ Flash flood`, `✓ Water purification`) highlight retrieval rationale.
* **Technical Breakdown**: Displays real-time **Semantic Cosine %**, **Keyword BM25 %**, and **Final Hybrid Score %**.
* **Protocol Inspector**: In-memory document chunker and full-text viewer for NDRF, FEMA, and WHO crisis manuals.

### 4. 👥 Gale-Shapley Volunteer Matching Engine
* **Stable Matchmaker Algorithm**: Matches field responders based on role priority, distance matrices, certifications, and past mission ratings.
* **Dynamic AI Match Scores**: Real-time progress bars (`⭐ 98% Match`, `⭐ 94% Match`) calculated against active incident requirements.

### 5. 📊 Telemetry & Resource Depletion Analytics Hub
* **Hourly Supply Burn Curve**: Area chart with `1H | 6H | 24H` time-range selector.
* **Sub-Agent Latency Waterfall**: Visualizes simulated pipeline execution latency across agents.
* **KPI Metrics**: Resource burn velocity (`431 units/hr`), priority incident ratio, and warehouse buffer allocations.

### 6. 📄 Cryptographic Manifest & Mission PDF Export
* Generates SHA-256 block receipts and exports printable, high-resolution mission PDF reports using `jspdf` and `html2canvas`.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS v4, Custom CSS Design System
* **Data Visualization**: Recharts, Canvas Confetti
* **Icons**: Lucide React
* **Document Generation**: jsPDF, html2canvas, DOMPurify
* **AI & NLP**: Client-side synthetic vector projection, BM25 tokenizer, optional Google Gemini API

---

## 📦 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/lakshiaharan/synapse-aid.git
cd synapse-aid

# Install dependencies
npm install

# (Optional) Configure Gemini API Key
cp .env.example .env
# Add your Gemini key in .env if desired: VITE_GEMINI_API_KEY=your_key_here

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment (Vercel)

This project is configured for one-click deployment on [Vercel](https://vercel.com):

1. Fork or push this repository to your GitHub account.
2. Import the project in Vercel.
3. Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. *(Optional)* Add `VITE_GEMINI_API_KEY` under **Environment Variables**.
5. Click **Deploy**.

---

## 📄 License
MIT License © 2026 Lakshi Haran. See [LICENSE](./LICENSE) for details.
