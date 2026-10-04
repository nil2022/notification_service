const HTML_ESCAPES = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

/** Escapes user-supplied text before it is interpolated into HTML emails. */
export const escapeHtml = (value) =>
	String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
