export default async function handler(req, res) {
  const { host } = req.headers;
  const protocol = req.headers['x-forwarded-proto'] || 'http';

  // GET: Show the login form
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CMS Login</title>
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0a0a0f; color: white; margin: 0; }
          form { background: #141419; padding: 2rem; border-radius: 8px; border: 1px solid #00ff88; box-shadow: 0 0 20px rgba(0, 255, 136, 0.2); }
          input { width: 100%; padding: 0.5rem; margin: 1rem 0; border-radius: 4px; border: 1px solid #333; background: #05050a; color: white; box-sizing: border-box; }
          button { width: 100%; padding: 0.5rem; background: #00ff88; border: none; border-radius: 4px; color: #05050a; font-weight: bold; cursor: pointer; }
          button:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <form method="POST">
          <h2 style="margin-top:0">CMS Access</h2>
          <label>Enter Password:</label>
          <input type="password" name="password" required autofocus />
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `);
  }

  // POST: Check password and redirect
  if (req.method === 'POST') {
    const body = await req.body;
    // Vercel might parse JSON/URL-encoded automatically or we might need to parse it
    // For simple form POST:
    const password = body.password || (typeof body === 'string' ? new URLSearchParams(body).get('password') : null);

    if (password === process.env.CMS_PASSWORD) {
      // Success: Redirect to callback with a temporary "code" (which we don't really use for security, just flow)
      return res.redirect(302, `${protocol}://${host}/api/callback?code=authorized`);
    } else {
      return res.status(401).send('Invalid password. <a href="/api/auth">Try again</a>');
    }
  }
}
