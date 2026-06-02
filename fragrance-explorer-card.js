import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class FragranceExplorerCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      currentView: { type: String },
      searchQuery: { type: String },
      selectedSeason: { type: String },
      selectedTime: { type: String },
      selectedFragranceName: { type: String },
      selectedFragrance: { type: Object },
      filteredItems: { type: Array },
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
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 50px;
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
        font-size: 16px;
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
        font-size: 20px;
      }

      .fragrance-name {
        font-weight: 700;
        color: var(--accent-color);
        font-size: 14px;
        cursor: pointer;
        text-decoration: underline;
        transition: all 0.2s ease;
      }

      .fragrance-name:hover {
        color: #ff9a9f;
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
        padding: 3px 8px;
        border-radius: 4px;
        border-left: 2px solid var(--accent-color);
        font-weight: 500;
      }

      .rating {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--accent-color);
        color: #000;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 12px;
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
        font-size: 32px;
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
        padding: 6px 12px;
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
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
        font-weight: 600;
        text-align: center;
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
        padding: 6px 12px;
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
          padding: 10px 12px;
          min-height: 45px;
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

    this.database = [
      { id: 1, name: "High-Heat Shield", rating: 4.5, season: "Summer", time: "Day", occasion: "Casual", profile: "Sparkling ginger-citrus.", synergy: "Perfect interlocking of blue ambroxan and sharp citrus.", fragrances: ["Turathi Blue", "Jean Lowe Immortal"], steps: [{ f: "Turathi Blue", v: "2 sprays", z: "Skin / Neck" }, { f: "Jean Lowe Immortal", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 2, name: "Ultimate Luxury Blue", rating: 5.0, season: "All Seasons", time: "All", occasion: "Formal", profile: "Deep amber powdery blue.", synergy: "Caprice's cardamom softens the sharp edges of Turathi.", fragrances: ["Al Nashama Caprice", "Turathi Blue"], steps: [{ f: "Al Nashama Caprice", v: "2 sprays", z: "Skin / Chest" }, { f: "Turathi Blue", v: "2 sprays", z: "Clothes / Shoulders" }] },
      { id: 3, name: "Ginger Elysium", rating: 4.5, season: "Summer", time: "Day", occasion: "Casual", profile: "High-end effervescent lime/ginger.", synergy: "Immortal boosts the bright, sparkling opening of Divin Asylum.", fragrances: ["Jean Lowe Immortal", "Divin Asylum"], steps: [{ f: "Jean Lowe Immortal", v: "2 sprays", z: "Skin / Neck" }, { f: "Divin Asylum", v: "2 sprays", z: "Clothes / Collar" }] },
      { id: 4, name: "Alpine Ocean Breeze", rating: 4.0, season: "Summer", time: "Day", occasion: "Casual", profile: "Metallic marine sea-salt air.", synergy: "Milestone adds crisp marine salt to the green tea of Heaven.", fragrances: ["Supremacy in Heaven", "CDNI Milestone"], steps: [{ f: "Supremacy in Heaven", v: "2 sprays", z: "Skin / Chest" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 5, name: "Modernized Emerald Vetiver", rating: 4.0, season: "Spring", time: "Day", occasion: "Office", profile: "Sharp retro-modern green.", synergy: "Immortal updates the heavy, dark oud-vetiver base of Ash'aa.", fragrances: ["Ash'aa Oud Noir", "Jean Lowe Immortal"], steps: [{ f: "Ash'aa Oud Noir", v: "2 sprays", z: "Skin / Neck" }, { f: "Jean Lowe Immortal", v: "2 sprays", z: "Clothes / Shoulders" }] },
      { id: 6, name: "Inky Citrus Bomb", rating: 4.0, season: "Autumn", time: "Day", occasion: "Casual", profile: "Earthy dark grapefruit.", synergy: "Turathi's bright grapefruit cuts through the damp ink of Encre Noire.", fragrances: ["Encre Noire l'Extreme", "Turathi Blue"], steps: [{ f: "Encre Noire l'Extreme", v: "1 spray", z: "Skin / Chest" }, { f: "Turathi Blue", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 7, name: "Coastal Countryside", rating: 4.0, season: "Spring", time: "Day", occasion: "Casual", profile: "Salty crisp ozonic green.", synergy: "Milestone adds a bright oceanic breeze to the dark green landscape.", fragrances: ["Ash'aa Oud Noir", "CDNI Milestone"], steps: [{ f: "Ash'aa Oud Noir", v: "2 sprays", z: "Skin / Neck" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Jacket" }] },
      { id: 8, name: "Professional Comfort", rating: 4.5, season: "Autumn", time: "Day", occasion: "Office", profile: "Creamy fig and sharp vetiver.", synergy: "Liam Grey's milky tea accord perfectly balances Divin Asylum's crispness.", fragrances: ["Lattafa Liam Grey", "Divin Asylum"], steps: [{ f: "Lattafa Liam Grey", v: "2 sprays", z: "Skin / Neck" }, { f: "Divin Asylum", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 9, name: "Executive Fresh", rating: 4.5, season: "Spring", time: "Day", occasion: "Office", profile: "Elite fresh-cut grass and lime.", synergy: "A highly clean, professional aura with a hint of dark wood depth.", fragrances: ["Ash'aa Oud Noir", "Divin Asylum"], steps: [{ f: "Ash'aa Oud Noir", v: "2 sprays", z: "Skin / Chest" }, { f: "Divin Asylum", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 10, name: "Upscale Ginger Cream-Soda", rating: 5.0, season: "Autumn", time: "All", occasion: "Evening", profile: "Sparkling gourmand vanilla.", synergy: "Ghost's rich vanilla gourmand structure is uplifted by Immortal's ginger.", fragrances: ["Spectre Ghost", "Jean Lowe Immortal"], steps: [{ f: "Spectre Ghost", v: "2 sprays", z: "Skin / Neck" }, { f: "Jean Lowe Immortal", v: "3 sprays", z: "Clothes / Sweater" }] },
      { id: 11, name: "Emperor's Tea Accord", rating: 4.5, season: "Spring", time: "Day", occasion: "Office", profile: "Luxury green and black tea lounge.", synergy: "Liam Grey adds a dense black tea and fig richness to Heaven's silver mountain air.", fragrances: ["Supremacy in Heaven", "Lattafa Liam Grey"], steps: [{ f: "Supremacy in Heaven", v: "2 sprays", z: "Skin / Chest" }, { f: "Lattafa Liam Grey", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 12, name: "Luxury Cashmere", rating: 5.0, season: "Winter", time: "All", occasion: "Formal", profile: "Niche woody shield.", synergy: "Encre Noire adds an earthy framework to the soft, powdery tea of Liam Grey.", fragrances: ["Encre Noire l'Extreme", "Lattafa Liam Grey"], steps: [{ f: "Encre Noire l'Extreme", v: "1 spray", z: "Skin / Chest" }, { f: "Lattafa Liam Grey", v: "3 sprays", z: "Clothes / Sweater" }] },
      { id: 13, name: "Seductive Pineapple", rating: 4.5, season: "Spring", time: "Night", occasion: "Evening", profile: "Romantic fruity pineapple spice.", synergy: "Caprice introduces a sensual cardamom cloud over the bright pineapple base.", fragrances: ["Supremacy Collector's", "Al Nashama Caprice"], steps: [{ f: "Supremacy Collector's", v: "2 sprays", z: "Skin / Neck" }, { f: "Al Nashama Caprice", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 14, name: "Bad Boy in a Clean Suit", rating: 5.0, season: "Winter", time: "Night", occasion: "Evening", profile: "Rugged leather and clean powder.", synergy: "The masculine spice of Costume National I meets the clean powder of Caprice.", fragrances: ["Costume National I", "Al Nashama Caprice"], steps: [{ f: "Costume National I", v: "2 sprays", z: "Skin / Neck" }, { f: "Al Nashama Caprice", v: "3 sprays", z: "Clothes / Jacket" }] },
      { id: 15, name: "Freezing Powerhouse", rating: 5.0, season: "Winter", time: "Night", occasion: "Formal", profile: "Smoky spicy tobacco vanilla.", synergy: "Hercules provides a heavy tobacco base that anchors the airy vanilla of Ghost.", fragrances: ["Maison Alhambra Hercules", "Spectre Ghost"], steps: [{ f: "Maison Alhambra Hercules", v: "2 sprays", z: "Skin / Chest" }, { f: "Spectre Ghost", v: "2 sprays", z: "Clothes / Heavy Coat" }] },
      { id: 16, name: "Spiced Chai & Tobacco", rating: 4.5, season: "Autumn", time: "All", occasion: "Casual", profile: "Ultra-cozy spiced gourmand.", synergy: "Hercules injects a warm cinnamon tobacco note into Liam Grey's fig-milk tea.", fragrances: ["Maison Alhambra Hercules", "Lattafa Liam Grey"], steps: [{ f: "Maison Alhambra Hercules", v: "2 sprays", z: "Skin / Neck" }, { f: "Lattafa Liam Grey", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 17, name: "Smoked Pineapple Leather", rating: 4.5, season: "Winter", time: "Night", occasion: "Evening", profile: "Alpha dark fruit and leather.", synergy: "SNOI's intense smoky performance perfectly overlays the rich saffron of National I.", fragrances: ["Costume National I", "SNOI"], steps: [{ f: "Costume National I", v: "2 sprays", z: "Skin / Chest" }, { f: "SNOI", v: "2 sprays", z: "Clothes / Leather Jacket" }] },
      { id: 18, name: "Seductive Vanilla Leather", rating: 5.0, season: "Winter", time: "Night", occasion: "Evening", profile: "Sweet rugged luxury leather.", synergy: "The spicy, structural amber of National I is sweetened beautifully by Spectre Ghost.", fragrances: ["Costume National I", "Spectre Ghost"], steps: [{ f: "Costume National I", v: "2 sprays", z: "Skin / Neck" }, { f: "Spectre Ghost", v: "2 sprays", z: "Clothes / Coat" }] },
      { id: 19, name: "Spiced Vanilla Tobacco", rating: 4.5, season: "Autumn", time: "Night", occasion: "Evening", profile: "Powdery warm tobacco lavender.", synergy: "Caprice introduces a clean clean lavender note directly to Hercules' dark tobacco.", fragrances: ["Maison Alhambra Hercules", "Al Nashama Caprice"], steps: [{ f: "Maison Alhambra Hercules", v: "2 sprays", z: "Skin / Chest" }, { f: "Al Nashama Caprice", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 20, name: "Salty Watermelon Tobacco", rating: 4.0, season: "Autumn", time: "Day", occasion: "Casual", profile: "Experimental sweet-salty ozonic tobacco.", synergy: "Milestone's ocean salt completely transforms the heavy sweet tobacco notes.", fragrances: ["Maison Alhambra Hercules", "CDNI Milestone"], steps: [{ f: "Maison Alhambra Hercules", v: "2 sprays", z: "Skin / Neck" }, { f: "CDNI Milestone", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 21, name: "Imperial Saffron Blue", rating: 4.5, season: "Autumn", time: "All", occasion: "Evening", profile: "Exotic leathery blue amber.", synergy: "National I creates an elite amber base that anchors Turathi's projecting blue notes.", fragrances: ["Costume National I", "Turathi Blue"], steps: [{ f: "Costume National I", v: "2 sprays", z: "Skin / Chest" }, { f: "Turathi Blue", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 22, name: "Midnight Metallic Ocean", rating: 4.0, season: "Summer", time: "Night", occasion: "Casual", profile: "Dark fruity metallic marine.", synergy: "Milestone adds crisp ozonic sea air to the heavy oakmoss/pineapple of SNOI.", fragrances: ["SNOI", "CDNI Milestone"], steps: [{ f: "SNOI", v: "2 sprays", z: "Skin / Neck" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Shoulders" }] },
      { id: 23, name: "Creamy Alpine Woods", rating: 4.0, season: "Spring", time: "Day", occasion: "Office", profile: "Green tea smoothed by milky fig.", synergy: "Heaven's sharp ink/tea edges are completely smoothed out by Liam Grey.", fragrances: ["Supremacy in Heaven", "Lattafa Liam Grey"], steps: [{ f: "Supremacy in Heaven", v: "2 sprays", z: "Skin / Chest" }, { f: "Lattafa Liam Grey", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 24, name: "Smoky Mountain Vetiver", rating: 4.0, season: "Autumn", time: "Day", occasion: "Office", profile: "Dark ink vetiver meeting clean tea.", synergy: "Heaven provides a clean, metallic airiness that ventilates the dark Encre Noire core.", fragrances: ["Encre Noire l'Extreme", "Supremacy in Heaven"], steps: [{ f: "Encre Noire l'Extreme", v: "1 spray", z: "Skin / Neck" }, { f: "Supremacy in Heaven", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 25, name: "Absolute Universal King", rating: 5.0, season: "All Seasons", time: "All", occasion: "Casual", profile: "Crowdspleasing fresh cardamom blue.", synergy: "Flawless interweaving of clean corporate lavender and high-projection ambroxan.", fragrances: ["Al Nashama Caprice", "Turathi Blue"], steps: [{ f: "Al Nashama Caprice", v: "2 sprays", z: "Skin / Neck" }, { f: "Turathi Blue", v: "3 sprays", z: "Clothes / Clothes" }] },
      { id: 26, name: "Aromatic Ink & Leather", rating: 4.5, season: "Winter", time: "Night", occasion: "Formal", profile: "Intense ultra-masculine dark niche wood.", synergy: "Pure dark art. Earthy cypress and heavy incense clashing with spiced saffron leather.", fragrances: ["Encre Noire l'Extreme", "Costume National I"], steps: [{ f: "Encre Noire l'Extreme", v: "1 spray", z: "Skin / Chest" }, { f: "Costume National I", v: "2 sprays", z: "Clothes / Jacket" }] },
      { id: 27, name: "Citrus Saffron Spark", rating: 4.0, season: "Autumn", time: "Day", occasion: "Office", profile: "Leathery zesty ginger.", synergy: "Immortal's ginger top note introduces a bright opening to the dry leather base.", fragrances: ["Costume National I", "Jean Lowe Immortal"], steps: [{ f: "Costume National I", v: "2 sprays", z: "Skin / Neck" }, { f: "Jean Lowe Immortal", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 28, name: "Golden Pineapple Breeze", rating: 4.5, season: "Summer", time: "Day", occasion: "Casual", profile: "Premium sharp tropical pineapple.", synergy: "Divin Asylum supercharges the fruity traits of the collector's edition.", fragrances: ["Supremacy Collector's", "Divin Asylum"], steps: [{ f: "Supremacy Collector's", v: "2 sprays", z: "Skin / Chest" }, { f: "Divin Asylum", v: "3 sprays", z: "Clothes / Shirt" }] },
      { id: 29, name: "Emperor's Sovereign", rating: 5.0, season: "Spring", time: "All", occasion: "Formal", profile: "[3-LAYER] Deep multi-dimensional smoky pineapple.", synergy: "SNOI anchors the bottom while Divin Asylum adds high-end niche sparkle to the top.", fragrances: ["SNOI", "Supremacy Collector's", "Divin Asylum"], steps: [{ f: "SNOI", v: "1 spray", z: "Skin / Chest" }, { f: "Supremacy Collector's", v: "2 sprays", z: "Skin / Neck" }, { f: "Divin Asylum", v: "2 sprays", z: "Clothes / Shoulders" }] },
      { id: 30, name: "Gothic Vanilla Incense", rating: 4.5, season: "Winter", time: "Night", occasion: "Formal", profile: "[3-LAYER] Mysterious dark woody vanilla.", synergy: "Encre Noire adds an inky darkness to Hercules' tobacco and Ghost's rich vanilla.", fragrances: ["Encre Noire l'Extreme", "Maison Alhambra Hercules", "Spectre Ghost"], steps: [{ f: "Encre Noire l'Extreme", v: "1 spray", z: "Skin / Chest" }, { f: "Maison Alhambra Hercules", v: "2 sprays", z: "Skin / Neck" }, { f: "Spectre Ghost", v: "2 sprays", z: "Clothes / Coat" }] },
      { id: 31, name: "Royal Cardamom Sea", rating: 4.5, season: "Summer", time: "All", occasion: "Office", profile: "[3-LAYER] Advanced aquatic-spicy fusion.", synergy: "Turathi provides deep blue weight, Caprice adds spicy mid-tier fluff, Milestone freshens the top.", fragrances: ["Turathi Blue", "Al Nashama Caprice", "CDNI Milestone"], steps: [{ f: "Turathi Blue", v: "2 sprays", z: "Skin / Neck" }, { f: "Al Nashama Caprice", v: "1 spray", z: "Skin / Chest" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Collar" }] },
      { id: 32, name: "Ultimate Zesty Aquatic", rating: 4.5, season: "Summer", time: "Day", occasion: "Casual", profile: "[3-LAYER] Extreme hot weather defense.", synergy: "Unstoppable high-heat projection matrix using triple citrus-ambroxan layers.", fragrances: ["Turathi Blue", "CDNI Milestone", "Jean Lowe Immortal"], steps: [{ f: "Turathi Blue", v: "2 sprays", z: "Skin / Neck" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Chest" }, { f: "Jean Lowe Immortal", v: "2 sprays", z: "Clothes / Shoulders" }] },
      { id: 33, name: "Executive Creed Tribute", rating: 4.5, season: "Spring", time: "Day", occasion: "Office", profile: "[3-LAYER] Green violet leaf, pineapple, salt-air.", synergy: "Classic masculine contours enhanced by modern oceanics and direct fruit sweetness.", fragrances: ["Ash'aa Oud Noir", "Supremacy Collector's", "CDNI Milestone"], steps: [{ f: "Ash'aa Oud Noir", v: "2 sprays", z: "Skin / Neck" }, { f: "Supremacy Collector's", v: "1 spray", z: "Skin / Chest" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Shirt" }] },
      { id: 34, name: "Sovereign Niche Overlord", rating: 5.0, season: "Winter", time: "Night", occasion: "Formal", profile: "[4-LAYER] Ultimate niche symphony of leather, tea, vetiver, vanilla.", synergy: "Masterclass arrangement. Heavy, dense base elements shifting smoothly into sweet and powdery layers over time.", fragrances: ["Encre Noire l'Extreme", "Costume National I", "Lattafa Liam Grey", "Spectre Ghost"], steps: [{ f: "Encre Noire l'Extreme", v: "1 spray", z: "Skin / Lower Back" }, { f: "Costume National I", v: "2 sprays", z: "Skin / Chest" }, { f: "Lattafa Liam Grey", v: "2 sprays", z: "Skin / Neck" }, { f: "Spectre Ghost", v: "2 sprays", z: "Clothes / Coat" }] },
      { id: 35, name: "High-Heat Overlord", rating: 5.0, season: "Summer", time: "Day", occasion: "Casual", profile: "[4-LAYER] Blockbuster summer shield of ambroxan, spice, marine salt, ginger.", synergy: "Absolute armor against sweat. Designed to sequentially boil off over an 8-hour period.", fragrances: ["Turathi Blue", "Al Nashama Caprice", "CDNI Milestone", "Jean Lowe Immortal"], steps: [{ f: "Turathi Blue", v: "2 sprays", z: "Skin / Neck" }, { f: "Al Nashama Caprice", v: "1 spray", z: "Skin / Chest" }, { f: "CDNI Milestone", v: "2 sprays", z: "Clothes / Left Shoulder" }, { f: "Jean Lowe Immortal", v: "2 sprays", z: "Clothes / Right Shoulder" }] }
    ];

    this.seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    this.times = ['Day', 'Night'];
    this.applyFilters();
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

    if (this.selectedSeason) {
      filtered = filtered.filter(item => 
        item.season === this.selectedSeason || item.season === 'All Seasons'
      );
    }

    if (this.selectedTime && this.selectedTime !== 'All') {
      filtered = filtered.filter(item =>
        item.time === this.selectedTime || item.time === 'All'
      );
    }

    if (this.selectedFragranceName) {
      filtered = filtered.filter(item =>
        item.fragrances.includes(this.selectedFragranceName)
      );
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.profile.toLowerCase().includes(query) ||
        item.fragrances.some(f => f.toLowerCase().includes(query))
      );
    }

    this.filteredItems = filtered;

    if ((this.searchQuery.trim() || this.selectedFragranceName) && this.currentView === 'dashboard') {
      this.currentView = 'list';
    }
  }

  handleSearchInput(e) {
    this.searchQuery = e.target.value;
    this.applyFilters();
  }

  toggleSeasonFilter(season) {
    this.selectedSeason = this.selectedSeason === season ? null : season;
    this.applyFilters();
  }

  toggleTimeFilter(time) {
    this.selectedTime = this.selectedTime === time ? null : time;
    this.applyFilters();
  }

  handleFragranceNameClick(fragranceName) {
    this.selectedFragranceName = this.selectedFragranceName === fragranceName ? null : fragranceName;
    this.applyFilters();
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
      this.applyFilters();
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedFragranceName = null;
    this.currentView = 'dashboard';
    this.applyFilters();
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
    return time === 'Day' ? '☀️' : '🌙';
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
                    <span class="fragrance-icon">✨</span>
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
            <div class="detail-icon">✨</div>
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
                  class="fragrance-tag" 
                  @click="${() => this.handleFragranceNameClick(f)}"
                  style="cursor: pointer; transition: all 0.2s; text-decoration: ${this.selectedFragranceName === f ? 'underline' : 'none'};"
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
      navText = `${this.filteredItems.length} blend${this.filteredItems.length !== 1 ? 's' : ''}`;
      showBack = true;
    } else {
      navText = `${this.database.length} total blends`;
    }

    return html`
      <div class="bottom-nav">
        <div class="nav-info">${navText}</div>
        <div class="nav-buttons">
          ${(this.searchQuery.trim() || this.selectedFragranceName) ? html`
            <button class="clear-btn" @click="${() => this.clearFilters()}">Clear</button>
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
