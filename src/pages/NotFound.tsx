import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Erro 404: Usuário tentou acessar rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="bg-gradient-to-br from-white via-white to-[#F5F5F5] min-h-screen flex items-center justify-center px-8 sm:px-12 lg:px-16">
        <div className="text-center">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-[#D4AF37] mb-4">404</h1>
          <p className="text-xl sm:text-2xl text-[#1A1A1A] mb-2">
            Página não encontrada
          </p>
          <p className="text-md sm:text-lg text-[#666666] mb-6">
            A rota <span className="font-mono text-[#D4AF37]">{location.pathname}</span> não existe ou foi removida.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#c69c30] text-white font-semibold rounded-lg transition"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;