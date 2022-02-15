import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import getLang from 'store/getLang';
import { selectLang } from 'store/selectors';

const useLang = () => {
  const lang = useSelector(selectLang);
  return useMemo(() => {
    return getLang(lang);
  }, [lang]);
};

export default useLang;
