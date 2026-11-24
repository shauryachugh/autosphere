import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function geminiDevPlugin(env: Record<string, string>) {
  return {
    name: 'autosphere-gemini-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0];
        if (url !== '/api/gemini-chat' && url !== '/.netlify/functions/gemini-chat') {
          return next();
        }

        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            if (!apiKey) {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  source: 'fallback',
                  useFallback: true,
                  message:
                    'GEMINI_API_KEY is not configured in the server environment. Using AutoSphere Automotive Intelligence Engine.',
                })
              );
              return;
            }

            const payload = JSON.parse(body || '{}');
            const sanitizedMessage = (payload.message || '').slice(0, 2500);

            let systemInstruction = `You are "AutoSphere AI", India's premier automotive intelligence co-pilot. You are an expert on the Indian automotive ecosystem, vehicle ownership, technical specifications, maintenance practices, regulations (MoRTH, RTO road taxes, PUC, FASTag), fuel dynamics (petrol, diesel, CNG, EV tariffs), and economics. Provide structured, accurate, practical advice in INR (₹).`;

            if (payload.vehicleContext?.make) {
              systemInstruction += `\n\nActive Vehicle Context: ${payload.vehicleContext.year || ''} ${payload.vehicleContext.make} ${payload.vehicleContext.model} (${payload.vehicleContext.fuelType || ''}), Odo: ${payload.vehicleContext.currentOdometer || ''} km, Location: ${payload.vehicleContext.city || ''}, ${payload.vehicleContext.state || 'India'}.`;
            }

            const contents: any[] = [];
            if (Array.isArray(payload.conversationHistory)) {
              payload.conversationHistory.slice(-8).forEach((msg: any) => {
                contents.push({
                  role: msg.sender === 'user' ? 'user' : 'model',
                  parts: [{ text: msg.content }],
                });
              });
            }
            contents.push({ role: 'user', parts: [{ text: sanitizedMessage }] });

            const modelName = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
              }),
            });

            if (!geminiRes.ok) {
              const errBody = await geminiRes.text();
              console.warn(`[Vite Dev Gemini] API error ${geminiRes.status}:`, errBody);
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  source: 'fallback',
                  useFallback: true,
                  message: `Gemini API returned status ${geminiRes.status}. Using AutoSphere Intelligence Engine.`,
                })
              );
              return;
            }

            const data = await geminiRes.json();
            const replyText =
              data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from Gemini.';

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                source: 'gemini',
                model: modelName,
                text: replyText,
                timestamp: new Date().toISOString(),
              })
            );
          } catch (e: any) {
            console.error('[Vite Dev Gemini] Error:', e);
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                source: 'fallback',
                useFallback: true,
                message: 'Error connecting to Gemini. Using AutoSphere Intelligence Engine.',
              })
            );
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), geminiDevPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-charts': ['recharts'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    server: {
      port: 3000,
      open: false,
    },
  };
});
