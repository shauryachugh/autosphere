// src/services/aiAssistantService.ts
// Client-Side AI Assistant Service for AutoSphere

import { ChatMessage } from '../types';
import { AutoSphereAIContext } from './aiContextService';
import { generateAutomotiveFallbackResponse, AIResponse } from './aiFallbackService';

export const STARTER_PROMPTS = [
  'Which car should I buy under ₹10 lakh?',
  "How can I reduce my car's ownership cost?",
  'Compare petrol and CNG for my driving habits.',
  'What maintenance does my car need?',
  'Should I keep my current car or replace it?',
  'Explain my vehicle health report.',
];

const STORAGE_KEY_PREFIX = 'autosphere_chat_history_';

class AIAssistantService {
  private getStorageKey(userId?: string): string {
    return `${STORAGE_KEY_PREFIX}${userId || 'guest'}`;
  }

  getChatHistory(userId?: string): ChatMessage[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.getStorageKey(userId));
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('Failed to parse chat history from localStorage:', e);
    }
    return [];
  }

  saveChatHistory(userId: string | undefined, messages: ChatMessage[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.getStorageKey(userId), JSON.stringify(messages));
      }
    } catch (e) {
      console.warn('Failed to save chat history to localStorage:', e);
    }
  }

  clearChatHistory(userId?: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.getStorageKey(userId));
      }
    } catch (e) {
      console.warn('Failed to clear chat history:', e);
    }
  }

  async sendMessage(
    query: string,
    context?: AutoSphereAIContext,
    conversationHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    // Attempt server-side Gemini endpoint (/api/gemini-chat or /.netlify/functions/gemini-chat)
    try {
      const endpoints = ['/api/gemini-chat', '/.netlify/functions/gemini-chat'];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: query,
              conversationHistory: conversationHistory.slice(-6).map(m => ({
                sender: m.sender,
                content: m.content,
              })),
              vehicleContext: context?.vehicle,
            }),
          });

          if (res.ok) {
            const data = await res.json();

            // If server-side indicates successful Gemini response
            if (data.source === 'gemini' && data.text && !data.useFallback) {
              const suggestions = this.deriveSuggestions(query);
              const structuredData = this.detectStructuredAttachment(query);

              return {
                content: data.text,
                structuredData,
                suggestions,
                source: 'gemini',
              };
            }

            // If server signaled to use fallback (e.g. GEMINI_API_KEY absent)
            if (data.useFallback) {
              break;
            }
          }
        } catch {
          // Continue to next endpoint or fallback
        }
      }
    } catch (err) {
      console.warn('Server endpoint unavailable, activating AutoSphere Automotive Intelligence Engine:', err);
    }

    // High-quality automotive fallback response
    return generateAutomotiveFallbackResponse(query, context);
  }

  private deriveSuggestions(query: string): string[] {
    const q = query.toLowerCase();
    if (q.includes('under 10') || q.includes('buy') || q.includes('price')) {
      return [
        'Compare Swift vs Punch for city commute',
        'Show CNG options under ₹10 Lakh',
        'Calculate monthly EMI for ₹8 Lakh car loan',
      ];
    }
    if (q.includes('cng') || q.includes('petrol') || q.includes('fuel')) {
      return [
        'Is CNG safe in hot Indian summers?',
        'Compare Tata iCNG dual-tank vs Maruti S-CNG',
        'Should I switch to Electric (EV) instead?',
      ];
    }
    if (q.includes('service') || q.includes('maintenance')) {
      return [
        'What oil grade prevents DPF ash buildup?',
        'How to maintain NCB when selling old car?',
        'Open Subsystem Health Tracker',
      ];
    }
    return [
      'Which car should I buy under ₹10 lakh?',
      'How can I reduce my car\'s ownership cost?',
      'What maintenance does my car need?',
      'Explain my vehicle health report',
    ];
  }

  private detectStructuredAttachment(query: string): ChatMessage['structuredData'] | undefined {
    const q = query.toLowerCase();
    if (q.includes('under 10') || q.includes('buy') || q.includes('budget')) {
      return {
        type: 'cost_estimate',
        title: 'Top Value Indian Passenger Cars (<₹10L)',
        items: [
          { label: 'Tata Punch Accomplished (Petrol MT)', value: '₹8.75 Lakh' },
          { label: 'Maruti Suzuki Swift ZXi (Petrol MT)', value: '₹8.49 Lakh' },
          { label: 'Hyundai Exter SX (Petrol MT)', value: '₹8.90 Lakh' },
          { label: 'Maruti Brezza LXi (Petrol MT)', value: '₹9.65 Lakh' },
        ],
        actionButton: {
          label: 'View On-Road Price Explorer',
          link: '/pricing',
        },
      };
    }
    if (q.includes('cng') || (q.includes('petrol') && q.includes('compare'))) {
      return {
        type: 'comparison',
        title: 'Petrol vs Factory CNG Economics',
        items: [
          { label: 'Petrol Running Cost', value: '₹6.85 / km' },
          { label: 'Factory CNG Running Cost', value: '₹3.35 / km' },
          { label: 'Monthly Savings (~1200 km)', value: '₹4,200 / mo' },
          { label: 'Annual Fuel Savings', value: '₹50,400 / yr' },
        ],
        actionButton: {
          label: 'Run 5-Year TCO Comparison',
          link: '/recommendations',
        },
      };
    }
    return undefined;
  }
}

export const aiAssistantService = new AIAssistantService();
