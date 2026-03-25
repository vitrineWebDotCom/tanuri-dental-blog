import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

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
      <section className="bg-cream py-16">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Blog</h1>
          <p className="mt-2 text-muted-foreground">Dicas, novidades e informações sobre saúde bucal</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}><CardHeader><Skeleton className="h-48 w-full rounded-lg" /></CardHeader><CardContent><Skeleton className="h-6 w-3/4" /><Skeleton className="mt-2 h-4 w-full" /></CardContent></Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {post.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <h2 className="font-display text-xl font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                        <span className="ml-auto">{(post as any).profiles?.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum post publicado ainda.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
