const LINGVA_API_BASE = 'https://lingva.ml/api/v1';

export const translateText = async (text: string, from: string = 'auto', to: string = 'en') => {
  try {
    const response = await fetch(`${LINGVA_API_BASE}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        from,
        to,
      }),
    });
    
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

export const supportedLanguages = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  sl: 'Slovenščina',
  tr: 'Türkçe'
};