import React, { memo, SyntheticEvent, useMemo } from 'react';
import type { CSSProperties, RefObject } from 'react';

import { GridProps, Grid } from '../grid/grid';
import { CalendarProps, Calendar } from '../calendar/calendar';
import { TaskGanttContentProps, TaskGanttContent } from './task-gantt-content';
import styles from './gantt.module.css';
import {
  FloatingPortal,
  useFloating,
  flip,
  shift,
  offset,
  autoUpdate,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react';
import {
  TaskContextualPaletteProps,
  Task,
  DateExtremity,
  TaskDependencyContextualPaletteProps,
} from '../../types/public-types';
import { useGanttStyleContext } from '../../contexts/use-style-context';
import { useGanttDimensions } from '../../contexts/use-gantt-dimensions';

export type TaskGanttProps = {
  barProps: TaskGanttContentProps;
  calendarProps: CalendarProps;
  gridProps: GridProps;
  fullRowHeight: number;
  fullSvgWidth: number;
  ganttFullHeight: number;
  ganttSVGRef: RefObject<SVGSVGElement>;
  ganttTaskContentRef: RefObject<HTMLDivElement>;
  onVerticalScrollbarScrollX: (event: SyntheticEvent<HTMLDivElement>) => void;
  ganttTaskRootRef: RefObject<HTMLDivElement>;
  onScrollGanttContentVertically: (event: SyntheticEvent<HTMLDivElement>) => void;
};

const TaskGanttInner: React.FC<TaskGanttProps> = props => {
  const {
    barProps,
    barProps: { additionalLeftSpace },
    calendarProps,
    fullRowHeight,
    fullSvgWidth,
    ganttFullHeight,
    ganttSVGRef,
    gridProps,
    ganttTaskContentRef,
    onVerticalScrollbarScrollX,
    ganttTaskRootRef,
    onScrollGanttContentVertically: onScrollVertically,
  } = props;

  const { columnWidth, rowHeight, minimumRowDisplayed } = useGanttDimensions();

  const {
    colors,
    fonts: { fontFamily },
  } = useGanttStyleContext();
  const containerStyle: CSSProperties = {
    // In order to see the vertical scrollbar of the gantt content,
    // we resize dynamically the width of the gantt content
    height: Math.max(ganttFullHeight, minimumRowDisplayed * rowHeight),
    width: ganttTaskRootRef?.current
      ? ganttTaskRootRef.current.clientWidth + ganttTaskRootRef.current.scrollLeft
      : fullSvgWidth,
  };

  const gridStyle = useMemo<CSSProperties>(
    () => ({
      height: Math.max(ganttFullHeight, minimumRowDisplayed * rowHeight),
      width: fullSvgWidth,
      backgroundSize: `${columnWidth}px ${fullRowHeight * 2}px`,
      backgroundPositionX: additionalLeftSpace || undefined,
      backgroundImage: [
        `linear-gradient(to right, #ebeff2 1px, transparent 2px)`,
        `linear-gradient(to bottom, transparent ${fullRowHeight}px, #f5f5f5 ${fullRowHeight}px)`,
      ].join(', '),
    }),
    [additionalLeftSpace, columnWidth, fullRowHeight, fullSvgWidth, ganttFullHeight]
  );

  const [arrowAnchorEl, setArrowAnchorEl] = React.useState<null | SVGElement>(null);
  const [selectedDependency, setSelectedDependency] = React.useState<{
    taskFrom: Task;
    extremityFrom: DateExtremity;
    taskTo: Task;
    extremityTo: DateExtremity;
  }>(null);
  const isArrowContextualPaletteOpened = Boolean(arrowAnchorEl);
  const onClickArrow: (
    taskFrom: Task,
    extremityFrom: DateExtremity,
    taskTo: Task,
    extremityTo: DateExtremity,
    event: React.MouseEvent<SVGElement>
  ) => void = (taskFrom, extremityFrom, taskTo, extremityTo, event) => {
    setArrowAnchorEl(event.currentTarget);
    setSelectedDependency({ taskFrom, extremityFrom, taskTo, extremityTo });
  };

  const onCloseArrowContextualPalette = () => {
    setArrowAnchorEl(null);
  };

  // Floating UI setup for arrow contextual palette
  const {
    x: arrowX,
    y: arrowY,
    strategy: arrowStrategy,
    refs: arrowRefs,
    context: arrowContext,
  } = useFloating({
    open: isArrowContextualPaletteOpened,
    onOpenChange: open => {
      if (!open) {
        setArrowAnchorEl(null);
        setSelectedDependency(null);
      }
    },
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const arrowDismiss = useDismiss(arrowContext);
  const arrowRole = useRole(arrowContext);
  const { getFloatingProps: getArrowFloatingProps } = useInteractions([arrowDismiss, arrowRole]);

  // Set the reference element whenever arrowAnchorEl changes
  React.useEffect(() => {
    if (arrowAnchorEl) {
      arrowRefs.setReference(arrowAnchorEl);
    }
  }, [arrowAnchorEl, arrowRefs]);

  let arrowContextualPalette:
    | React.FunctionComponentElement<TaskDependencyContextualPaletteProps>
    | undefined = undefined;
  if (barProps.TaskDependencyContextualPalette && selectedDependency) {
    arrowContextualPalette = React.createElement(barProps.TaskDependencyContextualPalette, {
      taskFrom: selectedDependency.taskFrom,
      extremityFrom: selectedDependency.extremityFrom,
      taskTo: selectedDependency.taskTo,
      extremityTo: selectedDependency.extremityTo,
      onClosePalette: onCloseArrowContextualPalette,
    });
  } else {
    arrowContextualPalette = <div></div>;
  }

  // Manage the contextual palette
  const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task>(null);
  const open = Boolean(anchorEl);
  const onClickTask: (task: Task, event: React.MouseEvent<SVGElement>) => void = (task, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
    barProps.onClick(task, event);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  // Floating UI setup for task contextual palette
  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: open => {
      if (!open) {
        setAnchorEl(null);
        setSelectedTask(null);
      }
    },
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);

  // Set the reference element whenever anchorEl changes
  React.useEffect(() => {
    if (anchorEl) {
      refs.setReference(anchorEl);
    }
  }, [anchorEl, refs]);

  let contextualPalette: React.FunctionComponentElement<TaskContextualPaletteProps> | undefined =
    undefined;
  if (barProps.ContextualPalette && selectedTask) {
    contextualPalette = React.createElement(barProps.ContextualPalette, {
      selectedTask,
      onClosePalette: onClose,
    });
  } else {
    contextualPalette = <div></div>;
  }

  return (
    <div
      className={styles.ganttTaskRoot}
      ref={ganttTaskRootRef}
      onScroll={onVerticalScrollbarScrollX}
      dir="ltr"
    >
      <Calendar {...calendarProps} />

      <div
        ref={ganttTaskContentRef}
        className={styles.ganttTaskContent}
        style={containerStyle}
        onScroll={onScrollVertically}
      >
        <div style={gridStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={fullSvgWidth}
            height={ganttFullHeight}
            fontFamily={fontFamily}
            ref={ganttSVGRef}
            style={{
              background: colors.oddTaskBackgroundColor,
            }}
          >
            <Grid {...gridProps} />
            <TaskGanttContent {...barProps} onClick={onClickTask} onArrowClick={onClickArrow} />
          </svg>
        </div>

        {barProps.ContextualPalette && open && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              className={styles.popperPaper}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 1000,
              }}
              {...getFloatingProps()}
            >
              {contextualPalette}
            </div>
          </FloatingPortal>
        )}

        {barProps.TaskDependencyContextualPalette && isArrowContextualPaletteOpened && (
          <FloatingPortal>
            <div
              ref={arrowRefs.setFloating}
              className={styles.popperPaper}
              style={{
                position: arrowStrategy,
                top: arrowY ?? 0,
                left: arrowX ?? 0,
                zIndex: 1000,
              }}
              {...getArrowFloatingProps()}
            >
              {arrowContextualPalette}
            </div>
          </FloatingPortal>
        )}
      </div>
    </div>
  );
};

export const TaskGantt = memo(TaskGanttInner);
