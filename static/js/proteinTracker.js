// State variables
let dailyTarget = 60;
let records = [];

// DOM Elements
const totalDisplay = document.getElementById('total');
const targetTextDisplay = document.getElementById('targetText');
const circleProgress = document.getElementById('circleProgress');
const percentageText = document.getElementById('percentageText');
const statusMsg = document.getElementById('statusMsg');
const recordList = document.getElementById('recordList');
const foodNameInput = document.getElementById('foodName');
const proteinAmountInput = document.getElementById('proteinAmount');
const targetDialog = document.getElementById('targetDialog');
const newTargetInput = document.getElementById('newTargetInput');

// Circle Circumference
const CIRCUMFERENCE = 2 * Math.PI * 70; // r = 70, approx 439.82

// Food name emoji mapping dictionary
const emojiMap = [
    { keywords: ['雞', 'chicken', '🍗'], emoji: '🍗' },
    { keywords: ['肉', 'beef', 'pork', 'steak', '🥩'], emoji: '🥩' },
    { keywords: ['蛋', 'egg', '🥚'], emoji: '🥚' },
    { keywords: ['奶', 'milk', 'cheese', '🥛', '起司', '起司'], emoji: '🥛' },
    { keywords: ['粉', 'protein powder', 'shake', '乳清', '🥤'], emoji: '🥤' },
    { keywords: ['魚', 'fish', '🐟'], emoji: '🐟' },
    { keywords: ['蝦', 'shrimp', '🦐'], emoji: '🦐' },
    { keywords: ['豆', 'tofu', 'soy', 'bean', '🫘', '豆腐'], emoji: '🫘' },
    { keywords: ['堅果', 'nut', '花生', '🥜'], emoji: '🥜' }
];

// Initialize application
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();
});

// Helper: Get local YYYY-MM-DD date string
function getLocalDateString(dateObj = new Date()) {
    return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
}

