import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'

/// safe because in backend api
const supabaseUrl = 'https://psogntuhuxiogobpcgjs.supabase.co/'

const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb2dudHVodXhpb2dvYnBjZ2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNjA2OTYsImV4cCI6MjAxNjgzNjY5Nn0.ehecLDZZKcwWniBMtF0DoFUMabKwlzsVuX9jzVNerJQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async (request: NextApiRequest, response: NextApiResponse) => {
    const { data } = await supabase
        .from('mints')
        .select().limit(10)

    return response.status(200).json({
        data: data,
    })
}
