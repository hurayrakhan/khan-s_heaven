"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
    const { data: session } = useSession();
    const router = useRouter();

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative isolate flex-1">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                        <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Manage tasks with{" "}
                            <span className="text-[#1E3A34]">perfect organization</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Task-Era helps teams move work forward. Collaborate, manage projects,
                            and reach new productivity peaks with our intuitive platform.
                        </p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <Button
                                className="bg-[#1E3A34] hover:bg-[#1E3A34]/90"
                                size="lg"
                                asChild
                            >
                                <Link href="/register">Get started for free</Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                asChild
                            >
                                <Link href="/login">
                                    Sign in <span aria-hidden="true">→</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {/* Features grid */}
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                        <div className="max-w-3xl">
                            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                {features.map((feature) => (
                                    <div key={feature.name} className="pt-6">
                                        <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                                            <div className="-mt-6">
                                                <div>
                                                    <span className="inline-flex items-center justify-center rounded-md bg-[#1E3A34] p-2 shadow-lg">
                                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <h3 className="mt-8 text-lg font-semibold leading-8 text-gray-900">
                                                    {feature.name}
                                                </h3>
                                                <p className="mt-2 text-base leading-7 text-gray-600">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-[#1E3A34] font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage tasks
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Get a clear overview of what needs to be done, who&apos;s working on what, and when things are due.
                        </p>
                    </div>

                    <div className="mt-20">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {features.map((feature) => (
                                <div key={feature.name} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#1E3A34] text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#1E3A34]">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-white/80">Start your free trial today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:shrink-0 gap-4">
                        <Button
                            className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-white text-[#1E3A34] hover:bg-white/90"
                            onClick={() => router.push("/register")}
                        >
                            Get started
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white border-white hover:bg-white/10"
                            onClick={() => router.push("/login")}
                        >
                            Learn more
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


// Feature list
const features = [
  {
    name: "Task Organization",
    description: "Keep all your tasks organized in one place. Create, assign, and track progress effortlessly.",
    icon: function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    },
  },
  {
    name: "Team Collaboration",
    description: "Work together seamlessly with your team. Share updates, files, and feedback in real-time.",
    icon: function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    },
  },
  {
    name: "Progress Tracking",
    description: "Monitor project progress with visual dashboards and detailed analytics.",
    icon: function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    },
  },
  {
    name: "Smart Notifications",
    description: "Stay updated with intelligent notifications about tasks, deadlines, and team activities.",
    icon: function BellIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    },
  },
];