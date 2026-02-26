const LOCAL_KEY = 'bluder_v7_full_cv';

let resumeData = {
    personal: {
        name: "",
        phone: "",
        email: "",
        social: "",
        location: ""
    },
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    awards: [],
    volunteering: []
};

window.onload = () => {
    const template = document.getElementById('pdf-root');
    document.getElementById('desktop-preview-container').appendChild(template);

    loadProgress();
    renderAll();
    lucide.createIcons();
    handleSocialInput(resumeData.personal.social || "");
};

/* --- NAVIGATION --- */
function showSection(num) {
    document.querySelectorAll('.section-wrapper').forEach(el => el.classList.remove('active'));
    document.querySelector(`#sec-${num}`).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const activeNav = document.querySelector(`#nav-sec-${num}`);
    activeNav.classList.add('active');

    // Smooth horizontal scroll to center active tab on mobile
    if (window.innerWidth <= 1024) {
        activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    document.getElementById('main-editor').scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileModal() {
    const modal = document.getElementById('mobilePreviewModal');
    const root = document.getElementById('pdf-root');
    const isOpening = !modal.classList.contains('active');

    if (isOpening) {
        document.getElementById('mobile-preview-container').appendChild(root);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        document.getElementById('desktop-preview-container').appendChild(root);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* --- LOGIC  --- */
function handleSocialInput(val) {
    resumeData.personal.social = val;
    const iconBox = document.getElementById('social-icon-box');
    const previewIcon = document.getElementById('cv-social-icon');

    let iconClass = "fas fa-link";
    const low = (val || "").toLowerCase();

    if (low.includes('linkedin.com')) iconClass = "fab fa-linkedin color-linkedin";
    else if (low.includes('github.com')) iconClass = "fab fa-github color-github";
    else if (low.includes('twitter.com') || low.includes('x.com')) iconClass = "fab fa-x-twitter-alt color-x";
    else if (low.includes('behance.net')) iconClass = "fab fa-behance color-behance";
    else if (low.includes('dribbble.com')) iconClass = "fab fa-dribbble color-dribbble";
    else if (low.includes('vimeo.com')) iconClass = "fab fa-vimeo color-vimeo";
    else if (low.includes('youtube.com')) iconClass = "fab fa-youtube color-youtube";

    iconBox.innerHTML = `<i class="${iconClass}" style="opacity:1;"></i>`;

    // Clean CV icon
    let cvClass = iconClass.split(' ')[0] + " " + iconClass.split(' ')[1];
    previewIcon.className = `${cvClass} cv-icon`;

    // Extraction logic
    let docSocial = val;
    try {
        if (val.startsWith('http')) {
            const url = new URL(val);
            let path = url.pathname;
            if (low.includes('linkedin.com/in/')) {
                const matches = path.match(/\/in\/([^\/]+)/);
                if (matches && matches[1]) docSocial = matches[1];
            } else {
                docSocial = path.replace(/^\//, '').replace(/\/$/, '') || url.hostname;
            }
        }
    } catch (e) { }

    document.getElementById('cv-social').textContent = docSocial || val || "";
    saveAndRefresh(false);
}

function updateInputFields() {
    const p = resumeData.personal;
    document.getElementById('in-name').value = p.name || "";
    document.getElementById('in-phone').value = p.phone || "";
    document.getElementById('in-email').value = p.email || "";
    document.getElementById('in-social').value = p.social || "";
    document.getElementById('in-location').value = p.location || "";
}

function renderAll(buildEdit = true) {
    renderPersonal();
    renderSkills(buildEdit);
    renderProjects(buildEdit);
    renderExperience(buildEdit);
    renderEducation(buildEdit);
    renderCertifications(buildEdit);
    renderAwards(buildEdit);
    renderVolunteering(buildEdit);
}

function formatBold(txt) {
    return txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/* RENDERING BLOCKS */
function renderPersonal() {
    const p = resumeData.personal;
    document.getElementById('cv-name').textContent = p.name || "";
    document.getElementById('cv-phone').textContent = p.phone || "";
    document.getElementById('cv-email').textContent = p.email || "";
    document.getElementById('cv-location').textContent = p.location || "";

    const hp = !!p.phone, he = !!p.email, hs = !!p.social, hl = !!p.location;
    document.getElementById('c-icon-phone').style.display = hp ? "inline-block" : "none";
    document.getElementById('c-sep-1').style.display = (hp && (he || hs || hl)) ? "inline-block" : "none";
    document.getElementById('c-icon-email').style.display = he ? "inline-block" : "none";
    document.getElementById('c-sep-2').style.display = (he && (hs || hl)) ? "inline-block" : "none";
    document.getElementById('c-icon-social').style.display = hs ? "inline-block" : "none";
    document.getElementById('c-sep-3').style.display = (hs && hl) ? "inline-block" : "none";
    document.getElementById('c-icon-loc').style.display = hl ? "inline-block" : "none";
}

function buildBulletPoints(text) {
    if (!text) return "";
    return `<ul class="cv-bullets">${text.split('\n').filter(i => i.trim()).map(i => `<li>${formatBold(i)}</li>`).join('')}</ul>`;
}

function renderSkills(buildEdit = true) {
    const editList = document.getElementById('skills-list');
    const viewList = document.getElementById('v-skills-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-skills').style.display = resumeData.skills.length ? "block" : "none";

    resumeData.skills.forEach(sk => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('skills', ${sk.id})" title="حذف الفئة"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group"><label class="form-label">عنوان الفئة</label><input type="text" style="direction:ltr;" class="form-input" value="${sk.category}" oninput="updateItem('skills', ${sk.id}, 'category', this.value)" placeholder="Category Name"></div>
                    <div class="form-group col-span-2"><label class="form-label">محتوى الفئة (افصل بفاصلة)</label><textarea style="direction:ltr;" class="form-input form-textarea" style="min-height: 60px;" oninput="updateItem('skills', ${sk.id}, 'items', this.value)" placeholder="JavaScript, Python, SQL...">${sk.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        if (sk.category || sk.items) viewList.innerHTML += `<div style="font-size:9.5pt;margin-bottom:4px;"><strong>${sk.category ? sk.category + ":" : ""}</strong> ${sk.items}</div>`;
    });
}


function addSkillSuggestion(cat) {
    let items = "";
    if (cat === "Languages") items = "Python, JavaScript, SQL";
    if (cat === "Tools & Frameworks") items = "React, Docker, AWS, Git";
    if (cat === "Soft Skills") items = "Leadership, Problem Solving, Communication";
    resumeData.skills.push({ id: Date.now(), category: cat, items: items });
    saveAndRefresh();
}

function addSkillObj() { resumeData.skills.push({ id: Date.now(), category: "", items: "" }); saveAndRefresh(); }

function renderProjects(buildEdit = true) {
    const editList = document.getElementById('project-list');
    const viewList = document.getElementById('v-project-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-proj').style.display = resumeData.projects.length ? "block" : "none";

    resumeData.projects.forEach(p => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('projects', ${p.id})"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group"><label class="form-label">المشروع</label><input type="text" style="direction:ltr;" class="form-input" value="${p.name}" oninput="updateItem('projects', ${p.id}, 'name', this.value)"></div>
                    <div class="form-group"><label class="form-label">الفترة (Date)</label><div class="fake-input" onclick="openDatePicker('projects', ${p.id}, 'date')"><span style="direction:ltr; display:inline-block">${p.date || 'اختر الفترة...'}</span><i data-lucide="calendar" style="width:16px;"></i></div></div>
                    <div class="form-group col-span-2"><label class="form-label">التفاصيل (كل سطر نقطة)</label><textarea style="direction:ltr;" class="form-input form-textarea" oninput="updateItem('projects', ${p.id}, 'items', this.value)">${p.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        const item = document.createElement('div'); item.className = "cv-item";
        item.innerHTML = `<div class="cv-row-1"><span><strong>${p.name}</strong></span><span class="cv-date">${p.date}</span></div>${buildBulletPoints(p.items)}`;
        viewList.appendChild(item);
    });
}

function renderExperience(buildEdit = true) {
    const editList = document.getElementById('experience-list');
    const viewList = document.getElementById('v-experience-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-exp').style.display = resumeData.experience.length ? "block" : "none";

    resumeData.experience.forEach(exp => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('experience', ${exp.id})"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group"><label class="form-label">الشركة (Company)</label><input type="text" style="direction:ltr;" class="form-input" value="${exp.company}" oninput="updateItem('experience', ${exp.id}, 'company', this.value)"></div>
                    <div class="form-group"><label class="form-label">الفترة (Date)</label><div class="fake-input" onclick="openDatePicker('experience', ${exp.id}, 'date')"><span style="direction:ltr; display:inline-block">${exp.date || 'اختر الفترة...'}</span><i data-lucide="calendar" style="width:16px;"></i></div></div>
                    <div class="form-group"><label class="form-label">المسمى (Role)</label><input type="text" style="direction:ltr;" class="form-input" value="${exp.role}" oninput="updateItem('experience', ${exp.id}, 'role', this.value)"></div>
                    <div class="form-group"><label class="form-label">المنطقة (Location)</label><input type="text" style="direction:ltr;" class="form-input" value="${exp.location}" oninput="updateItem('experience', ${exp.id}, 'location', this.value)"></div>
                    <div class="form-group col-span-2"><label class="form-label">المهام والانجازات</label><textarea style="direction:ltr;" class="form-input form-textarea" oninput="updateItem('experience', ${exp.id}, 'items', this.value)">${exp.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        const item = document.createElement('div'); item.className = "cv-item";
        item.innerHTML = `<div class="cv-row-1"><span>${exp.company}</span><span class="cv-date">${exp.date}</span></div><div class="cv-row-2"><span class="cv-role">${exp.role}</span><span>${exp.location}</span></div>${buildBulletPoints(exp.items)}`;
        viewList.appendChild(item);
    });
}

function renderEducation(buildEdit = true) {
    const editList = document.getElementById('education-list');
    const viewList = document.getElementById('v-education-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-edu').style.display = resumeData.education.length ? "block" : "none";

    resumeData.education.forEach(e => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('education', ${e.id})"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group"><label class="form-label">المؤسسة / الجامعة</label><input type="text" style="direction:ltr;" class="form-input" value="${e.school}" oninput="updateItem('education', ${e.id}, 'school', this.value)"></div>
                    <div class="form-group"><label class="form-label">الفترة (Date)</label><div class="fake-input" onclick="openDatePicker('education', ${e.id}, 'date')"><span style="direction:ltr; display:inline-block">${e.date || 'اختر الفترة...'}</span><i data-lucide="calendar" style="width:16px;"></i></div></div>
                    <div class="form-group"><label class="form-label">الدرجة (Degree)</label><input type="text" style="direction:ltr;" class="form-input" value="${e.degree}" oninput="updateItem('education', ${e.id}, 'degree', this.value)"></div>
                    <div class="form-group"><label class="form-label">المدينة</label><input type="text" style="direction:ltr;" class="form-input" value="${e.location}" oninput="updateItem('education', ${e.id}, 'location', this.value)"></div>
                    <div class="form-group col-span-2"><label class="form-label">التفاصيل المؤهل (كالمعدل)</label><textarea style="direction:ltr;" class="form-input form-textarea" oninput="updateItem('education', ${e.id}, 'items', this.value)">${e.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        const item = document.createElement('div'); item.className = "cv-item";
        item.innerHTML = `<div class="cv-row-1"><span>${e.school}</span><span class="cv-date">${e.date}</span></div><div class="cv-row-2"><span class="cv-role">${e.degree}</span><span>${e.location}</span></div>${buildBulletPoints(e.items)}`;
        viewList.appendChild(item);
    });
}

function renderCertifications(buildEdit = true) {
    const editList = document.getElementById('certification-list');
    const viewList = document.getElementById('v-certification-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-cert').style.display = resumeData.certifications.length ? "block" : "none";

    resumeData.certifications.forEach(cert => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('certifications', ${cert.id})"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group col-span-2"><label class="form-label">اسم الشهادة (Certificate Name)</label><input type="text" style="direction:ltr;" class="form-input" value="${cert.name}" oninput="updateItem('certifications', ${cert.id}, 'name', this.value)"></div>
                    <div class="form-group"><label class="form-label">جهة الإصدار (Issuer)</label><input type="text" style="direction:ltr;" class="form-input" value="${cert.issuer}" oninput="updateItem('certifications', ${cert.id}, 'issuer', this.value)"></div>
                    <div class="form-group"><label class="form-label">الفترة (Date)</label><div class="fake-input" onclick="openDatePicker('certifications', ${cert.id}, 'date')"><span style="direction:ltr; display:inline-block">${cert.date || 'اختر الفترة...'}</span><i data-lucide="calendar" style="width:16px;"></i></div></div>
                    <div class="form-group col-span-2"><label class="form-label">تفاصيل إضافية (اختياري)</label><textarea style="direction:ltr;" class="form-input form-textarea" oninput="updateItem('certifications', ${cert.id}, 'items', this.value)">${cert.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        const item = document.createElement('div'); item.className = "cv-item";
        let titleLine = `<div class="cv-row-1"><span>${cert.name}</span><span class="cv-date">${cert.date}</span></div>`;
        if (cert.issuer) titleLine += `<div class="cv-row-2"><span class="cv-role">${cert.issuer}</span></div>`;
        item.innerHTML = titleLine + buildBulletPoints(cert.items);
        viewList.appendChild(item);
    });
}

function renderAwards(buildEdit = true) {
    const editList = document.getElementById('award-list');
    const viewList = document.getElementById('v-award-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-award').style.display = resumeData.awards.length ? "block" : "none";

    resumeData.awards.forEach(aw => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('awards', ${aw.id})"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group"><label class="form-label">عنوان الجائزة</label><input type="text" style="direction:ltr;" class="form-input" value="${aw.name}" oninput="updateItem('awards', ${aw.id}, 'name', this.value)"></div>
                    <div class="form-group"><label class="form-label">الفترة (Date)</label><div class="fake-input" onclick="openDatePicker('awards', ${aw.id}, 'date')"><span style="direction:ltr; display:inline-block">${aw.date || 'اختر الفترة...'}</span><i data-lucide="calendar" style="width:16px;"></i></div></div>
                    <div class="form-group col-span-2"><label class="form-label">التفاصيل أو الإنجاز</label><textarea style="direction:ltr;" class="form-input form-textarea" oninput="updateItem('awards', ${aw.id}, 'items', this.value)">${aw.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        const item = document.createElement('div'); item.className = "cv-item";
        item.innerHTML = `<div class="cv-row-1"><span>${aw.name}</span><span class="cv-date">${aw.date}</span></div>${buildBulletPoints(aw.items)}`;
        viewList.appendChild(item);
    });
}

function renderVolunteering(buildEdit = true) {
    const editList = document.getElementById('volunteering-list');
    const viewList = document.getElementById('v-volunteering-items');
    if (buildEdit) editList.innerHTML = "";
    viewList.innerHTML = "";
    document.getElementById('v-vol').style.display = resumeData.volunteering.length ? "block" : "none";

    resumeData.volunteering.forEach(vol => {
        if (buildEdit) {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = `<button class="btn-delete" onclick="removeItem('volunteering', ${vol.id})"><i data-lucide="trash-2" style="width:18px;"></i></button>
                <div class="form-grid">
                    <div class="form-group"><label class="form-label">المنظمة (Organization)</label><input type="text" style="direction:ltr;" class="form-input" value="${vol.org}" oninput="updateItem('volunteering', ${vol.id}, 'org', this.value)"></div>
                    <div class="form-group"><label class="form-label">الفترة (Date)</label><div class="fake-input" onclick="openDatePicker('volunteering', ${vol.id}, 'date')"><span style="direction:ltr; display:inline-block">${vol.date || 'اختر الفترة...'}</span><i data-lucide="calendar" style="width:16px;"></i></div></div>
                    <div class="form-group"><label class="form-label">الدور (Role)</label><input type="text" style="direction:ltr;" class="form-input" value="${vol.role}" oninput="updateItem('volunteering', ${vol.id}, 'role', this.value)"></div>
                    <div class="form-group"><label class="form-label">المدينة</label><input type="text" style="direction:ltr;" class="form-input" value="${vol.location}" oninput="updateItem('volunteering', ${vol.id}, 'location', this.value)"></div>
                    <div class="form-group col-span-2"><label class="form-label">المهام التطوعية</label><textarea style="direction:ltr;" class="form-input form-textarea" oninput="updateItem('volunteering', ${vol.id}, 'items', this.value)">${vol.items}</textarea></div>
                </div>`;
            editList.appendChild(card);
        }
        const item = document.createElement('div'); item.className = "cv-item";
        item.innerHTML = `<div class="cv-row-1"><span>${vol.org}</span><span class="cv-date">${vol.date}</span></div>
            <div class="cv-row-2"><span class="cv-role">${vol.role}</span><span>${vol.location}</span></div>${buildBulletPoints(vol.items)}`;
        viewList.appendChild(item);
    });
    // lucide.createIcons(); // Disabled here to avoid icon redraw issues on edit updates
}

/** CRUD HELPERS **/
function saveAndRefresh(buildEdit = true) {
    resumeData.personal.name = document.getElementById('in-name').value;
    resumeData.personal.phone = document.getElementById('in-phone').value;
    resumeData.personal.email = document.getElementById('in-email').value;
    resumeData.personal.social = document.getElementById('in-social').value;
    resumeData.personal.location = document.getElementById('in-location').value;
    saveProgress();
    renderAll(buildEdit);
}

function updateItem(type, id, key, value) {
    const item = resumeData[type].find(i => i.id === id);
    if (item) item[key] = value;
    saveProgress();
    renderAll(false);
}

function addExperience() { resumeData.experience.push({ id: Date.now(), company: "", date: "", role: "", location: "", items: "" }); saveAndRefresh(); }
function addProject() { resumeData.projects.push({ id: Date.now(), name: "", date: "", items: "" }); saveAndRefresh(); }
function addEducation() { resumeData.education.push({ id: Date.now(), school: "", date: "", degree: "", location: "", items: "" }); saveAndRefresh(); }
function addCertification() { resumeData.certifications.push({ id: Date.now(), name: "", date: "", issuer: "", items: "" }); saveAndRefresh(); }
function addAward() { resumeData.awards.push({ id: Date.now(), name: "", date: "", items: "" }); saveAndRefresh(); }
function addVolunteering() { resumeData.volunteering.push({ id: Date.now(), role: "", date: "", org: "", location: "", items: "" }); saveAndRefresh(); }

function removeItem(type, id) { resumeData[type] = resumeData[type].filter(i => i.id !== id); saveAndRefresh(); }

function saveProgress() { localStorage.setItem(LOCAL_KEY, JSON.stringify(resumeData)); }
function loadProgress() {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
        let loaded = JSON.parse(saved);
        // Ensure new arrays exist if user loads older state
        ['certifications', 'awards', 'volunteering', 'skills', 'experience', 'projects', 'education'].forEach(arr => {
            if (!loaded[arr]) loaded[arr] = [];
        });
        resumeData = loaded;
        updateInputFields();
    }
}

// Reset data (load dummy content)
function resetData() {
    document.getElementById('resetModal').classList.add('active');
}
function closeResetModal() {
    document.getElementById('resetModal').classList.remove('active');
}
function confirmReset() {
    const dummyData = {
        personal: { name: "Sultan AlFifi", phone: "+966 50 123 4567", email: "sultan@example.com", social: "https://www.linkedin.com/in/alfaifi-sultan", location: "Makkah, KSA" },
        skills: [{ id: 101, category: "Languages", items: "Python, JavaScript, TypeScript, Java" }, { id: 102, category: "Tools", items: "React, Node.js, Git, Figma, Docker" }],
        projects: [{ id: 3, name: "Hajj & Umrah Guide App", date: "Mar. 2021 -- Nov. 2021", items: "Built a cross-platform mobile application to assist pilgrims.\nIntegrated live maps and offline features for accessibility." }],
        experience: [{ id: 1, company: "Tech Solutions Co.", date: "Jan. 2022 -- Present", role: "Software Engineer", location: "Makkah, KSA", items: "Developed scalable web applications serving thousands of users.\nOptimized database queries, reducing load times by 40%." }],
        education: [{ id: 4, school: "Umm Al-Qura University", date: "Aug. 2017 -- May. 2021", degree: "B.S. in Computer Science", location: "Makkah, KSA", items: "**GPA**: 4.8/5.0 with First Class Honors.\n**Coursework**: Data Structures, Web Engineering." }],
        certifications: [{ id: 103, name: "AWS Certified Developer – Associate", date: "Mar. 2022", issuer: "Amazon Web Services", items: "" }],
        awards: [{ id: 104, name: "First Place - Hackathon Makkah", date: "Sept. 2020", items: "Led a team of 4 to build an innovative crowd-management AI solution." }],
        volunteering: [{ id: 105, role: "Mentor & Tech Support", date: "Ramadan 2019", org: "Grand Mosque Visitors Care", location: "Makkah, KSA", items: "Assisted elderly pilgrims with digital apps and wayfinding." }]
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(dummyData));
    location.reload();
}

// Clear all data (make empty)
function confirmClearDataModal() {
    document.getElementById('clearModal').classList.add('active');
}
function closeClearModal() {
    document.getElementById('clearModal').classList.remove('active');
}
function confirmClearAll() {
    localStorage.removeItem(LOCAL_KEY);
    location.reload();
}

/* PDF Generate */
function downloadPDF(event) {
    if (typeof pdfMake === 'undefined') {
        alert("جاري تحميل المكتبات... يرجى المحاولة بعد قليل.");
        return;
    }

    // Determine which button was clicked
    const btn = (event && event.currentTarget) ? event.currentTarget : document.getElementById('download-btn-desktop');
    if (!btn) return;

    if (btn.disabled) return;
    const originalContent = btn.innerHTML;
    const isMobile = btn.classList.contains('btn-download-modal');

    // Visual feedback
    btn.innerHTML = isMobile ? '...' : '<i class="fas fa-spinner fa-spin" style="margin-inline-end: 8px;"></i> جاري التحميل...';
    btn.disabled = true;

    // Use a single short timeout to let the UI update text to "Loading...", then freeze main thread to build PDF
    setTimeout(() => {
        try {
            // Reverting to pdfMake's built-in virtual file system fonts to avoid crash
            pdfMake.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };
            const d = {
                pageSize: 'A4',
                pageMargins: [40, 40, 40, 40],
                defaultStyle: { font: 'Roboto', color: '#1a1a1a', lineHeight: 1.2 },
                styles: {
                    name: { fontSize: 26, bold: true, alignment: 'center', margin: [0, 0, 0, 4], color: '#000000', characterSpacing: 1 },
                    contact: { fontSize: 9, alignment: 'center', color: '#1a1a1a', margin: [0, 0, 0, 10] },
                    contactLink: { fontSize: 9, color: '#1a1a1a' },
                    sectionTitle: { fontSize: 12, bold: true, margin: [0, 8, 0, 2], color: '#000000', characterSpacing: 1.5 },
                    itemTitle: { fontSize: 10.5, bold: true, color: '#000000' },
                    itemRow: { margin: [0, 0, 0, 1] },
                    bullets: { fontSize: 9.5, margin: [0, 2, 0, 4] },
                    skillRow: { fontSize: 10, margin: [0, 0, 0, 2] },
                    subtitle: { fontSize: 9.5, bold: true, italics: true, color: '#333333' }
                },
                content: []
            };

            const addSectionLine = () => {
                d.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.2, lineColor: '#cccccc' }], margin: [0, 0, 0, 4] });
            };

            const parseBold = (str) => {
                if (!str) return "";
                let parts = str.split(/(\*\*.*?\*\*)/g);
                return parts.map(p => {
                    if (p.startsWith('**') && p.endsWith('**')) return { text: p.substring(2, p.length - 2), bold: true, color: '#000000' };
                    return { text: p };
                });
            };

            const buildBullets = (itemsStr) => {
                if (!itemsStr) return null;
                const lines = itemsStr.split('\n').filter(i => i.trim());
                if (!lines.length) return null;
                return {
                    ul: lines.map(l => ({ text: parseBold(l), margin: [0, 1] })),
                    style: 'bullets'
                };
            };

            const p = resumeData.personal;
            if (p.name) d.content.push({ text: p.name, style: 'name' });

            const getIconPath = (type) => {
                const attrs = 'fill="#444444" stroke="none"';
                let path = '';
                if (type === 'phone') path = '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>';
                else if (type === 'email') path = '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>';
                else if (type === 'location') path = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>';
                else if (type === 'linkedin') path = '<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>';
                else if (type === 'github') path = '<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>';
                else if (type === 'behance') path = '<path d="M22 12c0-2.52-2.02-4.5-4.5-4.5S13 9.48 13 12c0 2.57 2.1 4.5 4.5 4.5 1.95 0 3.48-.96 4.1-2.4h-1.63c-.41.6-1.1 1-1.95 1-1.4 0-2.38-1.03-2.5-2.6h4.48V12zm-4.50-3.1c1.19 0 2 .88 2.31 2.06h-4.22c.2-1.29 1-2.06 1.91-2.06zM9 10.5V7H4v10h5.5c1.8 0 3.2-1.1 3.2-2.5 0-1.12-.76-2-1.85-2.33C11.9 11.83 12.5 10.95 12.5 10c0-1.38-1.15-2.5-2.65-2.5H9zM7 9h2c.6 0 1 .45 1 1 0 .6-.4 1-1 1H7V9zm0 6v-3h2.3c.75 0 1.25.4 1.25 1.15C10.55 14.1 9.9 15 9.15 15H7zm8.5-9h4v1.5h-4V6z"/>';
                else path = '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>';

                return {
                    svg: `<svg viewBox="0 0 24 24" ${attrs}>${path}</svg>`,
                    width: 10,
                    height: 10,
                    margin: [0, 0.5, 3, 0] // Lifted slightly to match text baseline perfectly
                };
            };

            let contacts = [];
            if (p.phone) contacts.push({ columns: [getIconPath('phone'), { text: p.phone, width: 'auto', link: 'tel:' + p.phone.replace(/[^0-9+]/g, ''), style: 'contactLink' }], width: 'auto' });
            if (p.email) contacts.push({ columns: [getIconPath('email'), { text: p.email, width: 'auto', link: 'mailto:' + p.email, style: 'contactLink' }], width: 'auto' });
            if (p.social) {
                let text = p.social.replace('https://www.', '').replace('http://www.', '').replace('https://', '').replace('http://', '').replace(/\/$/, "");
                let scUrl = p.social.startsWith('http') ? p.social : 'https://' + p.social;
                let iconType = 'social';
                if (text.includes('linkedin.com')) iconType = 'linkedin';
                else if (text.includes('github.com')) iconType = 'github';
                else if (text.includes('twitter.com') || text.includes('x.com')) iconType = 'twitter';
                else if (text.includes('behance.net')) iconType = 'behance';

                contacts.push({ columns: [getIconPath(iconType), { text: text, width: 'auto', link: scUrl, style: 'contactLink' }], width: 'auto' });
            }
            if (p.location) contacts.push({ columns: [getIconPath('location'), { text: p.location, width: 'auto' }], width: 'auto' });

            if (contacts.length) {
                let contactItems = [];
                contacts.forEach((c, idx) => {
                    contactItems.push(c);
                    if (idx < contacts.length - 1) {
                        contactItems.push({ text: "|", color: '#cccccc', margin: [7, 0, 7, 0], width: 'auto' });
                    }
                });

                d.content.push({
                    columns: [
                        { width: '*', text: '' },
                        {
                            width: 'auto',
                            columns: contactItems,
                            columnGap: 0
                        },
                        { width: '*', text: '' }
                    ],
                    margin: [0, 0, 0, 10]
                });
            }

            const buildRow = (left1, right1, left2, right2, desc) => {
                let block = { unbreakable: true, stack: [] }; // Prevents breaking across pages!
                if (left1 || right1) {
                    block.stack.push({
                        columns: [
                            { text: left1 || "", style: 'itemTitle', width: '*' },
                            { text: right1 || "", fontSize: 10, alignment: 'right', width: 'auto' }
                        ],
                        style: 'itemRow'
                    });
                }
                if (left2 || right2) {
                    block.stack.push({
                        columns: [
                            { text: left2 || "", style: 'subtitle', width: '*' },
                            { text: right2 || "", style: 'subtitle', alignment: 'right', width: 'auto' }
                        ],
                        style: 'itemRow'
                    });
                }
                const b = buildBullets(desc);
                if (b) block.stack.push(b);
                block.stack.push({ text: '', margin: [0, 0, 0, 6] });
                d.content.push(block);
            };

            if (resumeData.skills && resumeData.skills.length) {
                d.content.push({ text: 'SKILLS', style: 'sectionTitle' });
                addSectionLine();
                let skBlock = { unbreakable: true, stack: [] };
                resumeData.skills.forEach(sk => {
                    if (!sk.category && !sk.items) return;
                    skBlock.stack.push({
                        text: [{ text: (sk.category ? sk.category + ': ' : ''), bold: true }, sk.items || ""],
                        style: 'skillRow'
                    });
                });
                skBlock.stack.push({ text: '', margin: [0, 0, 0, 8] });
                d.content.push(skBlock);
            }

            if (resumeData.projects && resumeData.projects.length) {
                d.content.push({ text: 'PROJECTS', style: 'sectionTitle' });
                addSectionLine();
                resumeData.projects.forEach(pr => buildRow(pr.name, pr.date, null, null, pr.items));
            }

            if (resumeData.experience && resumeData.experience.length) {
                d.content.push({ text: 'EXPERIENCE', style: 'sectionTitle' });
                addSectionLine();
                resumeData.experience.forEach(ex => buildRow(ex.company, ex.date, ex.role, ex.location, ex.items));
            }

            if (resumeData.education && resumeData.education.length) {
                d.content.push({ text: 'EDUCATION', style: 'sectionTitle' });
                addSectionLine();
                resumeData.education.forEach(ed => buildRow(ed.school, ed.date, ed.degree, ed.location, ed.items));
            }

            if (resumeData.certifications && resumeData.certifications.length) {
                d.content.push({ text: 'CERTIFICATIONS', style: 'sectionTitle' });
                addSectionLine();
                resumeData.certifications.forEach(ce => buildRow(ce.name, ce.date, ce.issuer ? { text: ce.issuer, italics: true } : null, null, ce.items));
            }

            if (resumeData.awards && resumeData.awards.length) {
                d.content.push({ text: 'AWARDS & HONORS', style: 'sectionTitle' });
                addSectionLine();
                resumeData.awards.forEach(aw => buildRow(aw.name, aw.date, null, null, aw.items));
            }

            if (resumeData.volunteering && resumeData.volunteering.length) {
                d.content.push({ text: 'VOLUNTEERING', style: 'sectionTitle' });
                addSectionLine();
                resumeData.volunteering.forEach(vo => buildRow(vo.org, vo.date, vo.role, vo.location, vo.items));
            }

            const pdfDoc = pdfMake.createPdf(d);
            pdfDoc.download(`${resumeData.personal.name || 'CV'}_Resume.pdf`);
        } catch (e) {
            console.error("PDF Generation Error:", e);
            alert("حدث خطأ تقني: " + (e.message || e));
        } finally {
            // Restore button state
            if (btn) {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                // re-init icons if they were lost
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            const mobileModal = document.getElementById('mobilePreviewModal');
            if (mobileModal && mobileModal.classList.contains('active')) {
                // Keep modal open so user sees it worked, or close it if preferred.
                // We'll just restore the button.
            }
        }
    }, 50);
}


/* --- Date Picker Logic --- */
let dpTargetType = null;
let dpTargetId = null;
let dpTargetKey = null;
let currentCalType = 'gregorian';

const dpMonths = {
    gregorian: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    hijri: ["Muharram", "Safar", "Rabi I", "Rabi II", "Jumada I", "Jumada II", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"]
};

function generateYears(type) {
    let years = [];
    if (type === 'gregorian') {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear + 2; i >= 1990; i--) years.push(i);
    } else {
        for (let i = 1450; i >= 1410; i--) years.push(i);
    }
    return years;
}

function renderDateSelectors() {
    const sMonth = document.getElementById('dp-start-month');
    const sYear = document.getElementById('dp-start-year');
    const eMonth = document.getElementById('dp-end-month');
    const eYear = document.getElementById('dp-end-year');

    const mList = dpMonths[currentCalType];
    const yList = generateYears(currentCalType);

    const mHtml = mList.map(m => `<option value="${m}">${m}</option>`).join('');
    const yHtml = yList.map(y => `<option value="${y}">${y}</option>`).join('');

    sMonth.innerHTML = mHtml; eMonth.innerHTML = mHtml;
    sYear.innerHTML = yHtml; eYear.innerHTML = yHtml;
}

function setCalType(type) {
    currentCalType = type;
    document.querySelectorAll('.dp-tab').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
    renderDateSelectors();
}

function toggleEndPicker() {
    const type = document.querySelector('input[name="dp_end_type"]:checked').value;
    const endGroup = document.getElementById('dp-end-group');
    if (type === 'range') {
        endGroup.style.opacity = '1';
        endGroup.style.pointerEvents = 'auto';
    } else {
        endGroup.style.opacity = '0.3';
        endGroup.style.pointerEvents = 'none';
    }
}

function openDatePicker(type, id, key) {
    dpTargetType = type;
    dpTargetId = id;
    dpTargetKey = key;
    renderDateSelectors();
    document.getElementById('datePickerModal').classList.add('active');
}

function closeDatePicker() {
    document.getElementById('datePickerModal').classList.remove('active');
}

function saveDateSelection() {
    const sM = document.getElementById('dp-start-month').value;
    const sY = document.getElementById('dp-start-year').value;
    let finalVal = (currentCalType === 'gregorian') ? `${sM}. ${sY}` : `${sM} ${sY}`;

    const type = document.querySelector('input[name="dp_end_type"]:checked').value;

    if (type === 'present') {
        finalVal += " -- Present";
    } else if (type === 'range') {
        const eM = document.getElementById('dp-end-month').value;
        const eY = document.getElementById('dp-end-year').value;
        const endStr = (currentCalType === 'gregorian') ? `${eM}. ${eY}` : `${eM} ${eY}`;
        finalVal += ` -- ${endStr}`;
    }

    updateItem(dpTargetType, dpTargetId, dpTargetKey, finalVal);
    closeDatePicker();
}
