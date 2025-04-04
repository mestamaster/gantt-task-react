import { useCallback } from 'react';
import type { ReactElement } from 'react';

import type { ContextMenuOptionType } from '../../types/public-types';
import { useGanttStyleContext } from '../../contexts/use-style-context';
import { useGanttDimensions } from '../../contexts/use-gantt-dimensions';

import styles from './menu-option.module.css';
import React from 'react';

type MenuOptionProps = {
  handleAction: (option: ContextMenuOptionType) => void;
  option: ContextMenuOptionType;
};

export function MenuOption({
  handleAction,
  option,
  option: { icon, label },
}: MenuOptionProps): ReactElement {
  const { colors } = useGanttStyleContext();
  const { contextMenuIconWidth, contextMenuOptionHeight, contextMenuSidePadding } =
    useGanttDimensions();

  const onClick = useCallback(() => {
    handleAction(option);
  }, [handleAction, option]);

  return (
    <div
      className={styles.menuOption}
      style={{
        height: contextMenuOptionHeight,
        paddingLeft: contextMenuSidePadding,
        paddingRight: contextMenuSidePadding,
        color: colors.contextMenuTextColor,
      }}
      onClick={onClick}
    >
      <div
        className={styles.icon}
        style={{
          width: contextMenuIconWidth,
        }}
      >
        {icon}
      </div>

      <div className={styles.label}>{label}</div>
    </div>
  );
}
