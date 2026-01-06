import './App.css';
import React, { useState, useCallback } from 'react';

export default function ClickDashboard({ delay = 3000 }) {
  const safeDelay = isNaN(delay) || delay <= 0 ? 3000 : delay;
  const [clickState, setClickState] = useState({});

  const throttleCheck = (prevTime) => {
    const now = Date.now();
    const allowed = !prevTime || now - prevTime >= safeDelay;
    return { allowed, newTime: now };
  };

  const handleClick = useCallback((id, disabled) => {
    if (!id || disabled) return;
    setClickState(prev => {
      const prevTime = prev[id]?.lastAllowed;
      const prevCount = prev[id]?.count || 0;
      const result = throttleCheck(prevTime);
      if (!result.allowed) return prev;
      return {
        ...prev,
        [id]: { lastAllowed: result.newTime, count: prevCount + 1 }
      };
    });
  }, [safeDelay]);

  const Button = React.memo(({ id, disabled }) => (
    <button
      disabled={disabled}
      onClick={() => handleClick(id, disabled)}
      className="px-4 py-2 border rounded m-2"
    >
      {id} (Clicked: {clickState[id]?.count || 0})
    </button>
  ));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Click Analytics Dashboard</h2>
      <div>
        <Button id="Login" disabled={false} />
        <Button id="Signup" disabled={false} />
        <Button id="SubmitForm" disabled={false} />
        <Button id="Delete" disabled={true} />
      </div>
    </div>
  );
}
