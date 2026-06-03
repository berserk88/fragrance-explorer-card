/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 3.1: Search Bar Integration + Faceted Filtering
 */

import { FRAGRANCE_DATA } from '/local/community/fragrance-explorer-card/fragrance_data.js?v=3.1';

// ... (Keep ICONS and FILTER_CATEGORIES exactly as they were)
const ICONS = {
  'Spring': '🌸', 'Summer': '☀️', 'Autumn': '🍂', 'Winter': '❄️', 'All Seasons': '🌍',
  'Day': '🌅', 'Night': '🌃', 'All': '🌗',
  'Casual': '👕', 'Office': '💼', 'Evening': '🍸', 'Formal': '👔'
};

const FILTER_CATEGORIES = {
  season: ['Spring', 'Summer', 'Autumn', 'Winter'],
  time_of_day: ['Day', 'Night'],
  occasion: ['Casual', 'Office', 'Evening', 'Formal']
};

class FragranceExplorerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.searchTerm = ''; // New State: Search String
    this.activeFilters = { season: new Set(), time_of_day: new Set(), occasion: new Set() };
  }

  // ... (Keep set hass, setConfig, connectedCallback, disconnectedCallback, _initNavigationEngine, _navigateForward, _handlePopState, _renderCurrentView same as before)

  _buildBrowserView() {
    const div = document.createElement('div');
    div.className = 'fade-in';
    
    // 1. Search & Filter Header
    let html = `
      <div class="header-title">Fragrance Blends</div>
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search by name or fragrance..." value="${this.searchTerm}">
      </div>
      <div class="filters-container">`;
    
    for (const [category, options] of Object.entries(FILTER_CATEGORIES)) {
      html += `<div class="filter-group"><div class="group-label">${category.replace('_', ' ')}</div><div class="chip-container">`;
      options.forEach(opt => {
        const isActive = this.activeFilters[category].has(opt) ? 'active' : '';
        const colorClass = `chip-${opt.toLowerCase().replace(' ', '-')}`;
        html += `<button class="chip ${colorClass} ${isActive}" data-category="${category}" data-val="${opt}"><span class="chip-icon">${ICONS[opt]}</span> ${opt}</button>`;
      });
      html += `</div></div>`;
    }
    html += `</div><div id="results-list" class="scrollable-list"></div>`;
    div.innerHTML = html;

    // Listen for typing
    div.querySelector('#search-input').addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this._updateResultsList(div.querySelector('#results-list'));
    });

    // Chip click listeners
    div.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const cat = btn.getAttribute('data-category');
        const val = btn.getAttribute('data-val');
        if (this.activeFilters[cat].has(val)) { this.activeFilters[cat].delete(val); btn.classList.remove('active'); }
        else { this.activeFilters[cat].add(val); btn.classList.add('active'); }
        this._updateResultsList(div.querySelector('#results-list'));
      });
    });

    this._updateResultsList(div.querySelector('#results-list'));
    return div;
  }

  _updateResultsList(containerElement) {
    if (!containerElement) return;

    const filtered = FRAGRANCE_DATA.filter(item => {
      const matchSearch = this.searchTerm === '' || 
                          item.name.toLowerCase().includes(this.searchTerm) || 
                          item.tags.some(t => t.toLowerCase().includes(this.searchTerm));
      const matchSeason = this.activeFilters.season.size === 0 || this.activeFilters.season.has(item.season) || item.season === 'All Seasons';
      const matchTime = this.activeFilters.time_of_day.size === 0 || this.activeFilters.time_of_day.has(item.time_of_day) || item.time_of_day === 'All';
      const matchOccasion = this.activeFilters.occasion.size === 0 || this.activeFilters.occasion.has(item.occasion);

      return matchSearch && matchSeason && matchTime && matchOccasion;
    });

    // ... (Keep existing rendering logic for the list items here)
    // Be sure to include the CSS for the search-input inside _renderSkeleton()
  }

  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>
        /* ... existing styles ... */
        .search-container { margin-bottom: 12px; }
        #search-input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--divider-color);
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          box-sizing: border-box;
        }
      </style>
      <div class="main-card-frame"><div id="view-port"></div><div id="toast-box" class="toast"></div></div>
    `;
  }
}