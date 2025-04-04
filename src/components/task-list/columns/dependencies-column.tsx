import React from 'react';

import { ColumnProps } from '../../../types/public-types';
import { useGanttStyleContext } from '../../../contexts/use-style-context';

export const DependenciesColumn: React.FC<ColumnProps> = ({ data: { dependencies } }) => {
  const { colors } = useGanttStyleContext();

  return (
    <div
      style={{
        color: colors.barLabelColor,
      }}
    >
      {dependencies.map(({ name }) => name).join(', ')}
    </div>
  );
};
