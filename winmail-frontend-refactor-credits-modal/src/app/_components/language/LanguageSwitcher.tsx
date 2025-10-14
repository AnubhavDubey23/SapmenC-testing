import i18n from '@/app/i18n';
import { useAppDispatch, useAppSelector } from '@/store';
import { Select } from '@chakra-ui/react';
import { setLanguage } from '@/store/features/language/language-slice';
import React from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

type Props = {};

const LanguageSwitcher = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const LANGUAGES_DATA: {
    id: number;
    name: string;
    code: string;
  }[] = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Spanish', code: 'es' },
    { id: 3, name: 'French', code: 'fr' },
    { id: 4, name: 'German', code: 'de' },
    { id: 5, name: 'Italian', code: 'it' },
    { id: 6, name: 'Japanese', code: 'ja' },
    { id: 7, name: 'Chinese', code: 'zh' },
    { id: 8, name: 'Portuguese', code: 'pt' },
    { id: 9, name: 'Russian', code: 'ru' },
    { id: 10, name: 'Hindi', code: 'hi' },
    { id: 11, name: 'Indonesian', code: 'id' },
  ];
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage({ language: e.target.value }));
    // localStorage.setItem('lang', lang);
    // i18n.changeLanguage(lang)
    // window.location.reload();
  };
  const languageState = useAppSelector((state) => state.language);
  return (
    <div>
      <p>{t('Select_Language')}</p>
      <Select value={languageState.language} onChange={handleLanguageChange}>
        {LANGUAGES_DATA.map((lang) => (
          <option key={lang.id} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
