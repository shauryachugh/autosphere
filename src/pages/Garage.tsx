import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Warehouse, 
  Car, 
  Plus, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  Calendar, 
  ExternalLink, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Zap, 
  Fuel, 
  Gauge, 
  Sparkles 
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { NumberPlate } from '../components/common/NumberPlate';
import { formatINR, formatKm, formatDate, getDaysRemaining } from '../utils/formatters';

export const Garage: React.FC = () => {
  const { 
    vehicles, 
    activeVehicleId, 
    setActiveVehicleId, 
    isVehiclesLoading,
    vehiclesError,
    refreshVehicles,
    openAddVehicle, 
    deleteVehicle, 
    documents, 
    openBookService, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vehicles' | 'documents' | 'services'>('vehicles');

  if (isVehiclesLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="h-8 w-44 bg-dark-800 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-72 bg-dark-850 rounded animate-pulse" />
          </div>
          <div className="h-9 w-36 bg-dark-800 rounded-lg animate-pulse" />
        </div>
        <Card>
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Loading Your Garage...</h3>
            <p className="text-sm text-slate-400">
              Retrieving verified telemetry, connected vehicle profiles and documents from database.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (vehiclesError && vehicles.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Garage</h1>
        </div>
        <Card>
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Error Loading Vehicles</h3>
            <p className="text-sm text-rose-300/80">{vehiclesError}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button onClick={() => refreshVehicles()} variant="primary">
                Retry Connection
              </Button>
              <Button onClick={openAddVehicle} variant="secondary">
                Add Vehicle
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Garage
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Multi-vehicle connected telematics, digital DigiLocker document vault and service tracking
            </p>
          </div>
          <Button
            onClick={openAddVehicle}
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Vehicle
          </Button>
        </div>

        <Card>
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center shadow-glow-subtle">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Vehicles Registered</h3>
            <p className="text-sm text-slate-400">
              Start building your connected fleet. Add your vehicle to monitor telematics, DigiLocker compliance, and service intervals.
            </p>
            <Button onClick={openAddVehicle} variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add Vehicle
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const selectedCar = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  const handleDownloadDoc = (title: string) => {
    showToast(`Downloading verified DigiLocker copy of ${title}...`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Garage
            </h1>
            <Badge variant="electric" size="sm">
              {vehicles.length} Vehicles Registered
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-vehicle connected telematics, digital DigiLocker document vault and service tracking
          </p>
        </div>

        <Button
          onClick={openAddVehicle}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Vehicle
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'vehicles'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Fleet ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DigiLocker Document Vault ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'services'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Service History & Intervals</span>
        </button>
      </div>

      {/* TAB 1: VEHICLES FLEET */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left list of vehicles */}
            <div className="lg:col-span-1 space-y-3">
              {vehicles.map((v) => {
                const isActive = v.id === activeVehicleId;
                const isEV = v.fuelType === 'electric';

                return (
                  <div
                    key={v.id}
                    onClick={() => setActiveVehicleId(v.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-glow-subtle'
                        : 'bg-dark-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={v.image}
                        alt={v.model}
                        className="w-16 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white truncate">
                            {v.make} {v.model}
                          </h3>
                          {v.isPrimary && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{v.variant}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <NumberPlate registrationNumber={v.regNumber} size="sm" isEV={isEV} />
                          <span className="text-xs font-mono text-slate-300">{formatKm(v.odoKm)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right detailed selected vehicle sheet */}
            <div className="lg:col-span-2">
              <Card
                header={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {selectedCar.make} {selectedCar.model} ({selectedCar.year})
                      </span>
                      <Badge variant={selectedCar.fuelType === 'electric' ? 'success' : 'info'} size="xs">
                        {selectedCar.fuelType.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => deleteVehicle(selectedCar.id)}
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="space-y-6">
                  {/* Photo & Specs Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <img
                      src={selectedCar.image}
                      alt={selectedCar.model}
                      className="rounded-xl w-full h-48 object-cover border border-slate-700"
                    />

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-400">RTO Plate:</span>
                        <div className="mt-1">
                          <NumberPlate
                            registrationNumber={selectedCar.regNumber}
                            size="lg"
                            isEV={selectedCar.fuelType === 'electric'}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400">Vehicle Identification (VIN):</span>
                        <p className="font-mono text-xs text-slate-200 mt-0.5 bg-dark-850 px-2.5 py-1 rounded border border-slate-800">
                          {selectedCar.vin}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-dark-850 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Registered City</span>
                          <span className="font-semibold text-white">{selectedCar.city}, {selectedCar.state}</span>
                        </div>

                        <div className="p-2 rounded bg-dark-850 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Telematics Platform</span>
                          <span className="font-semibold text-emerald-400">{selectedCar.connectedCarPlatform || 'OBD-II'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical & Compliance Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                    <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Power Output</span>
                      <span className="text-base font-bold text-white font-mono">{selectedCar.powerBhp} BHP</span>
                    </div>

                    <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Peak Torque</span>
                      <span className="text-base font-bold text-white font-mono">{selectedCar.torqueNm} Nm</span>
                    </div>

                    <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Efficiency</span>
                      <span className="text-base font-bold text-cyan-300 font-mono">{selectedCar.avgEfficiency}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Odometer</span>
                      <span className="text-base font-bold text-white font-mono">{formatKm(selectedCar.odoKm)}</span>
                    </div>
                  </div>

                  {/* Expiry alerts for this car */}
                  <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Statutory Compliance & Expiry Monitor
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-900 border border-slate-800">
                        <div>
                          <p className="font-semibold text-white">Motor Insurance Policy</p>
                          <p className="text-[11px] text-slate-400">{selectedCar.insuranceProvider}</p>
                        </div>
                        <span className="text-emerald-400 font-mono font-semibold">
                          Valid till {formatDate(selectedCar.insuranceExpiryDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-900 border border-slate-800">
                        <div>
                          <p className="font-semibold text-white">PUC Emissions Certificate</p>
                          <p className="text-[11px] text-slate-400">mParivahan Verified</p>
                        </div>
                        <span className="text-amber-400 font-mono font-semibold">
                          {getDaysRemaining(selectedCar.pucExpiryDate)} days left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIGILOCKER DOCUMENT VAULT */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  DigiLocker Government of India Cloud Synchronization
                </h4>
                <p className="text-xs text-slate-400">
                  Documents are legally valid under Rule 139 of the Central Motor Vehicles Rules, 1989.
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>
              DigiLocker Synced
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const daysLeft = doc.expiryDate ? getDaysRemaining(doc.expiryDate) : null;

              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-dark-800 border border-slate-700 text-cyan-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                          <span className="text-xs font-mono text-slate-400">{doc.docNumber}</span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          doc.status === 'valid'
                            ? 'success'
                            : doc.status === 'expiring_soon'
                            ? 'warning'
                            : 'danger'
                        }
                        size="xs"
                      >
                        {doc.status === 'valid' ? 'Valid' : 'Expiring Soon'}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div>
                        <span>Issue Date:</span>
                        <p className="font-semibold text-slate-200 mt-0.5">{formatDate(doc.issueDate)}</p>
                      </div>

                      <div>
                        <span>Expiry Date:</span>
                        <p className="font-semibold text-slate-200 mt-0.5">
                          {doc.expiryDate ? formatDate(doc.expiryDate) : 'Lifelong'}
                        </p>
                      </div>
                    </div>

                    {daysLeft !== null && daysLeft <= 60 && (
                      <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Action needed: Expires in {daysLeft} days</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{doc.lastVerified}</span>
                    <Button
                      onClick={() => handleDownloadDoc(doc.title)}
                      variant="outline"
                      size="sm"
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download ({doc.fileSize})
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-sky-400" />
                  Authorized Service Log & Upcoming Schedule
                </span>
                <Button onClick={openBookService} variant="primary" size="sm">
                  Book Next Service
                </Button>
              </div>
            }
          >
            <div className="divide-y divide-slate-800">
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="xs">
                      Upcoming at {formatKm(selectedCar.nextServiceDueKm)}
                    </Badge>
                    <span className="text-xs text-slate-400">Due {formatDate(selectedCar.nextServiceDueDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    30,000 km Major Scheduled Periodic Maintenance
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Includes Engine synthetic oil, microfilter, fuel filter replacement & brake caliper service
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white font-mono">₹14,500</span>
                  <p className="text-[11px] text-slate-400">Est. authorized cost</p>
                </div>
              </div>

              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="xs">
                      Completed at {formatKm(selectedCar.lastServiceKm)}
                    </Badge>
                    <span className="text-xs text-slate-400">Done on {formatDate(selectedCar.lastServiceDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    20,000 km Scheduled Service & Wheel Alignment
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sireesh Auto Mahindra Authorized Singasandra Workshop (Bengaluru)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 font-mono">₹14,800</span>
                  <p className="text-[11px] text-slate-400">Verified Invoice #SH-90812</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
