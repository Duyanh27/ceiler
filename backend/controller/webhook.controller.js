import { Webhook } from "svix";

export const handleWebhookEvent = async (req, res) => {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env');
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headers = req.headers;
    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return void res.status(400).json({
        success: false,
        message: 'Error: Missing svix headers',
      });
    }

    let evt;

    try {
      // Convert raw body to string if it isn't already
      const rawBody = req.body.toString('utf8');
      const jsonBody = JSON.parse(rawBody);
      
      evt = wh.verify(rawBody, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });

      // Use the parsed JSON for your business logic
      const { id } = jsonBody;
      const eventType = jsonBody.type;
      
      console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
      console.log('Webhook payload:', jsonBody);

      if (eventType === 'user.created') {
        console.log('userId:', jsonBody.data.id);
      }

    } catch (err) {
      console.log('Error: Could not verify webhook:', err.message);
      return void res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return void res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
};

export default {
    handleWebhookEvent
};