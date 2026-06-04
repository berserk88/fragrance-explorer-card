/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 4.5: Core Structural Lifecycle Optimization, Focus Preservation, and Event Delegation
 */

import { fragranceCombinations } from '/local/community/fragrance-explorer-card/fragrance_combinations.js?v=4.5';
import { individualFragrances } from '/local/community/fragrance-explorer-card/individual_fragrances.js?v=4.5';

const ICONS = {
  'Spring': '🌸', 'Summer': '☀️', 'Autumn': '🍂', 'Winter': '❄️', 'All Seasons': '🌍',
  'Day': '🌅', 'Night': '🌃', 'All': '🌗',
  'Casual': '👕', 'Office': '💼', 'Evening': '🍸', 'Formal': '👔',
  'Blend': '🧪', 'Fragrance': '🧴'
};

class FragranceExplorerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Core state tracking arrays
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.searchTerm = '';
    this.ratingFilter = { type: '', min: '' };
    
    // Multi-Select filter state configurations
    this.activeFilters = {
      type: new Set(),
      note: new Set(),
      season: new Set(),
      time_of_day: new Set(),
      occasion: new Set()
    };
    
    // Defensive data ingestion maps
    const rawCombos = Array.isArray(fragranceCombinations) ? fragranceCombinations : [];
    const rawIndivs = Array.isArray(individualFragrances) ? individualFragrances : [];
    
    this.masterIndex = [
      ...rawIndivs.map(f => ({ ...f, type: 'Fragrance' })),
      ...rawCombos.map(c => ({ ...c, type: 'Blend' }))
    ];

    // Harvest unique notes dynamically across datasets
    const extractedNotes = new Set();
    this.masterIndex.forEach(item => {
      if (Array.isArray(item.dominant_notes)) {
        item.dominant_notes.flat().forEach(n => {
          if (n && typeof n === 'string') extractedNotes.add(n.trim());
        });
      }
    });
    this.uniqueNotes = Array.from(extractedNotes).sort();
    
    this.hasRendered = false;
  }

  // Home Assistant Mandatory Lifecycle Hook
  setConfig(config) {
    this._config = config;
  }

  // Home Assistant Reactive Entrypoint Hook
  set hass(hass) {
    this._hass = hass;
    if (!this.hasRendered) {
      this._initialRender();
      this.hasRendered = true;
    }
  }

  getCardSize() {
    return 3;
  }

  // Resolves the 0.0 display metrics issues safely across types
  getMetricValue(item, metricKey) {
    let rawVal = 0.0;
    if (metricKey === 'compliments') {
      rawVal = item.compliment_factor !== undefined ? item.compliment_factor : (item.compliments !== undefined ? item.compliments : 0.0);
    } else if (metricKey === 'complexity') {
      rawVal = item.complexity !== undefined ? item.complexity : (item.versatility !== undefined ? item.versatility : 0.0);
    } else {
      rawVal = item[metricKey] !== undefined ? item[metricKey] : 0.0;
    }
    return parseFloat(rawVal).toFixed(1);
  }

  applyContextualFilter(category, value) {
    this.searchTerm = '';
    this.ratingFilter = { type: '', min: '' };
    
    for (const key in this.activeFilters) {
      this.activeFilters[key].clear();
    }
    
    if (this.activeFilters[category]) {
      this.activeFilters[category].add(value);
    }
    
    this.resetToHomeView();
  }

  resetAllFilters() {
    this.searchTerm = '';
    this.ratingFilter = { type: '', min: '' };
    for (const key in this.activeFilters) {
      this.activeFilters[key].clear();
    }
    this.render();
  }

  navigateTo(view, value) {
    this.navStack.push({ view, value });
    this.currentDepth = this.navStack.length;
    this.render();
  }

  navigateBack() {
    if (this.navStack.length > 1) {
      this.navStack.pop();
      this.currentDepth = this.navStack.length;
      this.render();
    }
  }

  resetToHomeView() {
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.render();
  }

  toggleFilter(category, value) {
    if (this.activeFilters[category].has(value)) {
      this.activeFilters[category].delete(value);
    } else {
      this.activeFilters[category].add(value);
    }
    this.render();
  }

  getFilteredItems() {
    return this.masterIndex.filter(item => {
      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase();
        const matchName = item.name?.toLowerCase().includes(search);
        const matchFam = item.fragrance_family?.toLowerCase().includes(search);
        const matchNotes = item.dominant_notes?.some(n => String(n).toLowerCase().includes(search));
        if (!matchName && !matchFam && !matchNotes) return false;
      }
      
      if (this.activeFilters.type.size > 0 && !this.activeFilters.type.has(item.type)) return false;

      if (this.activeFilters.season.size > 0) {
        const seasons = Array.isArray(item.seasons) ? item.seasons : [item.season];
        if (!seasons.some(s => this.activeFilters.season.has(s) || s === 'All Seasons')) return false;
      }

      if (this.activeFilters.time_of_day.size > 0) {
        if (item.time_of_day !== 'All' && !this.activeFilters.time_of_day.has(item.time_of_day)) return false;
      }

      if (this.activeFilters.occasion.size > 0) {
        if (!this.activeFilters.occasion.has(item.occasion)) return false;
      }

      if (this.activeFilters.note.size > 0) {
        const normalizedItemNotes = Array.isArray(item.dominant_notes) ? item.dominant_notes.flat().map(n => String(n).trim()) : [];
        let hasNoteMatch = false;
        for (let requestedNote of this.activeFilters.note) {
          if (normalizedItemNotes.includes(requestedNote)) {
            hasNoteMatch = true;
            break;
          }
        }
        if (!hasNoteMatch) return false;
      }

      return true;
    });
  }

  renderStars(rating) {
    const parsed = parseFloat(rating || 0.0);
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (parsed >= i) {
        starsHTML += `<span class="star filled">★</span>`;
      } else if (parsed > i - 1) {
        const percentage = Math.round((parsed - (i - 1)) * 100);
        starsHTML += `<span class="star partial" style="--fill-width: ${percentage}%">★</span>`;
      } else {
        starsHTML += `<span class="star empty">★</span>`;
      }
    }
    return `<div class="star-rating-container" title="${parsed.toFixed(1)} / 5.0">${starsHTML} <span class="rating-numeric">${parsed.toFixed(1)}</span></div>`;
  }

  _initialRender() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--ha-card-background, var(--card-background-color, #ffffff));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
          padding: 16px;
          color: var(--primary-text-color, #212121);
          font-family: var(--paper-font-body1_-_font-family, inherit);
          box-sizing: border-box;
          overflow: hidden;
        }
        .explorer-card-root { width: 100%; display: flex; flex-direction: column; }
        .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; min-height: 36px; }
        .card-title { font-size: 16px; font-weight: bold; color: var(--primary-text-color); display: flex; align-items: center; gap: 6px; }
        .header-actions { display: flex; gap: 8px; }
        .action-btn { background: var(--secondary-background-color, #f5f5f5); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--primary-text-color); font-size: 14px; transition: background 0.2s; }
        .action-btn:hover { background: var(--divider-color, #e0e0e0); }
        .search-container { position: relative; margin-bottom: 14px; }
        .search-input-field { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--divider-color, #e0e0e0); background: var(--sidebar-background-color, var(--card-background-color, #ffffff)); color: var(--primary-text-color); font-size: 14px; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .search-input-field:focus { border-color: var(--accent-color, #0076ff); }
        .filter-section { margin-bottom: 12px; }
        .filter-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--secondary-text-color, #727272); margin-bottom: 6px; font-weight: 600; }
        .filter-chips-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .filter-chip { background: var(--secondary-background-color, #f5f5f5); border: 1px solid var(--divider-color, #e0e0e0); padding: 4px 10px; border-radius: 16px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; color: var(--primary-text-color); transition: all 0.2s; user-select: none; }
        .filter-chip.active { background: var(--accent-color, #0076ff); color: #ffffff; border-color: var(--accent-color, #0076ff); }
        .note-select-dropdown { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #e0e0e0); background: var(--card-background-color, #ffffff); color: var(--primary-text-color); font-size: 13px; outline: none; margin-bottom: 4px; }
        .collection-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 10px; margin-top: 12px; }
        .grid-item-card { background: var(--card-background-color, #ffffff); border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; transition: transform 0.15s, border-color 0.15s; position: relative; }
        .grid-item-card:hover { transform: translateY(-2px); border-color: var(--accent-color, #0076ff); }
        .item-type-badge { position: absolute; top: 8px; right: 8px; font-size: 14px; }
        .item-name { font-size: 13px; font-weight: bold; color: var(--primary-text-color); padding-right: 18px; line-height: 1.3; }
        .item-subtext { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .star-rating-container { display: flex; align-items: center; gap: 1px; font-size: 12px; margin-top: 6px; }
        .star { color: #e0e0e0; position: relative; display: inline-block; }
        .star.filled { color: #ffb400; }
        .star.partial::before { content: '★'; position: absolute; top: 0; left: 0; width: var(--fill-width, 0%); overflow: hidden; color: #ffb400; }
        .rating-numeric { font-size: 10px; font-weight: bold; color: var(--secondary-text-color, #727272); margin-left: 3px; }
        .empty-state { text-align: center; padding: 32px 16px; color: var(--secondary-text-color, #727272); font-size: 13px; }
        .reset-btn { background: var(--accent-color, #0076ff); color: white; border: none; padding: 6px 12px; border-radius: 6px; margin-top: 8px; cursor: pointer; font-size: 12px; }
        .details-container { display: flex; flex-direction: column; gap: 12px; }
        .details-header { border-bottom: 1px solid var(--divider-color, #e0e0e0); padding-bottom: 8px; }
        .details-title { font-size: 18px; font-weight: bold; }
        .details-subtitle { font-size: 12px; color: var(--secondary-text-color, #727272); margin-bottom: 4px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .metric-box { background: var(--secondary-background-color, #f5f5f5); padding: 8px 10px; border-radius: 6px; display: flex; flex-direction: column; }
        .metric-label { font-size: 10px; color: var(--secondary-text-color, #727272); font-weight: bold; text-transform: uppercase; }
        .metric-value-row { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; }
        .metric-number { font-size: 15px; font-weight: bold; }
        .content-block-section { border-left: 3px solid var(--accent-color, #0076ff); background: rgba(0, 118, 255, 0.04); padding: 8px 10px; border-radius: 0 6px 6px 0; }
        .section-header-inline { font-size: 12px; font-weight: bold; margin: 0 0 4px 0; }
        .block-text-paragraph { font-size: 12px; margin: 0; line-height: 1.4; white-space: pre-wrap; }
        .details-badge-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
        .clickable-badge { background: var(--card-background-color, #ffffff); border: 1px solid var(--divider-color, #e0e0e0); padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
        .clickable-badge:hover { background: var(--accent-color, #0076ff); color: white; border-color: var(--accent-color, #0076ff); }
      </style>
      <div class="explorer-card-root">
        <div class="card-header-row" id="card-header-container"></div>
        <div id="card-view-wrapper"></div>
      </div>
    `;
    
    this._attachEventListeners();
    this.render();
  }

  // Pure global Event Delegation model protecting dynamically redrawn content paths
  _attachEventListeners() {
    const root = this.shadowRoot;
    
    root.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'search-core-field') {
        this.searchTerm = e.target.value;
        this.render();
      }
    });

    root.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'note-select-filter') {
        this.activeFilters.note.clear();
        if (e.target.value) this.activeFilters.note.add(e.target.value);
        this.render();
      }
    });

    root.addEventListener('click', (e) => {
      const path = e.composedPath();
      
      const backBtn = path.find(el => el.classList && el.classList.contains('back-btn'));
      if (backBtn) { this.navigateBack(); return; }

      const homeBtn = path.find(el => el.classList && el.classList.contains('home-btn'));
      if (homeBtn) { this.resetToHomeView(); return; }

      const resetBtn = path.find(el => el.classList && el.classList.contains('reset-btn'));
      if (resetBtn) { this.resetAllFilters(); return; }

      const filterChip = path.find(el => el.classList && el.classList.contains('filter-chip'));
      if (filterChip) {
        const cat = filterChip.getAttribute('data-category');
        const val = filterChip.getAttribute('data-value');
        if (cat && val) this.toggleFilter(cat, val);
        return;
      }

      const badge = path.find(el => el.classList && el.classList.contains('clickable-badge'));
      if (badge) {
        const cat = badge.getAttribute('data-category');
        const val = badge.getAttribute('data-value');
        if (cat && val) this.applyContextualFilter(cat, val);
        return;
      }

      const card = path.find(el => el.classList && el.classList.contains('grid-item-card'));
      if (card) {
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        const match = this.masterIndex.find(x => String(x.id) === String(id) && x.type === type);
        if (match) this.navigateTo('details', match);
        return;
      }
    });
  }

  renderBrowserView() {
    const filteredItems = this.getFilteredItems();
    
    const typeChips = ['Fragrance', 'Blend'].map(t => {
      return `<div class="filter-chip ${this.activeFilters.type.has(t) ? 'active' : ''}" data-category="type" data-value="${t}">${ICONS[t]} ${t}</div>`;
    }).join('');

    const seasonChips = ['Spring', 'Summer', 'Autumn', 'Winter'].map(s => {
      return `<div class="filter-chip ${this.activeFilters.season.has(s) ? 'active' : ''}" data-category="season" data-value="${s}">${ICONS[s]} ${s}</div>`;
    }).join('');

    const timeChips = ['Day', 'Night'].map(t => {
      return `<div class="filter-chip ${this.activeFilters.time_of_day.has(t) ? 'active' : ''}" data-category="time_of_day" data-value="${t}">${ICONS[t]} ${t}</div>`;
    }).join('');

    const occasionChips = ['Casual', 'Office', 'Evening', 'Formal'].map(o => {
      return `<div class="filter-chip ${this.activeFilters.occasion.has(o) ? 'active' : ''}" data-category="occasion" data-value="${o}">${ICONS[o]} ${o}</div>`;
    }).join('');

    const currentNote = Array.from(this.activeFilters.note)[0] || '';
    let noteOptions = `<option value="">-- Select a Dominant Note --</option>`;
    this.uniqueNotes.forEach(n => {
      noteOptions += `<option value="${n}" ${n === currentNote ? 'selected' : ''}>${n}</option>`;
    });

    let gridHTML = '';
    if (filteredItems.length === 0) {
      gridHTML = `
        <div class="empty-state">
          <p>🔍 No items match your selected parameters.</p>
          <button class="reset-btn">Reset Filters</button>
        </div>
      `;
    } else {
      gridHTML = `<div class="collection-items-grid">`;
      filteredItems.forEach(item => {
        const notesList = Array.isArray(item.dominant_notes) ? item.dominant_notes.slice(0, 3).join(', ') : '';
        const desc = item.profile || item.description || '';
        const shortDesc = desc.length > 55 ? desc.substring(0, 52) + '...' : desc;
        
        gridHTML += `
          <div class="grid-item-card" data-id="${item.id}" data-type="${item.type}">
            <div class="item-type-badge">${ICONS[item.type]}</div>
            <div>
              <div class="item-name">${item.name}</div>
              <div class="item-subtext" style="font-style: italic; opacity: 0.8;">${item.inspiration || item.fragrance_family || ''}</div>
              <div class="item-subtext">${shortDesc}</div>
            </div>
            <div>
              <div class="item-subtext" style="font-weight: 600; color: var(--accent-color, #0076ff);">${notesList}</div>
              ${this.renderStars(item.rating)}
            </div>
          </div>
        `;
      });
      gridHTML += `</div>`;
    }

    return `
      <div class="search-container">
        <input type="text" id="search-core-field" class="search-input-field" placeholder="Search name, accord, family..." value="${this.searchTerm}">
      </div>
      <div class="filter-section">
        <div class="filter-label">Target Format</div>
        <div class="filter-chips-row">${typeChips}</div>
      </div>
      <div class="filter-section">
        <div class="filter-label">Notes Matrix</div>
        <select id="note-select-filter" class="note-select-dropdown">${noteOptions}</select>
      </div>
      <div class="filter-section">
        <div class="filter-label">Seasons</div>
        <div class="filter-chips-row">${seasonChips}</div>
      </div>
      <div class="filter-section">
        <div class="filter-label">Timeline</div>
        <div class="filter-chips-row">${timeChips}</div>
      </div>
      <div class="filter-section">
        <div class="filter-label">Occasions</div>
        <div class="filter-chips-row">${occasionChips}</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; border-top: 1px solid var(--divider-color); padding-top: 8px;">
        <div class="filter-label" style="margin: 0;">Catalog Count: ${filteredItems.length} / ${this.masterIndex.length}</div>
      </div>
      ${gridHTML}
    `;
  }

  renderDetailsView(item) {
    const isBlend = item.type === 'Blend';
    
    let notesBadges = (Array.isArray(item.dominant_notes) ? item.dominant_notes : (item.tags || []))
      .map(n => `<span class="clickable-badge" data-category="note" data-value="${n}">${n}</span>`).join('');

    let seasonsList = Array.isArray(item.seasons) ? item.seasons : (item.season ? [item.season] : []);
    let seasonsBadges = seasonsList.map(s => `<span class="clickable-badge" data-category="season" data-value="${s}">${ICONS[s] || ''} ${s}</span>`).join('');

    const proj = this.getMetricValue(item, 'projection');
    const longev = this.getMetricValue(item, 'longevity');
    const compFactor = this.getMetricValue(item, 'compliments');
    const complex = this.getMetricValue(item, 'complexity');

    let crossLinkHTML = '';
    const relatedArray = isBlend ? item.alternatives : item.related_fragrances;
    if (Array.isArray(relatedArray) && relatedArray.length > 0) {
      crossLinkHTML = relatedArray.map(name => {
        const match = this.masterIndex.find(x => x.name.toLowerCase() === name.toLowerCase());
        if (match) {
          return `<span class="clickable-badge" data-category="type" data-value="${match.type}" style="border-color: var(--accent-color, #0076ff);">${name}</span>`;
        }
        return `<span class="clickable-badge" style="opacity: 0.5; cursor: not-allowed;">${name}</span>`;
      }).join('');
    } else {
      crossLinkHTML = `<span class="block-text-paragraph" style="color: var(--secondary-text-color);">None tracked</span>`;
    }

    return `
      <div class="details-container">
        <div class="details-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 18px;">${ICONS[item.type]}</span>
            <div class="details-title">${item.name}</div>
          </div>
          <div class="details-subtitle" style="font-style: italic;">${item.inspiration || item.fragrance_family || 'Original Production'}</div>
          ${this.renderStars(item.rating)}
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Projection</div>
            <div class="metric-value-row"><span class="metric-number">${proj}</span><span>💥</span></div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Longevity</div>
            <div class="metric-value-row"><span class="metric-number">${longev}</span><span>⏳</span></div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Compliments</div>
            <div class="metric-value-row"><span class="metric-number">${compFactor}</span><span>💬</span></div>
          </div>
          <div class="metric-box">
            <div class="metric-label">${isBlend ? 'Complexity' : 'Versatility'}</div>
            <div class="metric-value-row"><span class="metric-number">${complex}</span><span>🧩</span></div>
          </div>
        </div>

        <div>
          <div class="filter-label">Dominant Accords / Tags</div>
          <div class="details-badge-row">${notesBadges || '<span class="block-text-paragraph">None</span>'}</div>
        </div>

        <div>
          <div class="filter-label">Optimal Seasons</div>
          <div class="details-badge-row">${seasonsBadges || '<span class="block-text-paragraph">All-Season Universal</span>'}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="metric-box">
            <div class="filter-label">Target Environment</div>
            <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">${item.best_weather || item.best_temperature || 'Universal Climate'}</div>
          </div>
          <div class="metric-box">
            <div class="filter-label">Context Matrix</div>
            <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">${item.time_of_day || 'Day/Night'} • ${item.occasion || 'General'}</div>
          </div>
        </div>

        ${isBlend ? `
          <div class="content-block-section" style="background: rgba(255,180,0,0.03); border-left-color: #ffb400;">
            <h5 class="section-header-inline">Layering Instructions</h5>
            <p class="block-text-paragraph">${item.steps || 'No tracking parameters recorded.'}</p>
          </div>
          <div class="content-block-section" style="background: rgba(0,118,255,0.03); border-left-color: #0076ff;">
            <h5 class="section-header-inline">Synergy Mechanics</h5>
            <p class="block-text-paragraph">${item.synergy || 'No descriptive synergy logs mapped.'}</p>
          </div>
        ` : `
          <div class="content-block-section">
            <h5 class="section-header-inline">Profile Mapping</h5>
            <p class="block-text-paragraph">${item.description || 'No descriptive logs mapped.'}</p>
          </div>
        `}

        <div>
          <div class="filter-label">${isBlend ? 'Alternative Cross-Selections' : 'Related Collection Links'}</div>
          <div class="details-badge-row">${crossLinkHTML}</div>
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = this.shadowRoot.getElementById('card-view-wrapper');
    if (!wrapper) return;

    // Preserve cursor selection range and focus inside text nodes before updating DOM elements
    const searchField = this.shadowRoot.getElementById('search-core-field');
    const isFocused = (this.shadowRoot.activeElement === searchField);
    const selStart = searchField ? searchField.selectionStart : null;
    const selEnd = searchField ? searchField.selectionEnd : null;

    const currentNav = this.navStack[this.navStack.length - 1];
    const headerRow = this.shadowRoot.getElementById('card-header-container');
    
    if (headerRow) {
      if (currentNav.view === 'browser') {
        headerRow.innerHTML = `
          <div class="card-title">🧪 Fragrance Vault Explorer</div>
          <div class="header-actions">
            ${Object.values(this.activeFilters).some(s => s.size > 0) || this.searchTerm ? '<button class="action-btn reset-btn" title="Clear Filters">🧹</button>' : ''}
          </div>
        `;
      } else {
        headerRow.innerHTML = `
          <div class="card-title">
            <button class="action-btn back-btn" title="Go Back">⬅️</button>
            <span>Profile Vault View</span>
          </div>
          <div class="header-actions">
            <button class="action-btn home-btn" title="Home View">🏠</button>
          </div>
        `;
      }
    }

    if (currentNav.view === 'browser') {
      wrapper.innerHTML = this.renderBrowserView();
    } else if (currentNav.view === 'details') {
      wrapper.innerHTML = this.renderDetailsView(currentNav.value);
    }

    // Reapply structural execution node focus parameters
    if (isFocused) {
      const newSearchField = this.shadowRoot.getElementById('search-core-field');
      if (newSearchField) {
        newSearchField.focus();
        if (selStart !== null && selEnd !== null) {
          newSearchField.setSelectionRange(selStart, selEnd);
        }
      }
    }
  }
}

customElements.define('fragrance-explorer-card', FragranceExplorerCard);