import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Car,
  Save,
  AlertCircle,
  AlertTriangle,
  Gauge,
  Fuel,
  Zap,
  IndianRupee,
  Calendar,
  Camera,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { FuelType, TransmissionType, Vehicle } from '../../types';
import { SearchableLocationSelect } from '../common/SearchableLocationSelect';
import { VehicleImage } from '../common/VehicleImage';
import { getEfficiencyUnit, getEffectiveActualMileage } from '../../utils/vehicleEconomy';
import {
  getCatalogueImageEntry,
  uploadPersonalVehiclePhoto,
} from '../../services/vehicleImageService';

interface EditFormState {
  make: string;
  model: string;
  variant: string;
  year: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  engineCc: string;
  batteryCapacityKwh: string;
  odoKm: string;
  claimedMileage: string;
  actualMileage: string;
  monthlyKmDriven: string;
  city: string;
  state: string;
  purchaseDate: string;
  purchasePriceINR: string;
  estimatedResaleValueINR: string;
  image: string;
}

function buildInitialFormState(v: Vehicle): EditFormState {
  const effectiveActual = getEffectiveActualMileage(v);
  return {
    make: v.make || '',
    model: v.model || '',
    variant: v.variant || '',
    year: v.manufacturingYear?.toString() || v.year?.toString() || '',
    fuelType: v.fuelType,
    transmission: v.transmission,
    engineCc: v.engineCc != null && v.engineCc > 0 ? v.engineCc.toString() : '',
    batteryCapacityKwh:
      v.batteryCapacityKwh != null && v.batteryCapacityKwh > 0
        ? v.batteryCapacityKwh.toString()
        : '',
    odoKm: v.odoKm != null ? v.odoKm.toString() : '',
    claimedMileage:
      v.claimedMileage != null && v.claimedMileage > 0 ? v.claimedMileage.toString() : '',
    actualMileage: effectiveActual != null ? effectiveActual.toString() : '',
    monthlyKmDriven:
      v.monthlyKmDriven != null && v.monthlyKmDriven >= 0 ? v.monthlyKmDriven.toString() : '',
    city: v.city || '',
    state: v.state || '',
    purchaseDate: v.purchaseDate ? v.purchaseDate.split('T')[0] : '',
    purchasePriceINR:
      v.purchasePriceINR != null && v.purchasePriceINR > 0 ? v.purchasePriceINR.toString() : '',
    estimatedResaleValueINR:
      v.estimatedResaleValueINR != null && v.estimatedResaleValueINR > 0
        ? v.estimatedResaleValueINR.toString()
        : '',
    image: v.image || '',
  };
}

function parseOptionalNonNegativeNumber(
  raw: string,
  fieldLabel: string,
  errors: Record<string, string>,
  key: string,
  { allowZero = true, integer = false }: { allowZero?: boolean; integer?: boolean } = {}
): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const num = integer ? Number(trimmed) : parseFloat(trimmed);
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    errors[key] = `${fieldLabel} must be a valid number.`;
    return undefined;
  }
  if (integer && !Number.isInteger(num)) {
    errors[key] = `${fieldLabel} must be a whole number.`;
    return undefined;
  }
  if (num < 0 || (!allowZero && num === 0)) {
    errors[key] = allowZero
      ? `${fieldLabel} cannot be negative.`
      : `${fieldLabel} must be greater than 0.`;
    return undefined;
  }
  return num;
}

