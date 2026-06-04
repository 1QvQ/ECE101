# ECE101 — Early Childhood Education Assistant

ECE101 is a comprehensive, AI-powered monorepo application designed to streamline administration, daily planning, and compliance workflows for Early Childhood Education (ECE) professionals. The platform helps educators reduce search time, access curriculum guidance, plan classroom activities, reference center policies, and share educational knowledge.

---

## 🚀 Key Features

1. **Activity & Lesson Planner**
   * **Daily Activity Prompts**: Get automated ideas for sensory, outdoor, and craft activities tailored to different age groups.
   * **Festival Recipe & Craft Ideas**: Proactive notifications for upcoming holidays (e.g., Easter, Christmas, Matariki) to ensure early preparation of materials and recipes.
   * **Material Alerts**: Get heads-up notices so you can source necessary craft components in advance.

2. **MoE Document Search & Summarizer (RAG)**
   * **Semantic Search**: Direct retrieval of guidelines from Ministry of Education (MoE) publications (e.g., *Te Whāriki*) and workshop documentation.
   * **Smart Summaries**: AI-driven summarization of lengthy regulatory guidelines and curriculum updates.
   * **Source Linking**: Direct links to jump to original online documents or source webpages.

3. **Personal Knowledge Base (Wiki)**
   * **Secure Accounts**: Complete user registration and login flows.
   * **Knowledge Repositories**: Store, categorize, and tag personal teaching methods, lesson logs, and notes.
   * **Resource Sharing**: Share articles and notes with other educators in your school community.

4. **Center Policy Lookup**
   * **Digital Policy Directory**: Ditch paper files for instant lookup of center-specific policies (Health & Safety, Safeguarding, Emergency Evacuations).
   * **Conversational Querying**: Ask natural questions like *"What is our policy on child sunburn prevention?"* for rapid answers.

5. **Daily Mat Time Hub**
   * **Circle Time Prompts**: Daily inspiration for mat-time topics, transition games, interactive stories, and circle songs.
   * **How-to Guides**: Detailed step-by-step guides for executing group lessons.

6. **Special Needs Care Guide (SEN)**
   * **Inclusive Practices**: Expert guidance on interacting with children with diverse educational, behavioural, or sensory needs.
   * **Support Strategies**: Adaptive teaching methods, calming techniques, and communication structures.

---

## 🏗️ Technical Architecture & Stack

ECE101 is structured as a pnpm monorepo consisting of the following key technologies:

```mermaid
graph TD
    subgraph Client Application
        FE[React + TypeScript] -->|Tailwind CSS v4| UI[User Interface]
    end

    subgraph API Application
        BE[Node.js + NestJS]
        ORM[Prisma ORM]
        BE --> ORM
        ORM --> DB[(PostgreSQL + Supabase Vector)]
    end

    subgraph AI & Vector Search
        LC[LangChain.js]
        OR[OpenRouter API]
        BE --> LC
        LC --> OR
    end

    subgraph Infrastructure
        Docker[Docker Containers]
        Azure[Azure Services]
        GHA[GitHub Actions CI/CD]
    end
```

### Tech Stack Details:
* **Frontend**: React, TypeScript, Tailwind CSS, Axios, React Router.
* **Backend**: Node.js, NestJS, Prisma ORM.
* **Database**: PostgreSQL with `pgvector` compatibility (Supabase Vector).
* **AI & RAG**: LangChain.js, OpenRouter API (leveraging state-of-the-art LLMs).
* **DevOps**: Docker, Azure, GitHub Actions (for automated CI/CD deployment pipelines).

---

## 📁 Repository Directory Structure

| Directory | Purpose |
| :--- | :--- |
| apps/frontend | React frontend SPA built with Vite. Contains login, dashboard, activity planner, search, and knowledge base views. |
| apps/backend | NestJS application hosting REST controllers, database services, and LangChain search integrations. |
| apps/backend/prisma | Prisma ORM configurations and database schemas (schema.prisma). |
| packages/shared | Shared TypeScript typings and schemas shared across frontend and backend applications. |
| packages/tsconfig | Centralized TypeScript specifications (base.json). |
| docker-compose.yml | Docker services descriptor defining local database services (PostgreSQL with `pgvector` support). |

---

## 🛠️ Setup and Installation

### 1. Prerequisites
Ensure you have the following installed locally:
* **Node.js** (v20+ recommended)
* **pnpm** (v9+)
* **Docker Desktop**

### 2. Launch Local Database
To spin up the PostgreSQL database container configured with the vector extension:
```bash
docker-compose up -d
```
*Note: The local database is mapped to port `5433` (external) in your `docker-compose.yml` file.*

### 3. Install Dependencies
Run the command below in the root folder to download package dependencies across all workspaces:
```bash
pnpm install
```

### 4. Configure Environment Variables
Create a `.env` file inside `apps/backend/.env` and populate the values below:
```env
# Database configuration
DATABASE_URL="postgresql://ece_admin:ece_secure_password123@localhost:5433/ece_assistant_prod?schema=public"

# AI and OpenRouter Settings
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_MODEL="google/gemini-2.5-flash" # Or another preferred model
```

### 5. Run Database Migrations
Deploy schema configurations to the active database instance:
```bash
cd apps/backend
pnpm prisma db push
```

### 6. Start the Development Servers
From the root directory, start the development applications concurrently:
```bash
# Start frontend client (Vite on http://localhost:5173)
pnpm dev:frontend

# Start NestJS REST API (on http://localhost:3000)
pnpm dev:backend
```

---

## ⚙️ CI/CD & Deployment

* **Continuous Integration**: Managed via GitHub Actions, running linters, tests, and builds on push and pull requests to `main`.
* **Deployment Platform**: Deployed to Azure App Services using Docker images built and pushed to a container registry.
