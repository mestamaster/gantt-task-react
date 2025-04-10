import React, { useMemo } from 'react';

import style from './bar.module.css';
import { useGanttStyleContext } from '../../../contexts/use-style-context';
type BarDisplayProps = {
  barCornerRadius: number;
  isCritical: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  height: number;
  progressWidth: number;
  /* progress start point */
  progressX: number;
  startMoveFullTask: (clientX: number) => void;
  taskName: string;
  width: number;
  x: number;
  y: number;
};

export const BarDisplay: React.FC<BarDisplayProps> = ({
  taskName,
  barCornerRadius,
  isCritical,
  isSelected,
  hasChildren,
  height,
  progressWidth,
  progressX,
  startMoveFullTask,
  width,
  x,
  y,
}) => {
  const { colors } = useGanttStyleContext();
  const processColor = useMemo(() => {
    if (isCritical) {
      if (hasChildren) {
        if (isSelected) {
          return colors.groupProgressSelectedCriticalColor;
        }

        return colors.groupProgressCriticalColor;
      }

      if (isSelected) {
        return colors.barProgressSelectedCriticalColor;
      }

      return colors.barProgressCriticalColor;
    }

    if (hasChildren) {
      if (isSelected) {
        return colors.groupProgressSelectedColor;
      }

      return colors.groupProgressColor;
    }

    if (isSelected) {
      return colors.barProgressSelectedColor;
    }

    return colors.barProgressColor;
  }, [isSelected, isCritical, hasChildren, colors]);

  const barColor = useMemo(() => {
    if (isCritical) {
      if (hasChildren) {
        if (isSelected) {
          return colors.groupBackgroundSelectedCriticalColor;
        }

        return colors.groupBackgroundCriticalColor;
      }

      if (isSelected) {
        return colors.barBackgroundSelectedCriticalColor;
      }

      return colors.barBackgroundCriticalColor;
    }

    if (hasChildren) {
      if (isSelected) {
        return colors.groupBackgroundSelectedColor;
      }

      return colors.groupBackgroundColor;
    }

    if (isSelected) {
      return colors.barBackgroundSelectedColor;
    }

    return colors.barBackgroundColor;
  }, [isSelected, isCritical, hasChildren, colors]);

  return (
    <g
      data-testid={`task-bar-${taskName}`}
      onMouseDown={e => {
        startMoveFullTask(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMoveFullTask(firstTouch.clientX);
        }
      }}
    >
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={barColor}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={processColor}
      />
    </g>
  );
};
