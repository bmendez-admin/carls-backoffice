import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gbklqpbcllhdixiuxwzt.supabase.co'
const supabaseKey = 'sb_publishable_478TOeFf5POv09rZ58BeyQ_BA8rY8cf'

export const supabase = createClient(supabaseUrl, supabaseKey)