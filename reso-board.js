document.addEventListener('DOMContentLoaded', () => {

    const CATEGORIES = [
        { id: 'commercial',  name: 'Коммерческий департамент',           icon: 'fas fa-chart-line'    },
        { id: 'security',    name: 'Деп. экономической безопасности',    icon: 'fas fa-shield-halved' },
        { id: 'overall',     name: 'Общий рейтинг',                     icon: 'fas fa-ranking-star'  }
    ];

    const MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    const ACTIVE_MONTHS = [0, 1, 2];
    const CURRENT_MONTH = 2;

    const NOM_METRICS = {
        commercial: [
            'Процент выполнения личного плана от 75%',
            'Процент выполнения плана подразделения от 75%, мин. план из расчёта коэфф. штата ≥ 3',
            'Личный объём продаж накопительным итогом',
            'Объём продаж подразделения накопительным итогом, мин. план из расчёта коэфф. штата ≥ 3'
        ],
        security: ['Кол-во выявленных рисков', 'Сумма предотвращённых потерь']
    };

    const NOM_GROUPS = {
        commercial: [
            { title: 'Лидеры по маржинальности',  img3d: 'https://i.ibb.co/h5MSb1Z/Frame-2131331987.png', indices: [0, 1] },
            { title: 'Лидеры по объёму продаж',  img3d: 'https://i.ibb.co/4wmF2L8d/Frame-2131331988.png', indices: [2, 3] }
        ]
    };

    let MONTH_DATA = {};
    let OVERALL_INDIVIDUAL = {};
    let OVERALL_GROUPS = {};
    let CHALLENGES = {};

    let boardTab = 'commercial';
    let selectedMonth = CURRENT_MONTH;
    let tableData = [];
    let tableSortCol = null;
    let tableSortDir = 1;
    let tablePage = 1;
    let tablePageSize = 10;

    let groupTableData = [];
    let groupTablePage = 1;
    let groupTablePageSize = 10;


    /* ══════ TABS ══════ */
    const tabsWrapper = document.getElementById('tabsWrapper');

    function buildBoardTabs() {
        tabsWrapper.innerHTML = '';
        CATEGORIES.forEach(cat => {
            const t = document.createElement('div');
            t.className = 'tab' + (cat.id === boardTab ? ' active' : '');
            t.dataset.tab = cat.id;
            t.innerHTML = `<i class="${cat.icon}" style="font-size:14px;flex-shrink:0;"></i><div class="tab-label"><span>${cat.name}</span></div>`;
            t.addEventListener('click', () => {
                tabsWrapper.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                boardTab = cat.id;
                switchView();
            });
            tabsWrapper.appendChild(t);
        });
    }


    /* ══════ MONTH SELECTOR ══════ */
    const monthSelectBox = document.getElementById('monthSelectBox');
    const monthSelectText = document.getElementById('monthSelectText');
    const monthSelectDropdown = document.getElementById('monthSelectDropdown');

    function buildMonthDropdown() {
        monthSelectDropdown.innerHTML = '';
        MONTH_NAMES.forEach((m, i) => {
            const item = document.createElement('div');
            const isActive = ACTIVE_MONTHS.includes(i);
            item.className = 'month-select-item' + (i === selectedMonth ? ' active' : '') + (!isActive ? ' disabled' : '');
            item.textContent = m + ' 2026';
            if (isActive) {
                item.addEventListener('click', e => {
                    e.stopPropagation();
                    selectedMonth = i;
                    monthSelectText.textContent = m + ' 2026';
                    monthSelectBox.classList.remove('open');
                    buildMonthDropdown();
                    switchView();
                });
            }
            monthSelectDropdown.appendChild(item);
        });
    }

    monthSelectBox.addEventListener('click', () => monthSelectBox.classList.toggle('open'));
    document.addEventListener('click', e => { if (!monthSelectBox.contains(e.target)) monthSelectBox.classList.remove('open'); });
    monthSelectText.textContent = MONTH_NAMES[CURRENT_MONTH] + ' 2026';
    buildMonthDropdown();


    /* ══════ VIEW SWITCHING ══════ */
    function switchView() {
        const isOverall = boardTab === 'overall';
        document.getElementById('deptView').style.display = isOverall ? 'none' : '';
        document.getElementById('overallView').style.display = isOverall ? '' : 'none';

        if (isOverall) {
            updateChallenge();
            renderOverallIndividual();
            renderOverallGroups();
        } else {
            updateRegVis();
            renderBoard();
            renderRegions();
        }
    }


    /* ══════ CHALLENGE UPDATE ══════ */
    function updateChallenge() {
        const ch = CHALLENGES[selectedMonth];
        if (!ch) {
            document.getElementById('challengeIntro').style.display = 'none';
            return;
        }
        document.getElementById('challengeIntro').style.display = '';
        document.getElementById('challengeTitle').textContent = ch.title;
        document.getElementById('challengeModalTitle').textContent = ch.title;
    }


    /* ══════ NOMINATIONS ══════ */
    function renderBoard() {
        const container = document.getElementById('nomSections');
        container.innerHTML = '';
        const monthData = MONTH_DATA[selectedMonth];
        if (!monthData || !monthData[boardTab] || !monthData[boardTab].length || monthData[boardTab].every(c => !c.nominees || !c.nominees.length)) {
            container.innerHTML = '<div class="empty-state"><i class="far fa-folder-open"></i><p>Нет данных за этот месяц</p></div>';
            return;
        }

        const data = monthData[boardTab];
        const metrics = NOM_METRICS[boardTab] || [];
        const placeNames = ['1 место', '2 место', '3 место'];
        const groups = NOM_GROUPS[boardTab];

        if (groups) {
            groups.forEach(grp => {
                const img3d = grp.img3d ? `<img src="${grp.img3d}" alt="">` : '';
                let section = `<h2 class="section-title">${img3d}${grp.title}</h2><div class="cards-grid fade-in">`;
                grp.indices.forEach(ci => {
                    const cat = data[ci];
                    if (!cat || !cat.nominees || !cat.nominees.length) return;
                    const metricHtml = metrics[ci] ? `<div class="category-metric-tooltip"><div class="tip-icon">i</div><div class="tip-popup">${metrics[ci]}</div></div>` : '';
                    section += renderCategoryCard(cat, metricHtml, placeNames);
                });
                section += '</div>';
                container.insertAdjacentHTML('beforeend', section);
            });
        } else {
            const icon = boardTab === 'security' ? 'https://i.ibb.co/WJR5CS5/Frame-2131331990.png' : '';
            const iconHtml = icon ? `<img src="${icon}" alt="">` : '';
            let html = `<h2 class="section-title">${iconHtml}Лучшие в номинациях</h2><div class="cards-grid fade-in">`;
            data.forEach((cat, ci) => {
                if (!cat.nominees || !cat.nominees.length) return;
                const metricHtml = metrics[ci] ? `<div class="category-metric-tooltip"><div class="tip-icon">i</div><div class="tip-popup">${metrics[ci]}</div></div>` : '';
                html += renderCategoryCard(cat, metricHtml, placeNames);
            });
            html += '</div>';
            container.insertAdjacentHTML('beforeend', html);
        }
    }

    function renderCategoryCard(cat, metricHtml, placeNames) {
        let html = `<div class="category-card"><div class="category-header"><div class="title-wrap"><span class="category-title">${cat.title}</span></div>${metricHtml}</div><div class="nominees-list">`;
        cat.nominees.forEach((p, pi) => {
            const place = placeNames[pi] || '';
            html += `<div class="nominee-row">
                <div class="avatar-box"><img src="${p.img}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'" alt="${p.name}"></div>
                <div class="info"><div class="name">${p.name}</div><div class="dept">${p.dept}</div></div>
                <div class="place-score-wrap"><span class="score">${p.val}</span><span class="place-badge">${place}</span></div>
            </div>`;
        });
        html += '</div></div>';
        return html;
    }


    /* ══════ REGIONS ══════ */
    function renderRegions() {
        const g = document.getElementById('regionsGrid');
        g.innerHTML = '';
        const monthData = MONTH_DATA[selectedMonth];
        const regions = monthData && monthData.regions ? monthData.regions : [];
        const placeNames = ['1 место', '2 место', '3 место'];

        regions.forEach((r, ri) => {
            g.insertAdjacentHTML('beforeend', `
                <div class="region-card">
                    <div class="region-card-header">
                        <span class="region-name">${r.name}</span>
                        <span class="region-rank">${placeNames[ri] || ''}</span>
                    </div>
                    <div class="region-card-body">
                        <div class="region-info">
                            <div class="region-score">${r.value}</div>
                            <div class="region-boss">Руководитель: ${r.boss}</div>
                        </div>
                        <div class="region-avatar-box">
                            <img src="${r.img}" class="region-avatar" onerror="this.src='https://randomuser.me/api/portraits/lego/5.jpg'" alt="${r.boss}">
                        </div>
                    </div>
                </div>`);
        });
    }

    function updateRegVis() {
        const show = boardTab === 'commercial';
        const monthData = MONTH_DATA[selectedMonth];
        const hasRegions = monthData && monthData.regions && monthData.regions.length > 0;
        document.getElementById('regionsTitle').style.display = (show && hasRegions) ? '' : 'none';
        document.getElementById('regionsGrid').style.display = (show && hasRegions) ? '' : 'none';
    }


    /* ══════ OVERALL INDIVIDUAL TABLE ══════ */
    function renderOverallIndividual() {
        tableData = OVERALL_INDIVIDUAL[selectedMonth] || [];
        tablePage = 1;
        tableSortCol = null;
        tableSortDir = 1;

        const section = document.getElementById('individualSection');
        const emptyEl = document.getElementById('individualEmpty');

        if (!tableData.length) {
            section.querySelector('.rating-table-wrap').style.display = 'none';
            section.querySelector('.table-footer').style.display = 'none';
            emptyEl.style.display = '';
            return;
        }

        section.querySelector('.rating-table-wrap').style.display = '';
        section.querySelector('.table-footer').style.display = '';
        emptyEl.style.display = 'none';

        document.querySelectorAll('#ratingTable thead .sort-icon').forEach(icon => {
            const th = icon.closest('th');
            if (th.classList.contains('col-name')) icon.dataset.col = 'name';
            else if (th.classList.contains('col-dept')) icon.dataset.col = 'dept';

            if (!icon._wired) {
                icon._wired = true;
                icon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const col = this.dataset.col;
                    if (tableSortCol === col) tableSortDir *= -1;
                    else { tableSortCol = col; tableSortDir = 1; }
                    document.querySelectorAll('#ratingTable .sort-icon').forEach(i => i.className = 'fas fa-chevron-down sort-icon');
                    this.className = (tableSortDir === 1 ? 'fas fa-chevron-down' : 'fas fa-chevron-up') + ' sort-icon';
                    tablePage = 1;
                    drawTable();
                });
            }
        });

        const ps = document.getElementById('pageSizeSelect');
        if (ps && !ps._wired) {
            ps._wired = true;
            ps.addEventListener('change', function() {
                tablePageSize = parseInt(this.value);
                tablePage = 1;
                drawTable();
            });
        }

        drawTable();
    }

    function drawTable() {
        let data = [...tableData];
        if (tableSortCol) {
            data.sort((a, b) => {
                let va, vb;
                if (tableSortCol === 'name') { va = a.name; vb = b.name; }
                else if (tableSortCol === 'dept') { va = a.dept; vb = b.dept; }
                return tableSortDir * (va || '').localeCompare(vb || '', 'ru');
            });
        }

        const total = data.length;
        const totalPages = Math.max(1, Math.ceil(total / tablePageSize));
        if (tablePage > totalPages) tablePage = totalPages;
        const start = (tablePage - 1) * tablePageSize;
        const end = Math.min(start + tablePageSize, total);
        const body = document.getElementById('ratingBody');
        body.innerHTML = '';

        for (let i = start; i < end; i++) {
            const p = data[i];
            body.insertAdjacentHTML('beforeend', `<tr>
                <td class="col-num">${i + 1}</td>
                <td class="col-name"><div class="col-name-inner"><img class="name-avatar" src="${p.img}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'" alt="${p.name}"><span>${p.name}</span></div></td>
                <td class="col-position">${p.position}</td>
                <td class="col-dept">${p.dept}</td>
                <td class="col-score">${p.score || '—'}</td>
            </tr>`);
        }

        document.getElementById('tableFooterInfo').textContent = `Показано ${total ? start + 1 : 0}–${end} из ${total}`;
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const pg = document.getElementById('tablePagination');
        pg.innerHTML = '';
        const prev = mkNavBtn('left', tablePage === 1);
        prev.addEventListener('click', () => { if (tablePage > 1) { tablePage--; drawTable(); } });
        pg.appendChild(prev);
        const range = 2;
        let pStart = Math.max(1, tablePage - range);
        let pEnd = Math.min(totalPages, tablePage + range);
        if (pStart > 1) { pg.appendChild(mkPageBtn(1)); if (pStart > 2) pg.appendChild(mkDots()); }
        for (let p = pStart; p <= pEnd; p++) pg.appendChild(mkPageBtn(p));
        if (pEnd < totalPages) { if (pEnd < totalPages - 1) pg.appendChild(mkDots()); pg.appendChild(mkPageBtn(totalPages)); }
        const next = mkNavBtn('right', tablePage === totalPages);
        next.addEventListener('click', () => { if (tablePage < totalPages) { tablePage++; drawTable(); } });
        pg.appendChild(next);
    }

    function mkPageBtn(p) {
        const b = document.createElement('button');
        b.className = 'pagination-btn' + (p === tablePage ? ' active' : '');
        b.textContent = p;
        b.addEventListener('click', () => { tablePage = p; drawTable(); });
        return b;
    }
    function mkNavBtn(dir, disabled) {
        const b = document.createElement('button');
        b.className = 'pagination-btn' + (disabled ? ' disabled' : '');
        b.innerHTML = `<i class="fas fa-chevron-${dir}"></i>`;
        return b;
    }
    function mkDots() {
        const d = document.createElement('span');
        d.className = 'pagination-dots';
        d.textContent = '…';
        return d;
    }


    /* ══════ OVERALL GROUP TABLE ══════ */
    function renderOverallGroups() {
        groupTableData = OVERALL_GROUPS[selectedMonth] || [];
        groupTablePage = 1;

        const section = document.getElementById('groupSection');
        const emptyEl = document.getElementById('groupEmpty');

        if (!groupTableData.length) {
            section.querySelector('.rating-table-wrap').style.display = 'none';
            section.querySelector('.table-footer').style.display = 'none';
            emptyEl.style.display = '';
            return;
        }

        section.querySelector('.rating-table-wrap').style.display = '';
        section.querySelector('.table-footer').style.display = '';
        emptyEl.style.display = 'none';

        const ps = document.getElementById('groupPageSizeSelect');
        if (ps && !ps._wired) {
            ps._wired = true;
            ps.addEventListener('change', function() {
                groupTablePageSize = parseInt(this.value);
                groupTablePage = 1;
                drawGroupTable();
            });
        }

        drawGroupTable();
    }

    function drawGroupTable() {
        const data = [...groupTableData];
        const total = data.length;
        const totalPages = Math.max(1, Math.ceil(total / groupTablePageSize));
        if (groupTablePage > totalPages) groupTablePage = totalPages;
        const start = (groupTablePage - 1) * groupTablePageSize;
        const end = Math.min(start + groupTablePageSize, total);
        const body = document.getElementById('groupRatingBody');
        body.innerHTML = '';

        for (let i = start; i < end; i++) {
            const g = data[i];
            const avatarStack = g.members.slice(0, 4).map((m, mi) =>
                `<img src="${m.img}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'" alt="${m.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #fff;${mi > 0 ? 'margin-left:-10px;' : ''}position:relative;z-index:${4 - mi};">`
            ).join('');
            const memberNames = g.members.map(m => m.name).join(' · ');

            body.insertAdjacentHTML('beforeend', `<tr>
                <td class="col-num">${i + 1}</td>
                <td class="col-name"><div class="col-name-inner"><div style="display:flex;align-items:center;flex-shrink:0;">${avatarStack}</div><span>${g.name}</span></div></td>
                <td class="col-position"></td>
                <td class="col-dept">${memberNames}</td>
                <td class="col-score">${g.score}</td>
            </tr>`);
        }

        document.getElementById('groupTableFooterInfo').textContent = `Показано ${total ? start + 1 : 0}–${end} из ${total}`;
        renderGroupPagination(totalPages);
    }

    function renderGroupPagination(totalPages) {
        const pg = document.getElementById('groupTablePagination');
        pg.innerHTML = '';
        const prev = mkNavBtn('left', groupTablePage === 1);
        prev.addEventListener('click', () => { if (groupTablePage > 1) { groupTablePage--; drawGroupTable(); } });
        pg.appendChild(prev);
        const range = 2;
        let pStart = Math.max(1, groupTablePage - range);
        let pEnd = Math.min(totalPages, groupTablePage + range);
        if (pStart > 1) { pg.appendChild(mkGroupPageBtn(1)); if (pStart > 2) pg.appendChild(mkDots()); }
        for (let p = pStart; p <= pEnd; p++) pg.appendChild(mkGroupPageBtn(p));
        if (pEnd < totalPages) { if (pEnd < totalPages - 1) pg.appendChild(mkDots()); pg.appendChild(mkGroupPageBtn(totalPages)); }
        const next = mkNavBtn('right', groupTablePage === totalPages);
        next.addEventListener('click', () => { if (groupTablePage < totalPages) { groupTablePage++; drawGroupTable(); } });
        pg.appendChild(next);
    }

    function mkGroupPageBtn(p) {
        const b = document.createElement('button');
        b.className = 'pagination-btn' + (p === groupTablePage ? ' active' : '');
        b.textContent = p;
        b.addEventListener('click', () => { groupTablePage = p; drawGroupTable(); });
        return b;
    }


    /* ══════ SEGMENTED TOGGLE (individual / group) ══════ */
    document.querySelectorAll('#subToggle .sub-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#subToggle .sub-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sub = btn.dataset.sub;
            document.getElementById('individualSection').style.display = sub === 'individual' ? '' : 'none';
            document.getElementById('groupSection').style.display = sub === 'group' ? '' : 'none';
        });
    });


    /* ══════ ABOUT CONTEST — segmented tabs ══════ */
    const aboutContestContent = [
        `<h3>Стартует главный конкурс года!</h3>
<p>В РЕСО-Лизинг каждый сотрудник — важная часть большой команды.</p>
<p>В 2026 году, объявленном Годом команды и Годом каждого сотрудника, мы запускаем конкурс «Мы — РЕСО», чтобы ещё раз напомнить: наш общий успех начинается с вас.</p>
<div class="highlight-box">Давайте вместе докажем, что «Мы — РЕСО» — это не просто слова, а настоящая философия единства!</div>
<h3>Превратите возможности в реальные достижения</h3>
<ul><li>Продемонстрируйте свой профессионализм</li><li>Внесите вклад в развитие компании</li><li>Получите признание коллег и руководства</li><li>Станьте частью команды победителей</li></ul>
<h3>Что вас ждёт в конкурсе?</h3>
<ul><li>Интересные и полезные ежемесячные задания</li><li>Возможность проявить креативность</li><li>Работу в команде единомышленников</li><li>Публичное признание достижений</li></ul>
<h3>Как стать участником: два пути к успеху!</h3>
<p><strong>Вариант 1: Путь Индивидуального Лидера</strong></p>
<ul><li>Продемонстрируйте свои таланты в одиночку</li><li>Получайте баллы за личные достижения</li><li>Развивайте профессиональные компетенции</li><li>Соревнуйтесь с другими участниками на равных</li></ul>
<p><strong>Вариант 2: Путь Командного Лидера</strong></p>
<ul><li>Объедините 4–5 талантливых коллег из разных отделов и департаментов</li><li>Используйте сильные стороны каждого участника</li><li>Достигайте целей быстрее благодаря командной работе</li></ul>
<h3>Главный приз</h3>
<div class="highlight-box">Незабываемое путешествие на легендарное озеро Байкал!</div>
<p><strong>В индивидуальном зачёте:</strong> первые 10 победителей личного первенства</p>
<p><strong>В командном зачёте:</strong> лучшая команда группового соревнования</p>`,

        `<h3>Приглашаем в рабочую группу конкурса</h3>
<p>Если вы хотите:</p>
<ul><li>Участвовать в принятии решений вместе с топ-менеджерами</li><li>Внести вклад в развитие корпоративной культуры компании</li></ul>
<p>— это предложение для вас!</p>
<h3>Что будет делать рабочая группа?</h3>
<ul><li>Собираться и генерировать идеи</li><li>Участвовать в определении лидеров месяца</li></ul>
<h3>Важные условия участия</h3>
<ol><li>Участники рабочей группы <strong>не могут участвовать в конкурсах</strong> на получение баллов.</li><li>В группе может быть <strong>не более 2 человек из одного департамента</strong>.</li><li>Количество мест ограничено.</li></ol>
<h3>Как присоединиться?</h3>
<p>Отправьте письмо на адрес: <a href="mailto:aleshina@resoleasing.com">aleshina@resoleasing.com</a></p>
<div class="highlight-box">Творите изменения вместе с нами!</div>`
    ];

    window.switchAboutTab = function(idx) {
        document.querySelectorAll('#aboutContestToggle .sub-toggle-btn').forEach((b, i) => {
            b.classList.toggle('active', i === idx);
        });
        document.getElementById('aboutContestBody').innerHTML = aboutContestContent[idx];
    };
    switchAboutTab(0);

    document.getElementById('aboutContestModal').addEventListener('click', e => {
        if (e.target === document.getElementById('aboutContestModal')) closeModal('aboutContestModal');
    });
    document.getElementById('participateModal').addEventListener('click', e => {
        if (e.target === document.getElementById('participateModal')) closeModal('participateModal');
    });
    document.getElementById('challengeDetailModal').addEventListener('click', e => {
        if (e.target === document.getElementById('challengeDetailModal')) closeModal('challengeDetailModal');
    });


    /* ══════ INIT ══════ */
    fetch('reso-data.json')
        .then(r => r.json())
        .then(data => {
            MONTH_DATA = data.monthData || {};
            OVERALL_INDIVIDUAL = data.overallIndividual || {};
            OVERALL_GROUPS = data.overallGroups || {};
            CHALLENGES = data.challenges || {};
            buildBoardTabs();
            switchView();
        })
        .catch(err => {
            console.error('Не удалось загрузить reso-data.json:', err);
            buildBoardTabs();
            switchView();
        });
});


