import { useEffect } from "react";

const AdPopunder = () => {
    useEffect(() => {
        const scriptId = "popunder-ad-script";

        // Script already loaded hai to dobara load mat karo
        if (document.getElementById(scriptId)) return;

        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
            "https://pl30905152.effectivecpmnetwork.com/87/09/89/870989ccb0bd75dea497f2fa7ffd8c03.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            // Script ko cleanup/remove mat karo
            // taaki page lifecycle me accidentally dobara inject na ho
        };
    }, []);

    return null;
};

export default AdPopunder;