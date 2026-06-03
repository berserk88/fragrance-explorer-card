/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 2.0: Faceted Search & Smart Wildcard Filtering
 */

const FRAGRANCE_DATA = [
  { id: 1, name: "High-Heat Shield", rating: 4.5, season: "Summer", time_of_day: "Day", occasion: "Casual", description: "Profile: Sparkling ginger-citrus. Synergy: Perfect interlocking of blue ambroxan and sharp citrus.", tags: ["Turathi Blue", "Jean Lowe Immortal"], steps: "Layer 1: Turathi Blue (2 sprays) - Skin / Neck; Layer 2: Jean Lowe Immortal (3 sprays) - Clothes / Shirt" },
  { id: 2, name: "Ultimate Luxury Blue", rating: 5.0, season: "All Seasons", time_of_day: "All", occasion: "Formal", description: "Profile: Deep amber powdery blue. Synergy: Caprice's cardamom softens the sharp edges of Turathi.", tags: ["Al Nashama Caprice", "Turathi Blue"], steps: "Layer 1: Al Nashama Caprice (2 sprays) - Skin / Chest; Layer 2: Turathi Blue (2 sprays) - Clothes / Shoulders" },
  { id: 3, name: "Ginger Elysium", rating: 4.5, season: "Summer", time_of_day: "Day", occasion: "Casual", description: "Profile: High-end effervescent lime/ginger. Synergy: Immortal boosts the bright, sparkling opening of Divin Asylum.", tags: ["Jean Lowe Immortal", "Divin Asylum"], steps: "Layer 1: Jean Lowe Immortal (2 sprays) - Skin / Neck; Layer 2: Divin Asylum (2 sprays) - Clothes / Collar" },
  { id: 4, name: "Alpine Ocean Breeze", rating: 4.0, season: "Summer", time_of_day: "Day", occasion: "Casual", description: "Profile: Metallic marine sea-salt air. Synergy: Milestone adds crisp marine salt to the green tea of Heaven.", tags: ["Supremacy in Heaven", "CDNI Milestone"], steps: "Layer 1: Supremacy in Heaven (2 sprays) - Skin / Chest; Layer 2: CDNI Milestone (2 sprays) - Clothes / Shirt" },
  { id: 5, name: "Modernized Emerald Vetiver", rating: 4.0, season: "Spring", time_of_day: "Day", occasion: "Office", description: "Profile: Sharp retro-modern green. Synergy: Immortal updates the heavy, dark oud-vetiver base of Ash'aa.", tags: ["Ash'aa Oud Noir", "Jean Lowe Immortal"], steps: "Layer 1: Ash'aa Oud Noir (2 sprays) - Skin / Neck; Layer 2: Jean Lowe Immortal (2 sprays) - Clothes / Shoulders" },
  { id: 6, name: "Inky Citrus Bomb", rating: 4.0, season: "Autumn", time_of_day: "Day", occasion: "Casual", description: "Profile: Earthy dark grapefruit. Synergy: Turathi's bright grapefruit cuts through the damp ink of Encre Noire.", tags: ["Encre Noire l'Extreme", "Turathi Blue"], steps: "Layer 1: Encre Noire l'Extreme (1 spray) - Skin / Chest; Layer 2: Turathi Blue (3 sprays) - Clothes / Shirt" },
  { id: 7, name: "Coastal Countryside", rating: 4.0, season: "Spring", time_of_day: "Day", occasion: "Casual", description: "Profile: Salty crisp ozonic green. Synergy: Milestone adds a bright oceanic breeze to the dark green landscape.", tags: ["Ash'aa Oud Noir", "CDNI Milestone"], steps: "Layer 1: Ash'aa Oud Noir (2 sprays) - Skin / Neck; Layer 2: CDNI Milestone (2 sprays) - Clothes / Jacket" },
  { id: 8, name: "Professional Comfort", rating: 4.5, season: "Autumn", time_of_day: "Day", occasion: "Office", description: "Profile: Creamy fig and sharp vetiver. Synergy: Liam Grey's milky tea accord perfectly balances Divin Asylum's crispness.", tags: ["Lattafa Liam Grey", "Divin Asylum"], steps: "Layer 1: Lattafa Liam Grey (2 sprays) - Skin / Neck; Layer 2: Divin Asylum (2 sprays) - Clothes / Shirt" },
  { id: 9, name: "Executive Fresh", rating: 4.5, season: "Spring", time_of_day: "Day", occasion: "Office", description: "Profile: Elite fresh-cut grass and lime. Synergy: A highly clean, professional aura with a hint of dark wood depth.", tags: ["Ash'aa Oud Noir", "Divin Asylum"], steps: "Layer 1: Ash'aa Oud Noir (2 sprays) - Skin / Chest; Layer 2: Divin Asylum (3 sprays) - Clothes / Shirt" },
  { id: 10, name: "Upscale Ginger Cream-Soda", rating: 5.0, season: "Autumn", time_of_day: "All", occasion: "Evening", description: "Profile: Sparkling gourmand vanilla. Synergy: Ghost's rich vanilla gourmand structure is uplifted by Immortal's ginger.", tags: ["Spectre Ghost", "Jean Lowe Immortal"], steps: "Layer 1: Spectre Ghost (2 sprays) - Skin / Neck; Layer 2: Jean Lowe Immortal (3 sprays) - Clothes / Sweater" },
  { id: 11, name: "Emperor's Tea Accord", rating: 4.5, season: "Spring", time_of_day: "Day", occasion: "Office", description: "Profile: Luxury green and black tea lounge. Synergy: Liam Grey adds a dense black tea and fig richness to Heaven's silver mountain air.", tags: ["Supremacy in Heaven", "Lattafa Liam Grey"], steps: "Layer 1: Supremacy in Heaven (2 sprays) - Skin / Chest; Layer 2: Lattafa Liam Grey (3 sprays) - Clothes / Shirt" },
  { id: 12, name: "Luxury Cashmere", rating: 5.0, season: "Winter", time_of_day: "All", occasion: "Formal", description: "Profile: Niche woody shield. Synergy: Encre Noire adds an earthy framework to the soft, powdery tea of Liam Grey.", tags: ["Encre Noire l'Extreme", "Lattafa Liam Grey"], steps: "Layer 1: Encre Noire l'Extreme (1 spray) - Skin / Chest; Layer 2: Lattafa Liam Grey (3 sprays) - Clothes / Sweater" },
  { id: 13, name: "Seductive Pineapple", rating: 4.5, season: "Spring", time_of_day: "Night", occasion: "Evening", description: "Profile: Romantic fruity pineapple spice. Synergy: Caprice introduces a sensual cardamom cloud over the bright pineapple base.", tags: ["Supremacy Collector's", "Al Nashama Caprice"], steps: "Layer 1: Supremacy Collector's (2 sprays) - Skin / Neck; Layer 2: Al Nashama Caprice (2 sprays) - Clothes / Shirt" },
  { id: 14, name: "Bad Boy in a Clean Suit", rating: 5.0, season: "Winter", time_of_day: "Night", occasion: "Evening", description: "Profile: Rugged leather and clean powder. Synergy: The masculine spice of Costume National I meets the clean powder of Caprice.", tags: ["Costume National I", "Al Nashama Caprice"], steps: "Layer 1: Costume National I (2 sprays) - Skin / Neck; Layer 2: Al Nashama Caprice (3 sprays) - Clothes / Jacket" },
  { id: 15, name: "Freezing Powerhouse", rating: 5.0, season: "Winter", time_of_day: "Night", occasion: "Formal", description: "Profile: Smoky spicy tobacco vanilla. Synergy: Hercules provides a heavy tobacco base that anchors the airy vanilla of Ghost.", tags: ["Maison Alhambra Hercules", "Spectre Ghost"], steps: "Layer 1: Maison Alhambra Hercules (2 sprays) - Skin / Chest; Layer 2: Spectre Ghost (2 sprays) - Clothes / Heavy Coat" },
  { id: 16, name: "Spiced Chai & Tobacco", rating: 4.5, season: "Autumn", time_of_day: "All", occasion: "Casual", description: "Profile: Ultra-cozy spiced gourmand. Synergy: Hercules injects a warm cinnamon tobacco note into Liam Grey's fig-milk tea.", tags: ["Maison Alhambra Hercules", "Lattafa Liam Grey"], steps: "Layer 1: Maison Alhambra Hercules (2 sprays) - Skin / Neck; Layer 2: Lattafa Liam Grey (3 sprays) - Clothes / Shirt" },
  { id: 17, name: "Smoked Pineapple Leather", rating: 4.5, season: "Winter", time_of_day: "Night", occasion: "Evening", description: "Profile: Alpha dark fruit and leather. Synergy: SNOI's intense smoky performance perfectly overlays the rich saffron of National I.", tags: ["Costume National I", "SNOI"], steps: "Layer 1: Costume National I (2 sprays) - Skin / Chest; Layer 2: SNOI (2 sprays) - Clothes / Leather Jacket" },
  { id: 18, name: "Seductive Vanilla Leather", rating: 5.0, season: "Winter", time_of_day: "Night", occasion: "Evening", description: "Profile: Sweet rugged luxury leather. Synergy: The spicy, structural amber of National I is sweetened beautifully by Spectre Ghost.", tags: ["Costume National I", "Spectre Ghost"], steps: "Layer 1: Costume National I (2 sprays) - Skin / Neck; Layer 2: Spectre Ghost (2 sprays) - Coat" },
  { id: 19, name: "Spiced Vanilla Tobacco", rating: 4.5, season: "Autumn", time_of_day: "Night", occasion: "Evening", description: "Profile: Powdery warm tobacco lavender. Synergy: Caprice introduces a clean clean lavender note directly to Hercules' dark tobacco.", tags: ["Maison Alhambra Hercules", "Al Nashama Caprice"], steps: "Layer 1: Maison Alhambra Hercules (2 sprays) - Skin / Chest; Layer 2: Al Nashama Caprice (3 sprays) - Clothes / Shirt" },
  { id: 20, name: "Salty Watermelon Tobacco", rating: 4.0, season: "Autumn", time_of_day: "Day", occasion: "Casual", description: "Profile: Experimental sweet-salty ozonic tobacco. Synergy: Milestone's ocean salt completely transforms the heavy sweet tobacco notes.", tags: ["Maison Alhambra Hercules", "CDNI Milestone"], steps: "Layer 1: Maison Alhambra Hercules (2 sprays) - Skin / Neck; Layer 2: CDNI Milestone (3 sprays) - Clothes / Shirt" },
  { id: 21, name: "Imperial Saffron Blue", rating: 4.5, season: "Autumn", time_of_day: "All", occasion: "Evening", description: "Profile: Exotic leathery blue amber. Synergy: National I creates an elite amber base that anchors Turathi's projecting blue notes.", tags: ["Costume National I", "Turathi Blue"], steps: "Layer 1: Costume National I (2 sprays) - Skin / Chest; Layer 2: Turathi Blue (2 sprays) - Clothes / Shirt" },
  { id: 22, name: "Midnight Metallic Ocean", rating: 4.0, season: "Summer", time_of_day: "Night", occasion: "Casual", description: "Profile: Dark fruity metallic marine. Synergy: Milestone adds crisp ozonic sea air to the heavy oakmoss/pineapple of SNOI.", tags: ["SNOI", "CDNI Milestone"], steps: "Layer 1: SNOI (2 sprays) - Skin / Neck; Layer 2: CDNI Milestone (2 sprays) - Clothes / Shoulders" },
  { id: 23, name: "Creamy Alpine Woods", rating: 4.0, season: "Spring", time_of_day: "Day", occasion: "Office", description: "Profile: Green tea smoothed by milky fig. Synergy: Heaven's sharp ink/tea edges are completely smoothed out by Liam Grey.", tags: ["Supremacy in Heaven", "Lattafa Liam Grey"], steps: "Layer 1: Supremacy in Heaven (2 sprays) - Skin / Chest; Layer 2: Lattafa Liam Grey (2 sprays) - Clothes / Shirt" },
  { id: 24, name: "Smoky Mountain Vetiver", rating: 4.0, season: "Autumn", time_of_day: "Day", occasion: "Office", description: "Profile: Dark ink vetiver meeting clean tea. Synergy: Heaven provides a clean, metallic airiness that ventilates the dark Encre Noire core.", tags: ["Encre Noire l'Extreme", "Supremacy in Heaven"], steps: "Layer 1: Encre Noire l'Extreme (1 spray) - Skin / Neck; Layer 2: Supremacy in Heaven (3 sprays) - Clothes / Shirt" },
  { id: 25, name: "Absolute Universal King", rating: 5.0, season: "All Seasons", time_of_day: "All", occasion: "Casual", description: "Profile: Crowdspleasing fresh cardamom blue. Synergy: Flawless interweaving of clean corporate lavender and high-projection ambroxan.", tags: ["Al Nashama Caprice", "Turathi Blue"], steps: "Layer 1: Al Nashama Caprice (2 sprays) - Skin / Neck; Layer 2: Turathi Blue (3 sprays) - Clothes / Clothes" },
  { id: 26, name: "Aromatic Ink & Leather", rating: 4.5, season: "Winter", time_of_day: "Night", occasion: "Formal", description: "Profile: Intense ultra-masculine dark niche wood. Synergy: Pure dark art. Earthy cypress and heavy incense clashing with spiced saffron leather.", tags: ["Encre Noire l'Extreme", "Costume National I"], steps: "Layer 1: Encre Noire l'Extreme (1 spray) - Skin / Chest; Layer 2: Costume National I (2 sprays) - Clothes / Jacket" },
  { id: 27, name: "Citrus Saffron Spark", rating: 4.0, season: "Autumn", time_of_day: "Day", occasion: "Office", description: "Profile: Leathery zesty ginger. Synergy: Immortal's ginger top note introduces a bright opening to the dry leather base.", tags: ["Costume National I", "Jean Lowe Immortal"], steps: "Layer 1: Costume National I (2 sprays) - Skin / Neck; Layer 2: Jean Lowe Immortal (2 sprays) - Clothes / Shirt" },
  { id: 28, name: "Golden Pineapple Breeze", rating: 4.5, season: "Summer", time_of_day: "Day", occasion: "Casual", description: "Profile: Premium sharp tropical pineapple. Synergy: Divin Asylum supercharges the fruity traits of the collector's edition.", tags: ["Supremacy Collector's", "Divin Asylum"], steps: "Layer 1: Supremacy Collector's (2 sprays) - Skin / Chest; Layer 2: Divin Asylum (3 sprays) - Clothes / Shirt" },
  { id: 29, name: "Emperor's Sovereign", rating: 5.0, season: "Spring", time_of_day: "All", occasion: "Formal", description: "Profile: [3-LAYER] Deep multi-dimensional smoky pineapple. Synergy: SNOI anchors the bottom while Divin Asylum adds high-end niche sparkle to the top.", tags: ["SNOI", "Supremacy Collector's", "Divin Asylum"], steps: "Layer 1: SNOI (1 spray) - Skin / Chest; Layer 2: Supremacy Collector's (2 sprays) - Skin / Neck; Layer 3: Divin Asylum (2 sprays) - Clothes / Shoulders" },
  { id: 30, name: "Gothic Vanilla Incense", rating: 4.5, season: "Winter", time_of_day: "Night", occasion: "Formal", description: "Profile: [3-LAYER] Mysterious dark woody vanilla. Synergy: Encre Noire adds an inky darkness to Hercules' tobacco and Ghost's rich vanilla.", tags: ["Encre Noire l'Extreme", "Maison Alhambra Hercules", "Spectre Ghost"], steps: "Layer 1: Encre Noire l'Extreme (1 spray) - Skin / Chest; Layer 2: Maison Alhambra Hercules (2 sprays) - Skin / Neck; Layer 3: Spectre Ghost (2 sprays) - Clothes / Coat" },
  { id: 31, name: "Royal Cardamom Sea", rating: 4.5, season: "Summer", time_of_day: "All", occasion: "Office", description: "Profile: [3-LAYER] Advanced aquatic-spicy fusion. Synergy: Turathi provides deep blue weight, Caprice adds spicy mid-tier fluff, Milestone freshens the top.", tags: ["Turathi Blue", "Al Nashama Caprice", "CDNI Milestone"], steps: "Layer 1: Turathi Blue (2 sprays) - Skin / Neck; Layer 2: Al Nashama Caprice (1 spray) - Skin / Chest; Layer 3: CDNI Milestone (2 sprays) - Clothes / Collar" },
  { id: 32, name: "Ultimate Zesty Aquatic", rating: 4.5, season: "Summer", time_of_day: "Day", occasion: "Casual", description: "Profile: [3-LAYER] Extreme hot weather defense. Synergy: Unstoppable high-heat projection matrix using triple citrus-ambroxan layers.", tags: ["Turathi Blue", "CDNI Milestone", "Jean Lowe Immortal"], steps: "Layer 1: Turathi Blue (2 sprays) - Skin / Neck; Layer 2: CDNI Milestone (2 sprays) - Skin / Chest; Layer 3: Jean Lowe Immortal (2 sprays) - Clothes / Shoulders" },
  { id: 33, name: "Executive Creed Tribute", rating: 4.5, season: "Spring", time_of_day: "Day", occasion: "Office", description: "Profile: [3-LAYER] Green violet leaf, pineapple, salt-air. Synergy: Classic masculine contours enhanced by modern oceanics and direct fruit sweetness.", tags: ["Ash'aa Oud Noir", "Supremacy Collector's", "CDNI Milestone"], steps: "Layer 1: Ash'aa Oud Noir (2 sprays) - Skin / Neck; Layer 2: Supremacy Collector's (1 spray) - Skin / Chest; Layer 3: CDNI Milestone (2 sprays) - Clothes / Shirt" },
  { id: 34, name: "Sovereign Niche Overlord", rating: 5.0, season: "Winter", time_of_day: "Night", occasion: "Formal", description: "Profile: [4-LAYER] Ultimate niche symphony of leather, tea, vetiver, vanilla. Synergy: Masterclass arrangement. Heavy, dense base elements shifting smoothly into sweet and powdery layers over time.", tags: ["Encre Noire l'Extreme", "Costume National I", "Lattafa Liam Grey", "Spectre Ghost"], steps: "Layer 1: Encre Noire l'Extreme (1 spray) - Skin / Lower Back; Layer 2: Costume National I (2 sprays) - Skin / Chest; Layer 3: Lattafa Liam Grey (2 sprays) - Skin / Neck; Layer 4: Spectre Ghost (2 sprays) - Clothes / Coat" },
  { id: 35, name: "High-Heat Overlord", rating: 5.0, season: "Summer", time_of_day: "Day", occasion: "Casual", description: "Profile: [4-LAYER] Blockbuster summer shield of ambroxan, spice, marine salt, ginger. Synergy: Absolute armor against sweat. Designed to sequentially boil off over an 8-hour period.", tags: ["Turathi Blue", "Al Nashama Caprice", "CDNI Milestone", "Jean Lowe Immortal"], steps: "Layer 1: Turathi Blue (2 sprays) - Skin / Neck; Layer 2: Al Nashama Caprice (1 spray) - Skin / Chest; Layer 3: CDNI Milestone (2 sprays) - Clothes / Left Shoulder; Layer 4: Jean Lowe Immortal (2 sprays) - Clothes / Right Shoulder" }
];

