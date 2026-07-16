"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Users } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  // Animation variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const imageScale: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut", delay: 0.4 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-gold-400 selection:text-blue-950 overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Digital Tontine Logo" width={32} height={32} className="rounded-full shadow-lg shrink-0" />
            <span className="font-bold text-lg md:text-xl tracking-tight text-foreground hidden sm:block">Digital Tontine</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-foreground/80">
            <Link href="#how-it-works" className="hover:text-gold-500 transition-colors">How it works</Link>
            <Link href="#benefits" className="hover:text-gold-500 transition-colors">Benefits</Link>
            <Link href="#pricing" className="hover:text-gold-500 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium hover:text-gold-500 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/register" className="px-5 py-2.5 rounded-full bg-blue-950 dark:bg-white text-white dark:text-blue-950 text-sm font-semibold hover:bg-blue-900 dark:hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Create a group
            </Link>
          </div>
        </div>
      </nav>

      {/* Centered Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center justify-center"
          >
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-blue-900 shadow-sm border border-gray-200 dark:border-blue-800 mb-6">
              <span className="text-gold-500 font-bold text-sm tracking-wide uppercase">✨ Save together, Grow together</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-950 dark:text-white leading-tight mb-6 max-w-4xl">
              Your tontines,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-coral-500">
                finally simple and secure.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Say goodbye to calculation errors and notebook tracking. Manage your rotating savings groups with complete trust, automatic reminders, and reliable history.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center mb-16 space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-blue-950 dark:bg-white text-white dark:text-blue-950 text-base sm:text-lg font-bold hover:bg-blue-900 dark:hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center group">
                Start your Tontine now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full border-2 border-blue-950 dark:border-white text-blue-950 dark:text-white text-base sm:text-lg font-bold hover:bg-blue-50 dark:hover:bg-white/10 transition-all flex items-center justify-center">
                Already registered? Log in
              </Link>
            </motion.div>

            {/* Synchronized 8K Image */}
            <motion.div variants={imageScale} className="relative w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-blue-900">
              <div className="aspect-[4/3] sm:aspect-video md:aspect-[21/9] relative">
                <Image
                  src="/hero_8k.png"
                  alt="A professional and highly detailed representation of community savings"
                  fill
                  className="object-cover object-center"
                  priority
                  quality={100}
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* How it works (Scroll Animated) */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Set up your group in less than 3 minutes and let Digital Tontine handle the rest.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12 relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-coral-200 to-blue-100 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900" />
            
            {[
              { icon: Users, step: "1", title: "Create & Invite", desc: "Define the rules, contribution amount, and invite your members via a simple link." },
              { icon: Clock, step: "2", title: "Contribute", desc: "Receive automatic reminders before due dates. Declare payments easily from your phone." },
              { icon: ShieldCheck, step: "3", title: "Receive", desc: "When it's your turn, receive the pooled funds with complete transparency." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div variants={fadeUp} key={i} className="relative text-center">
                  <div className="w-24 h-24 mx-auto bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-md border border-blue-100 dark:border-blue-800 hover:scale-105 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-blue-600 dark:text-gold-400" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">{feature.step}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits (Scroll Animated) */}
      <section id="benefits" className="py-24 bg-blue-50 dark:bg-blue-950/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-6">Why switch to Digital Tontine?</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-foreground/70 mb-8">We replace the traditional notebook with a secure, transparent platform designed specifically for community savings.</motion.p>
              
              <ul className="space-y-6">
                {[
                  { title: "Zero calculation errors", desc: "Our system automatically tracks who has paid, who is late, and who receives the next pot." },
                  { title: "Complete transparency", desc: "Every member has access to the group's activity log. No more disputes or doubts." },
                  { title: "Automatic reminders", desc: "Reduce payment delays by over 85% with our automated email and in-app notifications." },
                  { title: "Immutable history", desc: "Financial actions are securely logged forever to guarantee maximum trust." }
                ].map((item, i) => (
                  <motion.li variants={fadeUp} key={i} className="flex">
                    <CheckCircle2 className="w-6 h-6 text-coral-500 shrink-0 mt-1" />
                    <div className="ml-4">
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <p className="text-foreground/60 mt-1">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative mt-8 md:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-400 to-coral-400 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-xl"></div>
              <div className="relative bg-white dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  <h3 className="font-bold text-lg">Next Round: Oct 15</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-semibold animate-pulse">Active</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "You", status: "Paid", amount: "$100", highlight: true },
                    { name: "Sarah K.", status: "Pending", amount: "$100", highlight: false },
                    { name: "David L.", status: "Late", amount: "$100", highlight: false, late: true },
                  ].map((member, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${member.highlight ? 'bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{member.amount}</div>
                        <div className={`text-xs font-semibold ${member.status === 'Paid' ? 'text-emerald-600' : member.late ? 'text-coral-500' : 'text-gray-500'}`}>
                          {member.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing (Scroll Animated) */}
      <section id="pricing" className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto mb-16 text-lg">Start organizing your tontines for free. Upgrade when you need more power.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Free Tier */}
            <motion.div variants={fadeUp} className="border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-left hover:shadow-2xl transition-all duration-300 bg-background">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="text-5xl font-extrabold mb-6">Free<span className="text-lg text-gray-500 font-normal">/forever</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">1 active tontine group</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Up to 12 members</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Basic dashboard</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Email reminders</span></li>
              </ul>
              <Link href="/register" className="block text-center w-full py-4 rounded-full border-2 border-blue-950 dark:border-white font-bold hover:bg-blue-50 dark:hover:bg-white/5 transition-colors text-lg">
                Get Started
              </Link>
            </motion.div>
            
            {/* Pro Tier */}
            <motion.div variants={fadeUp} className="border-2 border-gold-400 rounded-3xl p-8 text-left shadow-2xl relative bg-background transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold-400 text-blue-950 px-6 py-1.5 rounded-full text-sm font-bold shadow-md">
                Recommended
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro Organizer</h3>
              <div className="text-5xl font-extrabold mb-6">$9<span className="text-lg text-gray-500 font-normal">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Unlimited active groups</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Unlimited members</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Delegated secretary roles</span></li>
                <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> <span className="font-medium">Automated Cron Reminders</span></li>
              </ul>
              <Link href="/register?plan=pro" className="block text-center w-full py-4 rounded-full bg-gradient-to-r from-blue-900 to-blue-950 dark:from-gray-100 dark:to-white text-white dark:text-blue-950 font-bold hover:shadow-lg transition-all text-lg hover:scale-[1.02]">
                Upgrade to Pro
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-100 py-12 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="Digital Tontine Logo" width={24} height={24} className="rounded-full shrink-0" />
              <span className="font-bold text-lg text-white">Digital Tontine</span>
            </div>
            <p className="text-sm text-blue-200 max-w-sm">
              Digitizing community savings groups for greater transparency, trust, and simplicity.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#how-it-works" className="hover:text-gold-400">How it works</Link></li>
              <li><Link href="#pricing" className="hover:text-gold-400">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-gold-400">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-blue-900/50 text-sm text-blue-300 text-center">
          <p>© {new Date().getFullYear()} Digital Tontine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
