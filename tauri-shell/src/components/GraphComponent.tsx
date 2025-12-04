import React, { useEffect, useState, useRef } from 'react';

interface Node {
    id: string;
    name: string;
    type: string;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
}

interface Link {
    source: number; // index in nodes array
    target: number;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

const GraphComponent: React.FC<{ workspacePath: string | null }> = ({ workspacePath }) => {
    const [data, setData] = useState<GraphData | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGraph();
    }, [workspacePath]);

    const fetchGraph = async () => {
        setLoading(true);
        try {
            const path = workspacePath || ".";
            const res = await fetch(`http://localhost:8000/graph?path=${encodeURIComponent(path)}`);
            const json = await res.json();

            // Initialize positions randomly
            const nodes = json.nodes.map((n: any) => ({
                ...n,
                x: Math.random() * 800,
                y: Math.random() * 600,
                vx: 0,
                vy: 0
            }));

            setData({ nodes, links: json.links });
        } catch (e) {
            console.error("Failed to fetch graph:", e);
        } finally {
            setLoading(false);
        }
    };

    // Simple Force Simulation
    useEffect(() => {
        if (!data || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const simulate = () => {
            const { nodes, links } = data;
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Physics params
            const repulsion = 100;
            const springLength = 100;
            const springStrength = 0.05;
            const damping = 0.9;
            const centerStrength = 0.01;

            // 1. Apply forces
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                // Center force
                node.vx! += (width / 2 - node.x!) * centerStrength;
                node.vy! += (height / 2 - node.y!) * centerStrength;

                // Repulsion (All vs All) - O(N^2) simple
                for (let j = 0; j < nodes.length; j++) {
                    if (i === j) continue;
                    const other = nodes[j];
                    const dx = node.x! - other.x!;
                    const dy = node.y! - other.y!;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                    if (dist < 300) {
                        const force = repulsion / (dist * dist);
                        node.vx! += (dx / dist) * force;
                        node.vy! += (dy / dist) * force;
                    }
                }
            }

            // Spring force (Links)
            for (const link of links) {
                const source = nodes[link.source];
                const target = nodes[link.target];

                const dx = target.x! - source.x!;
                const dy = target.y! - source.y!;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                const force = (dist - springLength) * springStrength;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                source.vx! += fx;
                source.vy! += fy;
                target.vx! -= fx;
                target.vy! -= fy;
            }

            // 2. Update positions
            for (const node of nodes) {
                node.vx! *= damping;
                node.vy! *= damping;
                node.x! += node.vx!;
                node.y! += node.vy!;

                // Bounds
                node.x = Math.max(20, Math.min(width - 20, node.x!));
                node.y = Math.max(20, Math.min(height - 20, node.y!));
            }

            // 3. Draw Links
            ctx.strokeStyle = '#30363d';
            ctx.lineWidth = 1;
            for (const link of links) {
                const source = nodes[link.source];
                const target = nodes[link.target];
                ctx.beginPath();
                ctx.moveTo(source.x!, source.y!);
                ctx.lineTo(target.x!, target.y!);
                ctx.stroke();
            }

            // 4. Draw Nodes
            for (const node of nodes) {
                ctx.beginPath();
                ctx.arc(node.x!, node.y!, 5, 0, 2 * Math.PI);
                ctx.fillStyle = getNodeColor(node.type);
                ctx.fill();

                ctx.fillStyle = '#8b949e';
                ctx.font = '10px monospace';
                ctx.fillText(node.name, node.x! + 8, node.y! + 3);
            }

            animationFrameId = requestAnimationFrame(simulate);
        };

        simulate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [data]);

    const getNodeColor = (type: string) => {
        switch (type) {
            case 'py': return '#3572A5';
            case 'ts': return '#2b7489';
            case 'tsx': return '#2b7489';
            case 'js': return '#f1e05a';
            case 'jsx': return '#f1e05a';
            default: return '#ffffff';
        }
    };

    return (
        <div className="w-full h-full bg-[#0d1117] flex flex-col items-center justify-center relative">
            {loading && <div className="absolute text-blue-400">Analyzing workspace...</div>}
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full"
            />
            <div className="absolute bottom-4 right-4 bg-[#161b22] p-2 rounded border border-gray-700 text-xs text-gray-400">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3572A5]"></span> Python</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2b7489]"></span> TypeScript</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#f1e05a]"></span> JavaScript</div>
            </div>
        </div>
    );
};

export default GraphComponent;
