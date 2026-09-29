-- Sample content from the blueprint. Verify experience descriptions and add real assets/contact details before launch.
-- Run once after 001_portfolio.sql. Existing records are preserved.
begin;
insert into public.profile (id, name, title, headline, about, location, avatar_url, cv_url) values ('00000000-0000-4000-8000-000000000001', 'Muhammad Hafizh Naufal', 'Full-Stack Developer', 'I build practical digital products with web, AI, and modern technology.', 'I''m Hafizh, an Information Systems graduate who enjoys turning complex problems into useful digital experiences. My work connects web development, AI-enabled applications, and hands-on IT systems.

From building a thoughtful interface to connecting the data behind it, I care about the details that make a product work for people.', 'Indonesia', '', '') on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000001', 'React', 'Frontend', 'code', 0) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000002', 'Next.js', 'Frontend', 'code', 1) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000003', 'TypeScript', 'Frontend', 'code', 2) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000004', 'Tailwind CSS', 'Frontend', 'code', 3) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000005', 'Node.js', 'Backend', 'code', 4) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000006', 'Express', 'Backend', 'code', 5) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000007', 'PostgreSQL', 'Database', 'code', 6) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000008', 'Supabase', 'Database', 'code', 7) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000009', 'Prisma', 'Database', 'code', 8) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000010', 'Gemini API', 'AI & APIs', 'code', 9) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000011', 'RAG', 'AI & APIs', 'code', 10) on conflict do nothing;
insert into public.technologies (id, name, category, icon_key, sort_order) values ('10000000-0000-4000-8000-000000000012', 'Git', 'Tools', 'code', 11) on conflict do nothing;
insert into public.projects (id, title, slug, category, summary, content, cover_url, github_url, demo_url, year, featured, status, sort_order, created_at, updated_at) values ('20000000-0000-4000-8000-000000000001', 'AutoCar', 'autocar', 'AI / FULL-STACK', 'Finding the right car. Now a conversation.', 'An automotive showroom that brings vehicle discovery and AI assistance into one experience.

The challenge
Vehicle information spans prices, specifications, fuel types, transmissions, and engine capacities. AutoCar makes that information easier to explore through a conversational interface.

The approach
A React frontend connects to a Node.js and Express backend with PostgreSQL and Supabase. A Retrieval-Augmented Generation workflow retrieves relevant vehicle information before the Gemini API generates a response.

The focus
Full-stack integration, vector-based retrieval, and useful AI interactions. This project demonstrates the connection between structured data and a practical customer experience.', '', '', '', '', true, 'published', 0, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z') on conflict do nothing;
insert into public.projects (id, title, slug, category, summary, content, cover_url, github_url, demo_url, year, featured, status, sort_order, created_at, updated_at) values ('20000000-0000-4000-8000-000000000002', 'Quiztfy', 'quiztfy', 'WEB APPLICATION', 'A little curiosity. A lot of possibilities.', 'A full-stack quiz application connecting an interactive frontend to a structured REST API.

The approach
The application uses PostgreSQL and Prisma for data management, with a REST API connecting the frontend and backend.

The focus
Building a connected product across interface, API, and database. Detailed project outcomes and production links can be added through the portfolio admin.', '', '', '', '', true, 'published', 1, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z') on conflict do nothing;
insert into public.projects (id, title, slug, category, summary, content, cover_url, github_url, demo_url, year, featured, status, sort_order, created_at, updated_at) values ('20000000-0000-4000-8000-000000000003', 'DYY Fragrance', 'dyy-fragrance', 'FRONTEND / COMMERCE', 'An online presence with a lasting impression.', 'A fragrance commerce interface focused on visual presentation and responsive layouts.

The approach
The experience puts the product at the centre, using considered typography, spacing, and a layout that adapts to different screens.

The focus
Frontend craftsmanship and a clear product browsing experience. Add verified implementation details and live links through the admin panel.', '', '', '', '', false, 'published', 2, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z') on conflict do nothing;
insert into public.projects (id, title, slug, category, summary, content, cover_url, github_url, demo_url, year, featured, status, sort_order, created_at, updated_at) values ('20000000-0000-4000-8000-000000000004', 'News Management', 'news-management', 'CMS / WEB APP', 'Less managing content. More telling stories.', 'A web application for managing news content and editorial workflows.

The approach
Create, read, update, and delete operations support the content lifecycle, with API integration connecting the interface to the data layer.

The focus
Practical content management and readable interfaces. Add the full case study and project links once the final materials are available.', '', '', '', '', false, 'published', 3, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z') on conflict do nothing;
insert into public.experiences (id, organization, position, location, start_date, end_date, description, sort_order) values ('30000000-0000-4000-8000-000000000001', 'PT Bukit Asam', 'IT experience', '', null, null, 'Hands-on exposure to IT systems and practical problem solving. Role details and dates will be added with verified information.', 0) on conflict do nothing;
insert into public.experiences (id, organization, position, location, start_date, end_date, description, sort_order) values ('30000000-0000-4000-8000-000000000002', 'DevHandal', 'Developer learning', '', null, null, 'Continuing to develop practical skills in modern software development. Programme details will be added with verified information.', 1) on conflict do nothing;
insert into public.experiences (id, organization, position, location, start_date, end_date, description, sort_order) values ('30000000-0000-4000-8000-000000000003', 'Dicoding', 'Technical learning', '', null, null, 'A foundation of continuous learning and applied development. Course details will be added with verified information.', 2) on conflict do nothing;
insert into public.site_settings (id, seo_title, seo_description, availability_text, contact_email) values ('00000000-0000-4000-8000-000000000001', 'Hafizh — Full-Stack Developer', 'Selected work by Muhammad Hafizh Naufal. Practical digital products with web, AI, and modern technology.', 'Let''s build something useful', '') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000006') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000007') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000008') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000010') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000011') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000005') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000007') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000009') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000005') on conflict do nothing;
insert into public.project_technologies(project_id, technology_id) values ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000007') on conflict do nothing;
commit;

