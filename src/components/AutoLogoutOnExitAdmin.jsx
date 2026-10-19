'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

/**
 * AutoLogoutOnExitAdmin:
 * Monitors the active route. Whenever an admin session is active and
 * the user navigates to ANY page outside of `/admin` (e.g. Home, Products,
 * About, Contact, Cart, Categories, etc.), this component automatically
 * signs out the admin session cleanly in the background.
 */
export default function AutoLogoutOnExitAdmin() {
  const pathname = usePathname();
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const status = sessionContext?.status || 'loading';
  const isLoggingOut = useRef(false);

  useEffect(() => {
    // Determine if the current route is outside the admin panel
    const isOutsideAdmin = pathname && !pathname.startsWith('/admin');

    if (status === 'authenticated' && session?.user && isOutsideAdmin && !isLoggingOut.current) {
      isLoggingOut.current = true;
      signOut({ redirect: false })
        .then(() => {
          console.log('[Security] Admin session auto-logged out upon exiting admin panel to:', pathname);
        })
        .catch((err) => {
          console.error('[Security] Failed to auto-logout admin:', err);
        })
        .finally(() => {
          isLoggingOut.current = false;
        });
    }
  }, [pathname, status, session]);

  return null;
}

