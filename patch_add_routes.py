from pathlib import Path
p = Path('app.py')
s = p.read_text(encoding='utf-8')
old_import = 'from flask import Flask, render_template, request, redirect, url_for, session, flash, g'
if 'jsonify' not in s and old_import in s:
    s = s.replace(old_import, old_import + ', jsonify')

marker = 'return render_template("categories.html", user=user, categories=categories, latest_posts=latest_posts)'
if marker in s:
    routes = '''\n\n@app.route('/explore')\ndef explore():\n    user = get_current_user()\n    featured = query_db(\n        'SELECT posts.id, posts.title, posts.content, users.username AS author, categories.name AS category FROM posts JOIN users ON posts.author_id = users.id JOIN categories ON posts.category_id = categories.id WHERE posts.blocked = 0 ORDER BY posts.created_at DESC LIMIT 8'\n    )\n    categories = query_db('SELECT * FROM categories ORDER BY name')\n    return render_template('explore.html', user=user, featured=featured, categories=categories)\n\n\n@app.route('/api/search')\ndef api_search():\n    q = request.args.get('q', '').strip()\n    if not q:\n        return jsonify([])\n    term = f"%{q}%"\n    results = query_db(\n        "SELECT posts.id, posts.title, substr(posts.content,1,240) AS snippet, users.username AS author, categories.name AS category FROM posts JOIN users ON posts.author_id = users.id JOIN categories ON posts.category_id = categories.id WHERE posts.blocked = 0 AND (posts.title LIKE ? OR posts.content LIKE ? OR users.username LIKE ? OR categories.name LIKE ?) ORDER BY posts.created_at DESC LIMIT 20",\n        (term, term, term, term),\n    )\n    out = [dict(r) for r in results]\n    return jsonify(out)\n'''
    s = s.replace(marker, marker + routes)
    p.write_text(s, encoding='utf-8')
    print('app.py patched: imports + routes added')
else:
    print('marker not found; no changes applied')
