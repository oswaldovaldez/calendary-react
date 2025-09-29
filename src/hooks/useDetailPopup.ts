import { useState, useCallback } from 'react';

interface EventData {
  id: string;
  calendarId: string;
  title: string;
  start: Date | string;
  end: Date | string;
  body?: string;
  location?: string;
  raw?: any;
  backgroundColor?: string;
}

interface PopupState {
  isOpen: boolean;
  event: EventData | null;
  position: { x: number; y: number } | undefined;
}

export const useDetailPopup = () => {
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    event: null,
    position: undefined,
  });

  const openPopup = useCallback((event: EventData, mouseEvent?: MouseEvent | React.MouseEvent) => {
    const position = mouseEvent
      ? {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
        }
      : undefined;

    setPopupState({
      isOpen: true,
      event,
      position,
    });
  }, []);

  const closePopup = useCallback(() => {
    setPopupState({
      isOpen: false,
      event: null,
      position: undefined,
    });
  }, []);

  const updateEvent = useCallback((updatedEvent: EventData) => {
    setPopupState((prev) => ({
      ...prev,
      event: updatedEvent,
    }));
  }, []);

  return {
    isOpen: popupState.isOpen,
    event: popupState.event,
    position: popupState.position,
    openPopup,
    closePopup,
    updateEvent,
  };
};

export default useDetailPopup;