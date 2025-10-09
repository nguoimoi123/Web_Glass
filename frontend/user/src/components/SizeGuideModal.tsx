import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { getSizeGuide, getAllSizeGuides } from '../services/sizeGuideService';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
  sizeInfo?: any;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, categoryName }) => {
  const [sizeInfo, setSizeInfo] = useState<any | null>(null);
  const [allGuides, setAllGuides] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const load = async () => {
      try {
        if (categoryName) {
          const s = await getSizeGuide(categoryName);
          if (mounted) setSizeInfo(s);
        } else {
          const all = await getAllSizeGuides();
          if (mounted) setAllGuides(Array.isArray(all) ? all : []);
        }
      } catch (err) {
        console.error('Lỗi khi tải size guide', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isOpen, categoryName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md max-w-2xl w-full p-6 relative">
        <button className="absolute top-4 right-4" onClick={onClose}><XIcon /></button>
        <h3 className="text-lg font-medium mb-4">Size Guide {categoryName ? `- ${categoryName}` : ''}</h3>
        {categoryName ? (
          sizeInfo ? <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(sizeInfo, null, 2)}</pre> : <div>Loading...</div>
        ) : (
          <div className="space-y-3">
            {allGuides.length ? allGuides.map((g: any) => (
              <div key={g._id || g.categoryName} className="border rounded p-3">
                <div className="font-medium">{g.categoryName}</div>
                <div className="text-sm">{JSON.stringify(g)}</div>
              </div>
            )) : <div>No size guides available</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeGuideModal;
