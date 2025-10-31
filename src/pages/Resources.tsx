import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ResourceForm } from '../components/ResourceForm';
import { ResourceList } from '../components/ResourceList';
import { Modal } from '../components/UI/Modal';
import { useApp } from '../contexts/AppContext';
import { Resource, CreateResourceRequest } from '../types/resources';

export const Resources: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/resources/read', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const resources = await response.json();
        dispatch({ type: 'SET_RESOURCES', payload: resources });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (data: CreateResourceRequest) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/resources/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newResource = await response.json();
        dispatch({ type: 'ADD_RESOURCE', payload: newResource });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleUpdateResource = async (data: CreateResourceRequest) => {
    if (!editingResource?._id) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/resources/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, _id: editingResource._id }),
      });

      if (response.ok) {
        const updatedResource = await response.json();
        dispatch({ type: 'UPDATE_RESOURCE', payload: updatedResource });
        setIsModalOpen(false);
        setEditingResource(null);
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/resources/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id }),
      });

      if (response.ok) {
        dispatch({ type: 'DELETE_RESOURCE', payload: id });
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = editingResource ? handleUpdateResource : handleCreateResource;
  const formInitialData = editingResource ? {
    title: editingResource.title,
    url: editingResource.url,
    category: editingResource.category,
    description: editingResource.description,
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your useful links and resources
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingResource(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="h-5 w-5" />
          Add Resource
        </button>
      </div>

      <ResourceList
        resources={state.resources}
        onEdit={handleEditResource}
        onDelete={handleDeleteResource}
        onAdd={() => setIsModalOpen(true)}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResource(null);
        }}
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}
      >
        <ResourceForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingResource(null);
          }}
          initialData={formInitialData}
          loading={loading}
        />
      </Modal>
    </div>
  );
};