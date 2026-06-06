import { ImageResponse } from "next/og";

import { SITE } from "@/lib/constants";
import { OG_COLORS, OG_SIZE } from "@/lib/seo/og";

export type OgImageOptions = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function createOgImageResponse({
  title,
  subtitle,
  badge,
}: OgImageOptions): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: `linear-gradient(135deg, ${OG_COLORS.background} 0%, #2d5a4e 100%)`,
          color: OG_COLORS.text,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {badge && (
          <div
            style={{
              fontSize: 24,
              color: OG_COLORS.muted,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {badge}
          </div>
        )}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: "90%",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 32,
              color: OG_COLORS.muted,
              maxWidth: "80%",
            }}
          >
            {subtitle}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: OG_COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            MBS
          </div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{SITE.name}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    },
  );
}
