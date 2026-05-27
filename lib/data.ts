import type { 
  Product,
  Order,
  Customer,
  Discount
} from './types';

// 初始产品数据
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'PRD-001', name: '智能手表 Pro Max', sku: 'SW-PRO-001', price: 2999, stock: 156, status: 'active', category: '智能设备' },
  { id: 'PRD-002', name: '无线降噪耳机', sku: 'WH-NC-002', price: 899, stock: 342, status: 'active', category: '音频设备' },
  { id: 'PRD-003', name: '便携充电宝 20000mAh', sku: 'PB-20K-003', price: 199, stock: 0, status: 'draft', category: '配件' },
  { id: 'PRD-004', name: '机械键盘 87键', sku: 'KB-87-004', price: 599, stock: 89, status: 'active', category: '外设' },
  { id: 'PRD-005', name: '4K显示器 27英寸', sku: 'MN-4K27-005', price: 2499, stock: 45, status: 'active', category: '显示器' },
  { id: 'PRD-006', name: '人体工学椅', sku: 'CH-ERG-006', price: 1899, stock: 23, status: 'archived', category: '办公家具' }
];

// 初始订单数据
export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-9921', customer: '张伟', email: 'zhang.wei@email.com', total: 3898, status: 'pending', items: 2, date: '2024-01-15' },
  { id: 'ORD-9920', customer: '李娜', email: 'li.na@email.com', total: 899, status: 'processing', items: 1, date: '2024-01-15' },
  { id: 'ORD-9919', customer: '王芳', email: 'wang.fang@email.com', total: 5497, status: 'shipped', items: 3, date: '2024-01-14' },
  { id: 'ORD-9918', customer: '刘强', email: 'liu.qiang@email.com', total: 199, status: 'delivered', items: 1, date: '2024-01-13' },
  { id: 'ORD-9917', customer: '陈静', email: 'chen.jing@email.com', total: 2999, status: 'cancelled', items: 1, date: '2024-01-12' }
];

// 初始客户数据
export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUS-001', name: '张伟', email: 'zhang.wei@email.com', orders: 12, spent: 25680, lastOrder: '2024-01-15', status: 'active' },
  { id: 'CUS-002', name: '李娜', email: 'li.na@email.com', orders: 8, spent: 12450, lastOrder: '2024-01-15', status: 'active' },
  { id: 'CUS-003', name: '王芳', email: 'wang.fang@email.com', orders: 23, spent: 45890, lastOrder: '2024-01-14', status: 'active' },
  { id: 'CUS-004', name: '刘强', email: 'liu.qiang@email.com', orders: 3, spent: 2890, lastOrder: '2024-01-13', status: 'inactive' }
];

// 初始折扣数据
export const INITIAL_DISCOUNTS: Discount[] = [
  { id: 'DSC-001', code: 'SUMMER2024', type: 'percentage', value: 20, usageCount: 156, usageLimit: 500, status: 'active', startDate: '2024-01-01', endDate: '2024-03-31' },
  { id: 'DSC-002', code: 'NEWUSER50', type: 'fixed', value: 50, usageCount: 89, usageLimit: 1000, status: 'active', startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: 'DSC-003', code: 'VIP15OFF', type: 'percentage', value: 15, usageCount: 45, usageLimit: 100, status: 'expired', startDate: '2023-12-01', endDate: '2023-12-31' }
];

// Mock 数据导出 (兼容组件引用)
export const mockProducts = INITIAL_PRODUCTS;
export const mockOrders = INITIAL_ORDERS;
export const mockCustomers = INITIAL_CUSTOMERS;
export const mockDiscounts = INITIAL_DISCOUNTS;

// Mock Agents 数据
export const mockAgents = [
  {
    id: "agent-001",
    name: "客服助理",
    status: "active" as const,
    type: "customer_service" as const,
    description: "自动处理客户咨询，提供24/7全天候服务支持，智能分流和工单管理",
    conversationsCount: 12580,
    responseRate: 98.5,
    avgResponseTime: 1.2,
    resourceUsage: 45,
  },
  {
    id: "agent-002",
    name: "销售顾问",
    status: "active" as const,
    type: "sales" as const,
    description: "智能推荐产品，分析用户行为，提供个性化购物建议",
    conversationsCount: 8420,
    responseRate: 96.8,
    avgResponseTime: 1.5,
    resourceUsage: 62,
  },
  {
    id: "agent-003",
    name: "数据分析师",
    status: "idle" as const,
    type: "analytics" as const,
    description: "自动生成销售报表，分析趋势，预测库存需求",
    conversationsCount: 3250,
    responseRate: 99.2,
    avgResponseTime: 2.1,
    resourceUsage: 28,
  },
  {
    id: "agent-004",
    name: "营销助手",
    status: "offline" as const,
    type: "sales" as const,
    description: "创建营销活动，自动化邮件营销，社交媒体管理",
    conversationsCount: 5680,
    responseRate: 94.5,
    avgResponseTime: 1.8,
    resourceUsage: 0,
  },
];

// Mock Stores 数据
export const mockStores = [
  {
    id: "store-001",
    name: "极简科技旗舰店",
    url: "tech-flagship.myshop.com",
    status: "active" as const,
    productsCount: 256,
    ordersCount: 1580,
    revenue: 458000,
  },
  {
    id: "store-002",
    name: "潮流服饰官方店",
    url: "urban-style.myshop.com",
    status: "active" as const,
    productsCount: 482,
    ordersCount: 2340,
    revenue: 892000,
  },
  {
    id: "store-003",
    name: "智能家居体验馆",
    url: "smart-home.myshop.com",
    status: "maintenance" as const,
    productsCount: 128,
    ordersCount: 680,
    revenue: 234000,
  },
  {
    id: "store-004",
    name: "美妆集合店",
    url: "beauty-box.myshop.com",
    status: "active" as const,
    productsCount: 365,
    ordersCount: 1920,
    revenue: 567000,
  },
];

// Mock Merchants 数据
export const mockMerchants = [
  {
    id: "merchant-001",
    name: "Aero Labs Inc.",
    email: "contact@aerolabs.com",
    phone: "400-888-1234",
    location: "上海市浦东新区",
    avatar: "",
    status: "active" as const,
    storesCount: 3,
    totalSales: 1580000,
    growthRate: 15.2,
    joinDate: "2023-06-15",
  },
  {
    id: "merchant-002",
    name: "UrbanStyle Co.",
    email: "info@urbanstyle.cn",
    phone: "400-666-5678",
    location: "广州市天河区",
    avatar: "",
    status: "active" as const,
    storesCount: 2,
    totalSales: 892000,
    growthRate: 8.5,
    joinDate: "2023-08-20",
  },
  {
    id: "merchant-003",
    name: "SmartHome Ltd.",
    email: "support@smarthome.io",
    phone: "400-999-0000",
    location: "深圳市南山区",
    avatar: "",
    status: "pending" as const,
    storesCount: 1,
    totalSales: 234000,
    growthRate: -2.3,
    joinDate: "2024-01-05",
  },
  {
    id: "merchant-004",
    name: "BeautyBox Inc.",
    email: "hello@beautybox.com",
    phone: "400-777-3333",
    location: "北京市朝阳区",
    avatar: "",
    status: "suspended" as const,
    storesCount: 1,
    totalSales: 567000,
    growthRate: 0,
    joinDate: "2023-09-10",
  },
];
