import { useCallback, useRef, useState } from 'react';
import type { RefObject, SyntheticEvent } from 'react';
import { SCROLL_STEP } from '../constants';

export type ScrollHandlersResult = {
  ganttTaskRootRef: RefObject<HTMLDivElement>;
  scrollX: number;
  setScrollXProgrammatically: (nextScrollX: number) => void;
  onVerticalScrollbarScrollX: (event: SyntheticEvent<HTMLDivElement>) => void;
  scrollToLeftStep: () => void;
  scrollToRightStep: () => void;
  ganttTaskContentRef: RefObject<HTMLDivElement>;
  taskListContentRef: RefObject<HTMLDivElement>;
  setScrollYProgrammatically: (nextScrollY: number) => void;
  onScrollVertically: (event: SyntheticEvent<HTMLDivElement>) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    options: { columnWidth: number; rowHeight: number; svgWidth: number }
  ) => void;
};

export const useScrollHandlers = (): ScrollHandlersResult => {
  const [scrollX, setScrollX] = useState(0);

  const ganttTaskRootRef = useRef<HTMLDivElement>(null);

  const isLockedRef = useRef(false);

  const setScrollXProgrammatically = useCallback((nextScrollX: number) => {
    const scrollEl = ganttTaskRootRef.current;

    if (!scrollEl) {
      return;
    }

    isLockedRef.current = true;

    if (ganttTaskRootRef.current) {
      ganttTaskRootRef.current.scrollLeft = nextScrollX;
    }

    setScrollX(scrollEl.scrollLeft);

    setTimeout(() => {
      isLockedRef.current = false;
    }, 300);
  }, []);

  const onVerticalScrollbarScrollX = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
    if (isLockedRef.current) {
      return;
    }

    const nextScrollX = event.currentTarget.scrollLeft;

    if (ganttTaskRootRef.current) {
      ganttTaskRootRef.current.scrollLeft = nextScrollX;
    }

    setScrollX(nextScrollX);
  }, []);

  const scrollToLeftStep = useCallback(() => {
    setScrollXProgrammatically(scrollX - SCROLL_STEP);
  }, [setScrollXProgrammatically, scrollX]);

  const scrollToRightStep = useCallback(() => {
    setScrollXProgrammatically(scrollX + SCROLL_STEP);
  }, [setScrollXProgrammatically, scrollX]);

  const ganttTaskContentRef = useRef<HTMLDivElement>(null);
  const taskListContentRef = useRef<HTMLDivElement>(null);

  const setScrollYProgrammatically = (nextScrollY: number) => {
    if (taskListContentRef.current) {
      // The following line will trigger onScrollVertically
      taskListContentRef.current.scrollTop = nextScrollY;
    }
  };

  /*
   * The aim of this trigger is to synchronize taskListContentRef and ganttTaskContentRef vertical scrollbar
   */
  const onScrollVertically = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.currentTarget === ganttTaskContentRef.current) {
      taskListContentRef.current.scrollTop = ganttTaskContentRef.current.scrollTop;
      //  On chrome, if a horizontal scrollbar is displayed in ganttTaskContentRef then the size of the gantt
      // is greater. So, when scrolling gantt to the bottom it goes more in the bottom
      // than the taskListContent part can. In this case, ganttTaskContentRef.current.scrollTop is too high
      // The line below allow to lower ganttTaskContentRef.current.scrollTop
      ganttTaskContentRef.current.scrollTop = taskListContentRef.current.scrollTop;
    } else {
      ganttTaskContentRef.current.scrollTop = taskListContentRef.current.scrollTop;
      taskListContentRef.current.scrollTop = ganttTaskContentRef.current.scrollTop;
    }
  };

  /**
   * Handles arrow keys events and transforms them to new scroll positions
   */
  const handleKeyDown = useCallback(
    (
      event: React.KeyboardEvent<HTMLDivElement>,
      options: { columnWidth: number; rowHeight: number; svgWidth: number }
    ) => {
      const { columnWidth, rowHeight, svgWidth } = options;
      event.preventDefault();
      let newScrollY = ganttTaskContentRef.current?.scrollTop || 0;
      let newScrollX = scrollX;
      let isX = true;
      switch (event.key) {
        case 'Down': // IE/Edge specific value
        case 'ArrowDown':
          newScrollY += rowHeight;
          isX = false;
          break;
        case 'Up': // IE/Edge specific value
        case 'ArrowUp':
          newScrollY -= rowHeight;
          isX = false;
          break;
        case 'Left':
        case 'ArrowLeft':
          newScrollX -= columnWidth;
          break;
        case 'Right': // IE/Edge specific value
        case 'ArrowRight':
          newScrollX += columnWidth;
          break;
      }
      if (isX) {
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollXProgrammatically(newScrollX);
      } else {
        setScrollYProgrammatically(newScrollY);
      }
    },
    [scrollX, setScrollXProgrammatically]
  );

  return {
    ganttTaskRootRef,
    scrollX,
    setScrollXProgrammatically,
    onVerticalScrollbarScrollX,
    scrollToLeftStep,
    scrollToRightStep,
    ganttTaskContentRef,
    taskListContentRef,
    setScrollYProgrammatically,
    onScrollVertically,
    handleKeyDown,
  };
};
