import React, { useCallback } from 'react';

import { ColumnProps } from '../../../types/public-types';

import styles from './add-column.module.css';
import { useGanttStyleContext } from '../../../contexts/use-style-context';

export const AddColumn: React.FC<ColumnProps> = props => {
  const {
    data: { handleAddTask, icons, task },
  } = props;

  const { colors } = useGanttStyleContext();

  const onClick = useCallback(() => {
    if (task.type === 'empty') {
      return;
    }

    handleAddTask(task);
  }, [task, handleAddTask]);

  if (task.type === 'empty' || task.type === 'milestone') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        color: colors.barLabelColor,
      }}
      className={styles.button}
    >
      {icons?.renderAddIcon ? icons.renderAddIcon(task) : '+'}
    </button>
  );
};
