import { Webhook } from 'svix';
import User from '../models/user.model.js';

export const handleWebhookEvent = async (req, res) => {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env'
        });
    }

    const wh = new Webhook(SIGNING_SECRET);
    const headers = req.headers;
    
    // Get Svix headers
    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({
            success: false,
            message: 'Error: Missing svix headers'
        });
    }

    try {
        // Verify webhook
        const rawBody = req.body.toString('utf8');
        const jsonBody = JSON.parse(rawBody);
        
        const evt = await wh.verify(rawBody, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });

        // Handle different event types
        switch (jsonBody.type) {
            case 'user.created':
                return handleUserCreated(jsonBody.data, res);
            case 'user.updated':
                return handleUserUpdated(jsonBody.data, res);
            case 'user.deleted':
                return handleUserDeleted(jsonBody.data, res);
            default:
                console.log('Unhandled event type:', jsonBody.type);
                return res.status(200).json({
                    success: true,
                    message: 'Webhook received'
                });
        }
    } catch (err) {
        console.log('Error: Could not verify webhook:', err.message);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function handleUserCreated(data, res) {
    try {
        const { id, email_addresses, first_name, last_name, username, image_url } = data;

        if (!id || !email_addresses?.length) {
            return res.status(400).json({ error: 'Missing required user data' });
        }

        const userUsername = username || 
            (first_name && last_name ? 
                `${first_name}${last_name}`.toLowerCase() : 
                `user${Math.random().toString(36).slice(2, 8)}`);

        const newUser = await User.create({
            clerkId: id,
            email: email_addresses[0].email_address,
            username: userUsername,
            imageUrl: image_url || "https://via.placeholder.com/150",
            walletBalance: 0,
            activeBids: [],
            wonAuctions: [],
            notifications: []
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: newUser._id
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
}

async function handleUserUpdated(data, res) {
    try {
        const { id, email_addresses, username, image_url } = data;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Missing user ID'
            });
        }

        const updateData = {};
        if (email_addresses?.[0]?.email_address) updateData.email = email_addresses[0].email_address;
        if (username) updateData.username = username;
        if (image_url) updateData.imageUrl = image_url;

        const updatedUser = await User.findOneAndUpdate(
            { clerkId: id },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            updatedFields: updateData
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
}

async function handleUserDeleted(data, res) {
    try {
        const { id } = data;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Missing user ID'
            });
        }

        const deletedUser = await User.findOneAndDelete({ clerkId: id });
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            userId: deletedUser._id
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
}

export default {
    handleWebhookEvent
};