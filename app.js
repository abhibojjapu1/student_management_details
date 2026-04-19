/* ═══════════════════════════════════════════════════
   EduTrack Pro — app.js
   Full Student Management System Logic
═══════════════════════════════════════════════════ */

'use strict';

/* ─── BRANCHES & PROGRAMS DATA ─────────────────────────── */
const BRANCHES = {
  'B.Tech': [
    'CSE', 'CSE - AI & ML', 'CSE - Data Science', 'CSE - Cyber Security',
    'CSE - Cloud Computing', 'CSE - IoT', 'CSE - Full Stack Development',
    'CS & AI', 'CS & Business Systems', 'Artificial Intelligence',
    'Data Science', 'Machine Learning', 'AIML',
    'ECE', 'EEE', 'Mechanical Engineering', 'Civil Engineering',
    'Chemical Engineering', 'Petroleum Engineering', 'Biotechnology',
    'Information Technology', 'Aerospace Engineering', 'Marine Engineering'
  ],
  'M.Tech': [
    'Computer Science & Engineering', 'Artificial Intelligence',
    'Data Science & Analytics', 'Machine Learning', 'Embedded Systems',
    'VLSI Design', 'Power Systems', 'Structural Engineering',
    'Environmental Engineering', 'Software Engineering',
    'Cyber Security', 'Robotics & Automation', 'Communication Systems'
  ],
  'MBA': ['General Management', 'Finance', 'Marketing', 'HR', 'Operations',
    'Business Analytics', 'International Business', 'IT Management'],
  'MCA': ['Computer Applications', 'Data Science', 'Cloud Computing', 'AI & ML'],
  'Ph.D': ['Computer Science', 'Electronics', 'Mechanical', 'Civil',
    'Physics', 'Chemistry', 'Mathematics', 'Management']
};

const BRANCH_SUBJECTS = {
  'CSE': {
    1: [
      {name:'Engineering Mathematics I', code:'MA101', credits:4, type:'Theory'},
      {name:'Engineering Physics', code:'PH101', credits:3, type:'Theory'},
      {name:'Engineering Chemistry', code:'CH101', credits:3, type:'Theory'},
      {name:'Programming in C', code:'CS101', credits:4, type:'Theory'},
      {name:'Programming Lab', code:'CS102', credits:2, type:'Lab'},
      {name:'English Communication', code:'EN101', credits:2, type:'Theory'}
    ],
    2: [
      {name:'Engineering Mathematics II', code:'MA201', credits:4, type:'Theory'},
      {name:'Data Structures', code:'CS201', credits:4, type:'Theory'},
      {name:'Digital Logic Design', code:'CS202', credits:3, type:'Theory'},
      {name:'Object Oriented Programming', code:'CS203', credits:4, type:'Theory'},
      {name:'OOP Lab', code:'CS204', credits:2, type:'Lab'},
      {name:'Data Structures Lab', code:'CS205', credits:2, type:'Lab'}
    ],
    3: [
      {name:'Discrete Mathematics', code:'CS301', credits:4, type:'Theory'},
      {name:'Computer Organization', code:'CS302', credits:3, type:'Theory'},
      {name:'Database Management Systems', code:'CS303', credits:4, type:'Theory'},
      {name:'Operating Systems', code:'CS304', credits:4, type:'Theory'},
      {name:'DBMS Lab', code:'CS305', credits:2, type:'Lab'},
      {name:'OS Lab', code:'CS306', credits:2, type:'Lab'}
    ],
    4: [
      {name:'Analysis of Algorithms', code:'CS401', credits:4, type:'Theory'},
      {name:'Computer Networks', code:'CS402', credits:4, type:'Theory'},
      {name:'Software Engineering', code:'CS403', credits:3, type:'Theory'},
      {name:'Theory of Computation', code:'CS404', credits:4, type:'Theory'},
      {name:'Networks Lab', code:'CS405', credits:2, type:'Lab'},
      {name:'Mini Project', code:'CS406', credits:2, type:'Project'}
    ],
    5: [
      {name:'Compiler Design', code:'CS501', credits:4, type:'Theory'},
      {name:'Machine Learning', code:'CS502', credits:4, type:'Theory'},
      {name:'Web Technologies', code:'CS503', credits:3, type:'Theory'},
      {name:'Cryptography & Security', code:'CS504', credits:3, type:'Theory'},
      {name:'ML Lab', code:'CS505', credits:2, type:'Lab'},
      {name:'Elective I', code:'CS506', credits:3, type:'Elective'}
    ],
    6: [
      {name:'Artificial Intelligence', code:'CS601', credits:4, type:'Theory'},
      {name:'Cloud Computing', code:'CS602', credits:3, type:'Theory'},
      {name:'Big Data Analytics', code:'CS603', credits:3, type:'Theory'},
      {name:'Mobile Application Development', code:'CS604', credits:3, type:'Theory'},
      {name:'AI Lab', code:'CS605', credits:2, type:'Lab'},
      {name:'Elective II', code:'CS606', credits:3, type:'Elective'}
    ],
    7: [
      {name:'Deep Learning', code:'CS701', credits:4, type:'Theory'},
      {name:'Internet of Things', code:'CS702', credits:3, type:'Theory'},
      {name:'Blockchain Technology', code:'CS703', credits:3, type:'Theory'},
      {name:'Project Phase I', code:'CS704', credits:4, type:'Project'},
      {name:'Elective III', code:'CS705', credits:3, type:'Elective'},
      {name:'Elective IV', code:'CS706', credits:3, type:'Elective'}
    ],
    8: [
      {name:'Project Phase II', code:'CS801', credits:10, type:'Project'},
      {name:'Industry Internship', code:'CS802', credits:4, type:'Project'},
      {name:'Technical Seminar', code:'CS803', credits:2, type:'Theory'},
      {name:'Elective V', code:'CS804', credits:3, type:'Elective'}
    ]
  }
};

const GRADE_SCALE = [
  {min:90, grade:'O',  gp:10},
  {min:80, grade:'A1', gp:9},
  {min:70, grade:'A2', gp:8},
  {min:60, grade:'B1', gp:7},
  {min:50, grade:'B2', gp:6},
  {min:40, grade:'C',  gp:5},
  {min:35, grade:'D',  gp:4},
  {min:0,  grade:'F',  gp:0}
];

/* ─── APP STATE ─────────────────────────────────────────── */
let state = {
  students: [],
  subjects: {},    // { branchKey: { sem: [...subjects] } }
  attendance: {},  // { studentId: { date: { subjectCode: 'P'|'A' } } }
  notifications: [],
  currentStudentId: null,  // for edit
  confirmCallback: null,
  editingSubject: null,    // { branch, sem, idx }
  activeView: 'grid'
};

/* Load from localStorage */
function loadState() {
  try {
    const s = localStorage.getItem('edutrack_students');
    if (s) state.students = JSON.parse(s);
    const sub = localStorage.getItem('edutrack_subjects');
    if (sub) state.subjects = JSON.parse(sub);
    const att = localStorage.getItem('edutrack_attendance');
    if (att) state.attendance = JSON.parse(att);
    const notifs = localStorage.getItem('edutrack_notifs');
    if (notifs) state.notifications = JSON.parse(notifs);
  } catch(e) { console.warn('Load error', e); }
}

