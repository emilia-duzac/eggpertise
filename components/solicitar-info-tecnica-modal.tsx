"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileQuestion, Loader2, CheckCircle, Mail } from "lucide-react";

interface SolicitarInfoTecnicaModalProps {
  productoNombre: string;
  productoSlug: string;
}

export function SolicitarInfoTecnicaModal({
  productoNombre,
  productoSlug,
}: SolicitarInfoTecnicaModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/solicitar-info-tecnica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, telefono, pais, empresa, productoSlug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setEmail("");
        setTelefono("");
        setPais("");
        setEmpresa("");
        setIsSuccess(false);
        setError("");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="group w-full">
          <FileQuestion className="h-4 w-4 mr-2" />
          Solicitar Información Técnica
        </Button>
      </DialogTrigger>
      {/*
        `notranslate` is required, not cosmetic: Google Translate rewrites text
        nodes in place, and the isSuccess swap below then makes React's
        insertBefore fail against a DOM it no longer recognises, crashing the
        whole page. Excluding this subtree keeps the reconciliation safe.
      */}
      <DialogContent className="notranslate sm:max-w-md" translate="no">
        {isSuccess ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-center">Solicitud enviada</DialogTitle>
              <DialogDescription className="text-center">
                Recibimos tu solicitud de información técnica sobre{" "}
                <strong>{productoNombre}</strong>. Nos pondremos en contacto a
                la brevedad.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={() => handleOpenChange(false)}>Cerrar</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center">
                Solicitar Información Técnica
              </DialogTitle>
              <DialogDescription className="text-center">
                Completá tus datos y te contactaremos con información técnica
                sobre <strong>{productoNombre}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="py-4 space-y-3">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  type="tel"
                  placeholder="Teléfono (con cód. de área)"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  type="text"
                  placeholder="País"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  type="text"
                  placeholder="Empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !email || !telefono || !pais || !empresa}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
