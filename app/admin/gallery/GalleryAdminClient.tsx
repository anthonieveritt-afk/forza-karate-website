'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Album {
  id: number;
  name: string;
  category: string;
  description: string | null;
  coverPhotoUrl: string | null;
  photoCount: number;
  active: boolean;
  createdAt: string;
}

interface Photo {
  id: number;
  albumId: number;
  filename: string;
  url: string;
  caption: string | null;
}

const CATEGORIES = ['club', 'competition', 'grading', 'course', 'event', 'other'] as const;
const CAT_LABELS: Record<string, string> = {
  club: 'Club', competition: 'Competition', grading: 'Grading',
  course: 'Course', event: 'Event', other: 'Other',
};
const CAT_COLOURS: Record<string, string> = {
  club: '#3b82f6', competition: '#ef4444', grading: '#f59e0b',
  course: '#6366f1', event: '#a855f7', other: '#6b7280',
};

const API = '/api/gallery-proxy';

// ─── Component ────────────────────────────────────────────────────────────────

export default function GalleryAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', category: 'club', description: '' });
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);
  const [deletingAlbumId, setDeletingAlbumId] = useState<number | null>(null);
  const [confirmDeleteAlbum, setConfirmDeleteAlbum] = useState<number | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/albums`);
      const data = await res.json();
      setAlbums(Array.isArray(data) ? data : []);
    } catch { setError('Failed to load albums'); }
    finally { setLoading(false); }
  }, []);

  const loadPhotos = useCallback(async (albumId: number) => {
    setPhotosLoading(true);
    try {
      const res = await fetch(`${API}/albums/${albumId}/photos`);
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch { setPhotos([]); }
    finally { setPhotosLoading(false); }
  }, []);

  useEffect(() => { loadAlbums(); }, [loadAlbums]);

  // ── Create album ────────────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/albums`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name.trim(),
          category: createForm.category,
          description: createForm.description.trim() || undefined,
        }),
      });
      const album = await res.json();
      if (res.ok) {
        setAlbums(prev => [album, ...prev]);
        setShowCreateModal(false);
        setCreateForm({ name: '', category: 'club', description: '' });
      } else {
        setError(album.error ?? 'Failed to create album');
      }
    } catch { setError('Failed to create album'); }
    finally { setCreating(false); }
  };

  // ── Delete album ────────────────────────────────────────────────────────────

  const handleDeleteAlbum = async (id: number) => {
    setDeletingAlbumId(id);
    try {
      const res = await fetch(`${API}/albums/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlbums(prev => prev.filter(a => a.id !== id));
        if (selectedAlbum?.id === id) setSelectedAlbum(null);
      } else {
        setError('Failed to delete album');
      }
    } catch { setError('Failed to delete album'); }
    finally { setDeletingAlbumId(null); setConfirmDeleteAlbum(null); }
  };

  // ── Toggle visibility ───────────────────────────────────────────────────────

  const handleToggleActive = async (album: Album) => {
    try {
      const res = await fetch(`${API}/albums/${album.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !album.active }),
      });
      const updated = await res.json();
      if (res.ok) {
        setAlbums(prev => prev.map(a => a.id === album.id ? updated : a));
        if (selectedAlbum?.id === album.id) setSelectedAlbum(updated);
      }
    } catch { setError('Failed to update album'); }
  };

  // ── Upload photos ───────────────────────────────────────────────────────────

  const uploadFiles = async (files: FileList | File[]) => {
    if (!selectedAlbum) return;
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!arr.length) return;

    setUploading(true);
    setUploadProgress({ done: 0, total: arr.length });

    let uploaded = 0;
    for (const file of arr) {
      try {
        const fd = new FormData();
        fd.append('photo', file);
        const res = await fetch(`${API}/albums/${selectedAlbum.id}/photos`, {
          method: 'POST',
          body: fd,
        });
        const photo = await res.json();
        if (res.ok) {
          setPhotos(prev => [...prev, photo]);
          setAlbums(prev => prev.map(a => a.id === selectedAlbum.id
            ? { ...a, photoCount: a.photoCount + 1, coverPhotoUrl: a.coverPhotoUrl ?? photo.url }
            : a));
          uploaded++;
        }
      } catch { /* skip individual failures */ }
      setUploadProgress({ done: uploaded, total: arr.length });
    }

    setUploading(false);
    // Refresh album to get updated photoCount / cover
    loadAlbums();
  };

  // ── Delete photo ────────────────────────────────────────────────────────────

  const handleDeletePhoto = async (photo: Photo) => {
    setDeletingPhotoId(photo.id);
    try {
      const res = await fetch(`${API}/photos/${photo.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photo.id));
        setAlbums(prev => prev.map(a => a.id === photo.albumId
          ? { ...a, photoCount: Math.max(0, a.photoCount - 1) }
          : a));
      }
    } catch { setError('Failed to delete photo'); }
    finally { setDeletingPhotoId(null); }
  };

  // ── Open album ──────────────────────────────────────────────────────────────

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    loadPhotos(album.id);
  };

  // ── Drag & drop ─────────────────────────────────────────────────────────────

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  const S: Record<string, React.CSSProperties> = {
    page:    { minHeight: '100vh', background: '#0f0f0f', color: '#f5f5f5', fontFamily: 'system-ui, sans-serif', padding: '32px 24px' },
    card:    { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 },
    btn:     { background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    btnGray: { background: '#2a2a2a', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 18px', fontSize: 14, cursor: 'pointer' },
    input:   { width: '100%', background: '#222', color: '#f5f5f5', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  };

  return (
    <div style={S.page}>

      {/* ── Create album modal ─────────────────────────────────────────────── */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ ...S.card, width: '100%', maxWidth: 440, padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Album</h2>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Album Name *</label>
                <input required style={S.input} placeholder="e.g. BKF 4 Nations 2025" value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Category *</label>
                <select required style={S.input} value={createForm.category} onChange={e => setCreateForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Description</label>
                <textarea style={{ ...S.input, height: 72, resize: 'vertical' }} placeholder="Optional description…" value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ ...S.btn, flex: 1 }} disabled={creating}>{creating ? 'Creating…' : 'Create Album'}</button>
                <button type="button" style={S.btnGray} onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #ef444440', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: 14 }}>❌ {error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>
      )}

      {/* ── Album view ─────────────────────────────────────────────────────── */}
      {selectedAlbum ? (
        <>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedAlbum(null)} style={{ ...S.btnGray, padding: '8px 14px' }}>← Back</button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>{selectedAlbum.name}</h1>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: (CAT_COLOURS[selectedAlbum.category] ?? '#888') + '25', color: CAT_COLOURS[selectedAlbum.category] ?? '#888', border: `1px solid ${CAT_COLOURS[selectedAlbum.category] ?? '#888'}50` }}>
                  {CAT_LABELS[selectedAlbum.category] ?? selectedAlbum.category}
                </span>
                <span style={{ fontSize: 12, color: selectedAlbum.active ? '#22c55e' : '#555', fontWeight: 700 }}>
                  {selectedAlbum.active ? '● Live' : '○ Hidden'}
                </span>
              </div>
              <p style={{ color: '#888', fontSize: 13, marginTop: 3 }}>{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => handleToggleActive(selectedAlbum)} style={{ ...S.btnGray, fontSize: 13 }}>
              {selectedAlbum.active ? '🙈 Hide Album' : '👁 Show Album'}
            </button>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#dc2626' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
              background: dragging ? 'rgba(220,38,38,0.06)' : '#141414', marginBottom: 24,
              transition: 'all 0.15s',
            }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => e.target.files && uploadFiles(e.target.files)} />
            {uploading ? (
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                <p style={{ color: '#f5f5f5', fontWeight: 700 }}>Uploading {uploadProgress.done}/{uploadProgress.total}…</p>
                <div style={{ height: 6, background: '#333', borderRadius: 3, margin: '12px auto', maxWidth: 240 }}>
                  <div style={{ height: '100%', background: '#dc2626', borderRadius: 3, width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                <p style={{ color: '#f5f5f5', fontWeight: 700, fontSize: 15 }}>Drop images here or tap to select</p>
                <p style={{ color: '#888', fontSize: 13, marginTop: 4 }}>JPG, PNG, WebP — up to 20 MB each — multiple files supported</p>
              </>
            )}
          </div>

          {/* Photo grid */}
          {photosLoading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: 48 }}>Loading photos…</p>
          ) : photos.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center', padding: 48 }}>No photos yet — upload some above.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1/1', background: '#1a1a1a' }}>
                  <Image src={photo.url} alt={photo.caption ?? photo.filename} fill style={{ objectFit: 'cover' }} sizes="200px" unoptimized />
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    disabled={deletingPhotoId === photo.id}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none',
                      borderRadius: '50%', width: 28, height: 28, fontSize: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: deletingPhotoId === photo.id ? 0.5 : 1,
                    }}
                    title="Delete photo"
                  >
                    {deletingPhotoId === photo.id ? '…' : '×'}
                  </button>
                  {photo.caption && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '12px 8px 6px', fontSize: 10, color: '#ddd' }}>
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>

      ) : (
        /* ── Album list view ───────────────────────────────────────────────── */
        <>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <Link href="/admin" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>← Admin</Link>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>Gallery Admin</h1>
              <p style={{ color: '#888', fontSize: 14, marginTop: 3 }}>Create albums, upload photos, manage visibility</p>
            </div>
            <button style={S.btn} onClick={() => setShowCreateModal(true)}>+ New Album</button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Total Albums', val: albums.length, color: '#3b82f6' },
              { label: 'Live Albums',  val: albums.filter(a => a.active).length, color: '#22c55e' },
              { label: 'Total Photos', val: albums.reduce((s, a) => s + a.photoCount, 0), color: '#f59e0b' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ ...S.card, padding: 16, textAlign: 'center' }}>
                <div style={{ color, fontSize: 26, fontWeight: 900 }}>{val}</div>
                <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Albums grid */}
          {loading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: 48 }}>Loading albums…</p>
          ) : albums.length === 0 ? (
            <div style={{ ...S.card, padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
              <p style={{ color: '#f5f5f5', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No albums yet</p>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Create your first album to start building the gallery.</p>
              <button style={S.btn} onClick={() => setShowCreateModal(true)}>+ Create Album</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {albums.map(album => (
                <div key={album.id} style={{ ...S.card, overflow: 'hidden', opacity: album.active ? 1 : 0.6 }}>
                  {/* Cover */}
                  <div
                    style={{ position: 'relative', aspectRatio: '16/9', background: '#111', cursor: 'pointer' }}
                    onClick={() => openAlbum(album)}
                  >
                    {album.coverPhotoUrl ? (
                      <Image src={album.coverPhotoUrl} alt={album.name} fill style={{ objectFit: 'cover' }} sizes="320px" unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🖼</div>
                    )}
                    {!album.active && (
                      <div style={{ position: 'absolute', top: 8, left: 8, background: '#111', color: '#888', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #333' }}>HIDDEN</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <button onClick={() => openAlbum(album)} style={{ background: 'none', border: 'none', color: '#f5f5f5', fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                        {album.name}
                      </button>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, flexShrink: 0, background: (CAT_COLOURS[album.category] ?? '#888') + '25', color: CAT_COLOURS[album.category] ?? '#888', border: `1px solid ${CAT_COLOURS[album.category] ?? '#888'}50` }}>
                        {CAT_LABELS[album.category] ?? album.category}
                      </span>
                    </div>
                    {album.description && <p style={{ color: '#888', fontSize: 12, marginBottom: 6 }}>{album.description}</p>}
                    <p style={{ color: '#555', fontSize: 12, marginBottom: 12 }}>{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openAlbum(album)} style={{ ...S.btn, flex: 1, padding: '7px 12px', fontSize: 12, background: '#222', color: '#f5f5f5' }}>
                        Open →
                      </button>
                      <button onClick={() => handleToggleActive(album)} style={{ ...S.btnGray, padding: '7px 12px', fontSize: 12 }} title={album.active ? 'Hide from gallery' : 'Show in gallery'}>
                        {album.active ? '🙈' : '👁'}
                      </button>
                      {confirmDeleteAlbum === album.id ? (
                        <span style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => handleDeleteAlbum(album.id)} disabled={deletingAlbumId === album.id} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                            {deletingAlbumId === album.id ? '…' : 'Delete'}
                          </button>
                          <button onClick={() => setConfirmDeleteAlbum(null)} style={{ ...S.btnGray, padding: '7px 8px', fontSize: 12 }}>✕</button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmDeleteAlbum(album.id)} style={{ ...S.btnGray, padding: '7px 10px', fontSize: 12, color: '#ef4444', borderColor: '#ef444430' }} title="Delete album">🗑</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
