# Home site

```bash
npm install -g yarn
```

deploy to github pages

```bash
yarn build && yarn export && yarn deploy
```

## Supabase

### Sing Up

#### New User Trigger

- https://supabase.com/docs/guides/auth/managing-user-data?language=js

```sql
-- inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
insert into public.profiles (uuid, level)
values (new.id, 1);
return new;
end;
$$;

-- trigger the function every time a user is created
create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

## References

* [Next.js, Tailwind CSS blogging starter template](https://github.com/timlrx/tailwind-nextjs-starter-blog)

### Internationalization

* [Internationalization (i18n) Routing](https://nextjs.org/docs/pages/building-your-application/routing/internationalization)
* [next-i18next](https://github.com/i18next/next-i18next)
