import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { ScrollAnimation } from "@/components/scroll-animation"// se tiver componente de animação
import { ArrowRight } from "lucide-react";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-white to-[#F5F5F5] py-12 lg:py-20 px-8 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
              Blog <span className="text-[#D4AF37]">Odontologia Tanuri</span>
            </h1>
            <p className="mt-6 text-lg text-[#666666]">
              Dicas, informações e novidades sobre saúde bucal e tratamentos odontológicos.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="bg-white py-16 lg:py-24 px-8 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-gray-100 h-72"></div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <ScrollAnimation key={post.id} delay={index * 100}>
                  <Link
                    to={`/blog/${post.id}`}
                    className="group block overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    {post.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-[#666666]">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                        </span>
                        <span className="ml-auto">{(post as any).profiles?.name}</span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-[#666666] line-clamp-3">
                        {post.content}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-[#D4AF37]">
                        Ler mais
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#666666]">
              Nenhum post publicado ainda.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;