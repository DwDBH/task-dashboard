"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
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
      setError("Apenas imagens são permitidas");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Imagem deve ter no máximo 5MB");
      return;
    }

    // Show local preview immediately
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
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={200}
            className="w-full h-32 object-cover"
            unoptimized
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            className="absolute top-1.5 right-1.5"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Enviando..." : "Adicionar imagem"}
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
