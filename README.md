# philipc

A modern ecommerce application built with React 19, TypeScript, Vite, Tailwind CSS, Express.js, and Supabase.

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) v18+
-   [Git](https://git-scm.com/)

## 📁 Project Structure

```
philipc/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page 
│   ├── .env               # Environment variables (YOU CREATE THIS)
│   ├── .env.example       # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                # Express backend API
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── controllers/       # Business logic
│   ├── .env              # Server environment variables (YOU CREATE THIS)
│   ├── .env.example      # Environment template
│   ├── server.js         # Server entry point
│   └── package.json
│
├─ db/                  # Database files
│  ├─ schema.sql        # Table definitions & RLS
│  ├─ migrations/       # Schema changes
│  └─ seeds/
|
└── README.md             # This file
```

## 🔧 Step-by-Step Setup Guide

### Step 1: Fork & Clone the Repository

1. Click the **Fork** button at the top right of this repository
2. Clone your forked repository to your local machine:

```bash
git clone https://github.com/Xenrui/philipc.git
cd philiPC
```

### Step 2: Install Project Dependencies

Open your terminal in the project root directory and run:

#### Install Client Dependencies

```bash
cd client
npm install
```

Wait for installation to complete, then:

#### Install Server Dependencies

```bash
cd ../server
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### 3.1 Setup Client Environment Variables

1. Navigate to the `client` folder
2. You'll see a file named `.env.example`
3. Copy it to create your actual `.env` file:

**Windows (CMD):**

```bash
cd client
copy .env.example .env
```

**Windows (PowerShell):**

```bash
cd client
Copy-Item .env.example .env
```

4. Open `client/.env` in your editor and replace the values:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ask the Supabase project owner for these values:**

5. Save the file

#### 3.2 Setup Server Environment Variables

1. Navigate to the `server` folder
2. Copy the `.env.example` file:

**Windows (CMD):**

```bash
cd ..\server
copy .env.example .env
```

**Windows (PowerShell):**

```bash
cd ../server
Copy-Item .env.example .env
```

3. Open `server/.env` in your editor and replace the values:

```env
PORT=5000
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

**Ask the Supabase project owner for these values:**

-   `PORT`: Leave as `5000` (or change if needed)
-   `NODE_ENV`: Leave as `development`

4. Save the file

> ⚠️ **IMPORTANT SECURITY NOTES:**
>
> -   **NEVER** commit `.env` files to Git (they're already in `.gitignore`)
> -   **NEVER** share your `service_role` key publicly - it has admin access!
> -   The `anon/public` key is safe to use in client-side code
> -   The `service_role` key should ONLY be used in server-side code

### Step 4: Run the Application

You'll need **two terminal windows**.

#### Terminal 1 - Start the Backend Server

```bash
cd server
npm run dev
```

You should see:

```
[nodemon] starting `node server.js`
Server running on http://localhost:5000
```

**Keep this terminal running!**

#### Terminal 2 - Start the Frontend Client

Open a **new terminal** window and run:

```bash
cd client
npm run dev
```

You should see:

```
  VITE v7.1.7  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open the Application

Open your browser and go to:

```
http://localhost:5173
```

## 🔐 Environment Variables Reference

### Client (`client/.env`)

| Variable                 | Description                   | Example                   | Required |
| ------------------------ | ----------------------------- | ------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL     | `https://xxx.supabase.co` | ✅ Yes   |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...`              | ✅ Yes   |

### Server (`server/.env`)

| Variable               | Description                              | Example                   | Required |
| ---------------------- | ---------------------------------------- | ------------------------- | -------- |
| `PORT`                 | Server port number                       | `5000`                    | ✅ Yes   |
| `SUPABASE_URL`         | Your Supabase project URL                | `https://xxx.supabase.co` | ✅ Yes   |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (keep secret!) | `eyJhbGc...`              | ✅ Yes   |
| `NODE_ENV`             | Environment mode                         | `development`             | ✅ Yes   |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following our commit convention (see below)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Git Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and structured commit messages.

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

-   **feat**: A new feature
    -   `feat(auth): add user login functionality`
    -   `feat(cart): implement add to cart feature`
-   **fix**: A bug fix
    -   `fix(checkout): resolve payment processing error`
    -   `fix(products): correct price display formatting`
-   **docs**: Documentation only changes
    -   `docs(readme): update installation instructions`
    -   `docs(api): add endpoint documentation`
-   **style**: Changes that don't affect code meaning (formatting, missing semi-colons, etc.)
    -   `style(client): format code with prettier`
    -   `style(components): fix indentation`
-   **refactor**: Code change that neither fixes a bug nor adds a feature
    -   `refactor(api): simplify product service logic`
    -   `refactor(hooks): extract custom hook for cart`
-   **perf**: Performance improvements
    -   `perf(products): optimize product list rendering`
    -   `perf(api): add database query caching`
-   **test**: Adding or correcting tests
    -   `test(auth): add unit tests for login`
    -   `test(cart): add integration tests`
-   **build**: Changes to build system or dependencies
    -   `build(deps): upgrade react to v19`
    -   `build(client): update vite config`
-   **ci**: Changes to CI configuration files and scripts
    -   `ci(github): add deployment workflow`
    -   `ci(vercel): update build settings`
-   **chore**: Other changes that don't modify src or test files
    -   `chore(git): update .gitignore`
    -   `chore(deps): update dependencies`

#### Examples

```bash
# Simple feature addition
git commit -m "feat(products): add product search functionality"

# Bug fix with details
git commit -m "fix(cart): prevent duplicate items in cart

# Documentation update
git commit -m "docs(readme): add git commit convention section"
```

#### Best Practices

1. **Use imperative mood** in the subject line (e.g., "add" not "added" or "adds")
2. **Don't capitalize** the first letter of the subject
3. **No period** at the end of the subject line
4. **Limit subject line** to 50-72 characters

## 📚 Additional Resources

-   [Supabase Documentation](https://supabase.com/docs)
-   [React Documentation](https://react.dev)
-   [Vite Documentation](https://vite.dev)
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs)
-   [TypeScript Documentation](https://www.typescriptlang.org/docs)
-   [Conventional Commits](https://www.conventionalcommits.org/)

## 📝 License

This project is licensed under the MIT License.
