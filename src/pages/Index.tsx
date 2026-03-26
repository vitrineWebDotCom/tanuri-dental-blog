import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/scroll-animation";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fffefc] via-[#fffdf9] to-[#fffcf6] flex flex-col items-center px-6 py-16">

      {/* Logo */}
      <div className="w-full flex justify-center mb-12">
        <img
          src="/assets/logo_header.png"
          alt="Odontologia Tanuri"
          className="h-16 md:h-28 object-contain"
        />
      </div>

      {/* Conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl flex flex-col items-center text-center space-y-10"
      >

        <ScrollAnimation delay={0}>
          {/* Título */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-snug md:leading-relaxed">
            Explore nosso blog e fique por dentro das novidades em odontologia
          </h1>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          {/* Descrição */}
          <p className="text-[#666666] text-lg md:text-xl leading-relaxed">
            Descubra artigos sobre saúde bucal, dicas práticas de cuidados e novidades da Odontologia Tanuri.
          </p>
        </ScrollAnimation>

        <ScrollAnimation delay={200}>
          {/* Lista de benefícios */}
          <ul className="space-y-4 text-[#666666]">
            <li className="flex items-center justify-center gap-2 text-lg md:text-xl">
              <span className="text-[#D4AF37] text-2xl">✔</span> Novidades sobre saúde bucal
            </li>
            <li className="flex items-center justify-center gap-2 text-lg md:text-xl">
              <span className="text-[#D4AF37] text-2xl">✔</span> Dicas e cuidados odontológicos
            </li>
            <li className="flex items-center justify-center gap-2 text-lg md:text-xl">
              <span className="text-[#D4AF37] text-2xl">✔</span> Cases e histórias de pacientes
            </li>
          </ul>
        </ScrollAnimation>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-6 mt-6">
          <Button
            onClick={() => navigate("/blog")}
            className="bg-[#D4AF37] hover:bg-[#b89230] text-white px-10 rounded-2xl text-lg md:text-xl font-semibold shadow-xl transition-all transform hover:scale-105 h-[60px] flex items-center justify-center"
          >
            Ver Artigos
          </Button>

          <Button
            onClick={() => window.location.href = "https://odontologia-tanuri-website-v10.vercel.app/"}
            variant="outline"
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#fff7e0] hover:text-[#b89230] px-10 rounded-2xl text-lg md:text-xl font-semibold shadow transition-all h-[60px] flex items-center justify-center"
          >
            Voltar ao Site
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

export default Index;