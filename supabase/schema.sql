-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.agencies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  status USER-DEFINED DEFAULT 'pending'::agency_status,
  name character varying NOT NULL,
  logo_url text,
  established_year integer,
  employee_count integer,
  address text,
  maps_url text,
  work_model USER-DEFINED,
  contact_email character varying NOT NULL CHECK (contact_email::text ~~ '%@%'::text),
  contact_phone character varying,
  social_media jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agencies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  agency_id uuid NOT NULL,
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  monthly_fee numeric DEFAULT 0,
  CONSTRAINT brands_pkey PRIMARY KEY (id),
  CONSTRAINT brands_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  agency_id uuid,
  brand_id uuid,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['super_admin'::character varying, 'agency_owner'::character varying, 'employee'::character varying, 'customer'::character varying]::text[])),
  first_name character varying,
  last_name character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  salary numeric DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id),
  CONSTRAINT profiles_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.content_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  platform USER-DEFINED NOT NULL,
  content USER-DEFINED NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  default_description text,
  is_active boolean DEFAULT true,
  last_generated_at timestamp with time zone,
  CONSTRAINT content_templates_pkey PRIMARY KEY (id),
  CONSTRAINT content_templates_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL,
  assignee_id uuid,
  template_id uuid,
  platform USER-DEFINED NOT NULL,
  content USER-DEFINED NOT NULL,
  due_date date NOT NULL,
  status USER-DEFINED DEFAULT 'unassigned'::task_status,
  content_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  assignment_note text,
  agency_id uuid,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.profiles(id),
  CONSTRAINT tasks_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.content_templates(id),
  CONSTRAINT tasks_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id)
);
CREATE TABLE public.task_revisions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL,
  previous_url text NOT NULL,
  customer_note text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT task_revisions_pkey PRIMARY KEY (id),
  CONSTRAINT task_revisions_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  agency_id uuid NOT NULL,
  type USER-DEFINED NOT NULL,
  category USER-DEFINED NOT NULL,
  amount numeric NOT NULL,
  description text,
  transaction_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agencies(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  task_id uuid,
  message text NOT NULL,
  type USER-DEFINED NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT notifications_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.task_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  comment_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT task_comments_pkey PRIMARY KEY (id),
  CONSTRAINT task_comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_comments_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);