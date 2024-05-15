import { useVirtual } from "@tanstack/react-virtual";
import React, { useCallback, useRef } from "react";
import ScrollLoader from "../../loaders/ScrollLoader";
import useColorPalettes from "../../services/useColorPalettes";
import ColorPalette from "./Components/ColorPalette";
import PaletteContextProvider from "./cotext/paletteContext";

export default function Explore() {
  // Fetches color palettes data and provides pagination functionalities.
  const {
    data: paletteData, // The fetched color palettes data.
    fetchNextPage, // Function to fetch the next page of data.
    hasNextPage, // Boolean indicating if there's another page to fetch.
    isFetched, // Boolean indicating if the initial data fetch is complete.
    isLoading, // Boolean indicating if the data is currently being fetched.
    isFetchingNextPage, // Boolean indicating if the next page is being fetched.
  } = useColorPalettes();

  // useRef to store the IntersectionObserver instance.
  const intObserver = useRef();

  // useCallback to create a memoized callback function for handling the last palette element.
  const lastPaletteRef = useCallback(
    (post) => {
      // If the next page is being fetched, do nothing.
      if (isFetchingNextPage) return;

      // Disconnect the previous observer if it exists.
      if (intObserver.current) intObserver.current.disconnect();

      // Create a new IntersectionObserver instance.
      intObserver.current = new IntersectionObserver((palettes) => {
        // Get the first palette from the observed entries.
        const [palette] = palettes;

        // If the palette is intersecting and there's a next page, fetch the next page.
        if (palette.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      // If the last palette element is provided, observe it.
      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage] // Dependencies for memoization.
  );

  // Initializes the virtualizer for efficient rendering of large lists.
  const rowVirtualizer = useVirtual({
    size: paletteData?.pages.flatMap((page) => page.palettes).length, // Total number of palettes.
    parentRef: React.useRef(null), // Reference to the parent element.
    estimateSize: React.useCallback(() => 200, []), // Estimated size of each row.
  });

  return (
    // Provides the last palette reference to the context.
    <PaletteContextProvider lastPaletteReference={lastPaletteRef}>
      <section className="flex min-h-screen flex-col items-center">
        {/* Displays a loader while the initial data is loading. */}
        {isLoading && <Loader />}
        <div
          ref={rowVirtualizer.virtualHorizontalRef} // Reference for the virtualized container.
          className="w-fit mb-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-y-6 gap-x-10"
          style={{
            height: `${rowVirtualizer.totalSize}px`, // Sets the height of the container.
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.totalSize}px`, // Sets the height of the inner container.
              width: "100%",
              position: "relative",
            }}
          >
            {/* Maps over the virtualized rows. */}
            {rowVirtualizer.virtualItems.map((virtualRow) => (
              <div
                key={virtualRow.index} // Unique key for each row.
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`, // Sets the height of the row.
                  transform: `translateY(${virtualRow.start}px)`, // Positions the row.
                }}
              >
                {/* Renders the color palettes for the current row. */}
                {isFetched &&
                  paletteData?.pages
                    .flatMap((page) => page.palettes) // Flattens the palettes from all pages.
                    .slice(virtualRow.index, virtualRow.index + 1) // Extracts palettes for the current row.
                    .map((colors, index) => {
                      // Creates a set of unique colors.
                      const uniqueColors = [...new Set(colors)];

                      // Renders a ColorPalette component if there are at least 2 unique colors.
                      if (uniqueColors.length >= 2)
                        return (
                          <ColorPalette
                            colors={uniqueColors.slice(0, 7)} // Passes the first 7 unique colors.
                            key={index} // Unique key for each palette.
                          />
                        );
                    })}
              </div>
            ))}
          </div>
        </div>
        {/* Displays a loader while fetching the next page. */}
        {hasNextPage && <Loader />}
      </section>
    </PaletteContextProvider>
  );
}

// Component for the loader.
const Loader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-5 pb-10 sm:pb-4">
      <ScrollLoader />
    </div>
  );
};