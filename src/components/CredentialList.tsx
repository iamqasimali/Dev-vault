import React, { useState, useMemo } from 'react';
import { Credential } from '../types/credentials';
import { Edit2, Trash2, Search, Key, Mail } from 'lucide-react';

interface CredentialListProps {
  credentials: Credential[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const CredentialList: React.FC<CredentialListProps> = ({
  credentials,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCredentials = useMemo(() => {
    return credentials.filter(credential =>
      credential.platformName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.usernameOrEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [credentials, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map((credential) => (
          <div
            key={credential._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                  <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {credential.platformName}
                </h3>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(credential)}
                  className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => credential._id && onDelete(credential._id)}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{credential.usernameOrEmail}</span>
              </div>

              {credential.notes && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {credential.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>
                  Updated {new Date(credential.updatedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  {credential.password && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Password
                    </span>
                  )}
                  {credential.apiKey && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      API Key
                    </span>
                  )}
                  {credential.twoFACode && (
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                      2FA
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Key className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {credentials.length === 0 ? 'No credentials yet' : 'No matching credentials'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {credentials.length === 0 
              ? "Get started by adding your first credential."
              : "Try adjusting your search criteria."}
          </p>
        </div>
      )}
    </div>
  );
};