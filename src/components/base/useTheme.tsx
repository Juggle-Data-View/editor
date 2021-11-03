import { useEffect } from 'react';
import { Classes } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import themes from 'config/theme';
import { selectTheme } from 'store/selectors';

function useTheme() {
  const themeName = useSelector(selectTheme);

  useEffect(() => {
    // dark theme
    if (themeName === 'dark') {
      document.body.classList.add(Classes.DARK);
    } else {
      document.body.classList.remove(Classes.DARK);
    }
  }, [themeName]);

  return {
    theme: themes[themeName],
    themeName,
  };
}

export default useTheme;
