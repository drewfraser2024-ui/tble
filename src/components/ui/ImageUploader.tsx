'use client';

import { useCallback, useRef, useState } from 'react';
import { MAX_IMAGES, MAX_IMAGE_SIZE_MB } from '@/lib/constants';

interface ImageFile {
  file: File;
  preview: string;
  type: 'food' | 'establishment' | 'general';
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  category: 'restaurant' | 'business';
}

export default function ImageUploader({ images, onChange, category }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newImages: ImageFile[] = [];
      const remaining = MAX_IMAGES - images.length;

      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) continue;

        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          type: category === 'restaurant' ? 'food' : 'general',
        });
      }

      onChange([...images, ...newImages]);
    },
    [images, onChange, category]
  );

  function removeImage(index: number) {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    onChange(updated);
  }

  function updateImageType(index: number, type: ImageFile['type']) {
    const updated = [...images];
    updated[index] = { ...updated[index], type };
    onChange(updated);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-turquoise bg-turquoise/5'
            : 'border-gray-200 hover:border-turquoise-light'
        }`}
      >
        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-500">
          Drag & drop images or <span className="text-turquoise font-medium">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max {MAX_IMAGES} images, {MAX_IMAGE_SIZE_MB}MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-100">
              <img
                src={img.preview}
                alt={`Upload ${i + 1}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <select
                value={img.type}
                onChange={(e) => updateImageType(i, e.target.value as ImageFile['type'])}
                className="absolute bottom-0 left-0 right-0 text-xs bg-black/60 text-white px-2 py-1 border-0 focus:outline-none"
              >
                {category === 'restaurant' ? (
                  <>
                    <option value="food">Food</option>
                    <option value="establishment">Establishment</option>
                  </>
                ) : (
                  <>
                    <option value="general">General</option>
                    <option value="establishment">Store</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
