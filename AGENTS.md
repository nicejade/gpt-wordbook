# GPT Wordbook - AI-Powered Deep English Vocabular

## Project Overview

**GPT Wordbook** is a static documentation website built with Astro + Starlight, serving as an AI-powered English vocabulary learning platform. It contains **8000+ core English words** with deep analysis including definitions, etymology, cultural context, and memory techniques.

**Primary Purpose**: Provide a high-performance, SEO-friendly, static site for English learners to systematically build vocabulary knowledge through AI-generated content.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.1 - Static site generator
- **Theme**: [Starlight](https://starlight.astro.build/) - Official Astro documentation theme
- **Interactive Components**: [Svelte](https://svelte.dev/) - Lightweight reactive framework
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- **Content Format**: MDX (Markdown + JSX)
- **Package Manager**: pnpm (preferred), npm, or yarn
- **Node Version**: >= 16.0.0

## Project Structure

```
gpt-wordbook/
├── public/                  # Static assets (favicon, images)
├── src/
│   ├── assets/              # Project resources
│   ├── configs/             # Configuration files
│   ├── content/
│   │   ├── docs/            # MDX/MD content files
│   │   │   ├── index.mdx    # Homepage
│   │   │   ├── about.mdx    # About page
│   │   │   └── words/       # Word entries (8000+ MDX files)
│   │   └── config.ts        # Content collection schema
│   └── env.d.ts             # TypeScript definitions
├── scripts/
│   └── gptwords.json        # Source vocabulary data
├── astro.config.mjs         # Astro configuration
├── generate-sidebar.js      # Sidebar generation script
├── tailwind.config.mjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Development Workflow

### Setup & Running

```bash
# Install dependencies
pnpm install

# Start dev server (runs on http://localhost:6969)
pnpm start

# Build for production (outputs to dist/)
pnpm build

# Preview production build
pnpm preview
```

### Key Commands

- `pnpm start` - Start development server
- `pnpm build` - Build static site
- `pnpm preview` - Preview production build locally

## TypeScript Best Practices

1. **Type Safety**: Always define explicit types for function parameters and return values
2. **Strict Mode**: Project uses strict TypeScript configuration
3. **Type Imports**: Use `import type` for type-only imports to optimize bundle size
4. **No Any**: Avoid `any` type; use `unknown` or proper types
5. **Const Assertions**: Use `as const` for literal types when appropriate

## Content Management

### Word Entry Format

Word entries are located in `src/content/docs/words/` as MDX files. Each file follows a consistent structure with:
- Word definition and pronunciation
- Etymology and word roots
- Example sentences
- Memory techniques
- Related words

### Adding New Content

1. Create MDX file in appropriate directory under `src/content/docs/`
2. Follow existing file naming conventions (lowercase, hyphen-separated)
3. Ensure frontmatter metadata is complete
4. Run `node generate-sidebar.js` if sidebar structure needs updating

## Important Conventions

1. **Component Style**: Use functional components with TypeScript
2. **File Naming**: 
   - Components: PascalCase (e.g., `WordCard.astro`)
   - Utilities: camelCase (e.g., `formatWord.ts`)
   - Content: kebab-case (e.g., `word-entry.mdx`)
3. **Imports**: Group and order imports (types, external deps, internal modules)
4. **Astro Components**: Prefer `.astro` for static content, `.svelte` for interactivity

## Code Quality

- **Linting**: Code formatting is handled by Prettier (see `.prettierrc`)
- **Before Committing**: Ensure code builds successfully with `pnpm build`
- **Testing Changes**: Always test in dev mode and preview production build

## Additional Resources

When working on specific tasks, consult these files for detailed context:
- `astro.config.mjs` - Full Astro and Starlight configuration
- `src/content/config.ts` - Content collection schemas
- `generate-sidebar.js` - Sidebar generation logic
- `package.json` - Available scripts and dependencies

## Deployment

This is a static site designed for deployment to:
- Vercel (recommended, zero-config)
- Cloudflare Pages
- GitHub Pages
- Netlify

Build output in `dist/` directory is production-ready static files.

---

**Note**: This guide provides universal context for AI agents. For task-specific instructions, agents should read relevant configuration files or ask for clarification rather than making assumptions.

