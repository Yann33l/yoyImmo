import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/services/api';

export function ExportButton() {
  const [exporting, setExporting] = useState(false);
  const { showToast, showError } = useToast();

  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await api.post('/backup/export', null, {
        responseType: 'blob',
      });

      // Trigger browser download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `yoyimmo-backup-${new Date().toISOString().split('T')[0]}.zip`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast({
        title: 'Export successful',
        description: 'Backup downloaded successfully.',
      });
    } catch (error) {
      showError('Export failed', 'Unable to create backup. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={exporting} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      {exporting ? 'Exporting...' : 'Export Backup'}
    </Button>
  );
}
