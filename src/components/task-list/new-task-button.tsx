import React from 'react';
import styles from './new-task-button.module.css';
import { ColorStyles } from '../../types/public-types';

interface NewTaskButtonProps {
  colors: ColorStyles;
  onAddNewTask: () => void;
}

export const NewTaskButton: React.FC<NewTaskButtonProps> = ({ colors, onAddNewTask }) => {
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
