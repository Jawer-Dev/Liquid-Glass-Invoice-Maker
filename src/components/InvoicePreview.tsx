import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Hash,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { TAX_TYPES } from '@/types/invoice';
import type { InvoiceData } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/hooks/useUserLocale';
import { cn } from '@/lib/utils';

interface InvoicePreviewProps {
  data: InvoiceData;
  className?: string;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data, className }, ref) => {
    const getTaxLabel = () => {
      const taxType = TAX_TYPES.find(t => t.value === data.taxType);
      return taxType?.label || 'Tax';
    };

    // Calculate totals with precision
    const subtotal = data.items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate);
    }, 0);

    const discountAmount = subtotal * (data.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = data.taxType !== 'none' ? afterDiscount * (data.taxRate / 100) : 0;
    const total = afterDiscount + taxAmount;

    return (
      <div 
        ref={ref}
        className={cn(
          'relative bg-white rounded-2xl overflow-hidden shadow-2xl',
          'print:shadow-none print:rounded-none',
          className
        )}
      >
        {/* Glass slab effect overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Top highlight */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }}
          />
          {/* Subtle inner glow */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 50%)' 
            }}
          />
        </div>

        {/* Invoice Content */}
        <div className="relative z-0 p-8 sm:p-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">INVOICE</h1>
                  <p className="text-slate-500 text-sm">Professional Billing</p>
                </div>
              </motion.div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Hash className="w-4 h-4" />
                <span className="font-medium">{data.invoiceNumber || 'INV-001'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(data.date, data.language)}</span>
              </div>
              {data.dueDate && (
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                  <span className="text-slate-400">Due:</span>
                  <span>{formatDate(data.dueDate, data.language)}</span>
                </div>
              )}
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            {/* From */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-50 rounded-xl p-5"
            >
              <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" />
                From
              </h3>
              <p className="font-semibold text-slate-900 mb-1">
                {data.fromName || 'Your Company'}
              </p>
              {data.fromEmail && (
                <p className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  {data.fromEmail}
                </p>
              )}
              {data.fromAddress && (
                <p className="flex items-start gap-2 text-slate-500 text-sm">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{data.fromAddress}</span>
                </p>
              )}
            </motion.div>

            {/* To */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-50 rounded-xl p-5"
            >
              <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <User className="w-3.5 h-3.5" />
                Bill To
              </h3>
              <p className="font-semibold text-slate-900 mb-1">
                {data.toName || 'Client Name'}
              </p>
              {data.toEmail && (
                <p className="flex items-center gap-2 text-slate-600 text-sm mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  {data.toEmail}
                </p>
              )}
              {data.toAddress && (
                <p className="flex items-start gap-2 text-slate-500 text-sm">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">{data.toAddress}</span>
                </p>
              )}
            </motion.div>
          </div>

          {/* Items Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider w-24">
                      Qty
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider w-32">
                      Rate
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + index * 0.05 }}
                      className={cn(
                        'border-b border-slate-100',
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      )}
                    >
                      <td className="py-4 px-4 text-slate-900">
                        {item.description || `Item ${index + 1}`}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600">
                        {formatCurrency(item.rate, data.currency, data.language)}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-slate-900">
                        {formatCurrency(item.quantity * item.rate, data.currency, data.language)}
                      </td>
                    </motion.tr>
                  ))}
                  {data.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No items added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Totals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end mb-8"
          >
            <div className="w-full sm:w-80 space-y-2">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal, data.currency, data.language)}</span>
              </div>
              
              {data.discount > 0 && (
                <div className="flex justify-between text-emerald-600 text-sm">
                  <span>Discount ({data.discount}%)</span>
                  <span className="font-medium">-{formatCurrency(discountAmount, data.currency, data.language)}</span>
                </div>
              )}
              
              {data.taxType !== 'none' && data.taxRate > 0 && (
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>{getTaxLabel()} ({data.taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(taxAmount, data.currency, data.language)}</span>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(total, data.currency, data.language)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {data.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-slate-50 rounded-xl p-5"
            >
              <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Notes
              </h3>
              <p className="text-slate-600 text-sm whitespace-pre-line">{data.notes}</p>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 pt-6 border-t border-slate-200 text-center"
          >
            <p className="text-slate-400 text-xs">
              Generated with Liquid Glass Invoice Manager
            </p>
          </motion.div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
