// Demo data. Replace these with calls to your real database / helpdesk / CRM.

export type Order = {
  id: string;
  email: string;
  status: 'processing' | 'shipped' | 'delivered' | 'refunded';
  item: string;
  total: string;
  eta?: string;
};

export const orders: Order[] = [
  {
    id: 'CN-1001',
    email: 'amina@example.com',
    status: 'shipped',
    item: 'CYBERNEST Pro plan (annual)',
    total: 'KES 12,000',
    eta: '2 days',
  },
  {
    id: 'CN-1002',
    email: 'brian@example.com',
    status: 'delivered',
    item: 'CYBERNEST Starter plan (monthly)',
    total: 'KES 1,500',
  },
];

export const knowledgeBase = [
  {
    topic: 'refunds',
    answer:
      'Refunds are available within 14 days of purchase. They are returned to the original payment method (M-Pesa or card) within 3-5 business days.',
  },
  {
    topic: 'password reset',
    answer:
      'Go to Settings > Security > Reset password. A reset link is sent to your registered email and expires after 30 minutes.',
  },
  {
    topic: 'billing',
    answer:
      'Plans renew automatically. You can cancel any time under Settings > Billing; access continues until the end of the paid period.',
  },
  {
    topic: 'payments mpesa',
    answer:
      'We accept M-Pesa and cards. If an M-Pesa payment was deducted but not confirmed, wait 10 minutes, then contact support with the M-Pesa confirmation code.',
  },
];
