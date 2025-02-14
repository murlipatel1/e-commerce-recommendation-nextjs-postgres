# E-Commerce Recommendation System Frontend

This is the frontend part of the E-Commerce Recommendation System, built with Next.js, React, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/e-commerce-recommendation-system.git
cd e-commerce-recommendation-system/frontend
```

2. Install dependencies:

```bash
npm install
```

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Project Structure

```
/app
  /auth
    /login
      page.tsx
    /register
      page.tsx
  /shop
    /products
      /[id]
        page.tsx
      /new
        page.tsx
      page.tsx
  /orders
    page.tsx
  /recommendations
    page.tsx
  layout.tsx
  page.tsx
/components
  AuthForm.tsx
  CartModal.tsx
  Navbar.tsx
  OrderList.tsx
  ProductCard.tsx
  RecommendationCard.tsx
/contexts
  AuthContext.tsx
/lib
  api.ts
  auth.ts
/styles
  globals.css
/types
  index.ts
/utils
  helpers.ts
next.config.js
tsconfig.json
package.json
README.md
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.