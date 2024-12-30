import express from 'express';
import { corsHeaders } from '../_shared/cors';
import { supabaseAdmin } from '../_shared/supabase';

const router = express.Router();

// Type untuk error handling
interface SupabaseError {
  message: string;
}

// Helper function untuk type checking
function isSupabaseError(error: unknown): error is SupabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as SupabaseError).message === 'string'
  );
}

// Get shopping lists
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { status, sort = 'created_at', order = 'desc' } = req.query;

    let query = supabaseAdmin
      .from('shopping_lists')
      .select('*')
      .eq('user_id', user.id);

    // Filter by status if provided
    if (status && ['active', 'completed'].includes(status as string)) {
      query = query.eq('status', status);
    }

    // Apply sorting
    query = query.order(sort as string, { ascending: order === 'asc' });

    const { data: shoppingLists, error } = await query;

    if (error) throw error;

    res.json(shoppingLists);

  } catch (error: unknown) {
    const errorMessage = isSupabaseError(error) 
      ? error.message 
      : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

// Create shopping list
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { items } = req.body;

    const { data, error } = await supabaseAdmin
      .from('shopping_lists')
      .insert([
        {
          user_id: user.id,
          items: items,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);

  } catch (error: unknown) {
    const errorMessage = isSupabaseError(error) 
      ? error.message 
      : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

// Update shopping list status
router.patch('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    if (!['active', 'completed'].includes(status)) {
      throw new Error('Invalid status value');
    }

    // Update status
    const { data, error } = await supabaseAdmin
      .from('shopping_lists')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id) // Pastikan user hanya bisa update list miliknya
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Shopping list not found');

    res.json(data);

  } catch (error: unknown) {
    const errorMessage = isSupabaseError(error) 
      ? error.message 
      : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

// Add new DELETE endpoint
router.delete('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { id } = req.params;

    // Delete shopping list
    const { error } = await supabaseAdmin
      .from('shopping_lists')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user can only delete their own lists

    if (error) throw error;

    res.json({ success: true });

  } catch (error: unknown) {
    const errorMessage = isSupabaseError(error) 
      ? error.message 
      : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

// Add new PATCH endpoint for updating items
router.patch('/:id/items', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { id } = req.params;
    const { items } = req.body;

    // Update items
    const { data, error } = await supabaseAdmin
      .from('shopping_lists')
      .update({ items })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Shopping list not found');

    res.json(data);

  } catch (error: unknown) {
    const errorMessage = isSupabaseError(error) 
      ? error.message 
      : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

export default router;
