import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Trash2, MessageSquare, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(name)")
        .eq("post_id", id!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("comments").insert({
        post_id: id!,
        user_id: user!.id,
        content: comment.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toast({ title: "Comentário adicionado!" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toast({ title: "Comentário removido" });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-3xl py-12">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="mt-4 h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-[#666666]">Post não encontrado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back link */}
      <div className="container max-w-3xl py-8 px-4 sm:px-0">
        <Link
          to="/blog"
          className="flex items-center gap-2 text-[#D4AF37] font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>
      </div>

      <article className="container max-w-3xl py-8 px-4 sm:px-0">
        {post.image_url && (
          <div className="mb-8 overflow-hidden rounded-2xl shadow-md">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#D4AF37]">
          {post.title}
        </h1>
        
        <div className="mt-3 flex items-center gap-4 text-sm text-[#666666]">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
          <span>{(post as any).profiles?.name}</span>
        </div>

        <div className="mt-6 text-[#1A1A1A] text-lg leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Comments */}
        <section className="mt-12 border-t pt-8">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#D4AF37]">
            <MessageSquare className="h-5 w-5 text-[#D4AF37]" />
            Comentários ({comments?.length ?? 0})
          </h2>

          {user && (
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (comment.trim()) addComment.mutate();
              }}
            >
              <Textarea
                placeholder="Escreva um comentário..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                type="submit"
                className="mt-3 bg-[#D4AF37] hover:bg-[#c69c30]"
                disabled={addComment.isPending || !comment.trim()}
              >
                {addComment.isPending ? "Enviando..." : "Comentar"}
              </Button>
            </form>
          )}

          {!user && (
            <p className="mt-4 text-sm text-[#666666]">
              Faça <Link to="/login" className="text-[#D4AF37] hover:underline">login</Link> para comentar.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {comments?.map((c) => (
              <div key={c.id} className="rounded-2xl border bg-white shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1A1A1A]">{(c as any).profiles?.name}</span>
                  <div className="flex items-center gap-2 text-xs text-[#666666]">
                    <span>{format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}</span>
                    {user?.id === c.user_id && (
                      <button
                        onClick={() => deleteComment.mutate(c.id)}
                        className="hover:text-destructive text-[#D4AF37]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-[#1A1A1A] text-sm">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default PostPage;