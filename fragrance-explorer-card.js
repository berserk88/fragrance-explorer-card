import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

// ─── Database ────────────────────────────────────────────────────────────────
const DATABASE = [
  {
    id: 1, name: "High-Heat Shield", icon: "🧊", rating: 4.5,
    season: "Summer", time: "Day", occasion: "Casual",
    profile: "Sparkling ginger-citrus blend with marine elements.",
    synergy: "Perfect interlocking of blue ambroxan and spice notes.",
    fragrances: ["Immortal", "Milestone", "Turathi"],
    steps: [
      { f: "Immortal",   v: "2 sprays", z: "Chest" },
      { f: "Milestone",  v: "1 spray",  z: "Neck"  },
      { f: "Turathi",    v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 2, name: "Ultimate Luxury Blue", icon: "💎", rating: 5.0,
    season: "All Seasons", time: "All", occasion: "Formal",
    profile: "Deep amber powdery blue – versatile masterpiece.",
    synergy: "Caprice's cardamom softens the sharp edges.",
    fragrances: ["Caprice", "Heaven", "National I"],
    steps: [
      { f: "Caprice",    v: "2 sprays", z: "Neck"  },
      { f: "Heaven",     v: "1 spray",  z: "Chest" },
      { f: "National I", v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 3, name: "Ginger Elysium", icon: "🌟", rating: 4.5,
    season: "Summer", time: "Day", occasion: "Casual",
    profile: "High-end effervescent lime and ginger.",
    synergy: "Immortal boosts the bright, sparkling top notes.",
    fragrances: ["Immortal", "Divin Asylum"],
    steps: [
      { f: "Immortal",     v: "2 sprays", z: "Neck"  },
      { f: "Divin Asylum", v: "1 spray",  z: "Chest" }
    ]
  },
  {
    id: 4, name: "Alpine Ocean Breeze", icon: "🌊", rating: 4.0,
    season: "Summer", time: "Day", occasion: "Casual",
    profile: "Metallic marine sea-salt air – fresh and invigorating.",
    synergy: "Milestone adds crisp marine salt notes.",
    fragrances: ["Milestone", "Turathi"],
    steps: [
      { f: "Milestone", v: "2 sprays", z: "Neck"  },
      { f: "Turathi",   v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 5, name: "Modernized Emerald Vetiver", icon: "🌿", rating: 4.0,
    season: "Spring", time: "Day", occasion: "Office",
    profile: "Sharp retro-modern green for the office.",
    synergy: "Immortal updates the heavy, dark vetiver.",
    fragrances: ["Immortal", "Heaven"],
    steps: [
      { f: "Immortal", v: "1 spray",  z: "Neck"  },
      { f: "Heaven",   v: "2 sprays", z: "Chest" }
    ]
  },
  {
    id: 6, name: "Inky Citrus Bomb", icon: "💣", rating: 4.0,
    season: "Autumn", time: "Day", occasion: "Casual",
    profile: "Earthy dark grapefruit explosion.",
    synergy: "Turathi's bright grapefruit cuts through.",
    fragrances: ["Turathi", "Heaven"],
    steps: [
      { f: "Turathi", v: "2 sprays", z: "Neck"  },
      { f: "Heaven",  v: "1 spray",  z: "Chest" }
    ]
  },
  {
    id: 7, name: "Coastal Countryside", icon: "🏞️", rating: 4.0,
    season: "Spring", time: "Day", occasion: "Casual",
    profile: "Salty crisp ozonic green.",
    synergy: "Milestone adds bright oceanic breeze.",
    fragrances: ["Milestone", "Immortal"],
    steps: [
      { f: "Milestone", v: "1 spray",  z: "Neck"  },
      { f: "Immortal",  v: "2 sprays", z: "Chest" }
    ]
  },
  {
    id: 8, name: "Professional Comfort", icon: "💼", rating: 4.5,
    season: "Autumn", time: "Day", occasion: "Office",
    profile: "Creamy fig and sharp vetiver.",
    synergy: "Liam Grey's milky tea accord perfects balance.",
    fragrances: ["Liam Grey", "Heaven"],
    steps: [
      { f: "Liam Grey", v: "2 sprays", z: "Neck"  },
      { f: "Heaven",    v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 9, name: "Executive Fresh", icon: "✨", rating: 4.5,
    season: "Spring", time: "Day", occasion: "Office",
    profile: "Elite fresh-cut grass and lime.",
    synergy: "Highly clean, professional aura.",
    fragrances: ["Immortal", "Caprice"],
    steps: [
      { f: "Immortal", v: "1 spray", z: "Neck"  },
      { f: "Caprice",  v: "1 spray", z: "Chest" }
    ]
  },
  {
    id: 10, name: "Upscale Ginger Cream-Soda", icon: "🥃", rating: 5.0,
    season: "Autumn", time: "All", occasion: "Evening",
    profile: "Sparkling gourmand vanilla.",
    synergy: "Ghost's rich vanilla gourmand sweetness.",
    fragrances: ["Ghost", "Immortal"],
    steps: [
      { f: "Ghost",   v: "2 sprays", z: "Neck"  },
      { f: "Immortal",v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 11, name: "Emperor's Tea Accord", icon: "🍵", rating: 4.5,
    season: "Spring", time: "Day", occasion: "Office",
    profile: "Luxury green and black tea lounge.",
    synergy: "Liam Grey adds dense black tea notes.",
    fragrances: ["Liam Grey", "Heaven"],
    steps: [
      { f: "Liam Grey", v: "2 sprays", z: "Chest" },
      { f: "Heaven",    v: "1 spray",  z: "Neck"  }
    ]
  },
  {
    id: 12, name: "Luxury Cashmere", icon: "🧥", rating: 5.0,
    season: "Winter", time: "All", occasion: "Formal",
    profile: "Niche woody shield.",
    synergy: "Encre Noire adds earthy framework.",
    fragrances: ["Encre Noire", "Ghost"],
    steps: [
      { f: "Encre Noire", v: "2 sprays", z: "Chest" },
      { f: "Ghost",       v: "1 spray",  z: "Neck"  }
    ]
  },
  {
    id: 13, name: "Seductive Pineapple", icon: "🍍", rating: 4.5,
    season: "Spring", time: "Night", occasion: "Evening",
    profile: "Romantic fruity pineapple spice.",
    synergy: "Caprice introduces sensual smoothness.",
    fragrances: ["Caprice", "SNOI"],
    steps: [
      { f: "Caprice", v: "1 spray",  z: "Neck"  },
      { f: "SNOI",    v: "2 sprays", z: "Chest" }
    ]
  },
  {
    id: 14, name: "Bad Boy in a Clean Suit", icon: "🎩", rating: 5.0,
    season: "Winter", time: "Night", occasion: "Evening",
    profile: "Rugged leather and clean powder.",
    synergy: "Masculine spice perfection.",
    fragrances: ["Encre Noire", "Hercules"],
    steps: [
      { f: "Encre Noire", v: "2 sprays", z: "Neck"  },
      { f: "Hercules",    v: "1 spray",  z: "Chest" }
    ]
  },
  {
    id: 15, name: "Freezing Powerhouse", icon: "❄️", rating: 5.0,
    season: "Winter", time: "Night", occasion: "Formal",
    profile: "Smoky spicy tobacco vanilla.",
    synergy: "Hercules provides heavy tobacco richness.",
    fragrances: ["Hercules", "Ghost"],
    steps: [
      { f: "Hercules", v: "2 sprays", z: "Chest" },
      { f: "Ghost",    v: "1 spray",  z: "Neck"  }
    ]
  },
  {
    id: 16, name: "Spiced Chai & Tobacco", icon: "🌶️", rating: 4.5,
    season: "Autumn", time: "All", occasion: "Casual",
    profile: "Ultra-cozy spiced gourmand.",
    synergy: "Hercules injects warm cinnamon spice.",
    fragrances: ["Hercules", "Immortal"],
    steps: [
      { f: "Hercules", v: "1 spray", z: "Neck"  },
      { f: "Immortal", v: "1 spray", z: "Chest" }
    ]
  },
  {
    id: 17, name: "Smoked Pineapple Leather", icon: "🔥", rating: 4.5,
    season: "Winter", time: "Night", occasion: "Evening",
    profile: "Alpha dark fruit and leather.",
    synergy: "SNOI's intense smoky performance.",
    fragrances: ["SNOI", "Encre Noire"],
    steps: [
      { f: "SNOI",       v: "2 sprays", z: "Neck"  },
      { f: "Encre Noire",v: "1 spray",  z: "Chest" }
    ]
  },
  {
    id: 18, name: "Seductive Vanilla Leather", icon: "💋", rating: 5.0,
    season: "Winter", time: "Night", occasion: "Evening",
    profile: "Sweet rugged luxury leather.",
    synergy: "Spicy structural ambroxan excellence.",
    fragrances: ["Ghost", "SNOI"],
    steps: [
      { f: "Ghost", v: "1 spray",  z: "Chest" },
      { f: "SNOI",  v: "2 sprays", z: "Neck"  }
    ]
  },
  {
    id: 19, name: "Spiced Vanilla Tobacco", icon: "🚬", rating: 4.5,
    season: "Autumn", time: "Night", occasion: "Evening",
    profile: "Powdery warm tobacco lavender.",
    synergy: "Caprice introduces clean smooth edges.",
    fragrances: ["Caprice", "Hercules"],
    steps: [
      { f: "Caprice",  v: "1 spray",  z: "Wrists"},
      { f: "Hercules", v: "2 sprays", z: "Neck"  }
    ]
  },
  {
    id: 20, name: "Salty Watermelon Tobacco", icon: "🍉", rating: 4.0,
    season: "Autumn", time: "Day", occasion: "Casual",
    profile: "Experimental sweet-salty ozonic tobacco.",
    synergy: "Milestone's ocean spray harmony.",
    fragrances: ["Milestone", "Hercules"],
    steps: [
      { f: "Milestone", v: "1 spray", z: "Neck"  },
      { f: "Hercules",  v: "1 spray", z: "Chest" }
    ]
  },
  {
    id: 21, name: "Imperial Saffron Blue", icon: "👑", rating: 4.5,
    season: "Autumn", time: "All", occasion: "Evening",
    profile: "Exotic leathery blue amber.",
    synergy: "National I creates elite amber base.",
    fragrances: ["National I", "SNOI"],
    steps: [
      { f: "National I", v: "2 sprays", z: "Chest" },
      { f: "SNOI",       v: "1 spray",  z: "Neck"  }
    ]
  },
  {
    id: 22, name: "Midnight Metallic Ocean", icon: "🌙", rating: 4.0,
    season: "Summer", time: "Night", occasion: "Casual",
    profile: "Dark fruity metallic marine.",
    synergy: "Milestone adds crisp ozonic salt.",
    fragrances: ["Milestone", "SNOI"],
    steps: [
      { f: "Milestone", v: "1 spray",  z: "Neck"  },
      { f: "SNOI",      v: "2 sprays", z: "Chest" }
    ]
  },
  {
    id: 23, name: "Creamy Alpine Woods", icon: "🌲", rating: 4.0,
    season: "Spring", time: "Day", occasion: "Office",
    profile: "Green tea smoothed by milky fig.",
    synergy: "Heaven's sharp ink and tea edges.",
    fragrances: ["Heaven", "Liam Grey"],
    steps: [
      { f: "Heaven",    v: "1 spray",  z: "Neck"  },
      { f: "Liam Grey", v: "2 sprays", z: "Chest" }
    ]
  },
  {
    id: 24, name: "Smoky Mountain Vetiver", icon: "⛰️", rating: 4.0,
    season: "Autumn", time: "Day", occasion: "Office",
    profile: "Dark ink vetiver meeting clean tea.",
    synergy: "Heaven provides clean fresh air.",
    fragrances: ["Heaven", "Encre Noire"],
    steps: [
      { f: "Heaven",     v: "1 spray",  z: "Wrists"},
      { f: "Encre Noire",v: "2 sprays", z: "Neck"  }
    ]
  },
  {
    id: 25, name: "Absolute Universal King", icon: "🏆", rating: 5.0,
    season: "All Seasons", time: "All", occasion: "Casual",
    profile: "Crowdpleasing fresh cardamom blue.",
    synergy: "Flawless interweaving of notes.",
    fragrances: ["Caprice", "Immortal", "Milestone"],
    steps: [
      { f: "Caprice",   v: "1 spray", z: "Neck"  },
      { f: "Immortal",  v: "1 spray", z: "Chest" },
      { f: "Milestone", v: "1 spray", z: "Wrists"}
    ]
  },
  {
    id: 26, name: "Aromatic Ink & Leather", icon: "📖", rating: 4.5,
    season: "Winter", time: "Night", occasion: "Formal",
    profile: "Intense ultra-masculine dark niche wood.",
    synergy: "Pure dark art excellence.",
    fragrances: ["Encre Noire", "Ghost"],
    steps: [
      { f: "Encre Noire", v: "2 sprays", z: "Chest" },
      { f: "Ghost",       v: "1 spray",  z: "Neck"  }
    ]
  },
  {
    id: 27, name: "Citrus Saffron Spark", icon: "⚡", rating: 4.0,
    season: "Autumn", time: "Day", occasion: "Office",
    profile: "Leathery zesty ginger.",
    synergy: "Immortal's ginger introduces brightness.",
    fragrances: ["Immortal", "Turathi"],
    steps: [
      { f: "Immortal", v: "1 spray", z: "Neck"  },
      { f: "Turathi",  v: "1 spray", z: "Wrists"}
    ]
  },
  {
    id: 28, name: "Golden Pineapple Breeze", icon: "☀️", rating: 4.5,
    season: "Summer", time: "Day", occasion: "Casual",
    profile: "Premium sharp tropical pineapple.",
    synergy: "Divin Asylum supercharges fruity notes.",
    fragrances: ["Divin Asylum", "Immortal"],
    steps: [
      { f: "Divin Asylum", v: "2 sprays", z: "Neck"  },
      { f: "Immortal",     v: "1 spray",  z: "Chest" }
    ]
  },
  {
    id: 29, name: "Emperor's Sovereign", icon: "👨‍⚖️", rating: 5.0,
    season: "Spring", time: "All", occasion: "Formal",
    profile: "[3-LAYER] Deep multi-dimensional smoky pineapple.",
    synergy: "SNOI anchors the composition perfectly.",
    fragrances: ["SNOI", "Divin Asylum", "Caprice"],
    steps: [
      { f: "SNOI",        v: "1 spray", z: "Neck"  },
      { f: "Divin Asylum",v: "1 spray", z: "Chest" },
      { f: "Caprice",     v: "1 spray", z: "Wrists"}
    ]
  },
  {
    id: 30, name: "Gothic Vanilla Incense", icon: "💀", rating: 4.5,
    season: "Winter", time: "Night", occasion: "Formal",
    profile: "[3-LAYER] Mysterious dark woody vanilla.",
    synergy: "Encre Noire adds rich dark framework.",
    fragrances: ["Encre Noire", "Ghost", "Hercules"],
    steps: [
      { f: "Encre Noire", v: "1 spray", z: "Neck"  },
      { f: "Ghost",       v: "1 spray", z: "Chest" },
      { f: "Hercules",    v: "1 spray", z: "Wrists"}
    ]
  },
  {
    id: 31, name: "Velvet Oud Royale", icon: "🕌", rating: 5.0,
    season: "Winter", time: "Night", occasion: "Formal",
    profile: "[3-LAYER] Majestic oud rose leather trinity.",
    synergy: "SNOI bridges the oud and ambroxan layers.",
    fragrances: ["SNOI", "National I", "Ghost"],
    steps: [
      { f: "SNOI",      v: "2 sprays", z: "Neck"  },
      { f: "National I",v: "1 spray",  z: "Chest" },
      { f: "Ghost",     v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 32, name: "Autumn Rain Ritual", icon: "🍂", rating: 4.5,
    season: "Autumn", time: "Day", occasion: "Casual",
    profile: "Petrichor-soaked leaves with cedar warmth.",
    synergy: "Heaven's vetiver grounds the earthy top notes.",
    fragrances: ["Heaven", "Liam Grey", "Turathi"],
    steps: [
      { f: "Heaven",    v: "2 sprays", z: "Chest" },
      { f: "Liam Grey", v: "1 spray",  z: "Neck"  },
      { f: "Turathi",   v: "1 spray",  z: "Wrists"}
    ]
  },
  {
    id: 33, name: "Solar Citrus Armour", icon: "🛡️", rating: 4.0,
    season: "Spring", time: "Day", occasion: "Office",
    profile: "Bright bergamot shielded by clean musk.",
    synergy: "Milestone's aquatic heart keeps freshness alive all day.",
    fragrances: ["Milestone", "Caprice"],
    steps: [
      { f: "Milestone", v: "2 sprays", z: "Neck"  },
      { f: "Caprice",   v: "1 spray",  z: "Chest" }
    ]
  },
  {
    id: 34, name: "Sovereign Niche Overlord", icon: "🗡️", rating: 5.0,
    season: "Winter", time: "Night", occasion: "Formal",
    profile: "[4-LAYER] Ultimate niche symphony.",
    synergy: "Heavy, dense base elements shifting smoothly into sweet gourmand top.",
    fragrances: ["Encre Noire l'Extreme", "Costume National I", "Lattafa Liam Grey", "Spectre Ghost"],
    steps: [
      { f: "Encre Noire l'Extreme",  v: "1 spray",  z: "Skin / Lower Back" },
      { f: "Costume National I",     v: "2 sprays", z: "Skin / Chest"      },
      { f: "Lattafa Liam Grey",      v: "1 spray",  z: "Skin / Neck"       },
      { f: "Spectre Ghost",          v: "1 spray",  z: "Hair / Shoulders"  }
    ]
  }
];

// ─── Filter Definitions ───────────────────────────────────────────────────────
const SEASONS   = [
  { label: "Spring",      icon: "🌸" },
  { label: "Summer",      icon: "☀️" },
  { label: "Autumn",      icon: "🍂" },
  { label: "Winter",      icon: "❄️" },
  { label: "All Seasons", icon: "🌍" },
];
const TIMES     = [
  { label: "Day",   icon: "🌤️" },
  { label: "Night", icon: "🌙" },
  { label: "All",   icon: "🕐" },
];
const OCCASIONS = [
  { label: "Casual",  icon: "👟" },
  { label: "Office",  icon: "💼" },
  { label: "Evening", icon: "🍷" },
  { label: "Formal",  icon: "🎩" },
];

// ─── Half-Star Helper ─────────────────────────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ─── Component ────────────────────────────────────────────────────────────────
class FragranceExplorerCard extends LitElement {

  static get properties() {
    return {
      hass:             { type: Object },
      config:           { type: Object },
      _view:            { type: String  },   // 'dashboard' | 'list' | 'detail'
      _searchQuery:     { type: String  },
      _filterSeason:    { type: String  },
      _filterTime:      { type: String  },
      _filterOccasion:  { type: String  },
      _selectedItem:    { type: Object  },
      _showExitWarning: { type: Boolean },
    };
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────
  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--paper-font-body1_-_font-family, 'Segoe UI', sans-serif);
      }

      /* ── Card shell ── */
      .card-shell {
        display: flex;
        flex-direction: column;
        height: var(--fragrance-card-height, 400px);
        max-height: var(--fragrance-card-height, 400px);
        background: var(--ha-card-background, #1c1c1e);
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
        position: relative;
      }

      /* ── Search bar ── */
      .search-bar {
        flex-shrink: 0;
        padding: 10px 12px 8px;
        background: var(--sidebar-background-color, #111);
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
      }
      .search-input {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1.5px solid var(--divider-color, rgba(255,255,255,0.15));
        background: var(--secondary-background-color, #2c2c2e);
        color: var(--primary-text-color, #fff);
        font-size: 13px;
        font-family: inherit;
        outline: none;
        transition: border-color .2s;
      }
      .search-input:focus { border-color: var(--accent-color, #e07b54); }
      .search-input::placeholder { color: var(--secondary-text-color, #888); }

      /* ── Scrollable content ── */
      .content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 12px;
        -webkit-overflow-scrolling: touch;
      }

      /* ── Bottom nav ── */
      .bottom-nav {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--sidebar-background-color, #111);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        min-height: 44px;
      }
      .nav-info {
        font-size: 12px;
        color: var(--secondary-text-color, #888);
        font-weight: 500;
      }
      .nav-btns { display: flex; gap: 8px; }
      .nav-btn {
        padding: 6px 14px;
        border-radius: 6px;
        border: none;
        font-size: 12px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: opacity .15s, transform .15s;
      }
      .nav-btn:active { transform: scale(.96); opacity: .8; }
      .nav-btn-back {
        background: var(--secondary-background-color, #2c2c2e);
        color: var(--primary-text-color, #fff);
      }
      .nav-btn-home {
        background: var(--accent-color, #e07b54);
        color: #fff;
      }

      /* ── Section label ── */
      .section-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: var(--accent-color, #e07b54);
        margin: 0 0 8px;
      }
      .section-block { margin-bottom: 14px; }

      /* ── Filter rows ── */
      .filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }
      .filter-chip {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 11px;
        border-radius: 20px;
        border: 1.5px solid var(--divider-color, rgba(255,255,255,0.15));
        background: var(--secondary-background-color, #2c2c2e);
        color: var(--primary-text-color, #e0e0e0);
        font-size: 12px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: all .2s;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .filter-chip:active { transf
