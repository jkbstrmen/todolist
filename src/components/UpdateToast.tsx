import './UpdateToast.css';

interface UpdateToastProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateToast({ onUpdate, onDismiss }: UpdateToastProps) {
  return (
    <div className="update-toast">
      <span className="update-toast-text">New version available</span>
      <div className="update-toast-actions">
        <button className="update-toast-btn dismiss" onClick={onDismiss}>
          Later
        </button>
        <button className="update-toast-btn primary" onClick={onUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}
