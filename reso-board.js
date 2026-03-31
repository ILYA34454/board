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
            { title: 'Лидеры по маржинальности',  img3d: 'https://i.ibb.co/h5MSb1Z/Frame-2131331987.png', indices: [0, 1] },
            { title: 'Лидеры по объёму продаж',  img3d: 'https://i.ibb.co/4wmF2L8d/Frame-2131331988.png', indices: [2, 3] }
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

    let groupTableData = [];
    let groupTablePage = 1;
    let groupTablePageSize = 10;


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
                ? 'https://i.ibb.co/WJR5CS5/Frame-2131331990.png'
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
        groupTableData = OVERALL_GROUPS[selectedMonth] || OVERALL_GROUPS[CURRENT_MONTH] || [];
        groupTablePage = 1;

        // Wire page size
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

        if (pStart > 1) {
            pg.appendChild(mkGroupPageBtn(1));
            if (pStart > 2) pg.appendChild(mkDots());
        }
        for (let p = pStart; p <= pEnd; p++) pg.appendChild(mkGroupPageBtn(p));
        if (pEnd < totalPages) {
            if (pEnd < totalPages - 1) pg.appendChild(mkDots());
            pg.appendChild(mkGroupPageBtn(totalPages));
        }

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
