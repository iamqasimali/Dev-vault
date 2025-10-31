import React from 'react';
import { Link } from 'react-router-dom';
import { Key, Link2, Shield, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Dashboard: React.FC = () => {
  const { state } = useApp();

  const stats = [
    {
      name: 'Total Credentials',
      value: state.credentials.length,
      icon: Key,
      color: 'bg-blue-500',
      href: '/credentials'
    },
    {
      name: 'Total Resources',
      value: state.resources.length,
      icon: Link2,
      color: 'bg-green-500',
      href: '/resources'
    },
    {
      name: 'Categories',
      value: new Set(state.resources.map(r => r.category)).size,
      icon: Shield,
      color: 'bg-purple-500',
      href: '/resources'
    },
  ];

  const recentCredentials = state.credentials.slice(0, 5);
  const recentResources = state.resources.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {state.user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your credentials and resources securely from one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Credentials */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Credentials
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentCredentials.length > 0 ? (
              recentCredentials.map((credential) => (
                <div key={credential._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {credential.platformName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {credential.usernameOrEmail}
                      </p>
                    </div>
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No credentials yet. Add your first credential to get started.
                </p>
                <Link
                  to="/credentials"
                  className="inline-block mt-4 btn-primary"
                >
                  Add Credential
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Resources
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentResources.length > 0 ? (
              recentResources.map((resource) => (
                <div key={resource._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {resource.category}
                      </p>
                    </div>
                    <Link2 className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No resources yet. Add your first resource to get started.
                </p>
                <Link
                  to="/resources"
                  className="inline-block mt-4 btn-primary"
                >
                  Add Resource
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};