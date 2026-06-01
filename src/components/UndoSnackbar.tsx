import { useEffect } from 'react';
import './UndoSnackbar.css';

interface UndoSnackbarProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoSnackbar({ message, onUndo, onDismiss }: UndoSnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="undo-snackbar">
      <span className="undo-snackbar-text">{message}</span>
      <button className="undo-snackbar-btn" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
