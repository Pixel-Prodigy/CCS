"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PRODUCT_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_COLORS,
  PRODUCT_SIZES,
  COLOR_HEX_MAP,
  cn,
} from "@/lib/utils";
import {
  SlidersHorizontal,
  X,
  Check,
  Shirt,
  Palette,
  Tag,
  Ruler,
  ChevronRight,
  Search,
  DollarSign,
} from "lucide-react";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

function FilterChip({
  label,
  isActive,
  onClick,
  icon,
  className,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-out",
        "border-2 hover:shadow-md active:scale-[0.97]",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border/60 hover:border-primary/40 hover:bg-accent/50",
        className
      )}
    >
      {icon}
      <span className="capitalize">{label}</span>
      {isActive && <Check className="h-3.5 w-3.5 ml-0.5" />}
    </button>
  );
}

interface ColorSwatchProps {
  color: string;
  isActive: boolean;
  onClick: () => void;
}

function ColorSwatch({ color, isActive, onClick }: ColorSwatchProps) {
  const colorValue = COLOR_HEX_MAP[color] || "#888";
  const isGradient = colorValue.includes("gradient");
  const isWhite = color === "white";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 transition-all duration-300 ease-out p-2 rounded-xl",
        "active:scale-95",
        isActive && "bg-accent/60"
      )}
      title={color}
    >
      <div
        className={cn(
          "relative w-11 h-11 rounded-full transition-all duration-300 ease-out flex items-center justify-center",
          "ring-offset-background shadow-sm",
          isActive
            ? "ring-[3px] ring-primary ring-offset-2 scale-110 shadow-lg"
            : "ring-2 ring-border/40 group-hover:ring-primary/50 group-hover:scale-105 group-hover:shadow-md",
          isWhite && !isActive && "ring-2 ring-border/60"
        )}
        style={{
          background: isGradient ? colorValue : colorValue,
        }}
      >
        {isActive && (
          <Check
            className={cn(
              "h-5 w-5 drop-shadow-sm",
              color === "white" || color === "yellow" || color === "beige"
                ? "text-gray-800"
                : "text-white"
            )}
            strokeWidth={2.5}
          />
        )}
      </div>
      <span
        className={cn(
          "text-[11px] capitalize transition-all duration-200 leading-tight font-medium",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {color}
      </span>
    </button>
  );
}

interface SizeChipProps {
  size: string;
  isActive: boolean;
  onClick: () => void;
}

function SizeChip({ size, isActive, onClick }: SizeChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-14 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 ease-out",
        "border-2 active:scale-[0.96]",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border/50 hover:border-primary/40 hover:bg-accent/40"
      )}
    >
      {size}
    </button>
  );
}

// Filter section component for cleaner organization
interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  activeValue?: string;
  onClick: () => void;
}

function FilterSection({
  title,
  icon,
  isActive,
  activeValue,
  onClick,
}: FilterSectionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ease-out",
        "border-2 hover:shadow-md active:scale-[0.99]",
        isActive
          ? "border-primary/60 bg-gradient-to-r from-primary/8 to-accent/30 shadow-sm"
          : "border-border/50 hover:border-primary/30 hover:bg-accent/30 bg-card"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-2.5 rounded-xl transition-all duration-300",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted/80 text-muted-foreground"
          )}
        >
          {icon}
        </div>
        <div className="text-left">
          <p className="font-semibold text-foreground">{title}</p>
          {activeValue ? (
            <p className="text-sm text-primary font-medium capitalize">
              {activeValue}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Any</p>
          )}
        </div>
      </div>
      <ChevronRight
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
    </button>
  );
}

type FilterTab = "main" | "type" | "size" | "color" | "style" | "price";

