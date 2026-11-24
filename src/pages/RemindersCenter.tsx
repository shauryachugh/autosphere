import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Check,
  ShieldAlert,
  Fuel,
  Wrench,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDate, getDaysRemaining } from '../utils/formatters';
import { healthPassportService } from '../services/healthPassportService';
import { VehicleReminder, ReminderType, ReminderPriority } from '../types/passport.types';

export const RemindersCenter: React.FC = () => {
  const { user } = useAuth();
  const { activeVehicle, vehicles, showToast } = useApp();
  const [reminders, setReminders] = useState<VehicleReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Reminder Form State
  const [newReminder, setNewReminder] = useState<{
    title: string;
    description: string;
    reminderType: ReminderType;
    dueDate: string;
    dueKm?: number;
    priority: ReminderPriority;
  }>({
    title: '',
    description: '',
    reminderType: 'service',
    dueDate: '',
    priority: 'medium',
  });

  const loadReminders = async () => {
    if (!activeVehicle?.id) {
      setIsLoading(false);
      setReminders([]);
      return;
    }
    setIsLoading(true);
    const data = await healthPassportService.getReminders(activeVehicle.id);
    setReminders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeVehicle?.id) {
      loadReminders();
    } else {
      setIsLoading(false);
    }
  }, [activeVehicle?.id]);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle?.id) return;
    if (!newReminder.title || !newReminder.dueDate) {
      showToast('Please specify a reminder title and due date', 'error');
      return;
    }

    const created: VehicleReminder = {
      id: `rem-${Date.now()}`,
      userId: user?.id || 'authenticated-user',
      vehicleId: activeVehicle.id,
      title: newReminder.title,
      description: newReminder.description,
      reminderType: newReminder.reminderType,
      dueDate: newReminder.dueDate,
      dueKm: newReminder.dueKm,
      priority: newReminder.priority,
      isCompleted: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    };

    const currentList = await healthPassportService.getReminders(activeVehicle.id);
    currentList.push(created);
    localStorage.setItem(`autosphere_reminders_${activeVehicle.id}`, JSON.stringify(currentList));

    showToast(`Reminder "${created.title}" scheduled`, 'success');
    setIsAddModalOpen(false);
    setNewReminder({ title: '', description: '', reminderType: 'service', dueDate: '', priority: 'medium' });
    loadReminders();
  };

  if (!activeVehicle || vehicles.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-carbon-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Compliance & Service Reminders
            </h1>
            <p className="text-xs sm:text-sm text-carbon-400 mt-1">
              Real-time statutory notifications for insurance expiry, PUC renewals, scheduled engine maintenance, and loan EMIs.
            </p>
          </div>
        </div>

        <div className="p-12 text-center border border-dashed border-carbon-800 rounded-3xl bg-carbon-900/40">
          <div className="max-w-md mx-auto space-y-4">
            <Bell className="w-12 h-12 text-carbon-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No active vehicle alerts</h3>
            <p className="text-sm text-carbon-400">
              No active vehicle alerts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async (reminderId: string, title: string) => {
    await healthPassportService.markReminderComplete(activeVehicle.id, reminderId);
    showToast(`Completed "${title}"`, 'success');
    loadReminders();
  };

  const handleDismiss = async (reminderId: string) => {
    await healthPassportService.dismissReminder(activeVehicle.id, reminderId);
    showToast('Reminder dismissed', 'info');
    loadReminders();
  };

  const activeReminders = reminders.filter(r => !r.isCompleted && !r.isDismissed);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-carbon-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vehicle Reminder Center
            </h1>
            <Badge variant="electric" size="sm">
              {activeReminders.length} Active Reminders
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-carbon-400 mt-1">
            Automated in-app tracking for PUC emission deadlines, insurance renewals, and scheduled periodic maintenance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New Reminder
        </Button>
      </div>

      {/* In-App Notice Callout */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            In-app notifications are live on this dashboard. Automated WhatsApp & SMS gateway alerts trigger once your verified phone is active.
          </span>
        </div>
      </div>

      {/* Active Reminders List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-carbon-400">
          Upcoming Scheduled Reminders ({activeReminders.length})
        </h2>

        {isLoading ? (
          <div className="py-12 text-center text-carbon-400">
            <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-xs">Checking vehicle reminders...</p>
          </div>
        ) : activeReminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReminders.map(rem => {
              const daysRemaining = getDaysRemaining(rem.dueDate);
              const isOverdue = daysRemaining < 0;
              const isUrgent = daysRemaining <= 15 && daysRemaining >= 0;

              return (
                <div
                  key={rem.id}
                  className={`p-5 rounded-2xl bg-carbon-900 border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                    isOverdue
                      ? 'border-rose-500/40 bg-rose-950/10'
                      : isUrgent
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-carbon-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-carbon-800 text-cyan-400 font-mono">
                          {rem.reminderType}
                        </span>
                        {rem.priority === 'high' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
                            High Priority
                          </span>
                        )}
                      </div>

                      {/* Expiry Pill */}
                      {isOverdue ? (
                        <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Overdue by {Math.abs(daysRemaining)} days
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold ${isUrgent ? 'text-amber-400' : 'text-emerald-400'}`}>
                          Due in {daysRemaining} days
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2.5">{rem.title}</h3>
                    {rem.description && (
                      <p className="text-xs text-carbon-400 mt-1 leading-relaxed">
                        {rem.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-carbon-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-carbon-400 font-mono text-[11px]">
                      <span>Due: {formatDate(rem.dueDate)}</span>
                      {rem.dueKm && <span>• @ {rem.dueKm.toLocaleString('en-IN')} km</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMarkComplete(rem.id, rem.title)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400 border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismiss(rem.id)}
                        className="p-1.5 rounded-xl text-carbon-500 hover:text-carbon-300 hover:bg-carbon-800 transition-colors"
                        title="Dismiss reminder"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-carbon-900 border border-carbon-800 text-carbon-400 text-xs">
            🎉 All scheduled reminders for {activeVehicle.make} {activeVehicle.model} are up to date!
          </div>
        )}
      </div>

      {/* Completed Reminders Archive */}
      {completedReminders.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-carbon-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-carbon-500">
            Completed Reminders Archive ({completedReminders.length})
          </h2>

          <div className="space-y-2">
            {completedReminders.map(rem => (
              <div
                key={rem.id}
                className="p-3.5 rounded-xl bg-carbon-900/60 border border-carbon-800 flex items-center justify-between text-xs text-carbon-400 opacity-75"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="line-through text-carbon-300 font-medium">{rem.title}</span>
                </div>
                <span className="text-[11px] font-mono text-carbon-500">
                  Completed on {formatDate(rem.completedAt || rem.dueDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-carbon-900 border border-carbon-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                Create Vehicle Reminder
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-carbon-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Reminder Type</label>
                <select
                  value={newReminder.reminderType}
                  onChange={e => setNewReminder({ ...newReminder, reminderType: e.target.value as ReminderType })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="service">Periodic Service Reminder</option>
                  <option value="puc">PUC Emission Test Expiry</option>
                  <option value="insurance">Insurance Policy Renewal</option>
                  <option value="oil">Engine Oil Replacement</option>
                  <option value="battery">12V Battery Inspection</option>
                  <option value="tyres">Tyre Rotation & Alignment</option>
                  <option value="brakes">Brake Pad Inspection</option>
                  <option value="custom">Custom Maintenance Note</option>
                </select>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Reminder Title</label>
                <input
                  type="text"
                  placeholder="e.g. 20,000 km Scheduled Engine Service"
                  value={newReminder.title}
                  onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Description & Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Synthetic oil change, oil filter, tire pressure balance"
                  value={newReminder.description}
                  onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Target Due Date</label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={e => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-carbon-300 font-semibold mb-1 block">Target Odometer (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 20000"
                    value={newReminder.dueKm || ''}
                    onChange={e => setNewReminder({ ...newReminder, dueKm: parseInt(e.target.value, 10) || undefined })}
                    className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-carbon-300 font-semibold mb-1 block">Priority Level</label>
                <select
                  value={newReminder.priority}
                  onChange={e => setNewReminder({ ...newReminder, priority: e.target.value as ReminderPriority })}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="high">High (Urgent / Regulatory Compliance)</option>
                  <option value="medium">Medium (Periodic Recommended)</option>
                  <option value="low">Low (Routine Check)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-carbon-800">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Reminder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
