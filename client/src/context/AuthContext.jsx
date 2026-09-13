import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { PLAYER as DEFAULT_PLAYER } from "../data/mockData.js";

const AuthContext = createContext(null);

const DEFAULT_TASKS = [
  { _id: "t1", title: "Complete 3 LeetCode Mediums", description: "Solve dynamic programming problems", category: "INT", levelNodeId: 7, xpReward: 140, currencyReward: 50, isCompleted: false },
  { _id: "t2", title: "1 Hour Gym Session (Legs)", description: "Squats, lunges, and calf raises", category: "STR", levelNodeId: 6, xpReward: 160, currencyReward: 60, isCompleted: true },
  { _id: "t3", title: "Read 20 Pages of Fantasy Book", description: "Focus & comprehension exercise", category: "FOC", levelNodeId: 7, xpReward: 100, currencyReward: 35, isCompleted: false },
  { _id: "t4", title: "30-Min Cardio Sprint", description: "Increase stamina & agility", category: "AGI", levelNodeId: 8, xpReward: 120, currencyReward: 40, isCompleted: false },
  { _id: "t5", title: "Prepare Healthy Meal Prep", description: "Nutritious macro-balanced meals", category: "VIT", levelNodeId: 5, xpReward: 110, currencyReward: 40, isCompleted: true },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_PLAYER);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [token, setToken] = useState(localStorage.getItem("streak_token") || null);
  // Start unauthenticated — only set to true after login/register/demoLogin
  // or after fetchUser successfully validates a stored token.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState(null);

  // Sync token to axios headers
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("streak_token", token);
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem("streak_token");
    }
  }, [token]);

  // Fetch Current User
  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Token invalid or server offline — stay on login page
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/tasks");
      if (res.data && res.data.tasks) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      // Keep default tasks
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchTasks();
    }
  }, [token, fetchUser, fetchTasks]);

  // Auth methods
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const serverUser = res.data.user || {};
      const normalisedUser = { ...serverUser, name: serverUser.name || serverUser.username || email };
      setToken(res.data.token);
      setUser(normalisedUser);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      // Server unreachable → local demo session so flow can be tested
      if (!err.response) {
        const derivedName = email.split("@")[0] || "Adventurer";
        setUser({ ...DEFAULT_PLAYER, name: derivedName, username: derivedName });
        setIsAuthenticated(true);
        return { success: true, offline: true };
      }
      return { success: false, message: err.response?.data?.message || "Invalid credentials. Please try again." };
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      // Send both username AND name so the backend display name is always set
      const res = await axiosInstance.post("/auth/register", { username, email, password, name: username });
      // Normalise: ensure user.name is always set (backend may return username instead)
      const serverUser = res.data.user || {};
      const normalisedUser = { ...serverUser, name: serverUser.name || serverUser.username || username };
      setToken(res.data.token);
      setUser(normalisedUser);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const serverMsg = err.response?.data?.message;
      // If the server is simply unreachable (network error), offer a local session
      if (!err.response) {
        // Offline fallback — local demo session with the provided name
        setUser({ ...DEFAULT_PLAYER, name: username, username });
        setIsAuthenticated(true);
        return { success: true, offline: true };
      }
      return { success: false, message: serverMsg || "Registration failed. Please try again." };
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/demo");
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      fetchTasks();
      return { success: true };
    } catch (err) {
      setLoading(false);
      setUser(DEFAULT_PLAYER);
      setIsAuthenticated(true);
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {}
    setToken(null);
    setIsAuthenticated(false);
    setUser(DEFAULT_PLAYER);
  };

  // Task Actions
  const addTask = async (taskData) => {
    try {
      const res = await axiosInstance.post("/tasks", taskData);
      if (res.data && res.data.task) {
        setTasks((prev) => [res.data.task, ...prev]);
      }
    } catch (err) {
      // Local fallback
      const newTask = {
        _id: "local_" + Date.now(),
        ...taskData,
        isCompleted: false,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const res = await axiosInstance.patch(`/tasks/${taskId}/complete`);
      if (res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? res.data.task : t))
        );
        if (res.data.user) {
          setUser(res.data.user);
        }
        if (res.data.leveledUp) {
          setLevelUpMessage(`LEVEL UP! You reached Level ${res.data.user.level}! +3 Attribute Points earned!`);
          setTimeout(() => setLevelUpMessage(null), 5000);
        }
      }
    } catch (err) {
      // Fallback local toggle
      setTasks((prev) =>
        prev.map((t) => {
          if (t._id === taskId) {
            const nextCompleted = !t.isCompleted;
            if (nextCompleted) {
              setUser((prevU) => {
                let newXp = prevU.xp + (t.xpReward || 100);
                let newCurrency = prevU.currency + (t.currencyReward || 50);
                let newLevel = prevU.level;
                let newXpToNext = prevU.xpToNext;
                let points = prevU.unallocatedStatPoints || 0;

                if (newXp >= newXpToNext) {
                  newLevel += 1;
                  newXp -= newXpToNext;
                  newXpToNext = Math.round(newXpToNext * 1.25);
                  points += 3;
                  setLevelUpMessage(`LEVEL UP! You reached Level ${newLevel}! +3 Attribute Points earned!`);
                  setTimeout(() => setLevelUpMessage(null), 5000);
                }

                return {
                  ...prevU,
                  xp: newXp,
                  currency: newCurrency,
                  level: newLevel,
                  xpToNext: newXpToNext,
                  unallocatedStatPoints: points,
                };
              });
            }
            return { ...t, isCompleted: nextCompleted };
          }
          return t;
        })
      );
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    }
  };

  // Stat Allocation
  const allocateStat = async (statKey) => {
    try {
      const res = await axiosInstance.post("/user/allocate-stat", { statKey });
      if (res.data && res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      // Fallback local allocation
      setUser((prev) => {
        if ((prev.unallocatedStatPoints || 0) <= 0) return prev;
        const newStats = prev.stats.map((s) =>
          s.key === statKey ? { ...s, value: Math.min(100, s.value + 2) } : s
        );
        return {
          ...prev,
          unallocatedStatPoints: prev.unallocatedStatPoints - 1,
          stats: newStats,
        };
      });
    }
  };

  // Store purchase
  const buyStoreItem = async (itemId, price, itemObj) => {
    try {
      const res = await axiosInstance.post("/store/buy", { itemId });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      // Fallback local buy
      let success = false;
      let msg = "";
      setUser((prev) => {
        if (prev.currency < price) {
          msg = `Insufficient Gold. You need ${price} Gold.`;
          return prev;
        }
        if ((prev.inventory || []).includes(itemId)) {
          msg = "You already own this item!";
          return prev;
        }
        success = true;
        msg = `Successfully purchased ${itemObj.name}!`;

        let updatedStats = [...prev.stats];
        if (itemObj.statBonus && itemObj.statBonus.key) {
          updatedStats = updatedStats.map((s) =>
            s.key === itemObj.statBonus.key
              ? { ...s, value: Math.min(100, s.value + itemObj.statBonus.amount) }
              : s
          );
        }

        return {
          ...prev,
          currency: prev.currency - price,
          inventory: [...(prev.inventory || []), itemId],
          stats: updatedStats,
        };
      });
      return { success, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        tasks,
        token,
        isAuthenticated,
        loading,
        levelUpMessage,
        login,
        register,
        demoLogin,
        logout,
        fetchTasks,
        addTask,
        toggleTask,
        deleteTask,
        allocateStat,
        buyStoreItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
