import React, { useMemo } from 'react';

import styles from './project.module.css';
import { useGanttStyleContext } from '../../../contexts/use-style-context';

type ProjectDisplayProps = {
  barCornerRadius: number;
  isCritical: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  taskHeight: number;
  taskHalfHeight: number;
  taskYOffset: number;
  progressWidth: number;
  /* progress start point */
  progressX: number;
  startMoveFullTask: (clientX: number) => void;
  taskName: string;
  width: number;
  x1: number;
  x2: number;
};

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({
  barCornerRadius,
  taskName,
  taskHalfHeight,
  taskHeight,
  isSelected,
  isCritical,
  progressWidth,
  progressX,
  taskYOffset,
  width,
  x1,
  x2,
  startMoveFullTask,
}) => {
  const { colors } = useGanttStyleContext();
  const barColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return colors.projectBackgroundSelectedCriticalColor;
      }

      return colors.projectBackgroundCriticalColor;
    }

    if (isSelected) {
      return colors.projectBackgroundSelectedColor;
    }

    return colors.projectBackgroundColor;
  }, [isSelected, isCritical, colors]);

  const processColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return colors.projectProgressSelectedCriticalColor;
      }

      return colors.projectProgressCriticalColor;
    }

    if (isSelected) {
      return colors.projectProgressSelectedColor;
    }

    return colors.projectProgressColor;
  }, [isSelected, isCritical, colors]);

  const projectLeftTriangle = [
    x1,
    taskYOffset + taskHeight / 2 - 1,
    x1,
    taskYOffset + taskHeight,
    x1 + 15,
    taskYOffset + taskHeight / 2 - 1,
  ].join(',');
  const projectRightTriangle = [
    x2,
    taskYOffset + taskHeight / 2 - 1,
    x2,
    taskYOffset + taskHeight,
    x2 - 15,
    taskYOffset + taskHeight / 2 - 1,
  ].join(',');

  return (
    <g
      data-testid={`task-project-${taskName}`}
      onMouseDown={e => {
        startMoveFullTask(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMoveFullTask(firstTouch.clientX);
        }
      }}
      tabIndex={0}
      className={styles.projectWrapper}
    >
      <rect
        fill={barColor}
        x={x1}
        width={width}
        y={taskYOffset}
        height={taskHeight}
        rx={barCornerRadius}
        ry={barCornerRadius}
        className={styles.projectBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={taskYOffset}
        height={taskHeight}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={processColor}
      />
      <rect
        fill={barColor}
        x={x1}
        width={width}
        y={taskYOffset}
        height={taskHalfHeight}
        rx={barCornerRadius}
        ry={barCornerRadius}
        className={styles.projectTop}
      />
      <polygon className={styles.projectTop} points={projectLeftTriangle} fill={barColor} />
      <polygon className={styles.projectTop} points={projectRightTriangle} fill={barColor} />
    </g>
  );
};
