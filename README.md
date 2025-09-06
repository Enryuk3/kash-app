# Kash App

[![Nuxt](https://img.shields.io/badge/Nuxt-18181B?style=flat&logo=nuxt&logoColor=00DC82)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-18181B?style=flat&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-18181B?style=flat&logo=tailwindcss&logoColor=38B2AC)](https://tailwindcss.com/)



_Kash is a financial management app, with transaction tracking, goal setting, and categorization of expenses._
## Features

- Transaction management
- Financial goal tracking
- Categorization of expenses
- Secure authentication
- Responsive design
- Optimized performance

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm (recommended) or npm/yarn
- PostgreSQL (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kash-app.git
   cd kash-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```


## Acknowledgments

- Built with [Nuxt 4](https://nuxt.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Iconify](https://iconify.design/)
