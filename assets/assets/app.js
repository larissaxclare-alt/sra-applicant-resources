    const scenarios = {
                staffing: {
                    label: 'I worked through a staffing agency',
                    why: 'The business where you performed your work may not be your legal employer. A staffing agency may have hired and paid you and may maintain the records needed for verification.',
                    steps: ['Review a W-2 or pay statement to identify the company that paid you.', 'Find the staffing agency’s legal name and any official verification instructions.', 'Provide both the agency name and the worksite company through an SRA-approved communication channel.']
                },
                self: {
                    label: 'I was self-employed or owned a business',
                    why: 'Self-employment may not have a traditional HR department. A public business registration can help identify a registered entity, but does not prove that you performed work or received income.',
                    steps: ['Identify the state where your LLC or corporation was registered.', 'Use the official state registry to locate your business and copy the direct public record link.', 'Provide the link through an approved channel and follow any additional documentation requests.']
                },
                franchise: {
                    label: 'I worked at a franchise location',
                    why: 'The brand name on the building may differ from the legal company that hired and paid you.',
                    steps: ['Check your W-2 or pay statement for the legal employer name.', 'Identify the franchise location and operator, if known.', 'Provide the legal employer name and worksite location through an approved channel.']
                },
                closed: {
                    label: 'My employer closed, merged, or changed names',
                    why: 'The original business may no longer maintain employment records under its former name.',
                    steps: ['Provide the employer name used during your employment.', 'Identify any successor, parent company, or records custodian if known.', 'Share any official verification contact information available.']
                },
                third: {
                    label: 'My employer uses a third-party verification provider',
                    why: 'Some companies outsource record verification to another organization, which can require separate instructions or processing.',
                    steps: ['Check the employer’s official HR website for verification instructions.', 'Identify the third-party provider if known.', 'Share official instructions, but never send passwords or account credentials.']
                },
                other: {
                    label: 'I am not sure what is causing the delay',
                    why: 'Common causes include employer response times, missing or inconsistent information, record availability, and external verification processes.',
                    steps: ['Review the employer names, dates, and locations you submitted.', 'Check for messages from the screening provider requesting clarification.', 'Use SRA’s official contact channel for case-specific questions.']
                }
            };
             const registries = {
                FL: ['Florida', 'Sunbiz', 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName'],
                CA: ['California', 'California Secretary of State', 'https://bizfileonline.sos.ca.gov/search/business'],
                NY: ['New York', 'New York Department of State', 'https://apps.dos.ny.gov/publicInquiry/'],
                TX: ['Texas', 'Texas Secretary of State', 'https://www.sos.state.tx.us/corp/sosda/index.shtml'],
                DE: ['Delaware', 'Delaware Division of Corporations', 'https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx']
            };
            const panel = document.getElementById('panel')
              , title = document.getElementById('panelTitle');
            let currentView = 'delays';
            function esc(s) {
                return String(s).replace(/[&<>"']/g, c => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[c]))
            }
            function result(why, steps) {
                return `<div class="result"><h3>Why this may take longer</h3><p>${esc(why)}</p><h3>What you can do</h3><ol>${steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol><p class="notice">These are general possibilities, not a diagnosis of your specific case. Submit corrections only through an SRA-approved channel.</p><div class="actions"><button class="btn secondary" id="copy">Copy instructions</button></div></div>`
            }
            function copyText(t) {
                navigator.clipboard?.writeText(t).then( () => alert('Instructions copied.')).catch( () => alert('Select and copy the guidance on screen.'))
            }
            function bindCopy(why, steps) {
                document.getElementById('copy')?.addEventListener('click', () => copyText(why + '\n\n' + steps.map( (s, i) => `${i + 1}. ${s}`).join('\n')))
            }
            function render(view) {
                currentView = view;
                const titles = {
                    delays: 'Employment Verification Delay Assistant',
                    employer: 'Employer of Record Finder',
                    registry: 'Business Registration Finder',
                    education: 'Education Verification Guide',
                    documents: 'Document Preparation Guide',
                    faq: 'Frequently Asked Questions'
                };
                title.textContent = titles[view];
                if (view === 'delays') {
                    panel.innerHTML = '<p class="sub">Select the situation that best describes your employment history.</p><div class="options">' + Object.entries(scenarios).map( ([k,v]) => `<button class="option ${k === 'staffing' ? 'active' : ''}" data-scenario="${k}">${esc(v.label)}</button>`).join('') + '</div><div id="answer"></div>';
                    function show(k) {
                        document.querySelectorAll('[data-scenario]').forEach(b => b.classList.toggle('active', b.dataset.scenario === k));
                        let s = scenarios[k];
                        document.getElementById('answer').innerHTML = result(s.why, s.steps) + (k === 'self' ? '<p><a href="https://search.sunbiz.org/Inquiry/CorporationSearch/ByName" target="_blank" rel="noopener noreferrer">Example: Search Florida Sunbiz ↗</a></p>' : '');
                        bindCopy(s.why, s.steps)
                    }
                    document.querySelectorAll('[data-scenario]').forEach(b => b.onclick = () => show(b.dataset.scenario));
                    show('staffing')
                }
                if (view === 'employer') {
                    panel.innerHTML = '<p class="sub">Choose the arrangement that best describes your work. Your pay documents are often a helpful starting point.</p><div class="options" id="choices"></div><div id="answer"></div>';
                    const items = [['agency', 'A staffing company placed me at another business'], ['franchise', 'I worked at a franchise or branded location'], ['direct', 'The company hired and paid me directly'], ['contract', 'I worked as a freelancer or independent contractor']];
                    document.getElementById('choices').innerHTML = items.map( ([k,v]) => `<button class="option" data-employer="${k}">${v}</button>`).join('');
                    const answers = {
                        agency: ['The staffing company may be your employer of record, while the client company is your worksite.', ['Check the company name on your W-2 or pay statement.', 'Provide both the staffing agency and worksite name.']],
                        franchise: ['The franchise operator may be your legal employer rather than the national brand.', ['Check your W-2 or pay statement for the legal employer name.', 'Provide the store location and operator name if known.']],
                        direct: ['The company that hired and paid you may maintain your employment records.', ['Confirm its legal name and the dates you worked.', 'Look for official HR verification instructions.']],
                        contract: ['Independent contracting is not always recorded as employee work.', ['Clarify your contractor status and the client or business involved.', 'Follow SRA’s instructions for any required supporting evidence.']]
                    };
                    document.querySelectorAll('[data-employer]').forEach(b => b.onclick = () => {
                        document.querySelectorAll('[data-employer]').forEach(x => x.classList.toggle('active', x === b));
                        let[why,steps] = answers[b.dataset.employer];
                        document.getElementById('answer').innerHTML = result(why, steps);
                        bindCopy(why, steps)
                    }
                    );
                    document.querySelector('[data-employer]').click()
                }

                                if (view === 'registry') {
                    panel.innerHTML = '<p class="sub">Select the state where your LLC or corporation was registered. You will be directed to an official government resource.</p><div class="field"><label for="state">State of registration</label><select id="state">' + Object.entries(registries).map( ([k,v]) => `<option value="${k}">${v[0]}</option>`).join('') + '</select></div><div id="registryResult"></div>';
                    const select = document.getElementById('state');
                    function show() {
                        let r = registries[select.value];
                        document.getElementById('registryResult').innerHTML = `<div class="result"><h3>${r[1]}</h3><ol><li>Search for your business by its legal name.</li><li>Open the correct public registration record.</li><li>Copy the direct URL of that record.</li><li>Provide it through an approved SRA channel if requested.</li></ol><a class="btn" href="${r[2]}" target="_blank" rel="noopener noreferrer">Open official registry ↗</a><p class="notice">Only a selection of states is shown in this prototype. Registration alone does not verify work activity.</p></div>`
                    }
                    select.onchange = show;
                    show()
                }
                if (view === 'education') {
                    panel.innerHTML = '<p class="sub">Schools may maintain records under different names, campuses, or external record providers.</p>' + result('Education checks can take longer if a school changed names, closed, has separate campuses, or uses an outside verification service.', ['Confirm the institution’s official name and campus.', 'Check your dates of attendance and degree or credential awarded.', 'Include any previous name under which your school records were held, through an approved channel.', 'Follow official registrar or transcript instructions if additional documentation is requested.']);
                    bindCopy('Education verification may require additional record research.', ['Confirm the institution and campus.', 'Check attendance dates and credential.', 'Provide previous names if applicable.'])
                }
                if (view === 'documents') {
                    panel.innerHTML = '<p class="sub">Only provide supporting documents when requested by SRA through an approved secure method.</p>' + result('Records may require additional documentation if an employer cannot be reached or the type of work does not have traditional HR records.', ['Confirm which specific documents SRA will accept for your case.', 'Check that requested names, dates, and employer information are readable.', 'Follow SRA instructions to redact information that is not needed.', 'Never upload sensitive records to this educational page or send them to unverified contacts.']);
                    bindCopy('Document preparation', ['Confirm approved document types.', 'Check legibility.', 'Follow redaction guidance.', 'Use an approved secure submission channel.'])
                }
                if (view === 'faq') {
                    const faqs = [['Can this tool tell me my background check status?', 'No. It provides general educational guidance and does not access case records.'], ['Why can a staffing agency cause a mismatch?', 'The agency may be the employer of record, even when you worked at another company’s site.'], ['Does an LLC registration prove self-employment?', 'No. It may establish that a business entity exists, but additional evidence may be needed to verify work activity.'], ['Can I upload my W-2 here?', 'No. This prototype does not accept documents. Use only an SRA-approved secure process.'], ['What if my employer is closed?', 'Provide the former legal name and any known successor or records custodian through an approved channel.']];
                    panel.innerHTML = '<div class="field"><label for="faqSearch">Search FAQs</label><input id="faqSearch" placeholder="Search common questions"></div><div id="faqlist"></div>';
                    let input = document.getElementById('faqSearch');
                    function show() {
                        let q = input.value.toLowerCase();
                        document.getElementById('faqlist').innerHTML = faqs.filter(x => x.join(' ').toLowerCase().includes(q)).map(x => `<details class="faqitem"><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('') || '<p>No matching questions. Try another search.</p>'
                    }
                    input.oninput = show;
                    show()
                }
            }
            document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
                render(b.dataset.view);
                document.getElementById('workspace').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
            ));
            render('delays');