const calendar = document.getElementById('calendar');
const monthElement = document.getElementById('month');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const datesElement = document.getElementById('dates');

// 添加弹窗HTML
document.body.insertAdjacentHTML('beforeend', `
<div id="interestModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>选择您的兴趣程度</h2>
        <div id="modalInterestLevels"></div>
    </div>
</div>
`);

// 存储赛程数据
const events = {};
const races={};

let currentDate = new Date(); // 当前日期

// 你的API密钥
const apiToken = 'bef3aa384fe74395abdddcfdcfd36be4';

// 英超联赛的API端点
const apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/matches';

// 在fetch之前添加tab切换相关的代码
const tabButtons = document.querySelectorAll('.tab-btn');
let currentSportType = 'football'; // 默认显示足球

// 处理tab切换
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 移除所有tab的active类
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // 添加当前tab的active类
        button.classList.add('active');

        // 获取当前选中的运动类型
        currentSportType = button.dataset.type;
        
        // 根据不同运动类型显示数据
        const matchListElement = document.getElementById('upcoming-list');
        matchListElement.innerHTML = ''; // 清空当前列表

        if (currentSportType === 'football') {
            // 获取足球数据
            fetchFootballData();
        } else if(currentSportType === 'f1') {
            fetchF1Data();
        }
        else{
            showEmptyState();
        }
    });
});

// 显示空状态的函数
function showEmptyState() {
    const matchListElement = document.getElementById('upcoming-list');
    matchListElement.innerHTML = `
        <div class="empty-state">
            <p>赛事数据正在准备中...</p>
        </div>
    `;
}

// 将原来的fetch代码封装成函数
function fetchFootballData() {
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
        futureMatches.slice(0, 20).forEach(match => {
            const matchItemContainer = document.createElement('div');
            matchItemContainer.classList.add('match-item-container');

            const matchItem = document.createElement('div');
            const homeTeam = match.homeTeam.name.replace(' FC', '');
            const awayTeam = match.awayTeam.name.replace(' FC', '');
            const matchTime = new Date(match.utcDate).toLocaleString();

            matchItem.innerHTML = `${homeTeam} vs ${awayTeam} <br> ${matchTime}`;
            matchItem.classList.add('match-item');

            // 添加显示兴趣度的元素
            const interestDisplay = document.createElement('span');
            interestDisplay.classList.add('interest-display');
            interestDisplay.textContent = match.interestLevel || '未设置';

            // 预测按钮
            const predictButton = document.createElement('button');
            predictButton.textContent = '预测';
            predictButton.classList.add('predict-btn');
            predictButton.style.display = 'block';

            // 点击预测按钮后显示输入框
            predictButton.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const prediction = prompt('请输入您的预测(例如:2-1)');
                if (prediction) {
                    match.prediction = prediction;
                    alert(`预测已记录：${prediction}`);
                }
            });

            // 兴趣按钮
            const interestButton = document.createElement('button');
            interestButton.textContent = '选择兴趣度';
            interestButton.classList.add('interest-btn');
            
            // 修改兴趣按钮的点击事件
            interestButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showInterestModal(match, interestDisplay); // 传入显示元素
            });

            // 添加到容器
            matchItem.appendChild(predictButton);
            matchItem.appendChild(interestButton);
            matchItem.appendChild(interestDisplay); // 添加兴趣度显示
            matchItemContainer.appendChild(matchItem);
            matchListElement.appendChild(matchItemContainer);
        });
    })
    .catch(error => {
        console.error('Error fetching Premier League matches:', error);
        showEmptyState('football');
    });
}

