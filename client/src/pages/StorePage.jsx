import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";

const DEFAULT_STORE_ITEMS = [
  { itemId: "potion_xp", name: "Elixir of Insight", description: "+250 XP bonus instantly & level boost", category: "booster", price: 200, icon: "🧪", statBonus: { key: "INT", amount: 2 } },
  { itemId: "title_shadow", name: "Title: Shadow Walker", description: "Unlocks the 'Shadow Walker' title for your character", category: "title", price: 350, icon: "👑", statBonus: { key: "AGI", amount: 3 } },
  { itemId: "badge_dragon", name: "Badge: Dragon Slayer", description: "Equip a glowing Dragon Crest badge on profile", category: "badge", price: 500, icon: "🐉", statBonus: { key: "STR", amount: 4 } },
  { itemId: "gear_obsidian", name: "Obsidian Armor", description: "Mystic shadow cloak that enhances Focus", category: "gear", price: 650, icon: "🛡️", statBonus: { key: "FOC", amount: 5 } },
  { itemId: "potion_vitality", name: "Vial of Eternal Flame", description: "+3 Vitality stat boost instantly", category: "booster", price: 300, icon: "🔥", statBonus: { key: "VIT", amount: 3 } },
  { itemId: "title_mythic", name: "Title: Mythic Sovereign", description: "Prestige title reserved for legendary streak heroes", category: "title", price: 1000, icon: "⚔️", statBonus: { key: "STR", amount: 6 } },
];

export default function StorePage() {
  const { user, buyStoreItem } = useAuth();
  const [activeTab, setActiveTab] = useState("shop");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [items, setItems] = useState(DEFAULT_STORE_ITEMS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axiosInstance.get("/store/items");
        if (res.data && res.data.items) {
          setItems(res.data.items);
        }
      } catch (err) {}
    }
    fetchItems();
  }, []);

  const handleBuy = async (item) => {
    setMessage("");
    const res = await buyStoreItem(item.itemId, item.price, item);
    setMessage(res.message);
    setTimeout(() => setMessage(""), 4000);
  };

  const filteredItems = items.filter(
    (i) => categoryFilter === "all" || i.category === categoryFilter
  );

  const ownedItems = items.filter((i) => (user.inventory || []).includes(i.itemId));

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#140e0a] text-[#2b1d0e]">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 font-cinzel">

        {/* Header & Gold Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] shadow-xl">
          <div>
            <h1 className="text-xl font-black text-[#3b2413] tracking-widest uppercase">
              The Merchant Bazaar (Store)
            </h1>
            <p className="text-xs text-[#6e4e31] font-crimson font-semibold mt-1">
              Spend Gold earned from completing daily tasks on gear, potion boosters, titles, and crests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-[#593e28] text-[#f5ebd6] text-center border border-[#8c643b]">
              <span className="text-xs font-black tabular-nums">
                💰 {user.currency} Gold
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Message Notification */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-xs font-black text-center border-2 ${
              message.includes("Successfully")
                ? "bg-[#e8d7b5] border-[#593e28] text-[#3b2413]"
                : "bg-red-950 border-red-800 text-red-300"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* View Switcher Tabs: Shop vs Inventory */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                activeTab === "shop"
                  ? "bg-[#593e28] text-[#f5ebd6] border-[#8c643b] shadow-md"
                  : "bg-[#251d16] text-stone-300 hover:text-white border-[#423122]"
              }`}
            >
              🛒 Shop Bazaar
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                activeTab === "inventory"
                  ? "bg-[#593e28] text-[#f5ebd6] border-[#8c643b] shadow-md"
                  : "bg-[#251d16] text-stone-300 hover:text-white border-[#423122]"
              }`}
            >
              🎒 My Inventory ({ownedItems.length})
            </button>
          </div>

          {activeTab === "shop" && (
            <div className="flex gap-1.5 p-1 rounded-lg bg-[#251d16] border border-[#593e28]">
              {["all", "booster", "gear", "title", "badge"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase transition-colors ${
                    categoryFilter === cat
                      ? "bg-[#593e28] text-[#f5ebd6] font-bold border border-[#8c643b]"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Shop Catalog */}
        {activeTab === "shop" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isOwned = (user.inventory || []).includes(item.itemId);
              const canAfford = user.currency >= item.price;

              return (
                <motion.div
                  key={item.itemId}
                  whileHover={{ y: -3 }}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between gap-3 transition-all shadow-md ${
                    isOwned
                      ? "bg-[#d9c6a3]/70 border-[#8c6e51] opacity-75"
                      : "bg-[#ede1c4] border-[#593e28] hover:border-[#8c643b]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#593e28] text-[#f5ebd6]">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-black text-[#3b2413]">{item.name}</h3>
                    <p className="text-[11px] text-[#6e4e31] font-crimson font-semibold mt-1">{item.description}</p>

                    {item.statBonus && item.statBonus.key && (
                      <div className="mt-2 text-[10px] font-bold text-[#8c4b18]">
                        Bonus: +{item.statBonus.amount} {item.statBonus.key}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#a37d53]">
                    <span className="text-xs font-black text-[#6d4c2b] tabular-nums">
                      💰 {item.price} Gold
                    </span>

                    {isOwned ? (
                      <span className="px-3 py-1 rounded text-[10px] font-bold bg-[#8c6e51] text-[#f5ebd6]">
                        OWNED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all shadow border ${
                          canAfford
                            ? "bg-[#593e28] hover:bg-[#3b2413] text-[#f5ebd6] border-[#8c643b] active:scale-95"
                            : "bg-[#a89078] text-[#593e28] cursor-not-allowed border-transparent"
                        }`}
                      >
                        Buy Item
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tab 2: My Inventory */}
        {activeTab === "inventory" && (
          <div className="p-5 rounded-xl border-2 border-[#593e28] bg-[#e8d7b5] flex flex-col gap-4 shadow-xl">
            <h2 className="text-sm font-black text-[#3b2413] uppercase tracking-wider">
              Acquired Treasures & Inventory
            </h2>

            {ownedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#593e28] font-crimson font-semibold">
                Your inventory is currently empty. Visit the Shop Bazaar to purchase items!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-crimson">
                {ownedItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-3.5 rounded-lg border-2 border-[#593e28] bg-[#f5e9ce] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="text-xs font-cinzel font-black text-[#3b2413]">{item.name}</h3>
                        <p className="text-[10px] text-[#6e4e31] font-semibold">{item.description}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded text-[10px] font-cinzel font-bold bg-[#593e28] text-[#f5ebd6] uppercase">
                      EQUIPPED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
