// netlify/functions/gemini-chat.ts
// Server-Side Gemini AI Endpoint for AutoSphere

interface ChatMessageInput {
  sender: 'user' | 'assistant';
  content: string;
}

interface VehicleContextInput {
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  fuelType?: string;
  transmission?: string;
  currentOdometer?: number;
  city?: string;
  state?: string;
  healthScore?: number;
  monthlyFuelSpendINR?: number;
  recentMaintenanceSpendINR?: number;
  subsystemStatuses?: Record<string, string>;
  pucExpiry?: string;
  insuranceExpiry?: string;
}

interface RequestPayload {
  message: string;
  conversationHistory?: ChatMessageInput[];
  vehicleContext?: VehicleContextInput;
}

// Simple in-memory rate limiting map: IP -> timestamp list
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIp) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);
  return false;
}

function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/(\+91[\-\s]?)?[6-9]\d{9}/g, '[REDACTED_PHONE]')
    .replace(/\b\d{16}\b/g, '[REDACTED_CARD]')
    .slice(0, 2500)
    .trim();
}

function buildSystemPrompt(context?: VehicleContextInput): string {
  let prompt = `You are "AutoSphere AI", India's premier automotive intelligence co-pilot, integrated into the AutoSphere automotive platform.
You are an expert on the Indian automotive ecosystem, passenger vehicle ownership, technical specifications, maintenance practices, regulations, and automotive economics.

Your Core Capabilities & Guidelines:
1. Indian Automobile Market: Deep expertise in Indian OEMs (Maruti Suzuki, Tata Motors, Mahindra, Hyundai, Kia, Toyota, Honda, Skoda, Volkswagen, MG, Renault).
2. Price & Taxation: Understand ex-showroom vs on-road pricing across Indian states. Factor in State RTO taxes (e.g., Karnataka 0% EV road tax vs 18% diesel tax; Uttar Pradesh 0% Strong Hybrid road tax waiver; Maharashtra preferential rates; 1% TCS on cars > ₹10 Lakh; FASTag, HSRP plates, and Insurance).
3. Fuel & Powertrains: Real-world dynamics of Petrol, Diesel, Factory CNG (dual-cylinder tech), Strong Hybrids (e.g. Grand Vitara, Hycross), and Electric Vehicles (e.g. Nexon EV, Curvv EV, Windsor EV, ZS EV).
   - Realistic running costs in India: EV home charging ~₹0.90-1.50/km; CNG ~₹3.00-3.50/km; Diesel ~₹6.00-7.00/km; Petrol ~₹6.50-8.50/km.
4. Maintenance & Reliability: OEM periodic maintenance schedules (e.g. 10k km / 1-year oil intervals), synthetic oil grades (API SN/SP, ACEA C3), DPF soot management in Indian city driving (P2463, active vs passive regen), tyre rotation (7,500 km cycle), suspension care for Indian speed breakers/potholes.
5. Regulations & Compliance: Parivahan Sarathi/Vahan, PUC emission norms (BS4/BS6), mandatory Third-Party vs Comprehensive/Zero-Dep insurance, FASTag NHAI toll protocols, RTO transfer norms, and Bharat NCAP crash safety ratings.
6. Tone & Formatting: Professional, knowledgeable, structured, concise, and helpful. Use bullet points and clear sections. Display financial figures in Indian Rupee format (₹ or Lakhs/Crores). Never make false medical, legal, or unverified physical mechanical claims.`;

  if (context && context.make) {
    prompt += `\n\n--- ACTIVE VEHICLE TELEMETRY CONTEXT ---
- Car: ${context.year || ''} ${context.make} ${context.model} ${context.variant || ''}
- Powertrain: ${context.fuelType || 'Unknown'} (${context.transmission || 'Unknown'})
- Current Odometer: ${context.currentOdometer ? context.currentOdometer.toLocaleString('en-IN') + ' km' : 'Not recorded'}
- Location: ${context.city || 'Unknown'}, ${context.state || 'India'}
- OBD-II Health Score: ${context.healthScore !== undefined ? context.healthScore + '/100' : '92/100'}
- Monthly Fuel Spend: ₹${context.monthlyFuelSpendINR ? context.monthlyFuelSpendINR.toLocaleString('en-IN') : 'Not logged'}
- Subsystem Health: ${context.subsystemStatuses ? JSON.stringify(context.subsystemStatuses) : 'Standard'}
- Compliance: PUC Expiry: ${context.pucExpiry || 'Valid'} | Insurance Expiry: ${context.insuranceExpiry || 'Valid'}
Use this vehicle context when the user asks questions relevant to their current car.`;
  }

  return prompt;
}

export const handler = async (event: any) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    };
  }

  // Rate Limiting
  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown-client';
  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        error: 'Too many requests. Please wait a few moments before sending another prompt.',
      }),
    };
  }

  try {
    let payload: RequestPayload;
    try {
      payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON request payload.' }),
      };
    }

    if (!payload.message || typeof payload.message !== 'string' || !payload.message.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'A valid non-empty "message" string is required.' }),
      };
    }

    const sanitizedMessage = sanitizeText(payload.message);

    // Retrieve server-side API key (never exposed in frontend)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

    if (!apiKey) {
      // Graceful signal to frontend to use built-in domain AI engine
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          source: 'fallback',
          message: 'GEMINI_API_KEY is not configured on the server. Falling back to AutoSphere Automotive Intelligence Engine.',
          useFallback: true,
        }),
      };
    }

    // Build Gemini contents
    const systemInstruction = buildSystemPrompt(payload.vehicleContext);

    // Map conversation history
    const contents: any[] = [];
    if (Array.isArray(payload.conversationHistory)) {
      payload.conversationHistory.slice(-8).forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: sanitizeText(msg.content) }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: sanitizedMessage }],
    });

    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.warn(`Gemini API returned status ${geminiResponse.status}: ${errorText}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          source: 'fallback',
          message: `Gemini API service note (${geminiResponse.status}). Using AutoSphere Automotive Intelligence Engine.`,
          useFallback: true,
        }),
      };
    }

    const geminiData = await geminiResponse.json();
    const candidateText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I have processed your query, but no response was returned by the model.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        source: 'gemini',
        model: modelName,
        text: candidateText,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (err: any) {
    console.error('Server error handling Gemini request:', err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        source: 'fallback',
        useFallback: true,
        message: 'Internal server error processing Gemini request. Using AutoSphere Automotive Intelligence Engine.',
      }),
    };
  }
};
