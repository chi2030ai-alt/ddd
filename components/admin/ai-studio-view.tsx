"use client"

import { useState } from "react"
import {
  Sparkles,
  Wand2,
  Image,
  Type,
  Palette,
  Layout,
  FileText,
  Play,
  ChevronRight,
  Plus,
  Grid,
  Layers,
  Settings,
  Download,
  Share2,
  Loader2,
  Check,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 模板数据
const templates = [
  { id: "minimal", name: "极简", preview: "/templates/minimal.jpg", popular: true },
  { id: "luxury", name: "奢侈品", preview: "/templates/luxury.jpg" },
  { id: "editorial", name: "Editorial", preview: "/templates/editorial.jpg" },
  { id: "modern", name: "现代", preview: "/templates/modern.jpg", popular: true },
  { id: "tech", name: "科技", preview: "/templates/tech.jpg" },
  { id: "fashion", name: "时尚", preview: "/templates/fashion.jpg" },
]

// AI 工具
const aiTools = [
  { 
    id: "canvas", 
    name: "AI 画布", 
    description: "一句话生成页面，实时编辑", 
    icon: Layout,
    isNew: true 
  },
  { 
    id: "brand", 
    name: "品牌生成", 
    description: "Logo、品牌色、Typography", 
    icon: Palette 
  },
  { 
    id: "visual", 
    name: "视觉生成", 
    description: "Banner、商品图、Campaign图", 
    icon: Image 
  },
  { 
    id: "copy", 
    name: "文案生成", 
    description: "商品文案、营销文案、SEO", 
    icon: Type 
  },
]

// 生成历史
const generationHistory = [
  { id: "1", type: "页面", name: "夏季促销落地页", time: "10 分钟前", status: "completed" },
  { id: "2", type: "Banner", name: "新品发布海报", time: "30 分钟前", status: "completed" },
  { id: "3", type: "文案", name: "产品描述 x 20", time: "1 小时前", status: "completed" },
  { id: "4", type: "Logo", name: "品牌 Logo 设计", time: "2 小时前", status: "completed" },
]

export function AIStudioView() {
  const [activeTab, setActiveTab] = useState<"canvas" | "templates" | "brand" | "visual" | "copy">("canvas")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [generatedPage, setGeneratedPage] = useState({
    title: "自适应体验空间",
    subtitle: "为你量身定制的静谧音频科技体验，重新发现听觉美学",
    cta: "立刻抢购",
    sections: ["自研核心声学阻尼", "旗舰极音效处理器", "全贴合减包体佩戴"]
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGenerationComplete(false)
    
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate an exceptional landing page context for ecommerce store for: "${prompt}". Provide 3 items: Title, Subtitle, and 3 key benefits as bullet points. High-quality Chinese, concise and professional.`,
          type: "page"
        })
      })
      const data = await response.json()
      if (data.text) {
        const text = data.text
        const lines = text.split("\n").map(l => l.replace(/[#*\-]/g, "").trim()).filter(l => l.length > 0)
        
        const title = lines[0] || `${prompt} 旗舰空间`
        const subtitle = lines[1] || "精湛声学，美学与工学完美演绎"
        const finalFeatures = lines.slice(2, 5).length >= 3 ? lines.slice(2, 5) : ["全感官无缝降噪", "极致超薄音色腔", "自调谐微动降噪"]
        
        setGeneratedPage({
          title,
          subtitle,
          cta: "立刻预订",
          sections: finalFeatures
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
      setGenerationComplete(true)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">AI 工作室</h1>
                <p className="text-sm text-muted-foreground mt-0.5">一句话生成，AI 驱动创作</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                导出
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                分享
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex items-center gap-1">
          {aiTools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative
                  ${activeTab === tool.id 
                    ? "bg-background text-foreground border-t border-l border-r border-border -mb-px" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tool.name}
                {tool.isNew && (
                  <Badge className="text-[9px] px-1 py-0 h-4">New</Badge>
                )}
              </button>
            )
          })}
          <button
            onClick={() => setActiveTab("templates")}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors
              ${activeTab === "templates" 
                ? "bg-background text-foreground border-t border-l border-r border-border -mb-px" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }
            `}
          >
            <Grid className="h-4 w-4" />
            模板库
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {activeTab === "canvas" && (
            <>
              {/* Prompt Bar */}
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        placeholder="描述你想要的页面，例如：创建一个夏季促销落地页，突出新品发布..."
                        className="w-full h-12 px-4 pr-12 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <kbd className="px-2 py-1 text-[10px] font-mono rounded bg-muted text-muted-foreground">Enter</kbd>
                      </div>
                    </div>
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="h-12 px-6 gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : generationComplete ? (
                        <>
                          <Check className="h-4 w-4" />
                          完成
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4" />
                          生成
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">快速开始:</span>
                    {["产品详情页", "落地页", "促销页", "关于我们"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setPrompt(`创建一个${item}`)}
                        className="px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Canvas Preview */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                  {isGenerating ? (
                    <div className="aspect-[16/10] rounded-2xl border border-border bg-muted/30 flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-2xl bg-foreground flex items-center justify-center mb-4">
                        <Sparkles className="h-8 w-8 text-background animate-pulse" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">AI 正在生成...</p>
                      <p className="text-xs text-muted-foreground">分析需求、设计布局、生成内容</p>
                      <div className="mt-4 w-48 h-1 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-foreground animate-[progress-flow_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
                      </div>
                    </div>
                  ) : generationComplete ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-success">
                          <Check className="h-4 w-4" />
                          页面生成完成
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <RefreshCw className="h-3.5 w-3.5" />
                            重新生成
                          </Button>
                          <Button size="sm" className="gap-1.5">
                            <Play className="h-3.5 w-3.5" />
                            预览
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-[16/10] rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="h-full flex flex-col">
                          {/* Mock Generated Page */}
                          <div className="h-16 bg-foreground flex items-center justify-between px-8">
                            <div className="h-6 w-24 rounded bg-background/20" />
                            <div className="flex gap-6">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="h-3 w-12 rounded bg-background/20" />
                              ))}
                            </div>
                          </div>
                          <div className="flex-1 p-8 flex flex-col items-center justify-center bg-muted/30 text-center">
                            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 px-4 leading-tight">{generatedPage.title}</h3>
                            <p className="text-xs text-muted-foreground max-w-lg mb-6 leading-relaxed px-4">{generatedPage.subtitle}</p>
                            <div className="flex gap-3">
                              <Button size="sm" className="px-6 shrink-0">{generatedPage.cta}</Button>
                              <Button size="sm" variant="outline" className="px-6 shrink-0">了解更多</Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 p-6 bg-card border-t border-border">
                            {generatedPage.sections.map((sec, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-1">特色 {idx + 1}</span>
                                <p className="text-[11px] font-semibold text-foreground leading-normal line-clamp-2">{sec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/10] rounded-2xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <Layout className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">开始创建</p>
                      <p className="text-xs text-muted-foreground text-center max-w-xs">
                        在上方输入框描述你想要的页面，AI 将自动生成
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "templates" && (
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">模板库</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">选择一个模板快速开始</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      className="group relative aspect-[4/3] rounded-xl border border-border bg-muted/30 overflow-hidden hover:border-foreground/30 transition-colors"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Grid className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{template.name}</span>
                          {template.popular && (
                            <Badge variant="secondary" className="text-[10px]">热门</Badge>
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium">
                          使用模板
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === "brand" || activeTab === "visual" || activeTab === "copy") && (
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    {activeTab === "brand" && <Palette className="h-8 w-8 text-muted-foreground" />}
                    {activeTab === "visual" && <Image className="h-8 w-8 text-muted-foreground" />}
                    {activeTab === "copy" && <Type className="h-8 w-8 text-muted-foreground" />}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {activeTab === "brand" && "品牌生成"}
                    {activeTab === "visual" && "视觉生成"}
                    {activeTab === "copy" && "文案生成"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {activeTab === "brand" && "生成 Logo、品牌色、字体等品牌元素"}
                    {activeTab === "visual" && "生成 Banner、商品图、活动图等视觉素材"}
                    {activeTab === "copy" && "生成产品描述、营销文案、SEO 内容"}
                  </p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    开始创建
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - History & Layers */}
        <div className="w-[280px] border-l border-border bg-card flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">生成历史</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="divide-y divide-border">
              {generationHistory.map((item) => (
                <button
                  key={item.id}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {item.type === "页面" && <Layout className="h-4 w-4 text-muted-foreground" />}
                    {item.type === "Banner" && <Image className="h-4 w-4 text-muted-foreground" />}
                    {item.type === "文案" && <Type className="h-4 w-4 text-muted-foreground" />}
                    {item.type === "Logo" && <Palette className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.type} · {item.time}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
