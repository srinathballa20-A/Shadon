-- Seed Users (password is 'password123' hashed with bcrypt - placeholder)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'john.smith@company.com', '$2b$10$placeholder', 'John', 'Smith', 'employee', 'Engineering'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'sarah.johnson@company.com', '$2b$10$placeholder', 'Sarah', 'Johnson', 'employee', 'Product'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'mike.manager@company.com', '$2b$10$placeholder', 'Mike', 'Williams', 'manager', 'Engineering'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'admin@company.com', '$2b$10$placeholder', 'Admin', 'User', 'admin', 'Management')
ON CONFLICT (email) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, name, description, sort_order) VALUES
  ('c0000000-0001-4000-8000-000000000001', 'AI & Machine Learning', 'Ideas involving artificial intelligence and machine learning solutions', 1),
  ('c0000000-0002-4000-8000-000000000002', 'Process Improvement', 'Ideas for improving existing business processes', 2),
  ('c0000000-0003-4000-8000-000000000003', 'Product Innovation', 'New product ideas and innovations', 3),
  ('c0000000-0004-4000-8000-000000000004', 'Cost Reduction', 'Ideas for reducing costs and increasing efficiency', 4),
  ('c0000000-0005-4000-8000-000000000005', 'Employee Engagement', 'Ideas for improving employee engagement and wellness', 5),
  ('c0000000-0006-4000-8000-000000000006', 'Sustainability', 'Environmental and sustainability initiatives', 6),
  ('c0000000-0007-4000-8000-000000000007', 'Training & Development', 'Learning and development initiatives', 7),
  ('c0000000-0008-4000-8000-000000000008', 'Customer Experience', 'Improving customer satisfaction and experience', 8)
ON CONFLICT DO NOTHING;

-- Seed SubCategories (fixed UUID prefixes to use valid hex: 'ab' instead of 's0')
INSERT INTO sub_categories (id, category_id, name, sort_order) VALUES
  ('ab000000-0001-4000-8000-000000000001', 'c0000000-0001-4000-8000-000000000001', 'Natural Language Processing', 1),
  ('ab000000-0002-4000-8000-000000000002', 'c0000000-0001-4000-8000-000000000001', 'Computer Vision', 2),
  ('ab000000-0003-4000-8000-000000000003', 'c0000000-0001-4000-8000-000000000001', 'Customer Service Automation', 3),
  ('ab000000-0004-4000-8000-000000000004', 'c0000000-0002-4000-8000-000000000002', 'Workflow Optimization', 1),
  ('ab000000-0005-4000-8000-000000000005', 'c0000000-0002-4000-8000-000000000002', 'Finance Automation', 2),
  ('ab000000-0006-4000-8000-000000000006', 'c0000000-0003-4000-8000-000000000003', 'Mobile Solutions', 1),
  ('ab000000-0007-4000-8000-000000000007', 'c0000000-0004-4000-8000-000000000004', 'Resource Optimization', 1),
  ('ab000000-0008-4000-8000-000000000008', 'c0000000-0005-4000-8000-000000000005', 'Health & Wellness', 1),
  ('ab000000-0009-4000-8000-000000000009', 'c0000000-0005-4000-8000-000000000005', 'Team Building', 2),
  ('ab000000-0010-4000-8000-000000000010', 'c0000000-0006-4000-8000-000000000006', 'Environmental Impact', 1),
  ('ab000000-0011-4000-8000-000000000011', 'c0000000-0006-4000-8000-000000000006', 'Green Office', 2),
  ('ab000000-0012-4000-8000-000000000012', 'c0000000-0007-4000-8000-000000000007', 'Technology-Enhanced Learning', 1),
  ('ab000000-0013-4000-8000-000000000013', 'c0000000-0007-4000-8000-000000000007', 'Mentorship Programs', 2),
  ('ab000000-0014-4000-8000-000000000014', 'c0000000-0008-4000-8000-000000000008', 'Support Chatbots', 1),
  ('ab000000-0015-4000-8000-000000000015', 'c0000000-0008-4000-8000-000000000008', 'Feedback Systems', 2)
ON CONFLICT DO NOTHING;

