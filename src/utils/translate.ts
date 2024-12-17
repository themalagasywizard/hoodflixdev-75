import { toast } from "@/components/ui/use-toast";

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

export const translateText = async (text: string, from: string = 'auto', to: string = 'en') => {
  try {
    // Using LibreTranslate API which is more reliable
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from === 'auto' ? 'en' : from,
        target: to,
        format: 'text',
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

export const translatePage = async (lang: string) => {
  const elementsToTranslate = document.querySelectorAll('[data-translate]');
  const translations: Promise<void>[] = [];

  elementsToTranslate.forEach((element) => {
    const originalText = element.getAttribute('data-original-text') || element.textContent;
    if (originalText) {
      if (!element.getAttribute('data-original-text')) {
        element.setAttribute('data-original-text', originalText);
      }
      
      const translation = translateText(originalText, 'en', lang)
        .then((translatedText) => {
          if (translatedText) {
            element.textContent = translatedText;
          }
        });
      
      translations.push(translation);
    }
  });

  try {
    await Promise.all(translations);
    toast({
      title: "Language Changed",
      description: `Successfully changed language to ${supportedLanguages[lang]}`,
    });
  } catch (error) {
    console.error('Error translating page:', error);
    toast({
      title: "Translation Error",
      description: "Some translations failed. Please try again.",
      variant: "destructive",
    });
  }
};