// Interactive Graph Visualization
class NetworkGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.selectedNode = null;
        this.isDragging = false;
        this.dragNode = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.physics = {
            repulsion: 5000,
            attraction: 0.01,
            damping: 0.9,
            centerPull: 0.001
        };
        
        this.initCanvas();
        this.initializeGraph();
        this.bindEvents();
        this.animate();
    }

    initCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    initializeGraph() {
        // Create nodes for exhibitions, themes, and concepts
        const exhibitions = [
            { id: 'dd', label: 'DIGITAL\nDREAMS', type: 'exhibition', url: 'exhibition1.html', x: 200, y: 150 },
            { id: 'sm', label: 'STATIC\nMEMORIES', type: 'exhibition', url: 'exhibition2.html', x: 600, y: 150 },
            { id: 'pp', label: 'PIXEL\nPOETRY', type: 'exhibition', url: 'exhibition3.html', x: 200, y: 450 },
            { id: 'tv', label: 'TERMINAL\nVISIONS', type: 'exhibition', url: 'exhibition4.html', x: 600, y: 450 }
        ];

        const themes = [
            { id: 'nostalgia', label: 'NOSTALGIA', type: 'theme', x: 400, y: 100 },
            { id: 'digital', label: 'DIGITAL\nIDENTITY', type: 'theme', x: 100, y: 300 },
            { id: 'web1', label: 'WEB 1.0', type: 'theme', x: 700, y: 300 },
            { id: 'glitch', label: 'GLITCH\nAESTHETIC', type: 'theme', x: 400, y: 500 }
        ];

        const concepts = [
            { id: 'code', label: 'CODE AS\nART', type: 'concept', x: 400, y: 300 },
            { id: 'interaction', label: 'INTER-\nACTION', type: 'concept', x: 300, y: 200 },
            { id: 'minimal', label: 'MINIMAL-\nISM', type: 'concept', x: 500, y: 200 },
            { id: 'hidden', label: 'HIDDEN\nLAYERS', type: 'concept', x: 300, y: 400 },
            { id: 'memory', label: 'DIGITAL\nMEMORY', type: 'concept', x: 500, y: 400 }
        ];

        this.nodes = [...exhibitions, ...themes, ...concepts];

        // Create edges (connections)
        this.edges = [
            { from: 'dd', to: 'nostalgia' },
            { from: 'dd', to: 'code' },
            { from: 'dd', to: 'interaction' },
            { from: 'sm', to: 'nostalgia' },
            { from: 'sm', to: 'memory' },
            { from: 'sm', to: 'web1' },
            { from: 'pp', to: 'code' },
            { from: 'pp', to: 'minimal' },
            { from: 'pp', to: 'hidden' },
            { from: 'tv', to: 'glitch' },
            { from: 'tv', to: 'web1' },
            { from: 'tv', to: 'memory' },
            { from: 'nostalgia', to: 'web1' },
            { from: 'digital', to: 'code' },
            { from: 'digital', to: 'memory' },
            { from: 'interaction', to: 'hidden' },
            { from: 'minimal', to: 'code' },
            { from: 'glitch', to: 'hidden' }
        ];

        // Initialize velocities
        this.nodes.forEach(node => {
            node.vx = 0;
            node.vy = 0;
            node.radius = node.type === 'exhibition' ? 40 : node.type === 'theme' ? 30 : 25;
        });

        this.updateStats();
    }

    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('resize', () => this.initCanvas());
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    findNodeAtPos(x, y) {
        return this.nodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return Math.sqrt(dx * dx + dy * dy) < node.radius;
        });
    }

    onMouseDown(e) {
        const pos = this.getMousePos(e);
        const node = this.findNodeAtPos(pos.x, pos.y);
        
        if (node) {
            this.isDragging = true;
            this.dragNode = node;
            this.offsetX = pos.x - node.x;
            this.offsetY = pos.y - node.y;
        }
    }

    onMouseMove(e) {
        const pos = this.getMousePos(e);
        
        if (this.isDragging && this.dragNode) {
            this.dragNode.x = pos.x - this.offsetX;
            this.dragNode.y = pos.y - this.offsetY;
            this.dragNode.vx = 0;
            this.dragNode.vy = 0;
        }
        
        // Highlight node on hover
        const hoveredNode = this.findNodeAtPos(pos.x, pos.y);
        this.canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }

    onMouseUp() {
        this.isDragging = false;
        this.dragNode = null;
    }

    onClick(e) {
        const pos = this.getMousePos(e);
        const node = this.findNodeAtPos(pos.x, pos.y);
        
        if (node) {
            this.selectedNode = node;
            this.showNodeDetails(node);
        }
    }

    showNodeDetails(node) {
        const detailsDiv = document.getElementById('node-details');
        const titleDiv = document.getElementById('detail-title');
        const descDiv = document.getElementById('detail-description');
        const connDiv = document.getElementById('detail-connections');
        
        titleDiv.textContent = node.label.replace(/\n/g, ' ');
        
        const descriptions = {
            'dd': 'An exploration of digital consciousness and virtual landscapes.',
            'sm': 'Preserving moments in the ephemeral digital realm.',
            'pp': 'Code as verse, algorithms as stanzas.',
            'tv': 'Visions from the command line, rendered in ASCII and emotion.',
            'nostalgia': 'The longing for simpler digital times.',
            'digital': 'What it means to exist in digital space.',
            'web1': 'The raw, unpolished beauty of early internet.',
            'glitch': 'Finding art in digital imperfection.',
            'code': 'Programming as a creative medium.',
            'interaction': 'The dialogue between user and interface.',
            'minimal': 'Less is more in the digital realm.',
            'hidden': 'Secrets waiting to be discovered.',
            'memory': 'How digital artifacts persist and decay.'
        };
        
        descDiv.textContent = descriptions[node.id] || 'A node in the network.';
        
        // Find connections
        const connections = this.edges
            .filter(e => e.from === node.id || e.to === node.id)
            .map(e => {
                const connectedId = e.from === node.id ? e.to : e.from;
                const connectedNode = this.nodes.find(n => n.id === connectedId);
                return connectedNode ? connectedNode.label.replace(/\n/g, ' ') : '';
            });
        
        connDiv.innerHTML = connections.length > 0
            ? `<p class="small-text" style="margin-top: 1rem;">CONNECTED TO: ${connections.join(', ')}</p>`
            : '';
        
        detailsDiv.style.display = 'block';
    }

    applyForces() {
        // Apply repulsion between nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n1 = this.nodes[i];
                const n2 = this.nodes[j];
                
                if (n1 === this.dragNode || n2 === this.dragNode) continue;
                
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                
                const force = this.physics.repulsion / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                
                n1.vx -= fx;
                n1.vy -= fy;
                n2.vx += fx;
                n2.vy += fy;
            }
        }
        
        // Apply attraction along edges
        this.edges.forEach(edge => {
            const n1 = this.nodes.find(n => n.id === edge.from);
            const n2 = this.nodes.find(n => n.id === edge.to);
            
            if (!n1 || !n2) return;
            if (n1 === this.dragNode || n2 === this.dragNode) return;
            
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const force = dist * this.physics.attraction;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            n1.vx += fx;
            n1.vy += fy;
            n2.vx -= fx;
            n2.vy -= fy;
        });
        
        // Pull towards center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.nodes.forEach(node => {
            if (node === this.dragNode) return;
            
            const dx = centerX - node.x;
            const dy = centerY - node.y;
            
            node.vx += dx * this.physics.centerPull;
            node.vy += dy * this.physics.centerPull;
        });
    }

    updatePositions() {
        this.nodes.forEach(node => {
            if (node === this.dragNode) return;
            
            // Apply damping
            node.vx *= this.physics.damping;
            node.vy *= this.physics.damping;
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Keep within bounds
            const margin = node.radius;
            node.x = Math.max(margin, Math.min(this.canvas.width - margin, node.x));
            node.y = Math.max(margin, Math.min(this.canvas.height - margin, node.y));
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.edges.forEach(edge => {
            const n1 = this.nodes.find(n => n.id === edge.from);
            const n2 = this.nodes.find(n => n.id === edge.to);
            
            if (n1 && n2) {
                this.ctx.beginPath();
                this.ctx.moveTo(n1.x, n1.y);
                this.ctx.lineTo(n2.x, n2.y);
                this.ctx.stroke();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            
            if (node.type === 'exhibition') {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
            } else if (node.type === 'theme') {
                this.ctx.fillStyle = '#000000';
            } else {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.fill();
            }
            
            this.ctx.stroke();
            
            // Draw label
            this.ctx.fillStyle = node.type === 'exhibition' ? '#000000' : '#ffffff';
            this.ctx.font = '10px "Courier New", Courier, monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const lines = node.label.split('\n');
            lines.forEach((line, i) => {
                const yOffset = (i - lines.length / 2 + 0.5) * 12;
                this.ctx.fillText(line, node.x, node.y + yOffset);
            });
        });
        
        // Highlight selected node
        if (this.selectedNode) {
            this.ctx.beginPath();
            this.ctx.arc(this.selectedNode.x, this.selectedNode.y, this.selectedNode.radius + 5, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    animate() {
        this.applyForces();
        this.updatePositions();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    updateStats() {
        document.getElementById('node-count').textContent = this.nodes.length;
        document.getElementById('connection-count').textContent = this.edges.length;
    }
}

// Initialize graph when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetworkGraph('graph-canvas');
});
