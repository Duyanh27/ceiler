// webhook.controller.js
import { Webhook } from 'svix';
import User from '../models/user.model.js';

export const handleWebhookEvent = async (req, res) => {
    try {
        const SIGNING_SECRET = process.env.SIGNING_SECRET;

        if (!SIGNING_SECRET) {
            console.error('Missing SIGNING_SECRET');
            return res.status(500).json({
                success: false,
                message: 'Error: Missing SIGNING_SECRET'
            });
        }

        // Log the secret (first few characters) for debugging
        console.log('SIGNING_SECRET starts with:', SIGNING_SECRET.substring(0, 8));

        // Get the headers
        const svix_id = req.headers['svix-id'];
        const svix_timestamp = req.headers['svix-timestamp'];
        const svix_signature = req.headers['svix-signature'];

        // Log headers for debugging
        console.log('Webhook Headers:', {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature?.substring(0, 32) + '...'
        });

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error('Missing required Svix headers');
            return res.status(400).json({
                success: false,
                message: 'Error: Missing required Svix headers'
            });
        }

        const wh = new Webhook(SIGNING_SECRET);

        const payload = req.body;
        const payloadString = typeof payload === 'string' 
            ? payload 
            : Buffer.isBuffer(payload)
            ? payload.toString('utf8')
            : JSON.stringify(payload);

        console.log('Received webhook payload:', payloadString);

        try {
            const evt = wh.verify(payloadString, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });

            const jsonBody = JSON.parse(payloadString);
            console.log('Webhook event type:', jsonBody.type);

            switch (jsonBody.type) {
                case 'user.created':
                    return await handleUserCreated(jsonBody.data, res);
                case 'user.updated':
                    return await handleUserUpdated(jsonBody.data, res);
                case 'user.deleted':
                    return await handleUserDeleted(jsonBody.data, res);
                default:
                    console.log('Unhandled event type:', jsonBody.type);
                    return res.status(200).json({
                        success: true,
                        message: 'Webhook received but event type not handled'
                    });
            }
        } catch (err) {
            console.error('Webhook verification failed:', err);
            return res.status(400).json({
                success: false,
                message: 'Webhook verification failed',
                error: err.message
            });
        }
    } catch (err) {
        console.error('Webhook processing error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Handler for user.created event
async function handleUserCreated(data, res) {
    try {
        console.log('Processing user.created event:', data);

        const { 
            id: clerkId, 
            email_addresses, 
            username,
            first_name,
            last_name,
            image_url 
        } = data;

        if (!clerkId || !email_addresses?.length) {
            console.error('Missing required user data');
            return res.status(400).json({ 
                success: false,
                message: 'Missing required user data' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(200).json({
                success: true,
                message: 'User already exists',
                userId: existingUser._id
            });
        }

        // Create new user
        const newUser = await User.create({
            clerkId,
            email: email_addresses[0].email_address,
            username: username || `${first_name || ''} ${last_name || ''}`.trim() || 'New User',
            imageUrl: image_url || "https://via.placeholder.com/150",
            walletBalance: 0,
            activeBids: [],
            wonAuctions: [],
            notifications: []
        });

        console.log('Created new user:', newUser);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: newUser._id
        });
    } catch (error) {
        console.error('Error in handleUserCreated:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
}

// Handler for user.updated event
async function handleUserUpdated(data, res) {
    try {
        console.log('Processing user.updated event:', data);

        const { 
            id: clerkId, 
            email_addresses, 
            username,
            first_name,
            last_name,
            image_url 
        } = data;

        if (!clerkId) {
            console.error('Missing clerkId in update data');
            return res.status(400).json({
                success: false,
                message: 'Missing user ID'
            });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (email_addresses?.[0]?.email_address) {
            updateData.email = email_addresses[0].email_address;
        }
        if (username || first_name || last_name) {
            updateData.username = username || 
                `${first_name || ''} ${last_name || ''}`.trim() || 
                'Updated User';
        }
        if (image_url) {
            updateData.imageUrl = image_url;
        }

        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            console.error('User not found for update:', clerkId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('Updated user:', updatedUser);

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            userId: updatedUser._id,
            updatedFields: updateData
        });
    } catch (error) {
        console.error('Error in handleUserUpdated:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
}

// Handler for user.deleted event
async function handleUserDeleted(data, res) {
    try {
        console.log('Processing user.deleted event:', data);

        const { id: clerkId } = data;

        if (!clerkId) {
            console.error('Missing clerkId in delete data');
            return res.status(400).json({
                success: false,
                message: 'Missing user ID'
            });
        }

        // Find user before deletion to return their ID in response
        const user = await User.findOne({ clerkId });
        if (!user) {
            console.error('User not found for deletion:', clerkId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Perform the deletion
        const deletedUser = await User.findOneAndDelete({ clerkId });
        
        console.log('Deleted user:', deletedUser);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('Error in handleUserDeleted:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
}

export default {
    handleWebhookEvent
};