export interface SupportedLanguage {
  code: string
  locale: string
  label: string
  nativeName: string
  flag: string
  description: string
  speechRecognitionLang: string
  ttsVoiceId?: string
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    locale: 'en-US',
    label: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸',
    description: 'Universal technical & executive recruiting standard',
    speechRecognitionLang: 'en-US'
  },
  {
    code: 'es',
    locale: 'es-ES',
    label: 'Spanish (Español)',
    nativeName: 'Español',
    flag: '🇪🇸',
    description: 'European & Latin American native voice screening',
    speechRecognitionLang: 'es-ES'
  },
  {
    code: 'hi',
    locale: 'hi-IN',
    label: 'Hindi (हिन्दी)',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'Native Indian tech corridor speech recognition & conversational AI',
    speechRecognitionLang: 'hi-IN'
  },
  {
    code: 'de',
    locale: 'de-DE',
    label: 'German (Deutsch)',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    description: 'DACH region engineering & enterprise fluency',
    speechRecognitionLang: 'de-DE'
  },
  {
    code: 'fr',
    locale: 'fr-FR',
    label: 'French (Français)',
    nativeName: 'Français',
    flag: '🇫🇷',
    description: 'Francophone candidate assessment with natural nuances',
    speechRecognitionLang: 'fr-FR'
  },
  {
    code: 'ja',
    locale: 'ja-JP',
    label: 'Japanese (日本語)',
    nativeName: '日本語',
    flag: '🇯🇵',
    description: 'High-context Japanese corporate & technical evaluation',
    speechRecognitionLang: 'ja-JP'
  }
]

export function getLanguageByCode(codeOrLocale?: string): SupportedLanguage {
  if (!codeOrLocale) return SUPPORTED_LANGUAGES[0]
  const clean = codeOrLocale.toLowerCase().trim()
  const found = SUPPORTED_LANGUAGES.find(
    l => l.code.toLowerCase() === clean || l.locale.toLowerCase() === clean || l.label.toLowerCase().includes(clean)
  )
  return found || SUPPORTED_LANGUAGES[0]
}
