document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────────────────────
       CONFIG: Categories / Tabs
       ────────────────────────────────────────────────────────── */
    const CATEGORIES = [
        { id: 'commercial',  name: 'Коммерческий департамент',           icon: 'fas fa-chart-line'    },
        { id: 'security',    name: 'Деп. экономической безопасности',    icon: 'fas fa-shield-halved' },
        { id: 'overall',     name: 'Общий рейтинг',                     icon: 'fas fa-ranking-star'  }
    ];

    const MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    const ACTIVE_MONTHS = [0, 1, 2, 3]; // Months available (0=Jan, 3=Apr)
    const CURRENT_MONTH = 3; // Default selected (April)

    /* ──────────────────────────────────────────────────────────
       CONFIG: Nomination titles, metrics, icons
       ────────────────────────────────────────────────────────── */
    const NOM_TITLES = {
        commercial: ['Среди сотрудников', 'Среди директоров', 'Среди сотрудников', 'Среди директоров'],
        security:   ['Лучший аналитик рисков', 'Предотвращение потерь', 'Скорость реагирования', 'Качество отчётности']
    };

    const NOM_METRICS = {
        commercial: ['Процент выполнения личного плана', 'Процент выполнения плана подразделения', 'Объём сделок с маржой не ниже 80% от 7,5', 'Выполнение плана подразделения в %'],
        security:   ['Кол-во выявленных рисков', 'Сумма предотвращённых потерь', 'Среднее время реагирования', 'Оценка качества отчётов']
    };

    const NOM_GROUPS = {
        commercial: [
            { title: 'Лидеры по марже',          img3d: 'data:image/jpeg;base64,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', indices: [0, 1] },
            { title: 'Лидеры по объёму продаж',  img3d: 'data:image/jpeg;base64,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',  indices: [2, 3] }
        ]
    };

    /* ──────────────────────────────────────────────────────────
       DATA: Monthly nominees
       ────────────────────────────────────────────────────────────
       Structure: MONTH_DATA[monthIndex].commercial / .security
       Each is an array of nomination objects:
         { title: string, nominees: [{ name, dept, val, img }] }
       
       To update data for a specific month, edit the corresponding
       entry below. For Bitrix integration, this object can be
       populated from an API call.
       ────────────────────────────────────────────────────────── */
    const MONTH_DATA = {
        // ── АПРЕЛЬ (текущий) ──
        3: {
            commercial: [
                { title: 'Среди сотрудников', nominees: [
                    { name: 'Абдумалиева Фарангиз', dept: 'Директор по продажам', val: '21 231 000 ₽', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                    { name: 'Смазливенький Антон',   dept: 'Старший менеджер',     val: '18 740 000 ₽', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                    { name: 'Успехов Александр',     dept: 'Менеджер по продажам', val: '16 520 000 ₽', img: 'https://randomuser.me/api/portraits/men/46.jpg' }
                ]},
                { title: 'Среди директоров', nominees: [
                    { name: 'Кузнецова Ольга',    dept: 'Менеджер по продажам', val: '82%', img: 'https://randomuser.me/api/portraits/women/26.jpg' },
                    { name: 'Петров Дмитрий',     dept: 'Старший менеджер',     val: '76%', img: 'https://randomuser.me/api/portraits/men/52.jpg' },
                    { name: 'Волкова Екатерина',   dept: 'Менеджер по продажам', val: '70%', img: 'https://randomuser.me/api/portraits/women/58.jpg' }
                ]},
                { title: 'Среди сотрудников', nominees: [
                    { name: 'Романов Игорь',      dept: 'Ведущий менеджер',     val: '24 800 000 ₽', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
                    { name: 'Белова Марина',      dept: 'Менеджер по продажам', val: '22 150 000 ₽', img: 'https://randomuser.me/api/portraits/women/33.jpg' },
                    { name: 'Тарасов Михаил',     dept: 'Менеджер по продажам', val: '19 600 000 ₽', img: 'https://randomuser.me/api/portraits/men/64.jpg' }
                ]},
                { title: 'Среди директоров', nominees: [
                    { name: 'Назарова Алина',     dept: 'Менеджер по доп. услугам', val: '8 450 000 ₽', img: 'https://randomuser.me/api/portraits/women/12.jpg' },
                    { name: 'Григорьев Павел',    dept: 'Старший менеджер',         val: '7 320 000 ₽', img: 'https://randomuser.me/api/portraits/men/28.jpg' },
                    { name: 'Соколова Дарья',     dept: 'Менеджер по доп. услугам', val: '6 180 000 ₽', img: 'https://randomuser.me/api/portraits/women/47.jpg' }
                ]}
            ],
            security: [
                { title: 'Лучший аналитик рисков', nominees: [
                    { name: 'Соколов Михаил',     dept: 'Старший специалист',     val: '52 проверки', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
                    { name: 'Фролова Арина',      dept: 'Аналитик рисков',        val: '47 проверок', img: 'https://randomuser.me/api/portraits/women/8.jpg' },
                    { name: 'Баранов Кирилл',     dept: 'Старший специалист',     val: '41 проверка', img: 'https://randomuser.me/api/portraits/men/41.jpg' }
                ]},
                { title: 'Предотвращение потерь', nominees: [
                    { name: 'Фролова Арина',      dept: 'Аналитик рисков',        val: '6 400 000 ₽', img: 'https://randomuser.me/api/portraits/women/8.jpg' },
                    { name: 'Соколов Михаил',     dept: 'Старший специалист',     val: '5 700 000 ₽', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
                    { name: 'Жуков Владимир',     dept: 'Руководитель СБ',       val: '4 500 000 ₽', img: 'https://randomuser.me/api/portraits/men/7.jpg' }
                ]},
                { title: 'Скорость реагирования', nominees: [
                    { name: 'Жуков Владимир',     dept: 'Руководитель СБ',       val: '0.8 ч.', img: 'https://randomuser.me/api/portraits/men/7.jpg' },
                    { name: 'Соколов Михаил',     dept: 'Старший специалист',     val: '1.1 ч.', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
                    { name: 'Фролова Арина',      dept: 'Аналитик рисков',        val: '1.4 ч.', img: 'https://randomuser.me/api/portraits/women/8.jpg' }
                ]},
                { title: 'Качество отчётности', nominees: [
                    { name: 'Баранов Кирилл',     dept: 'Старший специалист',     val: '97%', img: 'https://randomuser.me/api/portraits/men/41.jpg' },
                    { name: 'Соколов Михаил',     dept: 'Старший специалист',     val: '94%', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
                    { name: 'Фролова Арина',      dept: 'Аналитик рисков',        val: '91%', img: 'https://randomuser.me/api/portraits/women/8.jpg' }
                ]}
            ],
            regions: [
                { name: 'Москва-17',           value: '21 231 000 ₽', boss: 'Авганов Александр', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
                { name: 'Санкт-Петербург',      value: '18 450 000 ₽', boss: 'Смирнова Анна',    img: 'https://randomuser.me/api/portraits/women/65.jpg' },
                { name: 'Казань-Центр',          value: '15 120 000 ₽', boss: 'Иванов Сергей',    img: 'https://randomuser.me/api/portraits/men/41.jpg' }
            ]
        }
    };

    /* ──────────────────────────────────────────────────────────
       DATA: Overall rating (individual + group)
       Varies by month for realism.
       ────────────────────────────────────────────────────────── */
    const OVERALL_INDIVIDUAL = {
        3: [
            { name: 'Соколов Михаил',        position: 'Старший специалист',       dept: 'Деп. экономической безопасности',   score: '1 240', img: 'https://randomuser.me/api/portraits/men/15.jpg' },
            { name: 'Шарапов Андрей',        position: 'Руководитель департамента', dept: 'Коммерческий департамент',          score: '1 185', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { name: 'Абдумалиева Фарангиз',  position: 'Директор по продажам',     dept: 'Коммерческий департамент',          score: '1 120', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { name: 'Васильков Евгений',     position: 'Менеджер по продажам',     dept: 'Деп. экономической безопасности',   score: '1 070', img: 'https://randomuser.me/api/portraits/men/46.jpg' },
            { name: 'Лебедева Светлана',     position: 'Менеджер по продажам',     dept: 'Коммерческий департамент',          score: '990',   img: 'https://randomuser.me/api/portraits/women/26.jpg' },
            { name: 'Фролова Арина',         position: 'Аналитик рисков',          dept: 'Деп. экономической безопасности',   score: '945',   img: 'https://randomuser.me/api/portraits/women/8.jpg' },
            { name: 'Гуськин Александр',     position: 'Менеджер по продажам',     dept: 'Коммерческий департамент',          score: '910',   img: 'https://randomuser.me/api/portraits/men/64.jpg' },
            { name: 'Комарова Анна',         position: 'Менеджер по продажам',     dept: 'Деп. экономической безопасности',   score: '870',   img: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { name: 'Баранов Кирилл',        position: 'Старший специалист',       dept: 'Деп. экономической безопасности',   score: '840',   img: 'https://randomuser.me/api/portraits/men/41.jpg' },
            { name: 'Грязнова Александра',   position: 'Менеджер по продажам',     dept: 'Коммерческий департамент',          score: '810',   img: 'https://randomuser.me/api/portraits/women/33.jpg' },
            { name: 'Андреев Артём',         position: 'Менеджер по продажам',     dept: 'Коммерческий департамент',          score: '775',   img: 'https://randomuser.me/api/portraits/men/7.jpg' },
            { name: 'Кузнецова Ольга',       position: 'Менеджер по продажам',     dept: 'Коммерческий департамент',          score: '740',   img: 'https://randomuser.me/api/portraits/women/58.jpg' },
            { name: 'Петров Дмитрий',        position: 'Старший менеджер',         dept: 'Коммерческий департамент',          score: '705',   img: 'https://randomuser.me/api/portraits/men/52.jpg' },
            { name: 'Глупышко Сергей',       position: 'Менеджер по продажам',     dept: 'Деп. экономической безопасности',   score: '670',   img: 'https://randomuser.me/api/portraits/men/10.jpg' },
            { name: 'Шишка Вячеслав',        position: 'Менеджер по продажам',     dept: 'Коммерческий департамент',          score: '635',   img: 'https://randomuser.me/api/portraits/men/28.jpg' }
        ]
    };

    const OVERALL_GROUPS = {
        3: [
            { name: 'Команда «Москва-Центр»',  score: '3 640', members: [{ name: 'Абдумалиева Фарангиз', img: 'https://randomuser.me/api/portraits/women/44.jpg' }, { name: 'Романов Игорь', img: 'https://randomuser.me/api/portraits/men/15.jpg' }, { name: 'Смазливенький Антон', img: 'https://randomuser.me/api/portraits/men/32.jpg' }] },
            { name: 'Команда «Северо-Запад»',   score: '3 210', members: [{ name: 'Белова Марина', img: 'https://randomuser.me/api/portraits/women/33.jpg' }, { name: 'Тарасов Михаил', img: 'https://randomuser.me/api/portraits/men/64.jpg' }, { name: 'Петров Дмитрий', img: 'https://randomuser.me/api/portraits/men/52.jpg' }] },
            { name: 'Команда «Безопасность+»',  score: '2 980', members: [{ name: 'Жуков Владимир', img: 'https://randomuser.me/api/portraits/men/7.jpg' }, { name: 'Фролова Арина', img: 'https://randomuser.me/api/portraits/women/8.jpg' }, { name: 'Баранов Кирилл', img: 'https://randomuser.me/api/portraits/men/10.jpg' }] },
            { name: 'Команда «Юг»',             score: '2 750', members: [{ name: 'Кузнецова Ольга', img: 'https://randomuser.me/api/portraits/women/26.jpg' }, { name: 'Успехов Александр', img: 'https://randomuser.me/api/portraits/men/46.jpg' }, { name: 'Соколова Дарья', img: 'https://randomuser.me/api/portraits/women/47.jpg' }] }
        ]
    };

    /* ──────────────────────────────────────────────────────────
       DATA: Challenge content per month
       ────────────────────────────────────────────────────────── */
    const CHALLENGES = {
        3: { title: 'Мастер публичных выступлений', desc: 'Апрельский челлендж — шанс познакомиться ближе! Выступая перед коллегами, каждый сможет раскрыть свои сильные стороны, показать профессиональные навыки и поделиться частичкой своей личности.', deadline: '30 апреля 2026' }
    };


    /* ══════════════════════════════════════════════════════════
       STATE
       ══════════════════════════════════════════════════════════ */
    let boardTab = 'commercial';
    let selectedMonth = CURRENT_MONTH;
    let tableData = [];
    let tableSortCol = null;
    let tableSortDir = 1;
    let tablePage = 1;
    let tablePageSize = 10;
    let individualJoined = false;
    let groupJoined = false;
    let teamMemberCount = 3;


    /* ══════════════════════════════════════════════════════════
       TABS
       ══════════════════════════════════════════════════════════ */
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


    /* ══════════════════════════════════════════════════════════
       MONTH SELECTOR
       ══════════════════════════════════════════════════════════ */
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
    buildMonthDropdown();


    /* ══════════════════════════════════════════════════════════
       VIEW SWITCHING
       ══════════════════════════════════════════════════════════ */
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


    /* ══════════════════════════════════════════════════════════
       CHALLENGE UPDATE
       ══════════════════════════════════════════════════════════ */
    function updateChallenge() {
        const ch = CHALLENGES[selectedMonth] || CHALLENGES[CURRENT_MONTH];
        document.getElementById('challengeTitle').textContent = ch.title;
        document.getElementById('challengeDesc').textContent = ch.desc;
        document.getElementById('challengeDeadlineText').textContent = 'Крайний срок: ' + ch.deadline;
        document.getElementById('challengeModalTitle').textContent = ch.title;
    }


    /* ══════════════════════════════════════════════════════════
       NOMINATIONS RENDERING
       ══════════════════════════════════════════════════════════ */
    function renderBoard() {
        const container = document.getElementById('nomSections');
        container.innerHTML = '';
        const monthData = MONTH_DATA[selectedMonth];
        if (!monthData || !monthData[boardTab]) {
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
            const icon = boardTab === 'security'
                ? 'data:image/jpeg;base64,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'
                : '';
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


    /* ══════════════════════════════════════════════════════════
       REGIONS
       ══════════════════════════════════════════════════════════ */
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
        document.getElementById('regionsTitle').style.display = show ? '' : 'none';
        document.getElementById('regionsGrid').style.display = show ? '' : 'none';
    }


    /* ══════════════════════════════════════════════════════════
       OVERALL INDIVIDUAL TABLE
       ══════════════════════════════════════════════════════════ */
    function renderOverallIndividual() {
        tableData = OVERALL_INDIVIDUAL[selectedMonth] || OVERALL_INDIVIDUAL[CURRENT_MONTH] || [];
        tablePage = 1;
        tableSortCol = null;
        tableSortDir = 1;

        // Wire sort icons
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

        // Wire page size
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

        if (pStart > 1) {
            pg.appendChild(mkPageBtn(1));
            if (pStart > 2) pg.appendChild(mkDots());
        }
        for (let p = pStart; p <= pEnd; p++) pg.appendChild(mkPageBtn(p));
        if (pEnd < totalPages) {
            if (pEnd < totalPages - 1) pg.appendChild(mkDots());
            pg.appendChild(mkPageBtn(totalPages));
        }

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


    /* ══════════════════════════════════════════════════════════
       OVERALL GROUP TABLE
       ══════════════════════════════════════════════════════════ */
    function renderOverallGroups() {
        const body = document.getElementById('groupRatingBody');
        body.innerHTML = '';
        const groups = OVERALL_GROUPS[selectedMonth] || OVERALL_GROUPS[CURRENT_MONTH] || [];

        groups.forEach((g, gi) => {
            const avatarStack = g.members.slice(0, 4).map((m, mi) =>
                `<img src="${m.img}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'" alt="${m.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #fff;${mi > 0 ? 'margin-left:-10px;' : ''}position:relative;z-index:${4 - mi};">`
            ).join('');
            const memberNames = g.members.map(m => m.name).join(' · ');

            body.insertAdjacentHTML('beforeend', `<tr>
                <td class="col-num">${gi + 1}</td>
                <td class="col-name"><div class="col-name-inner"><div style="display:flex;align-items:center;flex-shrink:0;">${avatarStack}</div><span>${g.name}</span></div></td>
                <td class="col-dept">${memberNames}</td>
                <td class="col-score">${g.score}</td>
            </tr>`);
        });

        document.getElementById('groupTableFooterInfo').textContent = `Всего команд: ${groups.length}`;
    }


    /* ══════════════════════════════════════════════════════════
       SEGMENTED TOGGLE (individual / group)
       ══════════════════════════════════════════════════════════ */
    document.querySelectorAll('#subToggle .sub-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#subToggle .sub-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sub = btn.dataset.sub;
            document.getElementById('individualSection').style.display = sub === 'individual' ? '' : 'none';
            document.getElementById('groupSection').style.display = sub === 'group' ? '' : 'none';
        });
    });


    /* ══════════════════════════════════════════════════════════
       PARTICIPATE FORMS
       ══════════════════════════════════════════════════════════ */
    window.openIndividualForm = function() {
        if (individualJoined) return;
        document.getElementById('individualFormOverlay').classList.add('active');
    };

    window.closeIndividualForm = function() {
        document.getElementById('individualFormOverlay').classList.remove('active');
    };

    document.getElementById('individualFormOverlay').addEventListener('click', e => {
        if (e.target === document.getElementById('individualFormOverlay')) closeIndividualForm();
    });

    window.submitIndividualForm = function() {
        const name = document.getElementById('indName').value.trim();
        const pos = document.getElementById('indPosition').value.trim();
        const dept = document.getElementById('indDept').value;
        if (!name) { showToast('Укажите ФИО'); return; }
        if (!pos) { showToast('Укажите должность'); return; }
        if (!dept) { showToast('Выберите департамент'); return; }
        individualJoined = true;
        const btn = document.getElementById('btnParticipateIndividual');
        if (btn) { btn.classList.add('joined'); btn.innerHTML = '<i class="fas fa-check-circle"></i> Вы участвуете'; }
        document.getElementById('individualSuccessBanner').classList.add('show');
        showFormSuccess('individualFormOverlay', 'Поздравляем, ты в игре!', 'Результаты будут отображаться в таблице по итогам месяца', closeIndividualForm);
    };

    window.openTeamForm = function() {
        if (groupJoined) return;
        document.getElementById('teamFormOverlay').classList.add('active');
    };

    window.closeTeamForm = function() {
        document.getElementById('teamFormOverlay').classList.remove('active');
    };

    document.getElementById('teamFormOverlay').addEventListener('click', e => {
        if (e.target === document.getElementById('teamFormOverlay')) closeTeamForm();
    });

    window.addTeamMemberRow = function() {
        teamMemberCount++;
        const row = document.createElement('div');
        row.className = 'team-member-row';
        row.innerHTML = `<span class="team-member-num">${teamMemberCount}</span><input type="text" placeholder="ФИО" class="team-input-name"><input type="text" placeholder="Должность" class="team-input-pos" style="max-width:180px;">`;
        document.getElementById('teamMemberInputs').appendChild(row);
    };

    window.submitTeamForm = function() {
        const teamName = document.getElementById('teamName').value.trim();
        if (!teamName) { showToast('Укажите название команды'); return; }
        const names = [];
        document.querySelectorAll('.team-input-name').forEach(inp => { const v = inp.value.trim(); if (v) names.push(v); });
        if (names.length < 2) { showToast('Укажите минимум 2 участников'); return; }
        groupJoined = true;
        const btn = document.getElementById('btnParticipateGroup');
        if (btn) { btn.classList.add('joined'); btn.innerHTML = '<i class="fas fa-check-circle"></i> Вы участвуете'; }
        document.getElementById('groupSuccessSub').textContent = teamName + ': ' + names.join(', ');
        document.getElementById('groupSuccessBanner').classList.add('show');
        showFormSuccess('teamFormOverlay', 'Команда зарегистрирована!', `Команда «${teamName}»: ${names.join(', ')}`, closeTeamForm);
    };

    function showFormSuccess(overlayId, title, subtitle, closeFn) {
        const panel = document.querySelector(`#${overlayId} .team-form-panel`);
        panel.innerHTML = `<div style="text-align:center;padding:40px 20px;">
            <div style="width:64px;height:64px;border-radius:50%;background:var(--green-primary);color:var(--white);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 20px;"><i class="fas fa-check"></i></div>
            <h3 style="font-size:20px;font-weight:600;margin-bottom:8px;color:var(--green-primary);">${title}</h3>
            <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;">${subtitle}</p>
            <button class="btn btn-primary" onclick="${closeFn.name}()" style="margin:0 auto;">Отлично</button>
        </div>`;
    }


    /* ══════════════════════════════════════════════════════════
       ABOUT CONTEST
       ══════════════════════════════════════════════════════════ */
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
        document.querySelectorAll('.about-contest-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
        document.getElementById('aboutContestBody').innerHTML = aboutContestContent[idx];
    };

    switchAboutTab(0);

    document.getElementById('aboutContestModal').addEventListener('click', e => {
        if (e.target === document.getElementById('aboutContestModal')) closeModal('aboutContestModal');
    });


    /* ══════════════════════════════════════════════════════════
       INIT
       ══════════════════════════════════════════════════════════ */
    buildBoardTabs();
    renderRegions();
    switchView();
});


/* ──────────────────────────────────────────────────────────
   GLOBAL HELPERS
   ────────────────────────────────────────────────────────── */
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function showToast(text) {
    const t = document.getElementById('toast');
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}
