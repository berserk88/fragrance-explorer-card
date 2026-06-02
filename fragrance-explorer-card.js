import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class FragranceExplorerCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      currentView: { type: String },
      searchQuery: { type: String },
      selectedSeason: { type: String },
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
        background: var(--sidebar-background-color);
        flex-shrink: 0;
      }

      .search-input {
        width: 100%;
        padding: 10px 12px;
        background: var(--ha-card-background);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;
        box-sizing: border-box;
        font-family: inherit;
      }

      .search-input:focus {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
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

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
      }

      .filter-btn {
        padding: 12px 16px;
        background: var(--sidebar-background-color);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 13px;
        transition: all 0.3s ease;
        font-family: inherit;
      }

      .filter-btn:hover {
        border-color: var(--accent-color);
        transform: translateY(-2px);
      }

      .filter-btn.active {
        background: var(--accent-color);
        border-color: var(--accent-color);
        color: #000;
      }

      .fragrance-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .fragrance-item {
        padding: 12px;
        background: var(--sidebar-background-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .fragrance-item:hover {
        background: var(--ha-card-background);
        border-color: var(--accent-color);
        transform: translateX(4px);
      }

      .fragrance-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }

      .fragrance-name {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 14px;
      }

      .rating {
        display: inline-block;
        background: var(--accent-color);
        color: #000;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 12px;
      }

      .fragrance-meta {
        display: flex;
        gap: 8px;
        font-size: 12px;
        color: var(--text-secondary);
        flex-wrap: wrap;
      }

      .meta-tag {
        background: rgba(255, 107, 107, 0.1);
        padding: 2px 6px;
        border-radius: 3px;
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 12px;
      }

      .detail-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .detail-rating {
        background: var(--accent-color);
        color: #000;
        padding: 4px 12px;
        border-radius: 6px;
        font-weight: bold;
      }

      .detail-section {
        margin-bottom: 20px;
      }

      .detail-label {
        font-weight: 600;
        color: var(--accent-color);
        font-size: 12px;
        text-transform: uppercase;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }

      .detail-text {
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.6;
      }

      .profile-box {
        background: rgba(255, 107, 107, 0.05);
        padding: 12px;
        border-radius: 6px;
        border-left: 3px solid var(--accent-color);
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.5;
      }

      .synergy-box {
        background: rgba(255, 107, 107, 0.05);
        padding: 12px;
        border-radius: 6px;
        border-left: 3px solid var(--accent-color);
        color: var(--text-primary);
        font-size: 14px;
        line-height: 1.5;
      }

      .fragrances-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .fragrance-tag {
        display: inline-block;
        background: var(--sidebar-background-color);
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        width: fit-content;
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
        width: 2px;
        background: var(--border-color);
      }

      .step-node {
        display: flex;
        gap: 16px;
        position: relative;
        margin-left: 0;
      }

      .step-circle {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background: var(--accent-color);
        border: 2px solid var(--sidebar-background-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #000;
        z-index: 1;
        font-size: 16px;
      }

      .step-content {
        flex: 1;
        padding: 12px;
        background: var(--sidebar-background-color);
        border-radius: 6px;
        border: 1px solid var(--border-color);
      }

      .step-fragrance {
        font-weight: 600;
        color: var(--text-primary);
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
        background: var(--sidebar-background-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .nav-info {
        font-size: 13px;
        color: var(--text-secondary);
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
        margin-left: 8px;
        font-family: inherit;
      }

      .nav-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
      }

      .no-results {
        text-align: center;
        padding: 32px 16px;
        color: var(--text-secondary);
      }

      .no-results-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      .clear-btn {
        padding: 4px 8px;
        background: rgba(255, 107, 107, 0.2);
        color: var(--accent-color);
        border: 1px solid var(--accent-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
        margin-right: 8px;
        font-family: inherit;
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
        }

        .detail-header {
          flex-direction: column;
          align-items: flex-start;
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
    this.currentView = 'dashboard';
    this.searchQuery = '';
    this.selectedSeason = 'All Seasons';
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

    this.seasons = ['All Seasons', 'Spring', 'Summer', 'Autumn', 'Winter'];
  }

  setConfig(config) {
    this.config = config;
  }

  applyFilters() {
    let filtered = this.database;

    if (this.selectedSeason && this.selectedSeason !== 'All Seasons') {
      filtered = filtered.filter(item => 
        item.season === this.selectedSeason || item.season === 'All Seasons'
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

    if (this.searchQuery.trim() && this.currentView === 'dashboard') {
      this.currentView = 'list';
    }
  }

  handleSearchInput(e) {
    this.searchQuery = e.target.value;
    this.applyFilters();
  }

  handleSeasonFilter(season) {
    this.selectedSeason = season;
    this.applyFilters();
  }

  handleFragranceSelect(fragrance) {
    this.selectedFragrance = fragrance;
    this.currentView = 'detail';
  }

  handleBack() {
    if (this.currentView === 'detail') {
      this.currentView = this.searchQuery.trim() ? 'list' : 'dashboard';
    } else if (this.currentView === 'list') {
      this.currentView = 'dashboard';
      this.searchQuery = '';
      this.applyFilters();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentView = 'dashboard';
    this.applyFilters();
  }

  renderDashboard() {
    return html`
      <div class="content-area">
        <div style="margin-bottom: 16px;">
          <div class="detail-label">Select Season</div>
        </div>
        <div class="dashboard-grid">
          ${this.seasons.map(season =>
            html`
              <button
                class="filter-btn ${this.selectedSeason === season ? 'active' : ''}"
                @click="${() => this.handleSeasonFilter(season)}"
              >
                ${season}
              </button>
            `
          )}
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
            <div>No fragrances found</div>
            <div style="margin-top: 8px; font-size: 12px;">Try adjusting your search or season filter</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="content-area">
        <div class="fragrance-list">
          ${this.filteredItems.map(item =>
            html`
              <div
                class="fragrance-item"
                @click="${() => this.handleFragranceSelect(item)}"
              >
                <div class="fragrance-header">
                  <div class="fragrance-name">${item.name}</div>
                  <div class="rating">★ ${item.rating}</div>
                </div>
                <div class="fragrance-meta">
                  <span class="meta-tag">${item.season}</span>
                  <span class="meta-tag">${item.time}</span>
                  <span class="meta-tag">${item.occasion}</span>
                </div>
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
          <div class="detail-title">${frag.name}</div>
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
          <div class="fragrances-list">
            ${frag.fragrances.map(f =>
              html`<span class="fragrance-tag">${f}</span>`
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
      navText = `${this.filteredItems.length} fragrance${this.filteredItems.length !== 1 ? 's' : ''} found`;
      showBack = true;
    } else {
      navText = `${this.database.length} blends in database`;
    }

    return html`
      <div class="bottom-nav">
        <div class="nav-info">${navText}</div>
        <div>
          ${this.searchQuery.trim() ? html`
            <button class="clear-btn" @click="${() => this.clearSearch()}">Clear Search</button>
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
              placeholder="Search fragrances, profiles, or ingredients..."
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
