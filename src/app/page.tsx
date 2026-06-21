"use client";

import React, { useState, useEffect } from "react";
import { 
  Leaf, Zap, Car, ShoppingBag, User, Award, Shield, Users, 
  HelpCircle, Activity, Globe, Send, Plus, Trash, Check, Lock, 
  ChevronRight, Menu, X, Share2, Flame, LogOut, Heart, ArrowUpRight,
  TrendingDown, Sparkles, QrCode, Mail, Smartphone, Eye
} from "lucide-react";

// --- Types & Interfaces ---
interface EmissionEntry {
  id: string;
  date: string;
  carKm: number;
  bikeKm: number;
  publicTransportKm: number;
  flightsHours: number;
  electricityKwh: number;
  gasLpg: number;
  diet: string;
  shoppingPurchases: number;
  clothingItems: number;
  totalCO2: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  co2Saved: number;
  completed: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  role: string;
  content: string;
  category: string;
  likes: number;
  liked: boolean;
  comments: { author: string; text: string }[];
}

export default function EcoTrackApp() {
  // --- Navigation & Auth State ---
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  // --- User Profile & Gamification State ---
  const [userProfile, setUserProfile] = useState({
    name: "Alex Rivera",
    email: "alex@ecotrack.ai",
    xp: 320,
    level: 2,
    streak: 5,
    badges: ["Green Beginner", "Carbon Reducer", "Efficiency Champion"]
  });

  // --- Calculator Input State ---
  const [carKm, setCarKm] = useState<number>(50);
  const [bikeKm, setBikeKm] = useState<number>(10);
  const [publicTransportKm, setPublicTransportKm] = useState<number>(30);
  const [flightsHours, setFlightsHours] = useState<number>(0);
  const [electricityKwh, setElectricityKwh] = useState<number>(150);
  const [gasLpg, setGasLpg] = useState<number>(15);
  const [diet, setDiet] = useState<string>("mixed");
  const [shoppingPurchases, setShoppingPurchases] = useState<number>(100);
  const [clothingItems, setClothingItems] = useState<number>(2);

  // --- Dynamic Live Emission Calculation ---
  const calculateCO2 = (): number => {
    // Emission factors (kg CO2 per unit)
    const factorCar = 0.18; // per km
    const factorBike = 0.00; 
    const factorTransit = 0.04; // per km
    const factorFlight = 90.00; // per hour
    const factorElectricity = 0.85; // per kWh
    const factorGas = 2.1; // per LPG cylinder or cubic meter unit
    let factorDiet = 1.5; // default mixed (kg/day equivalent factorized to monthly index)
    if (diet === "vegetarian") factorDiet = 0.7;
    if (diet === "vegan") factorDiet = 0.5;
    if (diet === "meat-heavy") factorDiet = 3.0;

    const factorShopping = 0.25; // per dollar spent
    const factorClothing = 8.0; // per item

    const transportationEmissions = (carKm * factorCar) + (bikeKm * factorBike) + (publicTransportKm * factorTransit) + (flightsHours * factorFlight);
    const energyEmissions = (electricityKwh * factorElectricity) + (gasLpg * factorGas);
    const dietEmissions = factorDiet * 30; // Monthly estimate
    const shoppingEmissions = (shoppingPurchases * factorShopping) + (clothingItems * factorClothing);

    return Math.round(transportationEmissions + energyEmissions + dietEmissions + shoppingEmissions);
  };

  // --- History/Entries State ---
  const [emissionsHistory, setEmissionsHistory] = useState<EmissionEntry[]>([
    {
      id: "1",
      date: "Mar 2026",
      carKm: 300,
      bikeKm: 50,
      publicTransportKm: 120,
      flightsHours: 0,
      electricityKwh: 140,
      gasLpg: 12,
      diet: "mixed",
      shoppingPurchases: 80,
      clothingItems: 1,
      totalCO2: 340
    },
    {
      id: "2",
      date: "Apr 2026",
      carKm: 250,
      bikeKm: 60,
      publicTransportKm: 140,
      flightsHours: 2,
      electricityKwh: 120,
      gasLpg: 10,
      diet: "vegetarian",
      shoppingPurchases: 60,
      clothingItems: 3,
      totalCO2: 480
    },
    {
      id: "3",
      date: "May 2026",
      carKm: 120,
      bikeKm: 120,
      publicTransportKm: 200,
      flightsHours: 0,
      electricityKwh: 110,
      gasLpg: 8,
      diet: "vegetarian",
      shoppingPurchases: 50,
      clothingItems: 0,
      totalCO2: 215
    }
  ]);

  // --- Smart Goals ---
  const [monthlyTarget, setMonthlyTarget] = useState<number>(300);

  // --- Daily Eco Challenges State ---
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: "c1", title: "Meat-Free Day", description: "Consume purely vegetarian or vegan meals today.", category: "diet", xpReward: 40, co2Saved: 3.5, completed: false },
    { id: "c2", title: "Public Transport Hero", description: "Use buses, trains, or bicycles instead of a personal car.", category: "transportation", xpReward: 50, co2Saved: 4.8, completed: false },
    { id: "c3", title: "Unplug Idle Devices", description: "Turn off all standby appliances and chargers overnight.", category: "energy", xpReward: 30, co2Saved: 1.2, completed: false },
    { id: "c4", title: "Reusable Only", description: "Avoid any single-use plastic bottles, cups, or bags today.", category: "shopping", xpReward: 35, co2Saved: 2.0, completed: false }
  ]);

  // --- Community Section State ---
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "p1",
      author: "Emma Watson",
      role: "Climate Activist",
      content: "Just hit my 7-day streak of commuting by bike! Saved approximately 25kg of CO2 this week alone. Keep going everyone! 🚲💚",
      category: "achievement",
      likes: 24,
      liked: false,
      comments: [
        { author: "Alex Rivera", text: "Incredible! Inspiring me to do the same." },
        { author: "David K.", text: "Way to go, Emma!" }
      ]
    },
    {
      id: "p2",
      author: "Prof. Sarah Jenkins",
      role: "Climate Researcher",
      content: "Tip of the day: Lowering your thermostat by just 1°C can reduce your energy bill and heating carbon output by up to 10%.",
      category: "tip",
      likes: 42,
      liked: false,
      comments: []
    }
  ]);
  const [newPostText, setNewPostText] = useState<string>(" ");
  const [newPostCategory, setNewPostCategory] = useState<string>("tip");

  // --- AI Carbon Coach Chat State ---
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello! I am your AI Carbon Coach. Let's analyze your daily routines and reduce your carbon footprint! Ask me anything." }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  // --- QR Scanner Simulation ---
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [selectedChallengeForQR, setSelectedChallengeForQR] = useState<string | null>(null);

  // --- Sustainability Score Calculation ---
  const calculateSustainabilityScore = (): number => {
    // A score from 0-100 based on carbon emissions, completed challenges, and streak.
    const averageEmission = emissionsHistory.length > 0 
      ? emissionsHistory.reduce((acc, curr) => acc + curr.totalCO2, 0) / emissionsHistory.length 
      : 350;
    
    // Lower emissions = higher score (baseline 500kg monthly as 0, 100kg or below as 100)
    let emissionScore = 100 - ((averageEmission - 100) / 4);
    emissionScore = Math.max(0, Math.min(100, emissionScore));

    // Challenges contribution
    const completedCount = challenges.filter(c => c.completed).length;
    const challengeScore = completedCount * 10;

    // Streak contribution
    const streakScore = Math.min(20, userProfile.streak * 2);

    return Math.round((emissionScore * 0.7) + (challengeScore * 0.2) + streakScore);
  };

  // --- Handlers ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login" && email && password) {
      setUserProfile({
        ...userProfile,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email: email
      });
      setIsLoggedIn(true);
      setCurrentTab("dashboard");
    } else if (authMode === "register" && email && password && name) {
      setUserProfile({
        ...userProfile,
        name: name,
        email: email
      });
      setIsLoggedIn(true);
      setCurrentTab("dashboard");
    }
  };

  const handleAddEmission = () => {
    const total = calculateCO2();
    const newEntry: EmissionEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      carKm,
      bikeKm,
      publicTransportKm,
      flightsHours,
      electricityKwh,
      gasLpg,
      diet,
      shoppingPurchases,
      clothingItems,
      totalCO2: total
    };

    setEmissionsHistory([newEntry, ...emissionsHistory]);
    
    // Reward XP
    setUserProfile(prev => {
      const newXp = prev.xp + 50;
      const newLevel = Math.floor(newXp / 250) + 1;
      const levelUp = newLevel > prev.level;
      const badges = [...prev.badges];
      if (levelUp && !badges.includes("Carbon Reducer")) {
        badges.push("Carbon Reducer");
      }
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        badges
      };
    });

    setCurrentTab("dashboard");
  };

  const handleCompleteChallenge = (id: string) => {
    setChallenges(challenges.map(c => {
      if (c.id === id && !c.completed) {
        // Reward XP and update streak
        setUserProfile(prev => {
          const newXp = prev.xp + c.xpReward;
          const newLevel = Math.floor(newXp / 250) + 1;
          const badges = [...prev.badges];
          if (newXp >= 500 && !badges.includes("Eco Warrior")) {
            badges.push("Eco Warrior");
          }
          return {
            ...prev,
            xp: newXp,
            level: newLevel,
            streak: prev.streak + 1,
            badges
          };
        });
        return { ...c, completed: true };
      }
      return c;
    }));
  };

  const handleQRVerify = (challengeId: string) => {
    setSelectedChallengeForQR(challengeId);
    setIsScannerOpen(true);
  };

  const confirmQRScan = () => {
    if (selectedChallengeForQR) {
      handleCompleteChallenge(selectedChallengeForQR);
      setIsScannerOpen(false);
      setSelectedChallengeForQR(null);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputMessage("");
    setIsBotTyping(true);

    // AI simulated brain responses based on input keywords
    setTimeout(() => {
      let botResponse = "";
      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes("car") || lowerMsg.includes("travel") || lowerMsg.includes("transport")) {
        botResponse = "Switching from a personal car to public transport twice a week can reduce your carbon footprint by about 180kg CO2 annually. Consider carpooling or hybrid work setups!";
      } else if (lowerMsg.includes("diet") || lowerMsg.includes("food") || lowerMsg.includes("meat")) {
        botResponse = "Adopting a vegetarian diet for just 3 days a week cuts your food-related carbon emissions by 40%. Vegans save even more—up to 60% compared to heavy meat eaters!";
      } else if (lowerMsg.includes("energy") || lowerMsg.includes("electricity") || lowerMsg.includes("light")) {
        botResponse = "Replacing five of your home's most frequently used light bulbs with LED models uses 75% less energy and saves up to $75 a year on electric bills.";
      } else if (lowerMsg.includes("shopping") || lowerMsg.includes("clothes") || lowerMsg.includes("clothing")) {
        botResponse = "Fast fashion accounts for 10% of global emissions. Buying thrift clothes or high-quality sustainable apparel extends item lifetimes and cuts raw production footprint by 80%.";
      } else {
        botResponse = "That's a great question! Reducing emissions starts with daily habits. Focus on green energy, plant-based diets, active commuting, and recycling. What habits would you like to tweak today?";
      }

      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
      setIsBotTyping(false);
    }, 1200);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: userProfile.name,
      role: "Member",
      content: newPostText,
      category: newPostCategory,
      likes: 0,
      liked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    
    // XP reward for sharing
    setUserProfile(prev => ({ ...prev, xp: prev.xp + 10 }));
  };

  const handleLikePost = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen text-slate-100 bg-[#060F0C] font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background visual glowing spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-950/20 blur-[120px] pointer-events-none" />

      {/* --- Main Navigation Header --- */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-950/40 bg-[#060F0C]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab("landing")}>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              EcoTrack AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {isLoggedIn ? (
              <>
                <button onClick={() => setCurrentTab("dashboard")} className={`transition hover:text-emerald-400 ${currentTab === "dashboard" ? "text-emerald-400 font-semibold" : ""}`}>Dashboard</button>
                <button onClick={() => setCurrentTab("calculator")} className={`transition hover:text-emerald-400 ${currentTab === "calculator" ? "text-emerald-400 font-semibold" : ""}`}>Calculator</button>
                <button onClick={() => setCurrentTab("coach")} className={`transition hover:text-emerald-400 ${currentTab === "coach" ? "text-emerald-400 font-semibold" : ""}`}>AI Coach</button>
                <button onClick={() => setCurrentTab("analytics")} className={`transition hover:text-emerald-400 ${currentTab === "analytics" ? "text-emerald-400 font-semibold" : ""}`}>Analytics</button>
                <button onClick={() => setCurrentTab("community")} className={`transition hover:text-emerald-400 ${currentTab === "community" ? "text-emerald-400 font-semibold" : ""}`}>Community</button>
                <button onClick={() => setCurrentTab("profile")} className={`transition hover:text-emerald-400 ${currentTab === "profile" ? "text-emerald-400 font-semibold" : ""}`}>Profile</button>
                <button onClick={() => setCurrentTab("offset")} className={`transition hover:text-emerald-400 ${currentTab === "offset" ? "text-emerald-400 font-semibold" : ""}`}>Offsets</button>
                <button onClick={() => setCurrentTab("admin")} className={`transition hover:text-emerald-400 ${currentTab === "admin" ? "text-emerald-400 font-semibold" : ""}`}>Admin</button>
              </>
            ) : (
              <>
                <a href="#features" className="transition hover:text-emerald-400">Features</a>
                <a href="#stats" className="transition hover:text-emerald-400">Impact</a>
                <a href="#testimonials" className="transition hover:text-emerald-400">Testimonials</a>
              </>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                  <Flame size={14} className="text-amber-500 animate-pulse" />
                  <span>{userProfile.streak} Day Streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                    {userProfile.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold">{userProfile.name}</span>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode("login"); setCurrentTab("auth"); }} 
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-300 hover:text-emerald-400 transition">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#060F0C]/95 backdrop-blur-lg flex flex-col pt-24 px-8 gap-6 border-b border-emerald-950/40">
          {isLoggedIn ? (
            <>
              <button onClick={() => { setCurrentTab("dashboard"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Dashboard</button>
              <button onClick={() => { setCurrentTab("calculator"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Calculator</button>
              <button onClick={() => { setCurrentTab("coach"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">AI Coach</button>
              <button onClick={() => { setCurrentTab("analytics"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Analytics</button>
              <button onClick={() => { setCurrentTab("community"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Community</button>
              <button onClick={() => { setCurrentTab("profile"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Profile</button>
              <button onClick={() => { setCurrentTab("offset"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Offsets</button>
              <button onClick={() => { setCurrentTab("admin"); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 border-b border-white/5 hover:text-emerald-400">Admin</button>
              <button onClick={() => { setIsLoggedIn(false); setIsMobileMenuOpen(false); }} className="text-left text-lg py-2 text-rose-400">Sign Out</button>
            </>
          ) : (
            <>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg py-2 border-b border-white/5 hover:text-emerald-400">Features</a>
              <a href="#stats" onClick={() => setIsMobileMenuOpen(false)} className="text-lg py-2 border-b border-white/5 hover:text-emerald-400">Impact</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-lg py-2 border-b border-white/5 hover:text-emerald-400">Testimonials</a>
              <button onClick={() => { setAuthMode("login"); setCurrentTab("auth"); setIsMobileMenuOpen(false); }} className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold">Sign In</button>
            </>
          )}
        </div>
      )}


      {/* --- CONTENT ROUTER --- */}

      {/* --- 1. LANDING PAGE --- */}
      {currentTab === "landing" && (
        <main className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden pt-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
            <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-6 backdrop-blur">
                <Sparkles size={14} className="text-emerald-300" />
                <span>Next-Gen Climate Tech Innovation</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-none">
                Track, Reduce & Offset Your <br/>
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Carbon Footprint with AI
                </span>
              </h1>
              <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Empower your journey toward carbon neutrality. EcoTrack AI uses intelligent algorithms, gamification, and daily challenges to make saving the planet fun, measurable, and highly rewarding.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      setCurrentTab("dashboard");
                    } else {
                      setAuthMode("register");
                      setCurrentTab("auth");
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition text-base shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                >
                  Get Started Free <ChevronRight size={18} />
                </button>
                <a 
                  href="#features"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition text-base font-semibold flex items-center justify-center"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 border-t border-emerald-950/40 relative z-10 bg-slate-950/40">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Platform Capabilities</h2>
                <p className="text-slate-400 text-sm md:text-base">Everything you need to master your carbon ledger, powered by gamified mechanics and AI coaching.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-emerald-500/30 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Live Carbon Calculator</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Input your transit distance, electricity bills, foods, and purchases. Get instant CO2 values dynamically matching standard metrics.</p>
                </div>
                {/* Feature 2 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-emerald-500/30 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Carbon Coach</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Get recommendations based on your actual lifestyle parameters. Engage with our interactive chat advisor for sustainability tips.</p>
                </div>
                {/* Feature 3 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-emerald-500/30 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <Award size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Gamification & XP</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Earn experience points by checking in, completing daily eco-challenges, and unlocking beautiful badge milestones.</p>
                </div>
                {/* Feature 4 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-emerald-500/30 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Community Ecosystem</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Share tips, showcase unlocked badges, support posts with likes, and leave helpful comments for fellow carbon reducers.</p>
                </div>
                {/* Feature 5 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-emerald-500/30 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Offset Projects</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Calculate the exact number of trees needed to neutralize your emissions and review certified offset programs around the world.</p>
                </div>
                {/* Feature 6 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-emerald-500/30 transition duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                    <QrCode size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Challenge QR Scanning</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Validate challenges in real-life (like taking public transit or purchasing eco goods) through interactive mock QR verification codes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Statistics */}
          <section id="stats" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-16">Global Platform Impact Targets</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <span className="block text-3xl md:text-5xl font-black text-emerald-400 mb-2">12.5M</span>
                  <span className="text-slate-400 text-xs md:text-sm uppercase tracking-wider font-semibold">Tons CO2 Tracked</span>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <span className="block text-3xl md:text-5xl font-black text-emerald-400 mb-2">45%</span>
                  <span className="text-slate-400 text-xs md:text-sm uppercase tracking-wider font-semibold">Avg. User Reduction</span>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <span className="block text-3xl md:text-5xl font-black text-emerald-400 mb-2">1.2M</span>
                  <span className="text-slate-400 text-xs md:text-sm uppercase tracking-wider font-semibold">Trees Planted</span>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <span className="block text-3xl md:text-5xl font-black text-emerald-400 mb-2">350K+</span>
                  <span className="text-slate-400 text-xs md:text-sm uppercase tracking-wider font-semibold">Active Members</span>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-20 bg-slate-950/30 border-t border-emerald-950/40">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold">What Users Say</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <p className="text-slate-300 italic mb-6">"EcoTrack AI completely gamified sustainability for our family. The kids compete daily to earn badges, and our household carbon emissions fell by 30% in just two months."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">M</div>
                    <div>
                      <h4 className="font-bold text-sm">Marcus Vance</h4>
                      <p className="text-xs text-slate-500">Family Account User</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <p className="text-slate-300 italic mb-6">"As a university student on a budget, EcoTrack showed me that simple zero-cost actions like meatless days and power conservation make a real difference. Highly recommend the AI Coach!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">L</div>
                    <div>
                      <h4 className="font-bold text-sm">Lina Perez</h4>
                      <p className="text-xs text-slate-500">Student Activist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-24 bg-gradient-to-t from-emerald-950/20 to-transparent border-t border-emerald-950/20 text-center px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Carbon Neutral Revolution</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm md:text-base">Ready to track, gamify, and reduce your emissions? Create your account today and earn 100 XP instantly.</p>
            <button 
              onClick={() => { setAuthMode("register"); setCurrentTab("auth"); }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Sign Up Now
            </button>
          </section>
        </main>
      )}

      {/* --- 2. AUTHENTICATION PAGES (LOGIN/REGISTER) --- */}
      {currentTab === "auth" && (
        <main className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-xl relative">
            <h2 className="text-2xl font-bold text-center mb-2">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-center text-slate-400 text-sm mb-8">
              {authMode === "login" ? "Log in to track your carbon actions" : "Start your path to carbon neutrality"}
            </p>

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {authMode === "register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="px-4 py-3 rounded-xl bg-[#0B1E19]/60 border border-emerald-950/60 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl bg-[#0B1E19]/60 border border-emerald-950/60 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl bg-[#0B1E19]/60 border border-emerald-950/60 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 transition active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-sm"
              >
                {authMode === "login" ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              {authMode === "login" ? (
                <span>Don't have an account? <button onClick={() => setAuthMode("register")} className="text-emerald-400 font-semibold hover:underline">Register</button></span>
              ) : (
                <span>Already have an account? <button onClick={() => setAuthMode("login")} className="text-emerald-400 font-semibold hover:underline">Log In</button></span>
              )}
            </div>

            {/* Quick Demo Credentials Help */}
            <div className="mt-8 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-slate-400 text-center leading-relaxed">
              <span className="font-bold text-emerald-400">Hackathon Tester Tip:</span> You can type any email & password to instantly login and simulate dashboard features offline.
            </div>
          </div>
        </main>
      )}

      {/* --- 3. USER DASHBOARD PAGE --- */}
      {isLoggedIn && currentTab === "dashboard" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Eco Dashboard</h1>
              <p className="text-slate-400 text-sm">Welcome back, {userProfile.name}! Here is your current sustainability snapshot.</p>
            </div>
            <button 
              onClick={() => setCurrentTab("calculator")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 flex items-center gap-2 active:scale-95 transition text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Plus size={16} /> Log Daily Activity
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Metric 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-emerald-500/20">
                <Leaf size={48} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">My Carbon Footprint</span>
              <span className="text-3xl md:text-4xl font-extrabold text-white">
                {emissionsHistory.length > 0 ? emissionsHistory[0].totalCO2 : "250"}
                <span className="text-sm font-medium text-slate-400 ml-1.5">kg CO2/mo</span>
              </span>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400">
                <TrendingDown size={14} />
                <span>Saved 12% from last month</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-teal-500/20">
                <Zap size={48} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Sustainability Score</span>
              <span className="text-3xl md:text-4xl font-extrabold text-white">
                {calculateSustainabilityScore()}
                <span className="text-sm font-medium text-slate-400 ml-1.5">/100</span>
              </span>
              <div className="mt-4 text-xs text-slate-400">
                Ranked <span className="text-emerald-400 font-bold">Top 15%</span> of users
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-amber-500/20">
                <Flame size={48} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Streak Status</span>
              <span className="text-3xl md:text-4xl font-extrabold text-white">
                {userProfile.streak}
                <span className="text-sm font-medium text-slate-400 ml-1.5">Days</span>
              </span>
              <div className="mt-4 text-xs text-amber-400 font-semibold animate-pulse">
                Active Streak Multiplier (1.2x XP)
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-violet-500/20">
                <Award size={48} />
              </div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">User Rank & Level</span>
              <span className="text-3xl md:text-4xl font-extrabold text-white">
                Level {userProfile.level}
              </span>
              <div className="mt-4 text-xs text-slate-400">
                {userProfile.xp % 250}/250 XP to Next Level
              </div>
            </div>
          </div>

          {/* Main Dash Sections */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Col: Historical Summary */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Emissions trend mock chart */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                  <span>Carbon Emission Trends</span>
                  <span className="text-xs text-slate-400">Past 3 logs</span>
                </h3>
                {/* SVG Visual Chart */}
                <div className="h-64 flex items-end justify-around gap-4 pt-8 pb-4 relative">
                  {/* Grid lines */}
                  <div className="absolute left-0 right-0 bottom-4 border-b border-white/5" />
                  <div className="absolute left-0 right-0 bottom-1/3 border-b border-white/5" />
                  <div className="absolute left-0 right-0 bottom-2/3 border-b border-white/5" />
                  <div className="absolute left-0 right-0 top-8 border-b border-white/5" />

                  {emissionsHistory.slice(0, 3).reverse().map((entry, idx) => {
                    const heightPercent = Math.round((entry.totalCO2 / 500) * 100);
                    return (
                      <div key={entry.id} className="flex flex-col items-center gap-3 z-10 w-16">
                        <div className="text-xs font-bold text-slate-300">{entry.totalCO2} kg</div>
                        <div 
                          style={{ height: `${Math.max(20, Math.min(200, heightPercent * 1.5))}px` }} 
                          className="w-12 rounded-t-xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:brightness-110 transition duration-300 relative group"
                        >
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-emerald-500/20 px-2.5 py-1 rounded text-[10px] hidden group-hover:block whitespace-nowrap z-20">
                            Car Km: {entry.carKm}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-400">{entry.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goal Tracking Section */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm">
                <h3 className="text-lg font-bold mb-4">Carbon Goal Tracker</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-300">Monthly Target</span>
                  <span className="text-sm font-semibold text-slate-300">
                    <span className="text-emerald-400 font-bold">
                      {emissionsHistory.length > 0 ? emissionsHistory[0].totalCO2 : "250"}
                    </span> / {monthlyTarget} kg CO2
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                  <div 
                    style={{ width: `${Math.min(100, (((emissionsHistory.length > 0 ? emissionsHistory[0].totalCO2 : 250) / monthlyTarget) * 100))}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      (emissionsHistory.length > 0 ? emissionsHistory[0].totalCO2 : 250) > monthlyTarget 
                        ? "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        : "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    }`}
                  />
                </div>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>0 kg</span>
                  <span>Target Limit: {monthlyTarget} kg</span>
                </div>
              </div>
            </div>

            {/* Right Col: Challenges & Coach Summary */}
            <div className="flex flex-col gap-6">
              {/* Daily Eco Challenges Summary */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                  <span>Today's Challenges</span>
                  <button onClick={() => setCurrentTab("profile")} className="text-xs text-emerald-400 font-semibold hover:underline">View All</button>
                </h3>
                <div className="flex flex-col gap-3">
                  {challenges.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-400"}`}>
                          {item.completed ? <Check size={16} /> : <Leaf size={16} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">{item.title}</h4>
                          <span className="text-[10px] text-emerald-400 font-semibold">+{item.xpReward} XP</span>
                        </div>
                      </div>
                      {!item.completed ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleQRVerify(item.id)} 
                            className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-emerald-400 transition"
                            title="Verify via QR Code"
                          >
                            <QrCode size={14} />
                          </button>
                          <button 
                            onClick={() => handleCompleteChallenge(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:brightness-110 text-xs active:scale-95 transition"
                          >
                            Claim
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Done</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Carbon Coach CTA widget */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B1E19] to-slate-950 border border-emerald-950/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Coach Insights</h4>
                    <span className="text-[10px] text-slate-400">Active Advice</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "Based on your recent logs, your transportation sector produces 62% of your weekly footprint. Replacing car trips with public transport just two times a week will reduce your monthly emissions by 35kg CO2."
                </p>
                <button 
                  onClick={() => setCurrentTab("coach")}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold transition text-xs flex items-center justify-center gap-1.5"
                >
                  Chat with Coach <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- 4. CARBON CALCULATOR PAGE --- */}
      {isLoggedIn && currentTab === "calculator" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Carbon Footprint Calculator</h1>
            <p className="text-slate-400 text-sm">Calculate and record your monthly lifestyle carbon footprint values.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Input Form Panel */}
            <div className="md:col-span-2 flex flex-col gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              {/* Category: Transportation */}
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Car size={18} /> Transportation (Monthly)
                </h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>Personal Car Distance</span>
                      <span className="font-bold">{carKm} km</span>
                    </div>
                    <input 
                      type="range" min="0" max="2000" step="50"
                      value={carKm} onChange={(e) => setCarKm(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>Public Transport (Bus/Train)</span>
                      <span className="font-bold">{publicTransportKm} km</span>
                    </div>
                    <input 
                      type="range" min="0" max="1000" step="20"
                      value={publicTransportKm} onChange={(e) => setPublicTransportKm(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>Bicycle Distance</span>
                      <span className="font-bold">{bikeKm} km</span>
                    </div>
                    <input 
                      type="range" min="0" max="500" step="10"
                      value={bikeKm} onChange={(e) => setBikeKm(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>Flight Travel Hours</span>
                      <span className="font-bold">{flightsHours} hrs</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="1"
                      value={flightsHours} onChange={(e) => setFlightsHours(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category: Energy */}
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Zap size={18} /> Household Energy (Monthly)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-300">Electricity Usage (kWh)</label>
                    <input 
                      type="number" value={electricityKwh} onChange={(e) => setElectricityKwh(Number(e.target.value))}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-emerald-950/60 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-300">LPG/Gas cylinders/units</label>
                    <input 
                      type="number" value={gasLpg} onChange={(e) => setGasLpg(Number(e.target.value))}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-emerald-950/60 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category: Diet & Food */}
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Leaf size={18} /> Nutrition Diet Type
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["vegetarian", "mixed", "meat-heavy"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDiet(type)}
                      className={`py-2 rounded-xl text-xs font-bold border transition capitalize ${
                        diet === type 
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {type.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category: Shopping & Commodities */}
              <div className="flex flex-col gap-4 pb-4">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <ShoppingBag size={18} /> Purchases & Clothes (Monthly)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-300">General Purchases ($ value)</label>
                    <input 
                      type="number" value={shoppingPurchases} onChange={(e) => setShoppingPurchases(Number(e.target.value))}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-emerald-950/60 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-300">New Clothing Items</label>
                    <input 
                      type="number" value={clothingItems} onChange={(e) => setClothingItems(Number(e.target.value))}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-emerald-950/60 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Sidebar Panel */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#0B1E19] to-slate-950 border border-emerald-950/60 text-center flex flex-col items-center gap-4 relative overflow-hidden">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Calculated CO2</h3>
                <div className="my-2">
                  <span className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                    {calculateCO2()}
                  </span>
                  <span className="block text-xs font-semibold text-slate-400 mt-1">kg CO2 Equivalent / month</span>
                </div>

                <div className="w-full border-t border-emerald-950/40 my-2" />

                <div className="w-full flex flex-col gap-2.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Target Target Limit:</span>
                    <span className="font-bold text-slate-300">{monthlyTarget} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Status:</span>
                    <span className={`font-bold ${calculateCO2() > monthlyTarget ? "text-rose-400" : "text-emerald-400"}`}>
                      {calculateCO2() > monthlyTarget ? "Over Target Limit" : "Under Target Limit"}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleAddEmission}
                  className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:brightness-110 transition active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-sm"
                >
                  Save Entry to History
                </button>
              </div>

              {/* Offset Help Banner */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 leading-relaxed flex flex-col gap-3">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-400" /> Plant-A-Tree Offset Standard
                </h4>
                <p>An average mature tree absorbs approximately 22kg CO2 per year. Based on your current monthly score, you need to plant approximately <span className="font-bold text-emerald-400">{Math.ceil(calculateCO2() * 12 / 22)} trees</span> per year to achieve full carbon neutrality.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- 5. AI CARBON COACH PAGE --- */}
      {isLoggedIn && currentTab === "coach" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">AI Carbon Coach</h1>
              <p className="text-slate-400 text-sm">Ask your personal AI sustainability coach for lifestyle improvements.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
              <Sparkles size={14} className="text-emerald-300 animate-pulse" />
              <span>Smart Advisor Mode</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-[65vh]">
            {/* Quick Prompts Panel */}
            <div className="hidden lg:flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur h-full overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-300">Quick Coaching Inquiries</h3>
              <button 
                onClick={() => setInputMessage("How can I reduce my transportation emissions?")}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition text-left text-xs leading-relaxed text-slate-300"
              >
                "How can I reduce my transportation emissions?"
              </button>
              <button 
                onClick={() => setInputMessage("Explain what food has the highest carbon impact")}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition text-left text-xs leading-relaxed text-slate-300"
              >
                "Explain what food has the highest carbon impact"
              </button>
              <button 
                onClick={() => setInputMessage("Explain how buying thrift clothes saves carbon")}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition text-left text-xs leading-relaxed text-slate-300"
              >
                "Explain how buying thrift clothes saves carbon"
              </button>
            </div>

            {/* Chat Conversation Panel */}
            <div className="lg:col-span-2 flex flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur h-full overflow-hidden">
              {/* Message History */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-emerald-500 text-slate-950 font-semibold rounded-tr-none shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                        : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3.5 rounded-2xl text-xs text-slate-400 bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input Form */}
              <div className="p-4 border-t border-emerald-950/40 bg-slate-950/50 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your climate question here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0B1E19]/40 border border-emerald-950/60 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- 6. ANALYTICS DASHBOARD PAGE --- */}
      {isLoggedIn && currentTab === "analytics" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Interactive Analytics</h1>
            <p className="text-slate-400 text-sm">Review detailed charts, monthly breakdowns, and AI predictions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left side: Category breakdown & forecasts */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Category distribution visual SVG chart */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <h3 className="text-base font-bold mb-4">Carbon Category Distribution</h3>
                
                <div className="flex flex-col gap-4">
                  {/* Category 1 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>🚗 Transportation</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                  {/* Category 2 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>⚡ Household Energy</span>
                      <span className="font-semibold">30%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                  {/* Category 3 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>🥗 Diet (Vegetarian/Mixed)</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                  {/* Category 4 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                      <span>🛍️ Shopping & Apparel</span>
                      <span className="font-semibold">10%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-400 rounded-full" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly report card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex flex-col gap-4">
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <Mail size={18} className="text-emerald-400" /> Monthly AI Carbon Report
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your carbon output decreased by 14% this month, primarily due to an increase in bicycle commuting (+70km) and adopting two additional meat-free days per week.
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Emission Score: 85/100 (Efficient)
                  </div>
                  <button 
                    onClick={() => alert("Sustainability Report sent to your email!")}
                    className="text-xs text-slate-300 hover:text-emerald-400 font-bold hover:underline ml-auto flex items-center gap-1"
                  >
                    Email Report <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Predictor forecasting */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#0B1E19] to-slate-950 border border-emerald-950/60 relative overflow-hidden flex flex-col gap-4">
                <div className="absolute top-0 right-0 p-3 text-emerald-500/10">
                  <Activity size={72} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Carbon Predictive Forecast</h3>
                
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Predicted Next Month Emissions:</span>
                  <span className="text-3xl font-extrabold text-white">205 kg</span>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">Expected reduction of 4.6%</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on machine learning projections of your commuting activity patterns over the past 3 periods, your next-month footprint is expected to decrease.
                </p>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-400">Streak Boost:</span> Keeping your streak active will award you an additional +50 XP bonus next week.
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- 7. COMMUNITY SECTION --- */}
      {isLoggedIn && currentTab === "community" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Community Space</h1>
            <p className="text-slate-400 text-sm">Post climate action tips, show off badges, and support other members.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Create Post Panel */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur h-fit">
              <h3 className="text-base font-bold text-slate-200">Share Your Actions</h3>
              <form onSubmit={handleAddPost} className="flex flex-col gap-3">
                <textarea 
                  placeholder="Share a carbon tip, story, or badge unlock!"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  required
                  className="px-3.5 py-2.5 h-24 rounded-xl bg-white/5 border border-emerald-950/60 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400">Post Category</label>
                  <select 
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-emerald-950/60 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="tip">Sustainability Tip</option>
                    <option value="achievement">Achievement Story</option>
                    <option value="general">General Chat</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 transition active:scale-95 text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  Post to Feed (+10 XP)
                </button>
              </form>
            </div>

            {/* Live Feed List */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {posts.map((post) => (
                <div key={post.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{post.author}</h4>
                      <span className="text-[9px] text-slate-500">{post.role}</span>
                    </div>
                    <span className="ml-auto text-[9px] text-slate-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded capitalize">
                      {post.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-slate-400 border-t border-white/5 pt-3 mt-1">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold hover:text-emerald-400 transition ${
                        post.liked ? "text-emerald-400" : ""
                      }`}
                    >
                      <Heart size={14} className={post.liked ? "fill-emerald-500 text-emerald-500" : ""} />
                      <span>{post.likes} Likes</span>
                    </button>
                    <span className="text-[11px]">
                      {post.comments.length} Comments
                    </span>
                  </div>

                  {/* Quick comment display */}
                  {post.comments.length > 0 && (
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                      {post.comments.map((comm, cidx) => (
                        <div key={cidx} className="text-[11px] leading-relaxed">
                          <span className="font-bold text-emerald-400 mr-1.5">{comm.author}:</span>
                          <span className="text-slate-300">{comm.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* --- 8. PROFILE PAGE --- */}
      {isLoggedIn && currentTab === "profile" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">My Sustainability Profile</h1>
            <p className="text-slate-400 text-sm">Manage preferences, unlock achievement badges, and track your streaks.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Card: Basic Profile Info */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center flex flex-col items-center gap-4 h-fit">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{userProfile.name}</h3>
                <span className="text-xs text-slate-400">{userProfile.email}</span>
              </div>

              <div className="w-full border-t border-white/5 my-2" />

              <div className="w-full flex flex-col gap-2.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Eco XP Level:</span>
                  <span className="font-bold text-emerald-400">Level {userProfile.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Streak:</span>
                  <span className="font-bold text-emerald-400">{userProfile.streak} Days</span>
                </div>
              </div>
            </div>

            {/* Right Card: Unlocked Achievements */}
            <div className="md:col-span-2 flex flex-col gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <div>
                <h3 className="text-base font-bold mb-1.5">My Achievements & Badges</h3>
                <p className="text-xs text-slate-400">Earn XP and reduce emissions to unlock prestigious climate badges.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Badge 1 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Green Beginner</h4>
                    <p className="text-[10px] text-slate-500">Log your first carbon entry</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Carbon Reducer</h4>
                    <p className="text-[10px] text-slate-500">Under target emissions</p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Streak King</h4>
                    <p className="text-[10px] text-slate-500">Reach a 5-day check-in streak</p>
                  </div>
                </div>

                {/* Locked Badge */}
                <div className="p-4 rounded-xl bg-[#060F0C]/20 border border-white/5 opacity-50 flex items-center gap-3 relative">
                  <div className="absolute top-2 right-2 p-1 text-slate-500">
                    <Lock size={12} />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 text-slate-500">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400">Planet Protector</h4>
                    <p className="text-[10px] text-slate-500">Earn 1000 total Eco XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- 9. ADMIN PANEL PAGE --- */}
      {isLoggedIn && currentTab === "admin" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Admin Controls</h1>
            <p className="text-slate-400 text-sm">Adjust system emission parameters, customize challenges, and manage members.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Emission factor adjustments */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex flex-col gap-5">
              <h3 className="text-base font-bold text-emerald-400">Emission Metrics Factors</h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>Car Factor (kg CO2 per km)</span>
                    <span className="font-bold">0.18</span>
                  </div>
                  <input type="range" min="0.10" max="0.30" step="0.01" defaultValue="0.18" className="w-full accent-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>Flight Factor (kg CO2 per hour)</span>
                    <span className="font-bold">90.0</span>
                  </div>
                  <input type="range" min="50" max="150" step="5" defaultValue="90" className="w-full accent-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span>Electricity Factor (kg CO2 per kWh)</span>
                    <span className="font-bold">0.85</span>
                  </div>
                  <input type="range" min="0.50" max="1.20" step="0.05" defaultValue="0.85" className="w-full accent-emerald-500" />
                </div>
              </div>

              <button 
                onClick={() => alert("Settings Saved Successfully!")}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Save Settings Configuration
              </button>
            </div>

            {/* User list simulator */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex flex-col gap-4">
              <h3 className="text-base font-bold text-slate-200">Registered EcoTracker Users</h3>
              
              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Emma Watson</span>
                    <span className="text-[9px] text-slate-500">XP: 640 | Streak: 7</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">David K.</span>
                    <span className="text-[9px] text-slate-500">XP: 450 | Streak: 3</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">Offline</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Prof. Sarah Jenkins</span>
                    <span className="text-[9px] text-slate-500">XP: 910 | Streak: 12</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- 10. OFFSETS PAGE --- */}
      {isLoggedIn && currentTab === "offset" && (
        <main className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Carbon Offsetting</h1>
            <p className="text-slate-400 text-sm">Contribute to certified green projects to neutralize your carbon emissions footprint.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tree Offset Status */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#0B1E19] to-slate-950 border border-emerald-950/60 relative overflow-hidden flex flex-col gap-4 text-center items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Required Tree Offset</h3>
              <div className="my-2">
                <span className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  {Math.ceil(calculateCO2() * 12 / 22)}
                </span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">Mature Trees to plant / year</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                This estimate represents the number of trees required to fully absorb your calculated emission activity based on standard offsets.
              </p>
              <button 
                onClick={() => alert("Redirecting to certified Tree Planting partners...")}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Plant Trees Now
              </button>
            </div>

            {/* Suggested Offset Projects */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <h3 className="text-base font-bold">Certified Environmental Projects</h3>
              
              {/* Project 1 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Mesoamerican Reforestation Initiative</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">Restores native rainforests in Central America. Gold Standard Certified.</p>
                </div>
                <button 
                  onClick={() => alert("Supported Mesoamerican Reforestation!")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition text-xs whitespace-nowrap"
                >
                  Support Project
                </button>
              </div>

              {/* Project 2 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Solar Grid Energy (Rajasthan, India)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">Replaces coal grids with solar generation in local communities.</p>
                </div>
                <button 
                  onClick={() => alert("Supported Rajasthan Solar Grid Project!")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition text-xs whitespace-nowrap"
                >
                  Support Project
                </button>
              </div>
            </div>
          </div>
        </main>
      )}


      {/* --- MOCK QR SCANNER MODAL --- */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-emerald-500/20 text-center flex flex-col items-center gap-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">QR Challenge Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Point your device at the challenge QR code to claim your Eco XP reward.</p>
            
            {/* QR Camera simulator box */}
            <div className="w-48 h-48 rounded-xl border-2 border-dashed border-emerald-500 flex items-center justify-center bg-slate-950/60 relative overflow-hidden group">
              <QrCode size={96} className="text-emerald-500 animate-pulse" />
              <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400 animate-bounce" />
            </div>

            <div className="flex gap-3 w-full mt-2">
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition text-xs border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={confirmQRScan}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:brightness-110 transition active:scale-95 text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Scan Code
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- MAIN FOOTER --- */}
      <footer className="w-full border-t border-emerald-950/40 py-10 bg-slate-950/60 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4">
          <p className="mb-2">© 2026 EcoTrack AI Inc. All rights reserved.</p>
          <p>Created for Climate-Tech Hackathon Innovation Showcase.</p>
        </div>
      </footer>
    </div>
  );
}
