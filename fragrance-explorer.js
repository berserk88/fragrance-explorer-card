/**
 * Fragrance Explorer Custom Lovelace Card
 * Version 4.2: Unified Index, Isolated Cross-Linking, and Defensive Rendering
 */

import { fragranceCombinations } from '/local/community/fragrance-explorer-card/fragrance_combinations.js?v=4.2';
import { individualFragrances } from '/local/community/fragrance-explorer-card/individual_fragrances.js?v=4.2';

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
    this.ratingFilter = { type: '', min: '' };
    this.activeFilters = { season: new Set(), time_of_day: new Set(), occasion: new Set() };
    
    // Defensive initialization to prevent spreading crashes if files are empty/corrupted
    const rawCombos = Array.isArray(fragranceCombinations) ? fragranceCombinations : [];
    const rawFrags = Array.isArray(individualFragrances) ? individualFragrances : [];

    this.masterData = [
      ...rawCombos.map(item => ({ ...item, _type: 'combo' })),
      ...rawFrags.map(item => ({ ...item, _type: 'frag' }))
    ];

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
        this.navStack.pop();
        this.currentDepth = this.navStack.length;
        this.backPressedOnce = false; 
        this._renderCurrentView();
      } else {
        if (!this.backPressedOnce) {
          this.backPressedOnce = true;
          this._showToastMessage("Press back again to exit");
          window.history.pushState({ app: this.sessionStateKey, depth: 1 }, '');
          this.currentDepth = 1;
          this.exitTimer = setTimeout(() => { this.backPressedOnce = false; }, 4000);
        } else {
          if (this.exitTimer) clearTimeout(this.exitTimer);
          window.history.go(-2); // Safely clear out of the protective stack cushion layer
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
    } else if (activeState.view === 'combo-detail') {
      container.appendChild(this._buildComboDetailView(activeState.value));
    } else if (activeState.view === 'frag-detail') {
      container.appendChild(this._buildFragDetailView(activeState.value));
    }
  }

  /* --- Two-Pass Token Isolation Hyperlink Engine --- */
  _autoLinkText(text) {
    if (!text || typeof text !== 'string') return text || '';
    let linkedText = text;
    
    const rawCombos = Array.isArray(fragranceCombinations) ? fragranceCombinations : [];
    const rawFrags = Array.isArray(individualFragrances) ? individualFragrances : [];

    // Sort descending by string length to guarantee longest names process first
    const allEntities = [
      ...rawFrags.map(f => ({ name: f.name, id: f.id, type: 'frag' })),
      ...rawCombos.map(c => ({ name: c.name, id: c.id, type: 'combo' }))
    ].filter(e => e.name).sort((a, b) => b.name.length - a.name.length);

    const tokens = [];

    // First Pass: Match exact names, escape special characters, and assign neutral string tokens
    allEntities.forEach(entity => {
      const escapedName = entity.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedName, 'gi');
      
      linkedText = linkedText.replace(regex, (match) => {
        const token = `##FRAG_TOKEN_${tokens.length}##`;
        tokens.push({
          token: token,
          html: `<span class="internal-link" data-type="${entity.type}" data-id="${entity.id}">${match}</span>`
        });
        return token;
      });
    });

    // Second Pass: Rehydrate tokens in reverse order to eliminate DOM nesting corruption
    for (let i = tokens.length - 1; i >= 0; i--) {
      linkedText = linkedText.replace(tokens[i].token, tokens[i].html);
    }

    return linkedText;
  }

  _attachLinkListeners(container) {
    if (!container) return;
    container.querySelectorAll('.internal-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = e.currentTarget.getAttribute('data-type');
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        if (type && !isNaN(id)) {
          this._navigateForward(`${type}-detail`, id);
        }
      });
    });
  }

  /* --- View Builders --- */
  _buildBrowserView() {
    const div = document.createElement('div');
    div.className = 'fade-in';
    
    let html = `
      <div class="header-title">Fragrance Database</div>
      
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search brands, notes, families..." value="${this.searchTerm}">
      </div>

      <div class="rating-filter-container">
        <select id="rating-type">
          <option value="" ${this.ratingFilter.type === '' ? 'selected' : ''}>Filter by Rating...</option>
          <option value="rating" ${this.ratingFilter.type === 'rating' ? 'selected' : ''}>Overall (Blends)</option>
          <option value="projection rating" ${this.ratingFilter.type === 'projection rating' ? 'selected' : ''}>Projection</option>
          <option value="longevity rating" ${this.ratingFilter.type === 'longevity rating' ? 'selected' : ''}>Longevity</option>
          <option value="compliment_factor rating" ${this.ratingFilter.type === 'compliment_factor rating' ? 'selected' : ''}>Compliments</option>
          <option value="complexity rating" ${this.ratingFilter.type === 'complexity rating' ? 'selected' : ''}>Complexity (Blends)</option>
          <option value="versatility rating" ${this.ratingFilter.type === 'versatility rating' ? 'selected' : ''}>Versatility (Frags)</option>
        </select>
        <input type="number" id="rating-min" step="0.1" min="0" max="5" placeholder="Min (e.g. 4.3)" value="${this.ratingFilter.min}">
      </div>

      <div class="filters-container">`;
    
    for (const [category, options] of Object.entries(FILTER_CATEGORIES)) {
      html += `<div class="filter-group"><div class="group-label">${category.replace('_', ' ')}</div><div class="chip-container">`;
      options.forEach(opt => {
        const isActive = this.activeFilters[category].has(opt) ? 'active' : '';
        const colorClass = `chip-${opt.toLowerCase().replace(' ', '-')}`;
        html += `<button class="chip ${colorClass} ${isActive}" data-category="${category}" data-val="${opt}">
          <span class="chip-icon">${ICONS[opt] || ''}</span> ${opt}
        </button>`;
      });
      html += `</div></div>`;
    }
    html += `</div><div id="results-list" class="scrollable-list"></div>`;
    div.innerHTML = html;

    div.querySelector('#search-input').addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this._updateResultsList(div.querySelector('#results-list'));
    });

    div.querySelector('#rating-type').addEventListener('change', (e) => {
      this.ratingFilter.type = e.target.value;
      this._updateResultsList(div.querySelector('#results-list'));
    });

    div.querySelector('#rating-min').addEventListener('input', (e) => {
      this.ratingFilter.min = parseFloat(e.target.value) || '';
      this._updateResultsList(div.querySelector('#results-list'));
    });

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

    const filtered = (this.masterData || []).filter(item => {
      if (!item) return false;

      // 1. Hardened Search Parameters Checking
      let matchSearch = false;
      if (this.searchTerm === '') { matchSearch = true; } 
      else {
        const needle = this.searchTerm;
        if (item._type === 'combo') {
          matchSearch = (item.name || '').toLowerCase().includes(needle) || 
                        (item.tags || []).some(t => String(t).toLowerCase().includes(needle)) ||
                        (item.fragrances || []).some(f => String(f).toLowerCase().includes(needle));
        } else {
          matchSearch = (item.name || '').toLowerCase().includes(needle) || 
                        (item.fragrance_family || '').toLowerCase().includes(needle) ||
                        (item.dominant_notes || []).some(n => String(n).toLowerCase().includes(needle));
        }
      }

      // 2. Sealed Rating Parameter Bounds Evaluator
      let matchRating = true;
      if (this.ratingFilter.type && this.ratingFilter.min !== '') {
        const val = parseFloat(item[this.ratingFilter.type]);
        if (isNaN(val) || val < this.ratingFilter.min) { matchRating = false; }
      }

      // 3. Category Matrix Setup
      let matchSeason = true, matchTime = true, matchOccasion = true;
      
      if (this.activeFilters.season.size > 0) {
        if (item._type === 'combo') matchSeason = this.activeFilters.season.has(item.season) || item.season === 'All Seasons';
        if (item._type === 'frag') matchSeason = Array.from(this.activeFilters.season).some(s => (item.seasons || []).includes(s));
      }

      if (this.activeFilters.time_of_day.size > 0) {
        if (item._type === 'combo') matchTime = this.activeFilters.time_of_day.has(item.time_of_day) || item.time_of_day === 'All';
        if (item._type === 'frag') {
          const reqDay = this.activeFilters.time_of_day.has('Day') && parseFloat(item.day_score || 0) >= 4.0;
          const reqNight = this.activeFilters.time_of_day.has('Night') && parseFloat(item.night_score || 0) >= 4.0;
          matchTime = reqDay || reqNight;
        }
      }

      if (this.activeFilters.occasion.size > 0) {
        if (item._type === 'combo') matchOccasion = this.activeFilters.occasion.has(item.occasion);
        if (item._type === 'frag') {
          matchOccasion = Array.from(this.activeFilters.occasion).some(occ => {
            return parseFloat(item[`${occ.toLowerCase()}_score`] || 0) >= 4.0;
          });
        }
      }

      return matchSearch && matchRating && matchSeason && matchTime && matchOccasion;
    });

    let listHtml = `<div class="results-count">${filtered.length} matches verified</div>`;
    
    if (filtered.length === 0) {
      listHtml += `<div class="empty-state">No profiles or combination layouts match selected filters.</div>`;
    } else {
      listHtml += `<div class="list-container">`;
      filtered.forEach(item => {
        const typeIcon = item._type === 'combo' ? '🧪' : '🧴';
        const typeLabel = item._type === 'combo' ? 'Blend' : 'Fragrance';
        const rawScore = item.rating !== undefined ? item.rating : item['projection rating'];
        const formattedScore = typeof rawScore === 'number' ? rawScore.toFixed(1) : parseFloat(rawScore || 0).toFixed(1);
        
        listHtml += `
          <button class="list-row list-row-clickable" data-type="${item._type}" data-id="${item.id}">
            <div class="row-meta">
              <span class="row-name">${typeIcon} ${(item.name || 'Unnamed')}</span>
              <span class="row-rating">⭐ ${formattedScore}</span>
            </div>
            <div class="row-tags">${item._type === 'combo' ? (item.tags || []).join(' • ') : (item.fragrance_family || 'Unclassified')}</div>
            <div class="row-context">${typeLabel}</div>
          </button>
        `;
      });
      listHtml += `</div>`;
    }

    containerElement.innerHTML = listHtml;

    containerElement.querySelectorAll('.list-row-clickable').forEach(row => {
      row.addEventListener('click', () => {
        this._navigateForward(`${row.getAttribute('data-type')}-detail`, parseInt(row.getAttribute('data-id'), 10));
      });
    });
  }

  _buildComboDetailView(id) {
    const div = document.createElement('div');
    div.className = 'fade-in';
    const item = this.masterData.find(f => f.id === id && f._type === 'combo');
    if (!item) return div;

    const sClass = `pill-${(item.season || '').toLowerCase().replace(' ', '-')}`;
    const tClass = `pill-${(item.time_of_day || '').toLowerCase().replace(' ', '-')}`;
    const oClass = `pill-${(item.occasion || '').toLowerCase().replace(' ', '-')}`;

    div.innerHTML = `
      <div class="detail-header">
        <div class="detail-title">🧪 ${(item.name || 'Unnamed Blend')}</div>
        <div class="detail-badge-rating">⭐ ${parseFloat(item.rating || 0).toFixed(1)}</div>
      </div>
      
      <div class="tag-pill-container">
        <span class="pill ${sClass}">${ICONS[item.season] || ''} ${item.season || 'Any'}</span>
        <span class="pill ${tClass}">${ICONS[item.time_of_day] || ''} ${item.time_of_day || 'Any'}</span>
        <span class="pill ${oClass}">${ICONS[item.occasion] || ''} ${item.occasion || 'Casual'}</span>
      </div>

      <div class="ratings-grid">
        <div class="rating-box"><div class="rb-val">${parseFloat(item['projection rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Projection</div></div>
        <div class="rating-box"><div class="rb-val">${parseFloat(item['longevity rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Longevity</div></div>
        <div class="rating-box"><div class="rb-val">${parseFloat(item['compliment_factor rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Compliments</div></div>
        <div class="rating-box"><div class="rb-val">${parseFloat(item['complexity rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Complexity</div></div>
      </div>

      <div class="detail-section">
        <div class="section-label">Composition Elements</div>
        <div class="ingredients-list">
          ${(item.fragrances || []).map(f => `<div class="ingredient-item">🧴 ${this._autoLinkText(f)}</div>`).join('')}
        </div>
      </div>

      <div class="detail-section">
        <div class="section-label">Olfactory Profile & Synergy</div>
        <p class="section-body-text">${this._autoLinkText(item.profile || '')}</p>
        <p class="section-body-text synergy-text"><em>Synergy Profile:</em> ${this._autoLinkText(item.synergy || '')}</p>
      </div>

      <div class="detail-section">
        <div class="section-label">Application Mapping Sequence</div>
        <div class="steps-box">${(item.steps || '').split('\n').map(step => `<div class="step-line">${this._autoLinkText(step)}</div>`).join('')}</div>
      </div>
      
      ${item.alternatives && item.alternatives.length > 0 ? `
      <div class="detail-section">
        <div class="section-label">Alternatives</div>
        <p class="section-body-text">${item.alternatives.map(alt => this._autoLinkText(alt)).join('<br>')}</p>
      </div>` : ''}
    `;

    this._attachLinkListeners(div);
    return div;
  }

  _buildFragDetailView(id) {
    const div = document.createElement('div');
    div.className = 'fade-in';
    const item = this.masterData.find(f => f.id === id && f._type === 'frag');
    if (!item) return div;

    div.innerHTML = `
      <div class="detail-header">
        <div class="detail-title">🧴 ${(item.name || 'Unknown Item')}</div>
      </div>
      
      <div class="frag-meta-row">
        <strong>Family:</strong> ${(item.fragrance_family || 'Unmapped')} <br>
        <strong>Type:</strong> ${(item.clone_type || 'Original Formulation')} <br>
        <strong>Inspiration:</strong> ${this._autoLinkText(item.inspiration || '')}
      </div>

      <div class="ratings-grid">
        <div class="rating-box"><div class="rb-val">${parseFloat(item['projection rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Projection</div></div>
        <div class="rating-box"><div class="rb-val">${parseFloat(item['longevity rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Longevity</div></div>
        <div class="rating-box"><div class="rb-val">${parseFloat(item['compliment_factor rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Compliments</div></div>
        <div class="rating-box"><div class="rb-val">${parseFloat(item['versatility rating'] || 0).toFixed(1)}</div><div class="rb-lbl">Versatility</div></div>
      </div>

      <div class="detail-section">
        <div class="section-label">Dominant Notes</div>
        <div class="tag-pill-container" style="margin-bottom:0;">
          ${(item.dominant_notes || []).map(note => `<span class="pill pill-casual">${note}</span>`).join('')}
        </div>
      </div>

      <div class="detail-section">
        <div class="section-label">Performance & Architecture Analysis</div>
        <p class="section-body-text">${this._autoLinkText(item.description || '')}</p>
      </div>
      
      <div class="detail-section">
        <div class="section-label">Situation Scenario Target Values</div>
        <div class="scores-grid">
          <div>Day: <strong>${parseFloat(item.day_score || 0).toFixed(1)}</strong></div>
          <div>Night: <strong>${parseFloat(item.night_score || 0).toFixed(1)}</strong></div>
          <div>Office: <strong>${parseFloat(item.office_score || 0).toFixed(1)}</strong></div>
          <div>Formal: <strong>${parseFloat(item.formal_score || 0).toFixed(1)}</strong></div>
          <div>Casual: <strong>${parseFloat(item.casual_score || 0).toFixed(1)}</strong></div>
          <div>Evening: <strong>${parseFloat(item.evening_score || 0).toFixed(1)}</strong></div>
        </div>
      </div>

      ${item.related_fragrances && item.related_fragrances.length > 0 ? `
      <div class="detail-section">
        <div class="section-label">Related Fragrances</div>
        <p class="section-body-text">${item.related_fragrances.map(rel => this._autoLinkText(rel)).join(', ')}</p>
      </div>` : ''}
    `;

    this._attachLinkListeners(div);
    return div;
  }

  _showToastMessage(msg) {
    let container = this.shadowRoot.getElementById('toast-box');
    if (!container) return;
    container.textContent = msg;
    container.className = "toast show";
    setTimeout(() => { container.className = "toast"; }, 2500);
  }

  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .main-card-frame {
          background: var(--ha-card-background, #1c1c1e); border-radius: 12px;
          color: var(--primary-text-color, #ffffff); padding: 16px; min-height: 450px;
          position: relative; overflow: hidden; display: flex; flex-direction: column;
        }
        .header-title { font-size: 20px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 12px; }
        
        /* Inputs & Filters */
        .search-container { margin-bottom: 8px; }
        .rating-filter-container { display: flex; gap: 8px; margin-bottom: 12px; }
        input[type="text"], input[type="number"], select {
          padding: 10px; border-radius: 8px; border: 1px solid #444; background: #2c2c2e; color: #fff; font-size: 13px; box-sizing: border-box; outline: none;
        }
        input[type="text"] { width: 100%; }
        select { flex: 2; } input[type="number"] { flex: 1; }
        
        /* Chips */
        .filters-container { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed rgba(255,255,255,0.1); }
        .filter-group { margin-bottom: 12px; }
        .group-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #8e8e93; margin-bottom: 6px; }
        .chip-container { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip { background: #2c2c2e; border: 1px solid #3a3a3c; color: #fff; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }
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

        /* List Items */
        .scrollable-list { flex: 1; overflow-y: auto; max-height: 400px; }
        .results-count { font-size: 11px; font-weight: 600; color: #8e8e93; text-align: right; margin-bottom: 8px; }
        .list-container { display: flex; flex-direction: column; gap: 8px; }
        .list-row { background: #2c2c2e; border: none; border-radius: 6px; padding: 12px 16px; text-align: left; color: #fff; display: flex; flex-direction: column; gap: 6px; cursor: pointer; }
        .list-row:active { background: #3a3a3c; }
        .row-meta { display: flex; justify-content: space-between; font-weight: 600; font-size: 14px; }
        .row-tags { font-size: 12px; color: #8e8e93; }
        .row-context { font-size: 11px; color: #0076ff; font-weight: 600; text-transform: uppercase; }

        /* Detail Views */
        .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .detail-title { font-size: 20px; font-weight: 800; line-height: 1.2; }
        .detail-badge-rating { background: rgba(255, 159, 10, 0.2); color: #ff9f0a; padding: 4px 8px; border-radius: 6px; font-size: 13px; font-weight: 700; }
        .tag-pill-container { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
        .pill { background: #3a3a3c; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; color: #fff; }
        
        .ratings-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .rating-box { background: #2c2c2e; padding: 10px 4px; border-radius: 8px; text-align: center; border: 1px solid #3a3a3c; }
        .rb-val { font-size: 16px; font-weight: 800; color: #ff9f0a; margin-bottom: 2px; }
        .rb-lbl { font-size: 9px; text-transform: uppercase; font-weight: 700; color: #8e8e93; }

        .detail-section { margin-bottom: 14px; }
        .section-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #8e8e93; margin-bottom: 6px; }
        .section-body-text { margin: 0; font-size: 13px; line-height: 1.5; color: #eee; }
        .synergy-text { margin-top: 6px; padding-left: 8px; border-left: 2px solid #5ac8fa; color: #ccc; }
        .frag-meta-row { background: #2c2c2e; padding: 10px; border-radius: 8px; font-size: 13px; line-height: 1.6; margin-bottom: 16px; }
        .scores-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; font-size: 12px; background: #2c2c2e; padding: 10px; border-radius: 8px; }
        
        .ingredient-item { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
        .steps-box { background: rgba(0, 118, 255, 0.08); border-left: 3px solid #0076ff; padding: 10px; border-radius: 0 6px 6px 0; }
        .step-line { font-size: 13px; margin-bottom: 8px; line-height: 1.4; white-space: pre-wrap; }
        .empty-state { text-align: center; padding: 24px; color: #8e8e93; font-size: 13px; }
        
        /* Auto-Link Styling */
        .internal-link { color: #0076ff; text-decoration: underline; cursor: pointer; font-weight: 600; transition: opacity 0.2s; }
        .internal-link:active { opacity: 0.6; }
        
        /* Toast Notifications */
        .toast { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%) translateY(100px); background: #323232; color: #fff; padding: 10px 16px; border-radius: 24px; font-size: 13px; opacity: 0; transition: all 0.3s; z-index: 99; white-space: nowrap; }
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