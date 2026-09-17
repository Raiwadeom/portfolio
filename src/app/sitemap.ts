import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

const BASE_URL = "https://omrushikeshraiwade.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/library"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const workRoutes = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...workRoutes];
}
