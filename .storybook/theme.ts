import type { ThemesConfig } from '@storybook/addon-themes';
import { themes } from '@storybook/addon-themes';

export const themesConfig: ThemesConfig = {
  default: 'light',
  list: [
    { name: 'light', ...themes.normal },
    { name: 'dark', ...themes.dark },
    {
      name: 'custom',
      classDefault: 'light',
      classTarget: 'html',
      styles: [{ colorPrimary: '#059669' }],
    },
  ],
};
