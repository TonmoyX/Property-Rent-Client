import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from "@heroui/react";
import { stripe } from '../../lib/stripe';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const {
    status,
    customer_details
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  const customerEmail = customer_details?.email || '';

  if (status === 'open') {
    return redirect('/');
  }

  return (
    <div className="w-full px-4 py-16 bg-gray-50 min-h-[85vh] flex items-center justify-center">
      <Card className="max-w-md w-full bg-white border border-gray-100 shadow-xl rounded-2xl p-8 text-center space-y-6">
        
        {/* Animated Checkmark Indicator Wrapper */}
        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner animate-pulse">
          ✓
        </div>

        {/* Messaging Hierarchy Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Payment Completed
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Transaction Processed Successfully Pool
          </p>
        </div>

        {/* Transaction Content Narrative Prose Block */}
        <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-4 text-xs font-medium text-gray-600 leading-relaxed text-left space-y-3">
          <p>
            We appreciate your business! A dynamic confirmation ledger receipt string will be dispatched to{' '}
            <span className="font-black text-gray-900">{customerEmail || 'your email account'}</span> shortly.
          </p>
          <p className="pt-2.5 border-t border-gray-200/60 text-gray-400 font-semibold">
            Encountering pipeline compilation discrepancies? Reach out via{' '}
            <a 
              href="mailto:orders@example.com" 
              className="text-orange-500 font-bold hover:underline transition-all"
            >
              orders@example.com
            </a>
          </p>
        </div>

        {/* Action Route Return Navigation Interfaces */}
        <div className="pt-2">
          {/* Solved: Wrapped with standard Link component without legacyBehavior or custom props */}
          <Link href="/allproperties" className="w-full block">
            <Button className="w-full bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl py-5 hover:bg-orange-500 transition-colors shadow-sm">
              Return to Registry Grid Listing
            </Button>
          </Link>
        </div>

      </Card>
    </div>
  );
}