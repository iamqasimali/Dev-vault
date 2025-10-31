import { HelloWorld } from './components/HelloWorld';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Your Netlify App
          </h1>
          <p className="text-gray-600">
            React + Vite + TailwindCSS + Netlify Functions
          </p>
        </header>
        
        <HelloWorld />
        
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Features Included:
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>⚡ Vite for fast development</li>
            <li>🎨 TailwindCSS for styling</li>
            <li>🔧 TypeScript for type safety</li>
            <li>☁️ Netlify Functions for serverless APIs</li>
            <li>📱 Fully responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;