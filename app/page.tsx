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
import {
  Store,
  Users,
  Sparkles,
  ShoppingBag,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Smartphone,
  RefreshCw,
  XCircle,
  Package,
  Camera,
  Monitor,
  Shirt,
  Star,
  Heart,
  Play,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// Floating clothes animation - hidden on mobile for performance
function FloatingClothes() {
  const items = [
    { icon: Shirt, delay: 0, x: -200, y: -100 },
    { icon: ShoppingBag, delay: 0.2, x: 200, y: -50 },
    { icon: Heart, delay: 0.4, x: -150, y: 100 },
    { icon: Star, delay: 0.6, x: 180, y: 80 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.3, 0.3, 0],
            scale: [0.5, 1, 1, 0.5],
            x: [0, item.x * 0.5, item.x, item.x * 1.2],
            y: [0, item.y * 0.5, item.y, item.y * 1.2],
          }}
          transition={{
            duration: 4,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <item.icon className="h-8 w-8 text-primary/40" />
        </motion.div>
      ))}
    </div>
  );
}

// Gradient orb component - static on mobile, animated on desktop
function GradientOrb({
  className,
  mobileHidden = false,
}: {
  className?: string;
  mobileHidden?: boolean;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className} ${
        mobileHidden ? "hidden md:block" : ""
      }`}
      initial={{ scale: 1, opacity: 0.3 }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      // Reduce motion for users who prefer it
      style={{ willChange: "auto" }}
    />
  );
}

// Section wrapper with scroll animation
function AnimatedSection({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Animated card wrapper
function AnimatedCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60"
            >
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              TryOn
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Benefits"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/admin/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden"
      >
        {/* Animated background - hidden on mobile to prevent flickering */}
        <div className="absolute inset-0 hidden md:block">
          <GradientOrb className="w-[600px] h-[600px] bg-primary/30 -top-48 -left-48" />
          <GradientOrb className="w-[500px] h-[500px] bg-violet-500/20 -bottom-32 -right-32" />
          <GradientOrb className="w-[300px] h-[300px] bg-blue-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* Simple gradient background for mobile */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container mx-auto px-4 py-20 md:py-32 relative z-10"
        >
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm backdrop-blur-sm border border-primary/20"
              >
                <Store className="mr-2 h-4 w-4 text-primary" />
                Modern Digital Catalog for Retail
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="block">Your Fashion</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Showcase
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              The complete digital catalog for clothing stores. Showcase your
              collection beautifully, let customers browse on in-store kiosks,
              and manage inventory effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/admin/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/kiosk">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-full backdrop-blur-sm"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground"
            >
              {[
                { icon: CheckCircle2, text: "No hardware required" },
                { icon: CheckCircle2, text: "Setup in 5 minutes" },
                { icon: CheckCircle2, text: "Works on any device" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Floating clothes decoration */}
          <FloatingClothes />
        </motion.div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Demo Preview */}
      <AnimatedSection className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative aspect-[16/10] rounded-3xl bg-gradient-to-br from-primary/10 via-background to-violet-500/10 border border-primary/20 overflow-hidden shadow-2xl shadow-primary/10">
              {/* Mock kiosk interface */}
              <div className="absolute inset-4 md:inset-8 flex gap-4 md:gap-8">
                {/* Left side - product grid */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 rounded-2xl bg-gradient-to-b from-muted/50 to-muted/30 backdrop-blur border border-white/10 p-3 md:p-4"
                >
                  <div className="text-xs md:text-sm font-medium text-muted-foreground mb-2 md:mb-3">
                    Your Catalog
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {[Shirt, ShoppingBag, Package, Heart].map((Icon, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="aspect-square rounded-lg bg-background/50 flex items-center justify-center border border-white/10"
                      >
                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary/50" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right side - model display */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex-[1.5] rounded-2xl bg-gradient-to-b from-violet-500/20 to-primary/20 backdrop-blur flex flex-col items-center justify-center border border-white/10 p-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-32 md:w-36 md:h-48 rounded-xl bg-gradient-to-br from-violet-500/30 to-primary/30 flex items-center justify-center mb-3"
                  >
                    <Users className="w-12 h-12 md:w-16 md:h-16 text-violet-500/70" />
                  </motion.div>
                  <p className="text-sm md:text-base text-muted-foreground text-center">
                    Model Preview
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    See how it looks
                  </p>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="absolute -right-4 top-1/4 md:-right-8"
            >
              <div className="bg-background border rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Easy Catalog</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="absolute -left-4 bottom-1/4 md:-left-8"
            >
              <div className="bg-background border rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Kiosk Ready</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Problem Section */}
      <AnimatedSection className="border-y bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">
                The Challenge
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Managing Inventory is{" "}
                <span className="text-destructive">Hard</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Small retailers struggle with these daily challenges
              </p>
            </motion.div>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: Package,
                title: "Scattered Products",
                description:
                  "No central place to track what you have. Spreadsheets get outdated. Photos scattered everywhere.",
              },
              {
                icon: Clock,
                title: "Time Wasted",
                description:
                  "Staff spend hours answering 'do you have this in size X?' instead of making sales.",
              },
              {
                icon: XCircle,
                title: "Poor Presentation",
                description:
                  "Customers can't browse your collection easily. They miss items they would have loved.",
              },
            ].map((item, i) => (
              <AnimatedCard key={i} delay={i * 0.15}>
                <Card className="border-destructive/20 bg-gradient-to-b from-destructive/5 to-transparent h-full group hover:border-destructive/40 transition-colors">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mb-4"
                    >
                      <item.icon className="h-7 w-7 text-destructive" />
                    </motion.div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Solution Section */}
      <AnimatedSection className="py-24" id="features">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                <Store className="mr-1.5 h-3 w-3" />
                The Solution
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Your Complete{" "}
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  Digital Showroom
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to showcase your collection beautifully
              </p>
            </motion.div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              {[
                {
                  icon: Package,
                  title: "Smart Catalog",
                  description:
                    "Upload products with photos, sizes, colors, and prices. Everything organized in one place.",
                },
                {
                  icon: Users,
                  title: "Model Gallery",
                  description:
                    "Show customers how clothes actually look when worn. Beautiful model photos for every item.",
                },
                {
                  icon: Monitor,
                  title: "Kiosk Mode",
                  description:
                    "Deploy on any tablet as an interactive in-store display. Customers browse independently.",
                },
                {
                  icon: BarChart3,
                  title: "Inventory Tracking",
                  description:
                    "Track stock levels, sizes, and availability. Always know what you have.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex gap-5 group cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 group-hover:from-primary/30 group-hover:to-violet-500/30 transition-colors"
                  >
                    <feature.icon className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:pl-8"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-background p-1">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-background via-background to-muted flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-primary/70" />
                    </div>
                  </motion.div>
                  {/* Orbiting elements */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        width: `${60 + i * 25}%`,
                        height: `${60 + i * 25}%`,
                      }}
                    >
                      <div
                        className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-primary to-violet-500 shadow-lg"
                        style={{
                          top: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection className="border-y bg-muted/30 py-24" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Up and Running in{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Steps container */}
            <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-8 md:gap-4 relative">
              {/* Connection line - only visible on md+ */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-1 z-0">
                <div className="w-full h-full bg-gradient-to-r from-primary via-violet-500 to-primary rounded-full opacity-30" />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-violet-500 to-primary rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </div>

              {[
                {
                  step: 1,
                  title: "Create Your Shop",
                  description:
                    "Sign up and set up your shop profile. No technical knowledge needed.",
                },
                {
                  step: 2,
                  title: "Upload Products",
                  description:
                    "Add clothing items with photos and model images. Build your digital catalog.",
                },
                {
                  step: 3,
                  title: "Launch Kiosk",
                  description:
                    "Open on any tablet in-store. Customers browse and see models wearing your clothes.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex-1 text-center relative z-10"
                >
                  {/* Step circle */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-violet-500 blur-lg opacity-40" />
                      {/* Circle */}
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-primary-foreground text-3xl font-bold shadow-xl border-4 border-background">
                        {item.step}
                      </div>
                    </motion.div>
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Static gradient on mobile, animated on desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-violet-600 to-primary md:bg-[length:200%_auto] md:animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 md:grid-cols-4 text-center text-white">
            {[
              { value: 100, suffix: "+", label: "Products Managed" },
              { value: 5, suffix: " min", label: "Setup Time" },
              { value: 24, suffix: "/7", label: "Self-Service" },
              { value: 0, suffix: "", label: "Hardware Cost" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/80 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <AnimatedSection className="py-24" id="benefits">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Star className="mr-1.5 h-3 w-3" />
              Why Choose TryOn
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Benefits for{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Everyone
              </span>
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* For Shop Owners */}
            <AnimatedCard>
              <Card className="h-full bg-gradient-to-br from-background to-primary/5 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60"
                    >
                      <Store className="h-7 w-7 text-primary-foreground" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-xl">For Shop Owners</CardTitle>
                      <CardDescription>
                        Grow with modern technology
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    {
                      icon: Package,
                      title: "Organized Inventory",
                      desc: "All products in one place",
                    },
                    {
                      icon: Clock,
                      title: "Save Hours Daily",
                      desc: "Less time searching, more selling",
                    },
                    {
                      icon: Monitor,
                      title: "Professional Display",
                      desc: "Modern kiosk for your store",
                    },
                    {
                      icon: Zap,
                      title: "Competitive Edge",
                      desc: "Stand out from competition",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* For Customers */}
            <AnimatedCard delay={0.1}>
              <Card className="h-full bg-gradient-to-br from-background to-violet-500/5 border-violet-500/20">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-500/60"
                    >
                      <Heart className="h-7 w-7 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-xl">For Customers</CardTitle>
                      <CardDescription>A delightful experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    {
                      icon: Smartphone,
                      title: "Self-Service Browse",
                      desc: "Explore at your own pace",
                    },
                    {
                      icon: Users,
                      title: "See It Worn",
                      desc: "Model photos show real fit",
                    },
                    {
                      icon: ShoppingBag,
                      title: "Discover More",
                      desc: "Find items you'd have missed",
                    },
                    {
                      icon: Star,
                      title: "Modern Experience",
                      desc: "Interactive & engaging",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                        <item.icon className="h-5 w-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Product Features Grid */}
      <AnimatedSection className="border-t bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Full Platform
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete solution for modern retail
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: Package,
                title: "Product Catalog",
                description:
                  "Inventory management with images, sizes, colors, and stock tracking",
                comingSoon: false,
              },
              {
                icon: Users,
                title: "Model Gallery",
                description:
                  "Upload model photos to show how clothes look when worn",
                comingSoon: false,
              },
              {
                icon: Monitor,
                title: "Kiosk Mode",
                description:
                  "Full-screen optimized for in-store tablets and displays",
                comingSoon: false,
              },
              {
                icon: Smartphone,
                title: "Mobile Ready",
                description: "Works perfectly on phones, tablets, and desktops",
                comingSoon: false,
              },
              {
                icon: BarChart3,
                title: "Inventory Tracking",
                description:
                  "Track stock levels, sizes, and availability in real-time",
                comingSoon: false,
              },
              {
                icon: Sparkles,
                title: "AI Virtual Try-On",
                description:
                  "Customers will see themselves wearing your clothes with AI",
                comingSoon: true,
              },
            ].map((feature, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <Card
                  className={`text-center h-full group hover:border-primary/50 transition-colors relative ${
                    feature.comingSoon ? "border-dashed" : ""
                  }`}
                >
                  {feature.comingSoon && (
                    <Badge className="absolute -top-2 -right-2 bg-violet-500">
                      Coming Soon
                    </Badge>
                  )}
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-4 transition-colors ${
                        feature.comingSoon
                          ? "bg-gradient-to-br from-violet-500/10 to-violet-500/20 group-hover:from-violet-500/20 group-hover:to-violet-500/30"
                          : "bg-gradient-to-br from-primary/10 to-violet-500/10 group-hover:from-primary/20 group-hover:to-violet-500/20"
                      }`}
                    >
                      <feature.icon
                        className={`h-8 w-8 ${
                          feature.comingSoon
                            ? "text-violet-500"
                            : "text-primary"
                        }`}
                      />
                    </motion.div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient orb hidden on mobile */}
        <div className="absolute inset-0 hidden md:block">
          <GradientOrb className="w-[800px] h-[800px] bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* Simple gradient background for mobile */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Ready to Modernize{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Your Store?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join retailers who showcase their collection with a beautiful
              digital catalog.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/admin/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="text-lg px-10 py-7 rounded-full shadow-lg shadow-primary/30"
                  >
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/kiosk">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-7 rounded-full"
                  >
                    Try the Demo
                  </Button>
                </motion.div>
              </Link>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              No credit card required · Setup in under 5 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">TryOn</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered virtual try-on for modern retail stores. Transform
                shopping experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {["Features", "How It Works", "Demo"].map((item) => (
                  <li key={item}>
                    <Link
                      href={
                        item === "Demo"
                          ? "/kiosk"
                          : `#${item.toLowerCase().replace(/ /g, "-")}`
                      }
                      className="hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {["About", "Contact", "Privacy"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/admin/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/login"
                    className="hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} TryOn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
