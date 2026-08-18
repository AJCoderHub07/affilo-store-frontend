import { useEffect, useRef, useState } from "react";

const AdBanner468x60 = () => {
    const iframeRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const availableWidth = window.innerWidth - 20;
            setScale(Math.min(1, availableWidth / 468));
        };

        updateScale();
        window.addEventListener("resize", updateScale);

        return () => {
            window.removeEventListener("resize", updateScale);
        };
    }, []);

    useEffect(() => {
        if (!iframeRef.current) return;

        const iframe = iframeRef.current;

        const adHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=468, initial-scale=1.0">
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 468px;
              height: 60px;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <script>
            atOptions = {
              'key': '9753318bd84281a3b19f1de0232d83d0',
              'format': 'iframe',
              'height': 60,
              'width': 468,
              'params': {}
            };
          </script>
          <script src="https://www.highperformanceformat.com/9753318bd84281a3b19f1de0232d83d0/invoke.js"></script>
        </body>
      </html>
    `;

        iframe.srcdoc = adHTML;

        return () => {
            iframe.srcdoc = "";
        };
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: `${60 * scale}px`,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <iframe
                ref={iframeRef}
                title="Advertisement"
                style={{
                    width: "468px",
                    height: "60px",
                    border: "none",
                    flexShrink: 0,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                }}
            />
        </div>
    );
};

export default AdBanner468x60;