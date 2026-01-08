# 🔍 React + JavaScript Debounced API Search Component

A beginner-friendly React project built to understand **debouncing, React state, effects, async API handling, lists, and cleanup logic** by writing real logic instead of memorizing syntax.

---

## 🧠 Learning Goal

- Build strong logic before code  
- Understand **why debounce works**, not just how to write it  
- Learn **React state-driven UI updates**  
- Handle async API calls **safely with proper cleanup**

---

## ⚙ Features Implemented

- Controlled search input component
- Debounced API call (waits for user to stop typing)
- Cancels previous timer if typing continues
- Loading state during API request
- Dynamic list rendering using `.map()` with keys
- Defensive error handling (prevents crashes)
- Clears timer using `useEffect cleanup`

---

## 🧩 Concepts Covered

| Concept | Usage in Project |
|--------|----------------|
| React State (`useState`) | Stores query, results, loading status |
| Controlled Component | Search input updates state on change |
| Debouncing | API triggers only after typing stops |
| `setTimeout` + `clearTimeout` | Timer reset logic |
| `useEffect` dependency array | Re-runs debounce on query update |
| Promise handling (`then/catch/finally`) | Safe async UI updates |
| List Rendering | Displays results dynamically |
| Cleanup Function | Prevents memory leaks and stale timers |

---

## 🚀 How It Works (Logic Summary)

1. User types into search box
2. Timer starts (debounce delay)
3. If user types again before delay → old timer is canceled
4. If delay completes without typing → API is called
5. UI shows loading while API responds
6. Results are displayed using list rendering
7. Errors are handled safely, UI doesn't crash

---

## 🧪 Edge Cases Handled

- Empty query avoids unnecessary API calls
- First search initializes timer correctly
- API failures don't break the app
- Fast typing continuously resets timer safely
- Cleanup ensures no memory leaks

---

## 📌 Code Quality Focus

- No shortcuts, full logic clarity
- No syntax memorization
- Defensive programming like real production apps
- Modular and readable structure

---

## 🛠 Installation & Run

```sh
npm install
npm start
