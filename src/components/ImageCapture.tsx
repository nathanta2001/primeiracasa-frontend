import { Button, Image, Space } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

interface ImageCaptureProps {
  value?: string;
  onChange: (base64: string) => void;
}


export const ImageCapture = ({ value, onChange }: ImageCaptureProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
      {value && <Image src={value} width={200} style={{ borderRadius: 8 }} />}
      <Button icon={<CameraOutlined />} onClick={() => document.getElementById('camera-input')?.click()}>
        {value ? 'Alterar Foto' : 'Tirar Foto'}
      </Button>
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Space>
  );
};