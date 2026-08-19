SOURCE database/schema.sql;

USE filmhub;

INSERT IGNORE INTO users (id, name, email, password, role, avatar, bio, status) VALUES
(1, 'Admin Director', 'admin@filmhub.test', '$2a$12$Y9ccz9mqmM6D.hrunOlg0eoWU91/pItfSld.lDAczf67v0qRBIqVu', 'admin', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 'Curates the FilmHub front page and keeps the reels spinning.', 'active'),
(2, 'Maya Sterling', 'maya@filmhub.test', '$2a$12$Y9ccz9mqmM6D.hrunOlg0eoWU91/pItfSld.lDAczf67v0qRBIqVu', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', 'Neo-noir obsessive, festival note taker, and soundtrack collector.', 'active'),
(3, 'Jonas Vale', 'jonas@filmhub.test', '$2a$12$Y9ccz9mqmM6D.hrunOlg0eoWU91/pItfSld.lDAczf67v0qRBIqVu', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'Writes about blockbusters, animation, and practical effects.', 'active');

INSERT IGNORE INTO categories (id, name, slug, description, icon) VALUES
(1, 'Reviews', 'reviews', 'Critical essays and quick reactions for new and classic cinema.', 'Star'),
(2, 'News', 'news', 'Industry updates, festival announcements, and production stories.', 'Newspaper'),
(3, 'Rankings', 'rankings', 'Lists, watch guides, and curated movie marathons.', 'Trophy'),
(4, 'Recommendations', 'recommendations', 'Personal picks for every mood and movie night.', 'Sparkles'),
(5, 'Film Craft', 'film-craft', 'Cinematography, editing, sound, production design, and visual effects.', 'Clapperboard');

INSERT IGNORE INTO posts (id, user_id, title, slug, content, excerpt, featured_image, trailer_url, status, category_id, tags, rating, views, likes, featured) VALUES
(1, 2, 'Why Neo-Noir Still Owns the Night', 'why-neo-noir-still-owns-the-night', '<p>Neo-noir survives because cities keep inventing new shadows. This essay follows rain-slick streets, unreliable heroes, and the way modern thrillers use light as a confession.</p>', 'A cinematic look at the mood, lighting, and moral fog that keep neo-noir alive.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'published', 1, 'noir, cinematography, thriller', 9.1, 3, 2, 1),
(2, 3, 'Ten Practical Effects That Still Feel Impossible', 'ten-practical-effects-that-still-feel-impossible', '<p>Before pixels took over the conversation, crews built impossible things with motors, matte paintings, glass, smoke, and patience. These sequences still hit because the camera believed them first.</p>', 'A ranked celebration of handmade spectacle and physical movie magic.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '', 'published', 3, 'effects, rankings, behind-the-scenes', 8.7, 2, 1, 1),
(3, 2, 'The Comfort of Rewatching a Perfect Opening Scene', 'the-comfort-of-rewatching-a-perfect-opening-scene', '<p>A great opening scene teaches you how to watch the movie. It sets tempo, stakes, and trust. That is why we return to them like favorite songs.</p>', 'On the ritual pleasure of replaying unforgettable first scenes.', 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80', '', 'published', 4, 'rewatch, openings, essay', 8.9, 1, 0, 0),
(4, 3, 'How Sound Design Turns Silence Into Suspense', 'how-sound-design-turns-silence-into-suspense', '<p>The scariest sound in cinema is often the one that almost disappears. A distant hum, a room tone shift, or a missing footstep can pull the audience closer than a jump scare.</p>', 'A craft essay about room tone, bass pressure, and why silence can feel louder than impact.', 'https://images.unsplash.com/photo-1572188863110-46d457c9234d?auto=format&fit=crop&w=1200&q=80', '', 'published', 5, 'sound, editing, suspense', 9.0, 1, 1, 1),
(5, 2, 'Festival Watch: Five Films Built for the Big Screen', 'festival-watch-five-films-built-for-the-big-screen', '<p>Some films ask for a screen so large that every glance becomes architecture. This preview highlights festival titles with bold framing, theatrical color, and room-shaking sound.</p>', 'A festival-style watchlist for films that deserve theatrical sound, scale, and crowd energy.', 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1200&q=80', '', 'published', 2, 'festival, news, cinema', 8.4, 1, 0, 0),
(6, 3, 'Best Rain Scenes in Modern Cinema', 'best-rain-scenes-in-modern-cinema', '<p>Rain gives cinema texture, rhythm, reflection, and release. These scenes use water as atmosphere, memory, and sometimes a complete emotional reset.</p>', 'A visual ranking of rain scenes where weather becomes character, movement, and mood.', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80', '', 'published', 3, 'rain, visuals, rankings', 8.5, 1, 0, 0),
(7, 2, 'Production Design That Makes Fiction Feel Lived In', 'production-design-that-makes-fiction-feel-lived-in', '<p>The most convincing movie worlds are full of marks, repairs, labels, clutter, and objects that imply a life outside the frame.</p>', 'A close look at sets, props, color palettes, and the detail that makes film worlds believable.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80', '', 'published', 5, 'production-design, sets, craft', 8.8, 1, 0, 1);

INSERT IGNORE INTO post_categories (post_id, category_id) VALUES
(1, 1), (2, 3), (3, 4), (4, 5), (5, 2), (6, 3), (7, 5);

INSERT IGNORE INTO post_tags (post_id, tag, slug) VALUES
(1, 'noir', 'noir'), (1, 'cinematography', 'cinematography'), (1, 'thriller', 'thriller'),
(2, 'effects', 'effects'), (2, 'rankings', 'rankings'), (2, 'behind-the-scenes', 'behind-the-scenes'),
(3, 'rewatch', 'rewatch'), (3, 'openings', 'openings'), (3, 'essay', 'essay'),
(4, 'sound', 'sound'), (4, 'editing', 'editing'), (4, 'suspense', 'suspense'),
(5, 'festival', 'festival'), (5, 'news', 'news'), (5, 'cinema', 'cinema'),
(6, 'rain', 'rain'), (6, 'visuals', 'visuals'), (6, 'rankings', 'rankings'),
(7, 'production-design', 'production-design'), (7, 'sets', 'sets'), (7, 'craft', 'craft');

INSERT IGNORE INTO post_views (post_id, user_id, viewer_hash) VALUES
(1, 1, 'user:1'), (1, 2, 'user:2'), (1, 3, 'user:3'),
(2, 1, 'user:1'), (2, 2, 'user:2'),
(3, 3, 'user:3'), (4, 2, 'user:2'), (5, 1, 'user:1'), (6, 2, 'user:2'), (7, 3, 'user:3');

INSERT IGNORE INTO post_likes (user_id, post_id) VALUES (1, 1), (3, 1), (2, 2), (1, 4);
INSERT IGNORE INTO likes (user_id, post_id) VALUES (1, 1), (3, 1), (2, 2), (1, 4);

INSERT IGNORE INTO movie_views (movie_key, user_id, viewer_hash) VALUES
('why-neo-noir-still-owns-the-night', 1, 'user:1'),
('why-neo-noir-still-owns-the-night', 2, 'user:2'),
('ten-practical-effects-that-still-feel-impossible', 3, 'user:3');
INSERT IGNORE INTO movie_likes (movie_key, actor_hash, user_id) VALUES
('why-neo-noir-still-owns-the-night', 'user:1', 1),
('ten-practical-effects-that-still-feel-impossible', 'user:2', 2);
INSERT IGNORE INTO movie_dislikes (movie_key, actor_hash, user_id) VALUES
('festival-watch-five-films-built-for-the-big-screen', 'user:3', 3);

INSERT IGNORE INTO comments (id, post_id, user_id, content, parent_comment_id, likes_count) VALUES
(1, 1, 3, 'The lighting section sold me. I never thought about neon as a moral weather system.', NULL, 1),
(2, 1, 2, 'That phrase is going straight into my next draft notes.', 1, 0),
(3, 2, 2, 'Practical effects always age better when the edit trusts the physical texture.', NULL, 0);

INSERT IGNORE INTO comment_replies (comment_id, reply_comment_id) VALUES (1, 2);
INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (1, 2);

INSERT IGNORE INTO followers (follower_id, following_id) VALUES (2, 3), (3, 2), (1, 2);
INSERT IGNORE INTO bookmarks (user_id, post_id) VALUES (2, 2), (3, 1);
INSERT IGNORE INTO notifications (user_id, message, link) VALUES
(2, 'Your neo-noir essay is trending.', '/blogs/why-neo-noir-still-owns-the-night'),
(3, 'Maya Sterling followed you.', '/users/2');
