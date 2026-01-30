import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/services/api';

export function RestorePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast, showError } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/backup/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast({
        title: 'Restore successful',
        description: 'Your data has been restored successfully.',
      });

      // Reload app to reflect restored data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      showError('Import failed', 'Please check your backup file and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('skip-restore', 'true');
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Restore from Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload a backup file to restore your data, or start fresh.
          </p>

          <Input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? 'Importing...' : 'Import Backup'}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={uploading}
            >
              Start Fresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
