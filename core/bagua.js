// 八卦核心逻辑系统
class BaguaSystem {
  constructor() {
    // 八卦基本信息
    this.bagua = {
      '乾': { symbol: '☰', element: '天', attribute: '刚健', direction: '西北', season: '秋冬之交' },
      '坤': { symbol: '☷', element: '地', attribute: '柔顺', direction: '西南', season: '夏秋之交' },
      '震': { symbol: '☳', element: '雷', attribute: '动', direction: '东', season: '春' },
      '巽': { symbol: '☴', element: '风', attribute: '入', direction: '东南', season: '春夏之交' },
      '坎': { symbol: '☵', element: '水', attribute: '陷', direction: '北', season: '冬' },
      '离': { symbol: '☲', element: '火', attribute: '丽', direction: '南', season: '夏' },
      '艮': { symbol: '☶', element: '山', attribute: '止', direction: '东北', season: '冬春之交' },
      '兑': { symbol: '☱', element: '泽', attribute: '悦', direction: '西', season: '秋' }
    };

    // 六十四卦简化版（主要卦象）
    this.hexagrams = {
      '乾乾': { name: '乾为天', meaning: '元亨利贞，龙德正中', fortune: '大吉' },
      '坤坤': { name: '坤为地', meaning: '厚德载物，包容万象', fortune: '吉' },
      '震震': { name: '震为雷', meaning: '震惊百里，动而有威', fortune: '中吉' },
      '巽巽': { name: '巽为风', meaning: '随风而化，顺势而为', fortune: '小吉' },
      '坎坎': { name: '坎为水', meaning: '险中求进，智慧应对', fortune: '凶中有救' },
      '离离': { name: '离为火', meaning: '光明正大，文明昌盛', fortune: '吉' },
      '艮艮': { name: '艮为山', meaning: '止于至善，稳重踏实', fortune: '平' },
      '兑兑': { name: '兑为泽', meaning: '和悦相处，口舌生财', fortune: '小吉' }
    };

    // 五行相生相克
    this.wuxing = {
      elements: ['金', '木', '水', '火', '土'],
      generate: {
        '金': '水', '水': '木', '木': '火', '火': '土', '土': '金'
      },
      overcome: {
        '金': '木', '木': '土', '土': '水', '水': '火', '火': '金'
      }
    };

    // 天干地支
    this.tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    this.dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  }

  // 根据时间和输入生成卦象
  generateHexagram(input) {
    const now = new Date();
    const timeHash = now.getTime() + (input ? this.stringToHash(input) : 0);
    
    const upperGua = this.selectGua(timeHash);
    const lowerGua = this.selectGua(timeHash >> 3);
    
    return {
      upper: upperGua,
      lower: lowerGua,
      name: this.hexagrams[upperGua + lowerGua]?.name || `${upperGua}${lowerGua}`,
      meaning: this.hexagrams[upperGua + lowerGua]?.meaning || '此卦象征变化之道',
      fortune: this.hexagrams[upperGua + lowerGua]?.fortune || '待观其变'
    };
  }

  // 字符串转哈希值
  stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // 选择卦象
  selectGua(seed) {
    const guaNames = Object.keys(this.bagua);
    return guaNames[seed % guaNames.length];
  }

  // 生成详细解读
  generateReading(hexagram, question = '') {
    const upperInfo = this.bagua[hexagram.upper];
    const lowerInfo = this.bagua[hexagram.lower];
    
    // 基于五行生成运势建议
    const advice = this.generateAdvice(upperInfo.element, lowerInfo.element);
    
    return {
      hexagram: hexagram,
      upperGua: {
        name: hexagram.upper,
        info: upperInfo
      },
      lowerGua: {
        name: hexagram.lower,
        info: lowerInfo
      },
      interpretation: this.generateInterpretation(hexagram, question),
      advice: advice,
      timeElement: this.getCurrentTimeElement(),
      luckyDirection: upperInfo.direction,
      favorableTime: upperInfo.season
    };
  }

  // 生成解释
  generateInterpretation(hexagram, question) {
    const templates = [
      `${hexagram.name}卦示：${hexagram.meaning}。此时宜守正道，顺应天时。`,
      `上卦${hexagram.upper}，下卦${hexagram.lower}，象征${this.bagua[hexagram.upper].attribute}与${this.bagua[hexagram.lower].attribute}相合。`,
      `卦象显示：当前运势${hexagram.fortune}，需要根据实际情况灵活应对。`
    ];
    
    if (question.includes('事业') || question.includes('工作')) {
      templates.push('事业方面，当前适宜稳扎稳打，切勿急躁冒进。');
    }
    if (question.includes('感情') || question.includes('婚姻')) {
      templates.push('感情运势中，真诚相待是关键，需要耐心培养。');
    }
    if (question.includes('健康')) {
      templates.push('健康方面，注意调和阴阳，保持身心平衡。');
    }
    
    return templates.join(' ');
  }

  // 生成建议
  generateAdvice(upperElement, lowerElement) {
    const advice = [];
    
    // 五行分析
    if (this.wuxing.generate[upperElement] === lowerElement) {
      advice.push('上下相生，运势渐进，宜持之以恒。');
    } else if (this.wuxing.overcome[upperElement] === lowerElement) {
      advice.push('上下相克，需化解矛盾，以和为贵。');
    } else {
      advice.push('上下平和，稳中求进，顺其自然。');
    }
    
    advice.push('建议多行善积德，修身养性，必有好运相伴。');
    advice.push('凡事三思而后行，谋定而后动，可保平安。');
    
    return advice;
  }

  // 获取当前时辰对应的元素
  getCurrentTimeElement() {
    const hour = new Date().getHours();
    const timeElements = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
    return {
      element: timeElements[Math.floor(hour / 2)],
      shichen: this.dizhi[Math.floor(hour / 2)]
    };
  }
}

module.exports = BaguaSystem;