/* ══════ GLOBAL HELPERS ══════ */
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function showToast(text) {
    const t = document.getElementById('toast');
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function switchParticipateTab(mode) {
    document.querySelectorAll('#participateToggle .sub-toggle-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === mode);
    });
    document.getElementById('participateIndividual').style.display = mode === 'individual' ? '' : 'none';
    document.getElementById('participateGroup').style.display = mode === 'group' ? '' : 'none';
}

function switchChallengeTab(mode) {
    document.querySelectorAll('#challengeToggle .sub-toggle-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.challenge === mode);
    });
    document.getElementById('challengeIndividualContent').style.display = mode === 'individual' ? '' : 'none';
    document.getElementById('challengeGroupContent').style.display = mode === 'group' ? '' : 'none';
}

let groupMemberCount = 3;

function addGroupMember() {
    if (groupMemberCount >= 5) { showToast('Максимум 5 участников в команде'); return; }
    groupMemberCount++;
    const container = document.getElementById('groupMembersContainer');
    const row = document.createElement('div');
    row.className = 'form-group-row';
    row.innerHTML = `<label class="form-label">Участник ${groupMemberCount}</label>
        <input type="text" class="form-input group-member-name" placeholder="Фамилия Имя">
        <input type="text" class="form-input group-member-dept" placeholder="Департамент">`;
    container.appendChild(row);
}

