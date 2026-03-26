import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bem-vindo de volta!" });
      navigate("/blog");
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-to-br from-white via-white to-[#F5F5F5] min-h-[80vh] flex items-center justify-center py-12 px-8 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            Bem-vindo <span className="text-[#D4AF37]">de volta!</span>
          </h1>
          <p className="mt-4 mb-8 text-lg text-[#666666]">
            Acesse sua conta na Odontologia Tanuri
          </p>

          <Card className="overflow-hidden">
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 mt-6">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c69c30]" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <p className="mt-4 text-sm text-[#666666]">
                Não tem conta?{" "}
                <Link to="/register" className="text-[#D4AF37] hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Login;