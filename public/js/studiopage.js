// ==================== 전역 함수 등록 (HTML onclick용) ====================
window.generateQR = function() {
    if (typeof QRious === 'undefined') {
        alert('QR 라이브러리를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }
    
    const input = document.getElementById('studio-qr-input');
    const size = document.getElementById('studio-qr-size');
    const canvas = document.getElementById('studio-qr-canvas');
    
    if (!input || !size || !canvas) return;
    
    const inputValue = input.value;
    const sizeValue = parseInt(size.value);
    
    try {
        const qr = new QRious({
            element: canvas,
            value: inputValue,
            size: sizeValue,
            foreground: '#000000',
            background: '#FFFFFF'
        });

        const downloadBtn = document.getElementById('studio-download-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-block';
        }
        
    } catch (error) {
        alert('QR 코드 생성 중 오류가 발생했습니다.');
    }
};

window.downloadQR = function() {
    const canvas = document.getElementById('studio-qr-canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
};

window.applyColorCode = function() {
    const colorCodeInput = document.getElementById('studio-color-code-input');
    if (!colorCodeInput) return;
    
    let hex = colorCodeInput.value.trim();
    
    // # 추가
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    // 유효성 검사
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        alert('올바른 색상 코드를 입력해주세요. (예: #01FF75)');
        return;
    }
    
    // 컬러 피커 업데이트
    const colorPicker = document.getElementById('studio-base-color');
    if (colorPicker) {
        colorPicker.value = hex;
    }
    
    // RGB 슬라이더 업데이트
    updateRGBFromHex(hex);
    
    colorCodeInput.value = hex;
    
    // 실시간 팔레트 업데이트
    generatePalette();
};

window.generatePalette = function() {
    const baseColor = document.getElementById('studio-base-color');
    const type = document.querySelector('input[name="palette-type"]:checked');
    const result = document.getElementById('studio-palette-result');
    
    if (!baseColor || !type || !result) return;
    
    let colors = [];
    const hsl = hexToHsl(baseColor.value);
    
    switch(type.value) {
        case 'monochrome':
            colors = generateMonochrome(hsl);
            break;
        case 'analogous':
            colors = generateAnalogous(hsl);
            break;
        case 'complementary':
            colors = generateComplementary(hsl);
            break;
        case 'triadic':
            colors = generateTriadic(hsl);
            break;
    }
    
    displayColors(colors, result);
};

// ==================== 전역 변수 및 설정 ====================

// 확장된 컬러 카드 데이터 (기존 10개 + 신규 20개)
const colorCards = [
    // === 기존 데이터 ===
 {
    name: "미드나이트 블루",
    hex: "#0F1419", // 더 어두운 진짜 블루
    description: "깊은 밤하늘처럼 신비로운 색상으로, 집중력과 안정감을 가져다줍니다."
},
    {
        name: "코랄 핑크",
        hex: "#FF7F7F",
        description: "따뜻하고 친근한 에너지를 가진 색상으로, 창의성과 열정을 자극합니다."
    },
    {
        name: "포레스트 그린",
        hex: "#228B22",
        description: "자연의 생명력을 담은 색상으로, 평온함과 성장을 상징합니다."
    },
    {
        name: "골든 옐로우",
        hex: "#FFD700",
        description: "태양의 빛을 닮은 밝은 색상으로, 활력과 행복을 불러일으킵니다."
    },
    {
        name: "라벤더 퍼플",
        hex: "#E6E6FA",
        description: "우아하고 고요한 색상으로, 내면의 평화와 직관력을 높여줍니다."
    },
    {
        name: "터키쉬 블루",
        hex: "#40E0D0",
        description: "맑은 바다처럼 상쾌한 색상으로, 소통과 치유의 에너지를 전달합니다."
    },
    {
        name: "로즈 골드",
        hex: "#E8B4B8",
        description: "고급스럽고 온화한 색상으로, 사랑과 조화를 상징합니다."
    },
    {
        name: "슬레이트 그레이",
        hex: "#708090",
        description: "균형잡힌 중성 색상으로, 안정감과 전문성을 나타냅니다."
    },
    {
        name: "피치 오렌지",
        hex: "#FFCBA4",
        description: "부드럽고 따뜻한 색상으로, 친밀감과 편안함을 제공합니다."
    },
    {
    name: "인디고 블루",
    hex: "#2E4B89",
    description: "깊이 있는 지혜의 색상으로, 통찰력과 직관을 개발시킵니다."
    }
    ,
    
    // === 신규 색다른 명칭 ===
    {
        name: "네온사인 핑크",
        hex: "#FF1493",
        description: "도시의 밤을 밝히는 네온사인처럼 강렬하고 역동적인 에너지를 발산합니다."
    },
    {
        name: "우주먼지 퍼플",
        hex: "#6A0DAD",
        description: "은하수 너머 우주의 신비로운 먼지 같은 색상으로, 무한한 상상력을 자극합니다."
    },
    {
        name: "카페라떼 브라운",
        hex: "#D2B48C",
        description: "향긋한 아침 커피처럼 따뜻하고 포근한 기운으로 하루를 시작하게 합니다."
    },
    {
        name: "형광등 화이트",
        hex: "#F8F8FF",
        description: "깔끔한 사무실 조명처럼 명확하고 집중력을 높여주는 순수한 빛입니다."
    },
    {
        name: "전기뱀장어 옐로우",
        hex: "#FFFF00",
        description: "강력한 전기 에너지처럼 눈부시고 강렬한 임팩트를 전달하는 색상입니다."
    },
    {
        name: "용암폭발 레드",
        hex: "#DC143C",
        description: "화산의 뜨거운 용암처럼 폭발적인 열정과 강인한 의지를 보여줍니다."
    },
    {
        name: "구름속 실버",
        hex: "#C0C0C0",
        description: "높은 하늘 구름 사이로 스며드는 은빛처럼 몽환적이고 세련된 분위기입니다."
    },
  {
    name: "심해어 블랙",
    hex: "#0A0A0A", // 진짜 깊은 바다색
    description: "깊은 바닷속 미지의 세계처럼 신비롭고 깊이 있는 사색을 불러일으킵니다."
},
    {
        name: "샐러드믹스 그린",
        hex: "#90EE90",
        description: "신선한 채소처럼 생기발랄하고 건강한 에너지로 활력을 불어넣어줍니다."
    },
    {
        name: "로켓연료 블루",
        hex: "#4169E1",
        description: "우주로 향하는 로켓처럼 미래지향적이고 도전적인 정신을 상징합니다."
    },
    {
        name: "벚꽃눈보라 핑크",
        hex: "#FFB6C1",
        description: "봄날 흩날리는 벚꽃잎처럼 로맨틱하고 꿈같은 순간을 연출합니다."
    },
    {
        name: "사이버펑크 시안",
        hex: "#00FFFF",
        description: "미래도시 홀로그램처럼 디지털하고 첨단 기술의 세련됨을 표현합니다."
    },
    {
        name: "마카롱상자 민트",
        hex: "#98FB98",
        description: "달콤한 디저트처럼 부드럽고 상큼한 기분으로 일상에 소소한 즐거움을 더합니다."
    },
    {
        name: "번개칠 옐로우",
        hex: "#FFEA00",
        description: "천둥번개처럼 순간적이고 강력한 영감과 아이디어의 번뜩임을 나타냅니다."
    },
    {
        name: "갤럭시 바이올렛",
        hex: "#8A2BE2",
        description: "광활한 은하계처럼 무한한 가능성과 창조적 상상력의 경계를 넘나듭니다."
    },
    {
        name: "콘크리트 정글 그레이",
        hex: "#696969",
        description: "도시의 건축물처럼 견고하고 현실적인 실용성과 모던함을 대표합니다."
    },
    {
        name: "열대과일 오렌지",
        hex: "#FF8C00",
        description: "태양 가득한 남국의 과일처럼 에너지 넘치고 즐거운 휴가 기분을 선사합니다."
    },
    {
        name: "홀로그램 무지개",
        hex: "#9370DB",
        description: "빛이 만들어내는 스펙트럼처럼 다채롭고 신비로운 변화의 가능성을 품고 있습니다."
    },
    {
        name: "스모키바베큐 브라운",
        hex: "#A0522D",
        description: "향긋한 훈제 향처럼 깊이 있고 진중한 맛과 여유로운 시간을 의미합니다."
    },
    {
        name: "오로라 스카이",
        hex: "#87CEEB",
        description: "북극의 신비로운 오로라처럼 환상적이고 경이로운 자연의 아름다움을 담았습니다."
    }
    ,

    // === 신선한 명칭의 추가 단색 컬러들 ===
{
    name: "모닝커피 에스프레소",
    hex: "#3E2723",
    description: "첫 모금의 진한 커피처럼 하루를 깨우는 강렬하면서도 따뜻한 에너지를 담고 있습니다."
},
{
    name: "픽셀아트 청록",
    hex: "#26A69A",
    description: "8비트 게임 속 바다처럼 디지털과 자연이 만나는 새로운 세대의 감성을 표현합니다."
},
{
    name: "비닐하우스 연두",
    hex: "#8BC34A",
    description: "도시 농업의 희망처럼 인공과 자연이 조화롭게 공존하는 지속가능한 미래를 상징합니다."
},
{
    name: "레트로 TV 블루",
    hex: "#2196F3",
    description: "옛날 브라운관 TV의 파란 화면처럼 아날로그 감성과 디지털 꿈이 어우러진 향수를 불러일으킵니다."
},
{
    name: "타피오카 펄 화이트",
    hex: "#FAFAFA",
    description: "버블티 속 쫄깃한 타피오카처럼 젊은 세대의 달콤하고 유쾌한 일상의 소확행을 담았습니다."
},
{
    name: "인스타그램 핑크",
    hex: "#E91E63",
    description: "SNS 속 감성적인 순간들처럼 현대인의 소통과 공감, 그리고 개성 표현의 매개체가 되는 색상입니다."
},
{
    name: "택배박스 카키",
    hex: "#8D6E63",
    description: "온라인 쇼핑의 설렘처럼 기다림과 만족, 그리고 현대적 편리함을 상징하는 일상의 색깔입니다."
},
{
    name: "노트북 키보드 그레이",
    hex: "#455A64",
    description: "무수한 아이디어가 탄생하는 키보드처럼 창작과 소통의 도구가 되는 현대인의 필수 동반자입니다."
},
{
    name: "에어팟 케이스 실버",
    hex: "#ECEFF1",
    description: "무선의 자유로움처럼 제약 없는 라이프스타일과 스마트한 일상을 추구하는 현대적 감각을 나타냅니다."
},
{
    name: "플라네타리움 퍼플",
    hex: "#673AB7",
    description: "인공 별하늘 아래에서 느끼는 경이로움처럼 과학과 상상력이 만들어내는 무한한 우주의 신비를 담았습니다."
}
,
// === 몽환적이고 신화적인 단색 컬러들 ===
{
    name: "유니콘의 속눈썹",
    hex: "#F8BBD9",
    description: "전설 속 유니콘이 눈을 감을 때 떨어지는 속눈썹처럼 순수하고 마법적인 분홍빛 꿈을 간직하고 있습니다."
},
{
    name: "인어공주의 비늘",
    hex: "#5DADE2",
    description: "깊은 바다 궁전의 인어가 간직한 푸른 비늘처럼 신비로운 바다의 노래와 꿈을 품고 있는 색상입니다."
},
{
    name: "요정의 날개 먼지",
    hex: "#D5DBDB",
    description: "숲속 요정들이 날아다닐 때 떨어뜨리는 마법의 가루처럼 희미하고 신비로운 은빛 마법을 담고 있습니다."
},
{
    name: "달토끼의 방아절구",
    hex: "#AED6F1",
    description: "달에서 떡을 찧는 토끼의 방아절구처럼 순수한 달빛과 정성이 어우러진 부드러운 하늘색 온기입니다."
},
{
    name: "피터팬의 그림자",
    hex: "#566573",
    description: "네버랜드를 떠나지 못하는 피터팬의 그림자처럼 영원한 동심과 모험의 꿈이 스며든 회색빛 향수입니다."
},
{
    name: "앨리스의 체셔캣 미소",
    hex: "#BB8FCE",
    description: "이상한 나라에서 사라지고 나타나는 체셔캣의 신비한 미소처럼 수수께끼 같은 보라빛 장난기를 품고 있습니다."
},
{
    name: "잠자는 숲속 미녀의 장미",
    hex: "#EC7063",
    description: "백 년의 잠에 빠진 공주를 깨우는 진실한 사랑의 장미처럼 깊은 붉은빛 운명의 키스를 상징합니다."
},
{
    name: "신데렐라의 유리구두",
    hex: "#D6EAF8",
    description: "자정이 되면 사라지는 마법의 유리구두처럼 투명하고 덧없는 꿈과 희망의 푸른빛을 간직하고 있습니다."
},
{
    name: "헨젤과 그레텔의 과자집",
    hex: "#F9E79F",
    description: "숲속에서 발견한 달콤한 과자집처럼 유혹적이면서도 위험한 노란빛 동화 속 마법을 품고 있습니다."
},
{
    name: "라푼젤의 황금 머리카락",
    hex: "#F7DC6F",
    description: "탑 꼭대기에서 흘러내리는 라푼젤의 긴 머리카락처럼 자유를 향한 희망과 인내의 황금빛 실을 담고 있습니다."
}
,
{
    name: "유튜브 레드",
    hex: "#FF0000",
    description: "전 세계 크리에이터들의 열정과 꿈이 담긴 빨간 재생 버튼처럼 무한한 콘텐츠와 창작 에너지를 상징합니다."
},
{
    name: "페이스북 블루",
    hex: "#1877F2",
    description: "전 세계를 연결하는 소셜 네트워크처럼 사람과 사람 사이의 따뜻한 연결과 소통의 다리 역할을 하는 신뢰의 파랑입니다."
},
{
    name: "스포티파이 그린",
    hex: "#1DB954",
    description: "음악이 흐르는 모든 순간처럼 리듬과 멜로디가 만들어내는 생동감 넘치는 라이프스타일을 상징하는 음악의 초록입니다."
},
{
    name: "트위터 스카이 블루",
    hex: "#1DA1F2",
    description: "140자 속에 담긴 순간의 생각들처럼 빠르고 간결한 소통과 실시간으로 흐르는 정보의 하늘빛 물결을 나타냅니다."
},
{
    name: "넷플릭스 레드",
    hex: "#E50914",
    description: "무한한 스토리의 세계로 빠져드는 몰입감처럼 집에서 즐기는 프리미엄 엔터테인먼트의 깊고 진한 빨간 열정입니다."
},
{
    name: "디스코드 퍼플",
    hex: "#5865F2",
    description: "게이머들과 커뮤니티가 모이는 공간처럼 취미와 관심사를 공유하는 사람들의 유대감과 소속감을 나타내는 보라빛 연결고리입니다."
},
{
    name: "슬랙 퍼플",
    hex: "#4A154B",
    description: "효율적인 팀워크와 협업의 공간처럼 현대적 업무 환경에서 소통과 생산성을 높여주는 프로페셔널한 깊은 자주색입니다."
},
{
    name: "줌 코발트 블루",
    hex: "#2D8CFF",
    description: "화상회의로 연결되는 전 세계처럼 물리적 거리를 뛰어넘어 사람들을 하나로 묶어주는 디지털 소통의 맑은 파란색입니다."
},
{
    name: "카카오톡 옐로우",
    hex: "#FFE812",
    description: "일상 속 가장 친근한 메신저처럼 한국인들의 소통과 정서가 담긴 따뜻하고 밝은 노란빛 대화의 창구입니다."
},
{
    name: "네이버 그린",
    hex: "#03C75A",
    description: "검색에서 쇼핑까지 모든 디지털 라이프의 시작점처럼 정보와 편의를 제공하는 한국 인터넷의 상징적인 초록빛 관문입니다."
}
,
{
    name: "쿠팡 로켓 오렌지",
    hex: "#FF6600",
    description: "로켓배송의 빠른 속도처럼 일상의 편리함을 극대화시켜주는 이커머스 혁신의 주황빛 배송 혁명을 상징합니다."
},
{
    name: "삼성 갤럭시 블루",
    hex: "#1428A0",
    description: "글로벌 기술 혁신의 선두주자처럼 한국이 세계에 자랑하는 첨단 기술과 미래 비전을 담은 깊고 신뢰감 있는 파란색입니다."
},
{
    name: "지마켓 그린",
    hex: "#00B04F",
    description: "온라인 쇼핑의 즐거움과 신뢰할 수 있는 거래처럼 소비자들에게 안전하고 합리적인 쇼핑 경험을 선사하는 신뢰의 초록빛입니다."
},
{
    name: "배달의민족 민트",
    hex: "#00C896",
    description: "언제 어디서나 맛있는 음식을 배달해주는 서비스처럼 한국인의 식생활을 혁신시킨 상쾌하고 친근한 민트색 편의입니다."
},
{
    name: "현대자동차 실버",
    hex: "#C8C8C8",
    description: "글로벌 자동차 브랜드로 성장한 한국의 자부심처럼 품질과 신뢰성을 바탕으로 세계 도로를 달리는 은빛 기술력입니다."
},
{
    name: "LG 와인 레드",
    hex: "#A50034",
    description: "생활가전에서 IT까지 품격 있는 기술력처럼 세련되고 프리미엄한 라이프스타일을 제안하는 고급스러운 와인빛 혁신입니다."
},
{
    name: "신한은행 블루",
    hex: "#0046FF",
    description: "금융의 신뢰와 안정성을 바탕으로 한 디지털 혁신처럼 고객의 미래를 함께 설계하는 믿음직한 파란색 금융 파트너입니다."
},
{
    name: "SK텔레콤 마젠타",
    hex: "#E91E5A",
    description: "5G와 통신 기술의 최전선에서 연결의 가치를 실현하는 것처럼 소통과 혁신을 선도하는 역동적인 마젠타 커넥션입니다."
}
,


// === NFP 특별 색상들 ===
{
    name: "NFP 시그니쳐 그린",
    hex: "#01FF75",
    description: "창의적 혁신과 무한한 가능성을 상징하는 NFP의 시그니쳐 컬러입니다. 새로운 아이디어와 도전 정신을 불러일으킵니다.",
    isSpecial: true
},
{
    name: "NFP 에메랄드 에디션",
    hex: "#00CC5E",
    description: "깊이 있는 성장과 지속가능한 성공을 의미하는 NFP 에메랄드 에디션입니다. 신뢰와 안정성 위에 구축된 혁신을 나타냅니다.",
    isSpecial: true
}

];

// 그라데이션 카드 데이터
const gradientColorCards = [
    {
        name: "일몰 스카이라인",
        gradient: "linear-gradient(45deg, #FF6B6B, #FFE66D, #FF8E53)",
        description: "하루의 끝을 알리는 황금빛 노을처럼 따뜻하고 로맨틱한 감성을 불러일으킵니다."
    },
    {
        name: "은하수 터널",
        gradient: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)",
        description: "우주를 관통하는 신비로운 통로처럼 무한한 상상력과 모험심을 자극합니다."
    },
    {
        name: "네온시티 나이트",
        gradient: "linear-gradient(90deg, #ff0080, #00ffff, #8000ff)",
        description: "사이버펑크 도시의 밤처럼 미래적이고 역동적인 디지털 에너지를 발산합니다."
    },
    {
        name: "열대우림 미스트",
        gradient: "linear-gradient(180deg, #11998e, #38ef7d, #a8e6cf)",
        description: "신비로운 정글 안개처럼 생명력 넘치고 치유의 기운을 전달하는 자연의 힘입니다."
    },
    {
        name: "오로라 윈터",
        gradient: "linear-gradient(45deg, #4facfe, #00f2fe, #43e97b)",
        description: "극지방의 오로라처럼 환상적이고 순수한 겨울 밤의 마법을 담고 있습니다."
    },
    {
        name: "화산폭발 마그마",
        gradient: "linear-gradient(135deg,rgb(255, 81, 0),rgb(255, 55, 0),rgb(248, 148, 17))",
        description: "뜨거운 용암의 분출처럼 폭발적인 열정과 강인한 생명력을 상징합니다."
    },
    {
        name: "심해 바이오",
        gradient: "linear-gradient(90deg, #0f0c29, #302b63, #24243e)",
        description: "깊은 바다의 신비로운 생명체처럼 고요하면서도 강렬한 내면의 힘을 보여줍니다."
    },
    {
        name: "캔디팝 드림",
        gradient: "linear-gradient(45deg, #a8edea, #fed6e3, #ffecd2)",
        description: "달콤한 솜사탕처럼 포근하고 꿈같은 행복감으로 마음을 어루만져줍니다."
    },
    {
        name: "전광석화 썬더",
        gradient: "linear-gradient(180deg, #fdbb2d, #22c1c3, #4facfe)",
        description: "번개의 순간적 번쩍임처럼 강력한 영감과 번뜩이는 아이디어를 선사합니다."
    },
    {
        name: "로켓발사 플레임",
        gradient: "linear-gradient(135deg, #fa709a, #fee140, #ff6b6b)",
        description: "우주로 향하는 로켓 추진체처럼 미래를 향한 강력한 추진력과 도전정신을 나타냅니다."
    }
    ,

    // === 신선한 명칭의 추가 그라데이션들 ===
{
    name: "스마트폰 스크린 글로우",
    gradient: "linear-gradient(135deg, #001F3F, #0074D9, #7FDBFF, #001F3F)",
    description: "새벽 3시 휴대폰 화면처럼 현대인의 디지털 라이프와 불면의 밤이 만들어내는 몽환적인 빛의 여행입니다."
}
,
{
    name: "택시 야간 드라이브",
    gradient: "linear-gradient(90deg, #1a1a2e, #ff6b35, #f7931e, #1a1a2e)",
    description: "밤거리를 달리는 택시 창문 너머로 스쳐가는 네온사인처럼 도시의 속도감과 감성을 담은 이동의 시간입니다."
}
,
{
    name: "카페 라떼아트 브라운",
    gradient: "linear-gradient(45deg, #8B4513, #D2B48C, #F5DEB3)",
    description: "바리스타의 정성이 담긴 라떼아트처럼 일상 속 작은 예술과 따뜻한 위로를 선사하는 오후의 감성입니다."
},
{
    name: "지하철 2호선 그린",
    gradient: "linear-gradient(180deg, #2E7D32, #4CAF50, #81C784)",
    description: "도시를 관통하는 지하철처럼 바쁜 일상 속에서도 목적지를 향해 달려가는 현대인의 역동적인 에너지를 표현합니다."
},
{
    name: "컨베이어벨트 실버",
    gradient: "linear-gradient(90deg, #B8B8B8, #DCDCDC, #F0F0F0, #C0C0C0)",
    description: "회전초밥집 컨베이어벨트처럼 끊임없이 순환하는 일상의 리듬과 편리함이 주는 현대적 여유로움을 나타냅니다."
},
{
    name: "에어컨 바람 블루",
    gradient: "linear-gradient(180deg, #0288D1, #4FC3F7, #B3E5FC)",
    description: "더운 여름날 시원한 에어컨 바람처럼 일상의 스트레스를 날려주는 상쾌하고 시원한 해방감을 전달합니다."
},
{
    name: "전광판 뉴스 옐로우",
    gradient: "linear-gradient(45deg, #FFA000, #FFD54F, #FFF59D)",
    description: "빠르게 지나가는 전광판 뉴스처럼 정보화 시대의 속도감과 눈부신 발전을 상징하는 현대 사회의 역동성입니다."
}
,
{
    name: "무인카페 머신 화이트",
    gradient: "linear-gradient(90deg, #FAFAFA, #F5F5F5, #EEEEEE)",
    description: "24시간 운영되는 무인카페처럼 언제나 접근 가능한 편리함과 깔끔하고 효율적인 현대적 서비스 정신을 표현합니다."
},
{
    name: "틱톡 알고리즘 그라데이션",
    gradient: "linear-gradient(45deg, #FF6B9D, #C44569, #F8B500, #4ECDC4)",
    description: "예측 불가능한 알고리즘처럼 다채롭고 역동적인 MZ세대의 창의성과 무한한 콘텐츠 가능성을 상징하는 무지개빛 에너지입니다."
}
,

// === 신비로운 이름의 그라데이션들 ===
{
    name: "아스트랄 게이트웨이",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483)",
    description: "영혼이 차원을 넘나드는 관문처럼 물질계를 초월한 신비로운 여행으로 이끄는 우주적 통로의 빛입니다."
},
{
    name: "룬스톤의 속삭임",
    gradient: "linear-gradient(90deg, #2c1810, #8b5a3c, #daa520, #f4e4bc)",
    description: "고대 마법사들이 새긴 신성한 문자처럼 잊혀진 지혜와 예언의 힘을 간직한 신비로운 돌의 기운입니다."
},
{
    name: "크리스탈 드림웨이버",
    gradient: "linear-gradient(45deg, #e8f5e8, #b8e6b8, #88d8c0, #58cae4)",
    description: "꿈을 직조하는 수정 같은 투명함으로 현실과 환상의 경계를 넘나드는 신비로운 꿈결의 실을 엮어냅니다."
},
{
    name: "페어리 미스트 발레",
    gradient: "linear-gradient(180deg, #ffeef8, #f8c2ff, #d896ff, #be69ff)",
    description: "요정들이 춤추는 안개 속에서 펼쳐지는 신비로운 발레처럼 마법과 우아함이 어우러진 환상의 무대입니다."
},
{
    name: "템플 오브 에코즈",
    gradient: "linear-gradient(135deg, #0c0c0c, #434343, #8b8680, #d4af37)",
    description: "고대 신전에 울려퍼지는 메아리처럼 시간을 초월한 신성한 기도와 깨달음의 울림이 담긴 영원의 공간입니다."
},
{
    name: "천사의 눈물",
    gradient: "linear-gradient(90deg, #E6F3FF, #B3D9FF, #80C5FF, #4DA6FF)",
    description: "천상의 존재들이 흘리는 순수한 눈물처럼 맑고 투명한 슬픔과 희망이 뒤섞인 성스러운 감정을 표현합니다."
},
{
    name: "드래곤 브레스 오로라",
    gradient: "linear-gradient(45deg, #1a472a, #059669, #10b981, #6ee7b7, #fbbf24)",
    description: "고대 용의 숨결이 만들어낸 오로라처럼 불과 얼음이 만나 탄생한 전설 속 빛의 마법을 간직하고 있습니다."
},
{
    name: "미드나잇 엘릭서",
    gradient: "linear-gradient(180deg, #1e1b4b, #312e81, #6366f1, #a78bfa, #c084fc)",
    description: "한밤중에 끓여내는 신비한 영약처럼 달빛과 별빛이 우러난 마법의 물약이 발산하는 신비로운 기운입니다."
},
{
    name: "포가튼 킹덤 아이리스",
    gradient: "linear-gradient(135deg, #4c1d95, #7c3aed, #a855f7, #c084fc, #ddd6fe)",
    description: "잊혀진 왕국의 아이리스 꽃처럼 사라진 문명의 기억과 영광이 꽃잎 사이로 스며드는 애잔한 보라빛 전설입니다."
},
{
    name: "이터널 보이드 리플렉션",
    gradient: "linear-gradient(90deg, #000000, #1a1a1a, #374151, #6b7280, #d1d5db)",
    description: "영원한 공허 속에 비친 반영처럼 무한과 무의 경계에서 피어나는 고요하고 깊이 있는 철학적 사색의 그림자입니다."
}
,

// === 몽환적이고 신화적인 그라데이션들 ===
{
    name: "페가수스의 날개짓",
    gradient: "linear-gradient(45deg, #D5E8D4, #85C1E9, #F8C471, #D5A6BD)",
    description: "하늘을 나는 천마의 날개짓처럼 구름과 바람, 햇살이 만들어내는 자유로운 영혼의 무지개빛 여행입니다."
},
{
    name: "불사조의 재탄생",
    gradient: "linear-gradient(135deg, #2C3E50, #E74C3C, #F39C12, #F7DC6F)",
    description: "화염 속에서 다시 태어나는 불사조처럼 절망에서 희망으로, 어둠에서 빛으로 승화하는 영원한 부활의 불꽃입니다."
},
{
    name: "메두사의 저주받은 시선",
    gradient: "linear-gradient(90deg, #1B4F72, #76448A, #A569BD, #85929E)",
    description: "돌로 변하게 하는 메두사의 눈빛처럼 아름답지만 위험한 마력이 담긴 신화 속 저주의 보라빛 시선입니다."
},
{
    name: "이카루스의 밀랍 날개",
    gradient: "linear-gradient(180deg, #F7DC6F, #F8C471, #E67E22, #A04000)",
    description: "태양에 너무 가까이 날아간 이카루스의 날개처럼 꿈과 현실, 야망과 추락이 만들어내는 황금빛 교훈입니다."
},
{
    name: "오로라 공주의 저주",
    gradient: "linear-gradient(45deg, #E8DAEF, #D2B4DE, #BB8FCE, #8E44AD)",
    description: "가시에 찔려 영원한 잠에 빠진 공주처럼 아름답지만 슬픈 운명이 스며든 보라빛 마법의 잠꼬대입니다."
},
{
    name: "인어의 거품 속삭임",
    gradient: "linear-gradient(135deg, #AED6F1, #85C1E9, #5DADE2, #3498DB)",
    description: "바다 위로 올라온 인어가 거품이 되어 사라지듯 덧없는 사랑과 희생이 만들어내는 푸른 파도의 노래입니다."
},
{
    name: "잭과 콩나무의 구름계단",
    gradient: "linear-gradient(90deg, #D5F4E6, #A9DFBF, #7DCEA0, #52BE80)",
    description: "하늘까지 뻗은 마법의 콩나무처럼 불가능을 가능하게 만드는 초록빛 모험과 용기의 계단을 오르는 여행입니다."
},
{
    name: "백설공주의 독사과",
    gradient: "linear-gradient(180deg, #F1948A, #EC7063, #E74C3C, #922B21)",
    description: "아름다운 겉모습 뒤에 숨겨진 독처럼 유혹적이지만 위험한 붉은빛 질투와 미움이 만들어낸 금단의 열매입니다."
},
{
    name: "피노키오의 거짓말 코",
    gradient: "linear-gradient(45deg, #F4D03F, #F7DC6F, #F8C471, #E67E22)",
    description: "거짓말을 할 때마다 길어지는 나무 코처럼 진실과 거짓 사이에서 흔들리는 황금빛 성장통과 깨달음의 과정입니다."
},
{
    name: "이상한 나라의 티파티",
    gradient: "linear-gradient(135deg, #FAD7A0, #F8C471, #BB8FCE, #85C1E9)",
    description: "매드해터의 끝나지 않는 다과회처럼 시간이 멈춘 듯한 기묘하고 환상적인 무지개빛 광기와 순수함의 향연입니다."
}
,



      {
        name: "NFP 시그니쳐 오로라",
        gradient: "linear-gradient(45deg, #01FF75, #00FFCC, #01FF75)",
        description: "NFP만의 독창적인 오로라 그라데이션입니다. 끝없는 창의성과 혁신의 여정을 상징하는 특별한 색채입니다.",
        isSpecial: true
    }
    ,
    {
        name: "NFP 에메랄드 심포니",
        gradient: "linear-gradient(135deg, #00CC5E, #01FF75, #4FFFB0)",
        description: "NFP 에메랄드 심포니 그라데이션을 발견하셨습니다. 조화로운 성장과 지속가능한 혁신을 표현하는 프리미엄 컬렉션입니다.",
        isSpecial: true
    }
];

