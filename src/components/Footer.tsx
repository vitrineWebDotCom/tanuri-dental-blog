const Footer = () => (
  <footer className="border-t bg-card py-8">
    <div className="container text-center">
      <p className="font-display text-lg font-semibold text-foreground">
        Odontologia <span className="text-primary">Tanuri</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Cuidando do seu sorriso com excelência e dedicação.
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Odontologia Tanuri. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