-- Seed Ideas
INSERT INTO ideas (id, user_id, title, description, category_id, sub_category_id, status, likes_count, dislikes_count, comments_count, created_at, implementation_date, reward_issued) VALUES
  ('d0000000-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'Virtual Reality Training Modules',
   'Create VR-based training programs for new employees that simulate real work scenarios. This would make onboarding more engaging and help employees learn faster in a safe environment.',
   'c0000000-0007-4000-8000-000000000007', 'ab000000-0012-4000-8000-000000000012', 'pending', 2, 1, 0, NOW() - INTERVAL '5 days', NULL, false),

  ('d0000000-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'Green Office Initiative',
   'Implement a comprehensive sustainability program including solar panels, recycling stations, and energy-efficient appliances. Track carbon footprint reduction and share progress with employees.',
   'c0000000-0006-4000-8000-000000000006', 'ab000000-0010-4000-8000-000000000010', 'pending', 2, 0, 0, NOW() - INTERVAL '9 days', NULL, false),

  ('d0000000-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002', 'Automated Invoice Processing System',
   'Develop an automated system that uses OCR and AI to extract data from invoices, validate information, and route for approval. This would reduce manual data entry errors and speed up payment processing.',
   'c0000000-0002-4000-8000-000000000002', 'ab000000-0005-4000-8000-000000000005', 'approved', 3, 0, 1, NOW() - INTERVAL '12 days', NULL, false),

  ('d0000000-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', 'Employee Wellness Program App',
   'Create a mobile app that tracks employee wellness activities, provides mental health resources, and gamifies healthy habits. Include features for meditation, exercise tracking, and team challenges.',
   'c0000000-0005-4000-8000-000000000005', 'ab000000-0008-4000-8000-000000000008', 'implemented', 3, 1, 0, NOW() - INTERVAL '17 days', NOW() - INTERVAL '7 days', true),

  ('d0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0002-4000-8000-000000000002', 'AI-Powered Customer Support Chatbot',
   'Implement an AI chatbot that can handle common customer queries 24/7, reducing response time and improving customer satisfaction. The chatbot would use natural language processing to understand customer intent and provide accurate responses.',
   'c0000000-0001-4000-8000-000000000001', 'ab000000-0003-4000-8000-000000000003', 'approved', 5, 0, 1, NOW() - INTERVAL '22 days', NULL, false)
ON CONFLICT DO NOTHING;

-- Seed Idea Likes
INSERT INTO idea_likes (idea_id, user_id, is_like) VALUES
  ('d0000000-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', true),
  ('d0000000-0001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003', true),
  ('d0000000-0001-4000-8000-000000000001', 'a1b2c3d4-0004-4000-8000-000000000004', false),
  ('d0000000-0002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', true),
  ('d0000000-0002-4000-8000-000000000002', 'a1b2c3d4-0003-4000-8000-000000000003', true),
  ('d0000000-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', true),
  ('d0000000-0003-4000-8000-000000000003', 'a1b2c3d4-0003-4000-8000-000000000003', true),
  ('d0000000-0003-4000-8000-000000000003', 'a1b2c3d4-0004-4000-8000-000000000004', true),
  ('d0000000-0004-4000-8000-000000000004', 'a1b2c3d4-0002-4000-8000-000000000002', true),
  ('d0000000-0004-4000-8000-000000000004', 'a1b2c3d4-0003-4000-8000-000000000003', true),
  ('d0000000-0004-4000-8000-000000000004', 'a1b2c3d4-0004-4000-8000-000000000004', true),
  ('d0000000-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', false),
  ('d0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001', true),
  ('d0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0003-4000-8000-000000000003', true),
  ('d0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0004-4000-8000-000000000004', true),
  ('d0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0002-4000-8000-000000000002', true),
  ('d0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001', true)
ON CONFLICT DO NOTHING;

-- Seed Comments
INSERT INTO comments (id, idea_id, user_id, text, created_at) VALUES
  ('e0000000-0001-4000-8000-000000000001', 'd0000000-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', 'This would save our finance team so much time! Great idea.', NOW() - INTERVAL '10 days'),
  ('e0000000-0002-4000-8000-000000000002', 'd0000000-0005-4000-8000-000000000005', 'a1b2c3d4-0003-4000-8000-000000000003', 'We should definitely explore this. Customer support costs are growing rapidly.', NOW() - INTERVAL '20 days')
ON CONFLICT DO NOTHING;

-- Seed Notifications for John Smith
INSERT INTO notifications (id, user_id, idea_id, type, message, is_read, created_at) VALUES
  ('f0000000-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'd0000000-0004-4000-8000-000000000004', 'implementation', 'Your idea "Employee Wellness Program App" has been implemented!', false, NOW() - INTERVAL '7 days'),
  ('f0000000-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'd0000000-0004-4000-8000-000000000004', 'reward', 'You received a $500 Amazon Gift Card for your implemented idea!', false, NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Seed Rewards
INSERT INTO rewards (id, idea_id, user_id, reward_type, amount, description, issued_by_user_id) VALUES
  ('b0000000-0001-4000-8000-000000000001', 'd0000000-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', 'gift_card', 500.00, '$500 Amazon Gift Card', 'a1b2c3d4-0004-4000-8000-000000000004')
ON CONFLICT DO NOTHING;
