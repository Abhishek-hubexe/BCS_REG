import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Filter, Search, Link as LinkIcon, Check, Copy } from 'lucide-react';
import Badge from '../common/Badge';

export default function AdminMediaLibrary({
  media = [],
  clubs = [],
  onMediaUploaded,
  onMediaDeleted
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Club Logos', 'Cover Images', 'Gallery Images', 'Event Images'];

  const filteredMedia = media.filter((m) => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.club_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory === 'All' ? 'Cover Images' : selectedCategory);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (onMediaUploaded) onMediaUploaded(data.media);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Institutional Media Library</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Centralized assets repository for society logos, editorial photography, and event collateral.
          </p>
        </div>

        <label className="cursor-pointer px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Asset</span>
          <input type="file" accept="image/*" onChange={handleUploadFile} className="hidden" />
        </label>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="editorial-card p-4 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#C25E42] text-white'
                  : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
            className="editorial-input text-xs py-1.5"
          />
        </div>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <div key={item.id} className="editorial-card overflow-hidden bg-white group flex flex-col justify-between">
            <div className="h-32 w-full bg-[#FAF8F5] relative overflow-hidden flex items-center justify-center p-2">
              <img src={item.url} alt={item.name} className="max-h-full max-w-full object-contain" />
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="neutral" size="xs">{item.size || 'IMG'}</Badge>
              </div>
            </div>

            <div className="p-3 border-t border-[#E7E0D8] space-y-1">
              <span className="text-[11px] font-bold text-[#1C1917] truncate block" title={item.name}>
                {item.name}
              </span>
              <span className="text-[10px] text-[#78716C] block truncate">{item.club_name || item.category}</span>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item.id, item.url)}
                  className="text-[10px] text-[#C25E42] hover:underline flex items-center gap-1"
                >
                  {copiedId === item.id ? <Check className="w-3 h-3 text-[#5D7A68]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
