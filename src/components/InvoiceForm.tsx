import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  GripVertical,
  Building2,
  User,
  Mail,
  MapPin,
  Calendar,
  Hash,
  Percent,
  StickyNote,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from './GlassCard';
import type { InvoiceData, InvoiceItem } from '@/types/invoice';
import { cn } from '@/lib/utils';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  className?: string;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange, className }) => {
  const updateField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: '',
      quantity: 1,
      rate: 0,
    };
    updateField('items', [...data.items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    updateField(
      'items',
      data.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    updateField(
      'items',
      data.items.filter((item) => item.id !== id)
    );
  };

  const reorderItems = (newOrder: InvoiceItem[]) => {
    updateField('items', newOrder);
  };

  return (
    <GlassCard className={cn('space-y-6', className)} intensity="medium">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
          <Package className="w-5 h-5 text-white/80" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Invoice Details</h3>
          <p className="text-white/50 text-xs">Fill in your invoice information</p>
        </div>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <Hash className="w-3.5 h-3.5" />
            Invoice #
          </Label>
          <Input
            value={data.invoiceNumber}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
            placeholder="INV-001"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Date
          </Label>
          <Input
            type="date"
            value={data.date}
            onChange={(e) => updateField('date', e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20 [color-scheme:dark]"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Due Date
          </Label>
          <Input
            type="date"
            value={data.dueDate}
            onChange={(e) => updateField('dueDate', e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* From Section */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-white/90 text-sm font-semibold">
          <Building2 className="w-4 h-4 text-indigo-400" />
          From
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              Your Name / Company
            </Label>
            <Input
              value={data.fromName}
              onChange={(e) => updateField('fromName', e.target.value)}
              placeholder="Acme Inc."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              Email
            </Label>
            <Input
              type="email"
              value={data.fromEmail}
              onChange={(e) => updateField('fromEmail', e.target.value)}
              placeholder="you@company.com"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            Address
          </Label>
          <Textarea
            value={data.fromAddress}
            onChange={(e) => updateField('fromAddress', e.target.value)}
            placeholder="123 Business St, City, Country"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl min-h-[80px] resize-none focus:border-white/40 focus:ring-white/20"
          />
        </div>
      </div>

      {/* To Section */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-white/90 text-sm font-semibold">
          <User className="w-4 h-4 text-purple-400" />
          Bill To
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              Client Name
            </Label>
            <Input
              value={data.toName}
              onChange={(e) => updateField('toName', e.target.value)}
              placeholder="Client Company"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              Client Email
            </Label>
            <Input
              type="email"
              value={data.toEmail}
              onChange={(e) => updateField('toEmail', e.target.value)}
              placeholder="client@example.com"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            Client Address
          </Label>
          <Textarea
            value={data.toAddress}
            onChange={(e) => updateField('toAddress', e.target.value)}
            placeholder="456 Client Ave, City, Country"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl min-h-[80px] resize-none focus:border-white/40 focus:ring-white/20"
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-white/90 text-sm font-semibold">
            <Package className="w-4 h-4 text-emerald-400" />
            Line Items
          </h4>
          <span className="text-white/40 text-xs">
            Drag to reorder
          </span>
        </div>

        <Reorder.Group axis="y" values={data.items} onReorder={reorderItems} className="space-y-2">
          {data.items.map((item, index) => (
            <Reorder.Item
              key={item.id}
              value={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileDrag={{ scale: 1.02, zIndex: 10 }}
            >
              <motion.div
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-3 transition-all duration-200"
                layout
              >
                <div className="flex items-start gap-2">
                  <div className="pt-2 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-white/30 group-hover:text-white/50" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder={`Item ${index + 1} description`}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-lg h-10 focus:border-white/40 focus:ring-white/20"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        placeholder="Qty"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-lg h-10 focus:border-white/40 focus:ring-white/20"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate || ''}
                        onChange={(e) => updateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                        placeholder="Rate"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-lg h-10 focus:border-white/40 focus:ring-white/20"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="pt-2 p-1 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button
            onClick={addItem}
            variant="outline"
            className="w-full h-11 bg-white/5 border-white/20 border-dashed text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40 rounded-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Line Item
          </Button>
        </motion.div>
      </div>

      {/* Discount & Tax */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5" />
            Discount (%)
          </Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={data.discount || ''}
            onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5" />
            Tax Rate (%)
          </Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={data.taxRate || ''}
            onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl h-11 focus:border-white/40 focus:ring-white/20"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
          <StickyNote className="w-3.5 h-3.5" />
          Notes
        </Label>
        <Textarea
          value={data.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Thank you for your business! Payment is due within 30 days."
          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-xl min-h-[100px] resize-none focus:border-white/40 focus:ring-white/20"
        />
      </div>
    </GlassCard>
  );
};

export default InvoiceForm;
