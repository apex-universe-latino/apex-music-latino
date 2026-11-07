import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Go to a landing-page section from anywhere: scroll if already on "/", else route to "/#id"
 *  (Landing scrolls to the hash once it mounts). */
export function useGoToSection() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return useCallback((id: string) => {
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
        return;
      }
    }
    navigate(`/#${id}`);
  }, [pathname, navigate]);
}
