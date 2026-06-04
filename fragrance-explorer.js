/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 5.0: Hardware Back Button Navigation, Unified Cross-Links, Dynamic Counting
 */

import { fragranceCombinations } from '/local/community/fragrance-explorer-card/fragrance_combinations.js?v=5.0';
import { individualFragrances } from '/local/community/fragrance-explorer-card/individual_fragrances.js?v=5.0';

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
    
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.searchTerm = '';
    this.ratingFilter = { type: '', min: '' };
    
    this.activeFilters = {
      type: new Set(),
      note: new Set(),
      season: new Set(),
      time_of_day: new Set(),
      occasion: new Set()
    };
    
    const rawCombos = Array.isArray(fragranceCombinations) ? fragranceCombinations : [];
    const rawIndivs = Array.isArray(individualFragrances) ? individualFragrances : [];
    
    this.masterIndex = [
      ...rawIndivs.map(f => ({ ...f, type: 'Fragrance' })),
      ...rawCombos.map(c => ({ ...c, type: 'Blend' }))
    ];

    const extractedNotes = new Set();
    this.masterIndex.forEach(item => {
      if (Array.isArray(item.dominant_notes)) {
        item.dominant_notes.flat().forEach(n => {
          if (n && typeof n === 'string') extractedNotes.add(n.trim());
        });
      }
    });
    this.uniqueNotes = Array.from(extractedNotes).sort();

    // Hardware back button integration pipeline
    this._popstateHandler = (e) => {
      if (this.navStack.length > 1) {
        this.navStack.pop();
        this.currentDepth = this.navStack.length;
        this.render();
      }
    };
  }

  connectedCallback() {
    window.addEventListener('popstate', this._popstateHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._popstateHandler);
  }

  setHass(hass) {
    this._hass = hass;
    if (!this.hasRendered) {
      this.render();
      this.hasRendered = true;
    }
  }

  setConfig(config) {
    this._config = config;
  }

  getCardSize() {
    return 3;
  }

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
    
    if (category === 'search') {
      this.searchTerm = value;
    } else if (this.activeFilters[category]) {
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
    window.history.pushState({ depth: this.currentDepth }, '');
    this.render();
  }

  navigateBack() {
    if (this.navStack.length > 1) {
      window.history.back();
    }
  }

  resetToHomeView() {
    if (this.navStack.length > 1) {
      const backCount = this.navStack.length - 1;
      this.navStack = [{ view: 'browser', value: null }];
      this.currentDepth = 1;
      window.history.go(-backCount);
      this.render();
    }
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
        const matchTags = item.tags?.some(t => String(t).toLowerCase().includes(search));
        if (!matchName && !matchFam && !matchNotes && !matchTags) return false;
      }
      
      if (this.ratingFilter.min) {
        const itemRating = parseFloat(item.rating || 0.0);
        const minRating = parseFloat(this.ratingFilter.min);
        if (this.ratingFilter.type === 'exact' && itemRating !== minRating) return false;
        if (this.ratingFilter.type === 'min' && itemRating < minRating) return false;
      }

      if (this.activeFilters.type.size > 0 && !this.activeFilters.type.has(item.type)) return false;

      if (this.activeFilters.season.size > 0) {
        const seasons = Array.isArray(item.seasons) ? item.seasons : (item.season ? [item.season] : []);
        if (!seasons.some(s => this.activeFilters.season.has(s) || s === 'All Seasons')) return false;
      }

      if (this.activeFilters.time_of_day.size > 0) {
        const times = Array.isArray(item.time_of_day) ? item.time_of_day : (item.time_of_day ? [item.time_of_day] : []);
        if (!times.some(t => this.activeFilters.time_of_day.has(t) || t === 'All')) return false;
      }

      if (this.activeFilters.occasion.size > 0) {
        const occasions = Array.isArray(item.occasion) ? item.occasion : (item.occasion ? [item.occasion] : []);
        if (!occasions.some(o => this.activeFilters.occasion.has(o))) return false;
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

  render() {
    const currentNav = this.navStack[this.navStack.length - 1];
    let activeContentHTML = '';
    if (currentNav.view === 'browser') {
      activeContentHTML = this.renderBrowserView();
    } else if (currentNav.view === 'detail') {
      activeContentHTML = this.renderDetailView(currentNav.value);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { --card-padding: 16px; font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif); color: var(--primary-text-color, #212121); }
        .card-container { background: var(--ha-card-background, var(--card-background-color, #ffffff)); border-radius: var(--ha-card-border-radius, 12px); box-shadow: var(--ha-card-box-shadow, 0px 2px 4px rgba(0,0,0,0.1)); padding: var(--card-padding); border: var(--ha-card-border, 1px solid var(--divider-color, #e0e0e0)); position: relative; overflow: hidden; }
        .header-navigation-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 8px; border-bottom: 1px solid var(--divider-color, #e0e0e0); padding-bottom: 10px; }
        .navigation-actions-group { display: flex; align-items: center; gap: 8px; }
        .nav-btn { background: var(--secondary-background-color, #f5f5f5); border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--primary-text-color); display: inline-flex; align-items: center; gap: 4px; transition: background 0.2s; }
        .nav-btn:hover { background: var(--table-row-alternative-background-color, #eee); }
        .card-title-text { font-size: 18px; font-weight: 700; margin: 0; flex-grow: 1; text-align: right; color: var(--primary-text-color); }
        .search-input-field { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--first-background-color, #fff); color: var(--primary-text-color); font-size: 14px; margin-bottom: 6px; }
        .list-counter-badge { font-size: 12px; font-weight: 700; color: var(--secondary-text-color, #666); margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-section-wrapper { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; background: var(--secondary-background-color, #fafafa); padding: 10px; border-radius: 8px; border: 1px solid var(--divider-color, #eaeaea); }
        .filter-row-container { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
        .filter-row-label { font-size: 12px; font-weight: 700; width: 65px; color: var(--secondary-text-color, #666); text-transform: uppercase; }
        .filter-interactive-tag { background: var(--card-background-color, #fff); border: 1px solid var(--divider-color, #dcdcdc); border-radius: 16px; padding: 4px 10px; font-size: 12px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 2px; color: var(--primary-text-color); }
        .filter-interactive-tag.active { background: var(--accent-color, #0076ff); color: #fff; border-color: var(--accent-color, #0076ff); font-weight: 600; }
        .clear-filters-btn { margin-top: 4px; border: 1px dashed var(--accent-color, #0076ff); background: transparent; color: var(--accent-color, #0076ff); font-weight: 600; }
        .custom-filter-select { background: var(--card-background-color, #fff); color: var(--primary-text-color); border: 1px solid var(--divider-color, #ccc); border-radius: 6px; padding: 4px 8px; font-size: 12px; max-width: 150px; cursor: pointer; }
        .collection-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
        .grid-item-card { background: var(--card-background-color, #ffffff); border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px; padding: 10px; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .grid-item-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.08); border-color: var(--accent-color, #0076ff); }
        .item-type-badge { position: absolute; top: 6px; right: 6px; font-size: 10px; padding: 2px 5px; border-radius: 4px; background: var(--secondary-background-color, #eee); font-weight: bold; opacity: 0.8; }
        .grid-item-title { font-size: 13px; font-weight: 700; margin: 0 0 4px 0; line-height: 1.3; padding-right: 24px; color: var(--primary-text-color); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .grid-item-subtitle { font-size: 11px; color: var(--secondary-text-color, #757575); margin: 0 0 8px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .star-rating-container { display: inline-flex; align-items: center; gap: 1px; font-size: 13px; line-height: 1; }
        .star { color: #ccc; position: relative; display: inline-block; }
        .star.filled { color: #ffb400; }
        .star.partial { color: #ccc; }
        .star.partial::before { content: '★'; position: absolute; top: 0; left: 0; width: var(--fill-width, 0%); overflow: hidden; color: #ffb400; }
        .rating-numeric { font-size: 11px; font-weight: bold; margin-left: 4px; color: var(--secondary-text-color); }
        .detail-view-layout { display: flex; flex-direction: column; gap: 12px; animation: fadeIn 0.2s ease-out; }
        .detail-hero-block { background: var(--secondary-background-color, #f9f9f9); border: 1px solid var(--divider-color, #eee); padding: 12px; border-radius: 8px; }
        .detail-main-title { font-size: 20px; font-weight: 800; margin: 0 0 4px 0; color: var(--primary-text-color); }
        .detail-family-sub { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px; font-style: italic; }
        .metrics-flex-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 8px 0; }
        .metric-score-card { background: var(--card-background-color, #fff); border: 1px solid var(--divider-color, #e0e0e0); padding: 8px 4px; border-radius: 6px; text-align: center; }
        .metric-score-label { font-size: 10px; font-weight: 700; color: var(--secondary-text-color); text-transform: uppercase; margin-bottom: 2px; }
        .metric-score-num { font-size: 15px; font-weight: 800; color: var(--accent-color, #0076ff); }
        .contextual-filter-link { color: var(--accent-color, #0076ff); text-decoration: none; font-weight: 600; cursor: pointer; border-bottom: 1px dashed var(--accent-color, #0076ff); transition: opacity 0.2s; }
        .contextual-filter-link:hover { opacity: 0.7; }
        .details-badge-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .clickable-badge { background: var(--secondary-background-color, #f0f0f0); color: var(--primary-text-color); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; cursor: pointer; transition: background 0.2s; border: 1px solid var(--divider-color, #e0e0e0); display: inline-flex; align-items: center; gap: 4px; }
        .clickable-badge:hover { background: var(--accent-color, #0076ff); color: #fff; border-color: var(--accent-color, #0076ff); }
        .content-block-section { border-left: 3px solid var(--accent-color, #0076ff); background: rgba(0, 118, 255, 0.03); padding: 10px; border-radius: 0 8px 8px 0; margin-top: 4px; }
        .section-header-inline { font-size: 13px; font-weight: 700; margin: 0 0 6px 0; text-transform: uppercase; color: var(--secondary-text-color); }
        .block-text-paragraph { font-size: 13px; line-height: 1.45; margin: 0; white-space: pre-wrap; color: var(--primary-text-color); }
        .empty-state-card { text-align: center; padding: 32px; color: var(--secondary-text-color); font-size: 13px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      
      <div class="card-container">
        <div class="header-navigation-bar">
          <div class="navigation-actions-group">
            ${this.currentDepth > 1 ? `<button class="nav-btn" id="back-nav-trigger">⬅ Back</button>` : ''}
            <button class="nav-btn" id="home-nav-trigger" title="Jump to top-level overview">🏠 Home</button>
          </div>
          <div class="card-title-text">Fragrance Vault</div>
        </div>
        
        <div class="card-content-viewport">
          activeContentHTML
        </div>
      </div>
    `.replace('activeContentHTML', activeContentHTML);

    this.bindEvents();
  }

  bindEvents() {
    const backBtn = this.shadowRoot.getElementById('back-nav-trigger');
    if (backBtn) backBtn.addEventListener('click', () => this.navigateBack());

    const homeBtn = this.shadowRoot.getElementById('home-nav-trigger');
    if (homeBtn) homeBtn.addEventListener('click', () => this.resetToHomeView());

    const searchField = this.shadowRoot.getElementById('search-core-field');
    if (searchField) {
      searchField.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.render();
        const sf = this.shadowRoot.getElementById('search-core-field');
        if (sf) {
          sf.focus();
          sf.setSelectionRange(sf.value.length, sf.value.length);
        }
      });
    }

    this.shadowRoot.querySelectorAll('.grid-item-card, .direct-navigate-link').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemId = parseInt(card.getAttribute('data-id'));
        const itemType = card.getAttribute('data-type');
        const target = this.masterIndex.find(x => x.id === itemId && x.type === itemType);
        if (target) this.navigateTo('detail', target);
      });
    });

    this.shadowRoot.querySelectorAll('.filter-interactive-tag:not(.clear-filters-btn)').forEach(tag => {
      tag.addEventListener('click', () => {
        this.toggleFilter(tag.getAttribute('data-category'), tag.getAttribute('data-value'));
      });
    });

    const noteSelect = this.shadowRoot.getElementById('note-dropdown-selector');
    if (noteSelect) {
      noteSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        this.activeFilters.note.clear();
        if (val) this.activeFilters.note.add(val);
        this.render();
      });
    }

    const clearBtn = this.shadowRoot.querySelector('.clear-filters-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => this.resetAllFilters());

    this.shadowRoot.querySelectorAll('.contextual-filter-link, .clickable-badge:not(.direct-navigate-link)').forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        this.applyContextualFilter(element.getAttribute('data-category'), element.getAttribute('data-value'));
      });
    });
  }

  renderBrowserView() {
    const filteredItems = this.getFilteredItems();
    const hasActiveFilters = Object.values(this.activeFilters).some(set => set.size > 0) || this.searchTerm;

    return `
      <input type="text" id="search-core-field" class="search-input-field" placeholder="Search by name, notes, tags, family..." value="${this.searchTerm}">
      <span class="list-counter-badge">Showing ${filteredItems.length} of ${this.masterIndex.length} items</span>
      
      <div class="filter-section-wrapper">
        <div class="filter-row-container" style="margin-bottom: 4px;">
          <div class="filter-row-label">Type:</div>
          <button class="filter-interactive-tag ${this.activeFilters.type.has('Fragrance') ? 'active' : ''}" data-category="type" data-value="Fragrance">${ICONS['Fragrance']} Fragrances</button>
          <button class="filter-interactive-tag ${this.activeFilters.type.has('Blend') ? 'active' : ''}" data-category="type" data-value="Blend">${ICONS['Blend']} Blends</button>
        </div>

        <div class="filter-row-container" style="margin-bottom: 4px;">
          <div class="filter-row-label">Note:</div>
          <select class="custom-filter-select" id="note-dropdown-selector">
            <option value="">All Notes Dropdown</option>
            ${this.uniqueNotes.map(note => `
              <option value="${note}" ${this.activeFilters.note.has(note) ? 'selected' : ''}>🧪 ${note}</option>
            `).join('')}
          </select>
          ${this.activeFilters.note.size > 0 ? Array.from(this.activeFilters.note).map(n => `<span class="filter-interactive-tag active" data-category="note" data-value="${n}">${n} ×</span>`).join('') : ''}
        </div>

        <div class="filter-row-container" style="margin-bottom: 4px;">
          <div class="filter-row-label">Season:</div>
          ${['Spring', 'Summer', 'Autumn', 'Winter'].map(s => `
            <button class="filter-interactive-tag ${this.activeFilters.season.has(s) ? 'active' : ''}" data-category="season" data-value="${s}">${ICONS[s] || ''} ${s}</button>
          `).join('')}
        </div>

        <div class="filter-row-container" style="margin-bottom: 4px;">
          <div class="filter-row-label">Time:</div>
          ${['Day', 'Night'].map(t => `
            <button class="filter-interactive-tag ${this.activeFilters.time_of_day.has(t) ? 'active' : ''}" data-category="time_of_day" data-value="${t}">${ICONS[t] || ''} ${t}</button>
          `).join('')}
        </div>

        <div class="filter-row-container">
          <div class="filter-row-label">Occasion:</div>
          ${['Casual', 'Office', 'Evening', 'Formal'].map(o => `
            <button class="filter-interactive-tag ${this.activeFilters.occasion.has(o) ? 'active' : ''}" data-category="occasion" data-value="${o}">${ICONS[o] || ''} ${o}</button>
          `).join('')}
        </div>

        ${hasActiveFilters ? `<button class="filter-interactive-tag clear-filters-btn">Clear All Active Filters</button>` : ''}
      </div>

      ${filteredItems.length === 0 ? `
        <div class="empty-state-card">No dynamic collection records match your criteria.</div>
      ` : `
        <div class="collection-items-grid">
          ${filteredItems.map(item => `
            <div class="grid-item-card" data-id="${item.id}" data-type="${item.type}">
              <span class="item-type-badge" style="color: ${item.type === 'Blend' ? '#0076ff' : '#2e7d32'}">${item.type === 'Blend' ? '🧪' : '🧴'}</span>
              <div>
                <h4 class="grid-item-title">${item.name}</h4>
                <p class="grid-item-subtitle">${item.type === 'Blend' ? `${item.fragrance_count} Layers` : (item.inspiration || 'Original')}</p>
              </div>
              ${this.renderStars(item.rating)}
            </div>
          `).join('')}
        </div>
      `}
    `;
  }

  renderDetailView(item) {
    const isBlend = item.type === 'Blend';
    
    const proj = this.getMetricValue(item, 'projection');
    const longev = this.getMetricValue(item, 'longevity');
    const compl = this.getMetricValue(item, 'compliments');
    const complex = this.getMetricValue(item, 'complexity');

    const seasons = Array.isArray(item.seasons) ? item.seasons : (item.season ? [item.season] : []);
    const times = Array.isArray(item.time_of_day) ? item.time_of_day : (item.time_of_day ? [item.time_of_day] : []);
    const occasions = Array.isArray(item.occasion) ? item.occasion : (item.occasion ? [item.occasion] : []);

    const notesHTML = Array.isArray(item.dominant_notes)
      ? item.dominant_notes.flat().map(note => `<span class="clickable-badge" data-category="note" data-value="${note.trim()}">🧪 ${note.trim()}</span>`).join(' ')
      : '<span class="block-text-paragraph">N/A</span>';

    const tagsHTML = Array.isArray(item.tags)
      ? item.tags.map(tag => `<span class="clickable-badge" data-category="search" data-value="${tag.trim()}">🏷️ ${tag.trim()}</span>`).join(' ')
      : '';

    return `
      <div class="detail-view-layout">
        <div class="detail-hero-block">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <h3 class="detail-main-title">${item.name}</h3>
            <span class="clickable-badge" data-category="type" data-value="${item.type}" style="background: var(--accent-color); color:#fff;">${isBlend ? '🧪 Blend' : '🧴 Fragrance'}</span>
          </div>
          <div class="detail-family-sub">
            <span class="contextual-filter-link" data-category="search" data-value="${item.fragrance_family || ''}">${item.fragrance_family || 'Custom Accords'}</span> 
            · ${item.inspiration || 'Original Record'}
          </div>
          ${this.renderStars(item.rating)}
          
          <div class="details-badge-row">
            ${seasons.map(s => `<span class="clickable-badge" data-category="season" data-value="${s}">${ICONS[s] || '🌍'} ${s}</span>`).join('')}
            ${times.map(t => `<span class="clickable-badge" data-category="time_of_day" data-value="${t}">${ICONS[t] || '🌗'} ${t}</span>`).join('')}
            ${occasions.map(o => `<span class="clickable-badge" data-category="occasion" data-value="${o}">${ICONS[o] || '👕'} ${o}</span>`).join('')}
          </div>
        </div>

        <div class="metrics-flex-row">
          <div class="metric-score-card"><div class="metric-score-label">Projection</div><div class="metric-score-num">${proj}</div></div>
          <div class="metric-score-card"><div class="metric-score-label">Longevity</div><div class="metric-score-num">${longev}</div></div>
          <div class="metric-score-card"><div class="metric-score-label">Compliments</div><div class="metric-score-num">${compl}</div></div>
          <div class="metric-score-card"><div class="metric-score-label">${isBlend ? 'Complexity' : 'Versatility'}</div><div class="metric-score-num">${complex}</div></div>
        </div>

        <div>
          <h5 class="section-header-inline">Dominant Notes Profile</h5>
          <div class="details-badge-row" style="margin-top:2px;">${notesHTML}</div>
        </div>

        ${tagsHTML ? `
          <div>
            <h5 class="section-header-inline">Associated Tags</h5>
            <div class="details-badge-row" style="margin-top:2px;">${tagsHTML}</div>
          </div>
        ` : ''}

        ${isBlend && Array.isArray(item.fragrances) ? `
          <div>
            <h5 class="section-header-inline">Formula Components</h5>
            <div class="details-badge-row">
              ${item.fragrances.map(fName => {
                const match = this.masterIndex.find(x => x.name === fName && x.type === 'Fragrance');
                return match 
                  ? `<span class="clickable-badge direct-navigate-link" data-id="${match.id}" data-type="Fragrance" style="border-color: var(--accent-color); font-weight: bold;">🧴 ${fName}</span>`
                  : `<span class="clickable-badge" style="opacity:0.5; cursor:not-allowed;">🧴 ${fName}</span>`;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${isBlend ? `
          <div class="content-block-section">
            <h5 class="section-header-inline">Synergy Formula & Recipe</h5>
            <p class="block-text-paragraph" style="font-weight: 600; color: var(--accent-color); margin-bottom: 6px;">${item.profile || ''}</p>
            <p class="block-text-paragraph">${item.synergy || ''}</p>
          </div>
          
          <div class="content-block-section" style="background: rgba(255,180,0,0.04); border-left-color: #ffb400;">
            <h5 class="section-header-inline">Application Steps</h5>
            <p class="block-text-paragraph">${item.steps || 'No custom tracking routine step registered.'}</p>
          </div>
        ` : `
          <div class="content-block-section">
            <h5 class="section-header-inline">Character Description</h5>
            <p class="block-text-paragraph">${item.description || 'No descriptive background log provided.'}</p>
          </div>
        `}

        <div>
          <h5 class="section-header-inline">${isBlend ? 'Alternative Options Owned' : 'Related Vault Entities'}</h5>
          <div class="details-badge-row">
            ${(isBlend ? item.alternatives : item.related_fragrances)?.map(name => {
              const match = this.masterIndex.find(x => x.name === name);
              return match 
                ? `<span class="clickable-badge direct-navigate-link" data-id="${match.id}" data-type="${match.type}" style="border-color: var(--accent-color); font-weight: bold;">${match.type === 'Blend' ? '🧪' : '🧴'} ${name}</span>`
                : `<span class="clickable-badge" data-category="search" data-value="${name}">${name}</span>`;
            }).join('') || '<span class="block-text-paragraph">None tracked</span>'}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('fragrance-explorer-card', FragranceExplorerCard);