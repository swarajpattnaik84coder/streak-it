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
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-[#07070e] text-stone-100">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header & Gold Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-rpg bg-gradient-to-r from-[#121024] to-[#0a0914]">
          <div>
            <h1 className="text-xl font-cinzel font-bold text-gold tracking-widest uppercase">
              The Merchant Bazaar (Store)
            </h1>
            <p className="text-xs text-rpg-muted font-crimson mt-1">
              Spend Gold earned from completing daily tasks on gear, potion boosters, titles, and crests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-[#151226] border border-amber-500/40 text-center">
              <span className="text-xs font-cinzel font-bold text-gold tabular-nums">
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
            className={`p-3 rounded-lg text-xs font-cinzel font-bold text-center border ${
              message.includes("Successfully")
                ? "bg-amber-950/60 border-amber-500 text-amber-300"
                : "bg-red-950/60 border-red-800 text-red-400"
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
              className={`px-4 py-2 rounded-lg font-cinzel text-xs font-bold transition-all ${
                activeTab === "shop"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-[#100f20] text-stone-400 hover:text-stone-200 border border-[#201d36]"
              }`}
            >
              🛒 Shop Bazaar
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-lg font-cinzel text-xs font-bold transition-all ${
                activeTab === "inventory"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "bg-[#100f20] text-stone-400 hover:text-stone-200 border border-[#201d36]"
              }`}
            >
              🎒 My Inventory ({ownedItems.length})
            </button>
          </div>

          {activeTab === "shop" && (
            <div className="flex gap-1.5 p-1 rounded-lg bg-[#0a0914] border border-[#201d36]">
              {["all", "booster", "gear", "title", "badge"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-[10px] font-cinzel uppercase transition-colors ${
                    categoryFilter === cat
                      ? "bg-amber-950/50 text-amber-400 font-bold border border-amber-500/40"
                      : "text-stone-400 hover:text-stone-200"
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
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isOwned
                      ? "bg-[#0b0a16] border-[#1e1c30] opacity-75"
                      : "bg-[#121024] border-[#252142] hover:border-amber-500/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold font-cinzel uppercase bg-[#1d1933] text-stone-300 border border-[#312b54]">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-cinzel font-bold text-stone-100">{item.name}</h3>
                    <p className="text-[11px] text-rpg-muted font-crimson mt-1">{item.description}</p>

                    {item.statBonus && item.statBonus.key && (
                      <div className="mt-2 text-[10px] font-cinzel text-amber-400">
                        Bonus: +{item.statBonus.amount} {item.statBonus.key}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1c32]">
                    <span className="text-xs font-cinzel font-bold text-gold tabular-nums">
                      💰 {item.price} Gold
                    </span>

                    {isOwned ? (
                      <span className="px-3 py-1 rounded text-[10px] font-cinzel font-bold bg-stone-800 text-stone-400">
                        OWNED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded text-xs font-cinzel font-bold uppercase transition-all shadow ${
                          canAfford
                            ? "bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95"
                            : "bg-stone-800 text-stone-500 cursor-not-allowed"
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
          <div className="p-5 rounded-xl border border-rpg bg-[#0a0914] flex flex-col gap-4">
            <h2 className="text-sm font-cinzel font-bold text-stone-200 uppercase tracking-wider">
              Acquired Treasures & Inventory
            </h2>

            {ownedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-rpg-muted font-crimson">
                Your inventory is currently empty. Visit the Shop Bazaar to purchase items!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ownedItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-3.5 rounded-lg border border-[#231f3e] bg-[#121022] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="text-xs font-cinzel font-bold text-stone-100">{item.name}</h3>
                        <p className="text-[10px] text-rpg-muted font-crimson">{item.description}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded text-[10px] font-cinzel font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300 uppercase">
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
