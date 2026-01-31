-- -- Create support_chats table
-- create table if not exists public.support_chats (
--   id uuid default gen_random_uuid() primary key,
--   user_id uuid references auth.users(id) not null,
--   status text check (status in ('open', 'closed')) default 'open',
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- -- Create support_messages table
-- create table if not exists public.support_messages (
--   id uuid default gen_random_uuid() primary key,
--   chat_id uuid references public.support_chats(id) on delete cascade not null,
--   sender_id uuid references auth.users(id) not null,
--   message text not null,
--   is_admin boolean default false,
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- -- Enable RLS
-- alter table public.support_chats enable row level security;
-- alter table public.support_messages enable row level security;

-- -- Policies for support_chats
-- create policy "Users can view their own chats"
--   on public.support_chats for select
--   using (auth.uid() = user_id);

-- create policy "Users can insert their own chats"
--   on public.support_chats for insert
--   with check (auth.uid() = user_id);

-- -- Policies for support_messages
-- create policy "Users can view messages in their chats"
--   on public.support_messages for select
--   using (
--     exists (
--       select 1 from public.support_chats
--       where id = support_messages.chat_id
--       and user_id = auth.uid()
--     )
--   );

-- create policy "Users can insert messages in their chats"
--   on public.support_messages for insert
--   with check (
--     exists (
--       select 1 from public.support_chats
--       where id = support_messages.chat_id
--       and user_id = auth.uid()
--     )
--   );

-- -- ADMIN POLICIES (Assuming admin is identified by email or a role in metadata)
-- -- For simplicity, you might need to adjust this based on your actual admin check logic.
-- -- Example: using a specific email or metadata claim.
-- -- This is a placeholder policy for admins:
-- -- create policy "Admins can view all chats"
-- --   on public.support_chats for select
-- --   using (auth.jwt() ->> 'email' = 'admin@example.com');