// Helper: Format date for display
function formatDisplayDate(dateStr) {
    const today = getLocalDateString();
    
    // Calculate yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = getLocalDateString(d);
    
    if (dateStr === today) {
        return '今天';
    } else if (dateStr === yesterday) {
        return '昨天';
    }
    
    // Format YYYY-MM-DD to MM月DD日
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parseInt(parts[1])} 月 ${parseInt(parts[2])} 日`;
    }
    return dateStr;
}

// Load data from localStorage
function loadData() {
    const savedTarget = localStorage.getItem('protein_daily_target');
    if (savedTarget) {
        dailyTarget = parseFloat(savedTarget);
    }
    
    const savedRecords = localStorage.getItem('protein_records');
    if (savedRecords) {
        records = JSON.parse(savedRecords);
        // Migration for backward compatibility
        let migrated = false;
        records.forEach(record => {
            if (!record.date) {
                const ts = parseInt(record.id.substring(0, 13));
                if (!isNaN(ts)) {
                    record.date = getLocalDateString(new Date(ts));
                } else {
                    record.date = getLocalDateString();
                }
                migrated = true;
            }
        });
        if (migrated) {
            saveData();
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('protein_daily_target', dailyTarget.toString());
    localStorage.setItem('protein_records', JSON.stringify(records));
}

// Get appropriate emoji for food name
function getFoodEmoji(name) {
    const lowerName = name.toLowerCase();
    for (const item of emojiMap) {
        if (item.keywords.some(kw => lowerName.includes(kw))) {
            return item.emoji;
        }
    }
    return '🥗'; // Default emoji
}

// Update the UI elements based on state
function updateUI() {
    // 1. Filter today's records and calculate current total
    const today = getLocalDateString();
    const todayRecords = records.filter(item => item.date === today);
    const totalProtein = todayRecords.reduce((sum, item) => sum + item.amount, 0);
    // Round to 1 decimal place to prevent JS floating point precision issues
    const roundedTotal = Math.round(totalProtein * 10) / 10;
    
    totalDisplay.innerText = roundedTotal;
    targetTextDisplay.innerText = dailyTarget;

    // 2. Calculate percentage and update circular progress bar
    const percentage = dailyTarget > 0 ? Math.round((roundedTotal / dailyTarget) * 100) : 0;
    percentageText.innerText = `${percentage}%`;

    const progressValue = Math.min(percentage, 100);
    const strokeDashoffset = CIRCUMFERENCE - (progressValue / 100) * CIRCUMFERENCE;
    circleProgress.style.strokeDashoffset = strokeDashoffset;

    // 3. Update status message and progress color based on goal completion
    if (roundedTotal >= dailyTarget) {
        circleProgress.style.stroke = '#10b981'; // Green accent
        statusMsg.innerHTML = '<i class="fa-solid fa-trophy" style="color: #fbbf24;"></i> <span class="completed">太棒了！今日蛋白質已達標！</span>';
    } else {
        circleProgress.style.stroke = '#6366f1'; // Indigo accent
        const remaining = Math.round((dailyTarget - roundedTotal) * 10) / 10;
        statusMsg.innerHTML = `<i class="fa-solid fa-dumbbell"></i> 距離今日目標還差 ${remaining} 克`;
    }

    // 4. Render today's records list and historical stats list
    renderTodayRecords(todayRecords);
    renderHistoryStats();
}

// Render today's records
function renderTodayRecords(todayRecords) {
    recordList.innerHTML = '';
    
    if (todayRecords.length === 0) {
        recordList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-plate-wheat"></i>
                <p>今日尚無飲食記錄</p>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">在上方輸入食物和蛋白質含量，開始記錄吧！</span>
            </div>
        `;
        return;
    }

    // Render list items in reverse chronological order (newest first)
    [...todayRecords].reverse().forEach(record => {
        const li = document.createElement('li');
        li.className = 'record-item';
        li.dataset.id = record.id;
        
        const emoji = getFoodEmoji(record.name);
        
        li.innerHTML = `
            <div class="record-info">
                <div class="record-icon">${emoji}</div>
                <div class="record-name-container">
                    <span class="record-name" title="${escapeHtml(record.name)}">${escapeHtml(record.name)}</span>
                    <span class="record-time"><i class="fa-regular fa-clock"></i> ${record.timestamp}</span>
                </div>
            </div>
            <div class="record-amount-actions">
                <span class="record-amount">${record.amount} 克</span>
                <button class="btn-delete" onclick="deleteRecord('${record.id}', this)" aria-label="刪除記錄">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
        
        recordList.appendChild(li);
    });
}

// Render historical daily stats
function renderHistoryStats() {
    const historyStatsList = document.getElementById('historyStatsList');
    if (!historyStatsList) return;

    historyStatsList.innerHTML = '';

    // Group records by date
    const dateGroups = {};
    records.forEach(record => {
        if (!dateGroups[record.date]) {
            dateGroups[record.date] = 0;
        }
        dateGroups[record.date] += record.amount;
    });

    // Get sorted dates (newest first)
    const sortedDates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) {
        historyStatsList.innerHTML = `
            <div style="text-align: center; padding: 1.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                <i class="fa-solid fa-chart-line" style="opacity: 0.3; font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                尚無歷史統計數據
            </div>
        `;
        return;
    }

    // Render up to 7 days of history
    sortedDates.slice(0, 7).forEach(dateStr => {
        const amount = Math.round(dateGroups[dateStr] * 10) / 10;
        const percentage = dailyTarget > 0 ? Math.round((amount / dailyTarget) * 100) : 0;
        
        const displayDate = formatDisplayDate(dateStr);
        const barClass = percentage >= 100 ? 'completed' : 'normal';
        const progressWidth = Math.min(percentage, 100);

        const statItem = document.createElement('div');
        statItem.className = 'history-stat-item';
        statItem.innerHTML = `
            <div class="history-stat-info">
                <span class="history-stat-date">${displayDate}</span>
                <span class="history-stat-amount">
                    <span>${amount}</span> / ${dailyTarget} 克 (${percentage}%)
                </span>
            </div>
            <div class="history-progress-bar-bg">
                <div class="history-progress-bar-fill ${barClass}" style="width: ${progressWidth}%"></div>
            </div>
        `;
        historyStatsList.appendChild(statItem);
    });
}

// Add a new protein record
function addRecord() {
    const name = foodNameInput.value.trim();
    const amountVal = parseFloat(proteinAmountInput.value);

    if (!name) {
        alert('請輸入食物名稱');
        foodNameInput.focus();
        return;
    }

    if (isNaN(amountVal) || amountVal <= 0) {
        alert('請輸入大於 0 的蛋白質克數');
        proteinAmountInput.focus();
        return;
    }

    // Create timestamp
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newRecord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: name,
        amount: Math.round(amountVal * 10) / 10, // Round to 1 decimal place
        timestamp: timeString,
        date: getLocalDateString() // Set current local date
    };

    records.push(newRecord);
    saveData();
    updateUI();

    // Reset inputs
    foodNameInput.value = '';
    proteinAmountInput.value = '';
    
    // Focus back on food name input for convenience
    foodNameInput.focus();
}

// Delete a specific record with animation
function deleteRecord(id, btnElement) {
    const recordItem = btnElement.closest('.record-item');
    if (!recordItem) return;

    // Add removing class to trigger fade-out & shrink CSS animation
    recordItem.classList.add('removing');

    // Wait for the slideOut animation (250ms) before actual DOM deletion
    setTimeout(() => {
        records = records.filter(record => record.id !== id);
        saveData();
        updateUI();
    }, 250);
}

// Clear all records for today
function clearAllRecords() {
    const today = getLocalDateString();
    const todayRecords = records.filter(item => item.date === today);
    
    if (todayRecords.length === 0) return;
    
    if (confirm('確定要清除今日的所有記錄嗎？\n(您的歷史記錄將會被保留)')) {
        records = records.filter(record => record.date !== today);
        saveData();
        updateUI();
    }
}

// Open Target Dialog Modal
function openTargetDialog() {
    newTargetInput.value = dailyTarget;
    targetDialog.classList.add('active');
    // Auto focus and select target value input
    setTimeout(() => {
        newTargetInput.focus();
        newTargetInput.select();
    }, 100);
}

// Close Target Dialog Modal
function closeTargetDialog() {
    targetDialog.classList.remove('active');
}

// Save the edited target
function saveNewTarget() {
    const value = parseInt(newTargetInput.value);
    
    if (isNaN(value) || value <= 0) {
        alert('請輸入大於 0 的整數作為目標');
        newTargetInput.focus();
        return;
    }

    dailyTarget = value;
    saveData();
    updateUI();
    closeTargetDialog();
}

// Simple HTML escaping helper for security
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Add Keyboard listeners for inputs
foodNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        proteinAmountInput.focus();
    }
});

proteinAmountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addRecord();
    }
});

newTargetInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        saveNewTarget();
    }
});

// Close dialog if user clicks overlay
targetDialog.addEventListener('click', (e) => {
    if (e.target === targetDialog) {
        closeTargetDialog();
    }
});