export const EditVehicleModal: React.FC = () => {
  const { user } = useAuth();
  const { isEditVehicleOpen, editingVehicle, closeEditVehicle, updateVehicle, showToast } = useApp();

  const [form, setForm] = useState<EditFormState | null>(null);
  const [initialForm, setInitialForm] = useState<EditFormState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditVehicleOpen && editingVehicle) {
      const initial = buildInitialFormState(editingVehicle);
      setForm(initial);
      setInitialForm(initial);
      setFieldErrors({});
      setSubmitError(null);
      setShowDiscardConfirm(false);
    } else {
      setForm(null);
      setInitialForm(null);
    }
  }, [isEditVehicleOpen, editingVehicle]);

  const isDirty = useMemo(() => {
    if (!form || !initialForm) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  if (!isEditVehicleOpen || !editingVehicle || !form) return null;

  const efficiencyUnit = getEfficiencyUnit(form.fuelType);
  const isEV = form.fuelType === 'electric';

  const handleRequestClose = () => {
    if (isSaving) return;
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      closeEditVehicle();
    }
  };

  const handleFieldChange = <K extends keyof EditFormState>(key: K, value: EditFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !editingVehicle) return;

    const errors: Record<string, string> = {};

    const make = form.make.trim();
    const model = form.model.trim();
    const variant = form.variant.trim();
    const city = form.city.trim();
    const state = form.state.trim();

    if (!make) errors.make = 'Manufacturer is required.';
    if (!model) errors.model = 'Model is required.';
    if (!variant) errors.variant = 'Variant is required.';
    if (!city || !state) errors.location = 'Registration city and state are required.';

    const yearNum = Number(form.year.trim());
    const currentMaxYear = new Date().getFullYear() + 1;
    if (!form.year.trim() || !Number.isInteger(yearNum) || yearNum < 1980 || yearNum > currentMaxYear) {
      errors.year = `Manufacturing year must be between 1980 and ${currentMaxYear}.`;
    }

    if (!form.odoKm.trim()) {
      errors.odoKm = 'Odometer reading is required.';
    }
    const odoKm = parseOptionalNonNegativeNumber(form.odoKm, 'Odometer reading', errors, 'odoKm', {
      allowZero: true,
      integer: true,
    });

    const engineCc = parseOptionalNonNegativeNumber(form.engineCc, 'Engine capacity', errors, 'engineCc', {
      allowZero: false,
      integer: true,
    });
    const batteryCapacityKwh = parseOptionalNonNegativeNumber(
      form.batteryCapacityKwh,
      'Battery capacity',
      errors,
      'batteryCapacityKwh',
      { allowZero: false }
    );
    const claimedMileage = parseOptionalNonNegativeNumber(
      form.claimedMileage,
      'Manufacturer-claimed mileage',
      errors,
      'claimedMileage',
      { allowZero: false }
    );
    const actualMileage = parseOptionalNonNegativeNumber(
      form.actualMileage,
      'Actual average mileage',
      errors,
      'actualMileage',
      { allowZero: false }
    );
    const monthlyKmDriven = parseOptionalNonNegativeNumber(
      form.monthlyKmDriven,
      'Monthly kilometres driven',
      errors,
      'monthlyKmDriven',
      { allowZero: true, integer: true }
    );
    const purchasePriceINR = parseOptionalNonNegativeNumber(
      form.purchasePriceINR,
      'Purchase price',
      errors,
      'purchasePriceINR',
      { allowZero: true }
    );
    const estimatedResaleValueINR = parseOptionalNonNegativeNumber(
      form.estimatedResaleValueINR,
      'Estimated resale value',
      errors,
      'estimatedResaleValueINR',
      { allowZero: true }
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError('Please fix the highlighted validation errors before saving.');
      return;
    }

    setIsSaving(true);
    setSubmitError(null);

    try {
      const ok = await updateVehicle(editingVehicle.id, {
        make,
        model,
        variant,
        year: yearNum,
        manufacturingYear: yearNum,
        fuelType: form.fuelType,
        transmission: form.transmission,
        engineCc,
        batteryCapacityKwh,
        odoKm: odoKm ?? 0,
        claimedMileage,
        actualMileage,
        monthlyKmDriven,
        city,
        state,
        purchaseDate: form.purchaseDate.trim() || undefined,
        purchasePriceINR,
        estimatedResaleValueINR,
        image: form.image,
      });

      if (ok) {
        closeEditVehicle();
      } else {
        setSubmitError('Failed to save changes to database. Please verify your connection and try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred while saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleRequestClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Car className="w-4 h-4" />
              </span>
              Edit Vehicle Details & Economy
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingVehicle.make} {editingVehicle.model} • <span className="font-mono text-cyan-300">{editingVehicle.regNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleRequestClose}
            disabled={isSaving}
            aria-label="Close edit modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unsaved Changes Confirmation Banner */}
        {showDiscardConfirm && (
          <div className="px-6 py-3 bg-amber-950/60 border-b border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You have unsaved changes. Are you sure you want to discard them?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDiscardConfirm(false)}
              >
                Keep Editing
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={closeEditVehicle}
              >
                Discard Changes
              </Button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section 0: Vehicle Photograph */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Vehicle Photograph
              </h3>
              <span className="text-[11px] text-slate-400">
                JPG, PNG, or WebP (max 5 MB)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <VehicleImage
                make={form.make}
                model={form.model}
                image={form.image}
                fuelType={form.fuelType}
                bodyType={editingVehicle.bodyType}
                showSourceBadge
                className="w-full sm:w-48 h-28 rounded-xl shrink-0"
              />

              <div className="flex-1 flex flex-col gap-2 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !editingVehicle) return;
                    setIsUploadingPhoto(true);
                    try {
                      const uploaded = await uploadPersonalVehiclePhoto(
                        user?.id || 'offline-user',
                        editingVehicle.id,
                        file
                      );
                      handleFieldChange('image', uploaded.url);
                      showToast('Personal vehicle photo uploaded. Click Save Changes to persist.', 'info');
                    } catch (err: any) {
                      showToast(err?.message || 'Failed to upload vehicle photo.', 'error');
                    } finally {
                      setIsUploadingPhoto(false);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    isLoading={isUploadingPhoto}
                    disabled={isUploadingPhoto || isSaving}
                    onClick={() => fileInputRef.current?.click()}
                    icon={!isUploadingPhoto ? <Upload className="w-3.5 h-3.5 text-cyan-400" /> : undefined}
                  >
                    {isUploadingPhoto ? 'Uploading...' : 'Upload Personal Photo'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isUploadingPhoto || isSaving}
                    onClick={() => {
                      const catEntry = getCatalogueImageEntry(form.make, form.model);
                      handleFieldChange('image', catEntry?.url || '');
                    }}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Use Catalogue Photo
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Personal photos are stored securely in Supabase Storage and linked only to this vehicle.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Vehicle Identity & Powertrain */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" />
              Vehicle Identity & Powertrain
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  value={form.make}
                  onChange={(e) => handleFieldChange('make', e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Hyundai"
                />
                {fieldErrors.make && <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.make}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Model *
                </label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => handleFieldChange('model', e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Creta"
                />
                {fieldErrors.model && <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.model}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Variant *
                </label>
                <input
                  type="text"
                  value={form.variant}
                  onChange={(e) => handleFieldChange('variant', e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. SX (O) IVT"
                />
                {fieldErrors.variant && <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.variant}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mfg Year *
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                {fieldErrors.year && <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.year}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Fuel Type *
                </label>
                <select
                  value={form.fuelType}
                  onChange={(e) => handleFieldChange('fuelType', e.target.value as FuelType)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="hybrid">Strong Hybrid</option>
                  <option value="electric">Electric (EV)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Transmission *
                </label>
                <select
                  value={form.transmission}
                  onChange={(e) => handleFieldChange('transmission', e.target.value as TransmissionType)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic (AT)</option>
                  <option value="cvt">CVT / IVT</option>
                  <option value="dct">DCT / DSG</option>
                  <option value="amt">AMT</option>
                  <option value="single-speed">EV Single-Speed</option>
                </select>
              </div>

              {isEV ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Battery (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.batteryCapacityKwh}
                    onChange={(e) => handleFieldChange('batteryCapacityKwh', e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="Optional"
                  />
                  {fieldErrors.batteryCapacityKwh && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.batteryCapacityKwh}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Engine (cc)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.engineCc}
                    onChange={(e) => handleFieldChange('engineCc', e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 1497"
                  />
                  {fieldErrors.engineCc && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.engineCc}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Editable Vehicle Economy & Usage */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                {isEV ? <Zap className="w-3.5 h-3.5 text-emerald-400" /> : <Fuel className="w-3.5 h-3.5 text-cyan-400" />}
                Vehicle Economy & Usage ({efficiencyUnit})
              </h3>
              <span className="text-[11px] text-slate-400">
                Leave blank if unknown — never auto-filled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Manufacturer-Claimed Efficiency ({efficiencyUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.claimedMileage}
                    onChange={(e) => handleFieldChange('claimedMileage', e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-3.5 pr-16 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder={isEV ? 'e.g. 8.2' : form.fuelType === 'cng' ? 'e.g. 26.5' : 'e.g. 18.4'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    {efficiencyUnit}
                  </span>
                </div>
                {fieldErrors.claimedMileage && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.claimedMileage}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Actual Average Efficiency ({efficiencyUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.actualMileage}
                    onChange={(e) => handleFieldChange('actualMileage', e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-3.5 pr-16 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder={isEV ? 'e.g. 6.8' : form.fuelType === 'cng' ? 'e.g. 22.0' : 'e.g. 15.2'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-cyan-400">
                    {efficiencyUnit}
                  </span>
                </div>
                {fieldErrors.actualMileage && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.actualMileage}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Odometer Reading (km) *
                </label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0"
                    value={form.odoKm}
                    onChange={(e) => handleFieldChange('odoKm', e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    km
                  </span>
                </div>
                {fieldErrors.odoKm && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.odoKm}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Monthly Kilometres Driven (km/mo)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={form.monthlyKmDriven}
                    onChange={(e) => handleFieldChange('monthlyKmDriven', e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-3.5 pr-16 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="Optional"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    km/mo
                  </span>
                </div>
                {fieldErrors.monthlyKmDriven && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.monthlyKmDriven}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Registration & Financials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" />
              Registration Location & Valuation
            </h3>

            <div>
              <SearchableLocationSelect
                selectedState={form.state}
                selectedCity={form.city}
                onLocationChange={(newState, newCity) => {
                  setForm((prev) =>
                    prev ? { ...prev, state: newState.name, city: newCity.name } : prev
                  );
                  if (fieldErrors.location) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.location;
                      return next;
                    });
                  }
                }}
              />
              {fieldErrors.location && (
                <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Purchase Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) => handleFieldChange('purchaseDate', e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Purchase Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.purchasePriceINR}
                  onChange={(e) => handleFieldChange('purchasePriceINR', e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  placeholder="Optional"
                />
                {fieldErrors.purchasePriceINR && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.purchasePriceINR}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Est. Resale Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.estimatedResaleValueINR}
                  onChange={(e) => handleFieldChange('estimatedResaleValueINR', e.target.value)}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                  placeholder="Optional"
                />
                {fieldErrors.estimatedResaleValueINR && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.estimatedResaleValueINR}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={handleRequestClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              disabled={isSaving}
              icon={!isSaving ? <Save className="w-4 h-4" /> : undefined}
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
