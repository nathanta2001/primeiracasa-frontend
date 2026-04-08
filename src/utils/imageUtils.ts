export const compressImage = (base64Str: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Converte para JPEG com 70% de qualidade para reduzir o tamanho
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export const normalizeImageSrc = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();

  if (
    normalizedValue.startsWith('data:') ||
    normalizedValue.startsWith('http://') ||
    normalizedValue.startsWith('https://') ||
    normalizedValue.startsWith('blob:') ||
    normalizedValue.startsWith('/')
  ) {
    return normalizedValue;
  }

  return `data:image/jpeg;base64,${normalizedValue}`;
};
