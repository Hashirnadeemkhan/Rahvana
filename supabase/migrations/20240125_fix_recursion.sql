-- -- Drop the problematic policies that caused recursion
-- drop policy if exists "Admins can view all chats" on public.support_chats;
-- drop policy if exists "Admins can view all messages" on public.support_messages;
-- drop policy if exists "Admins can reply to any chat" on public.support_messages;

-- -- Re-create simple, non-recursive policies using only JWT claims

-- create policy "Admins can view all chats"
--   on public.support_chats for select
--   using (
--     -- Check email directly from the JWT token to avoid querying tables
--     auth.jwt() ->> 'email' = 'khashir657@gmail.com'
--   );

-- create policy "Admins can view all messages"
--   on public.support_messages for select
--   using (
--     auth.jwt() ->> 'email' = 'khashir657@gmail.com'
--   );

-- create policy "Admins can reply to any chat"
--   on public.support_messages for insert
--   with check (
--     auth.jwt() ->> 'email' = 'khashir657@gmail.com'
--   );
