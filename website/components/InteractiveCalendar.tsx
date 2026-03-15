/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createDragPlugin } from '@dayflow/plugin-drag';
import { createKeyboardShortcutsPlugin } from '@dayflow/plugin-keyboard-shortcuts';
import { createSidebarPlugin } from '@dayflow/plugin-sidebar';
import {
  useCalendarApp,
  DayFlowCalendar,
  createDayView,
  createWeekView,
  createMonthView,
  ViewType,
  createYearView,
  UseCalendarAppReturn,
} from '@dayflow/react';
import { useTheme } from 'next-themes';
import { useMemo, useState, useRef } from 'react';

import { getWebsiteCalendars } from '@/utils/palette';
import { generateSampleEvents } from '@/utils/sampleData';

const calendarTypes = getWebsiteCalendars();

export function InteractiveCalendar() {
  const { resolvedTheme } = useTheme();
  const calendarRef = useRef<UseCalendarAppReturn | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.MONTH);

  function CalendarViewer({ config }: { config: any }) {
    const calendar = useCalendarApp(config);
    calendarRef.current = calendar;
    return <DayFlowCalendar calendar={calendar} />;
  }

  const events = useMemo(() => generateSampleEvents(), []);

  const themeMode = useMemo(() => {
    if (resolvedTheme === 'dark') return 'dark';
    if (resolvedTheme === 'light') return 'light';
    return 'auto';
  }, [resolvedTheme]);

  const config = useMemo(
    () => ({
      views: [
        createDayView(),
        createWeekView(),
        createMonthView({ showMonthIndicator: false }),
        createYearView({ mode: 'fixed-week' as never }),
      ],
      plugins: [
        createDragPlugin(),
        createSidebarPlugin({ createCalendarMode: 'modal' }),
        createKeyboardShortcutsPlugin(),
      ],
      initialDate: new Date(),
      defaultView: activeView,
      callbacks: {
        onViewChange: (view: ViewType) => setActiveView(view),
        onMoreEventsClick: (date: Date) => {
          calendarRef.current?.selectDate(date);
          calendarRef.current?.changeView(ViewType.DAY);
        },
      },
      events,
      locale: 'en',
      calendars: calendarTypes,
      useCalendarHeader: true,
      switcherMode: 'buttons',
      theme: { mode: themeMode },
    }),
    [themeMode, events, activeView]
  );

  return (
    <div className='h-full w-full'>
      <CalendarViewer key={`${themeMode}-${activeView}`} config={config} />
    </div>
  );
}

export default InteractiveCalendar;
