import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Bookmark,
  Info
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Wizard Step: 1 = Current Vehicle, 2 = Requirements, 3 = Ranked Matches, 4 = Comparison Matrix, 5 = Final Verdict
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(() => {
    const stepParam = Number(searchParams.get('step'));
    if (stepParam >= 1 && stepParam <= 5) return stepParam as 1 | 2 | 3 | 4 | 5;
    return 1;
  });

  // Sort state persisted in URL query params
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'tco' | 'efficiency'>(() => {
    const s = searchParams.get('sort');
    if (s === 'price' || s === 'tco' || s === 'efficiency' || s === 'match') return s;
    return 'match';
  });

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
      make: activeVehicle?.make || '',
      model: activeVehicle?.model || '',
      variant: activeVehicle?.variant || '',
      manufacturingYear: activeVehicle?.manufacturingYear || activeVehicle?.year || 2023,
      fuelType: activeVehicle?.fuelType || 'petrol',
      transmission: activeVehicle?.transmission || 'manual',
      bodyType: activeVehicle?.bodyType || 'suv',
      currentOdometer: activeVehicle?.odoKm || 0,
      monthlyKmDriven: 1000,
      monthlyFuelExpenditure: estimatedMonthlyFuel,
      annualMaintenanceExpenses: estimatedAnnualMaint,
      annualRepairExpenses: 5000,
      annualInsuranceExpenses: 20000,
      currentEstimatedResaleValue: estimatedResale,
      city: activeVehicle?.city || 'Bengaluru',
      state: activeVehicle?.state || 'Karnataka',
    };
  });

  // 2. Replacement Criteria State (initialized from URL query params if present)
  const [replacementCriteria, setReplacementCriteria] = useState<ReplacementRequirements>(() => {
    const fuelParam = searchParams.get('fuel');
    const bodyParam = searchParams.get('body');
    const transParam = searchParams.get('trans');
    const budgetParam = Number(searchParams.get('budget'));
    const emiParam = Number(searchParams.get('emi'));
    const stateParam = searchParams.get('state');
    const cityParam = searchParams.get('city');

    return {
      maxPurchaseBudgetINR: Number.isFinite(budgetParam) && budgetParam >= 500000 ? budgetParam : 2500000,
      preferredMonthlyEmiINR: Number.isFinite(emiParam) && emiParam >= 5000 ? emiParam : 28000,
      downPaymentINR: 400000,
      applyResaleAsDownPayment: true,
      loanTenureYears: 5,
      loanInterestRatePercent: 9.0,
      preferredFuelType: (fuelParam as any) || 'all',
      transmissionPreference: (transParam as any) || 'all',
      vehicleCategory: (bodyParam as any) || 'all',
      monthlyDrivingDistanceKm: 1250,
      state: stateParam || currentVehicleData.state || 'Karnataka',
      city: cityParam || currentVehicleData.city || 'Bengaluru',
      cityDrivingPercent: 70,
      highwayDrivingPercent: 30,
    };
  });

  // 3. Calculated TCO & Ranked Cars
  const [currentCarTCO, setCurrentCarTCO] = useState<CurrentCarTCO>(() =>
    calculateCurrentCarTCO(currentVehicleData)
  );
  const [rankedCars, setRankedCars] = useState<ReplacementCarTCO[]>(() => {
    const stepParam = Number(searchParams.get('step'));
    if (stepParam >= 3) {
      return rankReplacementCars(
        indianCarCatalogue,
        replacementCriteria,
        calculateCurrentCarTCO(currentVehicleData),
        currentVehicleData.currentEstimatedResaleValue
      );
    }
    return [];
  });
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>(() => {
    const selParam = searchParams.get('selected');
    if (selParam) {
      return selParam.split(',').filter(Boolean).slice(0, 3);
    }
    return [];
  });

  // Sync non-sensitive filter & step state to URL query parameters for Back/Refresh persistence
  useEffect(() => {
    const nextParams = new URLSearchParams();
    nextParams.set('step', String(currentStep));
    if (replacementCriteria.preferredFuelType !== 'all') {
      nextParams.set('fuel', replacementCriteria.preferredFuelType);
    }
    if (replacementCriteria.vehicleCategory !== 'all') {
      nextParams.set('body', replacementCriteria.vehicleCategory);
    }
    if (replacementCriteria.transmissionPreference !== 'all') {
      nextParams.set('trans', replacementCriteria.transmissionPreference);
    }
    nextParams.set('budget', String(replacementCriteria.maxPurchaseBudgetINR));
    nextParams.set('emi', String(replacementCriteria.preferredMonthlyEmiINR));
    if (replacementCriteria.state) nextParams.set('state', replacementCriteria.state);
    if (replacementCriteria.city) nextParams.set('city', replacementCriteria.city);
    if (sortBy !== 'match') nextParams.set('sort', sortBy);
    if (selectedCarIds.length > 0) nextParams.set('selected', selectedCarIds.join(','));
    setSearchParams(nextParams, { replace: true });
  }, [currentStep, replacementCriteria, sortBy, selectedCarIds, setSearchParams]);

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

    // Run deterministic ranking engine with strict filter enforcement
    const ranked = rankReplacementCars(
      indianCarCatalogue,
      criteria,
      currentCarTCO,
      currentVehicleData.currentEstimatedResaleValue
    );

    setRankedCars(ranked);

    // Preserve any existing selections still valid in the filtered list, or select top 2-3 matches
    setSelectedCarIds((prev) => {
      const stillValid = prev.filter((id) => ranked.some((r) => r.car.id === id));
      if (stillValid.length > 0) return stillValid;
      return ranked.slice(0, 3).map((r) => r.car.id);
    });

    setIsSaved(false);
    setCurrentStep(3);
  };

  // Update fuel filter cleanly across Step 2, Step 3, and URL params
  const handleFuelFilterChange = useCallback(
    (fuel: string) => {
      const updatedCriteria: ReplacementRequirements = {
        ...replacementCriteria,
        preferredFuelType: fuel as any,
      };
      setReplacementCriteria(updatedCriteria);
      const ranked = rankReplacementCars(
        indianCarCatalogue,
        updatedCriteria,
        currentCarTCO,
        currentVehicleData.currentEstimatedResaleValue
      );
      setRankedCars(ranked);
      setSelectedCarIds((prev) => {
        const stillValid = prev.filter((id) => ranked.some((r) => r.car.id === id));
        return stillValid.length > 0 ? stillValid : ranked.slice(0, 3).map((r) => r.car.id);
      });
      setIsSaved(false);
    },
    [replacementCriteria, currentCarTCO, currentVehicleData.currentEstimatedResaleValue]
  );

  // Explicit Reset Filters action
  const handleResetFilters = useCallback(() => {
    const resetCriteria: ReplacementRequirements = {
      ...replacementCriteria,
      maxPurchaseBudgetINR: 2500000,
      preferredMonthlyEmiINR: 28000,
      preferredFuelType: 'all',
      transmissionPreference: 'all',
      vehicleCategory: 'all',
    };
    setReplacementCriteria(resetCriteria);
    setSortBy('match');
    const ranked = rankReplacementCars(
      indianCarCatalogue,
      resetCriteria,
      currentCarTCO,
      currentVehicleData.currentEstimatedResaleValue
    );
    setRankedCars(ranked);
    setSelectedCarIds(ranked.slice(0, 3).map((r) => r.car.id));
    setIsSaved(false);
    showToast('All recommendation filters reset.', 'info');
  }, [replacementCriteria, currentCarTCO, currentVehicleData.currentEstimatedResaleValue, showToast]);

  // Toggle selection for comparison matrix (max 3) and immediately invalidate stale saved state
  const handleToggleCarSelection = (id: string) => {
    setIsSaved(false);
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

  // Current selected cars bound by stable IDs
  const comparedCarsList = useMemo(
    () => rankedCars.filter((r) => selectedCarIds.includes(r.car.id)),
    [rankedCars, selectedCarIds]
  );

  // Reactive Final Verdict tied strictly to currently selected vehicle IDs (never stale, never Tata Punch fallback)
  const finalVerdict: FinalVerdict | null = useMemo(() => {
    if (comparedCarsList.length === 0) return null;
    return generateFinalVerdict(
      currentCarTCO,
      comparedCarsList,
      replacementCriteria,
      currentVehicleData
    );
  }, [comparedCarsList, currentCarTCO, replacementCriteria, currentVehicleData]);

  // Save current analysis to Supabase
  const handleSaveAnalysis = async () => {
    if (!finalVerdict || comparedCarsList.length === 0) return;
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
    setSelectedCarIds(saved.comparedCarIds);
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
    setSelectedCarIds([]);
    setIsSaved(false);
  };

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

      {!activeVehicle && (
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          <p className="text-xs text-cyan-200 font-medium">
            Complete your vehicle and budget details to generate recommendations.
          </p>
        </div>
      )}

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
          onResetFilters={handleResetFilters}
        />
      )}

      {/* STEP 3: Ranked Recommendations */}
      {currentStep === 3 && (
        <RankedCarsStep
          rankedCars={rankedCars}
          currentCarTCO={currentCarTCO}
          selectedCarIds={selectedCarIds}
          filterFuel={replacementCriteria.preferredFuelType}
          onFilterFuelChange={handleFuelFilterChange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onResetFilters={handleResetFilters}
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
          comparedCars={comparedCarsList}
          onBack={() => setCurrentStep(3)}
          onProceedToVerdict={() => setCurrentStep(5)}
        />
      )}

      {/* STEP 5: Final Verdict Report */}
      {currentStep === 5 && (
        finalVerdict && comparedCarsList.length > 0 ? (
          <FinalVerdictCard
            verdict={finalVerdict}
            currentVehicle={currentVehicleData}
            currentCarTCO={currentCarTCO}
            comparedCars={comparedCarsList}
            isSaving={isSaving}
            isSaved={isSaved}
            onSaveAnalysis={handleSaveAnalysis}
            onRestart={handleRestart}
            onBackToCompare={() => setCurrentStep(4)}
          />
        ) : (
          <div className="p-10 text-center rounded-2xl border border-dashed border-slate-800 bg-dark-900 space-y-4">
            <h3 className="text-lg font-bold text-white">No Vehicles Selected</h3>
            <p className="text-sm text-slate-400">
              Select vehicles to generate your comparison.
            </p>
            <Button onClick={() => setCurrentStep(3)} variant="primary" size="sm">
              Select Vehicles in Step 3
            </Button>
          </div>
        )
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
