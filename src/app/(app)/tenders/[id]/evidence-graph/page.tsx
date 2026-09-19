'use client';

import { useAppState } from '@/lib/store';
import { useParams } from 'next/navigation';
import {
  CheckCircle2, AlertTriangle, XCircle, FileText, Shield, ZoomIn,
  ZoomOut, Maximize2, X, Filter, Eye
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Requirement } from '@/lib/data';

interface GraphNode {
  id: string;
  label: string;
  type: 'tender' | 'section' | 'requirement' | 'evidence' | 'status' | 'risk';
  x: number;
  y: number;
  data?: Requirement;
  color: string;
  radius: number;
}

interface GraphEdge {
  from: string;
  to: string;
  color: string;
}

export default function EvidenceGraphPage() {
  const params = useParams();
  const { requirements, tenders } = useAppState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const tender = tenders.find(t => t.id === params.id);
  const filteredReqs = filterStatus === 'all'
    ? requirements
    : requirements.filter(r => r.status === filterStatus);

  // Build graph nodes
  const buildGraph = useCallback(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const centerX = 600;
    const centerY = 400;

    // Tender node (center)
    nodes.push({
      id: 'tender', label: tender?.title || 'Tender', type: 'tender',
      x: centerX, y: centerY, color: '#6366F1', radius: 32,
    });

    // Category sections around the tender
    const categories = [...new Set(filteredReqs.map(r => r.category))];
    const catRadius = 220;

    categories.forEach((cat, i) => {
      const angle = (2 * Math.PI * i) / categories.length - Math.PI / 2;
      const cx = centerX + catRadius * Math.cos(angle);
      const cy = centerY + catRadius * Math.sin(angle);
      const catId = `cat-${cat}`;

      nodes.push({
        id: catId, label: cat.charAt(0).toUpperCase() + cat.slice(1),
        type: 'section', x: cx, y: cy, color: '#3B82F6', radius: 24,
      });
      edges.push({ from: 'tender', to: catId, color: '#1E293B' });

      // Requirements for this category
      const catReqs = filteredReqs.filter(r => r.category === cat);
      const reqRadius = 120;
      const startAngle = angle - Math.PI / (categories.length * 1.5);
      const endAngle = angle + Math.PI / (categories.length * 1.5);

      catReqs.forEach((req, j) => {
        const reqAngle = catReqs.length === 1
          ? angle
          : startAngle + ((endAngle - startAngle) * j) / (catReqs.length - 1 || 1);
        const rx = cx + reqRadius * Math.cos(reqAngle);
        const ry = cy + reqRadius * Math.sin(reqAngle);
        const reqColor = req.status === 'satisfied' ? '#10B981'
          : req.status === 'review' ? '#F59E0B'
          : req.status === 'missing' ? '#EF4444' : '#64748B';

        nodes.push({
          id: req.id, label: req.title.length > 20 ? req.title.slice(0, 20) + '...' : req.title,
          type: 'requirement', x: rx, y: ry, color: reqColor, radius: 16, data: req,
        });
        edges.push({ from: catId, to: req.id, color: '#162032' });

        // Evidence nodes
        if (req.evidenceDocuments.length > 0) {
          req.evidenceDocuments.forEach((doc, k) => {
            const evId = `${req.id}-ev-${k}`;
            const evAngle = reqAngle + (k - (req.evidenceDocuments.length - 1) / 2) * 0.15;
            nodes.push({
              id: evId, label: doc.length > 18 ? doc.slice(0, 18) + '...' : doc,
              type: 'evidence', x: rx + 80 * Math.cos(evAngle), y: ry + 80 * Math.sin(evAngle),
              color: '#6366F1', radius: 10,
            });
            edges.push({ from: req.id, to: evId, color: '#162032' });
          });
        }
      });
    });

    return { nodes, edges };
  }, [filteredReqs, tender]);

  const { nodes, edges } = buildGraph();

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    ctx.translate(pan.x + rect.width / 2, pan.y + rect.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-600, -400);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = hoveredNode === fromNode.id || hoveredNode === toNode.id ? '#334155' : edge.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode?.id === node.id;

      // Glow
      if (isHovered || isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '20';
        ctx.fill();
      }

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? node.color : node.color + (isHovered ? 'CC' : '40');
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = isHovered || isSelected ? '#F1F5F9' : '#94A3B8';
      ctx.font = `${node.type === 'tender' ? '600 13' : node.type === 'section' ? '600 11' : '10'}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (node.type === 'tender') {
        ctx.fillText(node.label.slice(0, 15), node.x, node.y);
      } else {
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      }

      // Status icon for requirements
      if (node.type === 'requirement' && node.data) {
        const icon = node.data.status === 'satisfied' ? '✓' : node.data.status === 'missing' ? '✕' : '⚠';
        ctx.fillStyle = node.color;
        ctx.font = 'bold 12px Inter';
        ctx.fillText(icon, node.x, node.y);
      }
    });

    ctx.restore();
  }, [nodes, edges, zoom, pan, hoveredNode, selectedNode]);

  // Mouse handlers
  const getNodeAtPosition = (mouseX: number, mouseY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = (mouseX - rect.left - pan.x - rect.width / 2) / zoom + 600;
    const y = (mouseY - rect.top - pan.y - rect.height / 2) / zoom + 400;

    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < (node.radius + 5) * (node.radius + 5)) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan(p => ({ x: p.x + e.clientX - lastMouse.x, y: p.y + e.clientY - lastMouse.y }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
    const node = getNodeAtPosition(e.clientX, e.clientY);
    setHoveredNode(node?.id || null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = node ? 'pointer' : isPanning ? 'grabbing' : 'grab';
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleClick = (e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    setSelectedNode(node);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.3, Math.min(3, z * delta)));
  };

  return (
    <div className="space-y-6" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Evidence Graph</h1>
          <p className="text-sm text-[#64748B] mt-1">Interactive requirement-evidence map · {nodes.length} nodes · {edges.length} connections</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-[#141B2D] border border-[#1E293B] rounded-lg p-1">
            {['all', 'satisfied', 'review', 'missing'].map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                  filterStatus === f ? 'bg-indigo-500/15 text-indigo-400' : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-[#141B2D] border border-[#1E293B] rounded-lg p-1">
            <button onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="p-1.5 rounded-md hover:bg-[#1E2842] text-[#64748B]">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(z => Math.max(0.3, z * 0.8))} className="p-1.5 rounded-md hover:bg-[#1E2842] text-[#64748B]">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 rounded-md hover:bg-[#1E2842] text-[#64748B]">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        {[
          { color: '#6366F1', label: 'Tender/Section' },
          { color: '#10B981', label: 'Satisfied' },
          { color: '#F59E0B', label: 'Review' },
          { color: '#EF4444', label: 'Missing' },
          { color: '#6366F1', label: 'Evidence Document', small: true },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`rounded-full border`} style={{ width: item.small ? 8 : 12, height: item.small ? 8 : 12, backgroundColor: item.color + '40', borderColor: item.color }} />
            <span className="text-xs text-[#64748B]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Canvas + Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0A0E1A] border border-[#1E293B] rounded-xl overflow-hidden relative" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-full h-[600px]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
            onWheel={handleWheel}
          />
          <div className="absolute bottom-4 left-4 text-[10px] text-[#475569] font-mono">
            Zoom: {Math.round(zoom * 100)}% · Drag to pan · Click nodes for details
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl p-6">
          {selectedNode && selectedNode.data ? (
            <div className="space-y-4" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F1F5F9]">Requirement Details</h3>
                <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-[#1E2842]">
                  <X className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>

              <div>
                <p className="text-base font-semibold text-[#F1F5F9]">{selectedNode.data.title}</p>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{selectedNode.data.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {selectedNode.data.status === 'satisfied' && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-semibold text-emerald-400 uppercase"><CheckCircle2 className="w-3 h-3" /> Satisfied</span>}
                {selectedNode.data.status === 'review' && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-semibold text-amber-400 uppercase"><AlertTriangle className="w-3 h-3" /> Review</span>}
                {selectedNode.data.status === 'missing' && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-semibold text-red-400 uppercase"><XCircle className="w-3 h-3" /> Missing</span>}
                {selectedNode.data.mandatory && <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-semibold text-indigo-400 uppercase">Mandatory</span>}
              </div>

              <div className="bg-[#0A0E1A] rounded-lg p-3">
                <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Source</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-[#64748B]" />
                  <span className="text-xs text-[#F1F5F9] font-mono">{selectedNode.data.clause} · Page {selectedNode.data.page}</span>
                </div>
              </div>

              {selectedNode.data.threshold && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0A0E1A] rounded-lg p-3">
                    <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Required</p>
                    <p className="text-xs text-[#F1F5F9]">{selectedNode.data.threshold}</p>
                  </div>
                  <div className="bg-[#0A0E1A] rounded-lg p-3">
                    <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Company</p>
                    <p className={`text-xs ${selectedNode.data.status === 'satisfied' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedNode.data.companyValue || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}

              {selectedNode.data.evidenceDocuments.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-2">Evidence</p>
                  {selectedNode.data.evidenceDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0A0E1A] rounded-lg mb-1">
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span className="text-xs text-[#94A3B8]">{doc}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-lg p-3">
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold mb-1">AI Analysis · {selectedNode.data.confidence}%</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{selectedNode.data.aiExplanation}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Eye className="w-8 h-8 text-[#475569] mb-3" />
              <p className="text-sm text-[#64748B]">Click a requirement node to view details</p>
              <p className="text-xs text-[#475569] mt-1">Use scroll to zoom · Drag to pan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
