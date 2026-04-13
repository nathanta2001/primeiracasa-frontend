import { Button, Image, Space } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { compressImage, normalizeImageSrc } from '../utils/imageUtils';

interface ImageCaptureProps {
  value?: string;
  onChange: (base64: string) => void;
}


export const ImageCapture = ({ value, onChange }: ImageCaptureProps) => {
  const imageSrc = normalizeImageSrc(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Raw = reader.result as string;
        // Aplica a compressão antes de enviar para o form
        const compressed = await compressImage(base64Raw);
        onChange(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Space orientation="vertical" style={{ width: '100%', alignItems: 'center' }}>
      {imageSrc && <Image src={imageSrc} width={200} style={{ borderRadius: 8 }} />}
      <Button icon={<CameraOutlined />} onClick={() => document.getElementById('camera-input')?.click()}>
        {value ? 'Alterar Foto' : 'Tirar Foto'}
      </Button>
      <Button onClick={() => document.getElementById('gallery-input')?.click()}>
        Escolher da Galeria
      </Button>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="camera-input"
      />

      {/* Input específico para Galeria  */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        id="gallery-input"
      />
    </Space>
  );
};
