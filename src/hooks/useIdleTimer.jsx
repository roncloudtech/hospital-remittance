import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useIdleTimer = (timeout = 1 * 60 * 1000) => { // 30 minutes
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      handleLogout();
    }, timeout);
  };

  const handleLogout = () => {
    // Clear user auth data (token/session/etc)
    // localStorage.removeItem('token');
    localStorage.removeItem('military_token');
    localStorage.removeItem('user_data');
    // You can add additional cleanup logic here
    navigate('/login');
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Initialize on mount

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
};

export default useIdleTimer;
