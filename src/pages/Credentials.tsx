import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CredentialForm } from '../components/CredentialForm';
import { CredentialList } from '../components/CredentialList';
import { Modal } from '../components/UI/Modal';
import { useApp } from '../contexts/AppContext';
import { Credential, CreateCredentialRequest } from '../types/credentials';

export const Credentials: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/credentials/read', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const credentials = await response.json();
        dispatch({ type: 'SET_CREDENTIALS', payload: credentials });
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCredential = async (data: CreateCredentialRequest) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/credentials/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newCredential = await response.json();
        dispatch({ type: 'ADD_CREDENTIAL', payload: newCredential });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCredential = (credential: Credential) => {
    setEditingCredential(credential);
    setIsModalOpen(true);
  };

  const handleUpdateCredential = async (data: CreateCredentialRequest) => {
    if (!editingCredential?._id) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/credentials/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, _id: editingCredential._id }),
      });

      if (response.ok) {
        const updatedCredential = await response.json();
        dispatch({ type: 'UPDATE_CREDENTIAL', payload: updatedCredential });
        setIsModalOpen(false);
        setEditingCredential(null);
      }
    } catch (error) {
      console.error('Error updating credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/.netlify/functions/credentials/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id }),
      });

      if (response.ok) {
        dispatch({ type: 'DELETE_CREDENTIAL', payload: id });
      }
    } catch (error) {
      console.error('Error deleting credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = editingCredential ? handleUpdateCredential : handleCreateCredential;
  const formInitialData = editingCredential ? {
    platformName: editingCredential.platformName,
    usernameOrEmail: editingCredential.usernameOrEmail,
    password: '', // Don't pre-fill password for security
    apiKey: '',   // Don't pre-fill API key for security
    twoFACode: editingCredential.twoFACode,
    notes: editingCredential.notes,
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Credentials
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your platform credentials securely
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingCredential(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="h-5 w-5" />
          Add Credential
        </button>
      </div>

      <CredentialList
        credentials={state.credentials}
        onEdit={handleEditCredential}
        onDelete={handleDeleteCredential}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCredential(null);
        }}
        title={editingCredential ? 'Edit Credential' : 'Add New Credential'}
      >
        <CredentialForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCredential(null);
          }}
          initialData={formInitialData}
          loading={loading}
        />
      </Modal>
    </div>
  );
};