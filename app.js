// AI产业日报 - Frontend JavaScript

const DATA_FILE = 'data/news.json';

function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('zh-CN', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getCategoryClass(category) {
    const categoryMap = {
        '大公司': 'company',
        'AI产品': 'product',
        '融资': 'funding',
        '政策': 'policy',
        '研究': 'research',
        '汽车': 'auto',
        '消费': 'consumer',
        '娱乐': 'entertainment',
        '其他': 'default'
    };
    return categoryMap[category] || 'default';
}

function createNewsCard(news) {
    const categoryClass = getCategoryClass(news.category);
    return `
        <article class="news-card">
            <span class="category">${news.category}</span>
            <h3>${news.title}</h3>
            <p class="summary">${news.summary}</p>
            <div class="source-row">
                <span class="source">📡 ${news.source}</span>
                <span class="time">${news.time}</span>
            </div>
        </article>
    `;
}

async function loadNews() {
    const container = document.getElementById('news-container');
    const dateEl = document.getElementById('current-date');
    const countEl = document.getElementById('news-count');
    const updateEl = document.getElementById('last-update');
    const sourceEl = document.getElementById('data-source');
    
    try {
        // Update date display
        dateEl.textContent = formatDate(new Date());
        
        // Fetch news data
        const response = await fetch(DATA_FILE);
        if (!response.ok) {
            throw new Error('Failed to load news data');
        }
        
        const data = await response.json();
        
        // Update stats
        countEl.textContent = data.news?.length || 0;
        updateEl.textContent = data.lastUpdate ? formatTime(new Date(data.lastUpdate)) : '-';
        sourceEl.textContent = data.sources?.join(', ') || '-';
        
        // Render news cards
        if (data.news && data.news.length > 0) {
            container.innerHTML = data.news.map(createNewsCard).join('');
        } else {
            container.innerHTML = '<div class="loading">暂无新闻数据</div>';
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        container.innerHTML = `
            <div class="error">
                <p>⚠️ 加载新闻失败</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadNews);
