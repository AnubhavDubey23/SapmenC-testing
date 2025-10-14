'use client';
import { create } from 'zustand';
import { TEditorConfiguration } from './core.jsx';

export type TSidebarTab = 'block-configuration' | 'styles' | 'details';
export type TSelectedSidebarTabIdx = 0 | 1 | 2;

type TValue = {
  document: TEditorConfiguration;
  selectedBlockId: string | null;
  selectedSidebarTab: TSidebarTab;
  selectedSidebarTabIdx: TSelectedSidebarTabIdx;
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';
  inspectorDrawerOpen: boolean;
};

export const sidebarTabMappingItoA = {
  0: 'styles',
  1: 'block-configuration',
  2: 'details',
};

export const sidebarTabMappingAtoI = {
  styles: 0,
  'block-configuration': 1,
  details: 2,
};

const editorStateStore = create<TValue>(() => ({
  document: {
    root: {
      id: 'root',
      type: 'EmailLayout',
      data: {},
    },
  } as TEditorConfiguration,
  selectedBlockId: null,
  selectedSidebarTab: 'styles',
  selectedSidebarTabIdx: 0,
  selectedMainTab: 'editor',
  selectedScreenSize: 'desktop',
  inspectorDrawerOpen: true,
}));

export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
  return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useSelectedSidebarTabIdx() {
  return editorStateStore((s) => s.selectedSidebarTabIdx);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab =
    selectedBlockId === null ? 'styles' : 'block-configuration';
  const selectedSidebarTabIdx = selectedBlockId === null ? 0 : 1;
  const options: Partial<TValue> = {};
  return editorStateStore.setState({
    selectedBlockId,
    selectedSidebarTab,
    selectedSidebarTabIdx,
    ...options,
  });
}

export function setSidebarTab(
  selectedSidebarTab: TValue['selectedSidebarTab']
) {
  return editorStateStore.setState({ selectedSidebarTab });
}

export function setSidebarTabIdx(
  selectedSidebarTabIdx: TValue['selectedSidebarTabIdx']
) {
  return editorStateStore.setState({ selectedSidebarTabIdx });
}

export function resetDocument(document: TValue['document']) {
  return editorStateStore.setState({
    document,
    selectedSidebarTab: 'styles',
    selectedBlockId: null,
  });
}

export function setDocument(document: TValue['document']) {
  const originalDocument = editorStateStore.getState().document;
  return editorStateStore.setState({
    document: {
      ...originalDocument,
      ...document,
    },
  });
}

export function setSelectedScreenSize(
  selectedScreenSize: TValue['selectedScreenSize']
) {
  return editorStateStore.setState({ selectedScreenSize });
}
