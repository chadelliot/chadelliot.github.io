// Shared by the Edge Function and the offline pipeline checks.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (quoted) throw new Error('Incomplete CSV response');
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift()?.map(h => h.trim().replace(/^\uFEFF/, '')) || [];
  return { headers, rows: rows.filter(r => r.some(c => c.trim())).map(r => Object.fromEntries(headers.filter(Boolean).map(h => [h, (r[headers.indexOf(h)] || '').trim()]))) };
}

export function contactKey(row) {
  const profile = row.linkedin_url?.toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '');
  return `${profile || row.company.toLowerCase()}::${row.contact_name.toLowerCase()}`;
}

export function contactsFromCsv(text) {
  const { headers, rows } = parseCsv(text);
  for (const required of ['Company', 'Contact Name', 'LinkedIn URL / Search']) {
    if (!headers.includes(required)) throw new Error(`Missing contact column: ${required}`);
  }
  const fields = {
    company: 'Company', contact_name: 'Contact Name', title: 'Title',
    industry: 'Industry Logged', sector: 'Sector / Sub-Industry', priority: 'Priority',
    outreach_angle: 'Outreach Angle', value_hypothesis: 'Value Hypothesis',
    linkedin_connect_message: 'LinkedIn Connect Message', intro_message: 'Intro Message',
    follow_up_message: 'Follow-up Message', email_subject: 'email_subject',
    email_intro_message: 'email_intro_message', email_follow_up_1: 'email_follow_up_1',
    email_follow_up_2: 'email_follow_up_2', email_assumption_notice: 'email_assumption_notice',
  };
  const contacts = new Map();
  for (const row of rows) {
    if (!row.Company || !row['Contact Name']) continue;
    if (/^(skip|tbd|unknown|not found|needs research|unresolved)\b/i.test(row['Contact Name'])) continue;
    // Retired duplicate rows must not overwrite the selected person later in the tab.
    if (/retired|do not outreach|superseded|skipped|duplicate/i.test(`${row.Status || ''} ${row.Priority || ''}`)) continue;
    const contact = Object.fromEntries(Object.entries(fields).filter(([, h]) => row[h]).map(([k, h]) => [k, row[h]]));
    if (contact.priority && !['A','B','C','A/B','D','needs_review'].includes(contact.priority)) contact.priority = 'needs_review';
    const linkedin = row['LinkedIn URL / Search'];
    if (/^https:\/\/(?:[a-z]+\.)?linkedin\.com\/in\/[^\s/?]+/i.test(linkedin)) contact.linkedin_url = linkedin;
    const email = row.Email || row.email;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      contact.email = email;
      // Never present an address with unknown verification as confirmed.
      if (!contact.email_assumption_notice && !/verified public/i.test(row.email_status || '')) contact.email_assumption_notice = 'Source sheet email; verification not confirmed. May not work.';
    }
    const slot = row.target_type_raw || row['Target Slot'];
    if (/^Target [123]$/.test(slot)) contact.target_type_raw = slot;
    const reason = row.stakeholder_selection_reason || row.Notes;
    if (reason) contact.stakeholder_selection_reason = reason;
    const key = contactKey(contact);
    contacts.set(key, { ...contacts.get(key), ...contact });
  }
  return [...contacts.values()];
}

export function signalsFromCsv(text) {
  const { headers, rows } = parseCsv(text);
  if (!headers.includes('company') || !headers.includes('role_title')) throw new Error('Missing signal columns');
  return rows.filter(r => r.company && r.role_title).map(row => ({
    company: row.company, role_title: row.role_title,
    posted_date: row['posted_date (YYYY-MM-DD)'] || row.posted_date || null,
    source_url: row.source_url || null, notes: row.notes || null,
    lead_origin: row.lead_origin || null, opportunity_type: row.opportunity_type || null,
    engagement_details: row.engagement_details || null,
  }));
}
