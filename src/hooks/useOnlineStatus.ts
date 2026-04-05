import { useState, useEffect } from 'react';

function useOnlineStatus() {
    // Manage current online status with state
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        function handleOnline() {
            setIsOnline(true);
            console.log('Conexão com a internet restabelecida.');
        }

        function handleOffline() {
            setIsOnline(false);
            console.log('Conexão com a internet perdida.');
        }

        // Register event listeners
        // These functions execute when browser detects online/offline status changes
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Remove event listeners when component unmounts
        // This is essential to prevent memory leaks
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

export default useOnlineStatus;