/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 3.3: External Data + Search + Navigation Protection + Detail View
 */

import { FRAGRANCE_DATA } from '/local/community/fragrance-explorer-card/fragrance_data.js?v=3.3';

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
    
    // Core state tracking arrays
    this.navStack = [{ view: 'browser', value: null }];
    this.currentDepth = 1;
    this.exitTimer = null;
    this.backPressedOnce = false;

    // Filter state
    this.searchTerm = '';
    this.activeFilters = { season: new Set(), time_of_day: new Set(), occasion: new Set() };
    
    // Bind event handlers
    this._handlePopState = this._handlePopState.bind(this);
  }

  set hass(hass) { this._hass = hass; }
  setConfig(config) { this._config = config; }

  connectedCallback() {
    this._renderSkeleton();
    this._initNavigationEngine();
    window.addEventListener('popstate', this._handlePopState);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._handlePopState);
    if (this.exitTimer) clearTimeout(this.exitTimer);
  }

  /* --- Navigation Engine --- */
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
        // Go back to the main list
        this.navStack.pop();
        this.currentDepth = this.navStack.length;
        this.backPressedOnce = false; 
        this._renderCurrentView();
      } else {
        // Exit protection logic
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

  /* --- View Builders --- */
  _buildBrowserView() {
    const div = document.createElement('div');
    div.className = 'fade-in';
    
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
        html += `<button class="chip ${colorClass} ${isActive}" data-category="${category}" data-val="${opt}">
          <span class="chip-icon">${ICONS[opt]}</span> ${opt}
        </button>`;
      });
      html += `</div></div>`;
    }
    html += `</div><div id="results-list" class="scrollable-list"></div>`;
    div.innerHTML = html;

    // Attach listeners
    div.querySelector('#search-input').addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this._updateResultsList(div.querySelector('#results-list'));
    });

    div.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const cat = btn.getAttribute('data-category');
        const val = btn.getAttribute('data-val');
        if (this.activeFilters[cat].has(val)) { 
          this.activeFilters[cat].delete(val); 
          btn.classList.remove('active'); 
        } else { 
          this.activeFilters[cat].add(val); 
          btn.classList.add('active'); 
        }
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

    let listHtml = `<div class="results-count">${filtered.length} matches found</div>`;
    
    if (filtered.length === 0) {
      listHtml += `<div class="empty-state">No blends match your criteria.</div>`;
    } else {
      listHtml += `<div class="list-container">`;
      filtered.forEach(item => {
        const seasonIcon = ICONS[item.season] || '';
        const timeIcon = ICONS[item.time_of_day] || '';
        const occasionIcon = ICONS[item.occasion] || '';

        listHtml += `
          <button class="list-row combination-row" data-id="${item.id}">
            <div class="row-meta">
              <span class="row-name">${item.name}</span>
              <span class="row-rating">⭐ ${item.rating.toFixed(1)}</span>
            </div>
            <div class="row-tags">🧪 ${item.tags.join(' + ')}</div>
            <div class="row-context">${seasonIcon} ${item.season} &nbsp;•&nbsp; ${timeIcon} ${item.time_of_day} &nbsp;•&nbsp; ${occasionIcon} ${item.occasion}</div>
          </button>
        `;
      });
      listHtml += `</div>`;
    }

    containerElement.innerHTML = listHtml;

    containerElement.querySelectorAll('.combination-row').forEach(row => {
      row.addEventListener('click', () => {
        this._navigateForward('detail', parseInt(row.getAttribute('data-id')));
      });
    });
  }

  _buildCombinationDetailView(id) {
    const div = document.createElement('div');
    div.className = 'fade-in';
    const item = FRAGRANCE_DATA.find(f => f.id === id);

    if (!item) {
      div.innerHTML = `<div class="empty-state">Error loading mix template profile.</div>`;
      return div;
    }

    const sClass = `pill-${item.season.toLowerCase().replace(' ', '-')}`;
    const tClass = `pill-${item.time_of_day.toLowerCase().replace(' ', '-')}`;
    const oClass = `pill-${item.occasion.toLowerCase().replace(' ', '-')}`;

    div.innerHTML = `
      <div class="detail-header">
        <div class="detail-title">${item.name}</div>
        <div class="detail-badge-rating">⭐ ${item.rating.toFixed(1)}</div>
      </div>
      
      <div class="tag-pill-container">
        <span class="pill ${sClass}">${ICONS[item.season] || ''} ${item.season}</span>
        <span class="pill ${tClass}">${ICONS[item.time_of_day] || ''} ${item.time_of_day}</span>
        <span class="pill ${oClass}">${ICONS[item.occasion] || ''} ${item.occasion}</span>
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
        
        /* Search System */
        .search-container { margin-bottom: 12px; }
        #search-input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--divider-color, #444);
          background: var(--secondary-background-color, #2c2c2e);
          color: var(--primary-text-color, #fff);
          box-sizing: border-box;
          font-size: 14px;
        }
        #search-input:focus {
          outline: none;
          border-color: var(--accent-color, #0076ff);
        }

        /* Filter System Styles */
        .filters-container {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px dashed var(--divider-color, rgba(255,255,255,0.1));
        }
        .filter-group { margin-bottom: 12px; }
        .group-label {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--secondary-text-color, #8e8e93);
          margin-bottom: 6px;
        }
        .chip-container { display: flex; flex-wrap: wrap; gap: 6px; }
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
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .chip:active { transform: scale(0.95); }
        
        .chip.active { border-color: currentColor; }
        .chip-spring.active { background: rgba(52, 199, 89, 0.15); color: #34c759; }
        .chip-summer.active { background: rgba(255, 204, 0, 0.15); color: #ffcc00; }
        .chip-autumn.active { background: rgba(255, 149, 0, 0.15); color: #ff9500; }
        .chip-winter.active { background: rgba(88, 86, 214, 0.15); color: #5856d6; }
        .chip-day.active { background: rgba(90, 200, 250, 0.15); color: #5ac8fa; }
        .chip-night.active { background: rgba(142, 142, 147, 0.15); color: #aeaeb2; }
        .chip-casual.active { background: rgba(50, 173, 230, 0.15); color: #32ade6; }
        .chip-office.active { background: rgba(175, 82, 222, 0.15); color: #af52de; }
        .chip-evening.active { background: rgba(255, 45, 85, 0.15); color: #ff2d55; }
        .chip-formal.active { background: rgba(255, 59, 48, 0.15); color: #ff3b30; }

        /* List Area */
        .scrollable-list {
          flex: 1;
          overflow-y: auto;
          max-height: 400px;
          padding-right: 4px;
        }
        .scrollable-list::-webkit-scrollbar { width: 6px; }
        .scrollable-list::-webkit-scrollbar-thumb { background: var(--divider-color, #3a3a3c); border-radius: 4px; }
        .results-count { font-size: 11px; font-weight: 600; color: var(--secondary-text-color, #8e8e93); margin-bottom: 8px; text-align: right; }
        .list-container { display: flex; flex-direction: column; gap: 8px; }
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
        .list-row:active { background: var(--table-row-alternative-background-color, #3a3a3c); }
        .combination-row { flex-direction: column; align-items: flex-start; gap: 6px; }
        .row-meta { display: flex; justify-content: space-between; width: 100%; font-weight: 600; }
        .row-tags { font-size: 12px; color: var(--secondary-text-color, #8e8e93); }
        .row-context { font-size: 11px; color: var(--secondary-text-color, #8e8e93); margin-top: 2px; opacity: 0.9; font-weight: 500; }

        /* Detail View */
        .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .detail-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .detail-badge-rating {
          background: rgba(255, 159, 10, 0.2); color: #ff9f0a; padding: 4px 8px; border-radius: 6px; font-size: 13px; font-weight: 700;
        }
        .tag-pill-container { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
        .pill { background: var(--table-row-alternative-background-color, #3a3a3c); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--primary-text-color, #ffffff); }
        
        .pill-spring { background: rgba(52, 199, 89, 0.15); color: #34c759; }
        .pill-summer { background: rgba(255, 204, 0, 0.15); color: #ffcc00; }
        .pill-autumn { background: rgba(255, 149, 0, 0.15); color: #ff9500; }
        .pill-winter { background: rgba(88, 86, 214, 0.15); color: #5856d6; }
        .pill-all-seasons { background: rgba(142, 142, 147, 0.15); color: #aeaeb2; }
        .pill-day { background: rgba(90, 200, 250, 0.15); color: #5ac8fa; }
        .pill-night { background: rgba(142, 142, 147, 0.15); color: #aeaeb2; }
        .pill-all { background: rgba(142, 142, 147, 0.15); color: #aeaeb2; }
        .pill-casual { background: rgba(50, 173, 230, 0.15); color: #32ade6; }
        .pill-office { background: rgba(175, 82, 222, 0.15); color: #af52de; }
        .pill-evening { background: rgba(255, 45, 85, 0.15); color: #ff2d55; }
        .pill-formal { background: rgba(255, 59, 48, 0.15); color: #ff3b30; }

        .detail-section { margin-bottom: 14px; }
        .section-label { font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; color: var(--secondary-text-color, #8e8e93); margin-bottom: 4px; }
        .section-body-text { margin: 0; font-size: 14px; line-height: 1.4; color: var(--primary-text-color); }
        .ingredients-list { display: flex; flex-direction: column; gap: 4px; }
        .ingredient-item { font-size: 13px; font-weight: 600; }
        .steps-box { background: rgba(var(--accent-color-rgb), 0.08); border-left: 3px solid var(--accent-color, #0076ff); padding: 10px 12px; border-radius: 0 6px 6px 0; display: flex; flex-direction: column; gap: 6px; }
        .step-line { font-size: 13px; line-height: 1.35; }
        .empty-state { text-align: center; padding: 24px; color: var(--secondary-text-color); font-size: 13px; }
        
        /* Toast Notifications */
        .toast {
          position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%) translateY(100px);
          background: #323232; color: #ffffff; padding: 10px 16px; border-radius: 24px; font-size: 13px; font-weight: 500;
          pointer-events: none; opacity: 0; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s; z-index: 99; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        
        .fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div class="main-card-frame">
        <div id="view-port"></div>
        <div id="toast-box" class="toast"></div>
      </div>
    `;
  }
}

customElements.define('fragrance-explorer-card', FragranceExplorerCard);