// 상태 변수들
let isFlipped = false;
let currentColor = null;
let isAnimating = false;

// 그라데이션 카드 관련 변수들
let gradientIsFlipped = false;
let gradientCurrentColor = null;
let gradientIsAnimating = false;

// ==================== QR 라이브러리 로드 ====================

function loadQRLibrary() {
    return new Promise((resolve, reject) => {
        if (typeof QRious !== 'undefined') {
            resolve();
            return;
        }
        
        const cdnUrls = [
            'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js',
            'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js'
        ];
        
        let currentCdnIndex = 0;
        
        function tryLoadFromCdn() {
            if (currentCdnIndex >= cdnUrls.length) {
                reject();
                return;
            }
            
            const url = cdnUrls[currentCdnIndex];
            const newScript = document.createElement('script');
            newScript.src = url;
            newScript.onload = () => resolve();
            newScript.onerror = () => {
                currentCdnIndex++;
                if (newScript.parentNode) {
                    newScript.parentNode.removeChild(newScript);
                }
                setTimeout(tryLoadFromCdn, 500);
            };
            
            document.head.appendChild(newScript);
        }
        
        tryLoadFromCdn();
    });
}

// ==================== 스튜디오 메인 초기화 ====================

function initStudio() {
    // 메인 탭 전환 기능
    const tabs = document.querySelectorAll('.studio-page-tab');
    const panels = document.querySelectorAll('.studio-tab-panel');
    
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            const targetPanel = document.getElementById(this.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // 디자인 계산기 탭이 활성화될 때 그리드 다시 계산
                if (this.dataset.tab === 'design-calculator') {
                    setTimeout(() => {
                        if (document.getElementById('calc-max-width')) {
                            calculateAndVisualizeGrid();
                        }
                    }, 100);
                }
            }
        });
        
    });

    initCardSaveFeature();

    // 서브 탭 전환 기능
    const subTabs = document.querySelectorAll('.studio-sub-tab');
    
    subTabs.forEach(subTab => {
        subTab.addEventListener('click', function() {
            const parentContainer = this.closest('.studio-tab-panel');
            const siblingTabs = parentContainer.querySelectorAll('.studio-sub-tab');
            const subPanels = parentContainer.querySelectorAll('.studio-sub-panel');
            
            siblingTabs.forEach(t => t.classList.remove('active'));
            subPanels.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            const targetSubPanel = parentContainer.querySelector(`#${this.dataset.subtab}`);
            if (targetSubPanel) {
                targetSubPanel.classList.add('active');
            }
        });
    });

    // 각 탭별 초기화
    initQRGenerator();
    initColorPalette();
    initColorGenerator();
    initImageExtractor();
    initDesignCalculator();

    setTimeout(() => {
        const targetTab = window.location.hash.substring(1);
        
        if (targetTab) {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            const targetTabElement = document.querySelector(`[data-tab="${targetTab}"]`);
            const targetPanel = document.getElementById(targetTab);
            
            if (targetTabElement && targetPanel) {
                targetTabElement.classList.add('active');
                targetPanel.classList.add('active');
            }
        }
    }, 200);

}

