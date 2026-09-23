import { Renderer } from "@takumi-rs/wasm";
import {
  container,
  image as imgNode,
  percentage,
  text,
} from "@takumi-rs/helpers";
import type { FetchedImage } from "./image";
import type { OgParams } from "./params";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export async function renderOgImage(
  params: OgParams,
  avatar: FetchedImage | null,
  renderer: Renderer,
  font: Uint8Array,
): Promise<Uint8Array> {
  const bgPrimary = "#0f172a";
  const fgPrimary = "#f8fafc";
  const fgSecondary = "#cbd5e1";
  const accentColor = "#3b82f6";
  const padding = 64;

  const root = container({
    style: {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      backgroundColor: bgPrimary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding,
    },
    children: [
      container({
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          flexGrow: 1,
          minHeight: 0,
        },
        children: [
          container({
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 24,
              flexGrow: 1,
              minWidth: 0,
            },
            children: [
              text(params.title, {
                color: fgPrimary,
                fontSize: 72,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                lineHeight: 1.1,
                maxWidth: 720,
                lineClamp: 3,
                textOverflow: "ellipsis",
              }),
              text(params.description, {
                color: fgSecondary,
                fontSize: 36,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: 720,
                lineClamp: 3,
                textOverflow: "ellipsis",
              }),
              ...(params.cta
                ? [
                    container({
                      style: {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        alignSelf: "flex-start",
                        backgroundColor: accentColor,
                        borderRadius: 24,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 28,
                        paddingRight: 28,
                      },
                      children: [
                        text(params.cta, {
                          color: fgPrimary,
                          fontSize: 28,
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 600,
                        }),
                      ],
                    }),
                  ]
                : []),
            ],
          }),
          ...(avatar
            ? [
                container({
                  style: {
                    width: 260,
                    height: 260,
                    borderRadius: percentage(50),
                    backgroundColor: "#334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  },
                  children: [
                    imgNode({
                      src: avatar.data,
                      width: 200,
                      height: 200,
                      style: {
                        borderRadius: percentage(50),
                        objectFit: "cover",
                      },
                    }),
                  ],
                }),
              ]
            : []),
        ],
      }),
      container({
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
        },
        children: [
          container({
            style: {
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              minWidth: 0,
            },
            children: [
              text(params.siteName, {
                color: fgPrimary,
                fontSize: 28,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                overflowWrap: "anywhere",
              }),
            ],
          }),
          container({
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              flexGrow: 1,
              minWidth: 0,
            },
            children: [
              text(params.social, {
                color: fgPrimary,
                fontSize: 28,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                textAlign: "right",
                overflowWrap: "anywhere",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return renderer.render(root, {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    format: "png",
    fonts: [{ name: "Plus Jakarta Sans", data: font }],
  });
}
