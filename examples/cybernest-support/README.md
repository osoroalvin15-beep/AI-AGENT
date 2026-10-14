# CYBERNEST Support Agent

A customer support agent built with `ToolLoopAgent`. It can search a help center, look up orders (verified by email), create tickets and escalate to a human.

## Run

```shell
pnpm install
pnpm build:packages
cd examples/cybernest-support
cp .env.example .env   # add your ANTHROPIC_API_KEY
pnpm dev
```

Try: "How do I get a refund?", "Where is order CN-1001? my email is amina@example.com", "I was charged twice and I'm furious".

## Make it real

Replace the demo data in `src/data.ts` with calls to your database, M-Pesa records or helpdesk, and keep the verification rule in `lookupOrder`.
