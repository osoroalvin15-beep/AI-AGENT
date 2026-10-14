import { anthropic } from '@ai-sdk/anthropic';
import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { knowledgeBase, orders } from './data.js';

const tickets: Array<{ id: string; email: string; summary: string }> = [];

export const supportAgent = new ToolLoopAgent({
  model: anthropic(process.env.SUPPORT_MODEL ?? 'claude-sonnet-5-5'),
  instructions: `You are the customer support agent for CYBERNEST, a live AI intelligence platform.

Rules:
- Be friendly, concise and clear. Answer in the customer's language.
- Use searchKnowledgeBase for policy and how-to questions. Never invent policies.
- Use lookupOrder only when the customer gives an order ID AND the email on the order. Never reveal order details if the email does not match.
- If you cannot resolve the issue, call createTicket, then tell the customer the ticket ID.
- Call escalateToHuman for refund disputes, angry customers, legal threats, or anything involving account security.
- If you don't know, say so. Do not guess.`,
  tools: {
    searchKnowledgeBase: tool({
      description: 'Search help-center articles for policies and how-to answers.',
      inputSchema: z.object({
        query: z.string().describe('What the customer is asking about'),
      }),
      execute: async ({ query }) => {
        const q = query.toLowerCase();
        const hits = knowledgeBase.filter(a =>
          a.topic.split(' ').some(word => q.includes(word)),
        );
        return hits.length > 0
          ? hits
          : { message: 'No matching article found.' };
      },
    }),
    lookupOrder: tool({
      description:
        'Look up an order. Requires the order ID and the email used for the order.',
      inputSchema: z.object({
        orderId: z.string(),
        email: z.string().email(),
      }),
      execute: async ({ orderId, email }) => {
        const order = orders.find(
          o =>
            o.id.toLowerCase() === orderId.toLowerCase() &&
            o.email.toLowerCase() === email.toLowerCase(),
        );
        return order ?? { error: 'No order found for that ID and email.' };
      },
    }),
    createTicket: tool({
      description: 'Create a support ticket for follow-up by the team.',
      inputSchema: z.object({
        email: z.string().email(),
        summary: z.string().describe('Short summary of the issue'),
      }),
      execute: async ({ email, summary }) => {
        const id = `T-${String(tickets.length + 1).padStart(4, '0')}`;
        tickets.push({ id, email, summary });
        return { ticketId: id, status: 'open' };
      },
    }),
    escalateToHuman: tool({
      description:
        'Hand the conversation to a human agent. Use for disputes, security issues or upset customers.',
      inputSchema: z.object({
        reason: z.string(),
      }),
      execute: async ({ reason }) => {
        console.log(`\n[escalated to human] ${reason}`);
        return { escalated: true, message: 'A human agent will contact the customer shortly.' };
      },
    }),
  },
  stopWhen: stepCountIs(8),
});
