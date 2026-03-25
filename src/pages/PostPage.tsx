import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";

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
          <p className="text-muted-foreground">Post não encontrado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container max-w-3xl py-12">
        {post.image_url && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img src={post.image_url} alt={post.title} className="w-full object-cover" />
          </div>
        )}
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
          <span>•</span>
          <span>{(post as any).profiles?.name}</span>
        </div>
        <div className="mt-8 whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>

        {/* Comments */}
        <section className="mt-12 border-t pt-8">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <MessageSquare className="h-5 w-5 text-primary" />
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
              <Button type="submit" className="mt-3" disabled={addComment.isPending || !comment.trim()}>
                {addComment.isPending ? "Enviando..." : "Comentar"}
              </Button>
            </form>
          )}

          {!user && (
            <p className="mt-4 text-sm text-muted-foreground">
              Faça <a href="/login" className="text-primary hover:underline">login</a> para comentar.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {comments?.map((c) => (
              <div key={c.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{(c as any).profiles?.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}
                    </span>
                    {user?.id === c.user_id && (
                      <button onClick={() => deleteComment.mutate(c.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-foreground">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default PostPage;
