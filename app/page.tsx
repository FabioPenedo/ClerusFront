"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Shield, Clock3 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";
import {
  hero,
  problem,
  solution,
  features,
  plans,
  howItWorks,
  testimonials,
  faq
} from "@/lib/content";

export default function Page() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const openLoginModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f9fc] via-white to-[#eef2f8] text-foreground">
      <Navbar 
        onSignupClick={() => openSignupModal()}
        onLoginClick={() => openLoginModal()}
      />
      

      <Section className="pt-12 md:pt-16">
        <div className="section-grid">
          <div className="space-y-8">
            <div className="badge">
              <Sparkles className="h-4 w-4 text-primary" />
              {hero.eyebrow}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {hero.headline}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {hero.subheadline}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => setIsSignupModalOpen(true)}>
                {hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href={hero.secondaryCta.href as any}>{hero.secondaryCta.label}</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {hero.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 shadow-soft"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass relative overflow-hidden rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transparência em tempo real</p>
                <h3 className="text-2xl font-semibold mt-2">Fluxo financeiro</h3>
              </div>
              <Badge variant="outline" className="text-primary border-primary/30">
                Seguro
              </Badge>
            </div>
            <div className="mt-6 space-y-4">
              {hero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-white/90 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-xl font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-primary">Relatório mensal</p>
              <p className="text-sm text-muted-foreground mt-1">
                "Visualize entradas, saídas e saldo organizados por categorias para apresentar à diretoria."
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="problem" className="bg-white">
        <SectionHeading
          eyebrow="O que trava a gestão hoje"
          title={problem.title}
          subtitle="Quando a gestão depende de planilhas e memória, a confiança fica em risco."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {problem.bullets.map((item) => (
            <Card key={item} className="glass border-dashed">
              <CardContent className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Clock3 className="h-4 w-4" />
                </div>
                <p className="text-base text-foreground/90 leading-relaxed">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="solution">
        <SectionHeading
          eyebrow="Solução"
          title={solution.title}
          subtitle={solution.description}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solution.pillars.map((pillar) => (
            <Card key={pillar.title}>
              <CardHeader>
                <CardTitle>{pillar.title}</CardTitle>
                <CardDescription>{pillar.copy}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="features" className="bg-white">
        <SectionHeading
          eyebrow="Funcionalidades principais"
          title="Tudo que sua igreja precisa para uma gestão completa"
          subtitle="Membros, finanças, anúncios e relatórios em uma plataforma simples e organizada."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:-translate-y-1 transition">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="w-fit" variant="outline">
                    {feature.tag}
                  </Badge>
                  {feature.comingSoon && (
                    <Badge className="w-fit bg-amber-100 text-amber-800 border-amber-200" variant="outline">
                      Em breve
                    </Badge>
                  )}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="pricing">
        <SectionHeading
          eyebrow="Planos"
          title="Comece sem risco e evolua com IA quando precisar"
          subtitle="Sem burocracia. Escolha o plano ideal para sua igreja e mude quando quiser."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlight
                  ? "border-primary/40 shadow-soft"
                  : "border-border/80 bg-white"
              }
            >
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlight ? (
                    <Badge className="bg-primary text-white">Mais escolhido</Badge>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">{plan.price}</span>
                  {!plan.price.includes("0") ? (
                    <span className="text-sm text-muted-foreground">/igreja</span>
                  ) : null}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant={plan.highlight ? "default" : "secondary"}
                  onClick={() => openSignupModal()}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="how-it-works" className="bg-white">
        <SectionHeading
          eyebrow="Como funciona"
          title="Três passos para tirar a gestão do papel"
          subtitle="Configure, automatize e apresente resultados em uma semana."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <Card key={step.title} className="relative">
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {index + 1}
              </span>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.copy}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="testimonials">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Confiança de quem lidera"
          subtitle="Pastores e tesoureiros que já sentiram a clareza no dia a dia."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="bg-white">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-foreground/90">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="faq" className="bg-white">
        <SectionHeading
          eyebrow="FAQ"
          title="Perguntas frequentes"
          subtitle="Tudo transparente. Se precisar de algo, fale com o time."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faq.map((item) => (
            <Card key={item.question}>
              <CardHeader>
                <CardTitle>{item.question}</CardTitle>
                <CardDescription>{item.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="py-16 md:py-20">
        <div className="glass gradient-border relative overflow-hidden rounded-3xl">
          <div className="relative z-10 flex flex-col gap-6 px-8 py-12 md:px-14 md:py-14">
            <div className="badge">Pronto para começar</div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              Organize membros, finanças e anúncios da sua igreja em um só lugar.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comece grátis com até 50 membros. Cadastre sua igreja, organize as finanças por categorias e tenha relatórios transparentes para a liderança.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => openSignupModal()}>
                Começar gratuito
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="#how-it-works">Ver passo a passo</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={openSignupModal}
      />

      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={openLoginModal}
      />
    </main>
  );
}
