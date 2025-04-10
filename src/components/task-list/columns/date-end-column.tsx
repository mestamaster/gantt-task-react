import React from 'react';

import format from 'date-fns/format';

import { ColumnProps } from '../../../types/public-types';
import { useGanttStyleContext } from '../../../contexts/use-style-context';
export const DateEndColumn: React.FC<ColumnProps> = ({
  data: {
    dateSetup: { dateFormats, dateLocale },
    task,
  },
}) => {
  const { colors } = useGanttStyleContext();

  if (task.type === 'empty') {
    return null;
  }

  try {
    return (
      <div
        style={{
          color: colors.barLabelColor,
        }}
      >
        {format(task.end, dateFormats.dateColumnFormat, {
          locale: dateLocale,
        })}
      </div>
    );
  } catch (e) {
    return (
      <div
        style={{
          color: colors.barLabelColor,
        }}
      >
        {task.end.toString()}
      </div>
    );
  }
};