function saveState() {
  localStorage.setItem('edutrack_students', JSON.stringify(state.students));
  localStorage.setItem('edutrack_subjects', JSON.stringify(state.subjects));
  localStorage.setItem('edutrack_attendance', JSON.stringify(state.attendance));
  localStorage.setItem('edutrack_notifs', JSON.stringify(state.notifications));
}

/* ─── ROLL ID GENERATOR ─────────────────────────────────── */
function generateRollId(program, branch, year, batch) {
  const programCode = {
    'B.Tech':'BT','M.Tech':'MT','MBA':'MB','MCA':'MC','Ph.D':'PD'
  }[program] || 'ST';

  const branchCode = branch
    ? branch.replace(/[^A-Za-z]/g,'').substring(0,3).toUpperCase()
    : 'GEN';

  const batchYear = batch ? batch.split('-')[0].slice(2) : '24';
  const count = state.students.filter(
    s => s.program === program && s.branch === branch
  ).length + 1;
  const seq = String(count).padStart(4, '0');
  return `${programCode}${batchYear}${branchCode}${seq}`;
}

/* ─── TOAST NOTIFICATIONS ───────────────────────────────── */
function showToast(msg, type = 'info') {
  const icons = { success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ─── NOTIFICATIONS ─────────────────────────────────────── */
function addNotification(msg, type = 'info') {
  const icons = { success:'fa-check', info:'fa-info', warn:'fa-exclamation', error:'fa-times' };
  state.notifications.unshift({
    id: Date.now(), msg, type,
    icon: icons[type] || 'fa-bell',
    time: new Date().toLocaleString()
  });
  if (state.notifications.length > 50) state.notifications.pop();
  saveState();
  updateNotifBadge();
  renderNotifications();
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  const count = state.notifications.length;
  badge.textContent = count > 0 ? count : '';
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  if (!state.notifications.length) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-bell-slash"></i><h3>No notifications</h3></div>';
    return;
  }
  list.innerHTML = state.notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon notif-${n.type}"><i class="fas ${n.icon}"></i></div>
      <div>
        <div class="notif-text">${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

/* ─── NAVIGATION ────────────────────────────────────────── */
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard:'Dashboard', students:'Students', attendance:'Attendance',
    marks:'Marks & Grades', subjects:'Subjects',
    reports:'Reports', notifications:'Notifications'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  if (page === 'dashboard') renderDashboard();
  if (page === 'attendance') renderAttendance();
  if (page === 'marks') renderMarksPage();
  if (page === 'subjects') renderSubjectsPage();
  if (page === 'reports') renderReports();
  if (page === 'notifications') renderNotifications();
}

/* ─── BRANCH SELECT HELPER ──────────────────────────────── */
function populateBranchSelect(selectId, program) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const branches = program ? (BRANCHES[program] || []) : Object.values(BRANCHES).flat();
  sel.innerHTML = `<option value="">All Branches</option>` +
    branches.map(b => `<option value="${b}">${b}</option>`).join('');
}

function populateAllBranchSelects() {
  // Filter selects
  const filterBranch = document.getElementById('filterBranch');
  if (filterBranch) {
    const allBranches = [...new Set(Object.values(BRANCHES).flat())];
    filterBranch.innerHTML = `<option value="">All Branches</option>` +
      allBranches.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  const attBranch = document.getElementById('attBranch');
  if (attBranch) {
    const allBranches = [...new Set(Object.values(BRANCHES).flat())];
    attBranch.innerHTML = `<option value="">All Branches</option>` +
      allBranches.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  const subjectBranch = document.getElementById('subjectBranchSel');
  if (subjectBranch) {
    const allBranches = [...new Set(Object.values(BRANCHES).flat())];
    subjectBranch.innerHTML = `<option value="">Select Branch</option>` +
      allBranches.map(b => `<option value="${b}">${b}</option>`).join('');
  }
}

/* ─── AVATAR COLORS ─────────────────────────────────────── */
const AVATAR_COLORS = [
  {bg:'rgba(245,197,24,0.2)', color:'#F5C518'},
  {bg:'rgba(0,201,167,0.2)', color:'#00C9A7'},
  {bg:'rgba(132,94,247,0.2)', color:'#845EF7'},
  {bg:'rgba(51,154,240,0.2)', color:'#339AF0'},
  {bg:'rgba(255,107,107,0.2)', color:'#FF6B6B'},
  {bg:'rgba(240,101,149,0.2)', color:'#F06595'},
  {bg:'rgba(255,146,43,0.2)', color:'#FF922B'},
  {bg:'rgba(32,201,151,0.2)', color:'#20C997'},
];
function getAvatarColor(name) {
  let h = 0;
  for (let c of (name || 'X')) h = (h*31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function getColorIdx(name) {
  let h = 0;
  for (let c of (name || 'X')) h = (h*31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(h) % 12;
}

/* ─── GRADE CALCULATION ─────────────────────────────────── */
function getGrade(marks) {
  for (const g of GRADE_SCALE) {
    if (marks >= g.min) return g;
  }
  return GRADE_SCALE[GRADE_SCALE.length - 1];
}

function calcCGPA(student) {
  if (!student.marks || !Object.keys(student.marks).length) return null;
  let totalCredits = 0, totalPoints = 0;
  for (const sem of Object.values(student.marks)) {
    for (const sub of sem) {
      if (sub.total !== undefined && sub.total !== '') {
        const total = Number(sub.total);
        const credits = Number(sub.credits) || 3;
        const gradeObj = getGrade(total);
        totalPoints += gradeObj.gp * credits;
        totalCredits += credits;
      }
    }
  }
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : null;
}

function calcAttendancePct(student) {
  const att = state.attendance[student.id];
  if (!att) return student.attendance || null;
  let present = 0, total = 0;
  for (const day of Object.values(att)) {
    for (const status of Object.values(day)) {
      total++;
      if (status === 'P') present++;
    }
  }
  return total ? Math.round((present / total) * 100) : (student.attendance || null);
}

/* ─── STUDENT RENDER ────────────────────────────────────── */
function getFilteredStudents() {
  const prog = document.getElementById('filterProgram')?.value || '';
  const year = document.getElementById('filterYear')?.value || '';
  const branch = document.getElementById('filterBranch')?.value || '';

  return state.students.filter(s => {
    if (prog && s.program !== prog) return false;
    if (year && String(s.year) !== year) return false;
    if (branch && s.branch !== branch) return false;
    return true;
  });
}

function renderStudents() {
  const students = getFilteredStudents();
  const grid = document.getElementById('studentGrid');
  const tbody = document.getElementById('studentTableBody');
  const empty = document.getElementById('studentsEmpty');

  if (!students.length) {
    grid.innerHTML = '';
    if (tbody) tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // Update marks selector
  const marksSelEl = document.getElementById('marksStudentSel');
  if (marksSelEl) {
    marksSelEl.innerHTML = '<option value="">Select Student</option>' +
      state.students.map(s => `<option value="${s.id}">${s.name} (${s.rollId})</option>`).join('');
  }

  // GRID VIEW
  grid.innerHTML = students.map((s, i) => {
    const col = getAvatarColor(s.name);
    const cgpa = calcCGPA(s);
    const attPct = calcAttendancePct(s);
    const attColor = attPct >= 75 ? '#00C9A7' : attPct >= 60 ? '#F5C518' : '#FF6B6B';
    const colorIdx = getColorIdx(s.name);
    const barColors = ['#F5C518','#00C9A7','#845EF7','#339AF0','#FF6B6B','#F06595','#FF922B','#20C997','#74C0FC','#B197FC','#FFD43B','#63E6BE'];

    return `
    <div class="student-card" onclick="viewStudent('${s.id}')">
      <div class="student-card-accent" style="background:${barColors[colorIdx % barColors.length]}"></div>
      <div class="sc-header">
        <div class="sc-avatar" style="background:${col.bg};color:${col.color}">
          ${getInitials(s.name)}
        </div>
        <div>
          <div class="sc-name">${s.name}</div>
          <div class="sc-id">${s.rollId}</div>
        </div>
      </div>
      <div class="sc-tags">
        <span class="sc-tag tag-program">${s.program || '—'}</span>
        <span class="sc-tag tag-branch">${(s.branch || '—').split(' ').slice(0,2).join(' ')}</span>
        <span class="sc-tag tag-year">Year ${s.year || '—'}</span>
        ${s.batch ? `<span class="sc-tag tag-batch">${s.batch}</span>` : ''}
      </div>
      <div class="sc-metrics">
        <div class="sc-metric">
          <div class="sc-metric-val" style="color:${col.color}">${cgpa || 'N/A'}</div>
          <div class="sc-metric-label">CGPA</div>
        </div>
        <div class="sc-metric">
          <div class="sc-metric-val" style="color:${attColor}">${attPct !== null ? attPct + '%' : 'N/A'}</div>
          <div class="sc-metric-label">Attendance</div>
          ${attPct !== null ? `<div class="sc-att-bar"><div class="sc-att-fill" style="width:${attPct}%;background:${attColor}"></div></div>` : ''}
        </div>
      </div>
      <div class="sc-actions" onclick="event.stopPropagation()">
        <button class="sc-action-btn" onclick="viewStudent('${s.id}')"><i class="fas fa-eye"></i> View</button>
        <button class="sc-action-btn edit" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="sc-action-btn delete" onclick="confirmDelete('${s.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');

  // TABLE VIEW
  if (tbody) {
    tbody.innerHTML = students.map(s => {
      const cgpa = calcCGPA(s);
      const attPct = calcAttendancePct(s);
      const attColor = attPct >= 75 ? '#00C9A7' : attPct >= 60 ? '#F5C518' : '#FF6B6B';
      return `
      <tr>
        <td><span style="color:#F5C518;font-weight:700">${s.rollId}</span></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.program || '—'}</td>
        <td>${s.branch || '—'}</td>
        <td>Year ${s.year || '—'} / Sem ${s.semester || '—'}</td>
        <td>${cgpa || 'N/A'}</td>
        <td style="color:${attColor}">${attPct !== null ? attPct + '%' : 'N/A'}</td>
        <td>
          <button class="sc-action-btn" onclick="viewStudent('${s.id}')" style="flex:none;padding:5px 10px"><i class="fas fa-eye"></i></button>
          <button class="sc-action-btn edit" onclick="editStudent('${s.id}')" style="flex:none;padding:5px 10px"><i class="fas fa-edit"></i></button>
          <button class="sc-action-btn delete" onclick="confirmDelete('${s.id}')" style="flex:none;padding:5px 10px"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }
}

/* ─── DASHBOARD ─────────────────────────────────────────── */
function renderDashboard() {
  const students = state.students;
  document.getElementById('statTotal').textContent = students.length;
  document.getElementById('statBtech').textContent = students.filter(s => s.program === 'B.Tech').length;
  document.getElementById('statMtech').textContent = students.filter(s => s.program === 'M.Tech').length;

  // Avg attendance
  const attVals = students.map(s => calcAttendancePct(s)).filter(v => v !== null);
  const avgAtt = attVals.length ? Math.round(attVals.reduce((a, b) => a + b, 0) / attVals.length) : 0;
  document.getElementById('statAttendance').textContent = avgAtt + '%';

  // Branch bars
  const branchCounts = {};
  for (const s of students) {
    const key = s.branch || 'Unknown';
    branchCounts[key] = (branchCounts[key] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(branchCounts), 1);
  const barColors = ['#F5C518','#00C9A7','#845EF7','#339AF0','#FF6B6B','#F06595','#FF922B','#20C997'];
  const barsEl = document.getElementById('branchBars');

  if (!Object.keys(branchCounts).length) {
    barsEl.innerHTML = '<div class="empty-state-sm">No branch data</div>';
  } else {
    const sorted = Object.entries(branchCounts).sort((a,b) => b[1]-a[1]).slice(0, 8);
    barsEl.innerHTML = sorted.map(([branch, count], i) => `
      <div class="branch-bar-item">
        <div class="branch-bar-label">
          <strong>${branch}</strong>
          <span>${count} student${count !== 1 ? 's' : ''}</span>
        </div>
        <div class="branch-bar-track">
          <div class="branch-bar-fill bar-${i}" style="width:${Math.round(count/maxCount*100)}%"></div>
        </div>
      </div>
    `).join('');
  }

  // Recent students
  const recent = [...students].slice(-5).reverse();
  const recentEl = document.getElementById('recentList');
  if (!recent.length) {
    recentEl.innerHTML = '<div class="empty-state-sm">No students yet</div>';
  } else {
    recentEl.innerHTML = recent.map(s => {
      const col = getAvatarColor(s.name);
      return `<div class="recent-item">
        <div class="ri-avatar" style="background:${col.bg};color:${col.color}">${getInitials(s.name)}</div>
        <div>
          <div class="ri-name">${s.name}</div>
          <div class="ri-sub">${s.branch || s.program || '—'}</div>
        </div>
        <div class="ri-id">${s.rollId}</div>
      </div>`;
    }).join('');
  }

  // Top performers
  const withCGPA = students.map(s => ({...s, cgpa: parseFloat(calcCGPA(s))}))
    .filter(s => !isNaN(s.cgpa))
    .sort((a,b) => b.cgpa - a.cgpa)
    .slice(0, 5);
  const topEl = document.getElementById('topList');
  if (!withCGPA.length) {
    topEl.innerHTML = '<div class="empty-state-sm">No grade data yet</div>';
  } else {
    topEl.innerHTML = withCGPA.map((s, i) => {
      const col = getAvatarColor(s.name);
      return `<div class="recent-item">
        <div class="ri-avatar" style="background:${col.bg};color:${col.color}">${i+1}</div>
        <div>
          <div class="ri-name">${s.name}</div>
          <div class="ri-sub">${s.branch || '—'}</div>
        </div>
        <div class="ri-id" style="color:#00C9A7">CGPA: ${s.cgpa}</div>
      </div>`;
    }).join('');
  }

  // Attendance alerts (< 75%)
  const alerts = students
    .map(s => ({...s, att: calcAttendancePct(s)}))
    .filter(s => s.att !== null && s.att < 75)
    .sort((a,b) => a.att - b.att)
    .slice(0, 5);
  const alertEl = document.getElementById('alertList');
  if (!alerts.length) {
    alertEl.innerHTML = '<div class="empty-state-sm">✅ All good! No low attendance.</div>';
  } else {
    alertEl.innerHTML = alerts.map(s => `
      <div class="recent-item">
        <div class="ri-avatar" style="background:rgba(255,107,107,0.15);color:#FF6B6B">⚠</div>
        <div>
          <div class="ri-name">${s.name}</div>
          <div class="ri-sub">${s.branch || '—'}</div>
        </div>
        <div class="ri-id" style="color:#FF6B6B">${s.att}%</div>
      </div>
    `).join('');
  }
}

/* ─── ATTENDANCE ────────────────────────────────────────── */
function renderAttendance() {
  const date = document.getElementById('attendanceDate').value || new Date().toISOString().slice(0,10);
  document.getElementById('attendanceDate').value = date;
  const branchFilter = document.getElementById('attBranch')?.value || '';
  const attGrid = document.getElementById('attGrid');

  let students = state.students;
  if (branchFilter) students = students.filter(s => s.branch === branchFilter);

  if (!students.length) {
    attGrid.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-check"></i><h3>No students found</h3><p>Add students first</p></div>';
    return;
  }

  attGrid.innerHTML = students.map(s => {
    const att = (state.attendance[s.id] || {})[date] || {};
    const pct = calcAttendancePct(s) || 0;
    const col = getAvatarColor(s.name);
    const isPresent = att.overall === 'P';
    const attColor = pct >= 75 ? '#00C9A7' : pct >= 60 ? '#F5C518' : '#FF6B6B';
    return `
    <div class="att-card">
      <div class="ri-avatar" style="background:${col.bg};color:${col.color};width:44px;height:44px;border-radius:12px;font-size:16px">${getInitials(s.name)}</div>
      <div class="att-card-info">
        <div class="att-card-name">${s.name}</div>
        <div class="att-card-sub">${s.rollId} • ${s.branch || s.program || '—'}</div>
        <div style="font-size:11px;margin-top:3px;color:${attColor}">Overall: ${pct}%</div>
      </div>
      <div class="att-toggle-wrap">
        <button class="att-btn ${isPresent ? 'present' : 'absent'}" 
          onclick="toggleAttendance('${s.id}', '${date}', this)">
          ${isPresent ? '✓ Present' : '✗ Absent'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function toggleAttendance(studentId, date, btn) {
  if (!state.attendance[studentId]) state.attendance[studentId] = {};
  if (!state.attendance[studentId][date]) state.attendance[studentId][date] = {};
  const cur = state.attendance[studentId][date].overall;
  const next = cur === 'P' ? 'A' : 'P';
  state.attendance[studentId][date].overall = next;
  btn.className = `att-btn ${next === 'P' ? 'present' : 'absent'}`;
  btn.textContent = next === 'P' ? '✓ Present' : '✗ Absent';
  saveState();
  // Update student default attendance
  const s = state.students.find(x => x.id === studentId);
  if (s) {
    const attData = state.attendance[studentId];
    let total = 0, present = 0;
    for (const day of Object.values(attData)) {
      if (day.overall) { total++; if (day.overall === 'P') present++; }
    }
    s.attendance = total ? Math.round((present/total)*100) : s.attendance;
    saveState();
  }
  renderDashboard();
}

/* ─── MARKS PAGE ────────────────────────────────────────── */
function renderMarksPage() {
  const studentId = document.getElementById('marksStudentSel')?.value || '';
  const sem = document.getElementById('marksSemSel')?.value || '1';
  const content = document.getElementById('marksContent');

  if (!studentId) {
    content.innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><h3>Select a student</h3><p>Choose from above to view marks</p></div>';
    return;
  }

  const student = state.students.find(s => s.id === studentId);
  if (!student) return;

  // Get subjects for this student's branch & sem
  const branchKey = student.branch || 'CSE';
  const branchSubjects = state.subjects[branchKey]?.[sem] ||
    BRANCH_SUBJECTS['CSE']?.[sem] || [];
  const studentMarks = student.marks?.[sem] || [];

  // Merge subjects with marks
  const rows = branchSubjects.map(sub => {
    const existing = studentMarks.find(m => m.code === sub.code) || {};
    return {
      name: sub.name, code: sub.code, credits: sub.credits, type: sub.type,
      internal: existing.internal ?? '', external: existing.external ?? '', total: existing.total ?? '',
      grade: existing.grade || '', gp: existing.gp || ''
    };
  });

  // Add custom marks not tied to subjects
  for (const m of studentMarks) {
    if (!rows.find(r => r.code === m.code)) {
      rows.push({...m});
    }
  }

  if (!rows.length) {
    content.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <h3>No subjects for Sem ${sem}</h3>
        <p>Add subjects in the Subjects section first</p>
        <button class="add-btn" style="margin-top:16px" onclick="navigateTo('subjects')">
          <i class="fas fa-book-open"></i> Manage Subjects
        </button>
      </div>`;
    return;
  }

  const cgpa = calcCGPA(student);
  const semTotal = rows.filter(r => r.total !== '').reduce((a, r) => a + (parseFloat(r.total) || 0), 0);
  const semAvg = rows.filter(r => r.total !== '').length ?
    (semTotal / rows.filter(r => r.total !== '').length).toFixed(1) : 'N/A';

  content.innerHTML = `
    <div class="marks-table-wrap">
      <div class="marks-header">
        <h3>${student.name} — Semester ${sem} Marks</h3>
        <button class="add-btn" onclick="openMarksEdit('${studentId}', '${sem}')">
          <i class="fas fa-edit"></i> Edit Marks
        </button>
      </div>
      <table class="marks-table">
        <thead>
          <tr>
            <th>Subject</th><th>Code</th><th>Credits</th><th>Type</th>
            <th>Internal (40)</th><th>External (60)</th><th>Total (100)</th>
            <th>Grade</th><th>Grade Points</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => {
            const gradeClass = r.grade ? `grade-${r.grade}` : '';
            return `<tr>
              <td>${r.name}</td>
              <td style="color:#F5C518;font-size:12px">${r.code}</td>
              <td>${r.credits}</td>
              <td><span class="subject-tag">${r.type}</span></td>
              <td>${r.internal !== '' ? r.internal : '—'}</td>
              <td>${r.external !== '' ? r.external : '—'}</td>
              <td><strong>${r.total !== '' ? r.total : '—'}</strong></td>
              <td>${r.grade ? `<span class="grade-pill ${gradeClass}">${r.grade}</span>` : '—'}</td>
              <td>${r.gp !== '' ? r.gp : '—'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="cgpa-summary">
      <div class="cgpa-box">
        <div class="cgpa-val">${semAvg}</div>
        <div class="cgpa-label">Sem ${sem} Average</div>
      </div>
      <div class="cgpa-box">
        <div class="cgpa-val" style="color:#00C9A7">${cgpa || 'N/A'}</div>
        <div class="cgpa-label">Overall CGPA</div>
      </div>
      <div class="cgpa-box">
        <div class="cgpa-val" style="color:#845EF7">${rows.filter(r => r.total !== '').length}/${rows.length}</div>
        <div class="cgpa-label">Subjects Graded</div>
      </div>
      <div class="cgpa-box">
        <div class="cgpa-val" style="color:#339AF0">${rows.reduce((a,r)=>a+(Number(r.credits)||0),0)}</div>
        <div class="cgpa-label">Total Credits</div>
      </div>
    </div>`;
}

function openMarksEdit(studentId, sem) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) return;

  const branchKey = student.branch || 'CSE';
  const branchSubjects = state.subjects[branchKey]?.[sem] ||
    BRANCH_SUBJECTS['CSE']?.[sem] || [];
  const studentMarks = student.marks?.[sem] || [];

  const rows = branchSubjects.map(sub => {
    const existing = studentMarks.find(m => m.code === sub.code) || {};
    return {
      name: sub.name, code: sub.code, credits: sub.credits, type: sub.type,
      internal: existing.internal ?? '', external: existing.external ?? ''
    };
  });

  document.getElementById('marksModalBody').innerHTML = `
    <div class="marks-edit-form">
      <div class="marks-edit-row header">
        <div>Subject</div><div>Code</div><div>Cr.</div>
        <div>Internal<br><small style="opacity:.6">/40</small></div>
        <div>External<br><small style="opacity:.6">/60</small></div>
        <div>Total</div>
      </div>
      ${rows.map((r, i) => `
        <div class="marks-edit-row">
          <div title="${r.name}">${r.name.length > 22 ? r.name.slice(0,22)+'…' : r.name}</div>
          <div style="font-size:11px;color:#F5C518">${r.code}</div>
          <div>${r.credits}</div>
          <input type="number" id="int_${i}" value="${r.internal}" min="0" max="40" placeholder="0-40"
            oninput="autoCalcTotal(${i})" data-code="${r.code}" data-credits="${r.credits}" data-name="${r.name}" data-type="${r.type}"/>
          <input type="number" id="ext_${i}" value="${r.external}" min="0" max="60" placeholder="0-60"
            oninput="autoCalcTotal(${i})"/>
          <input type="number" id="tot_${i}" value="${r.internal !== '' && r.external !== '' ? Number(r.internal)+Number(r.external) : ''}" 
            min="0" max="100" placeholder="0-100" readonly style="color:#F5C518"/>
        </div>
      `).join('')}
    </div>
    <input type="hidden" id="marksEditCount" value="${rows.length}"/>
  `;

  document.getElementById('saveMarksBtn').onclick = () => saveMarks(studentId, sem, rows.length);
  openModal('marksModal');
}

function autoCalcTotal(i) {
  const int_ = Number(document.getElementById(`int_${i}`).value) || 0;
  const ext_ = Number(document.getElementById(`ext_${i}`).value) || 0;
  if (document.getElementById(`int_${i}`).value !== '' || document.getElementById(`ext_${i}`).value !== '') {
    document.getElementById(`tot_${i}`).value = int_ + ext_;
  }
}

function saveMarks(studentId, sem, count) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) return;
  if (!student.marks) student.marks = {};

  const branchKey = student.branch || 'CSE';
  const branchSubjects = state.subjects[branchKey]?.[sem] ||
    BRANCH_SUBJECTS['CSE']?.[sem] || [];

  student.marks[sem] = [];
  for (let i = 0; i < count; i++) {
    const intEl = document.getElementById(`int_${i}`);
    if (!intEl) continue;
    const intV = intEl.value;
    const extV = document.getElementById(`ext_${i}`)?.value || '';
    const totV = document.getElementById(`tot_${i}`)?.value || '';
    const code = intEl.dataset.code;
    const credits = Number(intEl.dataset.credits) || 3;
    const name = intEl.dataset.name;
    const type = intEl.dataset.type;
    const total = totV !== '' ? Number(totV) : '';
    const gradeObj = total !== '' ? getGrade(total) : {grade:'', gp:''};
    student.marks[sem].push({
      name, code, credits, type,
      internal: intV !== '' ? Number(intV) : '',
      external: extV !== '' ? Number(extV) : '',
      total, grade: gradeObj.grade, gp: gradeObj.gp
    });
  }

  saveState();
  closeModal('marksModal');
  showToast('Marks saved successfully!', 'success');
  addNotification(`Marks updated for ${student.name} — Semester ${sem}`, 'success');
  renderMarksPage();
  renderDashboard();
}

/* ─── SUBJECTS PAGE ─────────────────────────────────────── */
function renderSubjectsPage() {
  const branch = document.getElementById('subjectBranchSel')?.value || '';
  const sem = document.getElementById('subjectSemSel')?.value || '1';
  const content = document.getElementById('subjectsContent');

  if (!branch) {
    content.innerHTML = '<div class="empty-state"><i class="fas fa-book-open"></i><h3>Select a branch</h3><p>Choose branch and semester to manage subjects</p></div>';
    return;
  }

  const defaultSubs = BRANCH_SUBJECTS['CSE']?.[sem] || [];
  const customSubs = state.subjects[branch]?.[sem] || [];
  const allSubs = customSubs.length ? customSubs : defaultSubs;

  content.innerHTML = `
    <div class="subjects-grid">
      ${allSubs.map((sub, i) => `
        <div class="subject-card">
          <div class="subject-code">${sub.code}</div>
          <div class="subject-name">${sub.name}</div>
          <div class="subject-meta">
            <span class="subject-tag">${sub.credits} Credits</span>
            <span class="subject-tag">${sub.type}</span>
            ${sub.faculty ? `<span class="subject-tag">👤 ${sub.faculty}</span>` : ''}
          </div>
          <div class="subject-actions">
            <button class="sc-action-btn edit" onclick="editSubject('${branch}','${sem}',${i})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="sc-action-btn delete" onclick="deleteSubject('${branch}','${sem}',${i})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('')}
      ${!allSubs.length ? '<div class="empty-state-sm" style="grid-column:span 4">No subjects. Click Add Subject.</div>' : ''}
    </div>`;
}

function editSubject(branch, sem, idx) {
  const allSubs = state.subjects[branch]?.[sem] || BRANCH_SUBJECTS['CSE']?.[sem] || [];
  const sub = allSubs[idx];
  if (!sub) return;
  state.editingSubject = { branch, sem, idx };

  document.getElementById('subjectModalTitle').textContent = 'Edit Subject';
  document.getElementById('sName').value = sub.name || '';
  document.getElementById('sCode').value = sub.code || '';
  document.getElementById('sCredits').value = sub.credits || '';
  document.getElementById('sType').value = sub.type || 'Theory';
  document.getElementById('sFaculty').value = sub.faculty || '';
  openModal('subjectModal');
}

function deleteSubject(branch, sem, idx) {
  if (!state.subjects[branch]?.[sem]) {
    const defaultSubs = [...(BRANCH_SUBJECTS['CSE']?.[sem] || [])];
    if (!state.subjects[branch]) state.subjects[branch] = {};
    state.subjects[branch][sem] = defaultSubs;
  }
  state.subjects[branch][sem].splice(idx, 1);
  saveState();
  renderSubjectsPage();
  showToast('Subject deleted', 'info');
}

/* ─── REPORTS ────────────────────────────────────────────── */
function renderReports() {
  const students = state.students;
  // Overall
  const total = students.length;
  const cgpas = students.map(s => parseFloat(calcCGPA(s))).filter(v => !isNaN(v));
  const avgCGPA = cgpas.length ? (cgpas.reduce((a,b)=>a+b,0)/cgpas.length).toFixed(2) : 'N/A';
  const atts = students.map(s => calcAttendancePct(s)).filter(v => v !== null);
  const avgAtt = atts.length ? Math.round(atts.reduce((a,b)=>a+b,0)/atts.length) : 0;

  document.getElementById('overallStats').innerHTML = `
    ${[
      ['Total Students', total],
      ['Average CGPA', avgCGPA],
      ['Average Attendance', avgAtt + '%'],
      ['B.Tech Students', students.filter(s=>s.program==='B.Tech').length],
      ['M.Tech Students', students.filter(s=>s.program==='M.Tech').length],
      ['Low Attendance (<75%)', atts.filter(a=>a<75).length],
      ['Toppers (CGPA ≥ 9)', cgpas.filter(c=>c>=9).length],
    ].map(([k,v]) => `<div class="report-row"><span class="report-row-label">${k}</span><span class="report-row-val">${v}</span></div>`).join('')}
  `;

  // Branch
  const branches = {};
  for (const s of students) {
    const b = s.branch || 'Unknown';
    if (!branches[b]) branches[b] = 0;
    branches[b]++;
  }
  document.getElementById('branchStats').innerHTML = Object.entries(branches)
    .sort((a,b)=>b[1]-a[1])
    .map(([k,v]) => `<div class="report-row"><span class="report-row-label">${k}</span><span class="report-row-val">${v}</span></div>`)
    .join('') || '<div class="empty-state-sm">No data</div>';

  // Attendance
  document.getElementById('attStats').innerHTML = `
    ${[
      ['≥ 90%', atts.filter(a=>a>=90).length + ' students'],
      ['75% – 90%', atts.filter(a=>a>=75&&a<90).length + ' students'],
      ['60% – 75%', atts.filter(a=>a>=60&&a<75).length + ' students'],
      ['< 60% (Critical)', atts.filter(a=>a<60).length + ' students'],
    ].map(([k,v]) => `<div class="report-row"><span class="report-row-label">${k}</span><span class="report-row-val">${v}</span></div>`).join('')}
  `;

  // Grade distribution
  const gradeCounts = {O:0,A1:0,A2:0,B1:0,B2:0,C:0,D:0,F:0};
  for (const s of students) {
    if (!s.marks) continue;
    for (const sem of Object.values(s.marks)) {
      for (const sub of sem) {
        if (sub.grade && gradeCounts[sub.grade] !== undefined) gradeCounts[sub.grade]++;
      }
    }
  }
  document.getElementById('gradeStats').innerHTML = Object.entries(gradeCounts)
    .map(([k,v]) => `<div class="report-row"><span class="report-row-label">Grade ${k}</span><span class="report-row-val">${v}</span></div>`)
    .join('');
}

/* ─── ADD/EDIT STUDENT MODAL ─────────────────────────────── */
function openAddStudentModal() {
  state.currentStudentId = null;
  document.getElementById('modalTitle').textContent = 'Add New Student';
  clearStudentForm();
  // Auto-gen roll preview on program/branch change
  document.getElementById('fRollId').value = '';
  openModal('studentModal');
  // Switch to first tab
  switchFormTab('basic');
}

function clearStudentForm() {
  ['fFirstName','fLastName','fDob','fPhoto','fEmail','fPhone',
   'fAddress','fGuardian','fGuardianPhone','fAadhar','fRollId','fPrevInst'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['fGender','fBlood','fCategory','fProgram','fBranch','fYear',
   'fSemester','fBatch','fSection','fAdmType','fScholarship'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
}

function editStudent(studentId) {
  const s = state.students.find(x => x.id === studentId);
  if (!s) return;
  state.currentStudentId = studentId;
  document.getElementById('modalTitle').textContent = 'Edit Student';

  const full = s.name.split(' ');
  document.getElementById('fFirstName').value = full[0] || '';
  document.getElementById('fLastName').value = full.slice(1).join(' ') || '';
  document.getElementById('fGender').value = s.gender || '';
  document.getElementById('fDob').value = s.dob || '';
  document.getElementById('fBlood').value = s.blood || '';
  document.getElementById('fCategory').value = s.category || '';
  document.getElementById('fPhoto').value = s.photo || '';
  document.getElementById('fProgram').value = s.program || '';
  // Populate branch
  populateBranchSelect('fBranch', s.program);
  document.getElementById('fBranch').value = s.branch || '';
  document.getElementById('fYear').value = s.year || '';
  document.getElementById('fSemester').value = s.semester || '';
  document.getElementById('fBatch').value = s.batch || '';
  document.getElementById('fSection').value = s.section || '';
  document.getElementById('fAdmType').value = s.admType || 'Regular';
  document.getElementById('fScholarship').value = s.scholarship || 'None';
  document.getElementById('fPrevInst').value = s.prevInst || '';
  document.getElementById('fEmail').value = s.email || '';
  document.getElementById('fPhone').value = s.phone || '';
  document.getElementById('fAddress').value = s.address || '';
  document.getElementById('fGuardian').value = s.guardian || '';
  document.getElementById('fGuardianPhone').value = s.guardianPhone || '';
  document.getElementById('fAadhar').value = s.aadhar || '';
  document.getElementById('fRollId').value = s.rollId || '';

  openModal('studentModal');
  switchFormTab('basic');
}

function saveStudent() {
  const firstName = document.getElementById('fFirstName').value.trim();
  const lastName = document.getElementById('fLastName').value.trim();
  const program = document.getElementById('fProgram').value;
  const branch = document.getElementById('fBranch').value;
  const year = document.getElementById('fYear').value;
  const semester = document.getElementById('fSemester').value;
  const batch = document.getElementById('fBatch').value;
  const email = document.getElementById('fEmail').value.trim();
  const phone = document.getElementById('fPhone').value.trim();

  if (!firstName || !program || !branch || !year) {
    showToast('Please fill required fields: Name, Program, Branch, Year', 'error');
    return;
  }

  const name = `${firstName} ${lastName}`.trim();

  if (state.currentStudentId) {
    // EDIT
    const s = state.students.find(x => x.id === state.currentStudentId);
    if (!s) return;
    s.name = name;
    s.gender = document.getElementById('fGender').value;
    s.dob = document.getElementById('fDob').value;
    s.blood = document.getElementById('fBlood').value;
    s.category = document.getElementById('fCategory').value;
    s.photo = document.getElementById('fPhoto').value;
    s.program = program; s.branch = branch; s.year = year;
    s.semester = semester; s.batch = batch;
    s.section = document.getElementById('fSection').value;
    s.admType = document.getElementById('fAdmType').value;
    s.scholarship = document.getElementById('fScholarship').value;
    s.prevInst = document.getElementById('fPrevInst').value;
    s.email = email; s.phone = phone;
    s.address = document.getElementById('fAddress').value;
    s.guardian = document.getElementById('fGuardian').value;
    s.guardianPhone = document.getElementById('fGuardianPhone').value;
    s.aadhar = document.getElementById('fAadhar').value;

    saveState();
    closeModal('studentModal');
    showToast(`${name} updated successfully!`, 'success');
    addNotification(`Student "${name}" profile updated.`, 'info');
  } else {
    // ADD
    const id = 'STU_' + Date.now();
    const rollId = generateRollId(program, branch, year, batch);
    const student = {
      id, rollId, name,
      gender: document.getElementById('fGender').value,
      dob: document.getElementById('fDob').value,
      blood: document.getElementById('fBlood').value,
      category: document.getElementById('fCategory').value,
      photo: document.getElementById('fPhoto').value,
      program, branch, year, semester, batch,
      section: document.getElementById('fSection').value,
      admType: document.getElementById('fAdmType').value,
      scholarship: document.getElementById('fScholarship').value,
      prevInst: document.getElementById('fPrevInst').value,
      email, phone,
      address: document.getElementById('fAddress').value,
      guardian: document.getElementById('fGuardian').value,
      guardianPhone: document.getElementById('fGuardianPhone').value,
      aadhar: document.getElementById('fAadhar').value,
      attendance: null,
      marks: {},
      createdAt: new Date().toISOString()
    };
    state.students.push(student);
    saveState();
    closeModal('studentModal');
    showToast(`${name} added! Roll ID: ${rollId}`, 'success');
    addNotification(`New student "${name}" enrolled. Roll ID: ${rollId}`, 'success');
  }

  renderStudents();
  renderDashboard();
}

/* ─── VIEW STUDENT ─────────────────────────────────────── */
function viewStudent(studentId) {
  const s = state.students.find(x => x.id === studentId);
  if (!s) return;
  const col = getAvatarColor(s.name);
  const cgpa = calcCGPA(s);
  const attPct = calcAttendancePct(s);
  const attColor = attPct >= 75 ? '#00C9A7' : attPct >= 60 ? '#F5C518' : '#FF6B6B';

  document.getElementById('viewModalBody').innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar" style="background:${col.bg};color:${col.color}">
        ${getInitials(s.name)}
      </div>
      <div class="profile-info">
        <div class="profile-name">${s.name}</div>
        <div class="profile-id">${s.rollId}</div>
        <div class="profile-tags">
          <span class="sc-tag tag-program">${s.program}</span>
          <span class="sc-tag tag-branch">${s.branch}</span>
          <span class="sc-tag tag-year">Year ${s.year} | Sem ${s.semester}</span>
          ${s.batch ? `<span class="sc-tag tag-batch">Batch ${s.batch}</span>` : ''}
          ${s.section ? `<span class="sc-tag" style="background:rgba(132,94,247,.15);color:#845EF7">Sec ${s.section}</span>` : ''}
        </div>
        <div style="display:flex;gap:20px;margin-top:8px">
          <div class="cgpa-box" style="background:rgba(245,197,24,0.1);border-radius:8px;padding:8px 16px;text-align:center">
            <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#F5C518">${cgpa || 'N/A'}</div>
            <div style="font-size:11px;color:#8A9BB5">CGPA</div>
          </div>
          <div class="cgpa-box" style="background:rgba(0,0,0,0.1);border-radius:8px;padding:8px 16px;text-align:center">
            <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:${attColor}">${attPct !== null ? attPct+'%' : 'N/A'}</div>
            <div style="font-size:11px;color:#8A9BB5">Attendance</div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-sections">
      <div class="profile-section">
        <div class="profile-section-title">Personal Info</div>
        ${[
          ['Gender', s.gender || '—'],
          ['Date of Birth', s.dob || '—'],
          ['Blood Group', s.blood || '—'],
          ['Category', s.category || '—'],
        ].map(([k,v]) => `<div class="profile-field"><span class="pf-key">${k}</span><span class="pf-val">${v}</span></div>`).join('')}
      </div>
      <div class="profile-section">
        <div class="profile-section-title">Academic Info</div>
        ${[
          ['Program', s.program || '—'],
          ['Branch', s.branch || '—'],
          ['Year / Semester', `Year ${s.year || '—'} / Sem ${s.semester || '—'}`],
          ['Batch', s.batch || '—'],
          ['Section', s.section || '—'],
          ['Admission Type', s.admType || '—'],
          ['Scholarship', s.scholarship || 'None'],
          ['Previous Institution', s.prevInst || '—'],
        ].map(([k,v]) => `<div class="profile-field"><span class="pf-key">${k}</span><span class="pf-val">${v}</span></div>`).join('')}
      </div>
      <div class="profile-section">
        <div class="profile-section-title">Contact Info</div>
        ${[
          ['Email', s.email || '—'],
          ['Phone', s.phone || '—'],
          ['Address', s.address || '—'],
        ].map(([k,v]) => `<div class="profile-field"><span class="pf-key">${k}</span><span class="pf-val">${v}</span></div>`).join('')}
      </div>
      <div class="profile-section">
        <div class="profile-section-title">Guardian & Documents</div>
        ${[
          ['Guardian Name', s.guardian || '—'],
          ['Guardian Phone', s.guardianPhone || '—'],
          ['Aadhar No.', s.aadhar || '—'],
          ['Student ID', s.rollId],
          ['Enrolled On', s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'],
        ].map(([k,v]) => `<div class="profile-field"><span class="pf-key">${k}</span><span class="pf-val">${v}</span></div>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="add-btn" onclick="closeModal('viewModal');editStudent('${s.id}')">
        <i class="fas fa-edit"></i> Edit Profile
      </button>
      <button class="outline-btn" onclick="closeModal('viewModal');navigateTo('marks');document.getElementById('marksStudentSel').value='${s.id}';renderMarksPage()">
        <i class="fas fa-chart-bar"></i> View Marks
      </button>
      <button class="outline-btn" onclick="closeModal('viewModal');navigateTo('attendance')">
        <i class="fas fa-calendar-check"></i> Attendance
      </button>
    </div>
  `;

  openModal('viewModal');
}

/* ─── DELETE ─────────────────────────────────────────────── */
function confirmDelete(studentId) {
  const s = state.students.find(x => x.id === studentId);
  if (!s) return;
  document.getElementById('confirmMsg').textContent =
    `Are you sure you want to delete "${s.name}" (${s.rollId})? This cannot be undone.`;
  state.confirmCallback = () => {
    state.students = state.students.filter(x => x.id !== studentId);
    delete state.attendance[studentId];
    saveState();
    renderStudents();
    renderDashboard();
    showToast(`${s.name} deleted.`, 'info');
    addNotification(`Student "${s.name}" (${s.rollId}) was removed.`, 'warn');
  };
  openModal('confirmModal');
}

/* ─── MODALS ─────────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── FORM TABS ─────────────────────────────────────────── */
function switchFormTab(tabId) {
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ftab-content').forEach(t => t.classList.remove('active'));
  document.querySelector(`.ftab[data-tab="${tabId}"]`)?.classList.add('active');
  document.getElementById(`ftab-${tabId}`)?.classList.add('active');
}

/* ─── SEARCH ─────────────────────────────────────────────── */
function handleSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!query.trim()) { resultsEl.classList.remove('open'); return; }

  const q = query.toLowerCase();
  const results = state.students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.rollId?.toLowerCase().includes(q) ||
    s.branch?.toLowerCase().includes(q) ||
    s.email?.toLowerCase().includes(q)
  ).slice(0, 6);

  if (!results.length) {
    resultsEl.innerHTML = '<div class="search-result-item">No results found</div>';
  } else {
    resultsEl.innerHTML = results.map(s => {
      const col = getAvatarColor(s.name);
      return `<div class="search-result-item" onclick="viewStudent('${s.id}');document.getElementById('globalSearch').value='';document.getElementById('searchResults').classList.remove('open')">
        <div class="ri-avatar" style="background:${col.bg};color:${col.color};width:28px;height:28px;font-size:11px">${getInitials(s.name)}</div>
        <div>
          <div style="font-size:13px;font-weight:500">${s.name}</div>
          <div class="sri-id">${s.rollId} • ${s.branch || s.program}</div>
        </div>
      </div>`;
    }).join('');
  }
  resultsEl.classList.add('open');
}

/* ─── INIT ───────────────────────────────────────────────── */
function init() {
  loadState();
  populateAllBranchSelects();
  renderStudents();
  renderDashboard();
  updateNotifBadge();

  // Set today's date for attendance
  document.getElementById('attendanceDate').value = new Date().toISOString().slice(0, 10);

  /* ── Navigation ── */
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.page);
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });

  /* ── Hamburger ── */
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  /* ── Add Student Buttons ── */
  document.getElementById('addStudentBtn').addEventListener('click', openAddStudentModal);
  document.getElementById('topAddBtn').addEventListener('click', () => {
    navigateTo('students');
    setTimeout(openAddStudentModal, 100);
  });

  /* ── Save Student ── */
  document.getElementById('saveStudentBtn').addEventListener('click', saveStudent);

  /* ── Close modals ── */
  document.getElementById('closeStudentModal').addEventListener('click', () => closeModal('studentModal'));
  document.getElementById('cancelStudentModal').addEventListener('click', () => closeModal('studentModal'));
  document.getElementById('closeViewModal').addEventListener('click', () => closeModal('viewModal'));
  document.getElementById('closeSubjectModal').addEventListener('click', () => closeModal('subjectModal'));
  document.getElementById('cancelSubjectModal').addEventListener('click', () => closeModal('subjectModal'));
  document.getElementById('closeMarksModal').addEventListener('click', () => closeModal('marksModal'));
  document.getElementById('cancelMarksModal').addEventListener('click', () => closeModal('marksModal'));

  /* ── Confirm dialog ── */
  document.getElementById('confirmYes').addEventListener('click', () => {
    if (state.confirmCallback) { state.confirmCallback(); state.confirmCallback = null; }
    closeModal('confirmModal');
  });
  document.getElementById('confirmNo').addEventListener('click', () => closeModal('confirmModal'));

  /* ── Close modal on overlay click ── */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  /* ── Form tabs ── */
  document.querySelectorAll('.ftab').forEach(tab => {
    tab.addEventListener('click', () => switchFormTab(tab.dataset.tab));
  });

  /* ── Program → Branch cascading ── */
  document.getElementById('fProgram').addEventListener('change', function() {
    populateBranchSelect('fBranch', this.value);
    // Auto-fill roll ID preview
    const year = document.getElementById('fYear').value;
    const batch = document.getElementById('fBatch').value;
    if (this.value && year) {
      const branch = document.getElementById('fBranch').value;
      if (branch) document.getElementById('fRollId').value = generateRollId(this.value, branch, year, batch);
    }
  });
  document.getElementById('fBranch').addEventListener('change', function() {
    const prog = document.getElementById('fProgram').value;
    const year = document.getElementById('fYear').value;
    const batch = document.getElementById('fBatch').value;
    if (prog && this.value && year) {
      document.getElementById('fRollId').value = generateRollId(prog, this.value, year, batch);
    }
  });
  document.getElementById('fYear').addEventListener('change', function() {
    const prog = document.getElementById('fProgram').value;
    const branch = document.getElementById('fBranch').value;
    const batch = document.getElementById('fBatch').value;
    if (prog && branch) {
      document.getElementById('fRollId').value = generateRollId(prog, branch, this.value, batch);
    }
  });

  /* ── Filters ── */
  ['filterProgram', 'filterYear', 'filterBranch'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', renderStudents);
  });

  /* ── View toggle ── */
  document.getElementById('viewGrid').addEventListener('click', () => {
    state.activeView = 'grid';
    document.getElementById('viewGrid').classList.add('active');
    document.getElementById('viewList').classList.remove('active');
    document.getElementById('studentGrid').classList.remove('hidden');
    document.getElementById('studentTableWrap').classList.add('hidden');
  });
  document.getElementById('viewList').addEventListener('click', () => {
    state.activeView = 'list';
    document.getElementById('viewList').classList.add('active');
    document.getElementById('viewGrid').classList.remove('active');
    document.getElementById('studentGrid').classList.add('hidden');
    document.getElementById('studentTableWrap').classList.remove('hidden');
  });

  /* ── Search ── */
  document.getElementById('globalSearch').addEventListener('input', e => handleSearch(e.target.value));
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) {
      document.getElementById('searchResults').classList.remove('open');
    }
  });

  /* ── Attendance date change ── */
  document.getElementById('attendanceDate').addEventListener('change', renderAttendance);
  document.getElementById('attBranch').addEventListener('change', renderAttendance);

  /* ── Marks selectors ── */
  document.getElementById('marksStudentSel').addEventListener('change', renderMarksPage);
  document.getElementById('marksSemSel').addEventListener('change', renderMarksPage);

  /* ── Subjects selectors ── */
  document.getElementById('subjectBranchSel').addEventListener('change', renderSubjectsPage);
  document.getElementById('subjectSemSel').addEventListener('change', renderSubjectsPage);

  /* ── Add Subject ── */
  document.getElementById('addSubjectBtn').addEventListener('click', () => {
    state.editingSubject = null;
    document.getElementById('subjectModalTitle').textContent = 'Add Subject';
    ['sName','sCode','sCredits','sFaculty'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('sType').selectedIndex = 0;
    openModal('subjectModal');
  });

  /* ── Save Subject ── */
  document.getElementById('saveSubjectBtn').addEventListener('click', () => {
    const branch = document.getElementById('subjectBranchSel').value;
    const sem = document.getElementById('subjectSemSel').value;
    const name = document.getElementById('sName').value.trim();
    const code = document.getElementById('sCode').value.trim();
    const credits = Number(document.getElementById('sCredits').value) || 3;
    const type = document.getElementById('sType').value;
    const faculty = document.getElementById('sFaculty').value.trim();

    if (!name || !code || !branch) {
      showToast('Please fill Subject Name, Code and select a Branch', 'error');
      return;
    }

    if (!state.subjects[branch]) state.subjects[branch] = {};
    if (!state.subjects[branch][sem]) {
      // Copy defaults
      state.subjects[branch][sem] = [...(BRANCH_SUBJECTS['CSE']?.[sem] || [])];
    }

    if (state.editingSubject) {
      const { idx } = state.editingSubject;
      state.subjects[branch][sem][idx] = { name, code, credits, type, faculty };
      showToast('Subject updated!', 'success');
    } else {
      state.subjects[branch][sem].push({ name, code, credits, type, faculty });
      showToast('Subject added!', 'success');
    }

    saveState();
    closeModal('subjectModal');
    renderSubjectsPage();
  });

  /* ── Clear Notifications ── */
  document.getElementById('clearNotifs').addEventListener('click', () => {
    state.notifications = [];
    saveState();
    updateNotifBadge();
    renderNotifications();
    showToast('Notifications cleared', 'info');
  });

  /* ── Keyboard shortcut: Escape to close modals ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
  });

  // Welcome notification
  if (!state.notifications.length) {
    addNotification('Welcome to EduTrack Pro! Start by adding students.', 'info');
  }
}

document.addEventListener('DOMContentLoaded', init);
