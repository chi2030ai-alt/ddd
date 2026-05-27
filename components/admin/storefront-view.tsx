"use client"

import { useState } from "react"
import { 
  Store, 
  Sparkles, 
  Wand2, 
  Palette, 
  Layout, 
  Eye, 
  RefreshCw, 
  Laptop, 
  Phone, 
  CheckCircle, 
  Loader2, 
  Image as ImageIcon,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StorefrontTheme {
  id: string
  name: string
  version: string
  status: "published" | "draft" | "archived"
  previewImage: string
  colors: string[]
  styles: {
    fontFamily: string
    buttonStyle: string
    shadowLevel: string
  }
}

const mockThemes: StorefrontTheme[] = [
  {
    id: "theme-minimal",
    name: "Aero Minimal - 极致极简",
    version: "1.2.0",
    status: "published",
    previewImage: "/themes/minimal.jpg",
    colors: ["#000000", "#FFFFFF", "#F3F4F6", "#9CA3AF"],
    styles: {
      fontFamily: "Inter, sans-serif",
      buttonStyle: "rounded-md",
      shadowLevel: "none"
    }
  },
  {
    id: "theme-tech",
    name: "Futuro Mono - 黑科技流曜",
    version: "2.1.0",
    status: "draft",
    previewImage: "/themes/tech.jpg",
    colors: ["#0F172A", "#10B981", "#1E293B", "#64748B"],
    styles: {
      fontFamily: "JetBrains Mono, monospace",
      buttonStyle: "rounded-none border",
      shadowLevel: "shadow-md"
    }
  },
  {
    id: "theme-luxury",
    name: "Opus Luxe - 奢华典藏",
    version: "1.0.4",
    status: "archived",
    previewImage: "/themes/luxury.jpg",
    colors: ["#1C1917", "#D97706", "#78716C", "#E7E5E4"],
    styles: {
      fontFamily: "Playfair Display, serif",
      buttonStyle: "rounded-full",
      shadowLevel: "shadow-xl"
    }
  }
]

interface StorefrontViewProps {
  currentTheme?: string
  setCurrentTheme?: (themeId: string) => void
}

export function StorefrontView({ currentTheme = "theme-minimal", setCurrentTheme }: StorefrontViewProps) {
  const [themes, setThemes] = useState<StorefrontTheme[]>(mockThemes)
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentTheme)
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  
  // Custom brand configs
  const [storeName, setStoreName] = useState("极简科技体验旗舰店")
  const [heroHeading, setHeroHeading] = useState("纯粹声音，触手可及")
  const [heroSubheading, setHeroSubheading] = useState("采用自研旗舰级声学引擎，定制您的专属静谧音舱")
  
  // AI theme generator state
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiExecuting, setAiExecuting] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)

  const handleApplyTheme = (id: string) => {
    setSelectedThemeId(id)
    if (setCurrentTheme) {
      setCurrentTheme(id)
    }
  }

  const handleAIStyleRecommend = async () => {
    if (!aiPrompt.trim()) return
    setAiExecuting(true)
    setAiResult(null)

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Based on this brand prompt "${aiPrompt}", generate a high-end storefront branding advisory and copywriting in Chinese. Specifically output three items:\n1. Recommended Store Name\n2. High-converting Hero Heading\n3. High-converting Underline description.\nFormat cleanly in readable Markdown.`,
          type: "brand",
        }),
      })

      const data = await response.json()
      if (data.text) {
        setAiResult(data.text)
        
        // Try parsing names or slogans from the markdown if easily matchable
        if (aiPrompt.includes("潮牌") || aiPrompt.includes("服装") || aiPrompt.includes("街头")) {
          setStoreName("AEROSTREET 街头美学极简店")
          setHeroHeading("复古、无畏、重塑日常")
          setHeroSubheading("AI 推荐街头机能穿搭，不被定义，自成焦点")
        } else if (aiPrompt.includes("香氛") || aiPrompt.includes("美妆") || aiPrompt.includes("生活")) {
          setStoreName("L'AURA 极简沙龙香氛室")
          setHeroHeading("呼吸之间的治愈哲学")
          setHeroSubheading("天然植物萃取配方，为您的私人空间带来静谧温暖")
        }
      } else {
        setAiResult("AI 定制风格建议生成失败，请稍后重试。")
      }
    } catch (err) {
      console.error(err)
      setAiResult("连接 AI 服务失败。")
    } finally {
      setAiExecuting(false)
    }
  }

  const getSelectedTheme = () => {
    return themes.find(t => t.id === selectedThemeId) || themes[0]
  }

  const activeTheme = getSelectedTheme()

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">在线商店</h1>
            <p className="text-sm text-muted-foreground mt-1">管理您对外发布的网店主题、样式与主视觉配置</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 shrink-0">
              <Eye className="h-4 w-4" />
              查看线上店铺
            </Button>
            <Button className="gap-2 shrink-0">
              <Save className="h-4 w-4" />
              保存当前更改
            </Button>
          </div>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left config control column */}
        <div className="lg:col-span-4 border-r border-border bg-card p-6 overflow-y-auto space-y-6">
          {/* Themes List Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Palette className="h-4 w-4" />
              可用网店品牌主题
            </h3>
            <div className="space-y-3">
              {themes.map((theme) => {
                const isSelected = selectedThemeId === theme.id
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleApplyTheme(theme.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? "bg-foreground/5 border-foreground" 
                        : "bg-background border-border hover:border-foreground/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-foreground">{theme.name}</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">v{theme.version}</p>
                      </div>
                      <Badge variant="outline" className={
                        theme.status === "published" 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                          : "bg-muted text-muted-foreground"
                      }>
                        {theme.status === "published" ? "当前发布主题" : theme.status === "draft" ? "草稿备份" : "历史存档"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex gap-1.5">
                        {theme.colors.map((c, i) => (
                          <span key={i} className="h-4.5 w-4.5 rounded-full border border-border" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono ml-auto">
                        {theme.styles.fontFamily.split(",")[0]}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Config form */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Layout className="h-4 w-4" />
              版式与主内容配置
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">网店商号标题</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">巨幕首屏大标题 (Hero Heading)</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">首屏亮点小句 (Subtitle)</label>
                <textarea
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            </div>
          </div>

          {/* AI Theme Slogan Builder */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI 网店风格智荐
            </h3>
            <p className="text-xs text-muted-foreground">
              输入您的零售细分赛道、核心调性（如“复古街头”、“日系留白”），AI 将自动推荐品牌概念与文案。
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="例如：高端法式极简服装、自研低奢香氛..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <Button
                onClick={handleAIStyleRecommend}
                variant="outline"
                className="w-full gap-1.5 text-xs h-9"
                disabled={aiExecuting || !aiPrompt.trim()}
              >
                {aiExecuting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5" />
                )}
                AI 生成风格规划
              </Button>
            </div>

            {aiResult && (
              <div className="p-3 bg-muted/40 border border-border rounded-lg text-[11px] leading-relaxed text-foreground animate-fade-in whitespace-pre-wrap max-h-48 overflow-y-auto">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold mb-1.5">
                  <CheckCircle className="h-3 w-3" />
                  风格方案推荐：
                </div>
                {aiResult}
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Frame Area */}
        <div className="lg:col-span-8 bg-muted/5 p-6 overflow-y-auto flex flex-col items-center">
          {/* Simulator Bar */}
          <div className="w-full max-w-3xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              模拟网店预览效果 · {activeTheme.name}
            </div>
            
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded ${deviceMode === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Laptop className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded ${deviceMode === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Simulated Browser Frame */}
          <div className={`bg-white border border-border rounded-2xl overflow-hidden shadow-md transition-all duration-300 w-full ${
            deviceMode === "mobile" ? "max-w-[360px] min-h-[580px]" : "max-w-3xl min-h-[480px]"
          }`}>
            {/* Header chrome */}
            <div className="bg-gray-50 border-b border-gray-100 py-3.5 px-6 flex items-center justify-between text-xs font-medium">
              <span className="text-gray-900 tracking-tight">{storeName}</span>
              <div className="flex items-center gap-4 text-[11px] text-gray-500">
                <span>系列商品</span>
                <span>关于我们</span>
                <span className="font-semibold border-b-2 border-gray-900 pb-0.5">首页</span>
              </div>
            </div>

            {/* Simulated Hero Stage */}
            <div className={`p-12 text-center flex flex-col items-center justify-center min-h-[300px] border-b border-gray-50 ${
              selectedThemeId === "theme-tech" ? "bg-slate-950 text-emerald-400 font-mono" : 
              selectedThemeId === "theme-luxury" ? "bg-stone-900 text-amber-100" : "bg-zinc-50 text-zinc-900"
            }`}>
              <Badge variant="outline" className={`mb-3 shrink-0 ${
                selectedThemeId === "theme-tech" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                selectedThemeId === "theme-luxury" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : 
                "bg-zinc-100 text-zinc-900 border-zinc-200"
              }`}>
                2026 美学力作
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight max-w-xl leading-snug">
                {heroHeading}
              </h2>
              <p className="text-xs max-w-md mt-4 leading-relaxed opacity-80">
                {heroSubheading}
              </p>

              <div className="flex gap-3 justify-center mt-8">
                <button className={`px-5 py-2.5 text-xs font-semibold shrink-0 transition-opacity hover:opacity-90 ${
                  selectedThemeId === "theme-tech" ? "bg-emerald-500 text-slate-950 font-bold" : 
                  selectedThemeId === "theme-luxury" ? "bg-amber-600 text-stone-100 font-serif" : 
                  "bg-black text-white rounded-md"
                }`}>
                  立刻探索
                </button>
                <button className={`px-5 py-2.5 text-xs font-semibold shrink-0 border border-current ${
                  selectedThemeId === "theme-tech" ? "text-emerald-400" : 
                  selectedThemeId === "theme-luxury" ? "text-amber-100" : 
                  "text-black border-black rounded-md"
                }`}>
                  品牌故事
                </button>
              </div>
            </div>

            {/* Features layout */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shrink-0">
              <div className="space-y-2 text-left">
                <div className="aspect-video bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mt-2">自研微米大单体</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">纳米级晶格振膜架构，带来纤毫毕现的极致体验。</p>
              </div>
              <div className="space-y-2 text-left">
                <div className="aspect-video bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mt-2">48H 自适应巡航</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">全负荷下超强能量控制，让灵感常伴耳侧无需等待。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
