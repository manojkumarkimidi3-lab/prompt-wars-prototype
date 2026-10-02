import React, { useState, useEffect } from 'react';
import { 
  Store as StoreIcon, 
  ShieldAlert, 
  Shield, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Package, 
  Tag, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Layers
} from 'lucide-react';
import type { StoreIntelligenceOutput } from '../../lib/ai/schemas';

interface StoreIntelligenceViewProps {
  currentUser: any;
}

export const StoreIntelligenceView: React.FC<StoreIntelligenceViewProps> = ({
  currentUser
}) => {
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-1');
  const [storeIntelligence, setStoreIntelligence] = useState<StoreIntelligenceOutput | null>(null);
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);
  const [invoiceText, setInvoiceText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores);
      }
    } catch (err) {
      console.error('Failed to load stores', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  const handleToggleRush = async () => {
    if (!currentStore) return;
    try {
      const res = await fetch(`/api/stores/${currentStore.id}/rush-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token_store'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStores(prev => prev.map(s => s.id === currentStore.id ? { ...s, isRushMode: data.isRushMode } : s));
      }
    } catch (err) {
      console.error('Rush toggle failed', err);
    }
  };

  const handleUpdateStock = async (productId: string, currentStock: number) => {
    if (!currentStore) return;
    try {
      const res = await fetch(`/api/stores/${currentStore.id}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token_store'
        },
        body: JSON.stringify({ productId, currentStock })
      });
      if (res.ok) {
        const data = await res.json();
        setStores(prev => prev.map(s => {
          if (s.id === currentStore.id) {
            return {
              ...s,
              products: s.products.map((p: any) => p.id === productId ? data.product : p)
            };
          }
          return s;
        }));
      }
    } catch (err) {
      console.error('Stock update failed', err);
    }
  };

  const handleGenerateIntelligence = async () => {
    if (!currentStore) return;
    setIsLoadingIntel(true);
    try {
      const res = await fetch(`/api/stores/${currentStore.id}/intelligence`, {
        headers: { 'Authorization': 'Bearer test_token_store' }
      });
      if (res.ok) {
        const data = await res.json();
        setStoreIntelligence(data.intelligence);
      }
    } catch (err) {
      console.error('Intelligence failed', err);
    } finally {
      setIsLoadingIntel(false);
    }
  };

  const handleRunSnapSync = async (textToScan: string) => {
    if (!currentStore) return;
    setIsScanning(true);
    setScanMessage(null);
    try {
      const res = await fetch('/api/inventory/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: currentStore.id, invoiceText: textToScan })
      });
      if (res.ok) {
        const data = await res.json();
        setScanMessage(data.message);
        fetchStores();
        setInvoiceText('');
      }
    } catch (err) {
      console.error('SnapSync failed', err);
    } finally {
      setIsScanning(false);
    }
  };

  if (!currentStore) {
    return <div className="p-8 text-center text-[#64748b] font-medium">Loading store intelligence...</div>;
  }

  // Calculate unavailable and high-risk products
  const products = currentStore.products || [];
  const unavailableProducts = products.filter((p: any) => p.currentStock === 0);
  const highRiskProducts = products.filter((p: any) => p.ghostRiskScore > 40);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#b45309] font-extrabold uppercase tracking-wider mb-2">
              <StoreIcon className="w-4 h-4 text-[#d97706]" />
              <span>Partner Store OS • Journey 3</span>
              <span className="text-[#ebd99f]">•</span>
              <span className="text-[#475569]">Empowering 620 Neighborhood Retailers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
              Store Intelligence & Rush Shield Terminal
            </h1>
            <p className="mt-2 text-sm text-[#334155] max-w-3xl leading-relaxed font-medium">
              39% of local store owners reported that maintaining digital catalogues took more effort than orders were worth.
              Nova Rescue provides 3-second SnapSync stock ingestion and 1-tap Rush Shield to eliminate the 18% store rejection rate.
            </p>
          </div>

          {/* Store Switcher */}
          <div className="bg-[#fef9e7] p-3 rounded-2xl border-1.5 border-[#ebd99f] flex flex-col gap-1.5 shrink-0 min-w-[280px] shadow-2xs">
            <label className="text-[11px] text-[#b45309] font-extrabold px-1">
              Select Store Terminal:
            </label>
            <select
              value={selectedStoreId}
              onChange={(e) => {
                setSelectedStoreId(e.target.value);
                setStoreIntelligence(null);
                setScanMessage(null);
              }}
              aria-label="Select Store"
              className="bg-white border-1.5 border-[#ebd99f] text-[#0f172a] font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#d97706] cursor-pointer shadow-2xs"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.locality})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Store Operational Health Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-5 shadow-cream">
          <span className="text-[11px] text-[#64748b] font-bold">Inventory Confidence</span>
          <div className="text-2xl font-black text-[#059669] font-mono mt-1">
            {currentStore.inventoryAccuracy}%
          </div>
          <span className="text-[10px] text-[#64748b] mt-1 block font-medium">Live shelf accuracy index</span>
        </div>

        <div className="bg-white border-1.5 border-[#fecdd3] rounded-2xl p-5 shadow-cream">
          <span className="text-[11px] text-[#e11d48] font-black">Order Rejection Rate</span>
          <div className="text-2xl font-black text-[#e11d48] font-mono mt-1">
            {currentStore.rejectionRate}%
          </div>
          <span className="text-[10px] text-[#e11d48]/70 mt-1 block font-bold">During counter peak hours</span>
        </div>

        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-5 shadow-cream">
          <span className="text-[11px] text-[#64748b] font-bold">Unavailable Products</span>
          <div className="text-2xl font-black text-[#e11d48] font-mono mt-1">
            {unavailableProducts.length} items
          </div>
          <span className="text-[10px] text-[#64748b] mt-1 block font-medium">Shelf stockout count</span>
        </div>

        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-5 shadow-cream">
          <span className="text-[11px] text-[#64748b] font-bold">High Ghost Risk SKUs</span>
          <div className="text-2xl font-black text-[#b45309] font-mono mt-1">
            {highRiskProducts.length} items
          </div>
          <span className="text-[10px] text-[#64748b] mt-1 block font-medium">Risk score &gt; 40%</span>
        </div>
      </div>

      {/* Rush Shield 1-Tap Toggle Banner */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-cream">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            currentStore.isRushMode
              ? 'bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-white font-black animate-pulse shadow-md shadow-amber-500/30'
              : 'bg-[#fef9e7] border-1.5 border-[#ebd99f] text-[#d97706]'
          }`}>
            {currentStore.isRushMode ? <ShieldAlert className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#0f172a] font-heading">
                Rush Shield {currentStore.isRushMode ? '(ACTIVATED)' : '(STANDBY)'}
              </h3>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black ${
                currentStore.isRushMode
                  ? 'bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3]'
                  : 'bg-[#fef9e7] text-[#b45309] border border-[#ebd99f]'
              }`}>
                {currentStore.isRushMode ? 'Busy Mode On (+12m ETA)' : 'Normal Prep Time'}
              </span>
            </div>
            <p className="text-xs text-[#475569] mt-0.5 max-w-2xl leading-relaxed font-medium">
              When in-store walk-in counter gets busy, 1-tap Rush Shield automatically extends online delivery promises by 12 minutes, 
              protecting the store from rejecting incoming orders.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleRush}
          className={`px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 ${
            currentStore.isRushMode
              ? 'bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3] hover:bg-[#ffe4e6]/80'
              : 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-amber-500/25 hover:shadow-lg'
          }`}
        >
          {currentStore.isRushMode ? 'Deactivate Rush Shield' : 'Activate 1-Tap Rush Shield'}
        </button>
      </div>

      {/* SnapSync 3-Second Bill / Receipt Scanner */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d97706]" />
              <h3 className="text-base font-black text-[#0f172a] font-heading">
                SnapSync: 3-Second AI Bill & Invoice Scanner
              </h3>
            </div>
            <p className="text-xs text-[#475569] mt-0.5 font-medium">
              Paste vendor restock bills or voice notes below. Gemini extracts SKUs and syncs shelf stock in 3 seconds.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleRunSnapSync('Morning Restock: 20 units Country Sourdough, 15 units Red Velvet, 25 Croissants')}
              disabled={isScanning}
              className="bg-[#fef9e7] hover:bg-white text-[#b45309] border border-[#ebd99f] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              + Morning Restock Invoice
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={2}
            value={invoiceText}
            onChange={(e) => setInvoiceText(e.target.value)}
            placeholder="e.g. Invoice #991: Restocked 25 Sourdough loaves, 20 Red Velvet cupcakes, 30 Butter croissants"
            className="w-full bg-[#fef9e7] border-1.5 border-[#ebd99f] rounded-2xl p-3.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#d97706] font-mono shadow-2xs font-medium"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748b] font-medium flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Camera OCR & Bill Engine (Gemini 3.8 Flash Powered)</span>
            </span>

            <button
              onClick={() => handleRunSnapSync(invoiceText)}
              disabled={isScanning || !invoiceText.trim()}
              className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 disabled:opacity-50 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing via Gemini AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span>Sync Catalog Now</span>
                </>
              )}
            </button>
          </div>

          {scanMessage && (
            <div className="p-3.5 bg-[#ecfdf5] border-1.5 border-[#a7f3d0] rounded-xl text-xs text-[#059669] flex items-center gap-2 font-bold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Store Intelligence Advisor */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d97706]" />
            <h3 className="text-base font-black text-[#0f172a] font-heading">AI Store Intelligence & Catalogue Advisory</h3>
          </div>

          <button
            onClick={handleGenerateIntelligence}
            disabled={isLoadingIntel}
            className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 disabled:opacity-50 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all"
          >
            {isLoadingIntel ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Store Health...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Store Intelligence</span>
              </>
            )}
          </button>
        </div>

        {storeIntelligence ? (
          <div className="bg-[#fef9e7] border-1.5 border-[#ebd99f] rounded-2xl p-5 space-y-3 text-xs shadow-2xs">
            <div>
              <span className="text-[#b45309] font-extrabold">Store Health Summary:</span>
              <p className="text-[#0f172a] mt-0.5 leading-relaxed font-medium">{storeIntelligence.storeHealthSummary}</p>
            </div>
            <div>
              <span className="text-[#b45309] font-extrabold">Recommended Catalogue Actions:</span>
              <p className="text-[#0f172a] mt-0.5 leading-relaxed font-medium">{storeIntelligence.catalogueRecommendation}</p>
            </div>
            <div>
              <span className="text-[#b45309] font-extrabold">Rush Hour Mitigation:</span>
              <p className="text-[#0f172a] mt-0.5 leading-relaxed font-medium">{storeIntelligence.rushMitigationAdvice}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#fef9e7] rounded-2xl border border-[#ebd99f] text-center text-xs text-[#64748b]">
            Click "Generate Store Intelligence" to get automated AI advice on low buffer products and walk-in peak scheduling.
          </div>
        )}
      </div>

      {/* Live Products & Ghost Risk Table */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#0f172a] font-heading">
            Catalogue SKUs & Ghost Risk Index ({products.length} Products)
          </h3>
          <span className="text-xs font-mono text-[#b45309] font-bold">
            Products with Ghost Risk &gt; 40% require verification
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#ebd99f] text-[#b45309] font-black bg-[#fef9e7]/70">
                <th className="pb-3 pl-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Live Stock</th>
                <th className="pb-3">Ghost Stock Risk</th>
                <th className="pb-3">Last Verified</th>
                <th className="pb-3 pr-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd99f]/40">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-[#fef9e7]/50 transition-colors">
                  <td className="py-3.5 pl-3">
                    <div className="font-extrabold text-[#0f172a]">{p.name}</div>
                    <div className="text-[10px] text-[#64748b]">{p.unit}</div>
                  </td>
                  <td className="py-3.5 text-[#334155] font-medium">{p.category}</td>
                  <td className="py-3.5 font-mono font-black text-[#0f172a]">₹{p.price}</td>
                  <td className="py-3.5">
                    <span className={`font-mono font-black text-sm ${
                      p.currentStock <= 2 ? 'text-[#e11d48]' : 'text-[#059669]'
                    }`}>
                      {p.currentStock}
                    </span>
                    <span className="text-[10px] text-[#64748b] ml-1 font-bold">units</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#fef9e7] h-2 rounded-full overflow-hidden border border-[#ebd99f]">
                        <div
                          className={`h-full rounded-full ${
                            p.ghostRiskScore > 50 ? 'bg-gradient-to-r from-[#f59e0b] to-[#e11d48]' : 'bg-[#059669]'
                          }`}
                          style={{ width: `${p.ghostRiskScore}%` }}
                        ></div>
                      </div>
                      <span className={`font-mono font-black text-[11px] ${
                        p.ghostRiskScore > 50 ? 'text-[#e11d48]' : 'text-[#059669]'
                      }`}>
                        {p.ghostRiskScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-[#64748b] font-medium">{p.lastVerifiedAt}</td>
                  <td className="py-3.5 pr-3 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-[#fef9e7] border border-[#ebd99f] rounded-xl p-1 shadow-2xs">
                      <button
                        onClick={() => handleUpdateStock(p.id, Math.max(0, p.currentStock - 1))}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-[#ffe4e6] text-[#e11d48] font-bold text-xs border border-[#ebd99f]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-black text-[#0f172a]">
                        {p.currentStock}
                      </span>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.currentStock + 5)}
                        className="px-2 h-6 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-90 text-white font-bold text-xs shadow-2xs"
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