function submitIndividual() {
    const name = document.getElementById('indivName').value.trim();
    const position = document.getElementById('indivPosition').value.trim();
    const dept = document.getElementById('indivDept').value.trim();
    const link = document.getElementById('indivLink').value.trim();
    if (!name || !position || !dept) { showToast('Заполните все обязательные поля'); return; }
    const entry = { type: 'individual', name, position, dept, link, date: new Date().toISOString() };
    saveRegistration(entry);
    closeModal('participateModal');
    showToast('Заявка отправлена!');
    document.getElementById('individualSuccessBanner').classList.add('show');
    document.getElementById('indivName').value = '';
    document.getElementById('indivPosition').value = '';
    document.getElementById('indivDept').value = '';
    document.getElementById('indivLink').value = '';
}

function submitGroup() {
    const teamName = document.getElementById('groupTeamName').value.trim();
    const link = document.getElementById('groupLink').value.trim();
    const names = document.querySelectorAll('#groupMembersContainer .group-member-name');
    const depts = document.querySelectorAll('#groupMembersContainer .group-member-dept');
    if (!teamName) { showToast('Введите название команды'); return; }
    const members = [];
    names.forEach((n, i) => {
        const nm = n.value.trim();
        const dp = depts[i] ? depts[i].value.trim() : '';
        if (nm) members.push({ name: nm, dept: dp });
    });
    if (members.length < 2) { showToast('Минимум 2 участника в команде'); return; }
    const entry = { type: 'group', teamName, members, link, date: new Date().toISOString() };
    saveRegistration(entry);
    closeModal('participateModal');
    showToast('Команда зарегистрирована!');
    document.getElementById('groupSuccessBanner').classList.add('show');
}

function saveRegistration(entry) {
    const KEY = 'reso_registrations';
    let regs = [];
    try { regs = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) {}
    regs.push(entry);
    localStorage.setItem(KEY, JSON.stringify(regs));
    console.log('Registration saved:', entry);
}
