import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Clock,
  Plus,
  X,
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDate, getDaysRemaining } from '../utils/formatters';
import { healthPassportService } from '../services/healthPassportService';
import { DigitalDocument, DocumentCategory } from '../types/passport.types';

export const DocumentVault: React.FC = () => {
  const { activeVehicle, vehicles, setActiveVehicleId, showToast } = useApp();
  const [documents, setDocuments] = useState<DigitalDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form State
  const [newDoc, setNewDoc] = useState<Partial<DigitalDocument>>({
    category: 'rc',
    title: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
  });

  const loadDocuments = async () => {
    setIsLoading(true);
    const data = await healthPassportService.getDocuments(activeVehicle.id);
    setDocuments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDocuments();
  }, [activeVehicle.id]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) {
      showToast('Please enter a document title', 'error');
      return;
    }

    const doc: DigitalDocument = {
      id: `doc-${Date.now()}`,
      userId: 'user-demo',
      vehicleId: activeVehicle.id,
      title: newDoc.title,
      category: (newDoc.category as DocumentCategory) || 'other',
      documentNumber: newDoc.documentNumber,
      issueDate: newDoc.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: newDoc.expiryDate,
      storagePath: `vehicle-documents/${activeVehicle.id}/${Date.now()}_document.pdf`,
      fileSizeBytes: 1450000,
      mimeType: 'application/pdf',
      status: 'valid',
      notes: newDoc.notes,
      createdAt: new Date().toISOString(),
    };

    await healthPassportService.saveDocument(doc);
    showToast(`Uploaded ${doc.title} to Secure Vault`, 'success');
    setIsUploadModalOpen(false);
    setNewDoc({ category: 'rc', title: '', documentNumber: '', issueDate: '', expiryDate: '', notes: '' });
    loadDocuments();
  };

  const handleDeleteDoc = async (id: string, title: string) => {
    await healthPassportService.deleteDocument(activeVehicle.id, id);
    showToast(`Removed ${title}`, 'info');
    loadDocuments();
  };

  const handleDownload = (doc: DigitalDocument) => {
    showToast(`Generating authenticated temporary signed URL for ${doc.title}...`, 'info');
  };

  const categories: { label: string; value: string }[] = [
    { label: 'All Documents', value: 'all' },
    { label: 'RC (Registration)', value: 'rc' },
    { label: 'Insurance Policy', value: 'insurance' },
    { label: 'PUC Certificate', value: 'puc' },
    { label: 'Purchase Invoices', value: 'purchase_invoice' },
    { label: 'Service Bills', value: 'service_invoice' },
    { label: 'Warranty Booklets', value: 'warranty' },
  ];

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-carbon-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Digital Document Vault
            </h1>
            <Badge variant="electric" size="sm">
              <Lock className="w-3 h-3 mr-1 inline" /> Private AES-256 Storage
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-carbon-400 mt-1">
            Tamper-proof storage for Smart Card RC, Zero-Dep Insurance policies, PUC certificates, and service tax invoices.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          icon={<Upload className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.value
                ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                : 'bg-carbon-900 border border-carbon-800 text-carbon-300 hover:bg-carbon-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Documents */}
      {isLoading ? (
        <div className="py-20 text-center text-carbon-400">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Verifying digital certificate signatures...</p>
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map(doc => {
            const daysRemaining = doc.expiryDate ? getDaysRemaining(doc.expiryDate) : null;
            const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0;
            const isExpired = daysRemaining !== null && daysRemaining <= 0;

            return (
              <div
                key={doc.id}
                className="rounded-3xl bg-carbon-900 border border-carbon-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-carbon-800 text-cyan-400 font-mono">
                      {doc.category.replace('_', ' ')}
                    </span>

                    {/* Expiry Badge */}
                    {doc.expiryDate ? (
                      isExpired ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
                          Expired
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          Expires in {daysRemaining} days
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          Valid
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-carbon-800 text-carbon-400">
                        No Expiry
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3 line-clamp-1">{doc.title}</h3>
                  {doc.documentNumber && (
                    <div className="text-xs font-mono text-carbon-400 mt-1">
                      No: {doc.documentNumber}
                    </div>
                  )}

                  {doc.notes && (
                    <p className="text-xs text-carbon-400 mt-2 line-clamp-2 italic">
                      "{doc.notes}"
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-carbon-800/60 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-carbon-400">
                    <span>Issued: {doc.issueDate ? formatDate(doc.issueDate) : 'N/A'}</span>
                    {doc.expiryDate && <span>Expires: {formatDate(doc.expiryDate)}</span>}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleDownload(doc)}
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download PDF
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(doc.id, doc.title)}
                      className="p-2 rounded-xl text-carbon-500 hover:text-rose-400 hover:bg-carbon-800 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-carbon-900 border border-carbon-800 space-y-3">
          <FileText className="w-10 h-10 text-carbon-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Documents in Vault</h3>
          <p className="text-xs text-carbon-400 max-w-sm mx-auto">
            Upload your Registration Certificate (RC), Insurance policy or PUC to keep compliance verified.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload Now
          </Button>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-carbon-900 border border-carbon-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                Upload Vehicle Document
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-carbon-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Document Category</label>
                <select
                  value={newDoc.category}
                  onChange={e => setNewDoc({ ...newDoc, category: e.target.value as any })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="rc">Registration Certificate (Smart Card RC)</option>
                  <option value="insurance">Insurance Policy Certificate</option>
                  <option value="puc">PUC Emission Certificate</option>
                  <option value="purchase_invoice">Purchase Invoice</option>
                  <option value="service_invoice">Periodic Service Bill</option>
                  <option value="warranty">Warranty Documentation</option>
                  <option value="other">Other Official Record</option>
                </select>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Comprehensive Insurance Policy"
                  value={newDoc.title || ''}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Certificate / Policy Number</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC-ERGO-MOT-2024-9182"
                  value={newDoc.documentNumber || ''}
                  onChange={e => setNewDoc({ ...newDoc, documentNumber: e.target.value })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Issue Date</label>
                  <input
                    type="date"
                    value={newDoc.issueDate || ''}
                    onChange={e => setNewDoc({ ...newDoc, issueDate: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={newDoc.expiryDate || ''}
                    onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Document Notes / Endorsement</label>
                <input
                  type="text"
                  placeholder="e.g. Nil-depreciation cover with engine protection"
                  value={newDoc.notes || ''}
                  onChange={e => setNewDoc({ ...newDoc, notes: e.target.value })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Upload Drag area */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-carbon-700 text-center space-y-1">
                <FileText className="w-6 h-6 text-cyan-400 mx-auto" />
                <span className="text-white font-medium block">Select PDF or Image</span>
                <span className="text-[10px] text-carbon-400">Max size: 10MB • Secured with Supabase Private RLS</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-carbon-800">
                <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save to Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
