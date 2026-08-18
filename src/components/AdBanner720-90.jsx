import { useEffect, useRef, useState } from "react";

const AdBanner728x90 = () => {
    const adRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const availableWidth = window.innerWidth - 20;
            const newScale = Math.min(1, availableWidth / 728);
            setScale(newScale);
        };

        updateScale();
        window.addEventListener("resize", updateScale);

        return () => {
            window.removeEventListener("resize", updateScale);
        };
    }, []);

    useEffect(() => {
        if (!adRef.current) return;

        adRef.current.innerHTML = "";

        window.atOptions = {
            key: "5fdde51b1eed78906ad96114bcec1bcf",
            format: "iframe",
            height: 90,
            width: 728,
            params: {},
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
            "https://www.highperformanceformat.com/5fdde51b1eed78906ad96114bcec1bcf/invoke.js";

        adRef.current.appendChild(script);

        return () => {
            if (adRef.current) {
                adRef.current.innerHTML = "";
            }
        };
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: `${90 * scale}px`,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <div
                ref={adRef}
                style={{
                    width: "728px",
                    height: "90px",
                    flexShrink: 0,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                }}
            />
        </div>
    );
};

export default AdBanner728x90;