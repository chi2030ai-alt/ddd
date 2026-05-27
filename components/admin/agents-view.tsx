"use client"

import { useState, useCallback } from "react"
import {
  Bot,
  Plus,
  Play,
  Pause,
  Settings,
  Trash2,
  ChevronRight,
  Activity,
  Cpu,
  Clock,
  Zap,
  RefreshCw,
  MoreHorizontal,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// 智能体数据
const agents = [
  {
    id: "agent-1",
    name: "订单处理助手",
    description: "自动处理订单、发货通知、退款审批",
    status: "active" as const,
    model: "GPT-4o",
    tasksCompleted: 1247,
    tasksToday: 56,
    avgTime: "2.3s",
    successRate: 99.2,
    lastActive: "2分钟前",
    tools: ["订单查询", "发货通知", "退款处理"],
  },
  {
    id: "agent-2",
    name: "客服机器人",
    description: "24/7 自动回复客户咨询、处理售后问题",
    status: "active" as const,
    model: "GPT-4o",
    tasksCompleted: 3892,
    tasksToday: 143,
    avgTime: "1.8s",
    successRate: 97.8,
    lastActive: "刚刚",
    tools: ["问答生成", "订单查询", "退换货"],
  },
  {
    id: "agent-3",
    name: "库存监控",
    description: "实时监控库存变化，自动补货提醒",
    status: "paused" as const,
    model: "GPT-4o-mini",
    tasksCompleted: 567,
    tasksToday: 0,
    avgTime: "0.8s",
    successRate: 100,
    lastActive: "3小时前",
    tools: ["库存查询", "补货通知", "预测分析"],
  },
  {
    id: "agent-4",
    name: "营销文案生成",
    description: "自动生成产品描述、营销文案、社交媒体内容",
    status: "active" as const,
    model: "GPT-4o",
    tasksCompleted: 892,
    tasksToday: 28,
    avgTime: "4.5s",
    successRate: 95.6,
    lastActive: "15分钟前",
    tools: ["文案生成", "SEO优化", "翻译"],
  },
]

// 最近任务
const recentTasks = [
  { id: "1", agent: "订单处理助手", action: "处理发货", target: "ORD-9921", status: "success", time: "2分钟前" },
  { id: "2", agent: "客服机器人", action: "回复咨询", target: "客户 #1234", status: "success", time: "3分钟前" },
  { id: "3", agent: "营销文案生成", action: "生成文案", target: "新品发布", status: "executing", time: "5分钟前" },
  { id: "4", agent: "订单处理助手", action: "退款审批", target: "ORD-9918", status: "success", time: "8分钟前" },
  { id: "5", agent: "客服机器人", action: "回复咨询", target: "客户 #1235", status: "error", time: "10分钟前" },
]

export function AgentsView() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const getStatusBadge = (status: "active" | "paused" | "error") => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            运行中
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground gap-1">
            <Pause className="h-3 w-3" />
            已暂停
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
            <AlertCircle className="h-3 w-3" />
            异常
          </Badge>
        )
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "executing":
        return <Loader2 className="h-4 w-4 text-foreground animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
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
                <Bot className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">智能体</h1>
                <p className="text-sm text-muted-foreground mt-0.5">管理和监控 AI 自动化助手</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                3 个运行中
              </Badge>
              <Button className="gap-1.5" onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4" />
                创建智能体
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Agents List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "活跃智能体", value: "3", icon: Bot },
                { label: "今日任务", value: "227", icon: Zap },
                { label: "平均响应", value: "2.1s", icon: Clock },
                { label: "成功率", value: "98.4%", icon: Activity },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground font-mono-numbers">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索智能体..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                筛选
              </Button>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`
                    p-5 rounded-xl border bg-card cursor-pointer transition-all duration-150
                    ${selectedAgent === agent.id 
                      ? "border-foreground ring-1 ring-foreground" 
                      : "border-border hover:border-foreground/30"
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        h-11 w-11 rounded-xl flex items-center justify-center
                        ${agent.status === "active" ? "bg-foreground" : "bg-muted"}
                      `}>
                        <Bot className={`h-5 w-5 ${agent.status === "active" ? "text-background" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">{agent.model}</p>
                      </div>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{agent.description}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground font-mono-numbers">{agent.tasksToday}</p>
                      <p className="text-[10px] text-muted-foreground">今日任务</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground font-mono-numbers">{agent.avgTime}</p>
                      <p className="text-[10px] text-muted-foreground">平均耗时</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground font-mono-numbers">{agent.successRate}%</p>
                      <p className="text-[10px] text-muted-foreground">成功率</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {agent.tools.slice(0, 2).map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-[10px]">{tool}</Badge>
                      ))}
                      {agent.tools.length > 2 && (
                        <Badge variant="secondary" className="text-[10px]">+{agent.tools.length - 2}</Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{agent.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Task Log */}
        <div className="w-[320px] border-l border-border bg-card flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">最近任务</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <RefreshCw className="h-3 w-3" />
              刷新
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="divide-y divide-border">
              {recentTasks.map((task) => (
                <div key={task.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3">
                    {getTaskStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{task.action}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {task.agent} · {task.target}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{task.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Details (when selected) */}
          {selectedAgent && (
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">智能体操作</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  配置
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  日志
                </Button>
                <Button size="sm" className="gap-1.5 col-span-2">
                  <Play className="h-3.5 w-3.5" />
                  手动触发
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
