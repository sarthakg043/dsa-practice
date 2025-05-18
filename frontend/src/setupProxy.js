// API proxy middleware for development
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      },
      onProxyRes: function(proxyRes, req, res) {
        // Force JSON content type
        proxyRes.headers['content-type'] = 'application/json';
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
      }
    })
  );
}
