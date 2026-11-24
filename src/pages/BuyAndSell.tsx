import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CarFront, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Fuel, 
  Gauge, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  ArrowRight,
  Plus,
  Tag,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Eye,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  Info,
  DollarSign,
  Send,
  X,
  SlidersHorizontal,
  ChevronRight,
  Car
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { NumberPlate } from '../components/common/NumberPlate';
import { formatINR, formatKm, formatDate } from '../utils/formatters';
import {
  UsedCarListing,
  UsedCarEnquiry,
  ListingFilterCriteria,
  VehicleCondition,
  UsedCarPriceEstimate,
} from '../types/buysell.types';
import { usedCarListingService } from '../services/usedCarListingService';
import { usedCarPriceService } from '../services/usedCarPriceService';

export const BuyAndSell: React.FC = () => {
  const { activeVehicle, vehicles, userProfile, showToast } = useApp();

  // Primary Tab: 'buy' | 'sell'
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  // --------------------------------------------------------------------------
  // BUY SMART STATE & FILTERS
  // --------------------------------------------------------------------------
  const [listings, setListings] = useState<UsedCarListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState<ListingFilterCriteria>({
    searchQuery: '',
    make: 'all',
    fuelType: 'all',
    transmission: 'all',
    city: 'all',
    maxPriceINR: 5000000,
    condition: 'all',
    verifiedOnly: false,
  });

  // Modals for Buyer Experience
  const [selectedListingForDetails, setSelectedListingForDetails] = useState<UsedCarListing | null>(null);
  const [selectedListingForEnquiry, setSelectedListingForEnquiry] = useState<UsedCarListing | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryOfferPrice, setEnquiryOfferPrice] = useState<number | ''>('');
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);

  // --------------------------------------------------------------------------
  // SELL YOUR CAR STATE & MANAGEMENT
  // --------------------------------------------------------------------------
  const [sellSubTab, setSellSubTab] = useState<'create' | 'my_listings' | 'inbox'>('create');
  const [myListings, setMyListings] = useState<UsedCarListing[]>([]);
  const [receivedEnquiries, setReceivedEnquiries] = useState<UsedCarEnquiry[]>([]);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Listing Creation Form
  const [selectedGarageVehicleId, setSelectedGarageVehicleId] = useState<string>('manual');
  const [formMake, setFormMake] = useState('Mahindra');
  const [formModel, setFormModel] = useState('XUV700');
  const [formVariant, setFormVariant] = useState('AX7 Luxury Diesel AT');
  const [formYear, setFormYear] = useState(2023);
  const [formFuelType, setFormFuelType] = useState<'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid'>('diesel');
  const [formTransmission, setFormTransmission] = useState<'manual' | 'automatic'>('automatic');
  const [formOdometer, setFormOdometer] = useState(28000);
  const [formCity, setFormCity] = useState(activeVehicle?.city || 'Bengaluru');
  const [formState, setFormState] = useState(activeVehicle?.state || 'Karnataka');
  const [formOwners, setFormOwners] = useState(1);
  const [formCondition, setFormCondition] = useState<VehicleCondition>('excellent');
  const [formAskingPrice, setFormAskingPrice] = useState(2190000);
  const [formDescription, setFormDescription] = useState('Single owner, complete authorized service history, pristine condition.');
  const [formPhotoUrl, setFormPhotoUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');

  // Real-time suggested selling price calculation
  const livePriceSuggestion: UsedCarPriceEstimate = usedCarPriceService.estimatePrice({
    make: formMake,
    model: formModel,
    variant: formVariant,
    year: formYear,
    fuelType: formFuelType,
    transmission: formTransmission,
    odometerKm: formOdometer,
    ownershipCount: formOwners,
    condition: formCondition,
    city: formCity,
    askingPriceINR: formAskingPrice,
  });

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    const data = await usedCarListingService.getListings(filterCriteria);
    setListings(data);

    const userId = userProfile?.email || 'user-demo';
    const userCars = await usedCarListingService.getMyListings(userId);
    setMyListings(userCars);

    const enqs = await usedCarListingService.getMyReceivedEnquiries(userId);
    setReceivedEnquiries(enqs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterCriteria]);

  // Handle Garage Vehicle Select
  const handleGarageVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehId = e.target.value;
    setSelectedGarageVehicleId(vehId);
    if (vehId !== 'manual') {
      const v = vehicles.find(item => item.id === vehId);
      if (v) {
        setFormMake(v.make);
        setFormModel(v.model);
        setFormVariant(v.variant);
        setFormYear(v.year);
        setFormFuelType(v.fuelType as any);
        setFormTransmission(v.transmission as any);
        setFormOdometer(v.odoKm);
        setFormCity(v.city);
        setFormState(v.state);
        showToast(`Auto-filled vehicle details for ${v.make} ${v.model} from My Garage!`, 'info');
      }
    }
  };

  // Submit Listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = userProfile?.email || 'user-demo';

    const newCar = await usedCarListingService.createListing({
      userId,
      title: `${formYear} ${formMake} ${formModel} ${formVariant}`,
      make: formMake,
      model: formModel,
      variant: formVariant,
      manufacturingYear: Number(formYear),
      registrationYear: Number(formYear),
      fuelType: formFuelType,
      transmission: formTransmission,
      odometerKm: Number(formOdometer),
      city: formCity,
      state: formState,
      rtoCode: `${formState.slice(0, 2).toUpperCase()}-01`,
      regNumberMasked: `${formState.slice(0, 2).toUpperCase()} 01 ** 9999`,
      ownershipCount: Number(formOwners),
      vehicleCondition: formCondition,
      askingPriceINR: Number(formAskingPrice),
      description: formDescription,
      features: ['Power Steering', 'Keyless Entry', 'Touchscreen Infotainment', 'Reverse Camera', 'ABS with EBD'],
      photos: [formPhotoUrl],
      status: 'active',
      isVerified: false,
      serviceHistoryAvailable: true,
      sellerName: userProfile?.name || 'Verified Owner',
      sellerType: 'Certified Individual Owner',
    });

    showToast(`Listing published! Suggested starting asking price: ${formatINR(newCar.suggestedPriceINR || 0)}`, 'success');
    setSellSubTab('my_listings');
    loadData();
  };

  // Submit Safe Enquiry
  const handleSendEnquiry = async () => {
    if (!selectedListingForEnquiry || !enquiryMessage.trim()) return;
    setIsSubmittingEnquiry(true);

    const buyerId = userProfile?.email || 'buyer-guest';
    const buyerName = userProfile?.name || 'AutoSphere Verified Member';

    await usedCarListingService.sendEnquiry({
      listingId: selectedListingForEnquiry.id,
      listingTitle: selectedListingForEnquiry.title,
      buyerId,
      buyerName,
      sellerId: selectedListingForEnquiry.userId,
      message: enquiryMessage.trim(),
      offeredPriceINR: enquiryOfferPrice ? Number(enquiryOfferPrice) : undefined,
    });

    setIsSubmittingEnquiry(false);
    setSelectedListingForEnquiry(null);
    setEnquiryMessage('');
    setEnquiryOfferPrice('');
    showToast('Enquiry sent securely! The seller has been notified privately.', 'success');
  };

  // Reply to Enquiry
  const handleReplyEnquiry = async (enquiryId: string) => {
    const text = replyTextMap[enquiryId];
    if (!text?.trim()) return;

    await usedCarListingService.respondToEnquiry(enquiryId, text.trim());
    setReplyTextMap(prev => ({ ...prev, [enquiryId]: '' }));
    showToast('Response sent to buyer!', 'success');
    loadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Buy & Sell Intelligence
            </h1>
            <Badge variant="electric" size="sm">
              TruePrice™ Analytics
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Algorithmic fair-market valuation, transparent verified listings, and secure consumer-to-consumer enquiries
          </p>
        </div>

        {/* Primary Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-dark-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'buy'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-subtle'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Buy Smart ({listings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sell'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-subtle'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sell Your Car</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: BUY SMART (MARKETPLACE & FAIR PRICE ANALYSIS)                  */}
      {/* ==================================================================== */}
      {activeTab === 'buy' && (
        <div className="space-y-6">
          {/* Multi-Factor Filter Card */}
          <Card>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={filterCriteria.searchQuery || ''}
                    onChange={(e) => setFilterCriteria(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search by make, model, or keywords (e.g. XUV700, Swift, Creta, Sunroof)..."
                    className="w-full bg-dark-850 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Manufacturer */}
                  <select
                    value={filterCriteria.make || 'all'}
                    onChange={(e) => setFilterCriteria(prev => ({ ...prev, make: e.target.value }))}
                    className="bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Brands</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Tata Motors">Tata Motors</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Kia">Kia</option>
                    <option value="Honda">Honda</option>
                  </select>

                  {/* Fuel Type */}
                  <select
                    value={filterCriteria.fuelType || 'all'}
                    onChange={(e) => setFilterCriteria(prev => ({ ...prev, fuelType: e.target.value }))}
                    className="bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Fuels</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric (EV)</option>
                  </select>

                  {/* Transmission */}
                  <select
                    value={filterCriteria.transmission || 'all'}
                    onChange={(e) => setFilterCriteria(prev => ({ ...prev, transmission: e.target.value }))}
                    className="bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Transmissions</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>

                  {/* City */}
                  <select
                    value={filterCriteria.city || 'all'}
                    onChange={(e) => setFilterCriteria(prev => ({ ...prev, city: e.target.value }))}
                    className="bg-dark-850 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Cities</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
              </div>

              {/* Secondary Filter Strip: Budget & Verified Only */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Max Budget: <strong className="text-white font-mono">{formatINR(filterCriteria.maxPriceINR || 5000000)}</strong></span>
                  <input
                    type="range"
                    min={400000}
                    max={5000000}
                    step={100000}
                    value={filterCriteria.maxPriceINR || 5000000}
                    onChange={(e) => setFilterCriteria(prev => ({ ...prev, maxPriceINR: Number(e.target.value) }))}
                    className="w-32 sm:w-48 accent-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterCriteria.verifiedOnly || false}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                      className="rounded accent-cyan-400 bg-dark-800"
                    />
                    <span className="text-slate-300">AutoSphere Verified Only</span>
                  </label>

                  <button
                    onClick={() => setFilterCriteria({
                      searchQuery: '',
                      make: 'all',
                      fuelType: 'all',
                      transmission: 'all',
                      city: 'all',
                      maxPriceINR: 5000000,
                      condition: 'all',
                      verifiedOnly: false,
                    })}
                    className="text-cyan-400 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((car) => {
              const estimate = car.priceEstimate;
              const isBelow = estimate?.assessment === 'below_estimated_range';
              const isAbove = estimate?.assessment === 'above_estimated_range';

              return (
                <div
                  key={car.id}
                  className="rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between shadow-card"
                >
                  <div>
                    {/* Image Header with Verification Badge */}
                    <div className="relative h-48 w-full overflow-hidden bg-dark-950">
                      <img
                        src={car.photos[0]}
                        alt={car.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {car.isVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3" />
                            AutoSphere Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-950/80 text-slate-300 border border-slate-700">
                            Seller Submitted
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-950/80 text-emerald-400 border border-emerald-500/30 uppercase">
                          {car.vehicleCondition.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <NumberPlate registrationNumber={car.regNumberMasked || 'KA 03 ** 8820'} size="sm" isEV={car.fuelType === 'electric'} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-white text-sm line-clamp-1" title={car.title}>
                            {car.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{car.city}, {car.state}</span>
                          <span>•</span>
                          <span>{car.ownershipCount === 1 ? '1st Owner' : `${car.ownershipCount} Owners`}</span>
                        </p>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block uppercase">Year</span>
                          <span className="font-semibold text-slate-200">{car.manufacturingYear}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block uppercase">Kilometres</span>
                          <span className="font-semibold text-slate-200">{formatKm(car.odometerKm)}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 block uppercase">Fuel & Gear</span>
                          <span className="font-semibold text-slate-200 capitalize truncate">{car.fuelType} ({car.transmission.slice(0, 2).toUpperCase()})</span>
                        </div>
                      </div>

                      {/* Asking Price & Fair-Price Assessment Pill */}
                      <div className="pt-1 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Asking Price</span>
                          <span className="text-lg font-bold text-white font-mono">
                            {formatINR(car.askingPriceINR)}
                          </span>
                        </div>

                        {estimate && (
                          <div className="text-right">
                            {isBelow && (
                              <Badge variant="success" size="xs">
                                🟢 {Math.abs(estimate.differencePercent)}% Below Market
                              </Badge>
                            )}
                            {isAbove && (
                              <Badge variant="warning" size="xs">
                                🟡 {estimate.differencePercent}% Above Market
                              </Badge>
                            )}
                            {!isBelow && !isAbove && (
                              <Badge variant="electric" size="xs">
                                🔵 Fair Price (In Range)
                              </Badge>
                            )}
                            <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                              Est: {formatINR(estimate.estimatedPriceINR)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-dark-850/60 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedListingForDetails(car)}
                      className="flex-1 px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Price Analysis</span>
                    </button>
                    <button
                      onClick={() => setSelectedListingForEnquiry(car)}
                      className="flex-1 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {listings.length === 0 && !isLoading && (
            <Card>
              <div className="py-12 text-center max-w-md mx-auto space-y-3">
                <CarFront className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No listings match your filter criteria</h3>
                <p className="text-xs text-slate-400">
                  Try widening your budget range or selecting different fuel and city preferences.
                </p>
                <Button
                  onClick={() => setFilterCriteria({ maxPriceINR: 5000000 })}
                  variant="outline"
                  size="sm"
                >
                  Reset All Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: SELL YOUR CAR (CREATE LISTING, SMART PRICING & INBOX)          */}
      {/* ==================================================================== */}
      {activeTab === 'sell' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
            <button
              onClick={() => setSellSubTab('create')}
              className={`pb-3 transition-colors flex items-center gap-2 ${
                sellSubTab === 'create'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Listing</span>
            </button>
            <button
              onClick={() => setSellSubTab('my_listings')}
              className={`pb-3 transition-colors flex items-center gap-2 ${
                sellSubTab === 'my_listings'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CarFront className="w-4 h-4" />
              <span>My Active Listings ({myListings.length})</span>
            </button>
            <button
              onClick={() => setSellSubTab('inbox')}
              className={`pb-3 transition-colors flex items-center gap-2 ${
                sellSubTab === 'inbox'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Received Enquiries ({receivedEnquiries.length})</span>
            </button>
          </div>

          {/* SUB-TAB 1: CREATE LISTING WIZARD */}
          {sellSubTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form (7 cols) */}
              <div className="lg:col-span-7">
                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <CarFront className="w-4 h-4 text-cyan-400" />
                      <span>Vehicle Details & Expected Price</span>
                    </div>
                  }
                >
                  <form onSubmit={handleCreateListing} className="space-y-4">
                    {/* Select from Garage */}
                    {vehicles.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-dark-850 border border-cyan-500/30 space-y-2">
                        <label className="text-xs font-bold text-cyan-300 block">
                          ⚡ Quick Auto-Fill from My Garage
                        </label>
                        <select
                          value={selectedGarageVehicleId}
                          onChange={handleGarageVehicleSelect}
                          className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="manual">Manual Entry / Enter Custom Vehicle</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.make} {v.model} {v.variant} ({v.year}) - {formatKm(v.odoKm)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Manufacturer</label>
                        <input
                          type="text"
                          value={formMake}
                          onChange={(e) => setFormMake(e.target.value)}
                          required
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Model</label>
                        <input
                          type="text"
                          value={formModel}
                          onChange={(e) => setFormModel(e.target.value)}
                          required
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Variant</label>
                        <input
                          type="text"
                          value={formVariant}
                          onChange={(e) => setFormVariant(e.target.value)}
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Manufacturing Year</label>
                        <input
                          type="number"
                          value={formYear}
                          onChange={(e) => setFormYear(Number(e.target.value))}
                          min={2005}
                          max={2026}
                          required
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Odometer (km)</label>
                        <input
                          type="number"
                          value={formOdometer}
                          onChange={(e) => setFormOdometer(Number(e.target.value))}
                          required
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Fuel Type</label>
                        <select
                          value={formFuelType}
                          onChange={(e) => setFormFuelType(e.target.value as any)}
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="cng">CNG</option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Transmission</label>
                        <select
                          value={formTransmission}
                          onChange={(e) => setFormTransmission(e.target.value as any)}
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="manual">Manual</option>
                          <option value="automatic">Automatic</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Condition</label>
                        <select
                          value={formCondition}
                          onChange={(e) => setFormCondition(e.target.value as any)}
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize"
                        >
                          <option value="excellent">Excellent</option>
                          <option value="very_good">Very Good</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">City</label>
                        <input
                          type="text"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          required
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">State</label>
                        <input
                          type="text"
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          required
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-medium">Ownership Count</label>
                        <select
                          value={formOwners}
                          onChange={(e) => setFormOwners(Number(e.target.value))}
                          className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value={1}>1st Owner</option>
                          <option value={2}>2nd Owner</option>
                          <option value={3}>3rd Owner</option>
                          <option value={4}>4th+ Owner</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="text-slate-400 block mb-1 font-medium">Photo URL</label>
                      <input
                        type="url"
                        value={formPhotoUrl}
                        onChange={(e) => setFormPhotoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="text-xs">
                      <label className="text-slate-400 block mb-1 font-medium">Description</label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-white block mb-1">
                        Your Expected Asking Price (INR)
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">₹</span>
                          <input
                            type="number"
                            value={formAskingPrice}
                            onChange={(e) => setFormAskingPrice(Number(e.target.value))}
                            step={10000}
                            required
                            className="w-full bg-dark-850 border border-cyan-500/40 rounded-xl pl-8 pr-4 py-2 text-sm text-white font-mono font-bold"
                          />
                        </div>
                        <Button type="submit" variant="primary" icon={<Plus className="w-4 h-4" />}>
                          Publish Listing
                        </Button>
                      </div>
                    </div>
                  </form>
                </Card>
              </div>

              {/* Right Column: Smart Selling Price Suggestion (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <Card
                  header={
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span>Smart Selling Price Suggestion</span>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Recommended Asking Price
                        </span>
                        <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5">
                          {formatINR(livePriceSuggestion.recommendedAskingPriceINR)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Suggested Range</span>
                          <span className="font-mono font-bold text-white">
                            {formatINR(livePriceSuggestion.priceRangeMinINR)} – {formatINR(livePriceSuggestion.priceRangeMaxINR)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Confidence Level</span>
                          <Badge variant={livePriceSuggestion.confidenceLevel === 'high' ? 'success' : 'warning'} size="xs">
                            {livePriceSuggestion.confidenceLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {formAskingPrice && (
                        <div className="pt-2 border-t border-slate-800/80 text-xs flex items-center justify-between">
                          <span className="text-slate-400">Difference from your price:</span>
                          <span className={`font-mono font-bold ${
                            livePriceSuggestion.differencePercent > 5 ? 'text-amber-400' : livePriceSuggestion.differencePercent < -5 ? 'text-emerald-400' : 'text-slate-200'
                          }`}>
                            {livePriceSuggestion.differencePercent > 0 ? `+${livePriceSuggestion.differencePercent}%` : `${livePriceSuggestion.differencePercent}%`} ({formatINR(livePriceSuggestion.differenceINR)})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explanatory Factors */}
                    <div>
                      <h4 className="text-xs font-bold text-white mb-2">Key Value Drivers:</h4>
                      <div className="space-y-1.5 text-xs">
                        {livePriceSuggestion.factors.slice(0, 4).map((f, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-dark-850/60 border border-slate-800/80 flex items-start justify-between gap-2">
                            <div>
                              <span className="font-semibold text-slate-200">{f.factor}</span>
                              <p className="text-[11px] text-slate-400 mt-0.5">{f.description}</p>
                            </div>
                            <span className={`font-mono text-xs font-bold shrink-0 ${
                              f.impact === 'positive' ? 'text-emerald-400' : f.impact === 'negative' ? 'text-rose-400' : 'text-slate-400'
                            }`}>
                              {f.percentage > 0 ? `+${f.percentage}%` : f.percentage < 0 ? `${f.percentage}%` : '0%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-300 leading-relaxed">
                      ⚠️ <strong>Disclaimer:</strong> This suggested range is derived algorithmically from regional RTO benchmarks, brand retention, and age curves. AutoSphere does not promise that the vehicle will sell at this price.
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: MY ACTIVE LISTINGS */}
          {sellSubTab === 'my_listings' && (
            <div className="space-y-4">
              {myListings.length === 0 ? (
                <Card>
                  <div className="py-12 text-center max-w-md mx-auto space-y-3">
                    <CarFront className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-white">You have no active vehicle listings</h3>
                    <p className="text-xs text-slate-400">
                      Create your first verified vehicle listing to receive direct buyer enquiries with zero brokerage.
                    </p>
                    <Button onClick={() => setSellSubTab('create')} variant="primary" size="sm">
                      Create Vehicle Listing
                    </Button>
                  </div>
                </Card>
              ) : (
                myListings.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.photos[0]}
                        alt={item.title}
                        className="w-24 h-18 object-cover rounded-xl border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <Badge variant={item.status === 'active' ? 'success' : item.status === 'sold' ? 'info' : 'warning'} size="xs">
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatKm(item.odometerKm)} • {item.city} • Asking: <strong className="text-white font-mono">{formatINR(item.askingPriceINR)}</strong>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Published on {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {item.status === 'active' && (
                        <button
                          onClick={async () => {
                            await usedCarListingService.updateListingStatus(item.id, 'paused');
                            showToast('Listing paused.', 'info');
                            loadData();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </button>
                      )}

                      {item.status === 'paused' && (
                        <button
                          onClick={async () => {
                            await usedCarListingService.updateListingStatus(item.id, 'active');
                            showToast('Listing activated!', 'success');
                            loadData();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-emerald-400 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Activate</span>
                        </button>
                      )}

                      {item.status !== 'sold' && (
                        <button
                          onClick={async () => {
                            await usedCarListingService.updateListingStatus(item.id, 'sold');
                            showToast('Vehicle marked as SOLD! Congratulations!', 'success');
                            loadData();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Mark Sold</span>
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          await usedCarListingService.deleteListing(item.id);
                          showToast('Listing deleted.', 'info');
                          loadData();
                        }}
                        className="p-2 rounded-lg bg-dark-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SUB-TAB 3: RECEIVED ENQUIRIES INBOX */}
          {sellSubTab === 'inbox' && (
            <div className="space-y-4">
              {receivedEnquiries.length === 0 ? (
                <Card>
                  <div className="py-12 text-center max-w-md mx-auto space-y-3">
                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-white">No buyer enquiries yet</h3>
                    <p className="text-xs text-slate-400">
                      When prospective buyers enquire about your listings, their messages and price offers will appear securely here.
                    </p>
                  </div>
                </Card>
              ) : (
                receivedEnquiries.map(enq => (
                  <Card key={enq.id}>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{enq.buyerName}</h4>
                            <Badge variant={enq.status === 'responded' ? 'success' : 'warning'} size="xs">
                              {enq.status.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Regarding: <strong>{enq.listingTitle}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {formatDate(enq.createdAt)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 text-xs text-slate-200">
                        <p className="leading-relaxed">{enq.message}</p>
                        {enq.offeredPriceINR && (
                          <div className="mt-2 pt-2 border-t border-slate-800 font-mono text-cyan-300 font-bold">
                            Offered Price: {formatINR(enq.offeredPriceINR)}
                          </div>
                        )}
                      </div>

                      {enq.sellerResponse && (
                        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 space-y-1">
                          <span className="text-[10px] text-cyan-400 uppercase font-bold block">Your Sent Response:</span>
                          <p>{enq.sellerResponse}</p>
                        </div>
                      )}

                      {/* Reply Box */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyTextMap[enq.id] || ''}
                          onChange={(e) => setReplyTextMap(prev => ({ ...prev, [enq.id]: e.target.value }))}
                          placeholder="Type your safe response to the buyer..."
                          className="flex-1 bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <Button
                          onClick={() => handleReplyEnquiry(enq.id)}
                          disabled={!replyTextMap[enq.id]?.trim()}
                          variant="primary"
                          size="sm"
                          icon={<Send className="w-3.5 h-3.5" />}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: PRICE INTELLIGENCE & CAR INSPECTION DETAILS MODAL            */}
      {/* ==================================================================== */}
      {selectedListingForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <button
              onClick={() => setSelectedListingForDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-dark-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedListingForDetails.isVerified ? 'electric' : 'neutral'} size="xs">
                  {selectedListingForDetails.isVerified ? 'AutoSphere Verified' : 'Seller Submitted'}
                </Badge>
                <span className="text-xs text-slate-400">
                  Listed {formatDate(selectedListingForDetails.createdAt)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedListingForDetails.title}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedListingForDetails.city}, {selectedListingForDetails.state} • {formatKm(selectedListingForDetails.odometerKm)} • {selectedListingForDetails.ownershipCount === 1 ? 'Single Owner' : `${selectedListingForDetails.ownershipCount} Registered Owners`}
              </p>
            </div>

            {/* Fair-Price Intelligence Section */}
            {selectedListingForDetails.priceEstimate && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-dark-850 to-dark-900 border border-cyan-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                      TruePrice™ Algorithmic Valuation
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xl font-extrabold text-white font-mono">
                        Asking: {formatINR(selectedListingForDetails.askingPriceINR)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400 font-mono">
                        (Est Range: {formatINR(selectedListingForDetails.priceEstimate.priceRangeMinINR)} – {formatINR(selectedListingForDetails.priceEstimate.priceRangeMaxINR)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedListingForDetails.priceEstimate.assessment === 'below_estimated_range'
                          ? 'success'
                          : selectedListingForDetails.priceEstimate.assessment === 'above_estimated_range'
                          ? 'warning'
                          : 'electric'
                      }
                      size="sm"
                    >
                      {selectedListingForDetails.priceEstimate.assessment.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Factors Influencing Estimate */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-2">Factors Influencing Fair-Price Analysis:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedListingForDetails.priceEstimate.factors.map((fac, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-dark-900/80 border border-slate-800 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{fac.factor}</span>
                          <span className={`font-mono text-xs font-bold ${
                            fac.impact === 'positive' ? 'text-emerald-400' : fac.impact === 'negative' ? 'text-rose-400' : 'text-slate-400'
                          }`}>
                            {fac.percentage > 0 ? `+${fac.percentage}%` : fac.percentage < 0 ? `${fac.percentage}%` : '0%'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{fac.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assumptions Disclaimer */}
                <div className="p-2.5 rounded-lg bg-dark-950/60 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-300 block">Valuation Assumptions & Methodology:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedListingForDetails.priceEstimate.assumptions.map((asm, idx) => (
                      <li key={idx}>{asm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Vehicle Description */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-white block">Seller's Note:</span>
              <p className="p-3 rounded-xl bg-dark-850 border border-slate-800 leading-relaxed">
                {selectedListingForDetails.description}
              </p>
            </div>

            {/* Features Tags */}
            {selectedListingForDetails.features.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-white block">Key Equipment & Features:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedListingForDetails.features.map((feat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-dark-800 text-slate-300 border border-slate-700">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Contact: <strong className="text-white">{selectedListingForDetails.sellerName || 'Direct Owner'}</strong>
              </span>
              <Button
                onClick={() => {
                  setSelectedListingForEnquiry(selectedListingForDetails);
                  setSelectedListingForDetails(null);
                }}
                variant="primary"
                size="sm"
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Send Safe Buyer Enquiry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SAFE BUYER-SELLER ENQUIRY MODAL                             */}
      {/* ==================================================================== */}
      {selectedListingForEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedListingForEnquiry(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-dark-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                Safe Consumer-to-Consumer Enquiry
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Enquire about {selectedListingForEnquiry.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Asking Price: <strong className="text-white font-mono">{formatINR(selectedListingForEnquiry.askingPriceINR)}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Your Message to Seller</label>
                <textarea
                  rows={4}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  placeholder="Ask about vehicle maintenance, inspection availability, or negotiate price..."
                  className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Optional Offer Price (INR)</label>
                <input
                  type="number"
                  value={enquiryOfferPrice}
                  onChange={(e) => setEnquiryOfferPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder={`e.g. ${selectedListingForEnquiry.askingPriceINR}`}
                  step={5000}
                  className="w-full bg-dark-850 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-cyan-300 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <span>
                  <strong>Privacy Guaranteed:</strong> Your personal email and phone number are never shared publicly or disclosed to the seller. All communications occur securely within the AutoSphere verified inbox.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button onClick={() => setSelectedListingForEnquiry(null)} variant="ghost" size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleSendEnquiry}
                disabled={!enquiryMessage.trim() || isSubmittingEnquiry}
                isLoading={isSubmittingEnquiry}
                variant="primary"
                size="sm"
                icon={<Send className="w-4 h-4" />}
              >
                Send Enquiry
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
