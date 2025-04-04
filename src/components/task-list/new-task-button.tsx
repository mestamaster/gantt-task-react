import React from 'react';
import styles from './new-task-button.module.css';
import { useGanttStyleContext } from '../../contexts/use-style-context';
interface NewTaskButtonProps {
  onAddNewTask: () => void;
}

export const NewTaskButton: React.FC<NewTaskButtonProps> = ({ onAddNewTask }) => {
  const { colors } = useGanttStyleContext();
  return (
    <div className={styles.newTaskButtonWrapper}>
      <button
        type="button"
        onClick={onAddNewTask}
        className={styles.newTaskButton}
        style={{
          color: colors.barLabelColor,
        }}
      >
        + New Task
      </button>
    </div>
  );
};
