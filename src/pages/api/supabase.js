import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vzuocrhedmeeumsepzxs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dW9jcmhlZG1lZXVtc2VwenhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwNTYwMzgsImV4cCI6MTk5ODYzMjAzOH0.sc4_jl_9XykEg08YwZFjxbfHyWd47-1K5TnXgVlWcHk";

export const supabase = createClient(supabaseUrl, supabaseKey);
