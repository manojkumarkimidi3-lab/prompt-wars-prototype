import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  Clock, 
  FileText 
} from 'lucide-react';

export const AdminAuditView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [aiRequests, setAiRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [logsRes, aiRes] = await Promise.all([
        fetch('/api/admin/audit-logs', {
          headers: { 'Authorization': 'Bearer test_token_admin' }
        }),
        fetch('/api/admin/ai-requests', {
          headers: { 'Authorization': 'Bearer test_token_admin' }
        })
      ]);

      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }
      if (aiRes.ok) {
        const data = await aiRes.json();
        setAiRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin audit data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#d97706] uppercase tracking-wider mb-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#d97706]" />
              <span>System Governance & Defense-in-Depth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] font-outfit">
              Administrator Security & Audit Ledger
            </h1>
            <p className="mt-2 text-sm text-[#475569] max-w-2xl leading-relaxed">
              Tamper-evident audit trail of all authenticated rescue executions, role access checks, and AI schema validations.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="bg-[#fef9e7] hover:bg-[#fff6dc] text-[#d97706] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#ebd99f] transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#d97706] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <h2 className="text-sm font-bold text-[#0f172a] flex items-center gap-2 font-outfit">
          <UserCheck className="w-4 h-4 text-[#d97706]" />
          <span>Server-Side Role-Based Access Control (RBAC) Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#ebd99f] text-[#64748b]">
                <th className="pb-3 pl-2">System Resource / Action</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Store Manager</th>
                <th className="pb-3 text-[#d97706]">Operations</th>
                <th className="pb-3 pr-2 text-[#e11d48]">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd99f]/40 font-sans">
              <tr>
                <td className="py-2.5 pl-2 font-medium text-[#0f172a]">View Own Orders</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ Full</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ Store Only</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ All Stores</td>
                <td className="py-2.5 pr-2 text-[#059669] font-bold">✓ All Stores</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium text-[#0f172a]">Execute Order Rescue</td>
                <td className="py-2.5 text-[#d97706]">Restricted (Own)</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ Authorized</td>
                <td className="py-2.5 pr-2 text-[#059669] font-bold">✓ Authorized</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium text-[#0f172a]">Toggle Rush Shield</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ Authorized</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ Authorized</td>
                <td className="py-2.5 pr-2 text-[#059669] font-bold">✓ Authorized</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium text-[#0f172a]">AI Schema Diagnostics</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 text-[#059669] font-bold">✓ Authorized</td>
                <td className="py-2.5 pr-2 text-[#059669] font-bold">✓ Authorized</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-2 font-medium text-[#0f172a]">Security Audit Logs</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 text-[#94a3b8]">✕ Denied</td>
                <td className="py-2.5 pr-2 text-[#e11d48] font-bold">✓ Authorized</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0f172a] flex items-center gap-2 font-outfit">
            <Terminal className="w-4 h-4 text-[#d97706]" />
            <span>Audit Log Stream ({logs.length} events logged)</span>
          </h2>
          <span className="text-[10px] font-mono text-[#64748b]">Append-only security log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ebd99f] text-[#64748b] font-medium">
                <th className="pb-3 pl-2">Timestamp</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">User Role</th>
                <th className="pb-3">Resource Target</th>
                <th className="pb-3 pr-2 text-right">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd99f]/30 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#64748b] font-sans">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                logs.slice(0, 15).map((l: any) => (
                  <tr key={l.id} className="hover:bg-[#fef9e7] transition-colors">
                    <td className="py-2.5 pl-2 text-[#64748b] text-[11px]">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 font-bold text-[#0f172a] text-[11px]">
                      {l.action}
                    </td>
                    <td className="py-2.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-[#fef9e7] text-[#d97706] border border-[#ebd99f] font-semibold">
                        {l.userRole}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#0284c7] font-semibold text-[11px]">
                      {l.resource}:{l.resourceId}
                    </td>
                    <td className="py-2.5 pr-2 text-right text-[10px] text-[#64748b] truncate max-w-xs font-mono">
                      {JSON.stringify(l.metadata || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
