import { createContext, useContext } from 'react';

export type Cms = Record<string, unknown> | null;
export type BotIntent = 'default' | 'recruit' | 'talk';

export type Ui = {
  cms: Cms;
  openDiagnostic: () => void;
  openBot: (intent?: BotIntent) => void;
};

export const UiContext = createContext<Ui>({ cms: null, openDiagnostic: () => {}, openBot: () => {} });
export const useUi = () => useContext(UiContext);

/** Read a CMS string with a code default (CMS keys are optional overrides). */
export function cmsText(cms: Cms, key: string, fallback: string): string {
  const v = cms?.[key];
  return typeof v === 'string' && v.trim() ? v : fallback;
}
