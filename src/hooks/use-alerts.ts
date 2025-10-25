
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Alert {
    id: string;
    cryptoId: string;
    cryptoSymbol: string;
    price: number;
    status: 'active' | 'triggered';
    createdAt: string;
}

interface AlertsState {
    alerts: Alert[];
    addAlert: (alert: Alert) => void;
    removeAlert: (alertId: string) => void;
    updateAlertStatus: (alertId: string, status: 'active' | 'triggered') => void;
}

export const useAlerts = create<AlertsState>()(
    persist(
        (set) => ({
            alerts: [],
            addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
            removeAlert: (alertId) => set((state) => ({
                alerts: state.alerts.filter((alert) => alert.id !== alertId)
            })),
            updateAlertStatus: (alertId, status) => set((state) => ({
                alerts: state.alerts.map((alert) =>
                    alert.id === alertId ? { ...alert, status } : alert
                )
            })),
        }),
        {
            name: 'crypto-alerts-storage', 
            storage: createJSONStorage(() => localStorage), 
        }
    )
);
