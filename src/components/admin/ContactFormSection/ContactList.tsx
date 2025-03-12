import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Check, Trash2, Mail, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeleteModal from '../../common/DeleteModal';
import { apiEndpoint } from '../config/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const fetchContacts = async (isRetry = false) => {
    if (isRetry) {
      setIsRetrying(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (!user?.token) {
        setError('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiEndpoint.contact}/get-all  `, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch contact entries');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Error fetching contact entries');
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
      setIsRetrying(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      if (!user?.token) {
        setError('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiEndpoint.contact}/${id}/mark-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setContacts(contacts.map(contact =>
          contact._id === id ? { ...contact, isRead: true } : contact
        ));
        toast.success('Marked as read');
      } else {
        setError(data.message || 'Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      setError('Error updating message status');
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!user?.token || !selectedContact) {
      toast.error('Authentication required');
      navigate('/login');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${apiEndpoint.contact}/${selectedContact._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setContacts(contacts.filter(contact => contact._id !== selectedContact._id));
        toast.success('Contact entry deleted successfully');
        setShowDeleteModal(false);
        setSelectedContact(null);
      } else {
        toast.error(data.message || 'Failed to delete contact entry');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Error deleting contact entry');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchContacts(false);
  }, [user?.token, navigate]);

  const handleRetry = () => {
    fetchContacts(true);
  };

  if (loading && !isRetrying) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 animate-pulse w-16 h-7 rounded-full"></div>
            <h3 className="text-xl font-semibold">Contact Form Entries</h3>
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-3">
                  <div className="w-48 h-6 bg-gray-100 animate-pulse rounded"></div>
                  <div className="flex items-center mt-2">
                    <div className="w-4 h-4 bg-gray-100 animate-pulse rounded mr-2"></div>
                    <div className="w-32 h-4 bg-gray-100 animate-pulse rounded"></div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-4 h-4 bg-gray-100 animate-pulse rounded mr-2"></div>
                    <div className="w-24 h-4 bg-gray-100 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="w-32 h-4 bg-gray-100 animate-pulse rounded"></div>
              </div>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <div className="w-full h-16 bg-gray-100 animate-pulse rounded"></div>
              </div>
              <div className="flex justify-end space-x-4">
                <div className="w-24 h-8 bg-gray-100 animate-pulse rounded"></div>
                <div className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="bg-red-50 rounded-full p-6 mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Unable to Load Messages
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          {error}
        </p>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center px-6 py-3 bg-synergy-red text-white rounded-lg font-medium 
                   hover:bg-synergy-red/90 transition-colors duration-200 disabled:opacity-50"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </>
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={selectedContact?.name || ""}
        itemType="Contact Entry"
        title="Delete Contact Entry"
      />

      <div className="flex justify-between items-center mb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="bg-synergy-red/10 text-synergy-red px-3 py-1 rounded-full text-sm font-medium">
            {contacts.length} {contacts.length === 1 ? 'Message' : 'Messages'}
          </div>
          <h3 className="text-xl font-semibold">Contact Form Entries</h3>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gray-100 rounded-full p-8 mb-6">
            <Mail className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Messages Yet
          </h3>
          <p className="text-gray-500 text-center">
            When you receive contact form submissions, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className={`bg-white rounded-lg shadow-md p-6 ${!contact.isRead ? 'border-l-4 border-synergy-red' : 'border border-gray-200'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{contact.name}</h3>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${contact.email}`} className="hover:text-synergy-red">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${contact.phone}`} className="hover:text-synergy-red">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>

              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              </div>

              <div className="flex justify-end space-x-4">
                {!contact.isRead && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMarkAsRead(contact._id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Read
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteClick(contact)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList; 