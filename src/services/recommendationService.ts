import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SavedRecommendationAnalysis } from '../types/replacement.types';

const LOCAL_STORAGE_KEY = 'autosphere_saved_recommendation_analyses';

export const recommendationService = {
  // Save an analysis to Supabase (and local storage fallback)
  async saveAnalysis(
    analysis: Omit<SavedRecommendationAnalysis, 'id' | 'createdAt'>,
    userId: string,
    isGuest = false
  ): Promise<SavedRecommendationAnalysis> {
    const tempId = `analysis-${Date.now().toString(36)}`;
    const fullAnalysis: SavedRecommendationAnalysis = {
      ...analysis,
      id: tempId,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && userId && !isGuest) {
      try {
        const { data, error } = await (supabase.from('recommendation_analyses') as any)
          .insert([{
            user_id: userId,
            vehicle_id: analysis.vehicleId || null,
            title: analysis.title,
            current_vehicle_data: analysis.currentVehicleData,
            replacement_criteria: analysis.replacementCriteria,
            current_car_tco: analysis.currentCarTCO,
            recommended_cars: analysis.recommendedCars,
            compared_car_ids: analysis.comparedCarIds || [],
            verdict: analysis.verdict,
            verdict_details: analysis.verdictDetails,
            five_year_net_difference: analysis.fiveYearNetDifference,
            is_saved: true,
          }])
          .select()
          .single();

        if (error) {
          console.error('Error saving recommendation analysis to Supabase:', error);
        } else if (data) {
          fullAnalysis.id = data.id;
          fullAnalysis.createdAt = data.created_at;
        }
      } catch (err) {
        console.error('Exception saving recommendation analysis to Supabase:', err);
      }
    }

    // Always keep in local storage for instant offline recall
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list: SavedRecommendationAnalysis[] = stored ? JSON.parse(stored) : [];
      const updated = [fullAnalysis, ...list.filter((a) => a.id !== fullAnalysis.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist analysis to localStorage:', e);
    }

    return fullAnalysis;
  },

  // Fetch all saved analyses for the current user
  async fetchAnalyses(userId: string, isGuest = false): Promise<SavedRecommendationAnalysis[]> {
    if (isSupabaseConfigured && userId && !isGuest) {
      try {
        const { data, error } = await (supabase.from('recommendation_analyses') as any)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: SavedRecommendationAnalysis[] = (data as any[]).map((row) => ({
            id: row.id,
            userId: row.user_id,
            vehicleId: row.vehicle_id,
            title: row.title,
            currentVehicleData: row.current_vehicle_data,
            replacementCriteria: row.replacement_criteria,
            currentCarTCO: row.current_car_tco,
            recommendedCars: row.recommended_cars,
            comparedCarIds: row.compared_car_ids || [],
            verdict: row.verdict,
            verdictDetails: row.verdict_details,
            fiveYearNetDifference: Number(row.five_year_net_difference),
            isSaved: row.is_saved,
            createdAt: row.created_at,
          }));

          // Cache to local storage
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
          } catch (e) {}

          return mapped;
        }
      } catch (err) {
        console.error('Exception fetching recommendation analyses from Supabase:', err);
      }
    }

    // Fallback to local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    return [];
  },

  // Delete an analysis
  async deleteAnalysis(id: string, userId: string, isGuest = false): Promise<void> {
    if (isSupabaseConfigured && userId && !isGuest) {
      try {
        await (supabase.from('recommendation_analyses') as any)
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
      } catch (err) {
        console.error('Error deleting analysis in Supabase:', err);
      }
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const list: SavedRecommendationAnalysis[] = JSON.parse(stored);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.filter((a) => a.id !== id)));
      }
    } catch (e) {}
  },
};
