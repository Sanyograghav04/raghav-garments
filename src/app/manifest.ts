import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RAGHAV GARMENTS | Premium Indian Fashion",
    short_name: "Raghav Garments",
    description: "Handcrafted luxury ethnic garments, sherwanis, Banarasi sarees, and kids festive wear.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#7C1D3E",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
