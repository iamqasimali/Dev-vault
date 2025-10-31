import { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  timestamp: string;
}

export function HelloWorld() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const fetchData = async (userName?: string) => {
    setLoading(true);
    try {
      const url = userName 
        ? `/api/hello-world?name=${encodeURIComponent(userName)}`
        : '/api/hello-world';
      
      const response = await fetch(url);
      const result: ApiResponse = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(name);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Netlify Functions + React
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Greet'}
          </button>
        </div>
      </form>

      {data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">{data.message}</p>
          <p className="text-green-600 text-sm mt-1">
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}