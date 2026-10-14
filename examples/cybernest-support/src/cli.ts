import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import type { ModelMessage } from 'ai';
import { supportAgent } from './agent.js';

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY. Copy .env.example to .env and set it.');
    process.exit(1);
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const messages: ModelMessage[] = [];

  console.log('CYBERNEST Support. Type "exit" to quit.\n');

  while (true) {
    const input = (await rl.question('You: ')).trim();
    if (!input) continue;
    if (input.toLowerCase() === 'exit') break;

    messages.push({ role: 'user', content: input });
    const result = await supportAgent.generate({ messages });
    messages.push(...result.response.messages);

    console.log(`\nSupport: ${result.text}\n`);
  }

  rl.close();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