function fetchF1Data() {
    // 本地数据
    const f1Data = [
        {
            raceName: 'Australian Grand Prix',
            circuitName: 'Melbourne Grand Prix Circuit',
            raceDate: '2025-03-14T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Chinese Grand Prix',
            circuitName: 'Shanghai International Circuit',
            raceDate: '2025-03-21T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Japanese Grand Prix',
            circuitName: 'Suzuka Circuit',
            raceDate: '2025-04-04T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Bahrain Grand Prix',
            circuitName: 'Bahrain International Circuit',
            raceDate: '2025-04-11T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Saudi Arabian Grand Prix',
            circuitName: 'Jeddah Street Circuit',
            raceDate: '2025-04-18T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Miami Grand Prix',
            circuitName: 'Miami International Autodrome',
            raceDate: '2025-05-02T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Emilia Romagna Grand Prix',
            circuitName: 'Autodromo Enzo e Dino Ferrari',
            raceDate: '2025-05-16T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Monaco Grand Prix',
            circuitName: 'Circuit de Monaco',
            raceDate: '2025-05-23T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Spanish Grand Prix',
            circuitName: 'Circuit de Barcelona-Catalunya',
            raceDate: '2025-05-30T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Canadian Grand Prix',
            circuitName: 'Circuit Gilles Villeneuve',
            raceDate: '2025-06-13T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Austrian Grand Prix',
            circuitName: 'Red Bull Ring',
            raceDate: '2025-06-27T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'British Grand Prix',
            circuitName: 'Silverstone Circuit',
            raceDate: '2025-07-04T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Belgian Grand Prix',
            circuitName: 'Circuit de Spa-Francorchamps',
            raceDate: '2025-07-25T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Hungarian Grand Prix',
            circuitName: 'Hungaroring',
            raceDate: '2025-08-01T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Dutch Grand Prix',
            circuitName: 'Circuit Zandvoort',
            raceDate: '2025-08-29T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Italian Grand Prix',
            circuitName: 'Autodromo Nazionale Monza',
            raceDate: '2025-09-05T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Azerbaijan Grand Prix',
            circuitName: 'Baku City Circuit',
            raceDate: '2025-09-19T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Singapore Grand Prix',
            circuitName: 'Marina Bay Street Circuit',
            raceDate: '2025-10-03T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'United States Grand Prix',
            circuitName: 'Circuit of the Americas',
            raceDate: '2025-10-17T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Mexican Grand Prix',
            circuitName: 'Autódromo Hermanos Rodríguez',
            raceDate: '2025-10-24T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Brazilian Grand Prix',
            circuitName: 'Interlagos Circuit',
            raceDate: '2025-11-07T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Las Vegas Grand Prix',
            circuitName: 'Las Vegas Street Circuit',
            raceDate: '2025-11-20T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Qatar Grand Prix',
            circuitName: 'Lusail International Circuit',
            raceDate: '2025-11-28T03:00:00Z',
            interestLevel: ''
        },
        {
            raceName: 'Abu Dhabi Grand Prix',
            circuitName: 'Yas Marina Circuit',
            raceDate: '2025-12-05T03:00:00Z',
            interestLevel: ''
        }
    ];

    // 获取当前日期（今天）
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // 格式化成 "YYYY-MM-DD"

    // 过滤掉比赛日期早于今天的比赛
    const futureRaces = f1Data.filter(race => race.raceDate >= today.toISOString());

    // 获取展示比赛的容器
    const raceListElement = document.getElementById('upcoming-list');
    
    // 清空之前的内容
    raceListElement.innerHTML = '';

    // 遍历未来的比赛并渲染到页面，限制为10场
    futureRaces.slice(0, 10).forEach(race => {
        const raceItemContainer = document.createElement('div');
        raceItemContainer.classList.add('match-item-container');

        const raceItem = document.createElement('div');
        const raceName = race.raceName;
        const circuitName = race.circuitName;
        const raceTime = new Date(race.raceDate).toLocaleString();

        raceItem.innerHTML = `${raceName} <br> ${circuitName} <br> ${raceTime}`;
        raceItem.classList.add('match-item');

        // 添加显示兴趣度的元素
        const interestDisplay = document.createElement('span');
        interestDisplay.classList.add('interest-display');
        interestDisplay.textContent = race.interestLevel || '未设置';

        // 预测按钮
        const predictButton = document.createElement('button');
        predictButton.textContent = '预测';
        predictButton.classList.add('predict-btn');
        predictButton.style.display = 'block';

        // 点击预测按钮后显示输入框
        predictButton.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const prediction = prompt('请输入您的预测(例如: 1-0)');
            if (prediction) {
                race.prediction = prediction;
                alert(`预测已记录：${prediction}`);
            }
        });

        // 兴趣按钮
        const interestButton = document.createElement('button');
        interestButton.textContent = '选择兴趣度';
        interestButton.classList.add('interest-btn');
        
        // 修改兴趣按钮的点击事件
        interestButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showInterestModal(race, interestDisplay); // 传入显示元素
        });

        // 添加到容器
        raceItem.appendChild(predictButton);
        raceItem.appendChild(interestButton);
        raceItem.appendChild(interestDisplay); // 添加兴趣度显示
        raceItemContainer.appendChild(raceItem);
        raceListElement.appendChild(raceItemContainer);
    });
}


