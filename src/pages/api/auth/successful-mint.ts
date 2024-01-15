import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'

/// safe because in backend api
const supabaseUrl = 'https://psogntuhuxiogobpcgjs.supabase.co/'

const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb2dudHVodXhpb2dvYnBjZ2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNjA2OTYsImV4cCI6MjAxNjgzNjY5Nn0.ehecLDZZKcwWniBMtF0DoFUMabKwlzsVuX9jzVNerJQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// api
export default async (request: NextApiRequest, response: NextApiResponse) => {
    const bodyData = await request.body;
    const { referredBy } = bodyData; // Extract 'domain' and 'referredBy' from the request body

    // Check if 'referredBy' is defined and not empty
    if (referredBy) {
        // Add logic to increase the points of the referrer by 200 here
        // fetch the current points of the referrer, add 200 to it, and update the points in your database
        const referrerData = await supabase.from('users').select('points').eq('domain', referredBy);
        if (referrerData.data.length > 0) {
            const referrerPoints = referrerData.data[0].points;
            const newPoints = referrerPoints + 200;
            await supabase.from('users').update({ points: newPoints }).eq('domain', referredBy);
        }
    }
    // Remove the 'referredBy' field from the bodyData
    delete bodyData.referredBy;

    // Continue with the 'insert' operation
    const res = await supabase.from('mints').insert(bodyData);
    const { data, error } = res;

    if (error) {
        console.error('Error inserting data:', error);
        return response.status(200).json({
            message: 'Something went wrong with the mint',
        });
    }

    return response.status(200).json({
        message: 'Mint successfully added',
    });
};
