-- Migration 006: System Title Seeds

insert into public.titles (name, level, category, is_custom) values
-- Executive
('CEO', 0, 'executive', false), ('President', 0, 'executive', false),
('Founder', 0, 'executive', false), ('Co-Founder', 0, 'executive', false),
('Chairman', 0, 'executive', false), ('Board Member', 0, 'executive', false),
-- C-Suite
('CTO', 1, 'technical', false), ('CIO', 1, 'technical', false),
('CFO', 1, 'finance', false), ('COO', 1, 'operations', false),
('CMO', 1, 'marketing', false), ('CLO', 1, 'legal', false),
('CHRO', 1, 'hr', false), ('CPO', 1, 'technical', false),
-- VP
('VP of Engineering', 2, 'technical', false), ('VP of Marketing', 2, 'marketing', false),
('VP of Sales', 2, 'operations', false), ('VP of Product', 2, 'technical', false),
('VP of Finance', 2, 'finance', false), ('General Counsel', 2, 'legal', false),
-- Director
('Director', 3, 'general', false), ('Senior Director', 3, 'general', false),
('Creative Director', 3, 'marketing', false), ('Technical Director', 3, 'technical', false),
('Production Director', 3, 'operations', false),
-- Manager
('Manager', 4, 'general', false), ('Senior Manager', 4, 'general', false),
('Product Manager', 4, 'technical', false), ('Project Manager', 4, 'general', false),
('Engineering Manager', 4, 'technical', false), ('Marketing Manager', 4, 'marketing', false),
('Operations Manager', 4, 'operations', false), ('Manufacturing Manager', 4, 'operations', false),
-- Individual Contributor
('Lead Engineer', 5, 'technical', false), ('Senior Engineer', 5, 'technical', false),
('Engineer', 5, 'technical', false), ('DevOps Engineer', 5, 'technical', false),
('Designer', 5, 'marketing', false), ('Analyst', 5, 'finance', false),
('Legal Counsel', 5, 'legal', false), ('Marketing Specialist', 5, 'marketing', false),
('Production Specialist', 5, 'operations', false), ('Manufacturing Specialist', 5, 'operations', false),
('Advisor', 5, 'general', false), ('Consultant', 5, 'general', false),
('Contractor', 5, 'general', false);