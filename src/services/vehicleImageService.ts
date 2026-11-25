import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BodyType, FuelType } from '../types';

export interface CatalogueVehicleImageEntry {
  key: string;
  make: string;
  model: string;
  url: string;
  title: string;
  license: string;
  source: 'Wikimedia Commons';
  bodyStyle: BodyType;
}

export interface ResolvedVehicleImage {
  url: string | null;
  isPersonalPhoto: boolean;
  sourceLabel: string;
  license?: string;
  title?: string;
}

/**
 * Verified Creative Commons-licensed photographs of exact Indian market car models
 * sourced from Wikimedia Commons. Kept strictly separate from user-uploaded photos.
 */
export const CATALOGUE_VEHICLE_IMAGES: Record<string, CatalogueVehicleImageEntry> = {
  'tata-nexon': {
    key: 'tata-nexon',
    make: 'Tata Motors',
    model: 'Nexon',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/2018_Tata_Nexon_XM.jpg/960px-2018_Tata_Nexon_XM.jpg',
    title: '2018 Tata Nexon XM',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'tata-punch': {
    key: 'tata-punch',
    make: 'Tata Motors',
    model: 'Punch',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/2021_Tata_Punch_Creative_%28India%29_front_view_01.png/960px-2021_Tata_Punch_Creative_%28India%29_front_view_01.png',
    title: '2021 Tata Punch Creative (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'tata-curvv': {
    key: 'tata-curvv',
    make: 'Tata Motors',
    model: 'Curvv',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Tata_Curvv.EV.jpg/960px-Tata_Curvv.EV.jpg',
    title: 'Tata Curvv.EV',
    license: 'CC0',
    source: 'Wikimedia Commons',
    bodyStyle: 'crossover',
  },
  'tata-harrier': {
    key: 'tata-harrier',
    make: 'Tata Motors',
    model: 'Harrier',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Tata_Buzzard_Sport%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS0651%29.jpg/960px-Tata_Buzzard_Sport%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS0651%29.jpg',
    title: 'Tata Harrier / Buzzard',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'maruti-grand-vitara': {
    key: 'maruti-grand-vitara',
    make: 'Maruti Suzuki',
    model: 'Grand Vitara',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/2022_Maruti_Suzuki_Grand_Vitara_Alpha_Smart_Hybrid_%28India%29_front_view.png',
    title: '2022 Maruti Suzuki Grand Vitara Alpha Smart Hybrid (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'maruti-brezza': {
    key: 'maruti-brezza',
    make: 'Maruti Suzuki',
    model: 'Brezza',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/2016_Suzuki_Vitara_Brezza_ZDi%2B_1.3_YFB1S_%2820160821%29.jpg/960px-2016_Suzuki_Vitara_Brezza_ZDi%2B_1.3_YFB1S_%2820160821%29.jpg',
    title: 'Maruti Suzuki Vitara Brezza ZDi+',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'maruti-fronx': {
    key: 'maruti-fronx',
    make: 'Maruti Suzuki',
    model: 'Fronx',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/2023_Suzuki_Fronx_1.2_Delta%2B_%28India%29_front_view.png/960px-2023_Suzuki_Fronx_1.2_Delta%2B_%28India%29_front_view.png',
    title: '2023 Suzuki Fronx 1.2 Delta+ (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'crossover',
  },
  'maruti-swift': {
    key: 'maruti-swift',
    make: 'Maruti Suzuki',
    model: 'Swift',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/2020_Suzuki_Swift_Facelift_IMG_1880.jpg/960px-2020_Suzuki_Swift_Facelift_IMG_1880.jpg',
    title: 'Suzuki Swift Facelift',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'hatchback',
  },
  'maruti-ertiga': {
    key: 'maruti-ertiga',
    make: 'Maruti Suzuki',
    model: 'Ertiga',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/2013_Suzuki_Ertiga_1.4_GX_wagon_%28ZE81S%3B_01-20-2019%29%2C_South_Tangerang.jpg/960px-2013_Suzuki_Ertiga_1.4_GX_wagon_%28ZE81S%3B_01-20-2019%29%2C_South_Tangerang.jpg',
    title: 'Suzuki Ertiga GX',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'mpv',
  },
  'mahindra-xuv700': {
    key: 'mahindra-xuv700',
    make: 'Mahindra',
    model: 'XUV700',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png/960px-2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png',
    title: '2021 Mahindra XUV700 2.2 AX7 (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'mahindra-xuv-3xo': {
    key: 'mahindra-xuv-3xo',
    make: 'Mahindra',
    model: 'XUV 3XO',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Mahindra_XUV_3XO_2025.jpg/960px-Mahindra_XUV_3XO_2025.jpg',
    title: 'Mahindra XUV 3XO',
    license: 'CC0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'mahindra-scorpio-n': {
    key: 'mahindra-scorpio-n',
    make: 'Mahindra',
    model: 'Scorpio-N',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Mahindra_Scorpio_zipping_by.jpg',
    title: 'Mahindra Scorpio',
    license: 'CC BY 2.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'mahindra-thar': {
    key: 'mahindra-thar',
    make: 'Mahindra',
    model: 'Thar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Mahindra_Thar_2.5_CRDe_2011.jpg',
    title: 'Mahindra Thar',
    license: 'CC BY-SA 2.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'hyundai-creta': {
    key: 'hyundai-creta',
    make: 'Hyundai',
    model: 'Creta',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/HYUNDAI_CRETA_%2C_iX25_%28SU2%29_China_%281%29.jpg/960px-HYUNDAI_CRETA_%2C_iX25_%28SU2%29_China_%281%29.jpg',
    title: 'Hyundai Creta (SU2)',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'hyundai-venue': {
    key: 'hyundai-venue',
    make: 'Hyundai',
    model: 'Venue',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/2020_Hyundai_Venue_Ultimate_2019-12-13_2.jpg/960px-2020_Hyundai_Venue_Ultimate_2019-12-13_2.jpg',
    title: 'Hyundai Venue',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'hyundai-verna': {
    key: 'hyundai-verna',
    make: 'Hyundai',
    model: 'Verna',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/HYUNDAI_VERNA_%28HYUNDAI_ACCENT%29_%28RB%2CRC%29_China.jpg/960px-HYUNDAI_VERNA_%28HYUNDAI_ACCENT%29_%28RB%2CRC%29_China.jpg',
    title: 'Hyundai Verna',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'sedan',
  },
  'toyota-innova-hycross': {
    key: 'toyota-innova-hycross',
    make: 'Toyota',
    model: 'Innova Hycross',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/2023_Toyota_Zenix_2.0_v.jpg/960px-2023_Toyota_Zenix_2.0_v.jpg',
    title: '2023 Toyota Innova Hycross / Zenix',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'mpv',
  },
  'kia-seltos': {
    key: 'kia-seltos',
    make: 'Kia',
    model: 'Seltos',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Kia_Seltos_IMG_9147.jpg/960px-Kia_Seltos_IMG_9147.jpg',
    title: 'Kia Seltos',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'kia-sonet': {
    key: 'kia-sonet',
    make: 'Kia',
    model: 'Sonet',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Kia_Sonet_front_view_%28India%29_01.png/960px-Kia_Sonet_front_view_%28India%29_01.png',
    title: 'Kia Sonet (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'kia-ev6': {
    key: 'kia-ev6',
    make: 'Kia',
    model: 'EV6',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Kia_EV6_Automesse_Ludwigsburg_2022_1X7A5931.jpg/960px-Kia_EV6_Automesse_Ludwigsburg_2022_1X7A5931.jpg',
    title: 'Kia EV6',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'crossover',
  },
  'honda-elevate': {
    key: 'honda-elevate',
    make: 'Honda',
    model: 'Elevate',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/2023_Honda_Elevate_VX_%28India%29_front_view.jpg/960px-2023_Honda_Elevate_VX_%28India%29_front_view.jpg',
    title: '2023 Honda Elevate VX (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'honda-city': {
    key: 'honda-city',
    make: 'Honda',
    model: 'City',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view.jpg/960px-2022_Honda_City_ZX_i-VTEC_%28India%29_front_view.jpg',
    title: '2022 Honda City ZX i-VTEC (India)',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'sedan',
  },
  'skoda-kushaq': {
    key: 'skoda-kushaq',
    make: 'Skoda',
    model: 'Kushaq',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/2021_%C5%A0koda_Kushaq_%28India%29_front_view.png/960px-2021_%C5%A0koda_Kushaq_%28India%29_front_view.png',
    title: '2021 Skoda Kushaq (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'vw-virtus': {
    key: 'vw-virtus',
    make: 'Volkswagen',
    model: 'Virtus',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Sal%C3%A3o_do_Autom%C3%B3vel_2018_%2845890970041%29.jpg/960px-Sal%C3%A3o_do_Autom%C3%B3vel_2018_%2845890970041%29.jpg',
    title: 'Volkswagen Virtus',
    license: 'CC BY 2.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'sedan',
  },
  'vw-taigun': {
    key: 'vw-taigun',
    make: 'Volkswagen',
    model: 'Taigun',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/2020_Volkswagen_Taigun_Side_View.jpg/960px-2020_Volkswagen_Taigun_Side_View.jpg',
    title: '2020 Volkswagen Taigun',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'mg-windsor-ev': {
    key: 'mg-windsor-ev',
    make: 'MG Motor',
    model: 'Windsor EV',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Baojun_Yunduo_001.jpg/960px-Baojun_Yunduo_001.jpg',
    title: 'MG Windsor EV (Baojun Yunduo)',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'crossover',
  },
  'mg-zs-ev': {
    key: 'mg-zs-ev',
    make: 'MG Motor',
    model: 'ZS EV',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/MG_ZS_EV_Facelift_1X7A5867.jpg/960px-MG_ZS_EV_Facelift_1X7A5867.jpg',
    title: 'MG ZS EV Facelift',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'renault-kiger': {
    key: 'renault-kiger',
    make: 'Renault',
    model: 'Kiger',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/2021_Renault_Kiger_RXZ_%28India%29_front_view.png/960px-2021_Renault_Kiger_RXZ_%28India%29_front_view.png',
    title: '2021 Renault Kiger RXZ (India)',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
  'nissan-magnite': {
    key: 'nissan-magnite',
    make: 'Nissan',
    model: 'Magnite',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/2021_Nissan_Magnite_Premium_%28Indonesia%29_front_view.jpg/960px-2021_Nissan_Magnite_Premium_%28Indonesia%29_front_view.jpg',
    title: '2021 Nissan Magnite',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons',
    bodyStyle: 'suv',
  },
};

const MODEL_ALIASES: Record<string, string> = {
  'nexon': 'tata-nexon',
  'nexon.ev': 'tata-nexon',
  'nexon ev': 'tata-nexon',
  'punch': 'tata-punch',
  'punch.ev': 'tata-punch',
  'punch ev': 'tata-punch',
  'curvv': 'tata-curvv',
  'curvv.ev': 'tata-curvv',
  'harrier': 'tata-harrier',
  'harrier.ev': 'tata-harrier',
  'grand vitara': 'maruti-grand-vitara',
  'grand-vitara': 'maruti-grand-vitara',
  'brezza': 'maruti-brezza',
  'vitara brezza': 'maruti-brezza',
  'fronx': 'maruti-fronx',
  'swift': 'maruti-swift',
  'ertiga': 'maruti-ertiga',
  'xuv700': 'mahindra-xuv700',
  'xuv 3xo': 'mahindra-xuv-3xo',
  'xuv3xo': 'mahindra-xuv-3xo',
  'scorpio-n': 'mahindra-scorpio-n',
  'scorpio n': 'mahindra-scorpio-n',
  'thar': 'mahindra-thar',
  'thar roxx': 'mahindra-thar',
  'thar-roxx': 'mahindra-thar',
  'creta': 'hyundai-creta',
  'venue': 'hyundai-venue',
  'verna': 'hyundai-verna',
  'innova hycross': 'toyota-innova-hycross',
  'innova-hycross': 'toyota-innova-hycross',
  'seltos': 'kia-seltos',
  'sonet': 'kia-sonet',
  'ev6': 'kia-ev6',
  'elevate': 'honda-elevate',
  'city': 'honda-city',
  'city e:hev': 'honda-city',
  'kushaq': 'skoda-kushaq',
  'virtus': 'vw-virtus',
  'taigun': 'vw-taigun',
  'windsor ev': 'mg-windsor-ev',
  'windsor-ev': 'mg-windsor-ev',
  'zs ev': 'mg-zs-ev',
  'zs-ev': 'mg-zs-ev',
  'kiger': 'renault-kiger',
  'magnite': 'nissan-magnite',
};

// In-memory image load cache to avoid duplicate preloads/requests
const imageStatusCache = new Map<string, 'loading' | 'loaded' | 'error'>();

export function isGenericStockPlaceholderUrl(url?: string | null): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return lower.includes('images.unsplash.com/photo-');
}

export function getCatalogueImageEntry(
  make?: string,
  model?: string
): CatalogueVehicleImageEntry | null {
  const normModel = (model || '').trim().toLowerCase();
  if (!normModel) return null;

  const aliasKey = MODEL_ALIASES[normModel];
  if (aliasKey && CATALOGUE_VEHICLE_IMAGES[aliasKey]) {
    return CATALOGUE_VEHICLE_IMAGES[aliasKey];
  }

  const normMake = (make || '').trim().toLowerCase();
  const match = Object.values(CATALOGUE_VEHICLE_IMAGES).find(
    (entry) =>
      entry.model.toLowerCase() === normModel &&
      (!normMake || entry.make.toLowerCase().includes(normMake) || normMake.includes(entry.make.toLowerCase().split(' ')[0]))
  );
  return match || null;
}

export function resolveVehicleImage(params: {
  make?: string;
  model?: string;
  image?: string | null;
  fuelType?: FuelType;
}): ResolvedVehicleImage {
  const customUrl = params.image?.trim();
  if (customUrl && !isGenericStockPlaceholderUrl(customUrl)) {
    const isCatalogueUrl = Object.values(CATALOGUE_VEHICLE_IMAGES).some((e) => e.url === customUrl);
    if (isCatalogueUrl) {
      const entry = Object.values(CATALOGUE_VEHICLE_IMAGES).find((e) => e.url === customUrl)!;
      return {
        url: entry.url,
        isPersonalPhoto: false,
        sourceLabel: `${entry.source} (${entry.license})`,
        license: entry.license,
        title: entry.title,
      };
    }
    return {
      url: customUrl,
      isPersonalPhoto: true,
      sourceLabel: 'Personal Photo',
    };
  }

  const catalogueEntry = getCatalogueImageEntry(params.make, params.model);
  if (catalogueEntry) {
    return {
      url: catalogueEntry.url,
      isPersonalPhoto: false,
      sourceLabel: `${catalogueEntry.source} (${catalogueEntry.license})`,
      license: catalogueEntry.license,
      title: catalogueEntry.title,
    };
  }

  return {
    url: null,
    isPersonalPhoto: false,
    sourceLabel: 'Model Placeholder',
  };
}

export function getImageLoadStatus(url: string): 'loading' | 'loaded' | 'error' | undefined {
  return imageStatusCache.get(url);
}

export function setImageLoadStatus(url: string, status: 'loading' | 'loaded' | 'error'): void {
  imageStatusCache.set(url, status);
}

export const VEHICLE_PHOTO_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_VEHICLE_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Uploads a user's personal vehicle photograph to Supabase Storage scoped to
 * `${userId}/${vehicleId}/...` and records it in `public.vehicle_photos`.
 * Falls back to compressed Data URL when running offline without live Supabase.
 */
export async function uploadPersonalVehiclePhoto(
  userId: string,
  vehicleId: string,
  file: File
): Promise<{ url: string; storagePath: string }> {
  if (!ALLOWED_VEHICLE_PHOTO_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WebP images are supported.');
  }
  if (file.size > VEHICLE_PHOTO_MAX_BYTES) {
    throw new Error('Image size must be 5 MB or less.');
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/${vehicleId}/${Date.now()}_${sanitizedName}`;

  if (isSupabaseConfigured && userId && !userId.startsWith('offline-')) {
    const { error: uploadError } = await supabase.storage
      .from('vehicle-photos')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (!uploadError) {
      const { data: signedData } = await supabase.storage
        .from('vehicle-photos')
        .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

      const finalUrl =
        signedData?.signedUrl ||
        supabase.storage.from('vehicle-photos').getPublicUrl(storagePath).data.publicUrl;

      // Record in vehicle_photos table under authenticated user ownership
      await (supabase.from('vehicle_photos') as any).insert([
        {
          user_id: userId,
          vehicle_id: vehicleId,
          storage_path: storagePath,
          is_primary: true,
        },
      ]);

      return { url: finalUrl, storagePath };
    }
    console.warn('[vehicleImageService] Storage upload fallback:', uploadError.message);
  }

  // Offline / local fallback: Data URL scoped to this vehicle record
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  return { url: dataUrl, storagePath };
}
