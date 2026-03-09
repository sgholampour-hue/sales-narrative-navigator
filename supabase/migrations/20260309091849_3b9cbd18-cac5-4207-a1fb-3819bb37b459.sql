
-- Create table for call analyses
CREATE TABLE public.call_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  
  -- Step 1 fields
  call_type TEXT NOT NULL DEFAULT 'Sales Call',
  call_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prospect_name TEXT NOT NULL,
  prospect_title TEXT,
  prospect_email TEXT NOT NULL,
  prospect_linkedin TEXT,
  
  -- Step 2 fields
  company_name TEXT NOT NULL,
  website_url TEXT,
  industry TEXT,
  headcount TEXT,
  company_linkedin TEXT,
  hq_location TEXT,
  yearly_revenue TEXT,
  transcript TEXT NOT NULL,
  notes TEXT,
  
  -- AI analysis results (structured JSON from prompt 2)
  raw_analysis TEXT,
  analysis_json JSONB,
  
  -- Extracted scores for easy querying
  total_score NUMERIC,
  call_control_score NUMERIC,
  discovery_depth_score NUMERIC,
  belief_shifting_score NUMERIC,
  objection_handling_score NUMERIC,
  pitch_effectiveness_score NUMERIC,
  closing_strength_score NUMERIC,
  
  -- Outcome
  deal_closed BOOLEAN,
  deal_value NUMERIC,
  next_steps TEXT
);

-- Enable RLS
ALTER TABLE public.call_analyses ENABLE ROW LEVEL SECURITY;

-- For now allow all access (no auth yet)
CREATE POLICY "Allow all access to call_analyses" ON public.call_analyses FOR ALL USING (true) WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_call_analyses_updated_at
  BEFORE UPDATE ON public.call_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
