// Citation Formatting Utility for Academic Papers

// Parse publication year from ISO date string
function getYear(dateStr) {
  if (!dateStr) return new Date().getFullYear();
  try {
    return new Date(dateStr).getFullYear();
  } catch (e) {
    return new Date().getFullYear();
  }
}

// Format author list for APA: "LastName, F. M., & LastName, F."
function formatAPAAuthors(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author';
  
  const formatted = authors.map(author => {
    const parts = author.split(/\s+/);
    if (parts.length === 1) return parts[0];
    const lastName = parts.pop();
    const initials = parts.map(p => p[0] + '.').join(' ');
    return `${lastName}, ${initials}`;
  });

  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`;
  
  if (formatted.length > 7) {
    return `${formatted.slice(0, 6).join(', ')}, ... & ${formatted[formatted.length - 1]}`;
  }
  
  return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
}

// Format author list for MLA: "LastName, FirstName, et al." or "LastName, FirstName, and FirstName LastName"
function formatMLAAuthors(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author';
  
  const getMLAName = (name) => {
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0];
    const lastName = parts.pop();
    const rest = parts.join(' ');
    return `${lastName}, ${rest}`;
  };

  if (authors.length === 1) return getMLAName(authors[0]);
  if (authors.length === 2) {
    const name1 = getMLAName(authors[0]);
    const parts2 = authors[1].split(/\s+/);
    const name2 = parts2.join(' '); // MLA second author is First Last
    return `${name1}, and ${name2}`;
  }
  return `${getMLAName(authors[0])}, et al.`;
}

// Format author list for Chicago
function formatChicagoAuthors(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author';
  
  const getChicagoName = (name) => {
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0];
    const lastName = parts.pop();
    const rest = parts.join(' ');
    return `${lastName}, ${rest}`;
  };

  if (authors.length === 1) return getChicagoName(authors[0]);
  if (authors.length === 2) {
    return `${getChicagoName(authors[0])} and ${authors[1]}`;
  }
  
  const rest = authors.slice(1, -1);
  const last = authors[authors.length - 1];
  return `${getChicagoName(authors[0])}, ${rest.join(', ')}, and ${last}`;
}

// Main Citations Object
export const generateCitations = (paper) => {
  const year = getYear(paper.published);
  const titleClean = paper.title.endsWith('.') ? paper.title.slice(0, -1) : paper.title;
  const id = paper.arxivId || 'arxiv';

  const apa = `${formatAPAAuthors(paper.authors)} (${year}). ${titleClean}. arXiv preprint arXiv:${id}.`;
  
  const mla = `${formatMLAAuthors(paper.authors)}. "${titleClean}." arXiv preprint arXiv:${id} (${year}).`;
  
  const chicago = `${formatChicagoAuthors(paper.authors)}. "${titleClean}." arXiv preprint arXiv:${id} (${year}).`;
  
  // Format authors for BibTeX: "Author1 and Author2 and Author3"
  const bibtexAuthors = paper.authors && paper.authors.length > 0 
    ? paper.authors.join(' and ') 
    : 'Unknown';
    
  const bibtex = `@article{${id.replace(/[^a-zA-Z0-9]/g, '_')}_${year},
  title={${titleClean}},
  author={${bibtexAuthors}},
  journal={arXiv preprint arXiv:${id}},
  year={${year}},
  url={${paper.pdfLink || `https://arxiv.org/abs/${id}`}}
}`;

  return { apa, mla, chicago, bibtex };
};
