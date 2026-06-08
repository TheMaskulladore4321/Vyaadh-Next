import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vyaadh",
    short_name: "Vyaadh",
    description: "Connect low-skilled workers with people who need them",
    start_url: "/splash",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#0D9488",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
