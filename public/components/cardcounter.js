/* =========================================================
   Card Counter (Firebase Firestore) - Drop-in Safe Version
   - 기존 통합 페이지 & 분리된 단색/그라데이션 페이지 모두 지원
   - 전역 API 유지: initializeCardCounter, createCardCounterDisplay, onCardDrawn
   - 스타일 중복 주입 방지: ensureCardCounterStyles()
   ========================================================= */

(function () {
  /* -----------------------------
     0) Utility: style once-inject
     ----------------------------- */
  function ensureCardCounterStyles() {
    if (document.getElementById('card-counter-styles')) return; // already injected
    const style = document.createElement('style');
    style.id = 'card-counter-styles';
    style.textContent = `
      .card-counter-display {
        background: rgba(1, 255, 117, 0.08);
        border: 2px solid rgba(1, 255, 117, 0.2);
        border-radius: 4px;
        padding: 16px 20px;
        margin: 20px auto;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        max-width: 400px;
      }
      .card-counter-display:hover {
        background: rgba(1, 255, 117, 0.12);
        border-color: rgba(1, 255, 117, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(1, 255, 117, 0.15);
      }
      .card-counter-header {
        display: flex; align-items: center; justify-content: center;
        gap: 8px; font-size: 15px; font-weight: 600;
        margin-bottom: 16px; padding-bottom: 12px;
        border-bottom: 1px solid rgba(1, 255, 117, 0.2);
      }
      .card-counter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
      .card-counter-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
      .counter-icon { display:flex; align-items:center; justify-content:center; width:20px; font-size:14px; color: var(--accent-color); }
      .counter-icon.special { color:#FFD700; text-shadow:0 0 8px rgba(255,215,0,.6); }
      .counter-icon.dark { color:#8A2BE2; text-shadow:0 0 8px rgba(138,43,226,.6); }
      .counter-text { color: var(--text-color); font-weight:500; white-space: nowrap; }
      .counter-text span { color: var(--accent-color); font-weight:700; font-size:14px; }
      .card-counter-header .counter-text span { font-size:16px; }

      @media (max-width:768px){
        .card-counter-display{font-size:11px; padding:12px 16px; max-width:100%; width:calc(100% - 32px);}
        .card-counter-header{font-size:13px; margin-bottom:12px; padding-bottom:8px;}
        .card-counter-grid{gap:8px 12px;} .card-counter-item{font-size:11px;}
        .counter-icon{font-size:11px; width:16px;} .counter-text span{font-size:12px;}
        .card-counter-header .counter-text span{font-size:14px;}
      }
      @media (max-width:480px){
        .card-counter-display{padding:10px 14px; width:calc(100% - 28px); margin:14px auto; font-size:10px;}
        .card-counter-header{font-size:12px; margin-bottom:10px; padding-bottom:6px;}
        .card-counter-grid{gap:6px 10px;} .card-counter-item{font-size:10px;}
        .counter-icon{font-size:10px; width:14px;} .counter-text{font-size:10px;} .counter-text span{font-size:11px;}
        .card-counter-header .counter-text span{font-size:13px;}
      }
    `;
    document.head.appendChild(style);
  }

  /* -------------------------------------------------
     1) FirebaseCardCounter (원본 로직 그대로 유지)
     ------------------------------------------------- */
  class FirebaseCardCounter {
    constructor() {
      this.db = window.firebaseDB;
      this.firestoreUtils = window.firestoreUtils;
      this.waitForFirebase();
    }

    async waitForFirebase() {
      let attempts = 0;
      while (!this.db && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.db = window.firebaseDB;
        this.firestoreUtils = window.firestoreUtils;
        attempts++;
      }
      if (!this.db) {
        console.error('Firebase가 로드되지 않았습니다.');
        return false;
      }
      return true;
    }

    // 카운터 문서 참조
    getCardCounterRef(type) {
      const { doc } = this.firestoreUtils;
      return doc(this.db, 'card_draws', type);
    }

    // Firebase에서 현재 카운트 조회
    async getCurrentCountFromFirebase() {
      try {
        const { getDoc } = this.firestoreUtils;

        const counters = {
          single: 0,           // 단색 카드
          gradient: 0,         // 그라데이션 카드
          single_special: 0,   // 단색 스페셜
          gradient_special: 0, // 그라데이션 스페셜
          single_dark: 0,      // 단색 다크 스페셜
          gradient_dark: 0,    // 그라데이션 다크 스페셜
          total: 0             // 전체
        };

        for (const type of Object.keys(counters)) {
          const ref = this.getCardCounterRef(type);
          const snap = await getDoc(ref);
          counters[type] = snap.exists() ? snap.data().count || 0 : 0;
        }
        return counters;
      } catch (error) {
        console.error('Firebase에서 카드 카운터 조회 실패:', error);
        return {
          single: 0, gradient: 0, single_special: 0,
          gradient_special: 0, single_dark: 0, gradient_dark: 0, total: 0
        };
      }
    }

    // Firebase에 카드 카운트 업데이트
    async updateCardCountInFirebase(cardType, cardData) {
      try {
        const { getDoc, setDoc, updateDoc, increment } = this.firestoreUtils;

        // 기본 타입 증가
        await this.incrementCounter(cardType);

        // 스페셜/다크 처리
        if (cardData !== null && cardData !== undefined) {
          if (cardData.isDarkSpecial === true || cardData.isSpecial === 'dark' || cardData.specialType === 'dark') {
            await this.incrementCounter(`${cardType}_dark`);
          } else if (cardData.isSpecial === true || cardData.isSpecial === 'special' || cardData.specialType === 'special') {
            await this.incrementCounter(`${cardType}_special`);
          } else if (typeof cardData === 'string') {
            const s = cardData;
            if (s.includes('dark') || s.includes('Dark')) {
              await this.incrementCounter(`${cardType}_dark`);
            } else if (s.includes('special') || s.includes('Special')) {
              await this.incrementCounter(`${cardType}_special`);
            }
          }
        }

        // 전체 합계
        await this.incrementCounter('total');

        const updatedCounts = await this.getCurrentCountFromFirebase();
        return updatedCounts;
      } catch (error) {
        console.error('Firebase 카드 카운터 업데이트 실패:', error);
        return {
          single: 0, gradient: 0, single_special: 0,
          gradient_special: 0, single_dark: 0, gradient_dark: 0, total: 0
        };
      }
    }

    // 카운터 증가 helper
    async incrementCounter(type) {
      const { getDoc, setDoc, updateDoc, increment } = this.firestoreUtils;
      const ref = this.getCardCounterRef(type);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { count: increment(1), lastUpdated: new Date() });
      } else {
        await setDoc(ref, { count: 1, type, lastUpdated: new Date() });
      }
    }

    // 메인 호출
    async drawCard(cardType, cardData = null) {
      const ok = await this.waitForFirebase();
      if (ok) return await this.updateCardCountInFirebase(cardType, cardData);
      return {
        single: 0, gradient: 0, single_special: 0,
        gradient_special: 0, single_dark: 0, gradient_dark: 0, total: 0
      };
    }

    // 현재 카운트 조회
    async getCurrentCount() {
      const ok = await this.waitForFirebase();
      if (ok) return await this.getCurrentCountFromFirebase();
      return {
        single: 0, gradient: 0, single_special: 0,
        gradient_special: 0, single_dark: 0, gradient_dark: 0, total: 0
      };
    }
  }

  /* -------------------------------------------------
     2) 카운터 UI (공통 CSS / HTML, 이름 불변)
     ------------------------------------------------- */
  function createCardCounterDisplay() {
    ensureCardCounterStyles();

    const singleCardHTML = `
      <div class="card-counter-display">
        <div class="card-counter-header">
          <span class="counter-icon"><i class="fas fa-chart-bar"></i></span>
          <span class="counter-text">누적 통계: <span id="total-card-count">-</span>회</span>
        </div>
        <div class="card-counter-grid">
          <div class="card-counter-item">
            <span class="counter-icon"><i class="fas fa-square"></i></span>
            <span class="counter-text">단색 카드: <span id="single-card-count">-</span>회</span>
          </div>
          <div class="card-counter-item">
            <span class="counter-icon"><i class="fas fa-dice"></i></span>
            <span class="counter-text">총뽑기 횟수: <span id="draw-count">-</span>회</span>
          </div>
          <div class="card-counter-item">
            <span class="counter-icon special"><i class="fas fa-star"></i></span>
            <span class="counter-text">스페셜 카드: <span id="single-special-count">-</span>회</span>
          </div>
          <div class="card-counter-item">
            <span class="counter-icon dark"><i class="fas fa-moon"></i></span>
            <span class="counter-text">다크 스페셜 카드: <span id="single-dark-count">-</span>회</span>
          </div>
        </div>
      </div>
    `;

    const gradientCardHTML = `
      <div class="card-counter-display">
        <div class="card-counter-header">
          <span class="counter-icon"><i class="fas fa-chart-bar"></i></span>
          <span class="counter-text">누적 통계: <span id="total-card-count-gradient">-</span>회</span>
        </div>
        <div class="card-counter-grid">
          <div class="card-counter-item">
            <span class="counter-icon"><i class="fas fa-square"></i></span>
            <span class="counter-text">그라데이션 카드: <span id="gradient-card-count">-</span>회</span>
          </div>
          <div class="card-counter-item">
            <span class="counter-icon"><i class="fas fa-dice"></i></span>
            <span class="counter-text">총뽑기 횟수: <span id="draw-count-gradient">-</span>회</span>
          </div>
          <div class="card-counter-item">
            <span class="counter-icon special"><i class="fas fa-star"></i></span>
            <span class="counter-text">스페셜 카드: <span id="gradient-special-count">-</span>회</span>
          </div>
          <div class="card-counter-item">
            <span class="counter-icon dark"><i class="fas fa-moon"></i></span>
            <span class="counter-text">다크 스페셜 카드: <span id="gradient-dark-count">-</span>회</span>
          </div>
        </div>
      </div>
    `;

    return { singleCard: singleCardHTML, gradientCard: gradientCardHTML };
  }

  /* -------------------------------------------------
     3) 표시 업데이트 / 공개 API
     ------------------------------------------------- */
  function updateCardCounterDisplay(counts) {
    // 타입별 총 뽑기
    const singleTotalDraws = counts.single + counts.single_special + counts.single_dark;
    const gradientTotalDraws = counts.gradient + counts.gradient_special + counts.gradient_dark;

    // 단색
    const singleCountEl = document.getElementById('single-card-count');
    if (singleCountEl) singleCountEl.textContent = counts.single.toLocaleString();
    const singleSpecialEl = document.getElementById('single-special-count');
    if (singleSpecialEl) singleSpecialEl.textContent = counts.single_special.toLocaleString();
    const singleDarkEl = document.getElementById('single-dark-count');
    if (singleDarkEl) singleDarkEl.textContent = counts.single_dark.toLocaleString();
    const drawCountEl1 = document.getElementById('draw-count');
    if (drawCountEl1) drawCountEl1.textContent = singleTotalDraws.toLocaleString();
    const totalCountEl1 = document.getElementById('total-card-count');
    if (totalCountEl1) totalCountEl1.textContent = counts.total.toLocaleString();

    // 그라데이션
    const gradientCountEl = document.getElementById('gradient-card-count');
    if (gradientCountEl) gradientCountEl.textContent = counts.gradient.toLocaleString();
    const gradientSpecialEl = document.getElementById('gradient-special-count');
    if (gradientSpecialEl) gradientSpecialEl.textContent = counts.gradient_special.toLocaleString();
    const gradientDarkEl = document.getElementById('gradient-dark-count');
    if (gradientDarkEl) gradientDarkEl.textContent = counts.gradient_dark.toLocaleString();
    const drawCountEl2 = document.getElementById('draw-count-gradient');
    if (drawCountEl2) drawCountEl2.textContent = gradientTotalDraws.toLocaleString();
    const totalCountEl2 = document.getElementById('total-card-count-gradient');
    if (totalCountEl2) totalCountEl2.textContent = counts.total.toLocaleString();
  }

  async function onCardDrawn(cardType, cardData = null) {
    if (!window.cardCounter) {
      console.error('window.cardCounter가 없습니다.');
      return;
    }
    try {
      const updated = await window.cardCounter.drawCard(cardType, cardData);
      updateCardCounterDisplay(updated);
    } catch (e) {
      console.error('카드 카운트 업데이트 실패:', e);
    }
  }

  async function initializeCardCounter() {
    window.cardCounter = new FirebaseCardCounter();
    try {
      const counts = await window.cardCounter.getCurrentCount();
      updateCardCounterDisplay(counts);
    } catch (e) {
      console.error('카드 카운터 초기화 실패:', e);
    }
  }

  /* -------------------------------------------------
     4) (선택) 자동 이벤트 훅 - 통합 페이지 호환
        - 통합 페이지가 custom event를 쏘면 여기서도 수신
     ------------------------------------------------- */
  window.addEventListener('single-card-drawn', (e) => {
    // e.detail: { isSpecial?:true|false, specialType?:"special"|"dark", isDarkSpecial?:true|false }
    onCardDrawn('single', e.detail || null);
  });
  window.addEventListener('gradient-card-drawn', (e) => {
    onCardDrawn('gradient', e.detail || null);
  });

  /* -------------------------------------------------
     5) 전역 노출 (API 이름 그대로 유지)
     ------------------------------------------------- */
  window.initializeCardCounter = initializeCardCounter;
  window.createCardCounterDisplay = createCardCounterDisplay;
  window.onCardDrawn = onCardDrawn;

})();