// ==================== QR 생성기 기능 ====================

function initQRGenerator() {
    // QR 생성기는 별도 초기화 불필요
}

// ==================== 개선된 컬러 팔레트 기능 (실시간 업데이트) ====================

function initColorPalette() {
    // 컬러 피커 이벤트
    const colorPicker = document.getElementById('studio-base-color');
    if (colorPicker) {
        colorPicker.addEventListener('input', syncColorFromPicker);
    }
    
    // RGB 슬라이더 이벤트
    ['red', 'green', 'blue'].forEach(color => {
        const slider = document.getElementById(`${color}-slider`);
        if (slider) {
            slider.addEventListener('input', syncColorFromRGB);
        }
    });
    
    // 팔레트 타입 라디오 버튼 이벤트
    const paletteRadios = document.querySelectorAll('input[name="palette-type"]');
    paletteRadios.forEach(radio => {
        radio.addEventListener('change', generatePalette);
    });
    
    // 초기 팔레트 생성
    generatePalette();
}

function syncColorFromPicker() {
    const colorPicker = document.getElementById('studio-base-color');
    const colorCodeInput = document.getElementById('studio-color-code-input');
    
    if (!colorPicker || !colorCodeInput) return;
    
    const hex = colorPicker.value;
    colorCodeInput.value = hex;
    updateRGBFromHex(hex);
    
    // 실시간 팔레트 업데이트
    generatePalette();
}

