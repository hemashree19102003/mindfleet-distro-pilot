import { useSettingsStore } from '@/store';
import { translations, TranslationKeys } from '@/translations';

export const useTranslation = () => {
    const { settings } = useSettingsStore();
    const lang = settings.language || 'en';

    const t = (key: TranslationKeys): string => {
        return translations[lang][key] || translations['en'][key] || key;
    };

    return { t, lang };
};
