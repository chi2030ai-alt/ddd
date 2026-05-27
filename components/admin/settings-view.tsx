"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  Store,
  Globe,
  CreditCard,
  Users,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  Check,
  ExternalLink,
  Cloud,
  Mail,
  FileJson,
  Upload,
  StickyNote,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  googleSignIn,
  googleSignOut,
  getCachedToken,
  uploadToDrive,
  listDriveFiles,
  sendGmail,
  saveKeepNotesToDrive,
  loadKeepNotesFromDrive,
  type KeepNote,
  auth
} from "@/lib/google-workspace"
import { onAuthStateChanged, type User } from "firebase/auth"

const settingsSections = [
  { 
    id: "store", 
    name: "店铺设置", 
    description: "基本信息、营业时间、联系方式",
    icon: Store 
  },
  { 
    id: "domain", 
    name: "域名", 
    description: "自定义域名、SSL 证书",
    icon: Globe 
  },
  { 
    id: "payment", 
    name: "支付", 
    description: "支付方式、结算账户",
    icon: CreditCard 
  },
  { 
    id: "team", 
    name: "团队", 
    description: "成员管理、权限设置",
    icon: Users 
  },
  {
    id: "workspace",
    name: "Google 协同",
    description: "绑定 Google Drive、Gmail 及 Keep 协作服务",
    icon: Cloud
  },
  { 
    id: "security", 
    name: "安全", 
    description: "两步验证、登录记录",
    icon: Shield 
  },
  { 
    id: "notifications", 
    name: "通知", 
    description: "邮件、短信、推送通知",
    icon: Bell 
  },
  { 
    id: "theme", 
    name: "主题", 
    description: "店铺外观、颜色、字体",
    icon: Palette 
  },
]

interface SettingsViewProps {
  products?: any[]
  orders?: any[]
}