// Price range constants
const MIN_PRICE = 0;
const MAX_PRICE = 10000;

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ]);

  const activeType = searchParams.get("type");
  const activeColor = searchParams.get("color");
  const activeCategory = searchParams.get("category");
  const activeSize = searchParams.get("size");
  const activeSearch = searchParams.get("search");
  const activeMinPrice = searchParams.get("minPrice");
  const activeMaxPrice = searchParams.get("maxPrice");

  // Sync local state with URL params
  useEffect(() => {
    setSearchQuery(activeSearch || "");
    setPriceRange([
      activeMinPrice ? parseFloat(activeMinPrice) : MIN_PRICE,
      activeMaxPrice ? parseFloat(activeMaxPrice) : MAX_PRICE,
    ]);
  }, [activeSearch, activeMinPrice, activeMaxPrice]);

  const activeFilters = useMemo(() => {
    const filters: { key: string; value: string; label: string }[] = [];
    if (activeSearch)
      filters.push({
        key: "search",
        value: activeSearch,
        label: `"${activeSearch}"`,
      });
    if (activeType)
      filters.push({ key: "type", value: activeType, label: activeType });
    if (activeCategory)
      filters.push({
        key: "category",
        value: activeCategory,
        label: activeCategory,
      });
    if (activeColor)
      filters.push({ key: "color", value: activeColor, label: activeColor });
    if (activeSize)
      filters.push({ key: "size", value: activeSize, label: activeSize });
    if (activeMinPrice || activeMaxPrice) {
      const min = activeMinPrice || "0";
      const max = activeMaxPrice || "Any";
      filters.push({
        key: "price",
        value: `${min}-${max}`,
        label: `₹${min} - ${max === "Any" ? max : `₹${max}`}`,
      });
    }
    return filters;
  }, [
    activeType,
    activeCategory,
    activeColor,
    activeSize,
    activeSearch,
    activeMinPrice,
    activeMaxPrice,
  ]);

  const hasFilters = activeFilters.length > 0;
  const hasPriceFilter = activeMinPrice !== null || activeMaxPrice !== null;

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "price") {
        // Special handling for price - clear both min and max
        params.delete("minPrice");
        params.delete("maxPrice");
        setPriceRange([MIN_PRICE, MAX_PRICE]);
      } else if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/kiosk?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    router.push("/kiosk", { scroll: false });
  }, [router]);

  const applySearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    router.push(`/kiosk?${params.toString()}`, { scroll: false });
  }, [router, searchParams, searchQuery]);

  const applyPriceRange = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange[0] > MIN_PRICE) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }
    if (priceRange[1] < MAX_PRICE) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }
    router.push(`/kiosk?${params.toString()}`, { scroll: false });
  }, [router, searchParams, priceRange]);

  const toggleFilter = (key: string, value: string) => {
    const currentValue = searchParams.get(key);
    setFilter(key, currentValue === value ? null : value);
  };

  // Reset to main tab when sheet closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setActiveTab("main");
    }
  };

  // Quick filter chips for horizontal scroll
  const QuickFilters = () => (
    <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
      {/* Types - Show first 4 */}
      {PRODUCT_TYPES.slice(0, 4).map((type) => (
        <FilterChip
          key={type}
          label={type}
          isActive={activeType === type}
          onClick={() => toggleFilter("type", type)}
        />
      ))}

      {/* Divider */}
      <div className="w-px h-6 bg-border/60 mx-1 shrink-0" />

      {/* Sizes - Show first 4 */}
      {PRODUCT_SIZES.slice(0, 4).map((size) => (
        <FilterChip
          key={size}
          label={size}
          isActive={activeSize === size}
          onClick={() => toggleFilter("size", size)}
          className="px-3.5 min-w-[3rem]"
        />
      ))}
    </div>
  );

  // Render content based on active tab
  const renderSheetContent = () => {
    if (activeTab === "main") {
      return (
        <div className="p-5 space-y-3">
          {/* Search Input */}
          <div className="space-y-3 pb-4 border-b border-border/40">
            <p className="text-sm text-muted-foreground font-medium">
              Search by name
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applySearch();
                    }
                  }}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
              <Button
                onClick={applySearch}
                size="default"
                className="h-11 px-4 rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>

          <FilterSection
            title="Price Range"
            icon={<DollarSign className="h-5 w-5" />}
            isActive={hasPriceFilter}
            activeValue={
              hasPriceFilter
                ? `₹${activeMinPrice || "0"} - ₹${activeMaxPrice || MAX_PRICE}`
                : undefined
            }
            onClick={() => setActiveTab("price")}
          />
          <FilterSection
            title="Clothing Type"
            icon={<Shirt className="h-5 w-5" />}
            isActive={!!activeType}
            activeValue={activeType || undefined}
            onClick={() => setActiveTab("type")}
          />
          <FilterSection
            title="Size"
            icon={<Ruler className="h-5 w-5" />}
            isActive={!!activeSize}
            activeValue={activeSize || undefined}
            onClick={() => setActiveTab("size")}
          />
          <FilterSection
            title="Color"
            icon={<Palette className="h-5 w-5" />}
            isActive={!!activeColor}
            activeValue={activeColor || undefined}
            onClick={() => setActiveTab("color")}
          />
          <FilterSection
            title="Style"
            icon={<Tag className="h-5 w-5" />}
            isActive={!!activeCategory}
            activeValue={activeCategory || undefined}
            onClick={() => setActiveTab("style")}
          />
        </div>
      );
    }

    if (activeTab === "type") {
      return (
        <div className="p-5 space-y-5">
          <p className="text-sm text-muted-foreground font-medium">
            Select a clothing type
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCT_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={type}
                isActive={activeType === type}
                onClick={() => toggleFilter("type", type)}
                className="justify-center py-3.5"
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "size") {
      return (
        <div className="p-5 space-y-5">
          <p className="text-sm text-muted-foreground font-medium">
            Select your size
          </p>
          <div className="grid grid-cols-4 gap-3">
            {PRODUCT_SIZES.map((size) => (
              <SizeChip
                key={size}
                size={size}
                isActive={activeSize === size}
                onClick={() => toggleFilter("size", size)}
              />
            ))}
          </div>
          <div className="pt-5 border-t border-border/40 mt-5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground/70">
                Size guide:
              </span>{" "}
              XS (0-2), S (4-6), M (8-10), L (12-14), XL (16-18), XXL (20-22)
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === "color") {
      return (
        <div className="p-5 space-y-5">
          <p className="text-sm text-muted-foreground font-medium">
            Choose a color
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PRODUCT_COLORS.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                isActive={activeColor === color}
                onClick={() => toggleFilter("color", color)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "style") {
      return (
        <div className="p-5 space-y-5">
          <p className="text-sm text-muted-foreground font-medium">
            Select a style category
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCT_CATEGORIES.map((category) => (
              <FilterChip
                key={category}
                label={category}
                isActive={activeCategory === category}
                onClick={() => toggleFilter("category", category)}
                className="justify-center py-3.5"
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "price") {
      return (
        <div className="p-5 space-y-6">
          <p className="text-sm text-muted-foreground font-medium">
            Set your budget range
          </p>

          {/* Price Display */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 p-4 rounded-xl border-2 border-border/50 bg-card text-center">
              <p className="text-xs text-muted-foreground mb-1">Min Price</p>
              <p className="text-xl font-bold text-foreground">
                ₹{priceRange[0].toLocaleString()}
              </p>
            </div>
            <div className="text-muted-foreground font-medium">to</div>
            <div className="flex-1 p-4 rounded-xl border-2 border-border/50 bg-card text-center">
              <p className="text-xs text-muted-foreground mb-1">Max Price</p>
              <p className="text-xl font-bold text-foreground">
                {priceRange[1] >= MAX_PRICE
                  ? "Any"
                  : `₹${priceRange[1].toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="px-2 py-4">
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹{MAX_PRICE.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Quick Select
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Under ₹500", min: 0, max: 500 },
                { label: "₹500 - ₹1000", min: 500, max: 1000 },
                { label: "₹1000 - ₹2500", min: 1000, max: 2500 },
                { label: "₹2500 - ₹5000", min: 2500, max: 5000 },
                { label: "₹5000+", min: 5000, max: MAX_PRICE },
                { label: "Any Price", min: MIN_PRICE, max: MAX_PRICE },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setPriceRange([preset.min, preset.max])}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                    "border-2 active:scale-[0.97]",
                    priceRange[0] === preset.min && priceRange[1] === preset.max
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border/50 hover:border-primary/40 hover:bg-accent/40"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button
            onClick={applyPriceRange}
            className="w-full h-12 rounded-xl font-semibold"
          >
            Apply Price Filter
          </Button>
        </div>
      );
    }

    return null;
  };

  const getSheetTitle = () => {
    switch (activeTab) {
      case "type":
        return "Clothing Type";
      case "size":
        return "Size";
      case "color":
        return "Color";
      case "style":
        return "Style";
      case "price":
        return "Price Range";
      default:
        return "Filters";
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Top Row: Title + Search + Filter Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-xl font-bold tracking-tight truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Browse Collection
              </h1>
              {hasFilters && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-1 text-xs font-semibold shrink-0 bg-primary/10 text-primary border-0"
                >
                  {activeFilters.length} active
                </Badge>
              )}
            </div>

            {/* Search Bar - Always visible */}
            <div className="flex-1 max-w-xs hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      applySearch();
                    }
                  }}
                  className="pl-10 h-10 rounded-xl border-2 border-border/60 focus:border-primary/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("search", null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground h-9 px-3 font-medium"
                >
                  Clear
                </Button>
              )}

              {/* Filter Sheet Trigger */}
              <Sheet open={isOpen} onOpenChange={handleOpenChange}>
                <SheetTrigger asChild>
                  <Button
                    variant={hasFilters ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-10 gap-2 rounded-xl font-semibold transition-all duration-300",
                      !hasFilters &&
                        "border-2 border-border/60 hover:border-primary/40"
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                    {hasFilters && (
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-primary-foreground text-primary"
                      >
                        {activeFilters.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md flex flex-col p-0 border-l-2 border-border/30"
                >
                  <SheetHeader className="px-5 py-5 border-b border-border/40 shrink-0 bg-gradient-to-b from-card to-background">
                    <div className="flex items-center gap-3">
                      {activeTab !== "main" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 rounded-xl hover:bg-accent"
                          onClick={() => setActiveTab("main")}
                        >
                          <ChevronRight className="h-5 w-5 rotate-180" />
                        </Button>
                      )}
                      <SheetTitle className="text-xl font-bold flex-1">
                        {getSheetTitle()}
                      </SheetTitle>
                      {hasFilters && activeTab === "main" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-muted-foreground hover:text-destructive text-sm h-9 font-medium"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  </SheetHeader>

                  <ScrollArea className="flex-1 bg-background">
                    {renderSheetContent()}
                  </ScrollArea>

                  <SheetFooter className="px-5 py-5 border-t border-border/40 bg-gradient-to-t from-card to-background shrink-0">
                    <div className="flex items-center justify-between w-full gap-4">
                      <p className="text-sm text-muted-foreground font-medium">
                        {activeFilters.length > 0
                          ? `${activeFilters.length} filter${
                              activeFilters.length > 1 ? "s" : ""
                            } selected`
                          : "No filters selected"}
                      </p>
                      <SheetClose asChild>
                        <Button
                          size="default"
                          className="px-8 rounded-xl font-semibold"
                        >
                          View Results
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Quick Filters Row */}
          <QuickFilters />

          {/* Active Filters Pills */}
          {hasFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Active:
              </span>
              {activeFilters.map((filter) => (
                <Badge
                  key={`${filter.key}-${filter.value}`}
                  variant="secondary"
                  className={cn(
                    "capitalize cursor-pointer transition-all duration-300 gap-2 pr-2 py-1.5 rounded-lg font-medium",
                    "bg-primary/10 text-primary border-0 hover:bg-destructive/20 hover:border-destructive/50  hover:text-destructive-foreground"
                  )}
                  onClick={() => setFilter(filter.key, null)}
                >
                  {filter.key === "color" && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border-2 border-white/30 shadow-sm"
                      style={{
                        background: COLOR_HEX_MAP[filter.value] || "#888",
                      }}
                    />
                  )}
                  {filter.label}
                  <X className="h-3.5 w-3.5" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
