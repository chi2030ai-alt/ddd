'use client';

import { useState, useCallback } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Filter,
  Download,
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Sparkles,
  Loader2,
  Zap,
  MessageSquare,
  RefreshCw,
  Send
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Order, AIAction, AIActionResult } from '@/lib/types';

interface OrdersViewProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

// AI Actions for orders
const orderAIActions: AIAction[] = [
  {
    id: "auto-process",
    type: "automate",
    label: "自动处理订单",
    description: "AI 自动处理待处理订单",
    icon: "Zap",
    context: "orders",
    estimatedTime: "约 20 秒",
  },
  {
    id: "smart-notify",
    type: "notify",
    label: "智能通知客户",
    description: "自动发送订单状态更新通知",
    icon: "Send",
    context: "orders",
    estimatedTime: "约 5 秒",
  },
  {
    id: "fraud-detect",
    type: "analyze",
    label: "风险检测",
    description: "AI 检测异常订单和欺诈风险",
    icon: "AlertCircle",
    context: "orders",
    estimatedTime: "约 15 秒",
  },
  {
    id: "auto-reply",
    type: "automate",
    label: "自动回复咨询",
    description: "AI 自动回复客户订单咨询",
    icon: "MessageSquare",
    context: "orders",
    estimatedTime: "约 8 秒",
  },
]

export function OrdersView({ orders, setOrders }: OrdersViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [aiExecuting, setAiExecuting] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleAIAction = useCallback(async (action: AIAction): Promise<AIActionResult> => {
    setAiExecuting(action.id);
    setAiResult(null);
    
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const messages: Record<string, string> = {
      "auto-process": "已自动处理 5 笔待处理订单，3 笔已发货",
      "smart-notify": "已向 8 位客户发送订单状态更新通知",
      "fraud-detect": "未检测到异常订单，所有交易正常",
      "auto-reply": "已自动回复 12 条客户咨询",
    };
    
    setAiResult(messages[action.id] || "操作完成");
    setAiExecuting(null);
    
    // Update orders if auto-process
    if (action.id === "auto-process") {
      setOrders(orders.map(o => 
        o.status === "pending" ? { ...o, status: "processing" as const } : o
      ));
    }
    
    return {
      id: `result-${Date.now()}`,
      actionId: action.id,
      status: "success",
      message: messages[action.id] || "操作完成",
      startTime: new Date().toISOString(),
    };
  }, [orders, setOrders]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer.toLowerCase().includes(search.toLowerCase()) ||
                          o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: '待处理', color: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: Clock },
      processing: { label: '处理中', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: Package },
      shipped: { label: '已发货', color: 'bg-foreground/10 text-foreground border-foreground/20', icon: Truck },
      delivered: { label: '已送达', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle },
      cancelled: { label: '已取消', color: 'bg-red-500/10 text-red-600 border-red-200', icon: XCircle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`gap-1.5 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">订单</h1>
              <p className="text-sm text-muted-foreground mt-1">管理和跟踪所有订单</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              导出订单
            </Button>
          </div>

          {/* AI Actions Bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>AI 操作</span>
            </div>
            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              {orderAIActions.map((action) => (
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
                  ) : action.icon === "Zap" ? (
                    <Zap className="h-3.5 w-3.5" />
                  ) : action.icon === "Send" ? (
                    <Send className="h-3.5 w-3.5" />
                  ) : action.icon === "AlertCircle" ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5" />
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
            {aiResult && (
              <div className="text-sm text-foreground animate-fade-in flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                {aiResult}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'all', label: '全部', count: statusCounts.all },
              { key: 'pending', label: '待处理', count: statusCounts.pending },
              { key: 'processing', label: '处理中', count: statusCounts.processing },
              { key: 'shipped', label: '已发货', count: statusCounts.shipped },
              { key: 'delivered', label: '已送达', count: statusCounts.delivered },
              { key: 'cancelled', label: '已取消', count: statusCounts.cancelled },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  statusFilter === tab.key
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card border-border hover:border-foreground/20 card-hover'
                }`}
              >
                <p className={`text-2xl font-bold ${statusFilter === tab.key ? 'text-background' : 'text-foreground'}`}>
                  {tab.count}
                </p>
                <p className={`text-xs ${statusFilter === tab.key ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {tab.label}
                </p>
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索订单号、客户姓名或邮箱..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              筛选
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">订单</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">客户</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">日期</th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">商品数</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">金额</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">状态</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">{order.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{order.date}</td>
                    <td className="px-5 py-4 text-sm text-foreground text-center">{order.items}</td>
                    <td className="px-5 py-4 text-sm text-foreground text-right font-semibold">
                      ¥{order.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="px-4 py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">没有找到订单</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
