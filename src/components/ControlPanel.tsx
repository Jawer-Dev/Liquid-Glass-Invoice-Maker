import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Globe, 
  Coins, 
  RotateCcw,
  FileText,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlassCard } from './GlassCard';
import { CURRENCIES, TAX_TYPES } from '@/types/invoice';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  taxType: string;
  onTaxTypeChange: (taxType: 'vat' | 'gst' | 'sales' | 'none') => void;
  onDownloadPDF: () => void;
  onReset: () => void;
  isGenerating: boolean;
  className?: string;
}

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'es-ES', name: 'Español' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'zh-CN', name: '中文' },
  { code: 'ko-KR', name: '한국어' },
  { code: 'hi-IN', name: 'हिन्दी' },
  { code: 'ar-SA', name: 'العربية' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  taxType,
  onTaxTypeChange,
  onDownloadPDF,
  onReset,
  isGenerating,
  className,
}) => {
  return (
    <GlassCard className={cn('space-y-5', className)} intensity="high">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white/80" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Control Center</h3>
          <p className="text-white/50 text-xs">Customize your invoice</p>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
          <Coins className="w-3.5 h-3.5" />
          Currency
        </label>
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors rounded-xl h-11">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 rounded-xl max-h-64">
            {CURRENCIES.map((curr) => (
              <SelectItem 
                key={curr.code} 
                value={curr.code}
                className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{curr.symbol}</span>
                  <span>{curr.code}</span>
                  <span className="text-white/50 text-xs">- {curr.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5" />
          Language & Date Format
        </label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors rounded-xl h-11">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 rounded-xl max-h-64">
            {LANGUAGES.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white rounded-lg"
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tax Type Selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          Tax Type
        </label>
        <Select value={taxType} onValueChange={(v) => onTaxTypeChange(v as any)}>
          <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors rounded-xl h-11">
            <SelectValue placeholder="Select tax type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 rounded-xl">
            {TAX_TYPES.map((tax) => (
              <SelectItem 
                key={tax.value} 
                value={tax.value}
                className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white rounded-lg"
              >
                {tax.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-3 border-t border-white/10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button
            onClick={onDownloadPDF}
            disabled={isGenerating}
            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
              />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full h-11 bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </motion.div>
      </div>
    </GlassCard>
  );
};

export default ControlPanel;
