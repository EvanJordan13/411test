import Link from "next/link";
import { Check, ChevronRight, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const features = [
  {
    title: "AI-Powered Player Comparison",
    description:
      "Compare any two NFL players using our advanced machine learning algorithm that analyzes historical performance data.",
  },
  {
    title: "Real-Time Stats & Updates",
    description:
      "Get instant access to player statistics, performance metrics, and latest game updates.",
  },
  {
    title: "Personal Player Notes",
    description:
      "Keep track of your observations and thoughts on players with a personal note-taking system.",
  },
  {
    title: "Smart Fantasy Insights",
    description:
      "Make better fantasy football decisions with our AI-driven insights and recommendations.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Make Smarter</span>
                  <span className="block text-blue-600">Fantasy Decisions</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Compare NFL players head-to-head using advanced statistics and
                  insights. Perfect for fantasy football managers and sports
                  enthusiasts.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth?mode=signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to analyze players
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Get the competitive edge in your fantasy league with our
              comprehensive player comparison tools.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="mt-10 space-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Check className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg leading-6 font-medium text-gray-900">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0">
              <div className="relative space-y-4">
                {/* Preview Cards */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Patrick Mahomes</h3>
                      <p className="text-gray-600">QB - Kansas City Chiefs</p>
                    </div>
                    <Star className="text-yellow-500" />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <span className="text-3xl font-bold text-blue-600">94</span>
                    <p className="text-sm text-blue-600">Player Score</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Josh Allen</h3>
                      <p className="text-gray-600">QB - Buffalo Bills</p>
                    </div>
                    <Star className="text-gray-300" />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <span className="text-3xl font-bold text-blue-600">92</span>
                    <p className="text-sm text-blue-600">Player Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to dominate your fantasy league?
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Get started today and get access to all our premium features.
          </p>
          <Link
            href="/auth?mode=signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Get started
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
