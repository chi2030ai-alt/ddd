"use client"

import { useState, useCallback } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Eye,
  MousePointer,
  Clock,
  Sparkles,
  Loader2,
  Download,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AIAction, AIActionResult } from "@/lib/types"

const analyticsData = {
  visitors: { value: 45678, change: 12.5, trend: "up" },
  pageViews: { value: 128945, change: 8.3, trend: "up" },
  bounceRate: { value: 42.3, change: -2.1, trend: "down" },
  avgSession: { value: 4.2, change: 0.5, trend: "up" },
  conversions: { value: 1523, change: 15.8, trend: "up" },
  revenue: { value: 458000, change: 22.4, trend: "up" },
}

const topPages = [
  { path: "/products/smart-watch", views: 12500, conversions: 342, rate: 2.7 },
  { path: "/products/headphones", views: 9800, conversions: 256, rate: 2.6 },
  { path: "/collections/new", views: 8200, conversions: 198, rate: 2.4 },
  { path: "/", views: 7500, conversions: 145, rate: 1.9 },
  { path: "/products/keyboard", views: 5600, conversions: 89, rate: 1.6 },
]

const trafficSources = [
  { name: "直接访问", value: 35, color: "#0A0A0A" },
  { name: "搜索引擎", value: 28, color: "#404040" },
  { name: "社交媒体", value: 22, color: "#737373" },
  { name: "推荐链接", value: 15, color: "#A3A3A3" },
]

// AI Actions for analytics
const analyticsAIActions: AIAction[] = [
  {
    id: "generate-insights",
    type: "analyze",
    label: "AI 智能洞察",
    description: "深度分析数据，发现隐藏的增长机会",
    icon: "Sparkles",
    context: "analytics",
    estimatedTime: "约 25 秒",
  },
  {
    id: "predict-trends",
    type: "analyze",
    label: "趋势预测",
    description: "基于历史数据预测未来 30 天趋势",
    icon: "TrendingUp",
    context: "analytics",
    estimatedTime: "约 20 秒",
  },
  {
    id: "optimize-funnel",
    type: "optimize",
    label: "漏斗优化",
    description: "分析转化漏斗，找出流失环节",
    icon: "BarChart3",
    context: "analytics",
    estimatedTime: "约 15 秒",
  },
  {
    id: "export-report",
    type: "generate",
    label: "生成报告",
    description: "AI 自动生成可视化分析报告",
    icon: "Download",
    context: "analytics",
    estimatedTime: "约 30 秒",
  },
]

interface AnalyticsViewProps {
  products?: Product[]
  orders?: Order[]
  customers?: Customer[]
}

export function AnalyticsView({ products = [], orders = [], customers = [] }: AnalyticsViewProps) {
  const [aiExecuting, setAiExecuting] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d")

  const handleAIAction = useCallback(async (action: AIAction): Promise<AIActionResult> => {
    setAiExecuting(action.id)
    setAiResult(null)
    
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
    
    const messages: Record<string, string> = {
      "generate-insights": "发现 3 个增长机会：移动端转化率提升空间 18%，周末流量未充分利用，新品页停留时间偏短",
      "predict-trends": "预计下月销售额增长 15-20%，建议提前备货热销商品",
      "optimize-funnel": "购物车到支付环节流失率 32%，建议简化支付流程",
      "export-report": "PDF 报告已生成，包含 12 页详细分析",
    }
    
    setAiResult(messages[action.id] || "操作完成")
    setAiExecuting(null)
    
    return {
      id: `result-${Date.now()}`,
      actionId: action.id,
      status: "success",
      message: messages[action.id] || "操作完成",
      startTime: new Date().toISOString(),
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">分析</h1>
              <p className="text-sm text-muted-foreground mt-1">深入了解您的业务表现</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted">
                {(["7d", "30d", "90d"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      period === p
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p === "7d" ? "7天" : p === "30d" ? "30天" : "90天"}
                  </button>
                ))}
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                导出
              </Button>
            </div>
          </div>

          {/* AI Actions Bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>AI 分析助手</span>
            </div>
            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              {analyticsAIActions.map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => handleAIAction(action)}
                  disabled={aiExecuting === action.id}
                >
                  {aiExecuting === action.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : action.icon === "Sparkles" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : action.icon === "TrendingUp" ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : action.icon === "BarChart3" ? (
                    <BarChart3 className="h-3.5 w-3.5" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
            {aiResult && (
              <div className="text-sm text-foreground animate-fade-in flex items-center gap-2 max-w-md truncate">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">{aiResult}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5 text-foreground" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  analyticsData.visitors.trend === "up" 
                    ? "bg-emerald-500/10 text-emerald-600" 
                    : "bg-red-500/10 text-red-600"
                }`}>
                  {analyticsData.visitors.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {analyticsData.visitors.change}%
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{analyticsData.visitors.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">访客数</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Eye className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {analyticsData.pageViews.change}%
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{(analyticsData.pageViews.value / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground mt-1">页面浏览量</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <MousePointer className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                  <TrendingDown className="h-3 w-3" />
                  {Math.abs(analyticsData.bounceRate.change)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{analyticsData.bounceRate.value}%</p>
              <p className="text-sm text-muted-foreground mt-1">跳出率</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {analyticsData.avgSession.change}min
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{analyticsData.avgSession.value}分钟</p>
              <p className="text-sm text-muted-foreground mt-1">平均访问时长</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {analyticsData.conversions.change}%
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{(orders.length).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">转化数 (实际订单)</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {analyticsData.revenue.change}%
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">¥{(orders.reduce((sum, o) => sum + o.total, 0)).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">销售额</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Pages */}
            <div className="lg:col-span-2 rounded-2xl bg-card border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">热门页面</h2>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  查看全部
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">页面</th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">浏览量</th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">转化</th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">转化率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topPages.map((page, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-foreground font-mono">{page.path}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground text-right">{page.views.toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-foreground text-right">{page.conversions}</td>
                      <td className="px-5 py-4 text-right">
                        <Badge variant="outline" className="bg-foreground/5 text-foreground border-foreground/10">
                          {page.rate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Traffic Sources */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">流量来源</h2>
              </div>
              <div className="p-5">
                {/* Simple pie chart representation */}
                <div className="aspect-square relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">100%</p>
                      <p className="text-xs text-muted-foreground">总流量</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {trafficSources.reduce((acc, source, index) => {
                      const previousTotal = trafficSources.slice(0, index).reduce((sum, s) => sum + s.value, 0)
                      const circumference = 2 * Math.PI * 35
                      const strokeDasharray = `${(source.value / 100) * circumference} ${circumference}`
                      const strokeDashoffset = -(previousTotal / 100) * circumference
                      return [...acc, (
                        <circle
                          key={source.name}
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke={source.color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      )]
                    }, [] as JSX.Element[])}
                  </svg>
                </div>
                <div className="space-y-3">
                  {trafficSources.map((source) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-sm text-foreground">{source.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
