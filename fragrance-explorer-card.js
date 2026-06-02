class FragranceExplorerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.state = {
      currentView: 'dashboard',
      searchQuery: '',
      selectedSeason: '',
      sortAsc: true,
      selectedBlend: null
    };

    // Complete 35-Blend Database
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

    this.initialized = false;
  }

  // Home Assistant configuration handler
  setConfig(config) {
    this.config = config;
  }

  // Handle Home Assistant state engine bindings safely
  set hass(hass) {
    this._hass = hass;
    if (!this.initialized && this.shadowRoot) {
      this.initCard();
    }
  }

  connectedCallback() {
    if (!this.initialized) {
      this.initCard();
    }
  }

  // Render the persistent shell framework EXACTLY once
  initCard() {
    if (!this.shadowRoot) return;
    this.initialized = true;

    this.shadowRoot.innerHTML = `
      <style>
        ha-card { padding: 16px; background: var(--ha-card-background, var(--card-background-color, #1e293b)); color: var(--primary-text-color, #f8fafc); font-family: sans-serif; overflow: hidden; position: relative; min-height: 540px; display: flex; flex-direction: column; box-sizing: border-box; }
        .search-container { margin-bottom: 16px; width: 100%; }
        input[type="text"] { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--divider-color, #334155); background: var(--sidebar-background-color, #0f172a); color: var(--primary-text-color); font-size: 16px; box-sizing: border-box; outline: none; }
        
        .app-view { flex: 1; overflow-y: auto; padding-bottom: 65px; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        .category-card { background: var(--sidebar-background-color, #0f172a); padding: 16px; border-radius: 8px; text-align: center; font-size: 15px; cursor: pointer; border: 1px solid var(--divider-color); font-weight: bold; }
        
        .header-row { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 2px solid var(--divider-color); font-weight: bold; font-size: 14px; background: var(--sidebar-background-color); margin-bottom: 8px; border-radius: 4px; }
        .sort-trigger { cursor: pointer; color: var(--accent-color, #38bdf8); display: flex; align-items: center; gap: 4px; user-select: none; }
        
        .blend-list-item { background: var(--sidebar-background-color, #0f172a); padding: 14px; border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--divider-color); cursor: pointer; }
        .blend-meta { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 8px; color: var(--accent-color, #38bdf8); }
        .single-column-matrix { display: flex; flex-direction: column; gap: 4px; border-left: 2px solid var(--divider-color); padding-left: 10px; margin-top: 6px; }
        
        .relational-link { color: var(--accent-color, #38bdf8); text-decoration: none; font-weight: 500; display: inline-block; cursor: pointer; }
        .relational-link:hover { text-decoration: underline; }
        
        .step-timeline { display: flex; flex-direction: column; gap: 10px; margin: 15px 0; }
        .step-node { background: var(--sidebar-background-color); border: 1px solid var(--divider-color); padding: 12px; border-radius: 8px; border-left: 4px solid var(--accent-color); }
        .step-num { font-weight: bold; font-size: 11px; color: var(--accent-color); text-transform: uppercase; }
        
        .infobox { background: var(--sidebar-background-color); padding: 12px; border-radius: 8px; margin-top: 10px; font-size: 14px; border: 1px solid var(--divider-color); line-height: 1.4; }
        .control-hub { position: absolute; bottom: 0; left: 0; right: 
