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
      <section className="bg-cream py-10">
        <div className="container flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Painel Admin</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Post
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
          <div className="space-y-4">
            {posts?.map((post) => (
              <Card key={post.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-card-foreground">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post.created_at), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deletePost.mutate(post.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
