"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "task-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({
  onUpload,
  currentUrl,
}: {
  onUpload: (url: string | null) => void;
  currentUrl: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Apenas imagens sao permitidas");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Imagem deve ter no maximo 5MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        setPreview(null);
        onUpload(null);
        return;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setPreview(data.publicUrl);
      onUpload(data.publicUrl);
    } catch {
      setError("Falha no upload");
      setPreview(null);
      onUpload(null);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    setError(null);
    onUpload(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={200}
            className="w-full h-36 object-cover"
            unoptimized
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            className="absolute top-2 right-2 shadow-md"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-5 text-sm transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Upload className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <span className="font-medium text-foreground text-xs">
              {uploading ? "Enviando..." : "Adicionar imagem"}
            </span>
            <p className="text-[11px] text-muted-foreground">PNG, JPG ate 5MB</p>
          </div>
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
