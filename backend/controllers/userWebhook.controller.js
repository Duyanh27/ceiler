import { Webhook } from 'svix';
import User from '../models/user.model.js';
import env from '../config/env.js';

// Validate environment variables
const SIGNING_SECRET = env.SIGNING_SECRET;
const WEBHOOK_TIMEOUT = parseInt(env.WEBHOOK_TIMEOUT || '5000');

if (!SIGNING_SECRET) {
    throw new Error('SIGNING_SECRET is not set in the environment');
}

// Webhook handler with improved validation and error handling
export const handleWebhook = async (req, res) => {
    const svix = new Webhook(SIGNING_SECRET);
    const headers = req.headers;

    try {
        // Validate required headers
        const requiredHeaders = ['svix-id', 'svix-timestamp', 'svix-signature'];
        for (const header of requiredHeaders) {
            if (!headers[header]) {
                return res.status(400).json({ 
                    error: `Missing required header: ${header}` 
                });
            }
        }

        // Verify webhook with timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Webhook verification timeout')), WEBHOOK_TIMEOUT);
        });

        const verificationPromise = svix.verify(
            JSON.stringify(req.body),
            {
                'svix-id': headers['svix-id'],
                'svix-timestamp': headers['svix-timestamp'],
                'svix-signature': headers['svix-signature'],
            }
        );

        const payload = await Promise.race([verificationPromise, timeoutPromise]);

        // Handle different event types
        switch (payload.type) {
            case 'user.created':
                await handleUserCreated(payload.data, res);
                break;
            case 'user.updated':
                await handleUserUpdated(payload.data, res);
                break;
            case 'user.deleted':
                await handleUserDeleted(payload.data, res);
                break;
            default:
                console.log('Unhandled event type:', payload.type);
                res.status(200).json({ message: 'Unhandled event type' });
        }
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(err.message.includes('timeout') ? 408 : 400)
           .json({ error: err.message });
    }
};

// Handle user creation
async function handleUserCreated(data, res) {
    try {
        const { id, email_addresses, username } = data;

        // Validate required data
        if (!id || !email_addresses || !email_addresses.length) {
            return res.status(400).json({ 
                error: 'Missing required user data' 
            });
        }

        // Create user with sanitized data
        const newUser = await User.create({
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username || 'New User',
            walletBalance: 0,
            activeBids: [],
            wonAuctions: [],
            notifications: []
        });

        console.log('User created:', newUser._id);
        res.status(201).json({
            message: 'User created successfully',
            userId: newUser._id
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
}

// Handle user updates
async function handleUserUpdated(data, res) {
    try {
        const { id, email_addresses, username, image_url } = data;

        // Validate input
        if (!id) {
            return res.status(400).json({ error: 'Missing user ID' });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (email_addresses?.[0]?.email_address) {
            updateData.email = email_addresses[0].email_address;
        }
        if (username) updateData.username = username;
        if (image_url) updateData.profileImage = image_url;

        const updatedUser = await User.findOneAndUpdate(
            { clerkId: id },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            updatedFields: updateData
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
}

// Handle user deletion
async function handleUserDeleted(data, res) {
    try {
        const { id } = data;

        if (!id) {
            return res.status(400).json({ error: 'Missing user ID' });
        }

        const deletedUser = await User.findOneAndDelete({ clerkId: id });
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            userId: deletedUser._id
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}