function syncColorFromRGB() {
    const r = parseInt(document.getElementById('red-slider').value);
    const g = parseInt(document.getElementById('green-slider').value);
    const b = parseInt(document.getElementById('blue-slider').value);
    
    // 값 표시 업데이트
    document.getElementById('red-value').textContent = r;
    document.getElementById('green-value').textContent = g;
    document.getElementById('blue-value').textContent = b;
    
    // HEX 변환
    const hex = rgbToHex(r, g, b);
    
    // 컬러 피커와 입력 필드 업데이트
    const colorPicker = document.getElementById('studio-base-color');
    const colorCodeInput = document.getElementById('studio-color-code-input');
    
    if (colorPicker) colorPicker.value = hex;
    if (colorCodeInput) colorCodeInput.value = hex;
    
    // 실시간 팔레트 업데이트
    generatePalette();
}

function updateRGBFromHex(hex) {
    const rgb = hexToRgbValues(hex);
    
    document.getElementById('red-slider').value = rgb.r;
    document.getElementById('green-slider').value = rgb.g;
    document.getElementById('blue-slider').value = rgb.b;
    
    document.getElementById('red-value').textContent = rgb.r;
    document.getElementById('green-value').textContent = rgb.g;
    document.getElementById('blue-value').textContent = rgb.b;
}

function applyColorCode() {
    const colorCodeInput = document.getElementById('studio-color-code-input');
    if (!colorCodeInput) return;
    
    let hex = colorCodeInput.value.trim();
    
    // # 추가
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    // 유효성 검사
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        alert('올바른 색상 코드를 입력해주세요. (예: #01FF75)');
        return;
    }
    
    // 컬러 피커 업데이트
    const colorPicker = document.getElementById('studio-base-color');
    if (colorPicker) {
        colorPicker.value = hex;
    }
    
    // RGB 슬라이더 업데이트
    updateRGBFromHex(hex);
    
    colorCodeInput.value = hex;
    
    // 실시간 팔레트 업데이트
    generatePalette();
}

function generatePalette() {
    const baseColor = document.getElementById('studio-base-color');
    const type = document.querySelector('input[name="palette-type"]:checked');
    const result = document.getElementById('studio-palette-result');
    
    if (!baseColor || !type || !result) return;
    
    let colors = [];
    const hsl = hexToHsl(baseColor.value);
    
    switch(type.value) {
        case 'monochrome':
            colors = generateMonochrome(hsl);
            break;
        case 'analogous':
            colors = generateAnalogous(hsl);
            break;
        case 'complementary':
            colors = generateComplementary(hsl);
            break;
        case 'triadic':
            colors = generateTriadic(hsl);
            break;
    }
    
    displayColors(colors, result);
}

// ==================== 수정된 컬러 생성기 기능 ====================

// ==================== 특별 효과 함수 (전역으로 이동) ====================
function triggerSpecialEffect() {
    // 1. 화면 번쩍임 효과
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, #01FF75, #00FFCC);
        opacity: 0.3;
        z-index: 9999;
        pointer-events: none;
        animation: nfpFlash 0.5s ease-out;
    `;
    
    // CSS 애니메이션 정의 (글로우만 포함, 스케일업과 테두리 제거)
    if (!document.querySelector('#nfp-special-style')) {
        const style = document.createElement('style');
        style.id = 'nfp-special-style';
        style.textContent = `
            @keyframes nfpFlash {
                0% { opacity: 0; }
                50% { opacity: 0.3; }
                100% { opacity: 0; }
            }
            
            @keyframes nfpGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(1, 255, 117, 0.5); }
                50% { box-shadow: 0 0 40px rgba(1, 255, 117, 0.8), 0 0 60px rgba(1, 255, 117, 0.4); }
            }
            
            .nfp-special-card {
                animation: nfpGlow 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(flashOverlay);
    
    // 2. 카드에 글로우 효과 추가 (단색 카드용)
    const cardElement = document.getElementById('single-card-element');
    if (cardElement) {
        cardElement.classList.add('nfp-special-card');
    }
    
    // 그라데이션 카드에도 글로우 효과 추가
    const gradientCardElement = document.getElementById('gradient-card-element');
    if (gradientCardElement) {
        gradientCardElement.classList.add('nfp-special-card');
    }
    
    // 3. 특별 축하 사운드 효과
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // 사운드 재생 실패 시 무시
    }
    
    // 4. 2초 후 특별 효과 제거
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.remove();
        }
        if (cardElement) {
            cardElement.classList.remove('nfp-special-card');
        }
        if (gradientCardElement) {
            gradientCardElement.classList.remove('nfp-special-card');
        }
    }, 2000);
    
    // 0.5초 후 플래시 오버레이 제거
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.remove();
        }
    }, 500);
}

