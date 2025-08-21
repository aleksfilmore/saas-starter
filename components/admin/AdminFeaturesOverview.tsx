import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  HeartHandshake, 
  BarChart3, 
  Users, 
  ShieldCheck,
  Mail,
  Settings,
  DollarSign,
  TrendingUp,
  FileText,
  Zap,
  CheckCircle
} from "lucide-react";

interface AdminFeature {
  title: string;
  description: string;
  icon: any;
  status: 'active' | 'beta' | 'coming-soon';
  features: string[];
}

const adminFeatures: AdminFeature[] = [
  {
    title: "Blog Management",
    description: "Create, edit, and publish blog posts with SEO optimization",
    icon: PenTool,
    status: 'active',
    features: [
      "Rich text editor with media uploads",
      "SEO metadata management",
      "Category and tag system",
      "Publication scheduling",
      "Draft and preview modes"
    ]
  },
  {
    title: "Ritual Library",
    description: "Manage healing rituals, steps, and premium content",
    icon: HeartHandshake,
    status: 'active',
    features: [
      "Create custom healing rituals",
      "Manage ritual steps and prompts",
      "Set premium vs free content",
      "Archetype-based categorization",
      "Difficulty level assignment"
    ]
  },
  {
    title: "Real-Time Analytics",
    description: "Monitor platform performance and user engagement",
    icon: BarChart3,
    status: 'active',
    features: [
      "OpenAI API usage tracking",
      "Stripe payment analytics",
      "User engagement metrics",
      "Revenue monitoring",
      "Email performance stats"
    ]
  },
  {
    title: "User Management",
    description: "Manage user accounts, subscriptions, and permissions",
    icon: Users,
    status: 'active',
    features: [
      "User account overview",
      "Subscription management",
      "Role and permission control",
      "Activity monitoring",
      "Account verification"
    ]
  },
  {
    title: "Content Moderation",
    description: "Review and moderate user-generated content",
    icon: ShieldCheck,
    status: 'active',
    features: [
      "Wall post moderation queue",
      "Automated flagging system",
      "Manual review tools",
      "Content reporting",
      "Moderation history"
    ]
  },
  {
    title: "Email Campaigns",
    description: "Send newsletters and automated email sequences",
    icon: Mail,
    status: 'beta',
    features: [
      "Newsletter creation",
      "Automated sequences",
      "Resend integration",
      "Performance tracking",
      "Template management"
    ]
  }
];

const integrationFeatures = [
  {
    name: "OpenAI Integration",
    description: "AI therapy sessions and token usage tracking",
    icon: Zap,
    status: 'active'
  },
  {
    name: "Stripe Payments",
    description: "Revenue tracking and subscription management",
    icon: DollarSign,
    status: 'active'
  },
  {
    name: "Resend Email",
    description: "Email delivery and performance analytics",
    icon: Mail,
    status: 'active'
  },
  {
    name: "Google Analytics",
    description: "Website traffic and user behavior insights",
    icon: TrendingUp,
    status: 'coming-soon'
  },
  {
    name: "Google AdWords",
    description: "Advertising performance and ROI tracking",
    icon: FileText,
    status: 'coming-soon'
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    'active': 'bg-green-100 text-green-800 border-green-200',
    'beta': 'bg-blue-100 text-blue-800 border-blue-200',
    'coming-soon': 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const labels = {
    'active': 'Active',
    'beta': 'Beta',
    'coming-soon': 'Coming Soon'
  };

  return (
    <Badge className={variants[status as keyof typeof variants]}>
      {labels[status as keyof typeof labels]}
    </Badge>
  );
};

export function AdminFeaturesOverview() {
  return (
    <div className="space-y-6">
      {/* Platform Command Center Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Platform Command Center</h2>
        <p className="text-lg text-gray-600">
          Complete administrative control over your healing platform
        </p>
      </div>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <StatusBadge status={feature.status} />
                </div>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Integrations Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {integrationFeatures.map((integration, index) => {
            const IconComponent = integration.icon;
            return (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col items-center space-y-2">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <h4 className="font-medium text-sm">{integration.name}</h4>
                    <StatusBadge status={integration.status} />
                    <p className="text-xs text-gray-500 text-center">
                      {integration.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Platform Health</CardTitle>
          <CardDescription>
            Real-time system status and key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">14</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">73</div>
              <div className="text-sm text-gray-600">Wall Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">90</div>
              <div className="text-sm text-gray-600">Rituals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
