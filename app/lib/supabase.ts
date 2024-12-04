import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imtezydkgjsusioutche.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdGV6eWRrZ2pzdXNpb3V0Y2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyOTY4MDcsImV4cCI6MjA0ODg3MjgwN30.89sOaYqjJXHk1KMlXnvZJSsEBoQ_iopj4kfytc2Rm-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);