import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, Heart, Shield, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Excelência em Odontologia
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Seu sorriso merece o{" "}
              <span className="text-primary">melhor cuidado</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Na Odontologia Tanuri, unimos tecnologia de ponta e atendimento humanizado
              para transformar sorrisos e vidas. Conheça nosso blog e fique por dentro
              das novidades em saúde bucal.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/blog">
                  Acessar Blog <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">
            Por que escolher a <span className="text-primary">Tanuri</span>?
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Heart, title: "Atendimento Humanizado", desc: "Cada paciente é único. Tratamentos personalizados com acolhimento e empatia." },
              { icon: Shield, title: "Segurança e Qualidade", desc: "Protocolos rigorosos de biossegurança e materiais de alta qualidade." },
              { icon: Sparkles, title: "Tecnologia Avançada", desc: "Equipamentos de última geração para diagnósticos precisos e tratamentos eficientes." },
            ].map((f) => (
              <div key={f.title} className="group rounded-xl border bg-card p-8 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
