class PixelTreeCanvas {
  constructor(canvasElement, nodeItems, riskSections, nodeLinks = []) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.nodes = nodeItems;
    this.sections = riskSections;
    this.links = nodeLinks;

    this.virtualWidth = 1200;
    this.virtualHeight = 2850;

    this.bgImage = null;
    this.hasBgImage = false;
    this.defaultBgImage = null;
    this.hasDefaultBgImage = false;

    this.mouse = { x: 0, y: 0, canvasX: 0, canvasY: 0, targetX: 0, targetY: 0 };
    this.hoveredNode = null;
    this.hoveredLink = null;
    this.hoveredControl = null;
    this.draggedNode = null;
    this.draggedDivider = null;
    this.draggedControl = null;
    this.dragOffset = { x: 0, y: 0 };
    this.suppressClick = false;

    this.isAdminMode = false;
    this.isEditNodePosMode = false;
    this.isLinkEditMode = false;

    this.pendingLink = null;
    this.selectedLink = null;
    this.selectedNode = null;
    this.draftLinkStyle = null;

    this.isSwapMode = false;
    this.swapSourceNode = null;

    this.particles = [];
    this.onNodeClickCallback = null;
    this.onNodeHoverCallback = null;
    this.onNodePositionChanged = null;
    this.onDividerChanged = null;
    this.onLinksChanged = null;
    this.onLinkSelected = null;

    this.animFrame = null;
    this.time = 0;
    this.isPaused = false;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
    this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

