import React, { useState } from 'react';
import { 
  Store as StoreIcon, 
  Shield, 
  ShieldAlert, 
  Camera, 
  Check, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  Phone, 
  TrendingUp, 
  UploadCloud, 
  FileText,
  CheckCircle2,
  Zap,
  Tag
} from 'lucide-react';
import type { Store, Product } from '../types';

interface MerchantSnapSyncProps {
  stores: Store[];
  onStoreUpdate: (updatedStore: Store) => void;
}

export const MerchantSnapSync: React.FC<MerchantSnapSyncProps> = ({
  stores,
  onStoreUpdate
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || 'store-1');
  const [invoiceText, setInvoiceText] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [isTogglingRush, setIsTogglingRush] = useState(false);

  const currentStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

  if (!currentStore) {
    return <div className="p-8 text-center text-slate-400">Loading merchant records...</div>;
  }

  // Toggle Rush Shield on backend
  const handleToggleRushMode = async () => {
    setIsTogglingRush(true);
    try {
      const res = await fetch(`/api/merchants/${currentStore.id}/rush-mode`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        const updatedStore = {
          ...currentStore,
          isRushMode: data.isRushMode,
          rushMultiplier: data.isRushMode ? 1.4 : 1.0,
          rejectionRate: data.isRushMode ? Math.max(2, currentStore.rejectionRate - 8) : currentStore.rejectionRate
        };
        onStoreUpdate(updatedStore);
      }
    } catch (err) {
      console.error('Rush mode error', err);
    } finally {
      setIsTogglingRush(false);
    }
  };

  // Update single item stock manually
  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const res = await fetch(`/api/merchants/${currentStore.id}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, newStock })
      });
      if (res.ok) {
        const data = await res.json();
        const updatedProducts = currentStore.products.map((p) =>
          p.id === productId ? data.product : p
        );
        const updatedStore = {
          ...currentStore,
          products: updatedProducts,
          inventoryAccuracy: data.storeAccuracy
        };
        onStoreUpdate(updatedStore);
      }
    } catch (err) {
      console.error('Stock update error', err);
    }
  };

  // Run AI SnapSync
  const handleRunSnapSync = async (sampleText?: string) => {
    const textToScan = sampleText || invoiceText;
    if (!textToScan.trim()) {
      alert('Please enter or select restock text to scan.');
      return;
    }

    setIsScanning(true);
    setScanSuccessMessage(null);
    try {
      const res = await fetch('/api/inventory/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: currentStore.id,
          invoiceText: textToScan
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local store with restocked items
        const updatedProducts = currentStore.products.map((p, idx) => {
          if (data.parsedUpdates[idx]) {
            return {
              ...p,
              stock: data.parsedUpdates[idx].quantity,
              ghostRiskScore: 6,
              lastUpdated: 'Just now (SnapSync AI Verified)'
            };
          }
          return p;
        });

        const updatedStore = {
          ...currentStore,
          products: updatedProducts,
          inventoryAccuracy: data.updatedAccuracy,
          partnerSentiment: 'Loyal Partner' as const
        };
        onStoreUpdate(updatedStore);
        setScanSuccessMessage(data.message);
        setInvoiceText('');
      }
    } catch (err) {
      console.error('SnapSync error', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Store Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <StoreIcon className="w-4 h-4" />
              <span>Partner Store Terminal & Inventory Shield</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Serving 620 Local Retailers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Merchant SnapSync & Rush-Shield
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              39% of partner stores struggle to maintain online inventory, leading to ghost stock cancellations. 
              SnapSync lets merchants update stock in 3 seconds from bills or voice, while Rush-Shield protects them during counter rush.
            </p>
          </div>

          {/* Store Switcher */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col gap-1.5 shrink-0 min-w-[280px]">
            <label className="text-[11px] text-slate-400 font-medium px-2">
              Select Store Terminal:
            </label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              aria-label="Select Store Terminal"
              className="bg-slate-900 border border-slate-700 text-amber-300 font-semibold rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.locality}, {s.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Store Status Card & Rush Shield Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Store Quick Bio */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={currentStore.bannerImage}
              alt={currentStore.name}
              className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">{currentStore.name}</h2>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {currentStore.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentStore.locality}, {currentStore.city} • Managed by {currentStore.ownerName}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div>
                  <span className="text-slate-500">Live Inventory Accuracy:</span>{' '}
                  <span className={`font-mono font-bold ${
                    currentStore.inventoryAccuracy >= 85 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {currentStore.inventoryAccuracy}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Rejection Rate:</span>{' '}
                  <span className={`font-mono font-bold ${
                    currentStore.rejectionRate > 10 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {currentStore.rejectionRate}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Sentiment:</span>{' '}
                  <span className="font-semibold text-slate-200">
                    {currentStore.partnerSentiment}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rush Shield Action Box */}
          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentStore.isRushMode ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                ) : (
                  <Shield className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-white">
                    Rush Shield {currentStore.isRushMode ? '(ACTIVE)' : '(STANDBY)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {currentStore.isRushMode
                      ? 'In-store peak rush: Delivery ETA auto-extended by 12m'
                      : 'Standard delivery time (12 min prep)'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleRushMode}
                disabled={isTogglingRush}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                  currentStore.isRushMode
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isTogglingRush ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : currentStore.isRushMode ? (
                  'Turn Off Shield'
                ) : (
                  'Activate 1-Tap Rush'
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Prevents the 18% store rejection cancellations without forcing store owners to reject online orders.
            </p>
          </div>
        </div>
      </div>

      {/* SnapSync AI Bill & Stock Scanner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                SnapSync AI: 3-Second Receipt & Restock Scanner
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Store owners don't have time for manual ERP entry. Paste or type invoice/restock notes below, or click a quick restock preset to run Gemini AI catalog sync.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunSnapSync('Morning Batch Restock: Sourdough 18 units, Red Velvet Cupcakes 15 units, French Butter Croissant 25 units')}
              disabled={isScanning}
              className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              + Quick Restock Morning Batch
            </button>
            <button
              onClick={() => handleRunSnapSync('Evening Kitchen Restock: Sourdough 25 units, Red Velvet Cupcakes 20 units, French Butter Croissant 30 units')}
              disabled={isScanning}
              className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              + Evening Fresh Supply
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={invoiceText}
              onChange={(e) => setInvoiceText(e.target.value)}
              placeholder="e.g. Invoice #8491: 20 pcs Country Sourdough, 15 pcs Red Velvet, 30 pcs Normandy Croissants delivered by vendor."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              <span>Camera OCR & Text Engine (Gemini 3.8 Flash Powered)</span>
            </div>

            <button
              onClick={() => handleRunSnapSync()}
              disabled={isScanning || !invoiceText.trim()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing Bill via Gemini AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute SnapSync</span>
                </>
              )}
            </button>
          </div>

          {scanSuccessMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{scanSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Inventory & Ghost Risk Meter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Live Shelf Inventory & Ghost Risk Index</span>
            </h3>
            <p className="text-xs text-slate-400">
              Items with high Ghost Risk trigger automated re-verification alerts before online orders are placed.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {currentStore.products.length} Active SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 pl-2">Product & Specialty</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Live Stock</th>
                <th className="pb-3">Ghost Stock Risk</th>
                <th className="pb-3">Est. Daily Demand</th>
                <th className="pb-3">Last Verified</th>
                <th className="pb-3 pr-2 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentStore.products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                      />
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{product.name}</span>
                          {product.isSpecialty && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ★ Specialty
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{product.unit}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-slate-300">{product.category}</td>
                  
                  <td className="py-3 font-mono font-bold text-white">
                    ₹{product.price}
                  </td>

                  <td className="py-3">
                    <span className={`font-mono font-bold text-sm ${
                      product.stock <= 3 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {product.stock}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">in stock</span>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.ghostRiskScore > 50
                              ? 'bg-rose-500'
                              : product.ghostRiskScore > 20
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, product.ghostRiskScore)}%` }}
                        ></div>
                      </div>
                      <span className={`font-mono text-[11px] font-semibold ${
                        product.ghostRiskScore > 50 ? 'text-rose-400' : 'text-slate-300'
                      }`}>
                        {product.ghostRiskScore > 50 ? 'High Risk' : `${product.ghostRiskScore}%`}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 font-mono text-slate-400">
                    ~{product.dailyDemandEst} units/day
                  </td>

                  <td className="py-3 text-[11px] text-slate-400">
                    {product.lastUpdated}
                  </td>

                  <td className="py-3 pr-2 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-white">
                        {product.stock}
                      </span>
                      <button
                        onClick={() => handleUpdateStock(product.id, product.stock + 5)}
                        className="px-2 h-6 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center transition-colors"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
