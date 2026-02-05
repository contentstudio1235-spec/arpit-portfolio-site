export default async function handler(req, res) {
    const { code } = req.query;

    if (code !== 'authorized') {
        return res.status(401).send('Not authorized');
    }

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        return res.status(500).send('GITHUB_TOKEN not configured in Vercel environment variables.');
    }

    // Decap CMS expects a postMessage back to the opener or a specific response
    // The standard structure is script with postMessage
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
    <html>
    <body>
    <script>
      (function() {
        function receiveMessage(e) {
          console.log("Receive message:", e);
          // Send token back to the CMS
          window.opener.postMessage(
            'authorization:github:success:{"token":"${token}","provider":"github"}',
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })()
    </script>
    </body>
    </html>
  `);
}
