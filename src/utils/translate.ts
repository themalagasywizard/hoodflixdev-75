import { toast } from "@/hooks/use-toast";

const LINGVA_API_BASE = 'https://translate.argosopentech.com/translate';

export const translateText = async (text: string, from: string = 'auto', to: string = 'en') => {
  try {
    const response = await fetch(LINGVA_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    toast({
      title: "Translation Error",
      description: "Failed to translate text. Using original text.",
      variant: "destructive",
    });
    return text;
  }
};

export const supportedLanguages = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean'
};