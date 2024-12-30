import { useState, useEffect } from 'react';
import { ShoppingCart, SortAsc, SortDesc, Pencil, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { ShoppingListSkeleton } from './ShoppingListSkeleton';
import { ConfirmationDialog } from '../common/ConfirmationDialog';

interface ShoppingItem {
  productId: string;
  name: string;
  quantity: number;
}

interface ShoppingList {
  id: string;
  created_at: string;
  user_id: string;
  items: ShoppingItem[];
  status: 'active' | 'completed';
}

interface EditingState {
  listId: string | null;
  items: ShoppingItem[];
}

interface DialogState {
  type: 'delete' | 'status' | null;
  listId: string | null;
  newStatus?: 'active' | 'completed';
}

export function ShoppingList() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState>({ listId: null, items: [] });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sort, setSort] = useState<'created_at' | 'status'>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [dialog, setDialog] = useState<DialogState>({ type: null, listId: null });

  useEffect(() => {
    fetchLists();
  }, [filter, sort, order]);

  const fetchLists = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      params.append('sort', sort);
      params.append('order', order);

      const response = await fetch(`/api/shopping-lists?${params}`, {
        headers: {
          'Authorization': `Bearer ${session?.session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch shopping lists');

      const data = await response.json();
      setLists(data);
    } catch (error) {
      toast.error('Failed to fetch shopping lists');
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (listId: string, newStatus: 'active' | 'completed') => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(`/api/shopping-lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update list status');

      toast.success('Status updated successfully');
      fetchLists();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this shopping list?')) {
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(`/api/shopping-lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete shopping list');

      toast.success('Shopping list deleted successfully');
      fetchLists();
    } catch (error) {
      toast.error('Failed to delete shopping list');
      console.error('Error deleting list:', error);
    }
  };

  const handleEditStart = (list: ShoppingList) => {
    setEditing({
      listId: list.id,
      items: [...list.items]
    });
  };

  const handleEditCancel = () => {
    setEditing({ listId: null, items: [] });
  };

  const handleItemQuantityChange = (index: number, newQuantity: number) => {
    setEditing(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    }));
  };

  const handleSaveItems = async (listId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(`/api/shopping-lists/${listId}/items`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: editing.items })
      });

      if (!response.ok) throw new Error('Failed to update items');

      toast.success('Items updated successfully');
      setEditing({ listId: null, items: [] });
      fetchLists();
    } catch (error) {
      toast.error('Failed to update items');
      console.error('Error updating items:', error);
    }
  };

  const handleDeleteClick = (listId: string) => {
    setDialog({ type: 'delete', listId });
  };

  const handleStatusClick = (listId: string, newStatus: 'active' | 'completed') => {
    setDialog({ type: 'status', listId, newStatus });
  };

  const handleConfirmDelete = async () => {
    if (!dialog.listId) return;
    await handleDelete(dialog.listId);
  };

  const handleConfirmStatus = async () => {
    if (!dialog.listId || !dialog.newStatus) return;
    await handleStatusChange(dialog.listId, dialog.newStatus);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Shopping Lists
          </h2>
          
          <div className="flex gap-4 opacity-50 pointer-events-none">
            <select 
              disabled 
              className="rounded border p-2"
              aria-label="Filter shopping lists"
              title="Filter lists by status"
            >
              <option>All Lists</option>
            </select>
            <div className="flex items-center gap-2 border rounded p-2">
              <select 
                disabled 
                className="border-none outline-none"
                aria-label="Sort shopping lists"
                title="Sort lists by field"
              >
                <option>Date</option>
              </select>
            </div>
          </div>
        </div>

        <ShoppingListSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2" />
          Shopping Lists
        </h2>
        
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded border p-2"
            aria-label="Filter shopping lists"
            title="Filter lists by status"
          >
            <option value="all">All Lists</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex items-center gap-2 border rounded p-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border-none outline-none"
              aria-label="Sort shopping lists"
              title="Sort lists by field"
            >
              <option value="created_at">Date</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
              title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
            >
              {order === 'asc' ? 
                <SortAsc className="w-4 h-4" /> : 
                <SortDesc className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>

      {lists.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No shopping lists yet. Start by taking a photo or uploading an image.
        </p>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {new Date(list.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {(editing.listId === list.id ? editing.items : list.items).map((item, index) => (
                      <li key={index} className="flex items-center">
                        {editing.listId === list.id ? (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value))}
                            aria-label={`Jumlah ${item.name}`}
                            className="w-16 px-2 py-1 border rounded mr-2"
                          />
                        ) : (
                          <span className="font-medium">{item.quantity}x</span>
                        )}
                        <span className="ml-2">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center space-x-2">
                  {editing.listId === list.id ? (
                    <>
                      <button
                        onClick={() => handleSaveItems(list.id)}
                        className="p-1 text-green-600 hover:text-green-700"
                        aria-label="Save changes"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-1 text-gray-600 hover:text-gray-700"
                        aria-label="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(list)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                        aria-label="Edit items"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <select
                        value={list.status}
                        onChange={(e) => handleStatusClick(list.id, e.target.value as 'active' | 'completed')}
                        className="rounded border p-2"
                        aria-label="Change list status"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => handleDeleteClick(list.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                        aria-label="Delete list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={dialog.type === 'delete'}
        onClose={() => setDialog({ type: null, listId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Shopping List"
        message="Are you sure you want to delete this shopping list? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationDialog
        isOpen={dialog.type === 'status'}
        onClose={() => setDialog({ type: null, listId: null })}
        onConfirm={handleConfirmStatus}
        title="Change Status"
        message={`Are you sure you want to change this list's status to ${dialog.newStatus === 'completed' ? 'completed' : 'active'}?`}
        confirmText="Change"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
} 