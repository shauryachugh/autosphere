import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Car, 
  SlidersHorizontal, 
  Layers, 
  History, 
  ArrowRight, 
  Check, 
  RotateCcw,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CurrentVehicleStep } from '../components/recommendations/CurrentVehicleStep';
import { ReplacementCriteriaStep } from '../components/recommendations/ReplacementCriteriaStep';
import { RankedCarsStep } from '../components/recommendations/RankedCarsStep';
import { ComparisonDashboard } from '../components/recommendations/ComparisonDashboard';
import { FinalVerdictCard } from '../components/recommendations/FinalVerdictCard';
import { SavedAnalysesDrawer } from '../components/recommendations/SavedAnalysesDrawer';
import { indianCarCatalogue } from '../data/indianCarCatalogue';
import { 
  CurrentVehicleAnalysis, 
  ReplacementRequirements, 
  CurrentCarTCO, 
  ReplacementCarTCO, 
  FinalVerdict,
  SavedRecommendationAnalysis 
} from '../types/replacement.types';
import { 
  calculateCurrentCarTCO, 
  rankReplacementCars, 
  generateFinalVerdict 
} from '../utils/tcoCalculator';
import { recommendationService } from '../services/recommendationService';

export const Recommendations: React.FC = () => {
  const { activeVehicle, activeVehicleExpenses, showToast } = useApp();
  const { user, isGuest } = useAuth();

  // Wizard Step: 1 = Current Vehicle, 2 = Requirements, 3 = Ranked Matches, 4 = Comparison Matrix, 5 = Final Verdict
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Saved analyses drawer
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedRecommendationAnalysis[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 1. Current Vehicle Initial State
  const [currentVehicleData, setCurrentVehicleData] = useState<CurrentVehicleAnalysis>(() => {
    // Derive monthly fuel from activeVehicleExpenses
    const fuelExpenses = activeVehicleExpenses.filter(
      (e) => activeVehicle && e.vehicleId === activeVehicle.id && (e.category === 'fuel' || e.category === 'charging')
    );
    const totalFuelLogged = fuelExpenses.reduce((sum, e) => sum + e.amountINR, 0);
    const estimatedMonthlyFuel = fuelExpenses.length > 0 
      ? Math.round(totalFuelLogged / Math.max(1, Math.min(6, fuelExpenses.length)))
      : activeVehicle?.fuelType === 'electric' ? 1800 : activeVehicle?.fuelType === 'diesel' ? 8200 : 9500;

    const serviceExpenses = activeVehicleExpenses.filter(
      (e) => activeVehicle && e.vehicleId === activeVehicle.id && e.category === 'service'
    );
    const totalServiceLogged = serviceExpenses.reduce((sum, e) => sum + e.amountINR, 0);
    const estimatedAnnualMaint = serviceExpenses.length > 0
      ? totalServiceLogged
      : activeVehicle?.fuelType === 'electric' ? 7500 : 14500;

    const ageYears = Math.max(1, 2026 - (activeVehicle?.manufacturingYear || activeVehicle?.year || 2023));
    const originalPrice = activeVehicle?.purchasePriceINR || 2200000;
    const depFactor = Math.pow(0.88, ageYears);
    const estimatedResale = Math.round(originalPrice * depFactor);

    return {
      vehicleId: activeVehicle?.id,
      make: activeVehicle?.make || 'Mahindra',
      model: activeVehicle?.model || 'XUV700',
      variant: activeVehicle?.variant || 'AX7L AWD',
      manufacturingYear: activeVehicle?.manufacturingYear || activeVehicle?.year || 2023,
      fuelType: activeVehicle?.fuelType || 'diesel',
      transmission: activeVehicle?.transmission || 'automatic',
      bodyType: activeVehicle?.bodyType || 'suv',
      currentOdometer: activeVehicle?.odoKm || 28500,
      monthlyKmDriven: 1250,
      monthlyFuelExpenditure: estimatedMonthlyFuel,
      annualMaintenanceExpenses: estimatedAnnualMaint,
      annualRepairExpenses: 8000,
      annualInsuranceExpenses: 34000,
      currentEstimatedResaleValue: estimatedResale,
      city: activeVehicle?.city || 'Bengaluru',
      state: activeVehicle?.state || 'Karnataka',
    };
  });

  // 2. Replacement Criteria State
  const [replacementCriteria, setReplacementCriteria] = useState<ReplacementRequirements>({
    maxPurchaseBudgetINR: 2500000,
    preferredMonthlyEmiINR: 28000,
    downPaymentINR: 400000,
    applyResaleAsDownPayment: true,
    loanTenureYears: 5,
    loanInterestRatePercent: 9.0,
    preferredFuelType: 'all',
    transmissionPreference: 'all',
    vehicleCategory: 'all',
    monthlyDrivingDistanceKm: 1250,
    state: currentVehicleData.state || 'Karnataka',
    city: currentVehicleData.city || 'Bengaluru',
    cityDrivingPercent: 70,
    highwayDrivingPercent: 30,
  });

  // 3. Calculated TCO & Ranked Cars
  const [currentCarTCO, setCurrentCarTCO] = useState<CurrentCarTCO>(() =>
    calculateCurrentCarTCO(currentVehicleData)
  );
  const [rankedCars, setRankedCars] = useState<ReplacementCarTCO[]>([]);
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
  const [finalVerdict, setFinalVerdict] = useState<FinalVerdict | null>(null);

  // Load saved analyses on mount
  useEffect(() => {
    async function loadSaved() {
      if (user) {
        const list = await recommendationService.fetchAnalyses(user.id, isGuest);
        setSavedAnalyses(list);
      }
    }
    loadSaved();
  }, [user, isGuest]);

  // Handle Step 1 -> Step 2
  const handleCurrentVehicleSubmit = (data: CurrentVehicleAnalysis) => {
    setCurrentVehicleData(data);
    const tco = calculateCurrentCarTCO(data);
    setCurrentCarTCO(tco);
    setReplacementCriteria((prev) => ({
      ...prev,
      monthlyDrivingDistanceKm: data.monthlyKmDriven,
      state: data.state,
      city: data.city,
    }));
    setCurrentStep(2);
  };

  // Handle Step 2 -> Step 3
  const handleReplacementCriteriaSubmit = (criteria: ReplacementRequirements) => {
    setReplacementCriteria(criteria);

    // Run deterministic ranking engine
    const ranked = rankReplacementCars(
      indianCarCatalogue,
      criteria,
      currentCarTCO,
      currentVehicleData.currentEstimatedResaleValue
    );

    setRankedCars(ranked);

    // Pre-select top 2-3 matching cars for comparison
    const initialSelection = ranked.slice(0, 3).map((r) => r.car.id);
    setSelectedCarIds(initialSelection);

    // Generate deterministic verdict
    const verdict = generateFinalVerdict(currentCarTCO, ranked, criteria, currentVehicleData);
    setFinalVerdict(verdict);
    setIsSaved(false);

    setCurrentStep(3);
  };

  // Toggle selection for comparison matrix (max 3)
  const handleToggleCarSelection = (id: string) => {
    if (selectedCarIds.includes(id)) {
      setSelectedCarIds(selectedCarIds.filter((cid) => cid !== id));
    } else {
      if (selectedCarIds.length >= 3) {
        showToast('You can compare a maximum of 3 replacement vehicles at once.', 'warning');
        return;
      }
      setSelectedCarIds([...selectedCarIds, id]);
    }
  };

  // Save current analysis to Supabase
  const handleSaveAnalysis = async () => {
    if (!finalVerdict) return;
    setIsSaving(true);
    try {
      const saved = await recommendationService.saveAnalysis(
        {
          userId: user?.id || 'guest',
          vehicleId: currentVehicleData.vehicleId || null,
          title: `Replacement Analysis: ${currentVehicleData.make} ${currentVehicleData.model}`,
          currentVehicleData,
          replacementCriteria,
          currentCarTCO,
          recommendedCars: rankedCars,
          comparedCarIds: selectedCarIds,
          verdict: finalVerdict.outcome,
          verdictDetails: finalVerdict,
          fiveYearNetDifference: finalVerdict.fiveYearNetDifferenceINR,
          isSaved: true,
        },
        user?.id || 'guest',
        isGuest
      );

      setSavedAnalyses((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      setIsSaved(true);
      showToast('Analysis saved to your AutoSphere account and Supabase!', 'success');
    } catch (err: any) {
      showToast('Failed to save analysis: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Load a past saved analysis
  const handleLoadSavedAnalysis = (saved: SavedRecommendationAnalysis) => {
    setCurrentVehicleData(saved.currentVehicleData);
    setReplacementCriteria(saved.replacementCriteria);
    setCurrentCarTCO(saved.currentCarTCO);
    setRankedCars(saved.recommendedCars);
    setSelectedCarIds(saved.comparedCarIds.length > 0 ? saved.comparedCarIds : saved.recommendedCars.slice(0, 3).map(r => r.car.id));
    setFinalVerdict(saved.verdictDetails);
    setIsSaved(true);
    setCurrentStep(4);
    showToast(`Loaded saved analysis: ${saved.title}`, 'info');
  };

  const handleDeleteAnalysis = async (id: string) => {
    await recommendationService.deleteAnalysis(id, user?.id || 'guest', isGuest);
    setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
    showToast('Analysis removed from your saved records.', 'info');
  };

  // Restart wizard
  const handleRestart = () => {
    setCurrentStep(1);
    setIsSaved(false);
  };

  const comparedCarsList = rankedCars.filter((r) => selectedCarIds.includes(r.car.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Car Replacement Intelligence
            </h1>
            <Badge variant="electric" size="sm">
              Flagship TCO Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic financial analysis evaluating whether keeping your current car or upgrading is more economical in India
          </p>
        </div>

        {/* Saved Analyses Drawer Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsSavedDrawerOpen(true)}
            variant="outline"
            size="sm"
            icon={<Bookmark className="w-4 h-4 text-cyan-400" />}
          >
            Saved Analyses ({savedAnalyses.length})
          </Button>

          {currentStep > 1 && (
            <Button
              onClick={handleRestart}
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Progress Indicator Strip */}
      <div className="p-3 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { step: 1, label: 'Current Vehicle', icon: <Car className="w-3.5 h-3.5" /> },
          { step: 2, label: 'Replacement Budget', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
          { step: 3, label: 'Ranked Recommendations', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { step: 4, label: 'Comparison Matrix', icon: <Layers className="w-3.5 h-3.5" /> },
          { step: 5, label: 'Final Verdict', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        ].map((s) => {
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isDone && !isActive}
              onClick={() => isDone && setCurrentStep(s.step as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-subtle font-bold'
                  : isDone
                  ? 'text-slate-300 hover:text-white cursor-pointer bg-dark-850 border border-slate-800'
                  : 'text-slate-600 cursor-not-allowed border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-cyan-400 text-dark-950' : isDone ? 'bg-emerald-500 text-dark-950' : 'bg-dark-800 text-slate-500'
              }`}>
                {isDone ? '✓' : s.step}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Current Vehicle Analysis */}
      {currentStep === 1 && (
        <CurrentVehicleStep
          initialData={currentVehicleData}
          onNext={handleCurrentVehicleSubmit}
        />
      )}

      {/* STEP 2: Replacement Requirements */}
      {currentStep === 2 && (
        <ReplacementCriteriaStep
          initialCriteria={replacementCriteria}
          currentCarResaleValue={currentVehicleData.currentEstimatedResaleValue}
          onBack={() => setCurrentStep(1)}
          onNext={handleReplacementCriteriaSubmit}
        />
      )}

      {/* STEP 3: Ranked Recommendations */}
      {currentStep === 3 && (
        <RankedCarsStep
          rankedCars={rankedCars}
          currentCarTCO={currentCarTCO}
          selectedCarIds={selectedCarIds}
          onToggleCarSelection={handleToggleCarSelection}
          onBack={() => setCurrentStep(2)}
          onProceedToCompare={() => setCurrentStep(4)}
        />
      )}

      {/* STEP 4: Comparison Matrix Dashboard */}
      {currentStep === 4 && (
        <ComparisonDashboard
          currentVehicle={currentVehicleData}
          currentCarTCO={currentCarTCO}
          comparedCars={comparedCarsList.length > 0 ? comparedCarsList : rankedCars.slice(0, 2)}
          onBack={() => setCurrentStep(3)}
          onProceedToVerdict={() => setCurrentStep(5)}
        />
      )}

      {/* STEP 5: Final Verdict Report */}
      {currentStep === 5 && finalVerdict && (
        <FinalVerdictCard
          verdict={finalVerdict}
          currentVehicle={currentVehicleData}
          currentCarTCO={currentCarTCO}
          comparedCars={comparedCarsList.length > 0 ? comparedCarsList : rankedCars.slice(0, 2)}
          isSaving={isSaving}
          isSaved={isSaved}
          onSaveAnalysis={handleSaveAnalysis}
          onRestart={handleRestart}
          onBackToCompare={() => setCurrentStep(4)}
        />
      )}

      {/* Saved Analyses Drawer Modal */}
      <SavedAnalysesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        analyses={savedAnalyses}
        onLoadAnalysis={handleLoadSavedAnalysis}
        onDeleteAnalysis={handleDeleteAnalysis}
      />
    </div>
  );
};
