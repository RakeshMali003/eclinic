-- Create tables for storing document URLs
CREATE TABLE IF NOT EXISTS public.doctor_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id INTEGER REFERENCES public.doctors(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'mci_reg', 'degree', 'id_proof', 'clinic_letter', 'signature'
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.clinic_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id INTEGER REFERENCES public.clinics(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'registration', 'license', 'id_proof', 'gst', 'logo'
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.doctor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_documents ENABLE ROW LEVEL SECURITY;

-- Policies for doctor_documents
CREATE POLICY "Doctors can insert own documents" 
ON public.doctor_documents FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.doctors d 
        WHERE d.id = doctor_id AND d.auth_user_id = auth.uid()
    )
    OR
    (
        -- Allow insert during initial registration when doctor record might strictly not be 'owned' yet? 
        -- Actually, doctor record is created first in the transaction flow or before?
        -- In authService: users -> doctors -> related data. So yes, doctor record exists.
        -- But auth.uid() matches doctors.auth_user_id.
        EXISTS (
           SELECT 1 FROM public.doctors d
           WHERE d.id = doctor_id AND d.auth_user_id = auth.uid()
        )
    )
);

CREATE POLICY "Doctors can view own documents" 
ON public.doctor_documents FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.doctors d 
        WHERE d.id = doctor_id AND d.auth_user_id = auth.uid()
    )
);

-- Policies for clinic_documents
CREATE POLICY "Clinics can insert own documents" 
ON public.clinic_documents FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clinics c 
        WHERE c.id = clinic_id AND c.auth_user_id = auth.uid()
    )
);

CREATE POLICY "Clinics can view own documents" 
ON public.clinic_documents FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.clinics c 
        WHERE c.id = clinic_id AND c.auth_user_id = auth.uid()
    )
);

-- Storage Bucket Policies (If not already created via UI, user must create 'documents' bucket)
-- INSERT policy for storage.objects
-- ALLOW insert for authenticated users to 'documents' bucket
-- This is usually done in Supabase Dashboard -> Storage -> Policies.
-- But we can try SQL:
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload documents"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'documents' ); 

create policy "Authenticated users can select documents"
on storage.objects for select
to authenticated
using ( bucket_id = 'documents' );
