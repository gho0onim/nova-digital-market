CREATE OR REPLACE FUNCTION public.assign_store_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'saadbahaa2014@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_assign_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_store_admin();

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role FROM auth.users u
WHERE lower(u.email) = 'saadbahaa2014@gmail.com'
AND NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin');