import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import filtersReducer from '@app/store/slices/filtersSlice';

export default {
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  filters: filtersReducer,
};
