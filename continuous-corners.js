/* One SVG contour for every browser, including Safari without corner-shape.
 * Version 2026-10-08-single-surface-3: one translucent fill per surface.
 */
(() => {
  'use strict';

  const surfaceSelector = '.showcase-banner,.status-panel,section.plot,.stat,.comparison-panel,.runtime-settings,.continuation-settings,button:not(.timeline-node):not(.timeline-toggle):not(.drawer-toggle):not(.timeline-branch-toggle),.tooltip,.flow-control-row input[type=number],.continuation-settings input,.continuation-settings select,.history-selector select,.runtime-row input,.window-count input[type=number],#flowField';
  const mediaSelector = '.flow-viewport,.flow-canvas,.flow-image';
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const diagonal = 1 - Math.pow(0.5, 0.25);

  // A quarter of x^4 + y^4 = 1, split into cubic Hermite segments.
  // Mirroring the first half joins the diagonal with matching tangents.
  function cornerSegments() {
    const result = [];
    const steps = 12;
    const at = y => {
      const t = 1 - y;
      const q = 1 - Math.pow(t, 4);
      return { x: 1 - Math.pow(q, 0.25), y, slope: -Math.pow(t, 3) / Math.pow(q, 0.75) };
    };
    for (let i = 0; i < steps; i++) {
      const start = at(1 - (1 - diagonal) * i / steps);
      const end = at(1 - (1 - diagonal) * (i + 1) / steps);
      const delta = end.y - start.y;
      const c1 = { x: start.x + start.slope * delta / 3, y: start.y + delta / 3 };
      const c2 = { x: end.x - end.slope * delta / 3, y: end.y - delta / 3 };
      if (i === 0) {
        // Both handles share the vertical edge: zero curvature at its join.
        c2.x = 0;
        c2.y = end.y - end.x / end.slope;
      }
      result.push({ start, c1, c2, end });
    }
    const mirror = p => ({ x: p.y, y: p.x });
    for (const s of result.slice().reverse()) {
      result.push({ start: mirror(s.end), c1: mirror(s.c2), c2: mirror(s.c1), end: mirror(s.start) });
    }
    return result;
  }
  const unitCorner = cornerSegments();
  const number = value => Number(value.toFixed(6)).toString();

  function continuousPath(width, height, radius, inset = 0) {
    const w = Number(width), h = Number(height), requested = Number(radius), offset = Number(inset);
    if (![w, h, requested, offset].every(Number.isFinite) || w <= 0 || h <= 0) return '';
    const i = Math.min(Math.max(0, offset), w / 2, h / 2);
    const r = Math.max(0, Math.min(Math.max(0, requested), w / 2, h / 2) - i);
    const left = i, top = i, right = w - i, bottom = h - i;
    if (r === 0) return `M ${number(left)} ${number(top)} H ${number(right)} V ${number(bottom)} H ${number(left)} Z`;
    const commands = [`M ${number(left + r)} ${number(top)}`, `H ${number(right - r)}`];
    const appendCorner = transform => {
      for (const s of unitCorner) {
        const points = [s.c1, s.c2, s.end].map(transform);
        commands.push(`C ${points.map(p => `${number(p.x)} ${number(p.y)}`).join(' ')}`);
      }
    };
    appendCorner(p => ({ x: right - r * p.y, y: top + r * p.x }));
    commands.push(`V ${number(bottom - r)}`);
    appendCorner(p => ({ x: right - r * p.x, y: bottom - r * p.y }));
    commands.push(`H ${number(left + r)}`);
    appendCorner(p => ({ x: left + r * p.y, y: bottom - r * p.x }));
    commands.push(`V ${number(top + r)}`);
    appendCorner(p => ({ x: left + r * p.x, y: top + r * p.y }));
    commands.push('Z');
    return commands.join(' ');
  }

  function surfaceGeometry(style, fallbackWidth, fallbackHeight) {
    const pixels = value => Math.max(0, parseFloat(value) || 0);
    const borders = {
      top: pixels(style.borderTopWidth), right: pixels(style.borderRightWidth),
      bottom: pixels(style.borderBottomWidth), left: pixels(style.borderLeftWidth)
    };
    let width = parseFloat(style.width), height = parseFloat(style.height);
    if (style.boxSizing !== 'border-box') {
      width += pixels(style.paddingLeft) + pixels(style.paddingRight) + borders.left + borders.right;
      height += pixels(style.paddingTop) + pixels(style.paddingBottom) + borders.top + borders.bottom;
    }
    if (!(width > 0 && Number.isFinite(width))) width = fallbackWidth;
    if (!(height > 0 && Number.isFinite(height))) height = fallbackHeight;
    // Absolute inset:0 starts inside the parent's border. Negative border
    // widths move the glass pseudo-element back to the SVG border-box origin.
    const materialInset = [borders.top, borders.right, borders.bottom, borders.left]
      .map(value => `${number(-value)}px`).join(' ');
    return { width, height, borders, materialInset };
  }

  // A single glass contour for the rail and its centered lower-edge handle.
  function timelineSurfacePath(width, railHeight, handleWidth = 40, handleHeight = 20, inset = 0) {
    const w = Number(width), h = Number(railHeight), hw = Math.min(Number(handleWidth), w - 32), hh = Number(handleHeight), i = Number(inset);
    if (![w, h, hw, hh, i].every(Number.isFinite) || w <= 32 || h <= 0 || hw <= 0 || hh <= 0) return '';
    const left = i, top = i, right = w - i, bottom = h - i;
    const r = Math.max(0, Math.min(16, w / 2, h / 2) - i), hr = Math.max(0, hw / 2 - i);
    const handleLeft = (w - hw) / 2 + i, handleRight = (w + hw) / 2 - i;
    const commands = [`M ${number(left + r)} ${number(top)}`, `H ${number(right - r)}`];
    const corner = transform => {
      for (const segment of unitCorner) {
        const points = [segment.c1, segment.c2, segment.end].map(transform);
        commands.push(`C ${points.map(point => `${number(point.x)} ${number(point.y)}`).join(' ')}`);
      }
    };
    corner(point => ({ x: right - r * point.y, y: top + r * point.x }));
    commands.push(`V ${number(bottom - r)}`);
    corner(point => ({ x: right - r * point.x, y: bottom - r * point.y }));
    commands.push(`H ${number(handleRight)}`, `A ${number(hr)} ${number(hr)} 0 0 1 ${number(handleLeft)} ${number(bottom)}`, `H ${number(left + r)}`);
    corner(point => ({ x: left + r * point.y, y: bottom - r * point.x }));
    commands.push(`V ${number(top + r)}`);
    corner(point => ({ x: left + r * point.x, y: top + r * point.y }));
    commands.push('Z');
    return commands.join(' ');
  }

  // Allow a dependency-free numerical check without starting a browser.
  if (typeof document === 'undefined') {
    if (typeof module !== 'undefined') module.exports = { continuousPath, cornerSegments, timelineSurfacePath, surfaceGeometry };
    return;
  }

  function initialize() {
    const probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;background-color:var(--surface-material,var(--panel));text-decoration-color:color-mix(in srgb,var(--panel) 94%,transparent);border-top-color:var(--surface-line,var(--line));color:var(--fg);outline-color:var(--bg);border-bottom-color:var(--blue);border-right-color:var(--drawer-material);border-left-color:var(--surface-selected,var(--panel))';
    document.body.append(probe);
    let theme;
    function readTheme() {
      const style = getComputedStyle(probe);
      theme = { panel: style.backgroundColor, tooltip: style.textDecorationColor, line: style.borderTopColor, fg: style.color, bg: style.outlineColor, blue: style.borderBottomColor, drawer: style.borderRightColor || style.backgroundColor, selected: style.borderLeftColor || style.backgroundColor };
    }
    readTheme();

    const records = [];
    const byElement = new WeakMap();
    const parents = new Set();
    let mediaShadowId = 0;
    const escape = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    function addRecord(element, media) {
      if (element.classList.contains('showcase-dismiss')) return;
      // Read before the class replaces native radii. Hidden elements still have computed styles.
      const radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
      const record = { element, radius, media, overlay: null, lastKey: null };
      element.classList.add(media ? 'continuous-canvas' : 'continuous-surface');
      element.dataset.continuousCorners = 'svg-superellipse-4';
      if (media) {
        const parent = element.closest('.flow');
        if (parent) {
          const overlay = document.createElementNS(svgNamespace, 'svg');
          overlay.classList.add('continuous-flow-outline');
          overlay.setAttribute('aria-hidden', 'true');
          overlay.setAttribute('focusable', 'false');
          overlay.style.pointerEvents = 'none';
          overlay.setAttribute('hidden', '');
          overlay.style.display = 'none';
          const defs = document.createElementNS(svgNamespace, 'defs');
          const filter = document.createElementNS(svgNamespace, 'filter');
          filter.id = `continuousFlowShadow${mediaShadowId++}`;
          filter.setAttribute('filterUnits', 'userSpaceOnUse');
          for (const [name, attributes] of [
            ['feGaussianBlur', { in: 'SourceAlpha', stdDeviation: '7.5', result: 'blur' }],
            ['feOffset', { in: 'blur', dx: '0', dy: '3', result: 'offset' }],
            ['feFlood', { 'flood-color': 'var(--floating-shadow-color)', result: 'color' }],
            ['feComposite', { in: 'color', in2: 'offset', operator: 'in', result: 'shadow' }],
            ['feComposite', { in: 'shadow', in2: 'SourceAlpha', operator: 'out' }]
          ]) {
            const primitive = document.createElementNS(svgNamespace, name);
            for (const [key, value] of Object.entries(attributes)) primitive.setAttribute(key, value);
            filter.append(primitive);
          }
          defs.append(filter);
          const shadow = document.createElementNS(svgNamespace, 'path');
          shadow.setAttribute('fill', '#000');
          shadow.setAttribute('stroke', 'none');
          shadow.setAttribute('filter', `url(#${filter.id})`);
          const path = document.createElementNS(svgNamespace, 'path');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke-width', '.7');
          overlay.append(defs, shadow, path);
          parent.append(overlay);
          record.overlay = overlay;
          record.outline = path;
          record.shadow = shadow;
          record.shadowFilter = filter;
          record.parent = parent;
          parents.add(parent);
        }
      }
      records.push(record);
      byElement.set(element, record);
    }
    document.querySelectorAll(surfaceSelector).forEach(element => addRecord(element, false));
    document.querySelectorAll(mediaSelector).forEach(element => {
      // A flow viewport owns its children's silhouette; two nested clip paths
      // with different origins would reproduce the same material mismatch.
      if (!element.classList.contains('flow-viewport') && element.closest('.flow-viewport')) return;
      addRecord(element, true);
    });

    const drawerShell = document.getElementById('taskDrawerShell');
    const drawerToggle = document.getElementById('taskDrawerToggle');
    let drawerOutline = null, drawerOutlinePath = null, drawerShadowPath = null, drawerOutlineKey = null, drawerMaterial = null;
    if (drawerShell && drawerToggle) {
      drawerMaterial = document.createElement('div');
      drawerMaterial.classList.add('drawer-material-surface');
      drawerMaterial.setAttribute('aria-hidden', 'true');
      drawerShell.prepend(drawerMaterial);
      drawerOutline = document.createElementNS(svgNamespace, 'svg');
      drawerOutline.classList.add('drawer-outline');
      drawerOutline.setAttribute('aria-hidden', 'true');
      drawerOutline.setAttribute('focusable', 'false');
      drawerOutline.style.pointerEvents = 'none';
      // Cast the joined silhouette, then remove its interior from the shadow.
      // The translucent material can still sample the page behind it.
      const defs = document.createElementNS(svgNamespace, 'defs');
      const filter = document.createElementNS(svgNamespace, 'filter');
      filter.id = 'drawerSilhouetteShadow';
      filter.setAttribute('x', '-30%');
      filter.setAttribute('y', '-10%');
      filter.setAttribute('width', '160%');
      filter.setAttribute('height', '120%');
      const primitive = (name, attributes) => {
        const element = document.createElementNS(svgNamespace, name);
        for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
        filter.append(element);
      };
      primitive('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: '7.5', result: 'blur' });
      primitive('feOffset', { in: 'blur', dx: '0', dy: '3', result: 'offset' });
      primitive('feFlood', { 'flood-color': 'var(--drawer-shadow)', result: 'color' });
      primitive('feComposite', { in: 'color', in2: 'offset', operator: 'in', result: 'shadow' });
      primitive('feComposite', { in: 'shadow', in2: 'SourceAlpha', operator: 'out' });
      defs.append(filter);
      drawerShadowPath = document.createElementNS(svgNamespace, 'path');
      drawerShadowPath.setAttribute('fill', '#000');
      drawerShadowPath.setAttribute('stroke', 'none');
      drawerShadowPath.setAttribute('filter', 'url(#drawerSilhouetteShadow)');
      drawerOutline.append(defs, drawerShadowPath);
      drawerOutlinePath = document.createElementNS(svgNamespace, 'path');
      drawerOutlinePath.setAttribute('fill', 'none');
      drawerOutlinePath.setAttribute('stroke', 'var(--drawer-outline)');
      drawerOutlinePath.setAttribute('stroke-width', '1');
      drawerOutlinePath.setAttribute('vector-effect', 'non-scaling-stroke');
      drawerOutline.append(drawerOutlinePath);
      drawerShell.append(drawerOutline);
    }
    function renderDrawerOutline() {
      if (!drawerOutline) return;
      const width = drawerToggle.offsetWidth, height = drawerShell.clientHeight, handleHeight = drawerToggle.offsetHeight;
      if (!(width > 0 && height > 0 && handleHeight > 0)) { drawerOutline.style.display = 'none'; return; }
      const radius = parseFloat(getComputedStyle(drawerToggle).borderTopRightRadius) || 20;
      const key = [width, height, handleHeight, radius, drawerShell.clientWidth].join('|');
      if (key === drawerOutlineKey) return;
      const inset = .5, right = width - inset;
      const top = (height - handleHeight) / 2 + inset, bottom = (height + handleHeight) / 2 - inset;
      const r = Math.max(0, Math.min(radius, width / 2, handleHeight / 2) - inset);
      const edge = width - 36 + 5 - inset;
      const commands = [`M ${number(edge)} ${number(inset)}`, `V ${number(top)}`, `H ${number(right - r)}`];
      const appendCorner = (transform, target = commands) => {
        for (const segment of unitCorner) {
          const points = [segment.c1, segment.c2, segment.end].map(transform);
          target.push(`C ${points.map(point => `${number(point.x)} ${number(point.y)}`).join(' ')}`);
        }
      };
      appendCorner(point => ({ x: right - r * point.y, y: top + r * point.x }));
      commands.push(`V ${number(bottom - r)}`);
      appendCorner(point => ({ x: right - r * point.x, y: bottom - r * point.y }));
      commands.push(`H ${number(edge)}`, `V ${number(height - inset)}`);
      drawerOutline.setAttribute('viewBox', `0 0 ${number(width)} ${number(height)}`);
      drawerOutline.setAttribute('width', number(width));
      drawerOutline.setAttribute('height', number(height));
      drawerOutline.style.display = '';
      drawerOutlinePath.setAttribute('d', commands.join(' '));
      const left = width - 36 - drawerShell.clientWidth;
      drawerShadowPath.setAttribute('d', `M ${number(left)} ${number(inset)} H ${number(edge)} ${commands.slice(1).join(' ')} H ${number(left)} Z`);
      // One glass layer covers the complete silhouette. Its coordinates are the
      // outline's local coordinates translated to the drawer's left edge.
      const shift = -left;
      const materialCommands = [`M 0 ${number(inset)}`, `H ${number(edge + shift)}`, `V ${number(top)}`, `H ${number(right - r + shift)}`];
      appendCorner(point => ({ x: right - r * point.y + shift, y: top + r * point.x }), materialCommands);
      materialCommands.push(`V ${number(bottom - r)}`);
      appendCorner(point => ({ x: right - r * point.x + shift, y: bottom - r * point.y }), materialCommands);
      materialCommands.push(`H ${number(edge + shift)}`, `V ${number(height - inset)}`, 'H 0 Z');
      const materialClip = `path("${materialCommands.join(' ')}")`;
      drawerMaterial.style.clipPath = materialClip;
      drawerMaterial.style.webkitClipPath = materialClip;
      drawerOutlineKey = key;
    }
    renderDrawerOutline();

    const timeline = document.getElementById('calculationTimeline'), timelineNodes = document.getElementById('timelineNodes'), branchToggle = document.getElementById('timelineBranchToggle');
    let timelineMaterial = null, timelineOutline = null, timelineShadowPath = null, timelineOutlinePath = null, timelineSurfaceKey = null;
    if (timeline && timelineNodes && branchToggle) {
      timelineMaterial = document.createElement('div');
      timelineMaterial.className = 'timeline-material-surface';
      timelineMaterial.setAttribute('aria-hidden', 'true');
      timelineOutline = document.createElementNS(svgNamespace, 'svg');
      timelineOutline.classList.add('timeline-material-outline');
      timelineOutline.setAttribute('aria-hidden', 'true');
      timelineOutline.setAttribute('focusable', 'false');
      const defs = document.createElementNS(svgNamespace, 'defs'), filter = document.createElementNS(svgNamespace, 'filter');
      filter.id = 'timelineSilhouetteShadow';
      for (const [key, value] of Object.entries({ x: '-10%', y: '-60%', width: '120%', height: '220%' })) filter.setAttribute(key, value);
      for (const [name, attributes] of [
        ['feGaussianBlur', { in: 'SourceAlpha', stdDeviation: '7.5', result: 'blur' }],
        ['feOffset', { in: 'blur', dx: '0', dy: '3', result: 'offset' }],
        ['feFlood', { 'flood-color': 'var(--floating-shadow-color)', result: 'color' }],
        ['feComposite', { in: 'color', in2: 'offset', operator: 'in', result: 'shadow' }],
        ['feComposite', { in: 'shadow', in2: 'SourceAlpha', operator: 'out' }]
      ]) {
        const primitive = document.createElementNS(svgNamespace, name);
        for (const [key, value] of Object.entries(attributes)) primitive.setAttribute(key, value);
        filter.append(primitive);
      }
      defs.append(filter);
      timelineShadowPath = document.createElementNS(svgNamespace, 'path');
      timelineShadowPath.setAttribute('fill', '#000');
      timelineShadowPath.setAttribute('filter', 'url(#timelineSilhouetteShadow)');
      timelineOutlinePath = document.createElementNS(svgNamespace, 'path');
      timelineOutlinePath.setAttribute('fill', 'none');
      timelineOutlinePath.setAttribute('stroke', 'none');
      timelineOutlinePath.setAttribute('stroke-width', '.7');
      timelineOutline.append(defs, timelineShadowPath, timelineOutlinePath);
      timeline.querySelector('.timeline-floating').prepend(timelineMaterial, timelineOutline);
    }
    function renderTimelineSurface() {
      if (!timelineMaterial || timeline.hidden || timeline.dataset.collapsed === 'true') return;
      const width = timelineNodes.offsetWidth, height = timelineNodes.offsetHeight, left = timelineNodes.offsetLeft, handleWidth = branchToggle.offsetWidth, handleHeight = branchToggle.offsetHeight - 1;
      const key = [width, height, left, handleWidth, handleHeight].join('|');
      if (key === timelineSurfaceKey) return;
      const path = timelineSurfacePath(width, height, handleWidth, handleHeight);
      if (!path) return;
      const totalHeight = height + handleHeight;
      timelineMaterial.style.left = timelineOutline.style.left = `${left}px`;
      timelineMaterial.style.width = timelineOutline.style.width = `${width}px`;
      timelineMaterial.style.height = timelineOutline.style.height = `${totalHeight}px`;
      const clip = `path("${path}")`;
      timelineMaterial.style.clipPath = timelineMaterial.style.webkitClipPath = clip;
      timelineOutline.setAttribute('viewBox', `0 0 ${number(width)} ${number(totalHeight)}`);
      timelineShadowPath.setAttribute('d', path);
      timelineOutlinePath.setAttribute('d', timelineSurfacePath(width, height, handleWidth, handleHeight, .35));
      timelineSurfaceKey = key;
    }
    renderTimelineSurface();

    function render(record) {
      const element = record.element;
      const rect = element.getBoundingClientRect();
      // Computed dimensions retain fractional layout pixels, while excluding
      // entrance/hover transforms. Every surface layer uses this border box.
      const computed = getComputedStyle(element);
      const geometry = surfaceGeometry(computed, element.offsetWidth, element.offsetHeight);
      const { width, height } = geometry;
      const visible = !element.hidden && element.offsetWidth > 0 && element.offsetHeight > 0;
      if (!visible) {
        if (record.overlay) {
          record.overlay.setAttribute('hidden', '');
          record.overlay.style.display = 'none';
        }
        record.lastKey = null;
        return;
      }
      if (record.media) {
        const path = continuousPath(width, height, record.radius);
        const clip = `path("${path}")`;
        element.style.setProperty('--continuous-clip', clip);
        if (element.style.clipPath !== clip) element.style.clipPath = clip;
        if (element.style.webkitClipPath !== clip) element.style.webkitClipPath = clip;
        if (record.overlay) {
          const origin = record.parent.getBoundingClientRect();
          const overlay = record.overlay;
          overlay.removeAttribute('hidden');
          overlay.style.display = 'block';
          overlay.style.left = `${rect.left - origin.left - record.parent.clientLeft + record.parent.scrollLeft}px`;
          overlay.style.top = `${rect.top - origin.top - record.parent.clientTop + record.parent.scrollTop}px`;
          overlay.style.width = `${width}px`;
          overlay.style.height = `${height}px`;
          overlay.setAttribute('viewBox', `0 0 ${number(width)} ${number(height)}`);
          record.shadow.setAttribute('d', path);
          record.shadowFilter.setAttribute('x', '-32');
          record.shadowFilter.setAttribute('y', '-32');
          record.shadowFilter.setAttribute('width', number(width + 64));
          record.shadowFilter.setAttribute('height', number(height + 64));
          record.outline.setAttribute('d', continuousPath(width, height, record.radius, 0.35));
          record.outline.setAttribute('stroke', theme.line);
        }
        return;
      }
      const pressed = element.tagName === 'BUTTON' && element.getAttribute('aria-pressed') === 'true';
      const edgeHandle = element.classList.contains('drawer-toggle');
      const selected = element.tagName === 'BUTTON' && element.getAttribute('aria-current') === 'true';
      const statusPanel = element.classList.contains('status-panel');
      const fill = statusPanel ? getComputedStyle(element).getPropertyValue('--status-panel-color').trim() : edgeHandle ? theme.drawer : element.classList.contains('tooltip') ? theme.tooltip : selected || pressed ? theme.selected : theme.panel;
      const stroke = edgeHandle ? theme.drawer : "none";
      const strokeWidth = edgeHandle ? .7 : 0;
      if (edgeHandle) {
        // Clip the glass layer to the same contour as its SVG surface.
        const clip = `path("${continuousPath(width, height, record.radius)}")`;
        if (element.style.clipPath !== clip) element.style.clipPath = clip;
        if (element.style.webkitClipPath !== clip) element.style.webkitClipPath = clip;
      }
      element.style.setProperty('--continuous-material-inset', geometry.materialInset);
      const key = [width, height, record.radius, fill, stroke, strokeWidth, theme.fg, geometry.materialInset].join('|');
      if (record.lastKey === key) return;
      element.style.setProperty('--continuous-clip', `path("${continuousPath(width, height, record.radius)}")`);
      const path = continuousPath(width, height, record.radius, strokeWidth / 2);
      let svg = `<svg xmlns="${svgNamespace}" width="${number(width)}" height="${number(height)}" viewBox="0 0 ${number(width)} ${number(height)}"><path d="${path}" fill="${escape(fill)}" stroke="${escape(stroke)}" stroke-width="${strokeWidth}"/>`;
      if (element.tagName === 'SELECT') {
        const x = width - 16, y = height / 2;
        svg += `<path d="M ${number(x - 4)} ${number(y - 2)} L ${number(x)} ${number(y + 2)} L ${number(x + 4)} ${number(y - 2)}" fill="none" stroke="${escape(theme.fg)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      svg += '</svg>';
      element.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      element.style.backgroundSize = '100% 100%';
      element.style.backgroundRepeat = 'no-repeat';
      element.style.backgroundOrigin = 'border-box';
      element.style.backgroundClip = 'border-box';
      record.lastKey = key;
    }

    const pending = new Set();
    let frame = 0;
    function schedule(record) {
      if (record) pending.add(record);
      else records.forEach(item => pending.add(item));
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const batch = Array.from(pending);
        pending.clear();
        batch.forEach(render);
      });
    }
    let resize;
    if (typeof ResizeObserver !== 'undefined') {
      resize = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === timelineNodes || entry.target === branchToggle) { renderTimelineSurface(); continue; }
          if (entry.target === drawerShell || entry.target === drawerToggle) renderDrawerOutline();
          if (entry.target === drawerShell) continue;
          if (parents.has(entry.target)) records.filter(record => record.media).forEach(schedule);
          else schedule(byElement.get(entry.target));
        }
      });
      records.forEach(record => resize.observe(record.element));
      parents.forEach(parent => resize.observe(parent));
      if (drawerOutline) resize.observe(drawerShell);
      if (timelineOutline) { resize.observe(timelineNodes); resize.observe(branchToggle); }
    }
    const mutations = new MutationObserver(entries => {
      for (const entry of entries) schedule(byElement.get(entry.target));
    });
    records.forEach(record => mutations.observe(record.element, {
      attributes: true,
      attributeFilter: ['hidden', 'aria-pressed', 'aria-current', 'disabled', 'data-state']
    }));
    if (timelineOutline) new MutationObserver(renderTimelineSurface).observe(timeline, { attributes: true, attributeFilter: ['hidden', 'data-collapsed', 'data-mode', 'data-tree', 'style'] });
    // The recent-calculation sidebar receives new buttons after each data fetch.
    window.dashboardRefreshCorners = root => {
      (root || document).querySelectorAll(surfaceSelector).forEach(element => {
        if (byElement.has(element)) return;
        addRecord(element, false);
        const record = byElement.get(element);
        if (resize) resize.observe(element);
        mutations.observe(element, { attributes: true, attributeFilter: ['hidden', 'aria-pressed', 'aria-current', 'disabled', 'data-state'] });
        schedule(record);
      });
    };
    window.addEventListener('resize', () => { schedule(); renderDrawerOutline(); renderTimelineSurface(); }, { passive: true });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themeChanged = () => { readTheme(); schedule(); };
    if (scheme.addEventListener) scheme.addEventListener('change', themeChanged);
    else scheme.addListener(themeChanged);
    schedule();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