// ==================== 컬러 생성기 초기화 ====================
function initColorGenerator() {
    // DOM 요소들
    const cardElement = document.getElementById('single-card-element');
    const cardQuestion = document.getElementById('card-question');
    const cardResult = document.getElementById('card-result');
    const colorDisplay = document.getElementById('color-display');
    const colorHex = document.getElementById('color-hex');
    const colorName = document.getElementById('color-name');
    const colorDescription = document.getElementById('color-description');
    const pickBtn = document.getElementById('single-pick-btn');
    const cardActions = document.getElementById('single-card-actions');
    const copyBtn = document.getElementById('single-copy-btn');
    const newBtn = document.getElementById('single-new-btn');

    function drawCard() {
        if (isAnimating) return;
        
        isAnimating = true;
        pickBtn.disabled = true;
        pickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
        
        // 카드 뒤집기 애니메이션
        cardElement.classList.add('card-flip');
        
        setTimeout(() => {
            // 랜덤 색상 선택
            const randomIndex = Math.floor(Math.random() * colorCards.length);
            currentColor = colorCards[randomIndex];
            
            // 카드 내용 업데이트
            colorDisplay.style.backgroundColor = currentColor.hex;
            colorHex.textContent = currentColor.hex;
            colorName.textContent = currentColor.name;
            colorDescription.textContent = currentColor.description;
            
            // NFP 특별 색상인지 확인하고 특별 효과 적용
            if (currentColor.isSpecial) {
                triggerSpecialEffect();
            }
            
            // 카드 상태 변경
            cardQuestion.style.display = 'none';
            cardResult.style.display = 'flex';
            
            // 버튼 상태 변경
            pickBtn.style.display = 'none';
            cardActions.style.display = 'flex';
            
            isFlipped = true;
            isAnimating = false;
            
            cardElement.classList.remove('card-flip');
        }, 800);
    }

    // 카드 리셋 함수
    function resetCard() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // 페이드 아웃 애니메이션
        cardElement.classList.add('card-fade');
        
        setTimeout(() => {
            // 카드 상태 리셋
            cardResult.style.display = 'none';
            cardQuestion.style.display = 'flex';
            
            // 버튼 상태 리셋
            cardActions.style.display = 'none';
            pickBtn.style.display = 'inline-block';
            pickBtn.disabled = false;
            pickBtn.innerHTML = '<i class="fas fa-magic"></i> 컬러 카드 뽑기';
            
            isFlipped = false;
            currentColor = null;
            isAnimating = false;
            
            cardElement.classList.remove('card-fade');
        }, 300);
    }

    // 색상 코드 복사 함수
    function copyColorCode() {
        if (!currentColor) return;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(currentColor.hex).then(() => {
                // 토스트 메시지 표시
                showCopyToast();
                
                // 버튼 피드백
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
                copyBtn.style.borderColor = '#01FF75';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.borderColor = 'rgba(1, 255, 117, 0.3)';
                }, 1500);
            });
        }
    }

    // 이벤트 리스너 등록
    if (cardElement) {
        cardElement.addEventListener('click', () => {
            if (!isFlipped && !isAnimating) {
                drawCard();
            }
        });
    }
    
    if (pickBtn) pickBtn.addEventListener('click', drawCard);
    if (newBtn) newBtn.addEventListener('click', resetCard);
    if (copyBtn) copyBtn.addEventListener('click', copyColorCode);
    
    // 그라데이션 카드 이벤트 리스너
    const gradientCardElement = document.getElementById('gradient-card-element');
    const gradientPickBtn = document.getElementById('gradient-pick-btn');
    const gradientCopyBtn = document.getElementById('gradient-copy-btn');
    const gradientNewBtn = document.getElementById('gradient-new-btn');

    if (gradientCardElement) {
        gradientCardElement.addEventListener('click', () => {
            if (!gradientIsFlipped && !gradientIsAnimating) {
                drawGradientCard();
            }
        });
    }

    if (gradientPickBtn) gradientPickBtn.addEventListener('click', drawGradientCard);
    if (gradientNewBtn) gradientNewBtn.addEventListener('click', resetGradientCard);
    if (gradientCopyBtn) gradientCopyBtn.addEventListener('click', copyGradientCode);
    
    // 5색 팔레트 이벤트
    const palette5Btn = document.getElementById('palette-5-btn');
    if (palette5Btn) palette5Btn.addEventListener('click', generate5ColorPalette);
    
    // 그라디언트 이벤트
    const gradient2Btn = document.getElementById('gradient-2-btn');
    const gradient3Btn = document.getElementById('gradient-3-btn');
    if (gradient2Btn) gradient2Btn.addEventListener('click', () => generateGradient(2));
    if (gradient3Btn) gradient3Btn.addEventListener('click', () => generateGradient(3));
}

// ==================== 그라데이션 카드 기능 ====================

// 그라데이션 카드 뽑기 함수
function drawGradientCard() {
    if (gradientIsAnimating) return;
    
    gradientIsAnimating = true;
    const gradientPickBtn = document.getElementById('gradient-pick-btn');
    gradientPickBtn.disabled = true;
    gradientPickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 뽑는 중...';
    
    // 카드 뒤집기 애니메이션
    const gradientCardElement = document.getElementById('gradient-card-element');
    gradientCardElement.classList.add('card-flip');
    
    setTimeout(() => {
        // 랜덤 그라데이션 색상 선택
        const randomIndex = Math.floor(Math.random() * gradientColorCards.length);
        gradientCurrentColor = gradientColorCards[randomIndex];
        
        // 카드 내용 업데이트
        const gradientColorDisplay = document.getElementById('gradient-color-display');
        const gradientColorHex = document.getElementById('gradient-color-hex');
        const gradientColorName = document.getElementById('gradient-color-name');
        const gradientColorDescription = document.getElementById('gradient-color-description');
        
        gradientColorDisplay.style.background = gradientCurrentColor.gradient;
        gradientColorHex.textContent = "GRADIENT";
        gradientColorName.textContent = gradientCurrentColor.name;
        gradientColorDescription.textContent = gradientCurrentColor.description;
        
        // NFP 특별 그라데이션인지 확인하고 특별 효과 적용
        if (gradientCurrentColor.isSpecial) {
            triggerSpecialEffect();
        }
        
        // 카드 상태 변경
        const gradientCardQuestion = document.getElementById('gradient-card-question');
        const gradientCardResult = document.getElementById('gradient-card-result');
        gradientCardQuestion.style.display = 'none';
        gradientCardResult.style.display = 'flex';
        
        // 버튼 상태 변경
        gradientPickBtn.style.display = 'none';
        const gradientCardActions = document.getElementById('gradient-card-actions');
        gradientCardActions.style.display = 'flex';
        
        gradientIsFlipped = true;
        gradientIsAnimating = false;
        
        gradientCardElement.classList.remove('card-flip');
    }, 800);
}

// 그라데이션 카드 리셋 함수
function resetGradientCard() {
    if (gradientIsAnimating) return;
    
    gradientIsAnimating = true;
    
    const gradientCardElement = document.getElementById('gradient-card-element');
    gradientCardElement.classList.add('card-fade');
    
    setTimeout(() => {
        // 카드 상태 리셋
        const gradientCardResult = document.getElementById('gradient-card-result');
        const gradientCardQuestion = document.getElementById('gradient-card-question');
        gradientCardResult.style.display = 'none';
        gradientCardQuestion.style.display = 'flex';
        
        // 버튼 상태 리셋
        const gradientCardActions = document.getElementById('gradient-card-actions');
        const gradientPickBtn = document.getElementById('gradient-pick-btn');
        gradientCardActions.style.display = 'none';
        gradientPickBtn.style.display = 'inline-block';
        gradientPickBtn.disabled = false;
        gradientPickBtn.innerHTML = '<i class="fas fa-magic"></i> 그라데이션 카드 뽑기';
        
        gradientIsFlipped = false;
        gradientCurrentColor = null;
        gradientIsAnimating = false;
        
        gradientCardElement.classList.remove('card-fade');
    }, 300);
}

// 그라데이션 코드 복사 함수
function copyGradientCode() {
    if (!gradientCurrentColor) return;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(gradientCurrentColor.gradient).then(() => {
            // 토스트 메시지 표시
            showCopyToast();
            
            // 버튼 피드백
            const gradientCopyBtn = document.getElementById('gradient-copy-btn');
            const originalText = gradientCopyBtn.innerHTML;
            gradientCopyBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
            gradientCopyBtn.style.borderColor = '#01FF75';
            
            setTimeout(() => {
                gradientCopyBtn.innerHTML = originalText;
                gradientCopyBtn.style.borderColor = 'rgba(1, 255, 117, 0.3)';
            }, 1500);
        });
    }
}

// 그라데이션 코드 복사 함수
function copyGradientCode() {
    if (!gradientCurrentColor) return;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(gradientCurrentColor.gradient).then(() => {
            // 토스트 메시지 표시
            showCopyToast();
            
            // 버튼 피드백
            const gradientCopyBtn = document.getElementById('gradient-copy-btn');
            const originalText = gradientCopyBtn.innerHTML;
            gradientCopyBtn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
            gradientCopyBtn.style.borderColor = '#01FF75';
            
            setTimeout(() => {
                gradientCopyBtn.innerHTML = originalText;
                gradientCopyBtn.style.borderColor = 'rgba(1, 255, 117, 0.3)';
            }, 1500);
        });
    }
}

function resetSingleCard() {
    const card = document.getElementById('single-card-element');
    const button = document.getElementById('single-pick-btn');
    const actions = document.getElementById('single-card-actions');
    
    if (!card) return;
    
    // 카드 회전 애니메이션
    card.classList.add('flipping');
    
    setTimeout(() => {
        // 물음표 카드로 되돌리기
        card.innerHTML = `
            <div class="card-question active">
                <div class="question-icon">
                    <i class="fas fa-question"></i>
                </div>
                <div class="question-text">
                    <h3>컬러 카드 뽑기</h3>
                    <p>클릭하여 새로운 컬러를 발견해보세요</p>
                </div>
            </div>
        `;
    }, 400);
    
    setTimeout(() => {
        card.classList.remove('flipping');
        
        // 버튼 복원
        if (button) {
            button.style.display = 'inline-block';
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-magic"></i> 컬러 카드 뽑기';
        }
        
        // 액션 버튼 숨기기
        if (actions) actions.style.display = 'none';
        
        currentCard = null;
    }, 800);
}

function copySingleColor() {
    if (!currentCard) return;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentCard.hex);
    }
    
    const btn = document.getElementById('single-copy-btn');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> 복사됨!';
    btn.style.background = '#00e066';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

function generate5ColorPalette() {
    const button = document.getElementById('palette-5-btn');
    const result = document.getElementById('palette-5-result');
    
    if (!button || !result) return;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    
    setTimeout(() => {
        // 랜덤 베이스 컬러 생성
        const baseHue = Math.floor(Math.random() * 360);
        const baseSat = 50 + Math.floor(Math.random() * 50);
        const baseLit = 40 + Math.floor(Math.random() * 40);
        
        const colors = generateRandomPalette([baseHue, baseSat, baseLit], 5);
        
        // 5색 팔레트 표시
       result.innerHTML = `
        <div class="palette-5-colors">
            ${colors.map(color => `
                <div class="palette-5-item">
                    <div class="palette-5-color" style="background-color: ${color}" onclick="copyColorWithFeedback('${color}')"></div>
                    <div class="palette-5-color-code">${color}</div>
                </div>
            `).join('')}
        </div>
    `;
        
        result.style.display = 'block';
        
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-magic"></i> 5색 팔레트 생성';
    }, 1000);
}

function generateGradient(colorCount) {
    const button = document.getElementById(`gradient-${colorCount}-btn`);
    const result = document.getElementById(`gradient-${colorCount}-result`);
    
    if (!button || !result) return;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    
    setTimeout(() => {
        // 랜덤 베이스 컬러 생성
        const baseHue = Math.floor(Math.random() * 360);
        const baseSat = 50 + Math.floor(Math.random() * 50);
        const baseLit = 40 + Math.floor(Math.random() * 40);
        
        const colors = generateRandomGradient([baseHue, baseSat, baseLit], colorCount);
        const gradientCSS = `linear-gradient(to right, ${colors.join(', ')})`;
        
      // 그라디언트 결과 표시
        result.innerHTML = `
            <div class="gradient-bar" style="background: ${gradientCSS}" onclick="copyColorWithFeedback('background: ${gradientCSS};')"></div>
            <div class="gradient-colors">
                ${colors.map(color => `
                    <div class="gradient-item">
                        <div class="gradient-color" style="background-color: ${color}" onclick="copyColorWithFeedback('${color}')"></div>
                        <div class="gradient-color-code">${color}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        result.style.display = 'block';
        
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-magic"></i> ${colorCount}색 그라디언트 생성`;
    }, 1000);
}

function copyColorWithFeedback(color) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(color);
    }
    
    // 토스트 알림 생성
    showCopyToast();
}

