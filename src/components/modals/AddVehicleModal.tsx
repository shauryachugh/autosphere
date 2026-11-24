import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Car, Plus, ShieldCheck, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { NumberPlate } from '../common/NumberPlate';
import { FuelType, TransmissionType, BodyType } from '../../types';
import { SearchableLocationSelect } from '../common/SearchableLocationSelect';

export const AddVehicleModal: React.FC = () => {
  const { isAddVehicleOpen, closeAddVehicle, addVehicle } = useApp();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState('2024');
  const [regNumber, setRegNumber] = useState('');
  const [vin, setVin] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [transmission, setTransmission] = useState<TransmissionType>('manual');
  const [bodyType, setBodyType] = useState<BodyType>('suv');
  const [odoKm, setOdoKm] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [regYear, setRegYear] = useState('2024');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isAddVehicleOpen) return null;

  const popularMakes = ['Mahindra', 'Tata', 'Hyundai', 'Toyota', 'Maruti Suzuki', 'Kia', 'Skoda', 'BMW'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const created = await addVehicle({
        make,
        model,
        variant,
        year: parseInt(year, 10) || 2023,
        manufacturingYear: parseInt(year, 10) || 2023,
        registrationYear: parseInt(regYear, 10) || parseInt(year, 10) || 2023,
        purchasePriceINR: parseFloat(purchasePrice) || 2450000,
        purchaseDate,
        regNumber: regNumber.toUpperCase().trim(),
        vin: vin.toUpperCase().trim(),
        fuelType,
        transmission,
        bodyType,
        powerBhp: fuelType === 'electric' ? 145 : 175,
        torqueNm: fuelType === 'electric' ? 250 : 380,
        odoKm: parseInt(odoKm, 10) || 10000,
        currentFuelPercent: 75,
        estimatedRangeKm: fuelType === 'electric' ? 320 : 580,
        avgEfficiency: fuelType === 'electric' ? '132 Wh/km' : '14.5 km/l',
        insurancePolicyNumber: 'HDFC-ERGO-GEN-' + Math.floor(100000 + Math.random() * 900000),
        insuranceExpiryDate: '2027-05-20',
        insuranceProvider: 'HDFC ERGO General Insurance',
        pucExpiryDate: '2027-02-18',
        lastServiceDate: '2026-06-10',
        lastServiceKm: Math.max(0, (parseInt(odoKm, 10) || 10000) - 5000),
        nextServiceDueDate: '2027-06-10',
        nextServiceDueKm: (parseInt(odoKm, 10) || 10000) + 10000,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
        isPrimary: false,
        city,
        state,
        fastagBalanceINR: 1200,
        connectedCarPlatform: 'AdrenoX',
      });

      if (created) {
        closeAddVehicle();
      } else {
        setSubmitError('Failed to register vehicle to database. Please check your network and credentials.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred while saving the vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Car className="w-4 h-4" />
              </span>
              Add Vehicle to Garage
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter vehicle credentials for automated telematics & maintenance intelligence
            </p>
          </div>
          <button
            onClick={closeAddVehicle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Quick Make Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Automaker (OEM)
            </label>
            <div className="flex flex-wrap gap-2">
              {popularMakes.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMake(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    make === m
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                      : 'bg-dark-850 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Model & Variant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Model Name *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Scorpio-N, Nexon, Creta"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Variant & Trim
              </label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g. Z8L AWD AT, Fearless+, SX(O)"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Registration Plate & Live HSRP Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Registration Number (RTO) *
              </label>
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. DL 01 AB 1234"
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white uppercase focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-850 border border-slate-800">
              <span className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
                HSRP Plate Preview
              </span>
              <NumberPlate
                registrationNumber={regNumber || 'DL 01 AB 1234'}
                isEV={fuelType === 'electric'}
                size="md"
              />
            </div>
          </div>

          {/* Fuel & Transmission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="electric">Electric (EV)</option>
                <option value="hybrid">Strong Hybrid</option>
                <option value="cng">CNG</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="automatic">Automatic (Torque Converter)</option>
                <option value="manual">Manual</option>
                <option value="dct">Dual-Clutch (DCT / DSG)</option>
                <option value="cvt">e-CVT</option>
                <option value="single-speed">Single-Speed Reduction (EV)</option>
              </select>
            </div>
          </div>

          {/* Year & Registration Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Manufacturing Year
              </label>
              <input
                type="number"
                min="2010"
                max="2027"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Registration Year
              </label>
              <input
                type="number"
                min="2010"
                max="2027"
                value={regYear}
                onChange={(e) => setRegYear(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Purchase Price & Purchase Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Purchase Price (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-semibold">₹</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="2450000"
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Current Odometer */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Odometer (km)
            </label>
            <input
              type="number"
              value={odoKm}
              onChange={(e) => setOdoKm(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Registered Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              RTO Registration Jurisdiction (State & City)
            </label>
            <SearchableLocationSelect
              selectedState={state}
              selectedCity={city}
              onLocationChange={(s, c) => {
                setState(s.name);
                setCity(c.name);
              }}
              showFuelSnippet={false}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={closeAddVehicle} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            >
              {isSubmitting ? 'Saving to Database...' : 'Register Car to Garage'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
