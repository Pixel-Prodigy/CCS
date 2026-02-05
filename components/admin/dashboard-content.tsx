"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Shop } from "@/lib/types";
import {
  Package,
  Plus,
  Settings,
  ArrowRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  AlertTriangle,
  Layers,
  DollarSign,
  Store,
  Monitor,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  shop: Shop | null;
  stats: {
    totalProducts: number;
    lowStockCount: number;
    categoriesCount: number;
    totalValue: number;
  };
  userEmail: string;
  userName: string;
}

export function DashboardContent({
  shop,
  stats,
  userName,
}: DashboardContentProps) {
  const firstName = userName?.split(" ")[0] || "there";

  // Define onboarding checklist items
  const checklistItems = [
    {
      id: "create-shop",
      title: "Create your shop",
      description: "Set up your shop profile",
      completed: true, // Always true if they reach dashboard
      href: "/admin/settings",
    },
    {
      id: "add-product",
      title: "Add your first product",
      description: "Start building your catalog",
      completed: stats.totalProducts > 0,
      href: "/admin/products/new",
    },
    {
      id: "multiple-products",
      title: "Add 5+ products",
      description: "Build out your inventory",
      completed: stats.totalProducts >= 5,
      href: "/admin/products/new",
    },
    {
      id: "setup-kiosk",
      title: "Try the kiosk view",
      description: "See what customers will see",
      completed: false, // We can track this later with settings
      href: "/kiosk",
      external: true,
    },
  ];

  const completedCount = checklistItems.filter((item) => item.completed).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {shop?.name
            ? `Managing ${shop.name}`
            : "Here's what's happening with your shop."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalProducts === 0
                ? "Add your first product"
                : `In ${stats.categoriesCount} categories`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle
              className={cn(
                "h-4 w-4",
                stats.lowStockCount > 0
                  ? "text-yellow-500"
                  : "text-muted-foreground"
              )}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockCount > 0
                ? "Items need restocking"
                : "All items well stocked"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesCount}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Getting Started Checklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Complete these steps to get the most out of your shop
                </CardDescription>
              </div>
              <Badge
                variant={progressPercentage === 100 ? "default" : "secondary"}
              >
                {completedCount}/{checklistItems.length}
              </Badge>
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklistItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                  item.completed
                    ? "bg-muted/50 border-muted"
                    : "hover:bg-muted/50 hover:border-primary/20"
                )}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium",
                      item.completed && "text-muted-foreground line-through"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                {!item.completed && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks to manage your shop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/products/new" className="block">
              <Button
                className="w-full justify-start h-auto py-4"
                variant="outline"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Add New Product</p>
                    <p className="text-sm text-muted-foreground">
                      Add a product to your catalog
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/admin/products" className="block">
              <Button
                className="w-full justify-start h-auto py-4"
                variant="outline"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Manage Products</p>
                    <p className="text-sm text-muted-foreground">
                      View and edit your inventory
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/kiosk" target="_blank" className="block">
              <Button
                className="w-full justify-start h-auto py-4"
                variant="outline"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Monitor className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Open Kiosk</p>
                    <p className="text-sm text-muted-foreground">
                      Launch the customer-facing display
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/admin/settings" className="block">
              <Button
                className="w-full justify-start h-auto py-4"
                variant="outline"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <Settings className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Shop Settings</p>
                    <p className="text-sm text-muted-foreground">
                      Update your shop profile
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Shop Info Card */}
      {shop && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Shop Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Shop Name</p>
                <p className="font-medium">{shop.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium capitalize">{shop.category}</p>
              </div>
              {shop.city && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {shop.city}
                    {shop.state && `, ${shop.state}`}
                  </p>
                </div>
              )}
              {shop.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{shop.phone}</p>
                </div>
              )}
            </div>
            {shop.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{shop.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
