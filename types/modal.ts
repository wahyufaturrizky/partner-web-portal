import React from 'react';

export type Modal = {
  confirmation?: { open: boolean, title: string, message: string | React.ReactNode, onOk?: () => void }
  alert?: { open: boolean, title: string, message: string, variant?: string }
  transaction?: { open: boolean, title: string, onOk?: () => void }
}
