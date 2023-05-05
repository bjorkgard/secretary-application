import {defineStore} from 'pinia';
import Store from 'electron-store';

const CONFIG = new Store();

const colorSchemes = ['default', 'theme-1', 'theme-2', 'theme-3', 'theme-4'] as const;

export type ColorSchemes = (typeof colorSchemes)[number];

interface ColorSchemeState {
  colorSchemeValue: ColorSchemes;
}

const getColorScheme = () => {
  const colorScheme = CONFIG.get('colorScheme');
  return colorSchemes.filter((item, _key) => {
    return item === colorScheme;
  })[0];
};

export const useColorSchemeStore = defineStore('colorScheme', {
  state: (): ColorSchemeState => ({
    colorSchemeValue: CONFIG.get('colorScheme') === null ? 'default' : getColorScheme(),
  }),
  getters: {
    colorScheme(state) {
      if (CONFIG.get('colorScheme') === null) {
        CONFIG.set('colorScheme', 'default');
      }

      return state.colorSchemeValue;
    },
  },
  actions: {
    setColorScheme(colorScheme: ColorSchemes) {
      CONFIG.set('colorScheme', colorScheme);
      this.colorSchemeValue = colorScheme;
    },
  },
});
