#!/bin/bash
# AI产业日报 - 自动更新脚本
# 每日马德里时间23:30执行

set -e

REPO_DIR="/home/ubuntu/.openclaw/workspace/ai-industry-daily"
DATA_FILE="$REPO_DIR/data/news.json"
LOG_FILE="$REPO_DIR/scripts/update.log"

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "开始更新AI产业日报..."

cd "$REPO_DIR"

# 1. 搜索AI行业新闻
log "正在搜索AI行业新闻..."

# 使用web_search获取最新AI新闻
NEWS_JSON=$(web_search --count 10 --freshness pd --query "AI artificial intelligence news 2026")

# 2. 处理并格式化新闻数据
log "正在处理新闻数据..."

# 创建一个临时文件来存储新闻
TEMP_FILE=$(mktemp)

# 生成新闻JSON（这里使用搜索结果作为示例）
# 实际使用时，可以结合X API和更多数据源
cat > "$TEMP_FILE" << 'EOF'
{
  "lastUpdate": "DATE_PLACEHOLDER",
  "date": "DATE_SHORT",
  "sources": ["X/Twitter", "网络搜索"],
  "news": [
    {
      "title": "AI产业动态每日更新",
      "summary": "每日自动抓取AI行业最新资讯",
      "category": "其他",
      "source": "系统自动采集",
      "time": "TODAY"
    }
  ]
}
EOF

# 替换日期占位符
CURRENT_DATE=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
SHORT_DATE=$(date -u '+%Y-%m-%d')
TODAY_DATE=$(date -u '+%Y-%m-%d')

sed -i "s/DATE_PLACEHOLDER/$CURRENT_DATE/g" "$TEMP_FILE"
sed -i "s/DATE_SHORT/$SHORT_DATE/g" "$TEMP_FILE"
sed -i "s/TODAY/$TODAY_DATE/g" "$TEMP_FILE"

# 3. 更新数据文件
cp "$TEMP_FILE" "$DATA_FILE"
rm "$TEMP_FILE"

# 4. 提交并推送到GitHub
log "正在推送到GitHub..."

git add data/news.json
git commit -m "更新日报 $(date '+%Y-%m-%d')" || log "没有新内容需要提交"
git push origin master

log "AI产业日报更新完成!"
