const calendar = document.getElementById('calendar');
const monthElement = document.getElementById('month');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const datesElement = document.getElementById('dates');

// 存储赛程数据
const events = {
    "2025-01-01": { sport: '澳网', time: '11:30', description: '对手A vs 对手B,地点A', predicted: null },
    "2025-01-02": { sport: 'F1', time: '14:00', description: '赛道A', predicted: null },
    "2025-01-03": { sport: '英超', time: '23:00', description: '球队A vs 球队B,地点B', predicted: null }
};
let currentDate = new Date(); // 当前日期

// 你的API密钥
const apiToken = 'bef3aa384fe74395abdddcfdcfd36be4';

// 英超联赛的API端点
const apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/matches';

fetch(apiUrl, {
    headers: {
        'X-Auth-Token': apiToken
    }
})
.then(response => response.json())
.then(data => {
    // 输出数据，查看API返回格式
    console.log('Fetched data:', data);

    // 解析返回的JSON数据
    const matches = data.matches;

    // 获取当前日期（今天）
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // 格式化成 "YYYY-MM-DD"

    // 过滤掉比赛日期早于今天的比赛
    const futureMatches = matches.filter(match => match.utcDate >= today.toISOString());

    // 获取展示比赛的容器
    const matchListElement = document.getElementById('upcoming-list');
    
    // 清空之前的内容
    matchListElement.innerHTML = '';

    // 遍历未来的比赛并渲染到页面，限制为10场
    futureMatches.slice(0, 10).forEach(match => {
        // 创建一个外框来包裹每场比赛
        const matchItemContainer = document.createElement('div');
        matchItemContainer.classList.add('match-item-container'); // 添加样式类

        // 创建比赛项并添加到外框
        const matchItem = document.createElement('div');
        // 获取去掉"FC"的球队名
        const homeTeam = match.homeTeam.name.replace(' FC', '');
        const awayTeam = match.awayTeam.name.replace(' FC', '');
        const matchTime = new Date(match.utcDate).toLocaleString();

        // 设置文本内容，并强制换行
        matchItem.innerHTML = `${homeTeam} vs ${awayTeam} <br> ${matchTime}`;
        matchItem.classList.add('match-item'); // 添加样式类

        // 将比赛项添加到容器中
        matchItemContainer.appendChild(matchItem);

        // 将比赛容器添加到比赛列表中
        matchListElement.appendChild(matchItemContainer);
    });
})
.catch(error => {
    console.error('Error fetching Premier League matches:', error);
});



function renderCalendar() {
    // 显示当前月份
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    monthElement.textContent = `${year}年 ${month + 1}月`;

    // 获取当前月的第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取今天的日期
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 清空旧的日期
    datesElement.innerHTML = '';
    
    // 填充空白日期
    for (let i = 0; i < firstDay.getDay(); i++) {
        datesElement.innerHTML += `<div></div>`;
    }

    // 填充实际日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = events[dateString];
        const eventDescription = event ? `${event.sport}<br>${event.time}` : ''; // 只显示运动项目和时间

        const isToday = dateString === todayString ? 'today' : '';  // 判断是否为今天

        datesElement.innerHTML += `
            <div class="date ${isToday}" onclick="showPredictionForm('${dateString}')">
                ${day}
                <div class="event">${eventDescription}</div>
            </div>
        `;
    }
}

function showPredictionForm(dateString) {
    const event = events[dateString];
    if (event) {
        const predicted = event.predicted ? event.predicted : '未预测';
        alert(`赛事：${event.sport}，时间：${event.time}，预测：${predicted}`);
    }
}
function renderPendingPredictions() {
    const pendingList = document.getElementById('upcoming-list');
    pendingList.innerHTML = ''; // 清空旧的待预测列表
}

// 绑定左右切换按钮
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// 在渲染日历后，调用渲染待预测赛事的函数
renderCalendar();
renderPendingPredictions();


