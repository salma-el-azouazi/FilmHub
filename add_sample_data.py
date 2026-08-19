import sqlite3

conn = sqlite3.connect('filmhub.db')
cursor = conn.cursor()

# Add sample categories if they don't exist
categories = ['Reviews', 'News', 'Trailers', 'Interviews', 'Recommendations', 'Behind the Scenes']
category_ids = {}
for cat in categories:
    cursor.execute('INSERT OR IGNORE INTO categories (name) VALUES (?)', (cat,))
    cursor.execute('SELECT id FROM categories WHERE name = ?', (cat,))
    result = cursor.fetchone()
    if result:
        category_ids[cat] = result[0]

# Add sample posts
posts = [
    ('The Epic Return of Cinema in 2024', '2024 has been an incredible year for film lovers. From blockbuster sequels to indie gems, there\'s something for everyone to enjoy on the big screen.', 'Reviews', 1),
    ('Top 10 Must-Watch Movies This Month', 'Curious what everyone is talking about? Check out our curated list of the hottest films hitting theaters and streaming platforms this season.', 'Recommendations', 1),
    ('Exclusive Interview with Oscar-Nominated Director', 'We sat down with the visionary behind this year\'s most talked-about film to discuss creative process, inspirations, and future projects.', 'Interviews', 1),
    ('Breaking: Major Studio Announces New Franchise', 'Big news from Hollywood as a major studio reveals ambitious plans for an exciting new cinematic universe spanning multiple genres.', 'News', 1),
    ('Summer Blockbuster Trailers You Can\'t Miss', 'Get ready for an action-packed summer with these epic trailer drops that have fans buzzing across social media.', 'Trailers', 1),
    ('Behind the Scenes: Creating Movie Magic', 'Ever wondered how your favorite films are made? Take a peek behind the curtain of the filmmaking process with exclusive behind-the-scenes footage.', 'Behind the Scenes', 1),
    ('Best Indie Films of the Year', 'Discover hidden gems and award-winning independent films that deserve a spot on your watchlist.', 'Reviews', 1),
    ('Upcoming Releases to Watch Out For', 'Mark your calendars! Here are the most anticipated films scheduled for release in the coming months.', 'News', 1)
]

for title, content, category, author_id in posts:
    cat_id = category_ids.get(category, 1)
    cursor.execute('INSERT OR IGNORE INTO posts (title, content, category_id, author_id, is_published, published_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)', 
                  (title, content, cat_id, author_id))

conn.commit()
conn.close()
print('Sample content added successfully!')