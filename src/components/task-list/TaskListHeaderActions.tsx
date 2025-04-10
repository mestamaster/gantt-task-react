import React from 'react';
import style from './TaskListHeaderActions.module.css';
import { useGanttStyleContext } from '../../contexts/use-style-context';

// SVG Icon components
const UnfoldLessIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 11l5-5 5 5M7 17l5-5 5 5" />
  </svg>
);

const UnfoldMoreIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 6l5 5 5-5M7 18l5-5 5 5" />
  </svg>
);

const UnfoldMoreDoubleIcon = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 6l5 5 5-5M7 12l5 5 5-5M7 18l5-5 5 5" />
  </svg>
);

// Custom button component
const IconButton = ({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <button className={style.iconButton} onClick={onClick} title={title}>
      {children}
    </button>
  );
};

export type TaskListHeaderActionsProps = {
  onCollapseAll: () => void;
  onExpandFirstLevel: () => void;
  onExpandAll: () => void;
};

export const TaskListHeaderActions: React.FC<TaskListHeaderActionsProps> = ({
  onCollapseAll,
  onExpandFirstLevel,
  onExpandAll,
}) => {
  const { colors } = useGanttStyleContext();
  const iconColor = colors.barLabelColor || '#000000';

  return (
    <div className={style.taskListHeaderAction}>
      <IconButton onClick={onCollapseAll} title="Collapse All">
        <UnfoldLessIcon color={iconColor} />
      </IconButton>
      <IconButton onClick={onExpandFirstLevel} title="Expand First Level">
        <UnfoldMoreIcon color={iconColor} />
      </IconButton>
      <IconButton onClick={onExpandAll} title="Expand All">
        <UnfoldMoreDoubleIcon color={iconColor} />
      </IconButton>
    </div>
  );
};
