'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Target, Users, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Next Opportunity
            </h1>
            <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Find and pursue opportunities tailored to your skills and goals. Track your progress and submit applications all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="bg-white bg-opacity-20 text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-30 transition-colors border border-white border-opacity-30"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white border border-white border-opacity-20">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Opportunities</h3>
              <p className="text-white text-opacity-80">Browse hundreds of opportunities from internships to fellowships matched to your profile.</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white border border-white border-opacity-20">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-white text-opacity-80">Stay organized with task tracking and progress monitoring for each opportunity.</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white border border-white border-opacity-20">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-white text-opacity-80">Connect with other seekers and mentors in our growing community.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
        <p className="text-secondary mb-8">Here&apos;s what you can do next</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/opportunities"
            className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Browse Opportunities</h3>
            <p className="text-secondary text-sm mb-4">Discover new opportunities matching your interests</p>
            <div className="flex items-center gap-2 text-primary font-medium">
              Explore <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-colors">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Your Applications</h3>
            <p className="text-secondary text-sm mb-4">Track all your applications and their status</p>
            <div className="flex items-center gap-2 text-accent font-medium">
              View <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/tasks"
            className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-colors">
              <Users className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Your Tasks</h3>
            <p className="text-secondary text-sm mb-4">Complete required tasks for your applications</p>
            <div className="flex items-center gap-2 text-success font-medium">
              Manage <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
