"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Check, Star, Zap, Globe, Shield } from "lucide-react"


export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "$0",
      period: "per month",
      description: "Get started for free with basic features and ads",
      features: [
        "Ads included",
        "Unlimited Requests",
        "No support",
        "Player Minimal customization",
        "No custom requests",
        "Custom branding",
        "No custom ads support",
      ],
      icon: Globe,
      color: "gray",
      popular: false,
      isFree: true,
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: "$200",
      period: "per month",
      description: "For growing businesses with high traffic",
      features: [
        "Unlimited requests (up to 1M monthly)",
        "Ad-free experience",
        "Custom ads support",
        "Player Full Customization",
        "Priority support",
        "99.9% uptime guarantee",
        "Advanced analytics",
        "Custom branding",
      ],
      icon: Zap,
      color: "purple",
      popular: true,
    },
    {
      id: "starter",
      name: "Starter Plan",
      price: "$4",
      period: "per 10,000 requests",
      description: "Perfect for small projects and testing",
      features: [
        "10,000 API requests",
        "Ad-free experience",
        "Custom ads support",
        "Player Full Customization",
        "Custom branding",
        "Basic support",
        "99.9% uptime guarantee",
      ],
      icon: Star,
      color: "blue",
      popular: false,
    }
  ]


  const handleSelectPlan = (planId: any) => {
    setSelectedPlan(planId)
    // Here you would typically integrate with a payment processor
    console.log(`Selected plan: ${planId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-white">Premium Plans</h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Upgrade your experience with our premium plans. Get more requests, advanced features, and priority support.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon
          return (
            <Card
              key={plan.id}
              className={`relative bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 ${
                plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      plan.color === "blue"
                        ? "bg-blue-600"
                        : plan.color === "purple"
                          ? "bg-purple-600"
                          : "bg-yellow-600"
                    }`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  <p className="text-slate-400 text-sm mt-2">{plan.description}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-white">{plan.price}</div>
                  <div className="text-slate-400 text-sm">{plan.period}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.popular ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Comparison */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            All Plans Include
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Ad-Free Experience</h3>
                <p className="text-slate-400 text-sm">Clean, professional video player</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Multi-Domain Support</h3>
                <p className="text-slate-400 text-sm">Use across multiple websites</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Custom Ads</h3>
                <p className="text-slate-400 text-sm">Monetize with your own ads</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-2">What happens when I exceed my request limit?</h3>
            <p className="text-slate-400 text-sm">
              For the Starter plan, additional requests will be charged at the same rate. Professional and Enterprise
              plans include overage protection, If your request exceed professional plan contact support to get custom plan.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Can I change plans anytime?</h3>
            <p className="text-slate-400 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your
              next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-slate-400 text-sm">
              We offer a 3 days money back guarantee!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
