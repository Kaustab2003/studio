
'use client';

import { useState, useRef, type DragEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PhotoUploaderProps = {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
};

export default function PhotoUploader({ onImageUpload, imagePreview }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onImageUpload(files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div
          className={cn(
            "relative w-full aspect-video rounded-lg border-2 border-dashed flex flex-col justify-center items-center text-center transition-colors duration-300",
            isDragging ? "border-accent bg-accent/10" : "border-border",
            imagePreview ? "border-solid" : ""
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Uploaded preview"
                fill
                style={{objectFit: "contain"}}
                className="rounded-lg p-2"
                data-ai-hint="user image"
              />
              <div className="absolute bottom-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="shadow-lg">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground p-4">
              <UploadCloud className="h-12 w-12" />
              <p className="font-semibold font-headline">Drag & drop a photo here</p>
              <p className="text-sm">or</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept="image/*"
          />
        </div>
      </CardContent>
    </Card>
  );
}
