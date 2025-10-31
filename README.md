# Developer Vault - Secure Credential & Resource Manager

A full-stack React application built with TypeScript, Vite, and TailwindCSS for securely managing developer credentials and useful resources. Deployed on Netlify with MongoDB Atlas and serverless functions.

## 🚀 Features

### 🔐 Credentials Manager
- **Secure Storage**: Encrypt sensitive fields (passwords, API keys, 2FA codes) before storing in MongoDB
- **CRUD Operations**: Create, read, update, and delete credentials
- **Search & Filter**: Search credentials by platform name
- **Fields Supported**:
  - Platform Name
  - Username/Email
  - Password (encrypted)
  - API Key (encrypted)
  - 2FA Code (encrypted)
  - Notes

### 🌐 Resources Hub
- **Categorized Links**: Organize useful websites and tools by category
- **Dynamic Categories**: Add new categories on the fly
- **Quick Actions**: Edit, delete, and copy URL functionality
- **Fields Supported**:
  - Title
  - URL
  - Category
  - Description

### 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- AES encryption for sensitive data
- HttpOnly cookies for session management
- Protected API routes

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with dark mode support
- **React Router** for navigation
- **Context API** for state management
- **Lucide React** for icons

### Backend
- **Netlify Functions** (serverless)
- **MongoDB Atlas** (cloud database)
- **Mongoose** for schema modeling
- **JWT** for authentication
- **bcryptjs** for password hashing
- **crypto-js** for encryption

## 📁 Project Structure

```
developer-vault/
├── src/
│   ├── types/                 # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── credentials.ts
│   │   └── resources.ts
│   ├── components/            # React components
│   │   ├── Layout/           # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── UI/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── CredentialForm.tsx
│   │   ├── CredentialList.tsx
│   │   ├── ResourceForm.tsx
│   │   └── ResourceList.tsx
│   ├── contexts/             # React context for state management
│   │   └── AppContext.tsx
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Credentials.tsx
│   │   ├── Resources.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useLocalStorage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── netlify/
│   └── functions/            # Netlify serverless functions
│       ├── lib/              # Shared utilities
│       │   ├── mongo.ts      # MongoDB connection
│       │   ├── auth.ts       # Authentication utilities
│       │   └── encryption.ts # Encryption utilities
│       ├── auth/             # Authentication endpoints
│       │   ├── login.ts
│       │   ├── signup.ts
│       │   └── verify.ts
│       ├── credentials/      # Credentials CRUD operations
│       │   ├── create.ts
│       │   ├── read.ts
│       │   ├── update.ts
│       │   └── delete.ts
│       └── resources/        # Resources CRUD operations
│           ├── create.ts
│           ├── read.ts
│           ├── update.ts
│           └── delete.ts
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── netlify.toml
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB Atlas account
- Netlify account

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd developer-vault
npm install
```

2. **Install Netlify Functions dependencies:**
```bash
npm install mongodb bcryptjs jsonwebtoken crypto-js
npm install -D @types/bcryptjs @types/jsonwebtoken @types/crypto-js
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Fill in your environment variables in `.env`:
```env
VITE_APP_NAME=Developer Vault
MONGO_URI=your_mongodb_atlas_connection_string
DB_NAME=developer_vault
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key
```

### Development

1. **Start development server:**
```bash
netlify dev
```
This starts both the frontend and Netlify Functions.

2. **Or start frontend only:**
```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## 🌐 Deployment

### Netlify Deployment

1. **Connect your Git repository to Netlify**

2. **Set environment variables in Netlify dashboard:**
   - Go to Site settings > Environment variables
   - Add all variables from your `.env` file

3. **Deploy!**
   - Netlify will automatically deploy on git push

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB Atlas connection string | ✅ |
| `DB_NAME` | MongoDB database name | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `ENCRYPTION_KEY` | 32-character key for AES encryption | ✅ |
| `VITE_APP_NAME` | Application display name | ❌ |

## 🔧 Configuration

### MongoDB Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster
3. Get your connection string
4. Create a database named `developer_vault`

### Netlify Configuration

The `netlify.toml` file handles:
- Build command and output directory
- Function routing
- Redirect rules

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Credentials
- `GET /api/credentials/read` - Get user credentials
- `POST /api/credentials/create` - Create new credential
- `PUT /api/credentials/update` - Update credential
- `DELETE /api/credentials/delete` - Delete credential

### Resources
- `GET /api/resources/read` - Get user resources
- `POST /api/resources/create` - Create new resource
- `PUT /api/resources/update` - Update resource
- `DELETE /api/resources/delete` - Delete resource

## 🔒 Security Implementation

### Data Encryption
- Sensitive fields encrypted with AES-256 before storage
- Encryption key stored in environment variables
- Fields encrypted: passwords, API keys, 2FA codes

### Authentication
- JWT tokens with 7-day expiration
- Password hashing with bcrypt (12 rounds)
- Protected API routes with token verification

### Database Security
- MongoDB Atlas with IP whitelisting
- Principle of least privilege for database user
- Environment variables for sensitive data

## 🎨 UI/UX Features

- **Dark/Light Mode** - Toggleable theme
- **Responsive Design** - Mobile-friendly layout
- **Sidebar Navigation** - Easy app navigation
- **Search & Filter** - Find content quickly
- **Modal Forms** - Clean form interactions
- **Loading States** - Better user experience

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `netlify dev` - Start with Netlify Functions

## 🐛 Troubleshooting

### Common Issues

1. **Module export errors**
   - Ensure all TypeScript files have proper exports
   - Check import paths in components

2. **MongoDB connection issues**
   - Verify connection string format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Netlify Functions not working**
   - Check environment variables in Netlify dashboard
   - Verify function paths in `netlify.toml`
   - Check function logs in Netlify dashboard

4. **Build failures**
   - Clear `node_modules` and reinstall
   - Check TypeScript compilation errors
   - Verify all dependencies are installed

### Getting Help

1. Check the browser console for errors
2. Check Netlify function logs
3. Verify all environment variables are set
4. Ensure MongoDB is accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for fast development
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Netlify](https://netlify.com/) for hosting and serverless functions
- [MongoDB Atlas](https://mongodb.com/atlas) for database hosting
- [Lucide](https://lucide.dev/) for beautiful icons

---

**Developer Vault** - Keep your credentials and resources secure and organized! 🔐