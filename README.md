# CareerPilot AI

The official frontend repository for **CareerPilot AI**, an AI-powered agentic career guidance and resume optimization platform. The frontend is built on **Next.js** (App Router) and provides modern, responsive UIs, smooth entrance animations, real-time resume scorecards, interactive career recommendations, public resource directories, and secure authentication flows.

---

## Live Demo
- **Frontend App**: `https://careerpilot-ai-delta-sage.vercel.app`
- **Backend API**: `https://careerpilot-ai-server.onrender.com`
- **Health Check**: `https://careerpilot-ai-server.onrender.com/api/health`

---


## Key Features

1. **AI Resume Intelligence**:
   - Pasted Text Audit: Submits raw text to detect missing industry keywords.
   - File Upload: Supports PDF and image file uploads (JPEG, PNG, WEBP) capped at 5 MB.
   - URL Analysis: Downloads and parses resumes hosted on remote URLs.
   - UI Indicators: Displays dial progress bars, ATS layout checklists, soft/hard skill audits, and recommended role lists.

2. **Personalized Career Pathways**:
   - Asks for skills, experience, education, targets, and interests.
   - Invokes backend recommendation engines to display suitable job roles, skills to learn, project suggestions, and structured roadmap milestones.
   - Refines recommendation results dynamically with inline chat feedback.

3. **Explore Careers**:
   - Open career directory mapping to backend MongoDB resources.
   - Debounced search queries, experience level filters (Junior, Mid, Senior), category selectors, pagination, and sorting.

4. **Self-Service Resource CRUD**:
   - Secure forms to add new career resources, manage created items, and edit them.
   - Enforces ownership guards (only the creator of a resource can edit or delete it).

5. **Authentication & Session Persistence**:
   - Better Auth integration supporting normal credentials, **Google OAuth**, and single-click **Demo Login** (which registers a demo account on the fly if it does not exist, then logs the user in).
   - Dynamic Navbar states and protected route guards.

---

## How It Works

1. **Explore**: Visitors explore the public `/careers` list and check career details `/careers/[id]` immediately.
2. **Authenticate**: Users sign in or register at `/login` or `/register` (or trigger Demo Login/Google Login).
3. **Analyze Resume**: Users head to `/dashboard/resume-analyzer` to paste text, drag-and-drop a PDF/image resume, or input a URL to receive an instantaneous compliance audit.
4. **Get Path Guidance**: Users navigate to `/dashboard/career-recommendations` (optionally pre-filled with resume contexts) to generate tailored roadmaps.
5. **Add Resources**: Authored users add and manage new career listings from `/items/manage`.

---

## AI Career Recommendation Integration

The frontend communicates with the backend career recommendation endpoint `/api/career/recommend` by sending the following parameters:
- **`skills`**: Array of user skills.
- **`experience`**: String detailing professional experience.
- **`education`**: String detailing academic credentials.
- **`careerGoal`**: String outlining target roles.
- **`interests`**: Array of professional interests.
- **`resumeAnalysisId`**: (Optional) Reference to pre-fill context from a previous resume audit.

The backend recommendation response is parsed and displayed under the following panels:
- **`recommendedCareerPaths`**: Details titles and reasoning for paths.
- **`suitableJobRoles`**: Target roles.
- **`skillsToLearn`**: New skills required.
- **`projectSuggestions`**: Project outlines with specific tech stacks.
- **`careerRoadmap`**: Milestone steps with concrete timelines.

---

## Pages and Routes

### Public Routes
- **`/`**: Landing page with hero call-to-actions, features overview, candidate expectations, and FAQ.
- **`/careers`**: Explore careers directory.
- **`/careers/[id]`**: Detail view for specific career paths.
- **`/about`**: Mission statement and platform details.
- **`/contact`**: Support contact form.
- **`/faq`**: Help center index.
- **`/login`**: Better Auth login page (supports credential sign-in, google sign-in, and demo sign-in).
- **`/register`**: Better Auth registration page.

### Protected Routes (Authentication Required)
- **`/dashboard`**: Dashboard homepage showing recent user activity.
- **`/dashboard/resume-analyzer`**: Upload and analyze resume documents.
- **`/dashboard/career-recommendations`**: Submit career profiles and get milestone roadmaps.
- **`/profile`**: View user profile settings.
- **`/items/add`**: Add new career resource path.
- **`/items/manage`**: Manage/delete user-created resources.
- **`/items/edit/[id]`**: Modify resource path details.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js (v16.2.10 - App Router) |
| **Language** | TypeScript (v5) |
| **UI Library** | React (v19) |
| **Styling** | Tailwind CSS (v4) |
| **Animations** | Custom CSS Animations (Geist variables fallback) |
| **Authentication** | Better Auth Client (`better-auth` v1.6) |
| **Data Fetching** | Fetch API (with credentials included) |
| **Deployment** | Vercel |

---

## Project Architecture

```text
Next.js App Router
├── Pages / Routes (src/app/)
│   ├── layout.tsx         # Global layouts & Geist typography definitions
│   ├── page.tsx           # Static and Dynamic route pages
│   └── globals.css        # Global CSS, Tailwind configurations, and animations
├── Reusable Components (src/components/)
│   ├── Navbar.tsx         # Sticky navigation with dynamic authentication states
│   └── Footer.tsx         # Centered brand copyright layout
└── API Services (src/lib/)
    ├── auth-client.ts     # Better Auth frontend client configuration
    └── config.ts          # Dynamic API_BASE_URL resolution
```

---

## Folder Structure

```text
careerpilot-ai/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── careers/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── career-recommendations/
│   │   │   │   └── page.tsx
│   │   │   ├── resume-analyzer/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── items/
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   ├── edit/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── manage/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── icon.png
│   │   ├── layout-wrapper.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── lib/
│       ├── auth-client.ts
│       └── config.ts
├── public/
│   └── careerpilot-logo.png
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

## Environment Variables Configuration

To run the frontend locally, create a `.env.local` file in the root directory:

```properties
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production deployment on **Vercel**, add the variable in the Project Settings:
- **`NEXT_PUBLIC_API_URL`**: `https://careerpilot-ai-server.onrender.com`
