import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/login",
                "/register",
                "/profile",
                "/users",
                "/dashboard",
                "/api/",
            ],
        },
        sitemap: "https://taskmanagementsystem-eight.vercel.app/sitemap.xml",
    };
}