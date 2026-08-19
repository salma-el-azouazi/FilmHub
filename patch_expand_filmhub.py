from pathlib import Path

base = Path('app.py')
text = base.read_text(encoding='utf-8')

old = '    query += " ORDER BY posts.created_at DESC"\n    posts = query_db(query, params)\n    categories = query_db("SELECT * FROM categories ORDER BY name")\n    return render_template("index.html", user=user, posts=posts, categories=categories, q=q, category_id=category_id)\n'
new = '    query += " ORDER BY posts.created_at DESC"\n    posts = query_db(query, params)\n    categories = query_db("SELECT * FROM categories ORDER BY name")\n    featured_authors = query_db("SELECT users.id, users.username, COUNT(posts.id) AS post_count FROM users LEFT JOIN posts ON posts.author_id = users.id AND posts.blocked = 0 WHERE users.is_admin = 0 GROUP BY users.id ORDER BY post_count DESC LIMIT 4")\n    category_counts = query_db("SELECT categories.*, COUNT(posts.id) AS post_count FROM categories LEFT JOIN posts ON posts.category_id = categories.id AND posts.blocked = 0 GROUP BY categories.id ORDER BY post_count DESC")\n    return render_template("index.html", user=user, posts=posts, categories=categories, q=q, category_id=category_id, featured_authors=featured_authors, category_counts=category_counts)\n'
if old not in text:
    raise SystemExit('index block not found')
text = text.replace(old, new)

marker = '    return render_template("index.html", user=user, posts=posts, categories=categories, q=q, category_id=category_id, featured_authors=featured_authors, category_counts=category_counts)\n\n@app.route("/register", methods=["GET", "POST"])' 
if marker not in text:
    raise SystemExit('register marker not found')

insert = '''

@app.route("/authors")
def authors():
    user = get_current_user()
    authors = query_db(
        """
        SELECT users.id, users.username, COUNT(DISTINCT posts.id) AS total_posts, COUNT(follows.id) AS followers
        FROM users
        LEFT JOIN posts ON posts.author_id = users.id AND posts.blocked = 0
        LEFT JOIN follows ON follows.followed_id = users.id
        WHERE users.is_admin = 0
        GROUP BY users.id
        ORDER BY total_posts DESC, followers DESC
        """,
    )
    return render_template("authors.html", user=user, authors=authors)


@app.route("/author/<int:author_id>")
def author_profile(author_id):
    user = get_current_user()
    author = query_db("SELECT * FROM users WHERE id = ? AND is_admin = 0", (author_id,), one=True)
    if not author:
        flash("Author profile not found.", "warning")
        return redirect(url_for("authors"))

    posts = query_db(
        "SELECT posts.*, categories.name AS category FROM posts JOIN categories ON posts.category_id = categories.id WHERE author_id = ? AND blocked = 0 ORDER BY posts.created_at DESC",
        (author_id,),
    )
    follower_count = query_db("SELECT COUNT(*) AS count FROM follows WHERE followed_id = ?", (author_id,), one=True)["count"]
    followed = False
    if user:
        follow = query_db(
            "SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?",
            (user["id"], author_id),
            one=True,
        )
        followed = bool(follow)

    return render_template(
        "author_profile.html",
        user=user,
        author=author,
        posts=posts,
        follower_count=follower_count,
        followed=followed,
    )


@app.route("/categories")
def categories_page():
    user = get_current_user()
    categories = query_db(
        "SELECT categories.*, COUNT(posts.id) AS post_count FROM categories LEFT JOIN posts ON posts.category_id = categories.id AND posts.blocked = 0 GROUP BY categories.id ORDER BY post_count DESC, categories.name"
    )
    latest_posts = query_db(
        "SELECT posts.id, posts.title, categories.name AS category FROM posts JOIN categories ON posts.category_id = categories.id WHERE posts.blocked = 0 ORDER BY posts.created_at DESC LIMIT 5"
    )
    return render_template("categories.html", user=user, categories=categories, latest_posts=latest_posts)


@app.route("/following")
@login_required
def following():
    user = get_current_user()
    posts = query_db(
        "SELECT posts.*, users.username AS author, categories.name AS category FROM posts JOIN users ON posts.author_id = users.id JOIN categories ON posts.category_id = categories.id JOIN follows ON follows.followed_id = posts.author_id WHERE follows.follower_id = ? AND posts.blocked = 0 ORDER BY posts.created_at DESC",
        (user["id"],),
    )
    return render_template("following.html", user=user, posts=posts)
'''
text = text.replace(marker, insert)

base.write_text(text, encoding='utf-8')
print('updated app.py')
