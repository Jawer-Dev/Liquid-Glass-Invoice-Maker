import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { ControlPanel } from '@/components/ControlPanel';
import { MeshGradient } from '@/components/MeshGradient';
import { GlassCard } from '@/components/GlassCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUserLocale } from '@/hooks/useUserLocale';
import type { InvoiceData } from '@/types/invoice';
import { Toaster, toast } from 'sonner';

const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  fromName: '',
  fromEmail: '',
  fromAddress: '',
  toName: '',
  toEmail: '',
  toAddress: '',
  items: [
    { id: 'item-1', description: '', quantity: 1, rate: 0 },
  ],
  notes: '',
  discount: 0,
  taxRate: 0,
  taxType: 'none',
  currency: 'USD',
  language: 'en-US',
};

function App() {
  const previewRef = useRef<HTMLDivElement>(null);
  const userLocale = useUserLocale();
  
  // LocalStorage with draft system
  const [invoiceData, setInvoiceData, isLoaded] = useLocalStorage<InvoiceData>('invoice-draft', DEFAULT_INVOICE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  // Auto-set currency and language from user locale on first load
  useEffect(() => {
    if (isLoaded && invoiceData.currency === 'USD' && userLocale.currency !== 'USD') {
      setInvoiceData(prev => ({
        ...prev,
        currency: userLocale.currency,
        language: userLocale.language,
      }));
    }
  }, [isLoaded, userLocale]);

  // Show saved indicator on changes
  useEffect(() => {
    if (isLoaded) {
      setShowSavedIndicator(true);
      const timer = setTimeout(() => setShowSavedIndicator(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [invoiceData, isLoaded]);

  // Calculate totals with precision
  const calculations = useMemo(() => {
    const subtotal = invoiceData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate);
    }, 0);

    const discountAmount = subtotal * (invoiceData.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = invoiceData.taxType !== 'none' 
      ? afterDiscount * (invoiceData.taxRate / 100) 
      : 0;
    const total = afterDiscount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  }, [invoiceData.items, invoiceData.discount, invoiceData.taxRate, invoiceData.taxType]);

  // PDF Generation
  const generatePDF = useCallback(async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    
    try {
      toast.loading('Generating your PDF...', { id: 'pdf-gen' });

      // Wait for any animations to settle
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(previewRef.current, {
        scale: 3, // High quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: previewRef.current.scrollWidth,
        windowHeight: previewRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions (A4)
      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit content on page
      const scale = Math.min(
        (pdfWidth - 20) / (imgWidth * 0.264583), // Convert px to mm
        (pdfHeight - 20) / (imgHeight * 0.264583)
      );
      
      const scaledWidth = imgWidth * 0.264583 * scale;
      const scaledHeight = imgHeight * 0.264583 * scale;
      
      // Center the content
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = 10;

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.addImage(
        imgData,
        'PNG',
        xOffset,
        yOffset,
        scaledWidth,
        scaledHeight,
        undefined,
        'FAST'
      );

      const fileName = `Invoice-${invoiceData.invoiceNumber || '001'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-gen' });
    } finally {
      setIsGenerating(false);
    }
  }, [invoiceData.invoiceNumber]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    if (confirm('Are you sure you want to reset all fields? This will clear your draft.')) {
      setInvoiceData({
        ...DEFAULT_INVOICE,
        currency: userLocale.currency,
        language: userLocale.language,
      });
      toast.success('Invoice reset to default');
    }
  }, [setInvoiceData, userLocale]);

  // Update handlers
  const handleCurrencyChange = useCallback((currency: string) => {
    setInvoiceData(prev => ({ ...prev, currency }));
  }, [setInvoiceData]);

  const handleLanguageChange = useCallback((language: string) => {
    setInvoiceData(prev => ({ ...prev, language }));
  }, [setInvoiceData]);

  const handleTaxTypeChange = useCallback((taxType: 'vat' | 'gst' | 'sales' | 'none') => {
    setInvoiceData(prev => ({ ...prev, taxType }));
  }, [setInvoiceData]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <MeshGradient />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Liquid Glass Invoice Maker
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </h1>
                <p className="text-white/50 text-sm">Global Invoice Maker</p>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {showSavedIndicator && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Draft saved
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Form */}
            <div className="xl:col-span-5 space-y-6">
              <InvoiceForm 
                data={invoiceData} 
                onChange={setInvoiceData}
              />
            </div>

            {/* Right Column - Preview & Controls */}
            <div className="xl:col-span-7 space-y-6">
              {/* Control Panel */}
              <ControlPanel
                currency={invoiceData.currency}
                onCurrencyChange={handleCurrencyChange}
                language={invoiceData.language}
                onLanguageChange={handleLanguageChange}
                taxType={invoiceData.taxType}
                onTaxTypeChange={handleTaxTypeChange}
                onDownloadPDF={generatePDF}
                onReset={resetToDefault}
                isGenerating={isGenerating}
              />

              {/* Live Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Live Preview
                  </h2>
                  <p className="text-white/40 text-xs">This is how your invoice will look</p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  {/* Glow effect behind preview */}
                  <div 
                    className="absolute -inset-2 rounded-3xl opacity-30 blur-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.4) 100%)',
                    }}
                  />
                  
                  <InvoicePreview 
                    ref={previewRef}
                    data={invoiceData}
                    className="relative"
                  />
                </motion.div>
              </div>

              {/* Quick Stats */}
              <GlassCard intensity="low" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Subtotal</p>
                  <p className="text-white font-semibold text-lg">
                    {new Intl.NumberFormat(invoiceData.language, {
                      style: 'currency',
                      currency: invoiceData.currency,
                      maximumFractionDigits: 0,
                    }).format(calculations.subtotal)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Discount</p>
                  <p className="text-emerald-400 font-semibold text-lg">
                    -{new Intl.NumberFormat(invoiceData.language, {
                      style: 'currency',
                      currency: invoiceData.currency,
                      maximumFractionDigits: 0,
                    }).format(calculations.discountAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Tax</p>
                  <p className="text-white font-semibold text-lg">
                    {new Intl.NumberFormat(invoiceData.language, {
                      style: 'currency',
                      currency: invoiceData.currency,
                      maximumFractionDigits: 0,
                    }).format(calculations.taxAmount)}
                  </p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Total</p>
                  <p className="text-indigo-400 font-bold text-xl">
                    {new Intl.NumberFormat(invoiceData.language, {
                      style: 'currency',
                      currency: invoiceData.currency,
                      maximumFractionDigits: 0,
                    }).format(calculations.total)}
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/30 text-sm">
            Liquid Glass Invoice Maker · Crafted with 💖 by Jawer-Dev · {new Date().getFullYear()} © All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
