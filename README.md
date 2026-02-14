# ⚡️ Drovic HQ — Zenith Community

![Project Banner](https://via.placeholder.com/1200x400/0a0a0a/ffffff?text=ZENITH+COMMUNITY+HQ)

> **"Where Chaos Meets Legacy."**
> 
> The official digital headquarters for the Drovic Community. A centralized hub for interactive stream archives, leaderboards, and community assets. Built with modern web technologies to deliver a cinematic and responsive user experience.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

[Live Demo](https://drovic-community.vercel.app) · [Report Bug](https://github.com/username/repo/issues) · [Request Feature](https://github.com/username/repo/issues)

</div>

---

## ✨ Key Features

This project isn't just a website; it's an interactive experience.

* **📸 Visual Archives (Gallery):** * Masonry grid layout for photos and videos.
    * **TikTok Embed Integration** for seamless playback.
    * Responsive modal previews with metadata details.
* **👥 Meet The Squad (Team):** * Interactive character-select style team page.
    * Dynamic background gradients and stats visualization.
    * Direct social media integration.
* **📦 Asset Center:** * Downloadable resources for the community (Overlays, Audio, etc.).
    * Categorized and sortable file management.
* **🎨 Zenith Aesthetic:** * Dark mode first design.
    * Glassmorphism, neon accents, and smooth **Framer Motion** animations.
    * Custom `Lenis` smooth scrolling.

## 🛠️ Tech Stack

Built with the bleeding edge of the React ecosystem:

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [HeroUI](https://heroui.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Database & Storage:** [Supabase](https://supabase.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

* Node.js (v18 or higher)
* npm / yarn / pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/drovic-community.git](https://github.com/your-username/drovic-community.git)
    cd drovic-community
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router
│   ├── assets/           # Assets Page
│   ├── gallery/          # Gallery Page
│   ├── team/             # Team Page
│   └── page.tsx          # Landing Page
├── public/               # Static assets
├── src/
│   └── lib/
│       └── supabase.ts   # Supabase Client Config
├── components/           # Reusable UI Components
└── ...

🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

    Fork the Project

    Create your Feature Branch (git checkout -b feature/AmazingFeature)

    Commit your Changes (git commit -m 'Add some AmazingFeature')

    Push to the Branch (git push origin feature/AmazingFeature)

    Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.

<div align="center">
<p>Built with ❤️ by the Drovic Dev Team</p>
</div>


### 💡 Pro Tips biar makin Ganteng:

1.  **Ganti Placeholder Banner:**
      * Di baris paling atas ada link `https://via.placeholder.com/...`.
      * Coba lu screenshot Halaman Depan website lu yang keren itu.
      * Simpen gambarnya di folder `public/banner.png`.
      * Ganti link tadi jadi `![Project Banner](/banner.png)` (atau upload ke GitHub issue biar dapet link online-nya).
2.  **Ganti URL:**
      * Cari `https://drovic-community.vercel.app` dan ganti sama link Vercel asli lu.
      * Ganti `your-username` sama username GitHub lu.

Langsung copas aja bro, dijamin repo lu langsung keliatan kayak project Open Source serius\! 🔥
