"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { DashboardView } from "@/components/admin/dashboard-view"
import { ProductsView } from "@/components/admin/products-view"
import { OrdersView } from "@/components/admin/orders-view"
import { CustomersView } from "@/components/admin/customers-view"
import { MarketingView } from "@/components/admin/marketing-view"
import { ContentView } from "@/components/admin/content-view"
import { DiscountsView } from "@/components/admin/discounts-view"
import { ChannelsView } from "@/components/admin/channels-view"
import { StorefrontView } from "@/components/admin/storefront-view"
import { AnalyticsView } from "@/components/admin/analytics-view"
import { AgentsView } from "@/components/admin/agents-view"
import { AIStudioView } from "@/components/admin/ai-studio-view"
import { SettingsView } from "@/components/admin/settings-view"
import { AIAssistantPanel } from "@/components/admin/ai-assistant-panel"
import type { ActiveTab } from "@/lib/types"

// Import initial database configurations of database state arrays safely
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DISCOUNTS,
  mockStores
} from "@/lib/data"

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard")
  const [showAIPanel, setShowAIPanel] = useState(true)
  const [mounted, setMounted] = useState(false)

  const handleSetActiveTab = (tab: ActiveTab) => {
    console.log(`[Navigation] Tab changed to: ${tab}`)
    setActiveTab(tab)
  }

  // Standard container-level useState hooks (Hoisted State Containers)
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [discounts, setDiscounts] = useState(INITIAL_DISCOUNTS)
  const [stores, setStores] = useState<any[]>(mockStores)
  const [currentTheme, setCurrentTheme] = useState("theme-minimal")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center text-muted-foreground text-sm font-medium">
        正在启动 AI Commerce 控制台...
      </div>
    )
  }

  const renderView = () => {
    // Null/undefined guard assignments to guarantee robust render state pipeline
    const safeProducts = products || []
    const safeOrders = orders || []
    const safeCustomers = customers || []
    const safeDiscounts = discounts || []
    const safeStores = stores || []

    switch (activeTab) {
      case "dashboard":
        return <DashboardView />
      case "products":
        return <ProductsView products={safeProducts} setProducts={setProducts} />
      case "orders":
        return <OrdersView orders={safeOrders} setOrders={setOrders} />
      case "customers":
        return <CustomersView customers={safeCustomers} setCustomers={setCustomers} />
      case "marketing":
        return <MarketingView />
      case "content":
        return <ContentView />
      case "discounts":
        return <DiscountsView discounts={safeDiscounts} setDiscounts={setDiscounts} />
      case "stores":
        return <ChannelsView stores={safeStores} setStores={setStores} />
      case "storefront":
        return <StorefrontView currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
      case "analytics":
        return <AnalyticsView products={safeProducts} orders={safeOrders} customers={safeCustomers} />
      case "agents":
        return <AgentsView />
      case "ai-studio":
        return <AIStudioView />
      case "settings":
        return <SettingsView products={safeProducts} orders={safeOrders} />
      case "merchants":
      case "queues":
      case "logs":
      case "billing":
      case "runtime":
        console.log(`Fallback for unrendered activeTab: ${activeTab}`)
        return <DashboardView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          {renderView()}
        </div>
        
        {/* AI Assistant Panel */}
        {showAIPanel && (
          <AIAssistantPanel 
            activeTab={activeTab} 
            onClose={() => setShowAIPanel(false)} 
          />
        )}
      </main>
      
      {/* AI Toggle Button */}
      {!showAIPanel && (
        <button
          onClick={() => setShowAIPanel(true)}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </button>
      )}
    </div>
  )
}
