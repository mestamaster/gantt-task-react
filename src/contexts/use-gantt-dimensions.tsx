import React, { createContext, useContext, ReactNode } from 'react';

export interface GanttDimensions {
  actionColumnWidth: number;
  arrowIndent: number;
  barCornerRadius: number;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill: number;
  columnWidth: number;
  contextMenuIconWidth: number;
  contextMenuOptionHeight: number;
  contextMenuSidePadding: number;
  dateCellWidth: number;
  dependenciesCellWidth: number;
  dependencyFixHeight: number;
  dependencyFixIndent: number;
  dependencyFixWidth: number;
  expandIconWidth: number;
  handleWidth: number;
  headerHeight: number;
  minimumRowDisplayed: number;
  nestedTaskNameOffset: number;
  relationCircleOffset: number;
  relationCircleRadius: number;
  rowHeight: number;
  tableWidth?: number;
  taskWarningOffset: number;
  titleCellWidth: number;
}

export const defaultDimensions: GanttDimensions = {
  actionColumnWidth: 40,
  arrowIndent: 20,
  barCornerRadius: 3,
  barFill: 60,
  columnWidth: 60,
  contextMenuIconWidth: 20,
  contextMenuOptionHeight: 25,
  contextMenuSidePadding: 10,
  dateCellWidth: 220,
  dependenciesCellWidth: 120,
  dependencyFixHeight: 20,
  dependencyFixIndent: 50,
  dependencyFixWidth: 20,
  expandIconWidth: 20,
  handleWidth: 8,
  headerHeight: 50,
  minimumRowDisplayed: 4,
  nestedTaskNameOffset: 20,
  relationCircleOffset: 10,
  relationCircleRadius: 5,
  rowHeight: 50,
  taskWarningOffset: 35,
  titleCellWidth: 220,
};

export const GanttDimensionsContext = createContext<GanttDimensions>(defaultDimensions);

export interface GanttDimensionsProviderProps {
  children: ReactNode;
  dimensions?: Partial<GanttDimensions>;
}

export const GanttDimensionsProvider = ({ children, dimensions }: GanttDimensionsProviderProps) => {
  const mergedDimensions = { ...defaultDimensions, ...dimensions };

  return (
    <GanttDimensionsContext.Provider value={mergedDimensions}>
      {children}
    </GanttDimensionsContext.Provider>
  );
};

export const useGanttDimensions = () => {
  const context = useContext(GanttDimensionsContext);

  if (!context) {
    throw new Error('GanttDimensionsContext not found');
  }

  return context;
};
