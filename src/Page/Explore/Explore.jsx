import { useVirtual } from "@tanstack/react-virtual";
import React, { useCallback, useRef } from "react";
import ScrollLoader from "../../loaders/ScrollLoader";
import useColorPalettes from "../../services/useColorPalettes";
import ColorPalette from "./Components/ColorPalette";
import PaletteContextProvider from "./cotext/paletteContext";

export default function Explore() {
  const {
    data: paletteData,
    fetchNextPage,
    hasNextPage,
    isFetched,
    isLoading,
    isFetchingNextPage,
  } = useColorPalettes();

  const intObserver = useRef();
  const lastPaletteRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((palettes) => {
        const [palette] = palettes;
        if (palette.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const rowVirtualizer = useVirtual({
    size: paletteData?.pages.flatMap((page) => page.palettes).length,
    parentRef: React.useRef(null),
    estimateSize: React.useCallback(() => 200, []),
  });

  return (
    <PaletteContextProvider lastPaletteReference={lastPaletteRef}>
      <section className="flex min-h-screen flex-col items-center">
        {isLoading && <Loader />}
        <div
          ref={rowVirtualizer.virtualHorizontalRef}
          className="w-fit mb-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-y-6 gap-x-10"
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow) => (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isFetched &&
                  paletteData?.pages
                    .flatMap((page) => page.palettes)
                    .slice(virtualRow.index, virtualRow.index + 1)
                    .map((colors, index) => {
                      const uniqueColors = [...new Set(colors)];
                      if (uniqueColors.length >= 2)
                        return (
                          <ColorPalette
                            colors={uniqueColors.slice(0, 7)}
                            key={index}
                          />
                        );
                    })}
              </div>
            ))}
          </div>
        </div>
        {hasNextPage && <Loader />}
      </section>
    </PaletteContextProvider>
  );
}

const Loader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-5 pb-10 sm:pb-4">
      <ScrollLoader />
    </div>
  );
};