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
import { Download, Loader2, CheckCircle, Mail } from "lucide-react";

interface FichaTecnicaModalProps {
  productoNombre: string;
  productoSlug: string;
  fichaTecnicaNombre: string;
}

export function FichaTecnicaModal({
  productoNombre,
  productoSlug,
  fichaTecnicaNombre,
}: FichaTecnicaModalProps) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-ficha-tecnica", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          telefono,
          pais,
          productoSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setNombre("");
        setApellido("");
        setEmail("");
        setTelefono("");
        setPais("");
        setIsSuccess(false);
        setError("");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="group w-full">
          <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
          {fichaTecnicaNombre}
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
              <DialogTitle className="text-center">
                Ficha técnica enviada
              </DialogTitle>
              <DialogDescription className="text-center">
                Revisá tu casilla de correo en <strong>{email}</strong>. Te
                enviamos el enlace para descargar la ficha técnica de{" "}
                <strong>{productoNombre}</strong>.
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
                Descargar ficha técnica
              </DialogTitle>
              <DialogDescription className="text-center">
                Completá tus datos y te enviaremos la ficha técnica de{" "}
                <strong>{productoNombre}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    type="text"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="País"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
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
                <Button type="submit" disabled={isLoading || !email || !nombre || !apellido || !telefono || !pais}>
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