// 渲染日历
function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    monthElement.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

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
        // 确保日期格式与events中的键完全匹配
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = events[dateString];
        const race = races[dateString];
       
        
        let eventHtml = '';
        let raceHtml = '';
        if (event) {
             // 添加调试日志
        console.log('Checking date:', dateString, 'Event:', event);
            eventHtml = `
                <div class="event">
                    ${event.sport}<br>
                    ${event.time}
                </div>
            `;
        } else {
            eventHtml = `
                <div class="event">
                   
                </div>
            `;
        }

        const isToday1 = dateString === todayString ? 'today' : '';

        datesElement.innerHTML += `
            <div class="date ${isToday1}" onclick="showPredictionForm('${dateString}')">
                ${day}
                ${eventHtml}
                ${raceHtml}
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

// 绑定左右切换按钮
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// 渲染日历
renderCalendar();

// 添加显示弹窗的函数
function showInterestModal(match, displayElement) {
    const modal = document.getElementById('interestModal');
    const modalInterestLevels = document.getElementById('modalInterestLevels');
    const heartLevels = ['❤️❤️❤️', '❤️❤️', '❤️'];
    
    modalInterestLevels.innerHTML = '';
    
    heartLevels.forEach(heartLevel => {
        const heartButton = document.createElement('button');
        heartButton.textContent = heartLevel;
        heartButton.classList.add('interest-btn');
        heartButton.addEventListener('click', () => {
            match.interestLevel = heartLevel;
            displayElement.textContent = heartLevel;

            // 如果是2颗心或3颗心，添加到日历
            if (heartLevel === '❤️❤️' || heartLevel === '❤️❤️❤️') {
                const matchDate = new Date(match.utcDate);
                const dateString = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}-${String(matchDate.getDate()).padStart(2, '0')}`;
                
                console.log('Adding event for date:', dateString);
                console.log('Match date:', matchDate);
                console.log('Current events:', events);
                
                const homeTeam = match.homeTeam.name.replace(' FC', '');
                const awayTeam = match.awayTeam.name.replace(' FC', '');
                
                events[dateString] = {
                    sport: `${homeTeam} vs ${awayTeam}`,
                    time: new Date(match.utcDate).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    description: `${homeTeam} vs ${awayTeam}`,
                    predicted: match.prediction || null,
                    interestLevel: heartLevel
                };
                
                console.log('Updated events:', events);
                console.log('Event added:', events[dateString]);
                
                renderCalendar();
            } else {
                // 如果是1颗心，从日历中移除这场比赛（如果存在的话）
                const matchDate = new Date(match.utcDate);
                const dateString = `${matchDate.getFullYear()}-${String(matchDate.getMonth() + 1).padStart(2, '0')}-${String(matchDate.getDate()).padStart(2, '0')}`;
                if (events[dateString]) {
                    delete events[dateString];
                    // renderCalendar();
                }
            }
            
            modal.style.display = "none";
        });
        modalInterestLevels.appendChild(heartButton);
    });

    modal.style.display = "block";

    // 关闭按钮功能
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // 点击弹窗外部关闭
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// 添加空状态的样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        background-color: #f8f8f8;
        border-radius: 8px;
        margin: 20px 0;
    }

    .empty-state p {
        color: #666;
        font-size: 16px;
        margin: 0;
    }
`;
document.head.appendChild(styleSheet);

// 页面加载时默认获取足球数据
fetchFootballData();