function showCopyToast() {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.copy-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.innerHTML = '<i class="fas fa-check"></i> 클립보드에 복사됨!';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #01ff75;
        color: black;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        animation: toastShow 0.3s ease;
    `;
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes toastShow {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 2초 후 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastShow 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 2000);
}

// ==================== 개선된 이미지 컬러 추출기 ====================

function initImageExtractor() {
    const imageFile = document.getElementById('studio-image-file');
    const uploadArea = document.getElementById('studio-image-upload');
    
    if (imageFile) {
        imageFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                extractColorsFromImage(file);
            }
        });
    }

    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                extractColorsFromImage(files[0]);
            }
        });
    }
}

function extractColorsFromImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('studio-extraction-canvas');
            if (!canvas) return;
            
            // willReadFrequently 속성 설정으로 콘솔 경고 해결
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // 이미지 크기 조정 (성능 최적화)
            const maxSize = 300;
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const colorsWithPercentage = extractDominantColorsWithPercentage(ctx, width, height);
            const container = document.getElementById('studio-extracted-colors');
            if (container) {
                displayExtractionResult(colorsWithPercentage, container);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function extractDominantColorsWithPercentage(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const colorCounts = {};
    let totalPixels = 0;
    
    // 개선된 색상 추출 로직
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        
        // 투명도가 높고 극단적인 색상이 아닌 경우만 포함
        if (alpha > 200) {
            // 색상 그룹화를 더 세밀하게 (10 단위로 그룹화)
            const groupedR = Math.floor(r / 10) * 10;
            const groupedG = Math.floor(g / 10) * 10;
            const groupedB = Math.floor(b / 10) * 10;
            
            const color = `${groupedR},${groupedG},${groupedB}`;
            colorCounts[color] = (colorCounts[color] || 0) + 1;
            totalPixels++;
        }
    }
    
    // 색상 빈도순 정렬 및 상위 5개 추출
    const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // 퍼센트 정규화 (상위 5개 색상의 합계가 100%가 되도록)
    const top5TotalCount = sortedColors.reduce((sum, [, count]) => sum + count, 0);
    
    return sortedColors.map(([color, count]) => {
        const [r, g, b] = color.split(',').map(Number);
        const percentage = Math.round((count / top5TotalCount) * 100);
        return {
            hex: rgbToHex(r, g, b),
            rgb: `${r}, ${g}, ${b}`,
            percentage: percentage
        };
    });
}

function displayExtractionResult(colorsWithPercentage, container) {
    container.innerHTML = '';
    
    colorsWithPercentage.forEach(colorData => {
        const item = document.createElement('div');
        item.className = 'extraction-color-item';
        item.innerHTML = `
            <div class="extraction-color-left">
                <div class="extraction-color-square" style="background-color: ${colorData.hex}"></div>
                <div class="extraction-color-info">
                    <div class="extraction-color-code">${colorData.hex}</div>
                    <div class="extraction-color-rgb">RGB: ${colorData.rgb}</div>
                </div>
            </div>
            <div class="extraction-color-right">
                <div class="extraction-percentage-bar">
                    <div class="extraction-percentage-fill" style="width: ${colorData.percentage}%; background-color: ${colorData.hex};"></div>
                </div>
                <div class="extraction-percentage-text">${colorData.percentage}%</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(colorData.hex);
            }
            
            // 토스트 알림 표시
            showCopyToast();
            
            // 시각적 피드백
            const originalBorder = item.style.borderColor;
            item.style.borderColor = 'var(--accent-color)';
            item.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                item.style.borderColor = originalBorder;
                item.style.transform = 'translateY(-2px)';
            }, 200);
        });
        
        container.appendChild(item);
    });
    
    container.style.display = 'flex';
}

// ==================== 개선된 디자인 계산기 ====================

function initDesignCalculator() {
    // 그리드 계산기 이벤트
    const gridInputs = ['calc-max-width', 'calc-columns', 'calc-gutter', 'calc-margin'];
    gridInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateAndVisualizeGrid);
        }
    });
    
    // 폰트 사이즈 계산기 이벤트
    const pxInput = document.getElementById('calc-px-input');
    const ptInput = document.getElementById('calc-pt-input');
    
    if (pxInput) {
        pxInput.addEventListener('input', updateFontSizes);
    }
    
    if (ptInput) {
        ptInput.addEventListener('input', updateFontSizesFromPt);
    }
    
    // 초기 계산 실행
    setTimeout(() => {
        if (document.getElementById('calc-max-width')) {
            calculateAndVisualizeGrid();
        }
        if (document.getElementById('calc-px-input')) {
            updateFontSizes();
        }
         initSizeCalculator();
        initUnitConverter();
    }, 200);
}

function calculateAndVisualizeGrid() {
    const maxWidth = parseInt(document.getElementById('calc-max-width')?.value) || 1280;
    const columns = parseInt(document.getElementById('calc-columns')?.value) || 4;
    const gutter = parseInt(document.getElementById('calc-gutter')?.value) || 0;
    const margin = parseInt(document.getElementById('calc-margin')?.value) || 0;
    
    const totalGutters = (columns - 1) * gutter;
    const totalMargins = margin * 2;
    const availableWidth = maxWidth - totalGutters - totalMargins;
    const columnWidth = Math.floor(availableWidth / columns);
    const actualPageWidth = (columnWidth * columns) + totalGutters + totalMargins;
    
    const pageWidthEl = document.getElementById('calc-page-width');
    const columnWidthEl = document.getElementById('calc-column-width');
    const gutterDisplayEl = document.getElementById('calc-gutter-display');
    const marginDisplayEl = document.getElementById('calc-margin-display');
    
    if (pageWidthEl) pageWidthEl.textContent = `${actualPageWidth}px`;
    if (columnWidthEl) columnWidthEl.textContent = `${columnWidth}px`;
    if (gutterDisplayEl) gutterDisplayEl.textContent = `${gutter}px`;
    if (marginDisplayEl) marginDisplayEl.textContent = `${margin}px`;
    
    visualizeGrid(actualPageWidth, columnWidth, columns, gutter, margin);
}

function visualizeGrid(pageWidth, columnWidth, columns, gutter, margin) {
    const preview = document.getElementById('calc-grid-preview');
    if (!preview) return;
    
    preview.innerHTML = '';
    
    // 부모 컨테이너의 실제 너비 활용
    const previewRect = preview.getBoundingClientRect();
    const availableWidth = previewRect.width - 40; // 여백 최소화
    
    // 스케일 계산을 더 관대하게
    const scale = Math.min(availableWidth / pageWidth, 2); // 최대 2배까지 확대
    const scaledWidth = Math.min(pageWidth * scale, availableWidth); // 사용 가능한 너비 최대 활용
    
    const scaledColumnWidth = columnWidth * scale;
    const scaledGutter = gutter * scale;
    const scaledMargin = margin * scale;
    
    const container = document.createElement('div');
    container.className = 'studio-grid-container';
    
    const baseHeight = window.innerWidth <= 480 ? 100 : window.innerWidth <= 768 ? 120 : 140;
    container.style.height = `${baseHeight}px`;
    container.style.width = `${scaledWidth}px`; // 더 넓게 설정
    container.style.position = 'relative';
    container.style.margin = '0 auto'
    
   // 마진이 0 이하일 때는 표시하지 않음
if (margin > 0) {
    const leftMargin = document.createElement('div');
    leftMargin.className = 'studio-grid-margin left';
    leftMargin.style.width = `${Math.max(scaledMargin, 2)}px`;
    leftMargin.textContent = margin;
    container.appendChild(leftMargin);
    
    const rightMargin = document.createElement('div');
    rightMargin.className = 'studio-grid-margin right';
    rightMargin.style.width = `${Math.max(scaledMargin, 2)}px`;
    rightMargin.textContent = margin;
    container.appendChild(rightMargin);
}
    
// 컬럼 생성
for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'studio-grid-column';
    
    const left = scaledMargin + (i * (scaledColumnWidth + scaledGutter));
    const finalColumnWidth = Math.max(scaledColumnWidth, 4);
    
    column.style.left = `${left}px`;
    column.style.width = `${finalColumnWidth}px`;
    column.textContent = columnWidth;
    
    if (finalColumnWidth < 8) {
        column.style.opacity = '0.6';
        column.style.fontSize = '10px';
    }
    
    container.appendChild(column);
}

// 간격 시각화 추가
for (let i = 0; i < columns - 1; i++) {
    if (gutter > 0 && scaledGutter >= 1) {
        const gutterElement = document.createElement('div');
        gutterElement.className = 'studio-grid-gutter';
        
        // 간격 위치를 더 정확하게 계산
        const gutterLeft = scaledMargin + ((i + 1) * scaledColumnWidth) + (i * scaledGutter);
        gutterElement.style.left = `${gutterLeft}px`;
        gutterElement.style.width = `${Math.max(scaledGutter, 8)}px`;
        gutterElement.textContent = gutter;
        
        container.appendChild(gutterElement);
    }
}

preview.appendChild(container);

}

// 폰트 사이즈 계산 함수들
function convertPxToPt(px) {
    return Math.round((px * 0.75) * 10) / 10;
}

function convertPtToPx(pt) {
    return Math.round((pt / 0.75) * 10) / 10;
}

function updateFontSizes() {
    const pxInput = document.getElementById('calc-px-input');
    const ptInput = document.getElementById('calc-pt-input');
    
    if (!pxInput || !ptInput) return;
    
    const px = parseFloat(pxInput.value) || 16;
    const pt = convertPxToPt(px);
    
    ptInput.value = pt;
    updateResponsiveSizes(px);
    updateSizeGuide(px);
    updateFontPreview(px, pt);
}

function updateFontSizesFromPt() {
    const pxInput = document.getElementById('calc-px-input');
    const ptInput = document.getElementById('calc-pt-input');
    
    if (!pxInput || !ptInput) return;
    
    const pt = parseFloat(ptInput.value) || 12;
    const px = convertPtToPx(pt);
    
    pxInput.value = px;
    updateResponsiveSizes(px);
    updateSizeGuide(px);
    updateFontPreview(px, pt);
}

function updateResponsiveSizes(basePx) {
    const mobile = Math.round((basePx * 0.875) * 10) / 10;
    const tablet = basePx;
    const desktop = Math.round((basePx * 1.125) * 10) / 10;
    
    const mobileEl = document.getElementById('mobile-size');
    const tabletEl = document.getElementById('tablet-size');
    const desktopEl = document.getElementById('desktop-size');
    
    if (mobileEl) mobileEl.textContent = `${mobile}px`;
    if (tabletEl) tabletEl.textContent = `${tablet}px`;
    if (desktopEl) desktopEl.textContent = `${desktop}px`;
}

