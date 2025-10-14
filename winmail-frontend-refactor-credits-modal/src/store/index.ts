import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { authReducer } from './features/auth/auth-slice';
import { sidebarReducer } from './features/sidebar/sidebar-slice';
import { selectedTemplateReducer } from './features/selected-template/selected-template-slice';
import { selectedsegmentReducer } from './features/selected-segment/selected-segment-slice';
import { activeTabReducer } from './features/active-tab/active-tab-slice';
import { productTourReducer } from './features/product-tour/product-tour-slice';
import { templateEditorReducer } from './features/template-editor/template-editor-slice';
import { searchReducer } from './features/search/search-slice';
import { templatesReducer } from './features/templates/templates-slice';
import { segmentsReducer } from './features/segments/segments-slice';
import { filterReducer } from './features/filter/filter-slice';
import { languageReducer } from './features/language/language-slice';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  // whitelist: ["authState", "userId", "currentToken", "username", "userProfile"],
};

const sidebarPersistConfig = {
  key: 'sidebar',
  storage: storage,
  whitelist: ['isOpen'],
};

const selectedTemplatePersistConfig = {
  key: 'selectedTemplate',
  storage: storage,
  // whitelist: ["isOpen"],
};

const selectedsegmentPersistConfig = {
  key: 'selectedsegment',
  storage: storage,
  // whitelist: ["isOpen"],
};

const activeTabStatePersistConfig = {
  key: 'active-tab',
  storage: storage,
  // whitelist: ["isActive"]
};

const productTourPersistConfig = {
  key: 'product-tour',
  storage: storage,
  // whitelist: ["isActive"]
};

const templateEditorPersistConfig = {
  key: 'template-editor',
  storage: storage,
  // whitelist: ["isActive"]
};

const searchPersistConfig = {
  key: 'search',
  storage: storage,
  // whitelist: ["isActive"]
};

const segmentsPersistConfig = {
  key: 'segments',
  storage: storage,
  // whitelist: ["isActive"]
  blacklist: ['segments'],
};

const templatesPersistConfig = {
  key: 'templates',
  storage: storage,
  // whitelist: ["isActive"]
  blacklist: ['templates'],
};

const filterPersistConfig = {
  key: 'filter',
  storage: storage,
  // whitelist: ["isActive"]
};

const languagePersistConfig = {
  key: 'language',
  storage: storage,
  whitelist: ['language'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedSidebarReducer = persistReducer(
  sidebarPersistConfig,
  sidebarReducer
);
const persistedSelectedTemplateReducer = persistReducer(
  selectedTemplatePersistConfig,
  selectedTemplateReducer
);
const persistedSelectedsegmentReducer = persistReducer(
  selectedsegmentPersistConfig,
  selectedsegmentReducer
);
const persistedActiveTabReducer = persistReducer(
  activeTabStatePersistConfig,
  activeTabReducer
);
const persistedProductTourReducer = persistReducer(
  productTourPersistConfig,
  productTourReducer
);
const persistedTemplateEditorReducer = persistReducer(
  templateEditorPersistConfig,
  templateEditorReducer
);
const persistedSearchReducer = persistReducer(
  searchPersistConfig,
  searchReducer
);
const persistedTemplatesReducer = persistReducer(
  templatesPersistConfig,
  templatesReducer
);
const persistedsegmentsReducer = persistReducer(
  segmentsPersistConfig,
  segmentsReducer
);
const persistedFilterReducer = persistReducer(
  filterPersistConfig,
  filterReducer
);
const persistedLanguageReducer = persistReducer(
  languagePersistConfig,
  languageReducer
);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  sidebar: persistedSidebarReducer,
  selectedTemplate: persistedSelectedTemplateReducer,
  selectedsegment: persistedSelectedsegmentReducer,
  activeTab: persistedActiveTabReducer,
  productTour: persistedProductTourReducer,
  templateEditor: persistedTemplateEditorReducer,
  search: persistedSearchReducer,
  templates: persistedTemplatesReducer,
  segments: persistedsegmentsReducer,
  filter: persistedFilterReducer,
  language: persistedLanguageReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
