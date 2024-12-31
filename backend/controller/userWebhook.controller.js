import { Webhook } from 'svix';
import User from '../models/user.model.js';

const SIGNING_SECRET = process.env.SIGNING_SECRET;

if (!SIGNING_SECRET) {
    throw new Error('Error: SIGNING_SECRET is not set in the environment');
}

export const handleWebhook = async (req, res) => {
    const svix = new Webhook(SIGNING_SECRET);
    const headers = req.headers;

    try {
        // Verify the webhook payload
        const payload = svix.verify(
            JSON.stringify(req.body),
            {
                'svix-id': headers['svix-id'], // Unique ID for the webhook event
                'svix-timestamp': headers['svix-timestamp'], // Timestamp of the event
                'svix-signature': headers['svix-signature'], // Signature for authenticity
            }
        );

        // Handle the `user.created` event
        if (payload.type === 'user.created') {
            const { id, email_addresses, username } = payload.data;

            try {
                // Save user data to MongoDB
                await User.create({
                    clerkId: id,
                    email: email_addresses[0]?.email_address,
                    username: username || 'Unknown',
                });

                console.log('User saved to MongoDB:', id);
                res.status(200).json({ message: 'User created and processed' });
            } catch (dbErr) {
                console.error('Database error:', dbErr.message);
                res.status(500).json({ error: 'Database error' });
            }
        }
        // Handle the `user.updated` event
        else if (payload.type === 'user.updated') {
            const { id, email_addresses, username, image_url, public_metadata } = payload.data;

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { clerkId: id }, // Match user by Clerk ID
                    {
                        $set: {
                            email: email_addresses[0]?.email_address, // Update email
                            username: username, // Update name
                            profileImage: image_url, // Update profile image
                            metadata: public_metadata, // Update public metadata
                        },
                    },
                    { new: true, upsert: false } // Return updated document, do not create new one
                );

                if (updatedUser) {
                    console.log(`User updated in MongoDB:`, updatedUser);
                    res.status(200).json({
                        message: 'User updated and processed',
                        updatedFields: {
                            email: email_addresses[0]?.email_address,
                            username: username,
                            profileImage: image_url,
                        },
                    });
                } else {
                    console.warn('User not found for update:', id);
                    res.status(404).json({ error: 'User not found for update' });
                }
            } catch (dbErr) {
                console.error('Database error (update):', dbErr.message);
                res.status(500).json({ error: 'Database error' });
            }
        }
        // Handle the `user.deleted` event
        else if (payload.type === 'user.deleted') {
            const { id } = payload.data;

            try {
                const deletedUser = await User.findOneAndDelete({ clerkId: id });

                if (deletedUser) {
                    console.log('User deleted from MongoDB:', deletedUser);
                    res.status(200).json({
                        message: 'User deleted and processed',
                        deletedUser: {
                            clerkId: deletedUser.clerkId,
                            email: deletedUser.email,
                            username: deletedUser.username,
                        },
                    });
                } else {
                    console.warn('User not found for deletion:', id);
                    res.status(404).json({ error: 'User not found for deletion' });
                }
            } catch (dbErr) {
                console.error('Database error (delete):', dbErr.message);
                res.status(500).json({ error: 'Database error' });
            }
        } 
        // Handle unhandled event types
        else {
            console.log('Unhandled event type:', payload.type);
            res.status(200).json({ message: 'Unhandled event type' });
        }
    } catch (err) {
        // Handle verification errors
        console.error('Webhook verification failed:', err.message);
        res.status(400).json({ error: 'Invalid webhook' });
    }
};