function updateSizeGuide(basePx) {
    const baseRatio = basePx / 16;
    
    const sizes = {
        body: Math.round(16 * baseRatio),
        subtitle: Math.round(20 * baseRatio),
        title: Math.round(24 * baseRatio),
        heading: Math.round(32 * baseRatio),
        caption: Math.round(14 * baseRatio)
    };
    
    const guideBody = document.getElementById('guide-body');
    const guideSubtitle = document.getElementById('guide-subtitle');
    const guideTitle = document.getElementById('guide-title');
    const guideHeading = document.getElementById('guide-heading');
    const guideCaption = document.getElementById('guide-caption');
    
    if (guideBody) guideBody.textContent = `웹: ${sizes.body}px 인쇄: ${convertPxToPt(sizes.body)}pt`;
    if (guideSubtitle) guideSubtitle.textContent = `웹: ${sizes.subtitle}px 인쇄: ${convertPxToPt(sizes.subtitle)}pt`;
    if (guideTitle) guideTitle.textContent = `웹: ${sizes.title}px 인쇄: ${convertPxToPt(sizes.title)}pt`;
    if (guideHeading) guideHeading.textContent = `웹: ${sizes.heading}px 인쇄: ${convertPxToPt(sizes.heading)}pt`;
    if (guideCaption) guideCaption.textContent = `웹: ${sizes.caption}px 인쇄: ${convertPxToPt(sizes.caption)}pt`;
}

function updateFontPreview(px, pt) {
    const preview = document.getElementById('font-preview-text');
    if (preview) {
        preview.style.fontSize = `${px}px`;
        preview.textContent = `이 텍스트는 ${px}px(${pt}pt) 크기입니다`;
    }
}

// ==================== 새로운 사이즈 계산기 기능 ====================

function initSizeCalculator() {
    // 비율 계산기 이벤트 리스너
    const ratioWidthInput = document.getElementById('ratio-width');
    const ratioHeightInput = document.getElementById('ratio-height');
    
    if (ratioWidthInput) {
        ratioWidthInput.addEventListener('input', calculateRatioResolutions);
    }
    if (ratioHeightInput) {
        ratioHeightInput.addEventListener('input', calculateRatioResolutions);
    }
    
    // 커스텀 사이즈 변환 이벤트 리스너
    const originalWidthInput = document.getElementById('original-width');
    const originalHeightInput = document.getElementById('original-height');
    const targetRatioWidthInput = document.getElementById('target-ratio-width');
    const targetRatioHeightInput = document.getElementById('target-ratio-height');
    
    const customInputs = [originalWidthInput, originalHeightInput, targetRatioWidthInput, targetRatioHeightInput];
    customInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateCustomSizeConversion);
        }
    });
    
    // 초기 계산 실행
    setTimeout(() => {
        calculateRatioResolutions();
    }, 100);
}

function calculateRatioResolutions() {
    const ratioWidth = parseFloat(document.getElementById('ratio-width')?.value) || 16;
    const ratioHeight = parseFloat(document.getElementById('ratio-height')?.value) || 9;
    
    // 기준 해상도들
    const baseResolutions = {
        '4k': 3840,
        'fhd': 1920,
        'hd': 1280,
        'sd': 854
    };
    
    // 비율에 맞춰 높이 계산
    Object.keys(baseResolutions).forEach(key => {
        const width = baseResolutions[key];
        const height = Math.round((width * ratioHeight) / ratioWidth);
        
        const resultElement = document.getElementById(`ratio-${key}`);
        if (resultElement) {
            resultElement.textContent = `${width}×${height}`;
        }
    });
}

function calculateCustomSizeConversion() {
    const originalWidth = parseFloat(document.getElementById('original-width')?.value);
    const originalHeight = parseFloat(document.getElementById('original-height')?.value);
    const targetRatioWidth = parseFloat(document.getElementById('target-ratio-width')?.value);
    const targetRatioHeight = parseFloat(document.getElementById('target-ratio-height')?.value);
    
    const cropResult = document.getElementById('crop-result');
    const fitResult = document.getElementById('fit-result');
    
    // 입력값이 모두 있는지 확인
    if (!originalWidth || !originalHeight || !targetRatioWidth || !targetRatioHeight) {
        if (cropResult) cropResult.textContent = '-';
        if (fitResult) fitResult.textContent = '-';
        return;
    }
    
    // 현재 비율과 목표 비율 계산
    const currentRatio = originalWidth / originalHeight;
    const targetRatio = targetRatioWidth / targetRatioHeight;
    
    let cropWidth, cropHeight, fitWidth, fitHeight;
    
    if (currentRatio > targetRatio) {
        // 현재가 더 가로로 긴 경우
        // 크롭: 높이 기준으로 가로를 줄임
        cropHeight = originalHeight;
        cropWidth = Math.round(originalHeight * targetRatio);
        
        // 핏: 가로 기준으로 높이를 늘림
        fitWidth = originalWidth;
        fitHeight = Math.round(originalWidth / targetRatio);
    } else {
        // 현재가 더 세로로 긴 경우
        // 크롭: 가로 기준으로 세로를 줄임
        cropWidth = originalWidth;
        cropHeight = Math.round(originalWidth / targetRatio);
        
        // 핏: 세로 기준으로 가로를 늘림
        fitHeight = originalHeight;
        fitWidth = Math.round(originalHeight * targetRatio);
    }
    
    // 결과 표시
    if (cropResult) {
        cropResult.textContent = `${cropWidth}×${cropHeight}`;
    }
    if (fitResult) {
        fitResult.textContent = `${fitWidth}×${fitHeight}`;
    }
}

// ==================== 새로운 단위 변환기 기능 ====================

function initUnitConverter() {
    // 단위 변환 상수 (96 DPI 기준)
    const CONVERSION_RATES = {
        // 모든 단위를 px 기준으로 변환
        px: 1,
        pt: 96 / 72,        // 1pt = 96/72 px (96 DPI 기준)
        mm: 96 / 25.4,      // 1mm = 96/25.4 px (96 DPI 기준)
        cm: 96 / 2.54,      // 1cm = 96/2.54 px (96 DPI 기준)
        inch: 96            // 1inch = 96px (96 DPI 기준)
    };
    
    // 라디오 버튼 이벤트 리스너
    const baseUnitRadios = document.querySelectorAll('input[name="base-unit"]');
    const targetUnitRadios = document.querySelectorAll('input[name="target-unit"]');
    
    baseUnitRadios.forEach(radio => {
        radio.addEventListener('change', updateUnitLabels);
    });
    
    targetUnitRadios.forEach(radio => {
        radio.addEventListener('change', updateUnitLabels);
    });
    
    // 입력 필드 이벤트 리스너
    const baseInput = document.getElementById('base-unit-input');
    const targetInput = document.getElementById('target-unit-input');
    
    if (baseInput) {
        baseInput.addEventListener('input', () => convertFromBase());
    }
    
    if (targetInput) {
        targetInput.addEventListener('input', () => convertFromTarget());
    }
    
    // 초기 라벨 설정
    updateUnitLabels();
}

function updateUnitLabels() {
    const baseUnit = document.querySelector('input[name="base-unit"]:checked')?.value || 'px';
    const targetUnit = document.querySelector('input[name="target-unit"]:checked')?.value || 'mm';
    
    // 단위 이름 맵핑
    const unitNames = {
        px: '픽셀 (px)',
        pt: '포인트 (pt)',
        mm: '밀리미터 (mm)',
        cm: '센티미터 (cm)',
        inch: '인치 (inch)'
    };
    
    // 라벨과 심볼 업데이트
    const baseLabel = document.getElementById('base-unit-label');
    const targetLabel = document.getElementById('target-unit-label');
    const baseSymbol = document.getElementById('base-unit-symbol');
    const targetSymbol = document.getElementById('target-unit-symbol');
    
    if (baseLabel) baseLabel.textContent = unitNames[baseUnit];
    if (targetLabel) targetLabel.textContent = unitNames[targetUnit];
    if (baseSymbol) baseSymbol.textContent = baseUnit;
    if (targetSymbol) targetSymbol.textContent = targetUnit;
    
    // 현재 값이 있으면 변환 실행
    const baseInput = document.getElementById('base-unit-input');
    if (baseInput && baseInput.value) {
        convertFromBase();
    }
}

function convertFromBase() {
    const baseUnit = document.querySelector('input[name="base-unit"]:checked')?.value || 'px';
    const targetUnit = document.querySelector('input[name="target-unit"]:checked')?.value || 'mm';
    const baseValue = parseFloat(document.getElementById('base-unit-input')?.value);
    
    if (isNaN(baseValue) || baseValue === '') {
        document.getElementById('target-unit-input').value = '';
        return;
    }
    
    const convertedValue = convertUnits(baseValue, baseUnit, targetUnit);
    document.getElementById('target-unit-input').value = formatConversionResult(convertedValue);
}

function convertFromTarget() {
    const baseUnit = document.querySelector('input[name="base-unit"]:checked')?.value || 'px';
    const targetUnit = document.querySelector('input[name="target-unit"]:checked')?.value || 'mm';
    const targetValue = parseFloat(document.getElementById('target-unit-input')?.value);
    
    if (isNaN(targetValue) || targetValue === '') {
        document.getElementById('base-unit-input').value = '';
        return;
    }
    
    const convertedValue = convertUnits(targetValue, targetUnit, baseUnit);
    document.getElementById('base-unit-input').value = formatConversionResult(convertedValue);
}

function convertUnits(value, fromUnit, toUnit) {
    const CONVERSION_RATES = {
        px: 1,
        pt: 96 / 72,
        mm: 96 / 25.4,
        cm: 96 / 2.54,
        inch: 96
    };
    
    // 먼저 px로 변환한 다음 목표 단위로 변환
    const pxValue = value * CONVERSION_RATES[fromUnit];
    const result = pxValue / CONVERSION_RATES[toUnit];
    
    return result;
}

function formatConversionResult(value) {
    // 소수점 3자리까지 표시하되, 불필요한 0은 제거
    return parseFloat(value.toFixed(3)).toString();
}

// ==================== 색상 변환 유틸리티 함수들 ====================

function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

function hexToRgbValues(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ==================== 팔레트 생성 함수들 ====================

function generateMonochrome(hsl) {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        const lightness = 20 + (i * 20);
        colors.push(hslToHex(hsl[0], hsl[1], lightness));
    }
    return colors;
}

function generateAnalogous(hsl) {
    const colors = [];
    for (let i = -2; i <= 2; i++) {
        const hue = (hsl[0] + i * 30) % 360;
        colors.push(hslToHex(hue, hsl[1], hsl[2]));
    }
    return colors;
}

function generateComplementary(hsl) {
    const colors = [];
    colors.push(hslToHex(hsl[0], hsl[1], hsl[2]));
    colors.push(hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]));
    colors.push(hslToHex(hsl[0], hsl[1] * 0.7, hsl[2] * 1.2));
    colors.push(hslToHex((hsl[0] + 180) % 360, hsl[1] * 0.7, hsl[2] * 1.2));
    colors.push(hslToHex(hsl[0], hsl[1] * 0.5, hsl[2] * 0.8));
    return colors;
}

