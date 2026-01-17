# Phase 3 Completion Guide

Follow these steps to finish Phase 3 by adding the missing 401 handling and the Performance Chart.

---

## 1. Automatic Logout on Session Expiry

**Target File:** `frontend/src/services/api.jsx`

Add this **Response Interceptor** at the bottom of the file, just before `export default api`. This ensures that if the backend returns a `401 Unauthorized` (expired token), the user is automatically logged out.

```javascript
// Add this BEFORE 'export default api'

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

---

## 2. Add Performance Chart to Dashboard

**Target File:** `frontend/src/pages/Dashboard.jsx`

### Step A: Add Imports
Add these imports at the top of the file with the other `lucide-react` or React imports:

```javascript
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
```

### Step B: Add Chart Data
Inside the `Dashboard` component, add this sample data constant (e.g., after the state declarations):

```javascript
    // Sample data for the chart
    const performanceData = [
        { name: 'Mon', tasks: 4 },
        { name: 'Tue', tasks: 3 },
        { name: 'Wed', tasks: 7 },
        { name: 'Thu', tasks: 5 },
        { name: 'Fri', tasks: 9 },
        { name: 'Sat', tasks: 6 },
        { name: 'Sun', tasks: 4 },
    ];
```

### Step C: Insert Chart UI
Find the section where the **Filter Controls** end. Look for `</div>` closing the `flex-wrap` container (around line 336-337).

Insert this code block **BELOW** that closing div and **ABOVE** the `<div className="grid grid-cols-1 ...">` (which starts around line 339).

```jsx
                {/* Performance Chart Section */}
                <div className="mb-10 bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-20" />
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="text-violet-500" size={18} />
                        Weekly Performance
                    </h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#71717a', fontSize: 12 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    hide={true} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#18181b', 
                                        border: '1px solid #27272a',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#e4e4e7' }}
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="tasks" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorTasks)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
```

**Note:** You will also need to add `Activity` to your `lucide-react` imports at the top:
```javascript
import {
    // ... existing imports
    Activity 
} from 'lucide-react';
```
