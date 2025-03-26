import React, { useRef, useEffect, useState } from "react";

const HoneycombBackground = () => {
    const hexCanvasRef = useRef(null);
    const glowCanvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const hexCanvas = hexCanvasRef.current;
        const glowCanvas = glowCanvasRef.current;
        const hexCtx = hexCanvas.getContext("2d");
        const glowCtx = glowCanvas.getContext("2d");

        hexCanvas.width = glowCanvas.width = window.innerWidth;
        hexCanvas.height = glowCanvas.height = window.innerHeight;

        const hexRadius = 30;
        const glowRadius = 200;

        // Draw the honeycomb grid
        const drawHexagon = (ctx, x, y, radius) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
            }
            ctx.closePath();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
            ctx.stroke();
        };

        const drawHoneycomb = () => {
            hexCtx.clearRect(0, 0, hexCanvas.width, hexCanvas.height);
            const rowHeight = Math.sqrt(3) * hexRadius;
            for (let y = 0; y < hexCanvas.height + hexRadius; y += rowHeight) {
                for (let x = 0, col = 0; x < hexCanvas.width + hexRadius; x += hexRadius * 1.5, col++) {
                    const offsetX = col % 2 === 0 ? 0 : hexRadius * 0.75;
                    drawHexagon(hexCtx, x + offsetX, y, hexRadius);
                }
            }
        };

        const drawGlow = (mouseX, mouseY) => {
            glowCtx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);

            const gradient = glowCtx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
            gradient.addColorStop(0, "rgba(0, 255, 255, 0.5)");
            gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.2)");
            gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

            glowCtx.fillStyle = gradient;
            glowCtx.beginPath();
            glowCtx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
            glowCtx.fill();
        };

        const handleMouseMove = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        drawHoneycomb();

        const render = () => {
            drawGlow(mousePos.x, mousePos.y);
            requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mousePos]);

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <canvas ref={hexCanvasRef} className="absolute top-0 left-0 w-full h-full" />
            <canvas ref={glowCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
        </div>
    );
};

export default HoneycombBackground;