function generateTriadic(hsl) {
    const colors = [];
    colors.push(hslToHex(hsl[0], hsl[1], hsl[2]));
    colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]));
    colors.push(hslToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]));
    colors.push(hslToHex(hsl[0], hsl[1] * 0.6, hsl[2] * 1.1));
    colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1] * 0.6, hsl[2] * 1.1));
    return colors;
}

function generateRandomPalette(baseHsl, count) {
    const colors = [];
    const [baseH, baseS, baseL] = baseHsl;
    
    for (let i = 0; i < count; i++) {
        const hueShift = (Math.random() - 0.5) * 60; // ±30도 범위
        const satShift = (Math.random() - 0.5) * 40; // ±20% 범위
        const litShift = (Math.random() - 0.5) * 40; // ±20% 범위
        
        const h = (baseH + hueShift + 360) % 360;
        const s = Math.max(20, Math.min(100, baseS + satShift));
        const l = Math.max(20, Math.min(80, baseL + litShift));
        
        colors.push(hslToHex(h, s, l));
    }
    
    return colors;
}

function generateRandomGradient(baseHsl, count) {
    const colors = [];
    const [baseH, baseS, baseL] = baseHsl;
    
    // 시작 색상
    colors.push(hslToHex(baseH, baseS, baseL));
    
    // 끝 색상 (보색 또는 유사색)
    const endHueShift = Math.random() > 0.5 ? 180 : 60 + Math.random() * 60;
    const endH = (baseH + endHueShift) % 360;
    const endS = Math.max(30, Math.min(100, baseS + (Math.random() - 0.5) * 40));
    const endL = Math.max(20, Math.min(80, baseL + (Math.random() - 0.5) * 40));
    
    if (count === 2) {
        colors.push(hslToHex(endH, endS, endL));
    } else {
        // 중간 색상 생성
        const midH = (baseH + endH) / 2;
        const midS = (baseS + endS) / 2;
        const midL = (baseL + endL) / 2;
        
        colors.push(hslToHex(midH, midS, midL));
        colors.push(hslToHex(endH, endS, endL));
    }
    
    return colors;
}

function displayColors(colors, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    const colorItemsContainer = document.createElement('div');
    colorItemsContainer.className = 'studio-color-items-row';
    
    colors.forEach(color => {
        const item = document.createElement('div');
        item.className = 'studio-color-item';
        item.innerHTML = `
            <div class="studio-color-preview" style="background-color: ${color}"></div>
            <div class="studio-color-info">
                <div class="studio-color-code">${color}</div>
                <div class="studio-color-code">RGB: ${hexToRgb(color)}</div>
            </div>
        `;
        item.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(color);
            }
            
            // 토스트 알림 표시
            showCopyToast();
            
            // 시각적 피드백
            const originalBorder = item.style.borderColor;
            item.style.borderColor = 'var(--accent-color)';
            item.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                item.style.borderColor = originalBorder;
                item.style.transform = 'translateY(-3px)';
            }, 200);
        });
        colorItemsContainer.appendChild(item);
    });
    
    container.appendChild(colorItemsContainer);
}

// ==================== 카드 이미지 저장 기능 ====================

// html2canvas 라이브러리 동적 로딩
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (typeof html2canvas !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
    });
}

// 일별 카운트 관리
function getTodayCount() {
    const today = new Date();
    const dateKey = `${today.getFullYear().toString().slice(-2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    const savedData = localStorage.getItem('nfp-card-count');
    let countData = {};
    
    if (savedData) {
        countData = JSON.parse(savedData);
    }
    
    // 오늘 날짜의 카운트가 없으면 1부터 시작
    if (!countData[dateKey]) {
        countData[dateKey] = 0;
    }
    
    // 카운트 증가
    countData[dateKey]++;
    
    // 30일 이전 데이터는 정리 (저장소 용량 관리)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cleanupDate = `${thirtyDaysAgo.getFullYear().toString().slice(-2)}${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`;
    
    Object.keys(countData).forEach(date => {
        if (date < cleanupDate) {
            delete countData[date];
        }
    });
    
    // 저장
    localStorage.setItem('nfp-card-count', JSON.stringify(countData));
    
    return {
        date: dateKey,
        count: countData[dateKey]
    };
}

// 캔버스에 NFP DESIGN 로고 그리기 (상단 중앙 배치)
function drawLogo(canvas, ctx) {
    // 로고를 상단 중앙에 배치
    const logoY = 80;  // 상단에서 80px 아래
    
    // 텍스트 설정
    ctx.font = '900 48px Pretendard, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // 텍스트 너비 측정
    const nfpText = 'NFP';
    const designText = ' DESIGN';
    const nfpWidth = ctx.measureText(nfpText).width;
    const designWidth = ctx.measureText(designText).width;
    const totalWidth = nfpWidth + designWidth;
    
    // 전체 텍스트를 화면 중앙에 배치
    const logoX = (canvas.width - totalWidth) / 2;
    
    
    // NFP 부분 (녹색)
    ctx.fillStyle = '#01FF75';
    ctx.fillText(nfpText, logoX, logoY);
    
    // DESIGN 부분 (흰색)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(designText, logoX + nfpWidth, logoY);
}

// 색상 코드에서 # 제거
function cleanColorCode(colorCode) {
    return colorCode.replace('#', '');
}

// 단색 카드 저장
async function saveSingleCard() {
    if (!currentColor) {
        alert('저장할 카드가 없습니다. 먼저 카드를 뽑아주세요.');
        return;
    }
    
    try {
        // html2canvas 로드
        await loadHtml2Canvas();
        
        // 카드 요소 캡처
        const cardElement = document.getElementById('single-card-element');
        const cardCanvas = await html2canvas(cardElement, {
            scale: 2,  // 2배 해상도
            backgroundColor: null,  // 투명 배경
            useCORS: true
        });
        
        // 최종 캔버스 생성 (640×1000) - 높이 다시 줄임
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        finalCanvas.width = 640;
        finalCanvas.height = 1000;
        
        // 검은 배경
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 640, 1000);
        
        // NFP DESIGN 로고 그리기 (상단 중앙)
        drawLogo(finalCanvas, ctx);
        
        // 카드 75% 크기로 축소하여 중앙 배치
        const scaledWidth = cardCanvas.width * 0.75;
        const scaledHeight = cardCanvas.height * 0.75;
        const cardX = (640 - scaledWidth) / 2;  // 중앙 정렬
        const cardY = 150;  // 로고 아래 여백
        
        // 카드 그리기
        ctx.drawImage(cardCanvas, 0, 0, cardCanvas.width, cardCanvas.height, 
                     cardX, cardY, scaledWidth, scaledHeight);
        
        // 파일명 생성
        const countInfo = getTodayCount();
        const colorCode = cleanColorCode(currentColor.hex);
        const fileName = `nfpdesign_${colorCode}_${countInfo.date}_${countInfo.count}.jpg`;
        
        // JPG로 변환 및 다운로드
        finalCanvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            // 성공 피드백
            showSaveSuccessToast(fileName);
        }, 'image/jpeg', 0.9);
        
    } catch (error) {
        console.error('카드 저장 실패:', error);
        alert('카드 저장 중 오류가 발생했습니다.');
    }
}

// 그라데이션 카드 저장
async function saveGradientCard() {
    if (!gradientCurrentColor) {
        alert('저장할 카드가 없습니다. 먼저 카드를 뽑아주세요.');
        return;
    }
    
    try {
        // html2canvas 로드
        await loadHtml2Canvas();
        
        // 카드 요소 캡처
        const cardElement = document.getElementById('gradient-card-element');
        const cardCanvas = await html2canvas(cardElement, {
            scale: 2,  // 2배 해상도
            backgroundColor: null,  // 투명 배경
            useCORS: true
        });
        
        // 최종 캔버스 생성 (640×1000) - 높이 다시 줄임
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        finalCanvas.width = 640;
        finalCanvas.height = 1000;
        
        // 검은 배경
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 640, 1000);
        
        // NFP DESIGN 로고 그리기 (상단 중앙) - 파라미터 제거
        drawLogo(finalCanvas, ctx);

        
        
        // 카드 75% 크기로 축소하여 중앙 배치
        const scaledWidth = cardCanvas.width * 0.75;
        const scaledHeight = cardCanvas.height * 0.75;
        const cardX = (640 - scaledWidth) / 2;  // 중앙 정렬
        const cardY = 150;  // 로고 아래 여백
        ctx.drawImage(cardCanvas, 0, 0, cardCanvas.width, cardCanvas.height, 
                     cardX, cardY, scaledWidth, scaledHeight);
        
        // 파일명 생성 (그라데이션은 GRADIENT로 표시)
        const countInfo = getTodayCount();
        const fileName = `nfpdesign_GRADIENT_${countInfo.date}_${countInfo.count}.jpg`;
        
        // JPG로 변환 및 다운로드
        finalCanvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            
            // 성공 피드백
            showSaveSuccessToast(fileName);
        }, 'image/jpeg', 0.9);
        
    } catch (error) {
        console.error('카드 저장 실패:', error);
        alert('카드 저장 중 오류가 발생했습니다.');
    }
}

// 저장 성공 토스트 메시지
function showSaveSuccessToast(fileName) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.save-success-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'save-success-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> 카드가 저장되었습니다!<br><small>${fileName}</small>`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #01ff75, #00e066);
        color: black;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        animation: saveToastShow 0.3s ease;
        text-align: center;
        box-shadow: 0 8px 25px rgba(1, 255, 117, 0.4);
    `;
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#save-toast-style')) {
        const style = document.createElement('style');
        style.id = 'save-toast-style';
        style.textContent = `
            @keyframes saveToastShow {
                from { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.8); }
                to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
            .save-success-toast small {
                opacity: 0.8;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'saveToastShow 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// 기존 initColorGenerator 함수에 이벤트 리스너 추가
function initCardSaveFeature() {
    // 단색 카드 저장 버튼
    const singleSaveBtn = document.getElementById('single-save-btn');
    if (singleSaveBtn) {
        singleSaveBtn.addEventListener('click', saveSingleCard);
    }
    
    // 그라데이션 카드 저장 버튼
    const gradientSaveBtn = document.getElementById('gradient-save-btn');
    if (gradientSaveBtn) {
        gradientSaveBtn.addEventListener('click', saveGradientCard);
    }
}

// 전역 함수로 등록 (HTML onclick용)
window.saveSingleCard = saveSingleCard;
window.saveGradientCard = saveGradientCard;

// ==================== 메인 초기화 ====================

document.addEventListener('DOMContentLoaded', function() {
    // Studio 기본 기능 초기화
    initStudio();
    
    // QRious 라이브러리 로드 시도
    loadQRLibrary().then(() => {
        // QR 라이브러리 로드 완료
    }).catch(() => {
        // QR 라이브러리 로드 실패 시 무시
    });
});