export function SettingsView({ products = [], orders = [] }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState("store")
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [driveFiles, setDriveFiles] = useState<any[]>([])
  
  // Google Keep Integration State initialized with nice presets
  const [keepNotes, setKeepNotes] = useState<KeepNote[]>([
    { id: "note-1", title: "📝 今日设计灵感", content: "考虑采用更纯粹的瑞士风格极简排版，在主页上多用些深空拉丝黑作为视觉亮点点缀。", color: "bg-amber-100/80 dark:bg-amber-950/20", lastUpdated: "2026-05-27" },
    { id: "note-2", title: "🚚 供应链备忘", content: "陈芳琳的 AeroCore 专属定制传感器需要尽快通过 Gmail 提醒合作方并导出 Drive 对账单。", color: "bg-emerald-100/80 dark:bg-emerald-950/20", lastUpdated: "2026-05-27" }
  ])
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteColor, setNewNoteColor] = useState("bg-card")
  
  // Gmail Composer State
  const [gmailTo, setGmailTo] = useState("")
  const [gmailSubject, setGmailSubject] = useState("AeroTech 店铺业务运营日报")
  const [gmailBody, setGmailBody] = useState("您好，这是由 AeroTech AI 店铺助手自动整合导出的业务数据，具体备份文件和商品目录已同步存入 Google Drive。")
  
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  // Firebase auth state hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const cached = getCachedToken()
        if (cached) {
          setToken(cached)
          fetchDriveAndKeep(cached)
        }
      } else {
        setToken(null)
        setDriveFiles([])
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchDriveAndKeep = async (accessToken: string) => {
    try {
      setIsLoading(true)
      const filesRes = await listDriveFiles(accessToken)
      if (filesRes && filesRes.files) {
        setDriveFiles(filesRes.files)
      }
      
      const notes = await loadKeepNotesFromDrive(accessToken)
      if (notes && notes.length > 0) {
        setKeepNotes(notes)
      }
    } catch (err: any) {
      console.error("Failed to fetch Workspace components:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      setStatusMessage(null)
      const res = await googleSignIn()
      setToken(res.accessToken)
      setUser(res.user)
      setStatusMessage({ type: "success", msg: "Google Workspace 绑定成功！已同步授权。" })
      await fetchDriveAndKeep(res.accessToken)
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: `绑定失败: ${err.message || err}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      setStatusMessage(null)
      await googleSignOut()
      setUser(null)
      setToken(null)
      setDriveFiles([])
      setStatusMessage({ type: "success", msg: "已安全断开与 Google 账户的协作授权。" })
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: `断开失败: ${err.message || err}` })
    } finally {
      setIsLoading(false)
    }
  }

  // Drive actions
  const handleExportProducts = async () => {
    if (!token) return
    const confirmed = window.confirm("确定将当前商品目录导出并备份到 Google Drive 吗？")
    if (!confirmed) return

    try {
      setIsLoading(true)
      setStatusMessage(null)
      const payload = JSON.stringify(products, null, 2)
      await uploadToDrive(token, `aerotech_products_backup_${Date.now()}.json`, payload, "application/json")
      setStatusMessage({ type: "success", msg: "商品目录（JSON备份）已成功上传存入您的 Google Drive 云端硬盘！" })
      await fetchDriveAndKeep(token)
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: `商品存储失败: ${err.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportOrders = async () => {
    if (!token) return
    const confirmed = window.confirm("确定将当前的订单流水账单写入 Google Drive 吗？")
    if (!confirmed) return

    try {
      setIsLoading(true)
      setStatusMessage(null)
      const payload = JSON.stringify(orders, null, 2)
      await uploadToDrive(token, `aerotech_orders_audit_${Date.now()}.json`, payload, "application/json")
      setStatusMessage({ type: "success", msg: "全量订单审计报表已成功上传存入您的 Google Drive 云端硬盘！" })
      await fetchDriveAndKeep(token)
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: `报表存储失败: ${err.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  // Gmail action
  const handleSendEmail = async () => {
    if (!token) return
    if (!gmailTo) {
      setStatusMessage({ type: "error", msg: "请输入收件人邮箱地址" })
      return
    }
    const confirmed = window.confirm(`确认使用您的 Google 邮箱账户向 ${gmailTo} 发送这封店铺日志邮件吗？`)
    if (!confirmed) return

    try {
      setIsLoading(true)
      setStatusMessage(null)
      await sendGmail(token, gmailTo, gmailSubject, gmailBody)
      setStatusMessage({ type: "success", msg: `邮件已成功自 Gmail 发送至 ${gmailTo}！` })
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: `邮件发送失败: 无足够权限或未在云端开启，错误: ${err.message || err}` })
    } finally {
      setIsLoading(false)
    }
  }

  // Keep actions
  const handleAddKeepNote = () => {
    if (!newNoteTitle && !newNoteContent) return
    const newNote: KeepNote = {
      id: `keep-${Date.now()}`,
      title: newNoteTitle || "新便签",
      content: newNoteContent,
      color: newNoteColor,
      lastUpdated: new Date().toISOString().split("T")[0]
    }
    setKeepNotes([newNote, ...keepNotes])
    setNewNoteTitle("")
    setNewNoteContent("")
    setNewNoteColor("bg-card")
    setStatusMessage({ type: "success", msg: "便签已在本地创建，点击下面的【云同步】将其保存至云端。" })
  }

  const handleDeleteKeepNote = (id: string) => {
    setKeepNotes(keepNotes.filter(n => n.id !== id))
  }

  const handleSyncKeep = async () => {
    if (!token) return
    try {
      setIsLoading(true)
      setStatusMessage(null)
      await saveKeepNotesToDrive(token, keepNotes)
      setStatusMessage({ type: "success", msg: "Keep 协同便签已成功云端同步到您的 Google 云空间文件 (google_keep_sync.json)！" })
      await fetchDriveAndKeep(token)
    } catch (err: any) {
      setStatusMessage({ type: "error", msg: `云端同步失败: ${err.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshDrive = async () => {
    if (!token) return
    await fetchDriveAndKeep(token)
    setStatusMessage({ type: "success", msg: "已成功更新同步 Google Workspace 最新云端状态！" })
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <Settings className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">设置</h1>
                <p className="text-sm text-muted-foreground mt-0.5">管理店铺配置和账户设置</p>
              </div>
            </div>
            {/* Live global feedback bar */}
            {statusMessage && (
              <div className={`p-2 px-4 rounded-lg border text-xs font-mono max-w-sm shrink-0 transition-opacity flex items-center gap-2 ${
                statusMessage.type === "success" 
                  ? "bg-success/10 border-success/30 text-success" 
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}>
                <span>{statusMessage.msg}</span>
                <button onClick={() => setStatusMessage(null)} className="hover:opacity-70 ml-1">×</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[240px] border-r border-border bg-card overflow-auto">
          <div className="p-3 space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                    ${activeSection === section.id 
                      ? "bg-foreground text-background" 
                      : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl">
            {activeSection === "store" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">店铺设置</h2>
                  <p className="text-sm text-muted-foreground">管理店铺基本信息</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <label className="block text-sm font-medium text-foreground mb-2">店铺名称</label>
                    <input
                      type="text"
                      defaultValue="我的店铺"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card">
                    <label className="block text-sm font-medium text-foreground mb-2">店铺描述</label>
                    <textarea
                      rows={3}
                      defaultValue="这是一家专注于高品质商品的在线商店。"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card">
                    <label className="block text-sm font-medium text-foreground mb-2">联系邮箱</label>
                    <input
                      type="email"
                      defaultValue="contact@mystore.com"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">店铺状态</p>
                        <p className="text-xs text-muted-foreground mt-0.5">控制店铺是否对外开放</p>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">营业中</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">取消</Button>
                  <Button>保存更改</Button>
                </div>
              </div>
            )}

            {activeSection === "domain" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">域名设置</h2>
                  <p className="text-sm text-muted-foreground">管理自定义域名和 SSL</p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">当前域名</p>
                      <p className="text-xs text-muted-foreground mt-0.5">mystore.aicommerce.com</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <Check className="h-3 w-3 mr-1" />
                      已激活
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    添加自定义域名
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">SSL 证书</p>
                      <p className="text-xs text-muted-foreground mt-0.5">自动管理的 SSL/TLS 证书</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <Shield className="h-3 w-3 mr-1" />
                      已启用
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">支付设置</h2>
                  <p className="text-sm text-muted-foreground">管理支付方式和结算账户</p>
                </div>

                <div className="space-y-3">
                  {["微信支付", "支付宝", "银行卡"].map((method, i) => (
                    <div key={method} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{method}</p>
                          <p className="text-xs text-muted-foreground">
                            {i === 0 ? "已连接商户号" : i === 1 ? "已连接企业账户" : "银联在线支付"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">已启用</Badge>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  添加支付方式
                </Button>
              </div>
            )}

            {activeSection === "team" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">团队管理</h2>
                    <p className="text-sm text-muted-foreground">管理团队成员和权限</p>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    邀请成员
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "张伟", email: "zhang@example.com", role: "管理员" },
                    { name: "李娜", email: "li@example.com", role: "运营" },
                    { name: "王芳", email: "wang@example.com", role: "客服" },
                  ].map((member) => (
                    <div key={member.email} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{member.role}</Badge>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Workspace Active Section Tab */}
            {activeSection === "workspace" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Google Workspace 决策中心</h2>
                    <p className="text-sm text-muted-foreground">绑定 Google 授权并利用云端同步备份、便签协同及邮件推送</p>
                  </div>
                  {user && (
                    <Button variant="outline" size="sm" onClick={handleRefreshDrive} disabled={isLoading} className="gap-2">
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                      云端同步状态
                    </Button>
                  )}
                </div>

                {/* Google Authorization Status */}
                <div className="p-5 rounded-2xl border border-border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-inner shrink-0">
                      <Cloud className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      {user ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{user.displayName || "Google 协作用户"}</span>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-mono text-[10px]">AUTH OK</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">{user.email}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-sm text-foreground">未关联 Google 账号</p>
                          <p className="text-xs text-muted-foreground mt-0.5">关联后即可激活云存储、协作邮箱与便签同步</p>
                        </>
                      )}
                    </div>
                  </div>

                  {user ? (
                    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isLoading} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                      断开 Google 账号
                    </Button>
                  ) : (
                    <Button onClick={handleSignIn} disabled={isLoading} className="gap-2 shrink-0">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.01-1.38-1.21-2.07l2.02 1.44z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      )}
                      绑定 Google 账号
                    </Button>
                  )}
                </div>

                {user ? (
                  <div className="space-y-8 animate-fadeIn">
                    
                    {/* 1. Google Drive Module */}
                    <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-indigo-500 shrink-0" />
                        <h3 className="font-semibold text-foreground text-base">Google Drive 存储与归档</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        直接将您的 Active 店铺目录商品结构及财务订单对账单实时导出写入您绑定的 Google 云端硬盘：
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" onClick={handleExportProducts} disabled={isLoading} className="gap-1.5 text-xs text-foreground bg-background hover:bg-muted font-medium">
                          <FileJson className="h-3.5 w-3.5 text-amber-500" />
                          导出商品备份 JSON ({products.length}项)
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportOrders} disabled={isLoading} className="gap-1.5 text-xs text-foreground bg-background hover:bg-muted font-medium">
                          <FileJson className="h-3.5 w-3.5 text-emerald-500" />
                          导出财务对账报表 JSON ({orders.length}项)
                        </Button>
                      </div>

                      {/* Folder Files Listing */}
                      <div className="mt-4 pt-3 border-t border-border/80">
                        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                          <span>已在此应用创建的 Google Drive 文件列表：</span>
                          {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                        </p>
                        {driveFiles.length === 0 ? (
                          <p className="p-4 text-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                            云端暂无此应用上传的文件，点击上方导出并在 Drive 中管理
                          </p>
                        ) : (
                          <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-2 font-mono text-xs">
                            {driveFiles.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                                <span className="truncate max-w-[280px] shrink-0 text-foreground">{file.name}</span>
                                <div className="flex items-center gap-2 font-sans">
                                  <Badge variant="outline" className="text-[10px] hidden sm:inline-block border-neutral-300 dark:border-neutral-700">{file.mimeType.split(".").pop() || "JSON"}</Badge>
                                  {file.webViewLink && (
                                    <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-0.5 shrink-0 text-[11px]">
                                      查看云文件
                                      <ArrowRight className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2. Gmail Communication Module */}
                    <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-red-500 shrink-0" />
                        <h3 className="font-semibold text-foreground text-base">Gmail 客服 & 店主推送</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        在安全沙箱中，使用已绑定的 Google 协同邮箱发送定制的产品清单备份，或分发自动化订单通知。
                      </p>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">收件人邮箱 (To)</label>
                          <input
                            type="email"
                            placeholder="请输入正确的收件邮箱地址，例如 test@example.com"
                            value={gmailTo}
                            onChange={(e) => setGmailTo(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">邮件主题</label>
                          <input
                            type="text"
                            placeholder="邮件主题..."
                            value={gmailSubject}
                            onChange={(e) => setGmailSubject(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">正文 HTML (Body)</label>
                          <textarea
                            rows={3}
                            placeholder="支持 HTML 正文，请键入邮件正文..."
                            value={gmailBody}
                            onChange={(e) => setGmailBody(e.target.value)}
                            className="w-full p-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <Button size="xs" onClick={handleSendEmail} disabled={isLoading} className="gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium px-4 h-9 shadow-sm">
                            <Mail className="h-3.5 w-3.5 text-white" />
                            使用你的 Gmail 发送邮件
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 3. Google Keep Synchronized Pad */}
                    <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StickyNote className="h-5 w-5 text-yellow-500 shrink-0" />
                          <h3 className="font-semibold text-foreground text-base">Google Keep 脑暴协同便签</h3>
                        </div>
                        <Button variant="outline" size="xs" onClick={handleSyncKeep} disabled={isLoading} className="gap-2 border-yellow-500/20 text-yellow-600 hover:bg-yellow-500/10 font-medium">
                          同步到云 Keep
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        在精美的 Keep 图块网格中，随手记下运营灵感或备忘，并通过安全的 `google_keep_sync.json` 安全通道双向存取自您的 Google 云硬盘：
                      </p>

                      {/* Add Note Builder */}
                      <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2.5">
                        <div className="flex items-center gap-1.5 justify-between">
                          <input
                            type="text"
                            placeholder="便签标题..."
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            className="w-[180px] bg-transparent border-0 border-b border-border text-xs focus:outline-none focus:border-foreground/50 h-7"
                          />
                          <div className="flex items-center gap-1">
                            <button onClick={() => setNewNoteColor("bg-card")} className={`h-4.5 w-4.5 rounded-full bg-white dark:bg-black border border-border ${newNoteColor === "bg-card" ? "ring-2 ring-foreground" : ""}`} title="默认" />
                            <button onClick={() => setNewNoteColor("bg-amber-100/80 dark:bg-amber-950/20")} className={`h-4.5 w-4.5 rounded-full bg-amber-200 border border-border ${newNoteColor.includes("amber") ? "ring-2 ring-foreground" : ""}`} title="鹅黄" />
                            <button onClick={() => setNewNoteColor("bg-emerald-100/80 dark:bg-emerald-950/20")} className={`h-4.5 w-4.5 rounded-full bg-emerald-200 border border-border ${newNoteColor.includes("emerald") ? "ring-2 ring-foreground" : ""}`} title="浅绿" />
                            <button onClick={() => setNewNoteColor("bg-rose-100/80 dark:bg-rose-950/20")} className={`h-4.5 w-4.5 rounded-full bg-rose-200 border border-border ${newNoteColor.includes("rose") ? "ring-2 ring-foreground" : ""}`} title="粉红" />
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="随手记下新的运营备忘、计划或构想..."
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="w-full bg-transparent border-0 text-xs focus:outline-none h-7"
                        />
                        <div className="flex justify-end pt-1">
                          <Button size="xs" onClick={handleAddKeepNote} className="gap-1 h-7 text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-inner px-3">
                            <Plus className="h-3.5 w-3.5 text-black" />
                            加入本地
                          </Button>
                        </div>
                      </div>

                      {/* Display Post-it Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {keepNotes.map((note) => (
                          <div key={note.id} className={`p-4 rounded-xl border border-border/80 relative group flex flex-col justify-between min-h-[110px] transition-shadow hover:shadow ${note.color}`}>
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <h4 className="font-semibold text-xs text-foreground truncate">{note.title}</h4>
                                <button onClick={() => handleDeleteKeepNote(note.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <p className="text-xs text-foreground/90 leading-relaxed font-sans">{note.content}</p>
                            </div>
                            <span className="text-[9px] text-muted-foreground font-mono mt-2 self-end">{note.lastUpdated}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-muted/10">
                    <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-foreground mb-1">请先绑定您的 Google 授权</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      关联您的个人或企业 Google 协作账户。我们支持一键获取 Google Drive 及 Gmail、Keep 同步通道，全站安全，仅本地浏览器运行。
                    </p>
                    <div className="mt-5">
                      <Button onClick={handleSignIn} disabled={isLoading} className="gap-2 mx-auto">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        立即关联授权并激活协同
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(activeSection === "security" || activeSection === "notifications" || activeSection === "theme") && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    {settingsSections.find(s => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {settingsSections.find(s => s.id === activeSection)?.description}
                  </p>
                </div>
                <div className="p-8 rounded-xl border border-dashed border-border bg-muted/20 text-center">
                  <p className="text-sm text-muted-foreground">此功能正在开发中</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
