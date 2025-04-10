import React, { useCallback } from 'react';

import { ColumnProps } from '../../../types/public-types';
import { useGanttStyleContext } from '../../../contexts/use-style-context';
import styles from './delete-column.module.css';

export const DeleteColumn: React.FC<ColumnProps> = props => {
  const {
    data: { handleDeleteTasks, icons, task },
  } = props;

  const { colors } = useGanttStyleContext();

  const onClick = useCallback(() => {
    handleDeleteTasks([task]);
  }, [task, handleDeleteTasks]);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        color: colors.barLabelColor,
      }}
      className={styles.button}
    >
      {icons?.renderDeleteIcon ? icons.renderDeleteIcon(task) : '-'}
    </button>
  );
};