    this.initParticles();
    this.animate();
  }

  setBackgroundImage(imageSource) {
    if (!imageSource) {
      this.bgImage = null;
      this.hasBgImage = false;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.bgImage = img;
      this.hasBgImage = true;
    };
    img.src = imageSource;
  }

  setDefaultBackgroundImage(imageSource) {
    if (!imageSource) return;
    const img = new Image();
    img.onload = () => {
      this.defaultBgImage = img;
      this.hasDefaultBgImage = true;
    };
    img.src = imageSource;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = this.virtualHeight;
  }

  pause() {
    this.isPaused = true;
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.animate();
  }

  getNodeById(id) {
    return this.nodes.find(n => n.id === id) || null;
  }

  getNodeCanvasPos(node) {
    const parallaxX = this.isAdminMode ? 0 : this.mouse.x * 0.2;
    const parallaxY = this.isAdminMode ? 0 : this.mouse.y * 0.2;
    const x = node.relX * this.canvas.width + parallaxX;
    const y = node.relY + parallaxY;
    return { x, y };
  }

  canvasToRel(x, y) {
    return {
      relX: Math.max(0.02, Math.min(0.98, x / this.canvas.width)),
      relY: Math.max(50, Math.min(this.virtualHeight - 50, y))
    };
  }

  relToCanvas(pt) {
    const parallaxX = this.isAdminMode ? 0 : this.mouse.x * 0.2;
    const parallaxY = this.isAdminMode ? 0 : this.mouse.y * 0.2;
    return {
      x: pt.relX * this.canvas.width + parallaxX,
      y: pt.relY + parallaxY
    };
  }

  getLinkAnchorPoints(link, extraPreviewPoint = null) {
    const from = this.getNodeById(link.fromId);
    const to = this.getNodeById(link.toId);
    if (!from) return [];

    const pts = [this.getNodeCanvasPos(from)];
    (link.points || []).forEach(p => pts.push(this.relToCanvas(p)));
    if (extraPreviewPoint) pts.push(extraPreviewPoint);
    if (to) pts.push(this.getNodeCanvasPos(to));
    return pts;
  }

  notifyLinksChanged() {
    if (this.onLinksChanged) this.onLinksChanged(this.links);
  }

  notifyLinkSelected() {
    if (this.onLinkSelected) this.onLinkSelected(this.selectedLink);
  }

  nodeAccentColor(node) {
    if (!node) return "#00ff9d";
    if (node.customColor) return node.customColor;
    if (node.isSpecial || node.isEditable) return "#00e5ff";
    if (node.tier === "high") return "#ffb700";
    if (node.tier === "unacceptable") return "#ff2a6d";
    return "#00ff9d";
  }

  getDefaultNodeColor(node) {
    if (!node) return "#00ff9d";
    if (node.isSpecial || node.isEditable) return "#00e5ff";
    if (node.tier === "high") return "#ffb700";
    if (node.tier === "unacceptable") return "#ff2a6d";
    return "#00ff9d";
  }

  rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }

  applyDefaultNodeGradient() {
    const totalHeight = this.virtualHeight;
    const d1 = RISK_DIVIDERS.dividerY1;
    const d2 = RISK_DIVIDERS.dividerY2;

    const green = { r: 0, g: 255, b: 157 };
    const yellow = { r: 255, g: 183, b: 0 };
    const red = { r: 255, g: 42, b: 109 };

    this.nodes.forEach(node => {
      const y = node.relY;
      let color;

      if (y <= d1) {
        const t = d1 === 0 ? 0 : y / d1;
        color = {
          r: green.r + (yellow.r - green.r) * t,
          g: green.g + (yellow.g - green.g) * t,
          b: green.b + (yellow.b - green.b) * t
        };
      } else if (y <= d2) {
        const t = (d2 - d1) === 0 ? 0 : (y - d1) / (d2 - d1);
        color = {
          r: yellow.r + (red.r - yellow.r) * t,
          g: yellow.g + (red.g - yellow.g) * t,
          b: yellow.b + (red.b - yellow.b) * t
        };
      } else {
        const t = (totalHeight - d2) === 0 ? 1 : Math.min(1, (y - d2) / (totalHeight - d2));
        color = {
          r: red.r,
          g: Math.max(0, red.g - red.g * t * 0.5),
          b: red.b + (120 - red.b) * t * 0.6
        };
      }

      node.customColor = this.rgbToHex(color.r, color.g, color.b);
      node.isSpecial = false;
    });

    if (this.onNodePositionChanged) {
      this.nodes.forEach(n => this.onNodePositionChanged(n));
    }
  }

  defaultLinkStyle(fromNode, toNode = null) {
    const colorStart = this.nodeAccentColor(fromNode);
    const colorEnd = this.nodeAccentColor(toNode || fromNode);
    return {
      color: colorStart,
      colorStart,
      colorEnd,
      gradient: true,
      gradientMode: "nodes",
      width: 3,
      glow: 14,
      opacity: 0.9,
      dash: 0,
      animated: true
    };
  }

  resolveLinkStyle(link, fromNode = null, toNode = null) {
    const from = fromNode || (link ? this.getNodeById(link.fromId) : this.selectedNode);
    const to = toNode || (link ? this.getNodeById(link.toId) : null);
    const base = this.defaultLinkStyle(from, to);
    const raw = (link && link.style) || this.draftLinkStyle || {};
    const style = { ...base, ...raw };

    const hasGradientFields = !!(raw.gradientMode || raw.colorStart || raw.colorEnd);
    if (!hasGradientFields && raw.color) {
      style.gradient = false;
      style.gradientMode = "custom";
      style.colorStart = raw.color;
      style.colorEnd = raw.color;
      style.color = raw.color;
      return style;
    }

    if (style.gradientMode !== "custom") {
      style.gradientMode = "nodes";
      style.gradient = style.gradient !== false;
      style.colorStart = this.nodeAccentColor(from);
      style.colorEnd = this.nodeAccentColor(to || from);
      style.color = style.colorStart;
    } else {
      style.colorStart = style.colorStart || style.color || base.colorStart;
      style.colorEnd = style.colorEnd || style.colorStart;
      style.color = style.colorStart;
    }

    if (!style.gradient) {
      style.colorEnd = style.colorStart;
    }

    return style;
  }

  hexToRgb(hex) {
    if (!hex) return { r: 0, g: 255, b: 157 };
    let h = String(hex).replace("#", "").trim();
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    if (h.length !== 6) return { r: 0, g: 255, b: 157 };
    const n = parseInt(h, 16);
    if (Number.isNaN(n)) return { r: 0, g: 255, b: 157 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  lerpColor(a, b, t) {
    const A = this.hexToRgb(a);
    const B = this.hexToRgb(b);
    const u = Math.max(0, Math.min(1, t));
    const r = Math.round(A.r + (B.r - A.r) * u);
    const g = Math.round(A.g + (B.g - A.g) * u);
    const bl = Math.round(A.b + (B.b - A.b) * u);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 40;
    this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 20;

    this.mouse.canvasX = clientX;
    this.mouse.canvasY = clientY;

    if (this.draggedDivider && this.isAdminMode) {
      const newY = Math.max(200, Math.min(this.virtualHeight - 200, this.mouse.canvasY));

      if (this.draggedDivider === 'divider1') {
        RISK_DIVIDERS.dividerY1 = Math.min(newY, RISK_DIVIDERS.dividerY2 - 150);
      } else if (this.draggedDivider === 'divider2') {
        RISK_DIVIDERS.dividerY2 = Math.max(newY, RISK_DIVIDERS.dividerY1 + 150);
      }

      updateRiskSectionRanges();

      if (this.onDividerChanged) {
        this.onDividerChanged(RISK_DIVIDERS);
      }
      return;
    }

    if (this.draggedControl && this.isAdminMode) {
      const rel = this.canvasToRel(this.mouse.canvasX, this.mouse.canvasY);
      const link = this.links.find(l => l.id === this.draggedControl.linkId);
      if (link && link.points[this.draggedControl.pointIndex]) {
        link.points[this.draggedControl.pointIndex].relX = rel.relX;
        link.points[this.draggedControl.pointIndex].relY = rel.relY;
        this.notifyLinksChanged();
      }
      return;
    }

    if (this.draggedNode && this.isAdminMode) {
      const newX = (this.mouse.canvasX - this.dragOffset.x) / this.canvas.width;
      const newY = this.mouse.canvasY - this.dragOffset.y;

      this.draggedNode.relX = Math.max(0.02, Math.min(0.98, newX));
      this.draggedNode.relY = Math.max(50, Math.min(this.virtualHeight - 50, newY));

      if (this.onNodePositionChanged) {
        this.onNodePositionChanged(this.draggedNode);
      }
      return;
    }

    let foundHover = null;
    for (const node of this.nodes) {
      const pos = this.getNodeCanvasPos(node);
      const dist = Math.hypot(this.mouse.canvasX - pos.x, this.mouse.canvasY - pos.y);
      if (dist <= 26) {
        foundHover = node;
        break;
      }
    }

    if (foundHover !== this.hoveredNode) {
      this.hoveredNode = foundHover;
      if (this.onNodeHoverCallback) {
        this.onNodeHoverCallback(foundHover);
      }
    }

    this.hoveredControl = this.findControlAt(this.mouse.canvasX, this.mouse.canvasY);
    this.hoveredLink = foundHover ? null : this.findLinkAt(this.mouse.canvasX, this.mouse.canvasY);

    if (this.isAdminMode && !this.draggedNode && !this.draggedDivider && !this.draggedControl) {
      const distD1 = Math.abs(this.mouse.canvasY - RISK_DIVIDERS.dividerY1);
      const distD2 = Math.abs(this.mouse.canvasY - RISK_DIVIDERS.dividerY2);

      if (this.hoveredControl) {
        this.canvas.style.cursor = "grab";
      } else if (distD1 <= 15 || distD2 <= 15) {
        this.canvas.style.cursor = "ns-resize";
      } else if (this.isSwapMode) {
        this.canvas.style.cursor = foundHover ? "move" : "not-allowed";
      } else if (foundHover) {
        this.canvas.style.cursor = this.isLinkEditMode ? "cell" : "pointer";
      } else if (this.isLinkEditMode) {
        this.canvas.style.cursor = this.pendingLink ? "crosshair" : "cell";
      } else if (this.hoveredLink) {
        this.canvas.style.cursor = "pointer";
      } else {
        this.canvas.style.cursor = "crosshair";
      }
    }
  }

  findControlAt(x, y) {
    if (!this.isAdminMode) return null;
    const linksToCheck = this.selectedLink
      ? [this.selectedLink, ...this.links.filter(l => l.id !== this.selectedLink.id)]
      : this.links;

    for (const link of linksToCheck) {
      const points = link.points || [];
      for (let i = 0; i < points.length; i++) {
        const p = this.relToCanvas(points[i]);
        if (Math.hypot(x - p.x, y - p.y) <= 12) {
          return { linkId: link.id, pointIndex: i };
        }
      }
    }
    return null;
  }

  findLinkAt(x, y, threshold = 10) {
    let best = null;
    let bestDist = threshold;
    for (const link of this.links) {
      const samples = this.sampleLink(link, 48);
      for (const s of samples) {
        const d = Math.hypot(x - s.x, y - s.y);
        if (d < bestDist) {
          bestDist = d;
          best = link;
        }
      }
    }
    return best;
  }

  sampleLink(link, steps = 40, extraPreviewPoint = null) {
    const pts = this.getLinkAnchorPoints(link, extraPreviewPoint);
    if (pts.length < 2) return [];
    const samples = [];
    for (let i = 0; i <= steps; i++) {
      samples.push(this.pointOnSpline(pts, i / steps));
    }
    return samples;
  }

  pointOnSpline(pts, t) {
    if (pts.length === 1) return pts[0];
    if (t <= 0) return pts[0];
    if (t >= 1) return pts[pts.length - 1];
    const segCount = pts.length - 1;
    const scaled = t * segCount;
    const i = Math.min(segCount - 1, Math.floor(scaled));
    const localT = scaled - i;
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    return this.catmullRom(p0, p1, p2, p3, localT);
  }

  catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
      y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
    };
  }

  handleMouseDown(e) {
    if (!this.isAdminMode) return;
    if (e.button !== 0) return;

    const distD1 = Math.abs(this.mouse.canvasY - RISK_DIVIDERS.dividerY1);
    const distD2 = Math.abs(this.mouse.canvasY - RISK_DIVIDERS.dividerY2);

    if (!this.isLinkEditMode) {
      if (distD1 <= 18) {
        this.draggedDivider = 'divider1';
        this.canvas.style.cursor = "ns-resize";
        return;
      } else if (distD2 <= 18) {
        this.draggedDivider = 'divider2';
        this.canvas.style.cursor = "ns-resize";
        return;
      }
    }

    const control = this.findControlAt(this.mouse.canvasX, this.mouse.canvasY);
    if (control) {
      this.draggedControl = control;
      this.selectedLink = this.links.find(l => l.id === control.linkId) || this.selectedLink;
      this.notifyLinkSelected();
      this.canvas.style.cursor = "grabbing";
      this.suppressClick = true;
      return;
    }

    if (this.isLinkEditMode) return;

    for (const node of this.nodes) {
      const pos = this.getNodeCanvasPos(node);
      const dist = Math.hypot(this.mouse.canvasX - pos.x, this.mouse.canvasY - pos.y);
      if (dist <= 28) {
        this.draggedNode = node;
        this.dragOffset.x = this.mouse.canvasX - pos.x;
        this.dragOffset.y = this.mouse.canvasY - pos.y;
        this.canvas.style.cursor = "grabbing";
        break;
      }
    }
  }

  handleMouseUp(e) {
    if (this.draggedNode || this.draggedDivider || this.draggedControl) {
      this.draggedNode = null;
      this.draggedDivider = null;
      this.draggedControl = null;
      this.canvas.style.cursor = this.isLinkEditMode ? "crosshair" : "crosshair";
      this.suppressClick = true;
      setTimeout(() => { this.suppressClick = false; }, 40);
    }
  }

  handleClick(e) {
    if (this.suppressClick) return;

    if (this.isAdminMode && this.isLinkEditMode) {
      this.handleLinkModeClick();
      return;
    }

    if (this.isAdminMode && this.hoveredLink && !this.hoveredNode) {
      this.selectedLink = this.hoveredLink;
      this.selectedNode = null;
      this.notifyLinkSelected();
      return;
    }

    if (this.hoveredNode) {
      if (this.isAdminMode) {
        this.selectedNode = this.hoveredNode;
        this.selectedLink = null;
        this.notifyLinkSelected();
      }
      if (this.onNodeClickCallback) {
        this.onNodeClickCallback(this.hoveredNode);
      }
    } else if (this.isAdminMode && !this.hoveredNode && !this.hoveredLink && !this.hoveredControl) {
      this.selectedLink = null;
      this.selectedNode = null;
      this.notifyLinkSelected();
    }
  }

  swapNodeData(nodeA, nodeB) {
    const fieldsToSwap = [
      "title", "tier", "content", "isSpecial", "isEditable",
      "customColor", "group", "tags"
    ];

    const tmp = {};
    fieldsToSwap.forEach(f => { tmp[f] = nodeA[f]; });
    fieldsToSwap.forEach(f => { nodeA[f] = nodeB[f]; });
    fieldsToSwap.forEach(f => { nodeB[f] = tmp[f]; });

    if (this.onNodePositionChanged) {
      this.onNodePositionChanged(nodeA);
      this.onNodePositionChanged(nodeB);
    }
  }

  startSwapModeWithNode(sourceNode) {
    if (!this.isAdminMode || !sourceNode) return false;
    if (this.isLinkEditMode) return false;
    this.isSwapMode = true;
    this.swapSourceNode = sourceNode;
    this.selectedNode = sourceNode;
    this.pendingLink = null;
    return true;
  }

  tryCompleteSwapWithHovered() {
    if (!this.isSwapMode || !this.swapSourceNode) return false;
    const targetNode = this.hoveredNode;
    if (!targetNode) return false;
    if (targetNode.id === this.swapSourceNode.id) return false;

    this.swapNodeData(this.swapSourceNode, targetNode);
    this.cancelSwapMode();
    return true;
  }

  cancelSwapMode() {
    this.isSwapMode = false;
    this.swapSourceNode = null;
  }

  handleLinkModeClick() {
    const node = this.hoveredNode;

    if (node) {
      this.selectedNode = node;

      if (!this.pendingLink) {
        this.pendingLink = { fromId: node.id, points: [] };
        this.selectedLink = null;
        if (!this.draftLinkStyle) this.draftLinkStyle = this.defaultLinkStyle(node);
        this.notifyLinkSelected();
        return;
      }

      if (node.id === this.pendingLink.fromId) {
        this.notifyLinkSelected();
        return;
      }

      this.completePendingLink(node.id);
      return;
    }

    if (this.pendingLink) {
      const rel = this.canvasToRel(this.mouse.canvasX, this.mouse.canvasY);
      this.pendingLink.points.push(rel);
      return;
    }

    if (this.hoveredLink) {
      this.selectedLink = this.hoveredLink;
      this.selectedNode = null;
      this.notifyLinkSelected();
      return;
    }

    this.selectedLink = null;
    this.selectedNode = null;
    this.notifyLinkSelected();
  }

  completePendingLink(toId) {
    const fromNode = this.getNodeById(this.pendingLink.fromId);
    const points = [...this.pendingLink.points];

    if (points.length === 0 && fromNode) {
      const toNode = this.getNodeById(toId);
      if (toNode) {
        const mx = (fromNode.relX + toNode.relX) / 2;
        const my = (fromNode.relY + toNode.relY) / 2;
        const dx = toNode.relX - fromNode.relX;
        const dy = (toNode.relY - fromNode.relY) / this.canvas.width;
        const offset = 0.06;
        points.push({
          relX: Math.max(0.04, Math.min(0.96, mx - dy * offset * 8)),
          relY: my + dx * 80
        });
      }
    }

    const nextId = this.links.length > 0 ? Math.max(...this.links.map(l => l.id)) + 1 : 1;
    const toNode = this.getNodeById(toId);
    const style = { ...(this.draftLinkStyle || this.defaultLinkStyle(fromNode, toNode)) };
    if (style.gradientMode !== "custom") {
      Object.assign(style, this.defaultLinkStyle(fromNode, toNode), {
        width: style.width,
        glow: style.glow,
        opacity: style.opacity,
        dash: style.dash,
        animated: style.animated,
        gradient: style.gradient !== false,
        gradientMode: "nodes"
      });
    }

    const link = {
      id: nextId,
      fromId: this.pendingLink.fromId,
      toId,
      points,
      style
    };

    this.links.push(link);
    this.pendingLink = null;
    this.selectedLink = link;
    this.selectedNode = toNode;
    this.notifyLinksChanged();
    this.notifyLinkSelected();
  }

  addCurvePointFromHotkey() {
    if (!this.isAdminMode || !this.isLinkEditMode) return false;

    const node = this.hoveredNode || this.selectedNode;
    const rel = node
      ? { relX: node.relX, relY: node.relY }
      : this.canvasToRel(this.mouse.canvasX, this.mouse.canvasY);

    if (this.pendingLink) {
      const atFromNode = node && node.id === this.pendingLink.fromId;
      this.pendingLink.points.push(
        atFromNode
          ? this.canvasToRel(this.mouse.canvasX, this.mouse.canvasY)
          : rel
      );
      return true;
    }

    if (this.selectedLink) {
      const insertAt = this.findInsertIndex(this.selectedLink, rel);
      this.selectedLink.points.splice(insertAt, 0, rel);
      this.notifyLinksChanged();
      this.notifyLinkSelected();
      return true;
    }

    if (node) {
      this.pendingLink = { fromId: node.id, points: [] };
      this.selectedNode = node;
      this.selectedLink = null;
      if (!this.draftLinkStyle) this.draftLinkStyle = this.defaultLinkStyle(node);
      this.notifyLinkSelected();
      return true;
    }

    return false;
  }

  applyDefaultGradientToAll(extraStyle = null) {
    this.links.forEach(link => {
      const from = this.getNodeById(link.fromId);
      const to = this.getNodeById(link.toId);
      const prev = link.style || {};
      const defaults = this.defaultLinkStyle(from, to);
      const shared = extraStyle || this.draftLinkStyle || {};
      link.style = {
        ...defaults,
        width: shared.width ?? prev.width ?? defaults.width,
        glow: shared.glow ?? prev.glow ?? defaults.glow,
        opacity: shared.opacity ?? prev.opacity ?? defaults.opacity,
        dash: shared.dash ?? prev.dash ?? defaults.dash,
        animated: shared.animated ?? prev.animated ?? defaults.animated,
        gradient: true,
        gradientMode: "nodes"
      };
    });
    this.notifyLinksChanged();
    this.notifyLinkSelected();
  }

  applyDefaultGradientToSelected() {
    const link = this.selectedLink;
    if (!link) return;
    const from = this.getNodeById(link.fromId);
    const to = this.getNodeById(link.toId);
    const prev = link.style || {};
    link.style = {
      ...prev,
      ...this.defaultLinkStyle(from, to),
      width: prev.width ?? 3,
      glow: prev.glow ?? 14,
      opacity: prev.opacity ?? 0.9,
      dash: prev.dash ?? 0,
      animated: prev.animated !== false,
      gradient: true,
      gradientMode: "nodes"
    };
    this.draftLinkStyle = { ...link.style };
    this.notifyLinksChanged();
    this.notifyLinkSelected();
  }

  handleDoubleClick(e) {
    if (!this.isAdminMode) return;
    e.preventDefault();

    const control = this.findControlAt(this.mouse.canvasX, this.mouse.canvasY);
    if (control) {
      const link = this.links.find(l => l.id === control.linkId);
      if (link && link.points.length > 1) {
        link.points.splice(control.pointIndex, 1);
        this.selectedLink = link;
        this.notifyLinksChanged();
        this.notifyLinkSelected();
      }
      return;
    }

    const link = this.findLinkAt(this.mouse.canvasX, this.mouse.canvasY, 14);
    if (link) {
      const rel = this.canvasToRel(this.mouse.canvasX, this.mouse.canvasY);
      const insertAt = this.findInsertIndex(link, rel);
      link.points.splice(insertAt, 0, rel);
      this.selectedLink = link;
      this.notifyLinksChanged();
      this.notifyLinkSelected();
    }
  }

  findInsertIndex(link, rel) {
    const from = this.getNodeById(link.fromId);
    const to = this.getNodeById(link.toId);
    if (!from || !to) return link.points.length;

    const pts = [from, ...link.points, to];
    let bestI = 0;
    let bestD = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i].relX;
      const ay = pts[i].relY;
      const bx = pts[i + 1].relX;
      const by = pts[i + 1].relY;
      const d = this.distToSegment(rel.relX, rel.relY, ax, ay / 1000, bx, by / 1000);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    }
    return bestI;
  }

  distToSegment(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const ab2 = abx * abx + aby * aby || 1;
    let t = (apx * abx + apy * aby) / ab2;
    t = Math.max(0, Math.min(1, t));
    const qx = ax + abx * t;
    const qy = ay + aby * t;
    return Math.hypot(px - qx, py - qy);
  }

  handleContextMenu(e) {
    if (!this.isAdminMode) return;
    e.preventDefault();

    if (this.pendingLink) {
      if (this.pendingLink.points.length > 0) {
        this.pendingLink.points.pop();
      } else {
        this.pendingLink = null;
      }
      return;
    }

    const control = this.findControlAt(this.mouse.canvasX, this.mouse.canvasY);
    if (control) {
      const link = this.links.find(l => l.id === control.linkId);
      if (link && link.points.length > 1) {
        link.points.splice(control.pointIndex, 1);
        this.notifyLinksChanged();
      }
    }
  }

  deleteSelectedLink() {
    if (!this.selectedLink) return;
    const idx = this.links.findIndex(l => l.id === this.selectedLink.id);
    if (idx !== -1) this.links.splice(idx, 1);
    this.selectedLink = null;
    this.notifyLinksChanged();
    this.notifyLinkSelected();
  }

  removeLinksForNode(nodeId) {
    for (let i = this.links.length - 1; i >= 0; i--) {
      if (this.links[i].fromId === nodeId || this.links[i].toId === nodeId) {
        this.links.splice(i, 1);
      }
    }
    if (this.selectedLink && (this.selectedLink.fromId === nodeId || this.selectedLink.toId === nodeId)) {
      this.selectedLink = null;
      this.notifyLinkSelected();
    }
    this.notifyLinksChanged();
  }

  cancelPendingLink() {
    this.pendingLink = null;
    this.notifyLinkSelected();
  }

  setLinkEditMode(on) {
    this.isLinkEditMode = !!on;
    if (!on) {
      this.pendingLink = null;
      this.selectedNode = null;
    }
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 90; i++) {
      const y = Math.random() * this.virtualHeight;
      let color = "#00ff9d";

      if (y > RISK_DIVIDERS.dividerY1 && y <= RISK_DIVIDERS.dividerY2) color = "#ffb700";
      else if (y > RISK_DIVIDERS.dividerY2) color = "#ff2a6d";

      this.particles.push({
        x: Math.random() * this.virtualWidth,
        y: y,
        size: Math.floor(Math.random() * 3) + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        color: color
      });
    }
  }

  drawBackgroundImageAndShader() {
    const w = this.canvas.width;
    const h = this.virtualHeight;

    if (this.hasBgImage && this.bgImage) {
      this.ctx.drawImage(this.bgImage, 0, 0, w, h);
    } else if (this.hasDefaultBgImage && this.defaultBgImage) {
      this.ctx.drawImage(this.defaultBgImage, 0, 0, w, h);
    } else {
      const baseGradient = this.ctx.createLinearGradient(0, 0, 0, h);
      baseGradient.addColorStop(0, '#04120c');
      baseGradient.addColorStop(0.4, '#1a1202');
      baseGradient.addColorStop(1, '#21020d');
      this.ctx.fillStyle = baseGradient;
      this.ctx.fillRect(0, 0, w, h);
    }

    this.ctx.save();
    const y1Rel = RISK_DIVIDERS.dividerY1 / h;
    const y2Rel = RISK_DIVIDERS.dividerY2 / h;

    const shaderGrad = this.ctx.createLinearGradient(0, 0, 0, h);
    shaderGrad.addColorStop(0, 'rgba(0, 255, 157, 0.18)');
    shaderGrad.addColorStop(y1Rel, 'rgba(255, 183, 0, 0.20)');
    shaderGrad.addColorStop(y2Rel, 'rgba(255, 42, 109, 0.28)');
    shaderGrad.addColorStop(1, 'rgba(120, 0, 40, 0.42)');

    this.ctx.fillStyle = shaderGrad;
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    for (let y = 0; y < h; y += 8) {
      this.ctx.fillRect(0, y, w, 4);
    }

    this.ctx.restore();

    this.drawStrataDivider(RISK_DIVIDERS.dividerY1, "#00ff9d", "#ffb700", "RISCHIO MINIMO/LIMITATO ➔ ALTO RISCHIO", "divider1");
    this.drawStrataDivider(RISK_DIVIDERS.dividerY2, "#ffb700", "#ff2a6d", "⚠ ALTO RISCHIO ➔ RISCHIO INACCETTABILE (LINEA ROSSA)", "divider2");
  }

  drawStrataDivider(y, colorUpper, colorLower, text, dividerId) {
    const w = this.canvas.width;
    const isDragging = (this.draggedDivider === dividerId);
    this.ctx.save();

    this.ctx.fillStyle = isDragging ? "#ffffff" : colorUpper;
    for (let x = 0; x < w; x += 16) {
      this.ctx.fillRect(x, y - (isDragging ? 3 : 2), 8, isDragging ? 6 : 4);
    }

    const barWidth = Math.min(600, Math.max(0, w - 24));
    const barLeft = (w - barWidth) / 2;
    this.ctx.fillStyle = isDragging ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.85)";
    this.ctx.fillRect(barLeft, y - 16, barWidth, 32);

    this.ctx.strokeStyle = isDragging ? "#ffffff" : colorLower;
    this.ctx.lineWidth = isDragging ? 3 : 2;
    this.ctx.strokeRect(barLeft, y - 16, barWidth, 32);

    let displayText = text;
    if (this.isAdminMode) {
      displayText = `↕ [TRASCINA PER ALZARE/ABBASSARE] : Y=${Math.round(y)}px`;
    }

    this.ctx.font = 'bold 10px "Press Start 2P", monospace';
    this.ctx.fillStyle = isDragging ? "#ffffff" : colorLower;
    this.ctx.textBaseline = "middle";
    this.ctx.save();
    const textLeft = barLeft + 10;
    const textRight = barLeft + barWidth - 10;
    this.ctx.beginPath();
    this.ctx.rect(textLeft, y - 14, Math.max(0, textRight - textLeft), 28);
    this.ctx.clip();
    this.ctx.textAlign = "left";
    const textWidth = this.ctx.measureText(displayText).width;
    const gap = 56;
    const cycleWidth = textWidth + gap;
    const offset = (this.time * 0.8) % cycleWidth;
    for (let x = textLeft - offset; x < textRight; x += cycleWidth) {
      this.ctx.fillText(displayText, x, y);
    }
    this.ctx.restore();

    this.ctx.restore();
  }

  strokeSpline(pts) {
    if (pts.length < 2) return;
    this.ctx.beginPath();
    this.ctx.moveTo(pts[0].x, pts[0].y);

    if (pts.length === 2) {
      this.ctx.lineTo(pts[1].x, pts[1].y);
      this.ctx.stroke();
      return;
    }

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    this.ctx.stroke();
  }

  strokeGradientSpline(pts, colorStart, colorEnd) {
    if (pts.length < 2) return;
    const steps = 40;
    let prev = this.pointOnSpline(pts, 0);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const cur = this.pointOnSpline(pts, t);
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.lerpColor(colorStart, colorEnd, (i - 0.5) / steps);
      this.ctx.moveTo(prev.x, prev.y);
      this.ctx.lineTo(cur.x, cur.y);
      this.ctx.stroke();
      prev = cur;
    }
  }

  drawLinks() {
    const previewPts = this.pendingLink
      ? this.getLinkAnchorPoints(
          { fromId: this.pendingLink.fromId, toId: null, points: this.pendingLink.points },
          { x: this.mouse.canvasX, y: this.mouse.canvasY }
        )
      : null;

    this.links.forEach(link => {
      const from = this.getNodeById(link.fromId);
      const to = this.getNodeById(link.toId);
      if (!from || !to) return;

      const fromPos = this.getNodeCanvasPos(from);
      const toPos = this.getNodeCanvasPos(to);
      const pts = this.getLinkAnchorPoints(link);
      const style = this.resolveLinkStyle(link, from, to);
      const isSelected = this.selectedLink && this.selectedLink.id === link.id;
      const isHovered = this.hoveredLink && this.hoveredLink.id === link.id;
      this.ctx.save();
      this.ctx.globalAlpha = style.opacity;
      this.ctx.lineWidth = (isSelected || isHovered) ? style.width + 1.5 : style.width;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.shadowColor = style.colorStart;
      this.ctx.shadowBlur = isSelected ? style.glow + 6 : style.glow;

      const isDashed = style.dash > 0;
      if (isDashed) {
        this.ctx.setLineDash([style.dash, style.dash * 0.75]);
        if (style.animated) {
          const flowDir = toPos.y >= fromPos.y ? -1 : 1;
          this.ctx.lineDashOffset = flowDir * this.time * 0.45;
        }
      }

      if (isDashed) {
        if (style.gradient) {
          const firstPt = pts[0];
          const lastPt = pts[pts.length - 1];
          const grad = this.ctx.createLinearGradient(firstPt.x, firstPt.y, lastPt.x, lastPt.y);
          grad.addColorStop(0, style.colorStart);
          grad.addColorStop(1, style.colorEnd);
          this.ctx.strokeStyle = isSelected ? "#ffffff" : grad;
        } else {
          this.ctx.strokeStyle = isSelected ? "#ffffff" : style.colorStart;
        }
        this.strokeSpline(pts);
      } else {
        if (style.gradient) {
          this.strokeGradientSpline(pts, style.colorStart, style.colorEnd);
        } else {
          this.ctx.strokeStyle = isSelected ? "#ffffff" : style.colorStart;
          this.strokeSpline(pts);
        }
      }
      this.ctx.restore();

      this.drawLinkArrow(pts, isSelected ? "#ffffff" : style.colorEnd, isSelected);
    });

    if (previewPts && previewPts.length >= 2) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.85;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([8, 6]);
      this.ctx.lineDashOffset = -this.time * 0.5;
      this.ctx.shadowColor = "#00e5ff";
      this.ctx.shadowBlur = 12;
      this.strokeSpline(previewPts);
      this.ctx.restore();

      this.pendingLink.points.forEach(p => {
        const c = this.relToCanvas(p);
        this.drawControlHandle(c.x, c.y, "#ffffff", true);
      });
    }

    if (this.isAdminMode) {
      this.links.forEach(link => {
        const isSelected = this.selectedLink && this.selectedLink.id === link.id;
        if (!isSelected && !this.isLinkEditMode) return;
        (link.points || []).forEach((p, i) => {
          const c = this.relToCanvas(p);
          const hot = this.hoveredControl && this.hoveredControl.linkId === link.id && this.hoveredControl.pointIndex === i;
          this.drawControlHandle(c.x, c.y, isSelected ? "#00e5ff" : "#ffb700", hot || isSelected);
        });
      });
    }
  }

  drawLinkArrow(pts, color, highlight) {
    if (pts.length < 2) return;
    const a = this.pointOnSpline(pts, 0.92);
    const b = pts[pts.length - 1];
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const size = highlight ? 11 : 8;

    this.ctx.save();
    this.ctx.translate(b.x, b.y);
    this.ctx.rotate(ang);
    this.ctx.fillStyle = highlight ? "#ffffff" : color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-size * 1.6, -size * 0.7);
    this.ctx.lineTo(-size * 1.6, size * 0.7);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawControlHandle(x, y, color, active) {
    const s = active ? 8 : 6;
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = active ? 10 : 4;
    this.ctx.fillRect(x - s, y - s, s * 2, s * 2);
    this.ctx.strokeStyle = "#0b1220";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x - s, y - s, s * 2, s * 2);
    this.ctx.restore();
  }

  drawNodes() {
    this.nodes.forEach(node => {
      const pos = this.getNodeCanvasPos(node);
      const isHovered = (this.hoveredNode && this.hoveredNode.id === node.id);
      const isDragging = (this.draggedNode && this.draggedNode.id === node.id);
      const isLinkSource = this.pendingLink && this.pendingLink.fromId === node.id;
      const isNodeSelected = this.selectedNode && this.selectedNode.id === node.id;
      const isSwapSource = this.swapSourceNode && this.swapSourceNode.id === node.id;
      const isSfxNode = String(node.type || '').toLowerCase() === 'sfx';

      let primaryColor = this.nodeAccentColor(node);
      let secondaryColor;

      if (node.customColor) {
        const rgb = this.hexToRgb(node.customColor);
        secondaryColor = `rgb(${Math.round(rgb.r * 0.2)}, ${Math.round(rgb.g * 0.2)}, ${Math.round(rgb.b * 0.2)})`;
      } else if (node.isSpecial || node.isEditable) {
        secondaryColor = "#003b4d";
      } else if (node.tier === "high") {
        secondaryColor = "#4d3200";
      } else if (node.tier === "unacceptable") {
        secondaryColor = "#4d0019";
      } else {
        secondaryColor = "#003b22";
      }

      this.ctx.save();

      if (this.isAdminMode) {
        let badgeText = "NODO";
        let badgeColor = node.isSpecial ? "#00e5ff" : primaryColor;
        if (isSwapSource) {
          badgeText = "SWAP1";
          badgeColor = "#ff2a6d";
        } else if (isLinkSource) {
          badgeText = "FROM";
          badgeColor = "#ffffff";
        } else if (isNodeSelected && this.isLinkEditMode) {
          badgeText = "SEL";
          badgeColor = "#ffffff";
        } else if (this.isSwapMode && isHovered && !isSwapSource) {
          badgeText = "SWAP2?";
          badgeColor = "#ffb700";
        }

        this.ctx.fillStyle = badgeColor;
        this.ctx.shadowColor = badgeColor;
        this.ctx.shadowBlur = 8;
        this.ctx.fillRect(pos.x - 24, pos.y - 30, 48, 14);

        this.ctx.font = 'bold 8px "Press Start 2P"';
        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "center";
        this.ctx.fillText(badgeText, pos.x, pos.y - 20);
      }

      const pulseScale = (isHovered || isDragging || isLinkSource || isNodeSelected || isSwapSource) ? (1 + Math.sin(this.time * 0.1) * 0.15) : 1;
      const baseSize = (node.isSpecial ? 22 : 18) * pulseScale;

      if (isHovered || isDragging || this.isAdminMode || isLinkSource || isNodeSelected || isSwapSource) {
        let borderColor = primaryColor;
        let borderWidth = 2;
        let shadowColor = primaryColor;
        if (isSwapSource) {
          borderColor = "#ff2a6d";
          shadowColor = "#ff2a6d";
          borderWidth = 3;
        } else if (this.isSwapMode && isHovered && !isSwapSource) {
          borderColor = "#ffb700";
          shadowColor = "#ffb700";
          borderWidth = 3;
        } else if (isDragging || isLinkSource || isNodeSelected) {
          borderColor = "#ffffff";
          borderWidth = (isDragging || isLinkSource) ? 3 : 2;
        }
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.shadowColor = shadowColor;
        this.ctx.shadowBlur = 15;
        if (isSwapSource) {
          this.ctx.setLineDash([6, 4]);
          this.ctx.lineDashOffset = -this.time * 0.4;
        }
        this.ctx.strokeRect(pos.x - baseSize - 6, pos.y - baseSize - 6, (baseSize + 6) * 2, (baseSize + 6) * 2);
        this.ctx.setLineDash([]);
      }

      this.ctx.fillStyle = secondaryColor;
      this.ctx.fillRect(pos.x - baseSize, pos.y - baseSize, baseSize * 2, baseSize * 2);

      if (isSfxNode) {
        const speakerSize = Math.max(8, baseSize * 0.75);
        this.ctx.fillStyle = '#081620';
        this.ctx.fillRect(pos.x - speakerSize, pos.y - speakerSize * 0.8, speakerSize * 2, speakerSize * 1.6);
        this.ctx.strokeStyle = primaryColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(pos.x - speakerSize, pos.y - speakerSize * 0.8, speakerSize * 2, speakerSize * 1.6);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x - speakerSize * 0.8, pos.y - speakerSize * 0.2);
        this.ctx.lineTo(pos.x - 2, pos.y - speakerSize * 0.2);
        this.ctx.lineTo(pos.x + speakerSize * 0.8, pos.y - speakerSize * 0.8);
        this.ctx.lineTo(pos.x + speakerSize * 0.8, pos.y + speakerSize * 0.8);
        this.ctx.lineTo(pos.x - 2, pos.y + speakerSize * 0.2);
        this.ctx.lineTo(pos.x - speakerSize * 0.8, pos.y + speakerSize * 0.2);
        this.ctx.closePath();
        this.ctx.fillStyle = primaryColor;
        this.ctx.fill();
      }

      this.ctx.strokeStyle = primaryColor;
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(pos.x - baseSize, pos.y - baseSize, baseSize * 2, baseSize * 2);

      this.ctx.fillStyle = primaryColor;
      this.ctx.shadowColor = primaryColor;
      this.ctx.shadowBlur = (isHovered || isDragging) ? 12 : 4;
      this.ctx.fillRect(pos.x - 5, pos.y - 5, 10, 10);

      if (isDragging) {
        this.ctx.font = 'bold 10px "Press Start 2P"';
        this.ctx.fillStyle = "#ffffff";
        this.ctx.shadowColor = "#000000";
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(`X:${(node.relX * 100).toFixed(1)}% Y:${Math.round(node.relY)}px`, pos.x, pos.y - baseSize - 36);
      }

      this.ctx.font = (isHovered || isDragging) ? 'bold 12px "Pixelify Sans", sans-serif' : '11px "Pixelify Sans", sans-serif';
      this.ctx.fillStyle = (isHovered || isDragging) ? "#ffffff" : "rgba(255, 255, 255, 0.9)";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "top";
      this.ctx.shadowColor = "#000000";
      this.ctx.shadowBlur = 6;

      let label = node.title;
      if (label.length > 25) label = label.substring(0, 23) + "..";
      this.ctx.fillText(label, pos.x, pos.y + baseSize + 6);

      this.ctx.restore();
    });
  }

  drawParticles() {
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) p.y = this.virtualHeight;
      if (p.y > this.virtualHeight) p.y = 0;

      const scale = this.canvas.width / this.virtualWidth;
      const px = p.x * scale + (this.isAdminMode ? 0 : this.mouse.x * 0.1);
      const py = p.y + (this.isAdminMode ? 0 : this.mouse.y * 0.1);

      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillRect(Math.floor(px), Math.floor(py), p.size, p.size);
      this.ctx.restore();
    });
  }

  drawLinkModeHint() {
    if (!this.isAdminMode || !this.isLinkEditMode) return;
    const y = (window.scrollY || 0) + 110;
    this.ctx.save();
    this.ctx.fillStyle = "rgba(8, 16, 28, 0.88)";
    this.ctx.fillRect(16, y, 620, 58);
    this.ctx.strokeStyle = "#00e5ff";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(16, y, 620, 58);
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = "#00e5ff";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    const msg = this.pendingLink
      ? "Clicca per le curve, poi il nodo di arrivo. F = curva sul nodo. Tasto destro = annulla."
      : "Clicca partenza, curve, arrivo. F = aggiungi curva sul nodo. Seleziona un link per il gradient.";
    this.ctx.fillText(msg, 28, y + 30);
    this.ctx.restore();
  }

  drawSwapModeHint() {
    if (!this.isAdminMode || !this.isSwapMode) return;
    const y = (window.scrollY || 0) + 110;
    const label = this.swapSourceNode ? this.swapSourceNode.title : "NODO";
    this.ctx.save();
    this.ctx.fillStyle = "rgba(20, 8, 28, 0.92)";
    this.ctx.fillRect(16, y, 680, 58);
    this.ctx.strokeStyle = "#ff2a6d";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([8, 4]);
    this.ctx.lineDashOffset = -this.time * 0.3;
    this.ctx.strokeRect(16, y, 680, 58);
    this.ctx.setLineDash([]);
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.fillStyle = "#ff2a6d";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    const msg = `[SWAP MODE] SORGENTE: "${label.substring(0, 24)}" → HOVER SUL 2° NODO E PREMI S PER SCAMBIARE`;
    this.ctx.fillText(msg, 28, y + 30);
    this.ctx.restore();
  }

  animate() {
    if (this.isPaused) return;
    this.time++;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.ctx.clearRect(0, 0, this.canvas.width, this.virtualHeight);

    this.drawBackgroundImageAndShader();
    this.drawParticles();
    this.drawLinks();
    this.drawNodes();
    this.drawLinkModeHint();
    this.drawSwapModeHint();

    this.animFrame = requestAnimationFrame(() => this.animate());
  }
}
