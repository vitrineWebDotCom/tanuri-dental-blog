import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { format } from "date-fns";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);

  // Redirect non-admin
  if (!loading && (!user || !isAdmin)) {
    navigate("/");
    return null;
  }

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const getCommentsByPost = async (postId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user:profiles (name)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data: comments } = useQuery({
    queryKey: ["comments", openCommentsPostId],
    queryFn: () => getCommentsByPost(openCommentsPostId!),
    enabled: !!openCommentsPostId,
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const savePost = useMutation({
    mutationFn: async () => {
      let imageUrl: string | null = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      if (editingId) {
        const updates: any = { title, content };
        if (imageUrl) updates.image_url = imageUrl;
        const { error } = await supabase.from("posts").update(updates).eq("id", editingId);
        if (error) throw error;
      } else {
        const payload: any = { title, content, author_id: user!.id };
        if (imageUrl) payload.image_url = imageUrl;
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      resetForm();
      toast({ title: editingId ? "Post atualizado!" : "Post criado!" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "Post excluído" });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageFile(null);
  };

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setShowForm(true);
  };

  if (loading) return null;

  return (
    <Layout>
      <section className="bg-gradient-to-br from-white via-white to-[#F5F5F5] py-12 lg:py-20 px-8 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-7x1 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            Painel <span className="text-[#D4AF37]">Admin</span>
          </h1>
          <p className="mt-4 mb-8 text-lg text-[#666666]">
            Gerencie posts e comentários do blog odontológico de forma rápida e intuitiva.
          </p>
          
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-6 w-4" /> Novo Post
            </Button>
          )}
        </div>
      </section>

      <div className="container py-8">
        {showForm && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">{editingId ? "Editar Post" : "Novo Post"}</CardTitle>
              <button onClick={resetForm}><X className="h-5 w-5 text-muted-foreground" /></button>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); savePost.mutate(); }}
              >
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[200px]" required />
                </div>
                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                </div>
                <Button type="submit" disabled={savePost.isPending}>
                  {savePost.isPending ? "Salvando..." : editingId ? "Atualizar" : "Publicar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent>
                  <h3 className="font-display text-lg font-semibold mb-1 text-primary">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {format(new Date(post.created_at), "dd/MM/yyyy HH:mm")}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(post)}>
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePost.mutate(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Excluir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setOpenCommentsPostId(openCommentsPostId === post.id ? null : post.id)
                      }
                    >
                      Ver comentários
                    </Button>
                  </div>

                  {openCommentsPostId === post.id && (
                    <div className="mt-2 p-2 border rounded-lg">
                      {comments?.length === 0 && (
                        <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>
                      )}
                      {comments?.map((c) => (
                        <div key={c.id} className="mb-2 border-b pb-2">
                          <p className="text-sm font-semibold">{c.user?.name ?? "Usuário"}</p>
                          <p className="text-sm">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {posts?.length === 0 && <p className="text-center text-muted-foreground">Nenhum post ainda.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;