import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  ArrowRight,
  Filter,
  Heart,
  CarFront,
  Zap,
  Wrench,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR } from '../utils/formatters';
import {
  AccessoryItem,
  AccessoryCategory,
  AccessoryFilterCriteria,
} from '../types/accessories.types';
import { accessoriesService } from '../services/accessoriesService';

export const AccessoriesHub: React.FC = () => {
  const { activeVehicle, vehicles, showToast } = useApp();

  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(activeVehicle?.id || 'all');
  const [onlyCompatible, setOnlyCompatible] = useState<boolean>(false);
  const [viewingWishlistOnly, setViewingWishlistOnly] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<AccessoryItem | null>(null);

  // Selected vehicle for fitment checks
  const currentSelectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || activeVehicle;

  // Load Accessories
  const loadAccessories = async () => {
    const list = await accessoriesService.getAccessories({
      category: selectedCategory,
      searchQuery,
      maxPriceINR: maxPrice,
      vehicleMake: currentSelectedVehicle?.make,
      vehicleModel: currentSelectedVehicle?.model,
      onlyCompatibleWithGarage: onlyCompatible,
    });

    if (viewingWishlistOnly) {
      setAccessories(list.filter(item => item.isSaved));
    } else {
      setAccessories(list);
    }
  };

  useEffect(() => {
    loadAccessories();
  }, [selectedCategory, searchQuery, maxPrice, selectedVehicleId, onlyCompatible, viewingWishlistOnly]);

  const handleToggleWishlist = (e: React.MouseEvent, accessoryId: string) => {
    e.stopPropagation();
    const saved = accessoriesService.toggleSaveAccessory(accessoryId);
    showToast(saved ? 'Added to your Saved Accessories wishlist!' : 'Removed from wishlist.', 'info');
    loadAccessories();
  };

  const categories: Array<{ id: AccessoryCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All Items', icon: '🌟' },
    { id: 'interior', label: 'Interior', icon: '💺' },
    { id: 'exterior', label: 'Exterior', icon: '🛡️' },
    { id: 'cleaning_detailing', label: 'Cleaning & Detailing', icon: '✨' },
    { id: 'electronics_infotainment', label: 'Electronics & Dashcams', icon: '📹' },
    { id: 'safety_utility', label: 'Safety & Utility', icon: '🚨' },
    { id: 'ev_accessories', label: 'EV Accessories', icon: '⚡' },
    { id: 'maintenance_essentials', label: 'Maintenance Essentials', icon: '🔧' },
  ];

  const totalSavedCount = accessoriesService.getSavedAccessoryIds().length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Accessories Hub
            </h1>
            <Badge variant="electric" size="sm">
              Indicative Catalogue
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tailored hardware, EV charging solutions, and detailing essentials matched to Indian driving conditions
          </p>
        </div>

        {/* Wishlist Launcher */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setViewingWishlistOnly(!viewingWishlistOnly)}
            variant={viewingWishlistOnly ? 'primary' : 'outline'}
            size="sm"
            icon={<Heart className={`w-4 h-4 ${viewingWishlistOnly ? 'fill-current' : 'text-rose-400'}`} />}
          >
            <span>Saved Wishlist ({totalSavedCount})</span>
          </Button>
        </div>
      </div>

      {/* Vehicle Fitment Context Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <CarFront className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Checking fitment for:</span>
              <span className="text-sm font-bold text-white">
                {currentSelectedVehicle ? `${currentSelectedVehicle.make} ${currentSelectedVehicle.model} ${currentSelectedVehicle.variant}` : 'All Passenger Vehicles'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              AutoSphere verifies accessory dimensions, mounting clips, and EV charging socket compatibility.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {vehicles.length > 0 && (
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.city})
                </option>
              ))}
            </select>
          )}

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCompatible}
              onChange={(e) => setOnlyCompatible(e.target.checked)}
              className="rounded accent-cyan-400 bg-dark-800"
            />
            <span>Only Show Compatible</span>
          </label>
        </div>
      </div>

      {/* Category Pills Carousel Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-slate-950 shadow-glow-subtle font-bold'
                : 'bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search and Price Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accessories (e.g. 7D Mats, 4K Dashcam, Charger)..."
            className="w-full bg-dark-850 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto text-xs text-slate-400 justify-end">
          <span>Max Price: <strong className="text-white font-mono">{formatINR(maxPrice)}</strong></span>
          <input
            type="range"
            min={1000}
            max={35000}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 sm:w-44 accent-cyan-400"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {accessories.map((item) => {
          const compat = accessoriesService.checkCompatibility(
            item,
            currentSelectedVehicle?.make,
            currentSelectedVehicle?.model
          );

          return (
            <div
              key={item.id}
              onClick={() => setActiveModalProduct(item)}
              className="group rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between shadow-card cursor-pointer"
            >
              <div>
                {/* Image Header with Wishlist Button */}
                <div className="relative h-44 w-full overflow-hidden bg-dark-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-950/80 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider backdrop-blur-sm">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleWishlist(e, item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-dark-950/80 hover:bg-dark-900 text-slate-400 hover:text-rose-400 border border-slate-700/80 backdrop-blur-sm transition-colors"
                    title={item.isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                      {item.brand}
                    </span>
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Compatibility Badge */}
                  <div className="pt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                      compat.badgeVariant === 'success'
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                        : compat.badgeVariant === 'info'
                        ? 'bg-cyan-950/40 border-cyan-800/40 text-cyan-300'
                        : 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                    }`}>
                      {compat.badgeVariant === 'warning' ? '⚠️' : '✓'} {compat.badgeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Strip */}
              <div className="p-4 bg-dark-850/60 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Indicative Price</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {formatINR(item.indicativePriceINR)}
                  </span>
                </div>

                <span className="text-xs text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                  Specs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {accessories.length === 0 && (
        <Card>
          <div className="py-12 text-center max-w-md mx-auto space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No accessories found</h3>
            <p className="text-xs text-slate-400">
              {viewingWishlistOnly
                ? 'Your Saved Accessories wishlist is empty. Tap the heart icon on any product to save it.'
                : 'No items match your active search and category filters. Try widening the max price limit.'}
            </p>
            {viewingWishlistOnly ? (
              <Button onClick={() => setViewingWishlistOnly(false)} variant="primary" size="sm">
                Explore Full Catalogue
              </Button>
            ) : (
              <Button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(35000); setOnlyCompatible(false); }} variant="outline" size="sm">
                Reset Filters
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ==================================================================== */}
      {/* PRODUCT DETAILS MODAL                                                */}
      {/* ==================================================================== */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-dark-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={activeModalProduct.image}
                alt={activeModalProduct.name}
                className="w-full sm:w-56 h-48 object-cover rounded-xl border border-slate-700 shrink-0"
              />
              <div className="space-y-2">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  {activeModalProduct.brand} • {activeModalProduct.category.replace('_', ' ')}
                </span>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeModalProduct.name}
                </h2>
                <div className="text-xl font-extrabold text-white font-mono">
                  {formatINR(activeModalProduct.indicativePriceINR)}
                  <span className="text-xs text-slate-500 font-normal ml-1.5">(Indicative Sample MRP)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {activeModalProduct.shortDescription}
                </p>
              </div>
            </div>

            {/* Vehicle Fitment Advisory Card */}
            <div className="p-3.5 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Vehicle Fitment & Compatibility:
              </span>
              <p className="text-xs text-slate-300">
                {activeModalProduct.compatibilityType === 'universal'
                  ? 'Universal Fitment: Designed to fit all Indian passenger cars, hatchbacks, sedans, and SUVs.'
                  : `Specifically engineered for: ${activeModalProduct.compatibleMakes?.join(', ')} (${activeModalProduct.compatibleModels?.join(', ')}).`}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span>Installation Difficulty:</span>
                <Badge variant={activeModalProduct.installationDifficulty === 'easy_diy' ? 'success' : 'warning'} size="xs">
                  {activeModalProduct.installationDifficulty.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-white block">Key Technical Specifications:</span>
              <div className="divide-y divide-slate-800 bg-dark-850 rounded-xl p-3 border border-slate-800">
                {Object.entries(activeModalProduct.specifications).map(([key, val], idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between">
                    <span className="text-slate-400">{key}</span>
                    <span className="font-semibold text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Scope Disclaimer */}
            <div className="p-3 rounded-xl bg-dark-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
              <span>
                <strong>Sample Catalogue Notice:</strong> AutoSphere is an automotive intelligence platform. Hardware items are presented as verified fitment recommendations with indicative retail prices. Online payments and physical dispatch are not active.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                onClick={(e) => {
                  handleToggleWishlist(e, activeModalProduct.id);
                  setActiveModalProduct(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
                }}
                variant="outline"
                size="sm"
                icon={<Heart className={`w-4 h-4 ${activeModalProduct.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />}
              >
                {activeModalProduct.isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button onClick={() => setActiveModalProduct(null)} variant="primary" size="sm">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
