const BaguaSystem = require('../core/bagua');

// 初始化八卦系统
const baguaSystem = new BaguaSystem();

module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: '仅支持 POST 请求' });
    return;
  }

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

    // 记录占卜日志
    console.log(`[${new Date().toISOString()}] 占卜请求: ${category} - ${question}`);
    console.log(`生成卦象: ${reading.hexagram.name}`);

    res.status(200).json(reading);
  } catch (error) {
    console.error('算命过程出错:', error);
    res.status(500).json({ error: '占卜过程中出现问题，请稍后重试' });
  }
};