// Configuration variables for the Filter UI
const FILTER_CATEGORIES = {
  season: ['Spring', 'Summer', 'Autumn', 'Winter'],
  time_of_day: ['Day', 'Night'],
  occasion: ['Casual', 'Office', 'Evening', 'Formal']
};

class FragranceExplorerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Core state tracking arrays
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.exitTimer = null;
    this.backPressedOnce = false;

    // Filter state tracking Set objects
    this.activeFilters = {
      season: new Set(),
      time_of_day: new Set(),
      occasion: new Set()
    };
    
    // Binding event handlers securely
    this._handlePopState = this._handlePopState.bind(this);
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = config;
  }

  connectedCallback() {
    this._renderSkeleton();
    this._initNavigationEngine();
    window.addEventListener('popstate', this._handlePopState);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._handlePopState);
    if (this.exitTimer) clearTimeout(this.exitTimer);
  }

  _initNavigationEngine() {
    const uniqueStateId = 'fragrance_explorer_' + Date.now();
    this.sessionStateKey = uniqueStateId;

    window.history.replaceState({ app: this.sessionStateKey, depth: 0 }, '');
    window.history.pushState({ app: this.sessionStateKey, depth: 1 }, '');
    
    this.currentDepth = 1;
    this._renderCurrentView();
  }

  _navigateForward(nextView, value = null) {
    this.navStack.push({ view: nextView, value: value });
    this.currentDepth = this.navStack.length;
    
    window.history.pushState({ app: this.sessionStateKey, depth: this.currentDepth }, '');
    this._renderCurrentView();
  }

  _handlePopState(event) {
    if (!event.state || event.state.app !== this.sessionStateKey) return;

    const targetDepth = event.state.depth;

    if (targetDepth < this.currentDepth) {
      if (this.navStack.length > 1) {
        this.navStack.pop();
        this.currentDepth = this.navStack.length;
        this.backPressedOnce = false; 
        this._renderCurrentView();
      } else {
        if (!this.backPressedOnce) {
          this.backPressedOnce = true;
          this._showToastMessage("Press back again to exit Home Assistant");
          
          window.history.pushState({ app: this.sessionStateKey, depth: 1 }, '');
          this.currentDepth = 1;

          this.exitTimer = setTimeout(() => {
            this.backPressedOnce = false;
          }, 5000);
        } else {
          if (this.exitTimer) clearTimeout(this.exitTimer);
          window.history.go(-1); 
        }
      }
    } else if (targetDepth > this.currentDepth) {
      this.currentDepth = targetDepth;
    }
  }

  _renderCurrentView() {
    const activeState = this.navStack[this.navStack.length - 1];
    const container = this.shadowRoot.getElementById('view-port');
    if (!container) return;
    
    container.innerHTML = '';

    if (activeState.view === 'browser') {
      container.appendChild(this._buildBrowserView());
    } else if (activeState.view === 'detail') {
      container.appendChild(this._buildCombinationDetailView(activeState.value));
    }
  }

  /**
   * Main Browser View (Faceted Search)
   */
  _buildBrowserView() {
    const div = document.createElement('div');
    div.className = 'fade-in';
    
    // 1. Build Filter Header UI
    let filterHtml = `<div class="header-title">Fragrance Blends</div><div class="filters-container">`;
    
    for (const [category, options] of Object.entries(FILTER_CATEGORIES)) {
      const displayTitle = category.replace('_', ' ');
      filterHtml += `<div class="filter-group">`;
      filterHtml += `<div class="group-label">${displayTitle}</div>`;
      filterHtml += `<div class="chip-container">`;
      
      options.forEach(opt => {
        const isActive = this.activeFilters[category].has(opt) ? 'active' : '';
        filterHtml += `<button class="chip ${isActive}" data-category="${category}" data-val="${opt}">${opt}</button>`;
      });
      
      filterHtml += `</div></div>`;
    }
    filterHtml += `</div><div id="results-list" class="scrollable-list"></div>`;
    
    div.innerHTML = filterHtml;

    // Attach Chip Toggle Events
    div.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const cat = e.target.getAttribute('data-category');
        const val = e.target.getAttribute('data-val');
        
        // Toggle Set
        if (this.activeFilters[cat].has(val)) {
          this.activeFilters[cat].delete(val);
          e.target.classList.remove('active');
        } else {
          this.activeFilters[cat].add(val);
          e.target.classList.add('active');
        }
        
        this._updateResultsList(div.querySelector('#results-list'));
      });
    });

    // Initial render of the list based on current state
    this._updateResultsList(div.querySelector('#results-list'));

    return div;
  }

  /**
   * Filters the master data array based on active criteria
   * Includes smart wildcards for "All Seasons" and "All" (Time)
   */
  _updateResultsList(containerElement) {
    if (!containerElement) return;

    const s = this.activeFilters.season;
    const t = this.activeFilters.time_of_day;
    const o = this.activeFilters.occasion;

    const filtered = FRAGRANCE_DATA.filter(item => {
      const matchSeason = s.size === 0 || s.has(item.season) || item.season === 'All Seasons';
      const matchTime = t.size === 0 || t.has(item.time_of_day) || item.time_of_day === 'All';
      const matchOccasion = o.size === 0 || o.has(item.occasion);

      return matchSeason && matchTime && matchOccasion;
    });

    let listHtml = `<div class="results-count">${filtered.length} matches found</div>`;
    
    if (filtered.length === 0) {
      listHtml += `<div class="empty-state">No blends match these exact filters. Try removing a few!</div>`;
    } else {
      listHtml += `<div class="list-container">`;
      filtered.forEach(item => {
        listHtml += `
          <button class="list-row combination-row" data-id="${item.id}">
            <div class="row-meta">
              <span class="row-name">${item.name}</span>
              <span class="row-rating">⭐ ${item.rating.toFixed(1)}</span>
            </div>
            <div class="row-tags">${item.tags.join(' + ')}</div>
            <div class="row-context">${item.season} • ${item.time_of_day} • ${item.occasion}</div>
          </button>
        `;
      });
      listHtml += `</div>`;
    }

    containerElement.innerHTML = listHtml;

    // Attach click events to jump to detail view
    containerElement.querySelectorAll('.combination-row').forEach(row => {
      row.addEventListener('click', () => {
        this._navigateForward('detail', parseInt(row.getAttribute('data-id')));
      });
    });
  }

  /**
   * Detail View for individual combinations
   */
  _buildCombinationDetailView(id) {
    const div = document.createElement('div');
    div.className = 'fade-in';
    const item = FRAGRANCE_DATA.find(f => f.id === id);

    if (!item) {
      div.innerHTML = `<div class="empty-state">Error loading mix template profile.</div>`;
      return div;
    }

    div.innerHTML = `
      <div class="detail-header">
        <div class="detail-title">${item.name}</div>
        <div class="detail-badge-rating">⭐ ${item.rating.toFixed(1)}</div>
      </div>
      
      <div class="tag-pill-container">
        <span class="pill hidden-pill">${item.season}</span>
        <span class="pill hidden-pill">${item.time_of_day}</span>
        <span class="pill hidden-pill">${item.occasion}</span>
      </div>

      <div class="detail-section">
        <div class="section-label">Composition Elements</div>
        <div class="ingredients-list">
          ${item.tags.map(tag => `<div class="ingredient-item">🧪 ${tag}</div>`).join('')}
        </div>
      </div>

      <div class="detail-section">
        <div class="section-label">Olfactory Architecture Profile</div>
        <p class="section-body-text">${item.description}</p>
      </div>

      <div class="detail-section">
        <div class="section-label">Application Mapping Sequence</div>
        <div class="steps-box">${item.steps.split('; ').map(step => `<div class="step-line">🔹 ${step}</div>`).join('')}</div>
      </div>
    `;
    return div;
  }

  _showToastMessage(msg) {
    let container = this.shadowRoot.getElementById('toast-box');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-box';
      this.shadowRoot.appendChild(container);
    }
    container.textContent = msg;
    container.className = "toast show";
    
    setTimeout(() => {
      container.className = "toast";
    }, 2500);
  }

  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --accent-color-rgb: 0, 118, 255;
          font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        }
        .main-card-frame {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.15));
          color: var(--primary-text-color, #ffffff);
          padding: 16px;
          min-height: 450px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .header-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
          color: var(--primary-text-color);
          border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.1));
          padding-bottom: 10px;
        }
        
        /* Filter System Styles */
        .filters-container {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px dashed var(--divider-color, rgba(255,255,255,0.1));
        }
        .filter-group {
          margin-bottom: 12px;
        }
        .group-label {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--secondary-text-color, #8e8e93);
          margin-bottom: 6px;
        }
        .chip-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .chip {
          background: var(--secondary-background-color, #2c2c2e);
          border: 1px solid var(--divider-color, #3a3a3c);
          color: var(--primary-text-color, #ffffff);
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:active {
          transform: scale(0.95);
        }
        .chip.active {
          background: rgba(var(--accent-color-rgb), 0.15);
          border-color: var(--accent-color, #0076ff);
          color: var(--accent-color, #0076ff);
        }

        /* List Area Styles */
        .scrollable-list {
          flex: 1;
          overflow-y: auto;
          max-height: 400px;
          padding-right: 4px;
        }
        .scrollable-list::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-list::-webkit-scrollbar-thumb {
          background: var(--divider-color, #3a3a3c);
          border-radius: 4px;
        }
        .results-count {
          font-size: 11px;
          font-weight: 600;
          color: var(--secondary-text-color, #8e8e93);
          margin-bottom: 8px;
          text-align: right;
        }
        .list-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .list-row {
          background: var(--secondary-background-color, #2c2c2e);
          border: none;
          border-radius: 6px;
          padding: 12px 16px;
          text-align: left;
          color: var(--primary-text-color);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.1s;
        }
        .list-row:active {
          background: var(--table-row-alternative-background-color, #3a3a3c);
        }
        .combination-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .row-meta {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-weight: 600;
        }
        .row-tags {
          font-size: 11px;
          color: var(--secondary-text-color, #8e8e93);
        }
        .row-context {
          font-size: 10px;
          color: var(--accent-color, #0076ff);
          margin-top: 2px;
          opacity: 0.8;
        }

        /* Detail View Styles */
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .detail-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .detail-badge-rating {
          background: rgba(255, 159, 10, 0.2);
          color: #ff9f0a;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
        }
        .tag-pill-container {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .pill {
          background: var(--table-row-alternative-background-color, #3a3a3c);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--secondary-text-color, #8e8e93);
        }
        .detail-section {
          margin-bottom: 14px;
        }
        .section-label {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--secondary-text-color, #8e8e93);
          margin-bottom: 4px;
        }
        .section-body-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
          color: var(--primary-text-color);
        }
        .ingredients-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ingredient-item {
          font-size: 13px;
          font-weight: 600;
        }
        .steps-box {
          background: rgba(var(--accent-color-rgb), 0.08);
          border-left: 3px solid var(--accent-color, #0076ff);
          padding: 10px 12px;
          border-radius: 0 6px 6px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .step-line {
          font-size: 13px;
          line-height: 1.35;
        }
        
        .empty-state {
          text-align: center;
          padding: 24px;
          color: var(--secondary-text-color);
          font-size: 13px;
        }
        
        /* Toast Notifications */
        .toast {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: #323232;
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 500;
          pointer-events: none;
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
          z-index: 99;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        
        /* Animations */
        .fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div class="main-card-frame">
        <div id="view-port"></div>
        <div id="toast-box" class="toast"></div>
      </div>
    `;
  }
}

customElements.define('fragrance-explorer-card', FragranceExplorerCard);