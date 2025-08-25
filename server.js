const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const BaguaSystem = require('./core/bagua');

const app = express();
const port = process.env.PORT || 3000;

// Vercel 部署优化
if (process.env.VERCEL) {
  app.set('trust proxy', 1);
}

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 初始化八卦系统
const baguaSystem = new BaguaSystem();

// 算命API接口
app.post('/api/fortune', (req, res) => {
  try {
    const { category, question } = req.body;
    
    // 验证输入
    if (!category && !question) {
      return res.status(400).json({ error: '请提供问卜类型或问题' });
    }

    // 生成卦象和解读
    const input = `${category || ''}${question || ''}`;
    const hexagram = baguaSystem.generateHexagram(input);
    const reading = baguaSystem.generateReading(hexagram, question || '');

    // 记录占卜日志（可选）
    console.log(`[${new Date().toISOString()}] 占卜请求: ${category} - ${question}`);
    console.log(`生成卦象: ${reading.hexagram.name}`);

    res.json(reading);
  } catch (error) {
    console.error('算命过程出错:', error);
    res.status(500).json({ error: '占卜过程中出现问题，请稍后重试' });
  }
});

// 获取八卦基础信息
app.get('/api/bagua-info', (req, res) => {
  res.json({
    bagua: baguaSystem.bagua,
    wuxing: baguaSystem.wuxing,
    tiangan: baguaSystem.tiangan,
    dizhi: baguaSystem.dizhi
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: '八卦算命系统运行正常' 
  });
});

// 根路径重定向到主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '页面未找到' });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`🔮 AI 八卦算命服务器启动成功！`);
  console.log(`📍 访问地址: http://localhost:${port}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`🎯 服务器运行在端口: ${port}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('📴 收到关闭信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 收到中断信号，正在关闭服务器...');
  process.exit(0);
});

module.exports = app;