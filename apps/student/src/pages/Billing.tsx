import React from 'react';
import { useMockState } from '@bluerobins/api';
import { Card, CardContent, Button, Badge } from '@bluerobins/ui';
import { formatCurrency, formatDate } from '@bluerobins/utils';
import { ShieldCheck, Receipt, ArrowRight } from 'lucide-react';

export default function Billing() {
  const { enrollments, projects } = useMockState();

  const billingItems = enrollments.map((enroll) => {
    const proj = projects.find((p) => p.id === enroll.projectId);
    return {
      id: enroll.id,
      projectName: proj?.title || 'Unknown Project',
      amount: 499, // default mock tuition cost per project
      status: enroll.status,
      date: enroll.enrolledAt,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing & Plans</h1>
        <p className="text-slate-500 text-sm mt-1">Manage project payments, purchase history and refund invoices.</p>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Payment History List */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <div className="px-6 py-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#354E80]" /> Purchase History
              </h3>
            </div>
            
            <div className="divide-y divide-slate-50">
              {billingItems.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 leading-snug">{item.projectName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Transaction ID: TXN-{item.id.toUpperCase()}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-800">{formatCurrency(item.amount)}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{formatDate(item.date)}</p>
                    </div>

                    <Badge variant={
                      item.status === 'completed' || item.status === 'active' ? 'success' : 'danger'
                    }>
                      {item.status === 'active' ? 'Paid' : item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pricing & Refund Policy Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#354E80] text-slate-100">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">BlueRobins Rate</p>
                <h3 className="text-2xl font-extrabold text-white">Pay Per Project</h3>
              </div>

              <div className="text-2xl font-extrabold text-white">
                {formatCurrency(499)} <span className="text-xs text-slate-300 font-medium">/ 8-Weeks Plan</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Enrollment fees cover 8 weekly live sessions, unlimited messaging, files uploads, and grading certificates.
              </p>

              <div className="border-t border-white/10 pt-4 flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Secure Payments with Stripe</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 text-xs text-slate-500 leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-700">Refund Guarantee</h4>
              <p className="font-medium">
                We offer a full 100% refund policy within the first week of any project starting if you are unsatisfied with your mentor pairing or schedule constraints.
              </p>
              <a href="/help" className="text-[#354E80] font-bold inline-flex items-center gap-1 hover:underline pt-1">
                Contact Support <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
