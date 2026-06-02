import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class FragranceExplorerCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      currentView: { type: String, reflect: true },
      searchQuery: { type: String, reflect: true },
      selectedSeason: { type: String, reflect: true },
      selectedTime: { type: String, reflect: true },
      selectedFragranceName: { type: String, reflect: true },
      selectedFragrance: { type: Object },
      filteredItems: { type: Array },
      databaseLoaded: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        --ha-card-background: var(--ha-card-background, #1a1a1a);
        --sidebar-background-color: var(--sidebar-background-color, #121212);
        --accent-color: var(--accent-color, #ff6b6b);
        --text-primary: var(--text-primary, #ffffff);
        --text-secondary: var(--text-secondary, #b0b0b0);
        --border-color: var(--border-color, #333333);
        display: block;
      }

      ha-card {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .card-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--ha-card-background);
        overflow: hidden;
      }

      .search-container {
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        background: linear-gradient(135deg, var(--sidebar-background-color) 0%, rgba(255, 107, 107, 0.05) 100%);
        flex-shrink: 0;
      }

      .search-input {
        width: 100%;
        padding: 12px 16px;
        background: var(--ha-card-background);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;
        box-sizing: border-box;
        font-family: inherit;
      }

      .search-input:focus {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15);
      }

      .search-input::placeholder {
        color: var(--text-secondary);
      }

      .content-area {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 16px;
      }

      /* Dashboard Grid Styles */
      .dashboard-section {
        margin-bottom: 24px;
      }

      .dashboard-label {
        font-weight: 700;
        color: var(--accent-color);
        font-size: 13px;
        text-transform: uppercase;
        margin-bottom: 12px;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
        gap: 10px;
      }

      .filter-btn {
        padding: 12px 16px;
        background: var(--sidebar-background-color);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
        transition: all 0.3s ease;
        font-family: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 60px;
      }

      .filter-btn:hover {
        border-color: var(--accent-color);
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
      }

      .filter-btn.active {
        background: linear-gradient(135deg, var(--accent-color) 0%, rgba(255, 107, 107, 0.8) 100%);
        border-color: var(--accent-color);
        color: #fff;
        box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
      }

      .filter-icon {
        font-size: 24px;
        display: block;
      }

      /* Fragrance List Styles */
      .fragrance-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .fragrance-item {
        padding: 14px;
        background: linear-gradient(135deg, var(--sidebar-background-color) 0%, rgba(255, 107, 107, 0.03) 100%);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .fragrance-item:hover {
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
        border-color: var(--accent-color);
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
      }

      .fragrance-item-left {
        flex: 1;
      }

      .fragrance-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .fragrance-icon {
        font-size: 24px;
      }

      .fragrance-name {
        font-weight: 700;
        color: var(--accent-color);
        font-size: 14px;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        border-bottom: 2px solid transparent;
      }

      .fragrance-name:hover {
        color: #ff9a9f;
        border-bottom-color: #ff9a9f;
      }

      .fragrance-meta {
        display: flex;
        gap: 8px;
        font-size: 11px;
        color: var(--text-secondary);
        flex-wrap: wrap;
        margin-top: 6px;
      }

      .meta-tag {
        background: rgba(255, 107, 107, 0.15);
        padding: 4px 10px;
        border-radius: 4px;
        border-left: 2px solid var(--accent-color);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .rating {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--accent-color);
        color: #000;
        padding: 6px 12px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 12px;
        flex-shrink: 0;
      }

      /* Detail View Styles */
      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        border-bottom: 2px solid var(--accent-color);
        padding-bottom: 16px;
      }

      .detail-title-section {
        flex: 1;
      }

      .detail-icon {
        font-size: 40px;
        margin-bottom: 8px;
      }

      .detail-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .detail-rating {
        background: var(--accent-color);
        color: #000;
        padding: 8px 14px;
        border-radius: 6px;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .detail-section {
        margin-bottom: 24px;
      }

      .detail-label {
        font-weight: 700;
        color: var(--accent-color);
        font-size: 12px;
        text-transform: uppercase;
        margin-bottom: 10px;
        letter-spacing: 1px;
      }

      .detail-text {
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.6;
      }

      .profile-box {
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
        padding: 14px;
        border-radius: 8px;
        border-left: 4px solid var(--accent-color);
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.6;
      }

      .synergy-box {
        background: linear-gradient(135deg, rgba(100, 200, 255, 0.1) 0%, rgba(100, 200, 255, 0.05) 100%);
        padding: 14px;
        border-radius: 8px;
        border-left: 4px solid #64c8ff;
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.6;
      }

      .fragrances-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
      }

      .fragrance-tag {
        background: var(--sidebar-background-color);
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 12px;
        color: var(--accent-color);
        border: 2px solid var(--accent-color);
        font-weight: 600;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .fragrance-tag:hover {
        background: var(--accent-color);
        color: #000;
      }

      .fragrance-tag.selected {
        background: var(--accent-color);
        color: #000;
      }

      .steps-timeline {
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
      }

      .steps-timeline::before {
        content: '';
        position: absolute;
        left: 19px;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, var(--accent-color) 0%, rgba(255, 107, 107, 0.3) 100%);
      }

      .step-node {
        display: flex;
        gap: 16px;
        position: relative;
      }

      .step-circle {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, var(--accent-color) 0%, rgba(255, 107, 107, 0.8) 100%);
        border: 2px solid var(--sidebar-background-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #fff;
        z-index: 1;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
      }

      .step-content {
        flex: 1;
        padding: 12px;
        background: var(--sidebar-background-color);
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }

      .step-fragrance {
        font-weight: 600;
        color: var(--accent-color);
        margin-bottom: 6px;
        font-size: 14px;
      }

      .step-details {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: var(--text-secondary);
        flex-wrap: wrap;
      }

      .bottom-nav {
        padding: 12px 16px;
        border-top: 1px solid var(--border-color);
        background: linear-gradient(135deg, var(--sidebar-background-color) 0%, rgba(255, 107, 107, 0.05) 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .nav-info {
        font-size: 13px;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .nav-buttons {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .nav-btn {
        padding: 8px 16px;
        background: var(--accent-color);
        color: #000;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .nav-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      }

      .no-results {
        text-align: center;
        padding: 48px 16px;
        color: var(--text-secondary);
      }

      .no-results-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.7;
      }

      .clear-btn {
        padding: 8px 14px;
        background: rgba(255, 107, 107, 0.2);
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
        font-family: inherit;
        font-weight: 600;
      }

      .clear-btn:hover {
        background: var(--accent-color);
        color: #000;
      }

      .loading-message {
        text-align: center;
        padding: 48px 16px;
        color: var(--text-secondary);
      }

      @media (max-width: 600px) {
        .content-area {
          padding: 12px;
        }

        .dashboard-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .filter-btn {
          font-size: 12px;
          padding: 10px 8px;
          min-height: 55px;
        }

        .detail-header {
          flex-direction: column;
          gap: 12px;
        }

        .bottom-nav {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
      }
    `;
  }

  constructor() {
    super();
    this.config = {};
    this.hass = undefined;
    this.currentView = 'dashboard';
    this.searchQuery = '';
    this.selectedSeason = null;
    this.selectedTime = null;
    this.selectedFragranceName = null;
    this.selectedFragrance = null;
    this.filteredItems = [];
    this.databaseLoaded = false;

    this.database = [
      {
        id: 1,
        name: "High-Heat Shield",
        icon: "🧊",
        rating: 4.5,
        season: "Summer",
        time: "Day",
        occasion: "Casual",
        profile: "Sparkling ginger-citrus blend with marine elements.",
        synergy: "Perfect interlocking of blue ambroxan and spice notes.",
        fragrances: ["Immortal", "Milestone", "Turathi"],
        steps: [
          { f: "Immortal", v: "2 sprays", z: "Chest" },
          { f: "Milestone", v: "1 spray", z: "Neck" },
          { f: "Turathi", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 2,
        name: "Ultimate Luxury Blue",
        icon: "💎",
        rating: 5.0,
        season: "All Seasons",
        time: "All",
        occasion: "Formal",
        profile: "Deep amber powdery blue - versatile masterpiece.",
        synergy: "Caprice's cardamom softens the sharp edges.",
        fragrances: ["Caprice", "Heaven", "National I"],
        steps: [
          { f: "Caprice", v: "2 sprays", z: "Neck" },
          { f: "Heaven", v: "1 spray", z: "Chest" },
          { f: "National I", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 3,
        name: "Ginger Elysium",
        icon: "🌟",
        rating: 4.5,
        season: "Summer",
        time: "Day",
        occasion: "Casual",
        profile: "High-end effervescent lime and ginger.",
        synergy: "Immortal boosts the bright, sparkling top notes.",
        fragrances: ["Immortal", "Divin Asylum"],
        steps: [
          { f: "Immortal", v: "2 sprays", z: "Neck" },
          { f: "Divin Asylum", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 4,
        name: "Alpine Ocean Breeze",
        icon: "🌊",
        rating: 4.0,
        season: "Summer",
        time: "Day",
        occasion: "Casual",
        profile: "Metallic marine sea-salt air - fresh and invigorating.",
        synergy: "Milestone adds crisp marine salt notes.",
        fragrances: ["Milestone", "Turathi"],
        steps: [
          { f: "Milestone", v: "2 sprays", z: "Neck" },
          { f: "Turathi", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 5,
        name: "Modernized Emerald Vetiver",
        icon: "🌿",
        rating: 4.0,
        season: "Spring",
        time: "Day",
        occasion: "Office",
        profile: "Sharp retro-modern green for the office.",
        synergy: "Immortal updates the heavy, dark vetiver.",
        fragrances: ["Immortal", "Heaven"],
        steps: [
          { f: "Immortal", v: "1 spray", z: "Neck" },
          { f: "Heaven", v: "2 sprays", z: "Chest" }
        ]
      },
      {
        id: 6,
        name: "Inky Citrus Bomb",
        icon: "💣",
        rating: 4.0,
        season: "Autumn",
        time: "Day",
        occasion: "Casual",
        profile: "Earthy dark grapefruit explosion.",
        synergy: "Turathi's bright grapefruit cuts through.",
        fragrances: ["Turathi", "Heaven"],
        steps: [
          { f: "Turathi", v: "2 sprays", z: "Neck" },
          { f: "Heaven", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 7,
        name: "Coastal Countryside",
        icon: "🏞️",
        rating: 4.0,
        season: "Spring",
        time: "Day",
        occasion: "Casual",
        profile: "Salty crisp ozonic green.",
        synergy: "Milestone adds bright oceanic breeze.",
        fragrances: ["Milestone", "Immortal"],
        steps: [
          { f: "Milestone", v: "1 spray", z: "Neck" },
          { f: "Immortal", v: "2 sprays", z: "Chest" }
        ]
      },
      {
        id: 8,
        name: "Professional Comfort",
        icon: "💼",
        rating: 4.5,
        season: "Autumn",
        time: "Day",
        occasion: "Office",
        profile: "Creamy fig and sharp vetiver.",
        synergy: "Liam Grey's milky tea accord perfects balance.",
        fragrances: ["Liam Grey", "Heaven"],
        steps: [
          { f: "Liam Grey", v: "2 sprays", z: "Neck" },
          { f: "Heaven", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 9,
        name: "Executive Fresh",
        icon: "✨",
        rating: 4.5,
        season: "Spring",
        time: "Day",
        occasion: "Office",
        profile: "Elite fresh-cut grass and lime.",
        synergy: "Highly clean, professional aura.",
        fragrances: ["Immortal", "Caprice"],
        steps: [
          { f: "Immortal", v: "1 spray", z: "Neck" },
          { f: "Caprice", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 10,
        name: "Upscale Ginger Cream-Soda",
        icon: "🥃",
        rating: 5.0,
        season: "Autumn",
        time: "All",
        occasion: "Evening",
        profile: "Sparkling gourmand vanilla.",
        synergy: "Ghost's rich vanilla gourmand sweetness.",
        fragrances: ["Ghost", "Immortal"],
        steps: [
          { f: "Ghost", v: "2 sprays", z: "Neck" },
          { f: "Immortal", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 11,
        name: "Emperor's Tea Accord",
        icon: "🍵",
        rating: 4.5,
        season: "Spring",
        time: "Day",
        occasion: "Office",
        profile: "Luxury green and black tea lounge.",
        synergy: "Liam Grey adds dense black tea notes.",
        fragrances: ["Liam Grey", "Heaven"],
        steps: [
          { f: "Liam Grey", v: "2 sprays", z: "Chest" },
          { f: "Heaven", v: "1 spray", z: "Neck" }
        ]
      },
      {
        id: 12,
        name: "Luxury Cashmere",
        icon: "🧥",
        rating: 5.0,
        season: "Winter",
        time: "All",
        occasion: "Formal",
        profile: "Niche woody shield.",
        synergy: "Encre Noire adds earthy framework.",
        fragrances: ["Encre Noire", "Ghost"],
        steps: [
          { f: "Encre Noire", v: "2 sprays", z: "Chest" },
          { f: "Ghost", v: "1 spray", z: "Neck" }
        ]
      },
      {
        id: 13,
        name: "Seductive Pineapple",
        icon: "🍍",
        rating: 4.5,
        season: "Spring",
        time: "Night",
        occasion: "Evening",
        profile: "Romantic fruity pineapple spice.",
        synergy: "Caprice introduces sensual smoothness.",
        fragrances: ["Caprice", "SNOI"],
        steps: [
          { f: "Caprice", v: "1 spray", z: "Neck" },
          { f: "SNOI", v: "2 sprays", z: "Chest" }
        ]
      },
      {
        id: 14,
        name: "Bad Boy in a Clean Suit",
        icon: "🎩",
        rating: 5.0,
        season: "Winter",
        time: "Night",
        occasion: "Evening",
        profile: "Rugged leather and clean powder.",
        synergy: "Masculine spice perfection.",
        fragrances: ["Encre Noire", "Hercules"],
        steps: [
          { f: "Encre Noire", v: "2 sprays", z: "Neck" },
          { f: "Hercules", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 15,
        name: "Freezing Powerhouse",
        icon: "❄️",
        rating: 5.0,
        season: "Winter",
        time: "Night",
        occasion: "Formal",
        profile: "Smoky spicy tobacco vanilla.",
        synergy: "Hercules provides heavy tobacco richness.",
        fragrances: ["Hercules", "Ghost"],
        steps: [
          { f: "Hercules", v: "2 sprays", z: "Chest" },
          { f: "Ghost", v: "1 spray", z: "Neck" }
        ]
      },
      {
        id: 16,
        name: "Spiced Chai & Tobacco",
        icon: "🌶️",
        rating: 4.5,
        season: "Autumn",
        time: "All",
        occasion: "Casual",
        profile: "Ultra-cozy spiced gourmand.",
        synergy: "Hercules injects warm cinnamon spice.",
        fragrances: ["Hercules", "Immortal"],
        steps: [
          { f: "Hercules", v: "1 spray", z: "Neck" },
          { f: "Immortal", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 17,
        name: "Smoked Pineapple Leather",
        icon: "🔥",
        rating: 4.5,
        season: "Winter",
        time: "Night",
        occasion: "Evening",
        profile: "Alpha dark fruit and leather.",
        synergy: "SNOI's intense smoky performance.",
        fragrances: ["SNOI", "Encre Noire"],
        steps: [
          { f: "SNOI", v: "2 sprays", z: "Neck" },
          { f: "Encre Noire", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 18,
        name: "Seductive Vanilla Leather",
        icon: "💋",
        rating: 5.0,
        season: "Winter",
        time: "Night",
        occasion: "Evening",
        profile: "Sweet rugged luxury leather.",
        synergy: "Spicy structural ambroxan excellence.",
        fragrances: ["Ghost", "SNOI"],
        steps: [
          { f: "Ghost", v: "1 spray", z: "Chest" },
          { f: "SNOI", v: "2 sprays", z: "Neck" }
        ]
      },
      {
        id: 19,
        name: "Spiced Vanilla Tobacco",
        icon: "🚬",
        rating: 4.5,
        season: "Autumn",
        time: "Night",
        occasion: "Evening",
        profile: "Powdery warm tobacco lavender.",
        synergy: "Caprice introduces clean smooth edges.",
        fragrances: ["Caprice", "Hercules"],
        steps: [
          { f: "Caprice", v: "1 spray", z: "Wrists" },
          { f: "Hercules", v: "2 sprays", z: "Neck" }
        ]
      },
      {
        id: 20,
        name: "Salty Watermelon Tobacco",
        icon: "🍉",
        rating: 4.0,
        season: "Autumn",
        time: "Day",
        occasion: "Casual",
        profile: "Experimental sweet-salty ozonic tobacco.",
        synergy: "Milestone's ocean spray harmony.",
        fragrances: ["Milestone", "Hercules"],
        steps: [
          { f: "Milestone", v: "1 spray", z: "Neck" },
          { f: "Hercules", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 21,
        name: "Imperial Saffron Blue",
        icon: "👑",
        rating: 4.5,
        season: "Autumn",
        time: "All",
        occasion: "Evening",
        profile: "Exotic leathery blue amber.",
        synergy: "National I creates elite amber base.",
        fragrances: ["National I", "SNOI"],
        steps: [
          { f: "National I", v: "2 sprays", z: "Chest" },
          { f: "SNOI", v: "1 spray", z: "Neck" }
        ]
      },
      {
        id: 22,
        name: "Midnight Metallic Ocean",
        icon: "🌙",
        rating: 4.0,
        season: "Summer",
        time: "Night",
        occasion: "Casual",
        profile: "Dark fruity metallic marine.",
        synergy: "Milestone adds crisp ozonic salt.",
        fragrances: ["Milestone", "SNOI"],
        steps: [
          { f: "Milestone", v: "1 spray", z: "Neck" },
          { f: "SNOI", v: "2 sprays", z: "Chest" }
        ]
      },
      {
        id: 23,
        name: "Creamy Alpine Woods",
        icon: "🌲",
        rating: 4.0,
        season: "Spring",
        time: "Day",
        occasion: "Office",
        profile: "Green tea smoothed by milky fig.",
        synergy: "Heaven's sharp ink and tea edges.",
        fragrances: ["Heaven", "Liam Grey"],
        steps: [
          { f: "Heaven", v: "1 spray", z: "Neck" },
          { f: "Liam Grey", v: "2 sprays", z: "Chest" }
        ]
      },
      {
        id: 24,
        name: "Smoky Mountain Vetiver",
        icon: "⛰️",
        rating: 4.0,
        season: "Autumn",
        time: "Day",
        occasion: "Office",
        profile: "Dark ink vetiver meeting clean tea.",
        synergy: "Heaven provides clean fresh air.",
        fragrances: ["Heaven", "Encre Noire"],
        steps: [
          { f: "Heaven", v: "1 spray", z: "Wrists" },
          { f: "Encre Noire", v: "2 sprays", z: "Neck" }
        ]
      },
      {
        id: 25,
        name: "Absolute Universal King",
        icon: "🏆",
        rating: 5.0,
        season: "All Seasons",
        time: "All",
        occasion: "Casual",
        profile: "Crowdspleasing fresh cardamom blue.",
        synergy: "Flawless interweaving of notes.",
        fragrances: ["Caprice", "Immortal", "Milestone"],
        steps: [
          { f: "Caprice", v: "1 spray", z: "Neck" },
          { f: "Immortal", v: "1 spray", z: "Chest" },
          { f: "Milestone", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 26,
        name: "Aromatic Ink & Leather",
        icon: "📖",
        rating: 4.5,
        season: "Winter",
        time: "Night",
        occasion: "Formal",
        profile: "Intense ultra-masculine dark niche wood.",
        synergy: "Pure dark art excellence.",
        fragrances: ["Encre Noire", "Ghost"],
        steps: [
          { f: "Encre Noire", v: "2 sprays", z: "Chest" },
          { f: "Ghost", v: "1 spray", z: "Neck" }
        ]
      },
      {
        id: 27,
        name: "Citrus Saffron Spark",
        icon: "⚡",
        rating: 4.0,
        season: "Autumn",
        time: "Day",
        occasion: "Office",
        profile: "Leathery zesty ginger.",
        synergy: "Immortal's ginger introduces brightness.",
        fragrances: ["Immortal", "Turathi"],
        steps: [
          { f: "Immortal", v: "1 spray", z: "Neck" },
          { f: "Turathi", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 28,
        name: "Golden Pineapple Breeze",
        icon: "☀️",
        rating: 4.5,
        season: "Summer",
        time: "Day",
        occasion: "Casual",
        profile: "Premium sharp tropical pineapple.",
        synergy: "Divin Asylum supercharges fruity notes.",
        fragrances: ["Divin Asylum", "Immortal"],
        steps: [
          { f: "Divin Asylum", v: "2 sprays", z: "Neck" },
          { f: "Immortal", v: "1 spray", z: "Chest" }
        ]
      },
      {
        id: 29,
        name: "Emperor's Sovereign",
        icon: "👨‍⚖️",
        rating: 5.0,
        season: "Spring",
        time: "All",
        occasion: "Formal",
        profile: "[3-LAYER] Deep multi-dimensional smoky pineapple.",
        synergy: "SNOI anchors the composition perfectly.",
        fragrances: ["SNOI", "Divin Asylum", "Caprice"],
        steps: [
          { f: "SNOI", v: "1 spray", z: "Neck" },
          { f: "Divin Asylum", v: "1 spray", z: "Chest" },
          { f: "Caprice", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 30,
        name: "Gothic Vanilla Incense",
        icon: "💀",
        rating: 4.5,
        season: "Winter",
        time: "Night",
        occasion: "Formal",
        profile: "[3-LAYER] Mysterious dark woody vanilla.",
        synergy: "Encre Noire adds rich dark framework.",
        fragrances: ["Encre Noire", "Ghost", "Hercules"],
        steps: [
          { f: "Encre Noire", v: "1 spray", z: "Neck" },
          { f: "Ghost", v: "1 spray", z: "Chest" },
          { f: "Hercules", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 31,
        name: "Royal Cardamom Sea",
        icon: "🌊",
        rating: 4.5,
        season: "Summer",
        time: "All",
        occasion: "Office",
        profile: "[3-LAYER] Advanced aquatic-spicy fusion.",
        synergy: "Turathi provides deep aquatic notes.",
        fragrances: ["Turathi", "Caprice", "Milestone"],
        steps: [
          { f: "Turathi", v: "1 spray", z: "Neck" },
          { f: "Caprice", v: "1 spray", z: "Chest" },
          { f: "Milestone", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 32,
        name: "Ultimate Zesty Aquatic",
        icon: "💧",
        rating: 4.5,
        season: "Summer",
        time: "Day",
        occasion: "Casual",
        profile: "[3-LAYER] Extreme hot weather defense.",
        synergy: "Unstoppable high-heat protection.",
        fragrances: ["Immortal", "Milestone", "Turathi"],
        steps: [
          { f: "Immortal", v: "2 sprays", z: "Neck" },
          { f: "Milestone", v: "1 spray", z: "Chest" },
          { f: "Turathi", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 33,
        name: "Executive Creed Tribute",
        icon: "🎯",
        rating: 4.5,
        season: "Spring",
        time: "Day",
        occasion: "Office",
        profile: "[3-LAYER] Green violet leaf, pineapple, salt-air.",
        synergy: "Classic masterful balance achieved.",
        fragrances: ["Immortal", "Divin Asylum", "Milestone"],
        steps: [
          { f: "Immortal", v: "1 spray", z: "Neck" },
          { f: "Divin Asylum", v: "1 spray", z: "Chest" },
          { f: "Milestone", v: "1 spray", z: "Wrists" }
        ]
      },
      {
        id: 34,
        name: "Sovereign Niche Overlord",
        icon: "🌟",
        rating: 5.0,
        season: "Winter",
        time: "Night",
        occasion: "Formal",
        profile: "[4-LAYER] Ultimate niche symphony of leather, tea, vetiver, vanilla.",
        synergy: "The ultimate fragrance composition.",
        fragrances: ["Encre Noire", "Liam Grey", "Heaven", "Ghost"],
        steps: [
          { f: "Encre Noire", v: "1 spray", z: "Neck" },
          { f: "Liam Grey", v: "1 spray", z: "Chest" },
          { f: "Heaven", v: "1 spray", z: "Wrists" },
          { f: "Ghost", v: "1 spray", z: "Behind ears" }
        ]
      },
      {
        id: 35,
        name: "High-Heat Overlord",
        icon: "🔥",
        rating: 5.0,
        season: "Summer",
        time: "Day",
        occasion: "Casual",
        profile: "[4-LAYER] Blockbuster summer shield of ambroxan, spice, marine salt, ginger.",
        synergy: "Maximum performance guarantee.",
        fragrances: ["Immortal", "Turathi", "Milestone", "SNOI"],
        steps: [
          { f: "Immortal", v: "2 sprays", z: "Neck" },
          { f: "Turathi", v: "1 spray", z: "Chest" },
          { f: "Milestone", v: "1 spray", z: "Wrists" },
          { f: "SNOI", v: "1 spray", z: "Behind ears" }
        ]
      }
    ];

    this.seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    this.times = ['Day', 'Night', 'All'];
    this.databaseLoaded = true;
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  applyFilters() {
    let filtered = this.database;

    // If a fragrance name is selected, clear other filters and show matching blends
    if (this.selectedFragranceName) {
      filtered = filtered.filter(item =>
        item.fragrances.includes(this.selectedFragranceName)
      );
    } else {
      // Apply season filter only if no fragrance name is selected
      if (this.selectedSeason) {
        filtered = filtered.filter(item =>
          item.season === this.selectedSeason || item.season === 'All Seasons'
        );
      }

      // Apply time filter only if no fragrance name is selected
      if (this.selectedTime && this.selectedTime !== 'All') {
        filtered = filtered.filter(item =>
          item.time === this.selectedTime || item.time === 'All'
        );
      }
    }

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.profile.toLowerCase().includes(query) ||
        item.fragrances.some(f => f.toLowerCase().includes(query))
      );
    }

    this.filteredItems = filtered;

    // Switch to list view if filters are active
    if ((this.searchQuery.trim() || this.selectedFragranceName) && this.currentView === 'dashboard') {
      this.currentView = 'list';
    }
  }

  updated(changedProperties) {
    // Re-apply filters whenever properties change
    if (changedProperties.has('selectedSeason') || 
        changedProperties.has('selectedTime') || 
        changedProperties.has('selectedFragranceName') ||
        changedProperties.has('searchQuery')) {
      this.applyFilters();
    }
  }

  handleSearchInput(e) {
    this.searchQuery = e.target.value;
  }

  toggleSeasonFilter(season) {
    this.selectedSeason = this.selectedSeason === season ? null : season;
  }

  toggleTimeFilter(time) {
    this.selectedTime = this.selectedTime === time ? null : time;
  }

  handleFragranceNameClick(fragranceName) {
    // Clicking a fragrance name clears other filters and sets this as the only filter
    this.selectedSeason = null;
    this.selectedTime = null;
    this.selectedFragranceName = this.selectedFragranceName === fragranceName ? null : fragranceName;
  }

  handleFragranceSelect(fragrance) {
    this.selectedFragrance = fragrance;
    this.currentView = 'detail';
  }

  handleBack() {
    if (this.currentView === 'detail') {
      this.currentView = this.searchQuery.trim() || this.selectedFragranceName ? 'list' : 'dashboard';
    } else if (this.currentView === 'list') {
      this.currentView = 'dashboard';
      this.searchQuery = '';
      this.selectedFragranceName = null;
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedFragranceName = null;
    this.selectedSeason = null;
    this.selectedTime = null;
    this.currentView = 'dashboard';
  }

  getSeasonIcon(season) {
    const icons = {
      'Spring': '🌸',
      'Summer': '☀️',
      'Autumn': '🍂',
      'Winter': '❄️'
    };
    return icons[season] || '📅';
  }

  getTimeIcon(time) {
    const icons = {
      'Day': '☀️',
      'Night': '🌙',
      'All': '⏰'
    };
    return icons[time] || '⏰';
  }

  getOccasionIcon(occasion) {
    const icons = {
      'Casual': '👕',
      'Office': '💼',
      'Formal': '🎩',
      'Evening': '🌃'
    };
    return icons[occasion] || '✨';
  }

  renderDashboard() {
    if (!this.databaseLoaded) {
      return html`
        <div class="content-area">
          <div class="loading-message">
            <div style="font-size: 24px; margin-bottom: 16px;">⏳</div>
            <div>Loading fragrance database...</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="content-area">
        <div class="dashboard-section">
          <div class="dashboard-label">
            <span>📅</span> Season
          </div>
          <div class="dashboard-grid">
            ${this.seasons.map(season =>
              html`
                <button
                  class="filter-btn ${this.selectedSeason === season ? 'active' : ''}"
                  @click="${() => this.toggleSeasonFilter(season)}"
                >
                  <span class="filter-icon">${this.getSeasonIcon(season)}</span>
                  <span>${season}</span>
                </button>
              `
            )}
          </div>
        </div>

        <div class="dashboard-section">
          <div class="dashboard-label">
            <span>⏰</span> Time of Day
          </div>
          <div class="dashboard-grid">
            ${this.times.map(time =>
              html`
                <button
                  class="filter-btn ${this.selectedTime === time ? 'active' : ''}"
                  @click="${() => this.toggleTimeFilter(time)}"
                >
                  <span class="filter-icon">${this.getTimeIcon(time)}</span>
                  <span>${time}</span>
                </button>
              `
            )}
          </div>
        </div>

        <div class="dashboard-section">
          <div class="dashboard-label">
            <span>✨</span> Featured Blends (${this.database.length})
          </div>
          <div class="fragrance-list">
            ${this.database.slice(0, 5).map(item =>
              html`
                <div class="fragrance-item" @click="${() => this.handleFragranceSelect(item)}">
                  <div class="fragrance-item-left">
                    <div class="fragrance-header">
                      <span class="fragrance-icon">${item.icon}</span>
                      <span class="fragrance-name">${item.name}</span>
                    </div>
                    <div class="fragrance-meta">
                      <span class="meta-tag">${this.getSeasonIcon(item.season)} ${item.season}</span>
                      <span class="meta-tag">${this.getTimeIcon(item.time)} ${item.time}</span>
                    </div>
                  </div>
                  <div class="rating">★ ${item.rating}</div>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  renderList() {
    if (this.filteredItems.length === 0) {
      return html`
        <div class="content-area">
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <div style="font-size: 16px; font-weight: 600;">No fragrances found</div>
            <div style="margin-top: 8px; font-size: 13px;">Try adjusting your filters</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="content-area">
        <div class="fragrance-list">
          ${this.filteredItems.map(item =>
            html`
              <div class="fragrance-item" @click="${() => this.handleFragranceSelect(item)}">
                <div class="fragrance-item-left">
                  <div class="fragrance-header">
                    <span class="fragrance-icon">${item.icon}</span>
                    <span class="fragrance-name" @click="${(e) => { e.stopPropagation(); this.handleFragranceNameClick(item.name); }}">${item.name}</span>
                  </div>
                  <div class="fragrance-meta">
                    <span class="meta-tag">${this.getSeasonIcon(item.season)} ${item.season}</span>
                    <span class="meta-tag">${this.getTimeIcon(item.time)} ${item.time}</span>
                    <span class="meta-tag">${this.getOccasionIcon(item.occasion)} ${item.occasion}</span>
                  </div>
                </div>
                <div class="rating">★ ${item.rating}</div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  renderDetail() {
    if (!this.selectedFragrance) return html``;

    const frag = this.selectedFragrance;

    return html`
      <div class="content-area">
        <div class="detail-header">
          <div class="detail-title-section">
            <div class="detail-icon">${frag.icon}</div>
            <div class="detail-title">${frag.name}</div>
          </div>
          <div class="detail-rating">★ ${frag.rating}</div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Profile</div>
          <div class="profile-box">${frag.profile}</div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Synergy Notes</div>
          <div class="synergy-box">${frag.synergy}</div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Core Fragrances</div>
          <div class="fragrances-grid">
            ${frag.fragrances.map(f =>
              html`
                <span
                  class="fragrance-tag ${this.selectedFragranceName === f ? 'selected' : ''}"
                  @click="${() => this.handleFragranceNameClick(f)}"
                >
                  ${f}
                </span>
              `
            )}
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-label">Application Sequence</div>
          <div class="steps-timeline">
            ${frag.steps.map((step, idx) =>
              html`
                <div class="step-node">
                  <div class="step-circle">${idx + 1}</div>
                  <div class="step-content">
                    <div class="step-fragrance">${step.f}</div>
                    <div class="step-details">
                      <span><strong>Amount:</strong> ${step.v}</span>
                      <span><strong>Location:</strong> ${step.z}</span>
                    </div>
                  </div>
                </div>
              `
            )}
          </div>
        </div>

        <div style="height: 20px;"></div>
      </div>
    `;
  }

  renderContent() {
    switch (this.currentView) {
      case 'dashboard':
        return this.renderDashboard();
      case 'list':
        return this.renderList();
      case 'detail':
        return this.renderDetail();
      default:
        return this.renderDashboard();
    }
  }

  renderBottomNav() {
    let navText = '';
    let showBack = false;

    if (this.currentView === 'detail') {
      navText = `${this.selectedFragrance?.name || 'Detail View'}`;
      showBack = true;
    } else if (this.currentView === 'list') {
      navText = `${this.filteredItems.length} blend${this.filteredItems.length !== 1 ? 's' : ''} found`;
      showBack = true;
    } else {
      navText = `${this.database.length} total blends available`;
    }

    return html`
      <div class="bottom-nav">
        <div class="nav-info">${navText}</div>
        <div class="nav-buttons">
          ${(this.searchQuery.trim() || this.selectedFragranceName || this.selectedSeason || this.selectedTime) ? html`
            <button class="clear-btn" @click="${() => this.clearFilters()}">Clear All</button>
          ` : ''}
          ${showBack ? html`
            <button class="nav-btn" @click="${() => this.handleBack()}">← Back</button>
          ` : ''}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <ha-card>
        <div class="card-wrapper">
          <div class="search-container">
            <input
              type="text"
              class="search-input"
              placeholder="🔍 Search fragrances, profiles, or ingredients..."
              .value="${this.searchQuery}"
              @input="${(e) => this.handleSearchInput(e)}"
            />
          </div>

          ${this.renderContent()}

          ${this.renderBottomNav()}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('fragrance-explorer-card', FragranceExplorerCard);
