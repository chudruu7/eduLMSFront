import { useMemo } from 'react';

function toEmbedUrl(raw) {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, '');
    if (host.includes('youtube.com') || host === 'youtu.be') {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
      if (host === 'youtu.be') {
        const id = u.pathname.split('/').filter(Boolean)[0];
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      }
      if (u.pathname.startsWith('/embed/')) return raw;
    }
    if (host.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
      if (host === 'player.vimeo.com') return raw;
    }
    if (u.pathname.endsWith('.pdf')) return `${raw}#toolbar=0&navpanes=0&scrollbar=0`;
    return raw;
  } catch { return raw; }
}

export default function EmbedPreview({ url }) {
  const embedUrl = useMemo(() => toEmbedUrl(url || ''), [url]);
  const h = 260; // жижиг (S) хэмжээ

  if (!url) {
    return (
      <div className="card p-4">
        <div className="text-white/60 text-sm">Харах линк сонгоно уу.</div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="bg-black/40 border-b border-ui-border px-4 py-2">
        <div className="text-xs text-white/70 truncate">{url}</div>
      </div>
      <iframe
        title="Preview"
        src={embedUrl}
        className="w-full"
        style={{ height: h }}
        sandbox={/youtube|vimeo/.test(embedUrl) ? undefined : 'allow-scripts allow-same-origin allow-popups allow-forms'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="px-4 py-2 border-t border-ui-border text-xs text-white/50">
        Хэрэв харагдахгүй бол тухайн сайт X-Frame-Options/CSP тохиргоогоор embed-лэхийг хориглосон байж болно.
      </div>
    </div>
  );
}
