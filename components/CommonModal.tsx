import React from 'react';
import styles from './CommonModal.module.css';
import { Sparkles, AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react';

export type ModalType = 'info' | 'success' | 'warning' | 'danger' | 'confirm';

export interface CommonModalProps {
  isOpen: boolean;
  type?: ModalType;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  type = 'info',
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  const isConfirm = type === 'confirm' || type === 'danger' || Boolean(onCancel);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={24} className={styles.iconSuccess} />;
      case 'warning':
        return <AlertCircle size={24} className={styles.iconWarning} />;
      case 'danger':
        return <AlertCircle size={24} className={styles.iconDanger} />;
      case 'confirm':
        return <HelpCircle size={24} className={styles.iconConfirm} />;
      default:
        return <Sparkles size={24} className={styles.iconInfo} />;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel || onConfirm}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pandaDecorTop}>
          <span>🎋</span>
          <span className={styles.pandaBadge}>🐼</span>
          <span>🎂</span>
        </div>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel || onConfirm}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrap}>{getIcon()}</div>
          <h3 className={styles.modalTitle}>{title}</h3>
        </div>

        <div className={styles.modalBody}>
          {message && <p className={styles.modalMessage}>{message}</p>}
          {children}
        </div>

        <div className={styles.modalFooter}>
          {isConfirm && (
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onCancel || onConfirm}
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="button"
            className={type === 'danger' ? styles.btnDanger : styles.btnConfirm}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
